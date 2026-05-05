# TECH SPEC — REVYX APS Engine
<!-- TECH_SPEC_REVYX_aps-engine_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Solution Architect + Data Science Lead | ★ Spec inițială APS Engine — Phase 2: APS = 0.35·CR + 0.25·RT + 0.20·DCR + 0.20·CS (BRD §7.7) cu toate componentele reale (CR, RT din ACTIVITY, DCR din deals_won, CS din NPS). Exit BR-11 fallback la 5+ deals SAU 30+ zile. Explainability dashboard agent. Trigger event-driven post-WON, NPS_SUBMITTED, deal_count_total change. |

---

## Cuprins

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Stack & Dependencies](#3-stack--dependencies)
4. [Data Model](#4-data-model)
5. [API Contracts](#5-api-contracts)
6. [Algorithms](#6-algorithms)
7. [State Machines](#7-state-machines)
8. [Concurrency](#8-concurrency)
9. [Caching](#9-caching)
10. [Background Jobs](#10-background-jobs)
11. [Error Handling](#11-error-handling)
12. [Security](#12-security)
13. [Observability](#13-observability)
14. [Performance Budgets](#14-performance-budgets)
15. [Testing Strategy](#15-testing-strategy)
16. [Deployment](#16-deployment)
17. [Migration Strategy](#17-migration-strategy)
18. [Risks & Mitigations](#18-risks--mitigations)
19. [Impact Assessment](#19-impact-assessment)

---

## 1. Executive Summary

★ APS Engine este componenta Phase 2 a Pilonului 07 (Performance Intelligence) care implementează formula completă **APS = 0.35·CR + 0.25·RT + 0.20·DCR + 0.20·CS** (BRD §7.7). În Phase 1, APS era **fallback constant 0.65** (BR-11) folosit ca multiplicator în DP. Phase 2 calculează componente reale rolling 90 zile și expune **explainability dashboard** per agent. Triggers event-driven: deal WON (DCR), NPS submitted (CS), activity (RT), lead status change (CR).

| Atribut | Valoare |
|---|---|
| **Scope** | APS rolling 90 zile · CR/RT/DCR/CS reale · BR-11 exit gating · explainability · cascade DP · admin tunable weights |
| **Referință BRD** | §5 Pilon 07 · §7.7 APS · §6.1 BR-11 |
| **Phase** | 2 |
| **Owner tehnic** | Solution Architect + Data Science Lead |
| **Dependențe upstream** | lead-scoring v1 (lead.status=WON/LOST/QUALIFIED · response_time_seconds din ACTIVITY) · deal-closure v1 (deals_won + NPS) · offer-engine v1 (DCR contributor) · ACTIVITY · concurrency-hardening v1 |
| **Dependențe downstream** | Match Engine v1/v2 (DP via APS) · Task Allocator (max 3 active per agent) |

**Garanții (în plus față de v1):**

1. APS ∈ [0,1] cu clamp explicit, formă identică cu BRD §7.7.
2. **BR-11 exit gating**: `aps` se folosește **doar** dacă `deal_count_total ≥ 5` ȘI tenure `≥ 30 zile`. Sub prag → APS_default=0.65 (compatibil cu match-engine v1 §6.4).
3. Recalc event-driven la (a) deal WON, (b) NPS submitted, (c) activity insert message_received cu `response_time_seconds`, (d) lead.status WON/LOST.
4. Window rolling 90 zile cu re-calc forțat orar pentru "shift" la limita window-ului.
5. Explainability snapshot persistent în `aps_calculation_snapshot` (similar IS).
6. Tunable weights per tenant (admin) cu validare `sum=1.00` și bounds individual.
7. Trust pe metrici: dacă <30 ACTIVITY pentru calc RT → fallback RT=0.65 (mid).

---

## 2. Architecture Overview

```mermaid
flowchart LR
  EV1[deal.won] --> APS[APS Engine]
  EV2[nps.submitted] --> APS
  EV3[activity.created<br/>message_received cu response_time] --> APS
  EV4[lead.status_changed<br/>WON/LOST/QUALIFIED] --> APS

  APS --> AGG[Components Aggregator<br/>CR · RT · DCR · CS]
  AGG --> CALC[APS Calculator]
  CALC --> GATE[BR-11 Gate<br/>≥5 deals & ≥30d?]
  GATE -->|YES| PERSIST[UPDATE agent.aps + snapshot]
  GATE -->|NO|  DEFAULT[Fallback APS_default=0.65 marker]

  PERSIST -->|publish| Q[agent.aps.updated]
  Q --> ME[Match Engine DP cascade]

  CRON[cron: aps.window.refresh */1h] --> APS
```

### 2.1 Componente

| Componentă | Responsabilitate |
|---|---|
| `APSEngine` (orchestrator) | Pipeline complet recalc agent |
| `ComponentsAggregator` | Agregare CR/RT/DCR/CS din ACTIVITY/DEAL/LEAD/NPS |
| `APSCalculator` | Aplică formula 0.35/0.25/0.20/0.20 |
| `BR11Gate` | Verifică `deal_count_total ≥ 5` ȘI `tenure ≥ 30d` |
| `APSExplainer` | Detalii pentru dashboard agent (drill-down) |
| `WindowRefreshCron` | Recalc forțat orar pentru window edge effects |

---

## 3. Stack & Dependencies

| Layer | Tehnologie | Versiune | Justificare |
|---|---|---|---|
| Backend | Node.js + TS | 20 LTS | Stack |
| DB | PostgreSQL | 16.x | Window aggregations |
| Cache | Redis | 7.x | APS snapshot per agent |
| Queue | BullMQ | latest | Event-driven recalc + cron |
| Audit | `auditLogger` | 1.0.0 | `AGENT_APS_RECALCULATED` |
| Concurrency | concurrency-hardening v1 | — | Idempotent recalc + breaker pe NPS pipeline |

---

## 4. Data Model

### 4.1 ALTER `agent` — APS metadata complet

```sql
-- Migrare: 0210_agent_aps.sql
ALTER TABLE agent
  ADD COLUMN IF NOT EXISTS aps_components JSONB NULL,                -- { CR, RT, DCR, CS, raw }
  ADD COLUMN IF NOT EXISTS aps_window_days INTEGER NOT NULL DEFAULT 90,
  ADD COLUMN IF NOT EXISTS aps_source TEXT NOT NULL DEFAULT 'default_br11' CHECK (aps_source IN ('default_br11','calculated')),
  ADD COLUMN IF NOT EXISTS deal_count_won_total INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS leads_handled_total INTEGER NOT NULL DEFAULT 0;

-- agent.aps, aps_calculated_at, deal_count_total, agent_since_date deja existente din match-engine v1 §4.3
CREATE INDEX IF NOT EXISTS idx_agent_aps_source
  ON agent (tenant_id, aps_source);
CREATE INDEX IF NOT EXISTS idx_agent_aps
  ON agent (tenant_id, aps DESC) WHERE aps IS NOT NULL;
```

### 4.2 Tabel `aps_calculation_snapshot`

```sql
-- Migrare: 0211_aps_calculation_snapshot.sql
CREATE TABLE IF NOT EXISTS aps_calculation_snapshot (
  snapshot_id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id            UUID         NOT NULL,
  agent_id             UUID         NOT NULL,
  aps_value            NUMERIC(4,3) NULL CHECK (aps_value IS NULL OR aps_value BETWEEN 0 AND 1),
  cr                   NUMERIC(4,3) NOT NULL,
  rt                   NUMERIC(4,3) NOT NULL,
  dcr                  NUMERIC(4,3) NOT NULL,
  cs                   NUMERIC(4,3) NOT NULL,
  source               TEXT         NOT NULL CHECK (source IN ('default_br11','calculated')),
  br11_reason          TEXT         NULL,            -- 'low_deal_count' | 'low_tenure' | NULL
  raw_metrics          JSONB        NOT NULL,        -- counts + medians
  weights_used         JSONB        NOT NULL,
  window_days          INTEGER      NOT NULL,
  trigger              TEXT         NOT NULL CHECK (trigger IN ('deal_won','nps_submitted','activity','lead_status_change','cron_window','manual')),
  calculated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_aps_snap_agent_time
  ON aps_calculation_snapshot (tenant_id, agent_id, calculated_at DESC);
-- Retention: 365 zile pentru audit + trend analysis
```

### 4.3 Tabel `aps_weights_config` (per tenant)

```sql
-- Migrare: 0212_aps_weights_config.sql
CREATE TABLE IF NOT EXISTS aps_weights_config (
  config_id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id            UUID         NOT NULL UNIQUE,
  weight_cr            NUMERIC(4,3) NOT NULL DEFAULT 0.35 CHECK (weight_cr BETWEEN 0 AND 1),
  weight_rt            NUMERIC(4,3) NOT NULL DEFAULT 0.25 CHECK (weight_rt BETWEEN 0 AND 1),
  weight_dcr           NUMERIC(4,3) NOT NULL DEFAULT 0.20 CHECK (weight_dcr BETWEEN 0 AND 1),
  weight_cs            NUMERIC(4,3) NOT NULL DEFAULT 0.20 CHECK (weight_cs BETWEEN 0 AND 1),
  window_days          INTEGER      NOT NULL DEFAULT 90 CHECK (window_days BETWEEN 30 AND 365),
  br11_min_deals       INTEGER      NOT NULL DEFAULT 5  CHECK (br11_min_deals >= 1),
  br11_min_tenure_days INTEGER      NOT NULL DEFAULT 30 CHECK (br11_min_tenure_days >= 7),
  rt_target_seconds    INTEGER      NOT NULL DEFAULT 900,    -- 15min HOT SLA
  cs_min_responses     INTEGER      NOT NULL DEFAULT 3,      -- min NPS pentru CS computed
  rt_min_observations  INTEGER      NOT NULL DEFAULT 30,     -- min ACTIVITY pentru RT computed
  updated_by_user_id   UUID         NULL,
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Constraint: weights sum ~ 1.00 (epsilon)
ALTER TABLE aps_weights_config
  ADD CONSTRAINT chk_aps_weights_sum
  CHECK (ABS((weight_cr + weight_rt + weight_dcr + weight_cs) - 1.000) < 0.001);
```

### 4.4 Constraints & invariants

| Invariant | Enforcement |
|---|---|
| `APS, CR, RT, DCR, CS ∈ [0,1]` | CHECK + clamp |
| Weights sum = 1.00 ± 0.001 | CHECK |
| `aps IS NULL` ↔ `aps_source='default_br11'` | App-level §6.6 |
| Snapshot append-only | RLS recommended |
| `agent.deal_count_total = COUNT(deal WHERE assigned_agent_id=agent ∧ status IN (WON,LOST,CANCELLED))` | Eventual consistent (recalc trigger) |

---

## 5. API Contracts

### 5.1 Internal services

```typescript
interface APSEngine {
  recalcForAgent(agentId: string, trigger: APSTrigger, opts?: { force?: boolean }): Promise<APSSnapshot>;
  recalcBatch(agentIds: string[], trigger: APSTrigger): Promise<{ updated: number }>;
  triggerDcrIncrement(agentId: string, dealId: string): Promise<void>;       // called from deal-closure saga
  onNpsSubmitted(agentId: string, dealId: string, score: number): Promise<void>;
}

interface APSExplainer {
  explain(agentId: string): Promise<APSExplanation>;       // dashboard data
  drillDown(agentId: string, component: 'CR'|'RT'|'DCR'|'CS'): Promise<DrillDown>;
}

type APSSnapshot = {
  aps: number | null;                  // null când default_br11
  source: 'default_br11' | 'calculated';
  br11Reason?: 'low_deal_count' | 'low_tenure';
  components: { CR: number; RT: number; DCR: number; CS: number };
  rawMetrics: APSRawMetrics;
  weights: APSWeights;
  windowDays: number;
  calculatedAt: Date;
};
```

### 5.2 REST endpoints

| Method | Path | RBAC | Descriere |
|---|---|---|---|
| `GET` | `/api/v1/agents/:id/aps` | agent (self) / team_lead+ | Snapshot curent + components |
| `GET` | `/api/v1/agents/:id/aps/explanation` | agent (self) / team_lead+ | Dashboard explainability |
| `GET` | `/api/v1/agents/:id/aps/drill-down?component=CR` | agent (self) / team_lead+ | Drill-down per componentă |
| `GET` | `/api/v1/agents/:id/aps/history?from=&to=` | agent (self) / team_lead+ | Snapshot history |
| `POST` | `/api/v1/agents/:id/aps/recalc` | manager+ | Forțare recalc (rate limit 1/min/agent) |
| `GET` | `/api/v1/admin/aps/config` | admin | Read weights |
| `PUT` | `/api/v1/admin/aps/config` | admin | Update weights cu validation sum=1 |

---

## 6. Algorithms

### 6.1 CR — Conversion Rate

```typescript
// CR = leads_won (90d) / leads_handled (90d), clamp [0,1]
async function calcCR(tx: Tx, agentId: string, windowDays: number): Promise<{ value: number; raw: any }> {
  const result = await tx.executeQuery<{ won: number; handled: number }>(/* sql */`
    SELECT
      COUNT(*) FILTER (WHERE status = 'WON') AS won,
      COUNT(*)                                 AS handled
    FROM lead
    WHERE tenant_id = $1
      AND assigned_agent_id = $2
      AND assigned_at >= NOW() - ($3 || ' days')::INTERVAL
      AND status IN ('WON','LOST','QUALIFIED','NEGOTIATION','SHOWING','CONTACTED','NEW')
  `, [tenant, agentId, windowDays]);
  const { won, handled } = result.rows[0];
  if (handled === 0) return { value: 0.50, raw: { won, handled, fallback: 'no_data' } };  // mid fallback
  return { value: clamp01(won / handled), raw: { won, handled } };
}
```

### 6.2 RT — Response Time Score

```typescript
// RT = % din mesaje primite cu response_time ≤ target_seconds, în window
// target_seconds default 900 (15 min HOT SLA). Acceptăm gradient liniar la 4× target → 0.
async function calcRT(tx: Tx, agentId: string, cfg: APSWeightsConfig): Promise<{ value: number; raw: any }> {
  const result = await tx.executeQuery<{ avg_response: number; total: number; within_target: number }>(/* sql */`
    WITH responses AS (
      SELECT
        COALESCE((metadata->>'response_time_seconds')::NUMERIC,
                 EXTRACT(EPOCH FROM (timestamp - LAG(timestamp) OVER (PARTITION BY entity_id ORDER BY timestamp)))) AS rt_sec
      FROM activity
      WHERE tenant_id = $1
        AND entity_type = 'lead'
        AND activity_type IN ('message_sent')
        AND performed_by = $2
        AND timestamp >= NOW() - ($3 || ' days')::INTERVAL
    )
    SELECT
      AVG(rt_sec) FILTER (WHERE rt_sec IS NOT NULL AND rt_sec > 0) AS avg_response,
      COUNT(rt_sec) FILTER (WHERE rt_sec IS NOT NULL AND rt_sec > 0) AS total,
      COUNT(*) FILTER (WHERE rt_sec IS NOT NULL AND rt_sec > 0 AND rt_sec <= $4) AS within_target
    FROM responses
  `, [tenant, agentId, cfg.windowDays, cfg.rtTargetSeconds]);

  const { avg_response, total, within_target } = result.rows[0];
  if (total < cfg.rtMinObservations) return { value: 0.65, raw: { total, fallback: 'low_observations' } };
  // Score: % within target (linear), penalizat pentru avg > 4× target
  const pctWithin = within_target / total;
  const avgPenalty = avg_response > 4 * cfg.rtTargetSeconds ? 0.7 : 1.0;
  return { value: clamp01(pctWithin * avgPenalty), raw: { avg_response, total, within_target, pctWithin, avgPenalty } };
}
```

### 6.3 DCR — Deal Close Rate

```typescript
// DCR = deals_won (90d) / deals_negotiation_started (90d), clamp [0,1]
async function calcDCR(tx: Tx, agentId: string, windowDays: number): Promise<{ value: number; raw: any }> {
  const result = await tx.executeQuery<{ won: number; started: number }>(/* sql */`
    SELECT
      COUNT(*) FILTER (WHERE status = 'WON' AND won_at >= NOW() - ($3 || ' days')::INTERVAL) AS won,
      COUNT(*) FILTER (WHERE
        (status_changed_to_negotiation_at >= NOW() - ($3 || ' days')::INTERVAL)
        OR (status IN ('NEGOTIATION','WON_PENDING_NOTARY','WON','LOST')
            AND COALESCE(status_changed_to_negotiation_at, created_at) >= NOW() - ($3 || ' days')::INTERVAL)
      ) AS started
    FROM deal
    WHERE tenant_id = $1 AND assigned_agent_id = $2
  `, [tenant, agentId, windowDays]);

  const { won, started } = result.rows[0];
  if (started === 0) return { value: 0.50, raw: { won, started, fallback: 'no_data' } };
  return { value: clamp01(won / started), raw: { won, started } };
}
```

> **Notă:** `deal.status_changed_to_negotiation_at` este o coloană nouă (vezi 4.5 schema patch) — sau alternativ derived din `deal_closure_step` cu `phase_to='STARTED'`. Documentat ca migrare follow-up minor.

### 6.4 CS — Client Satisfaction (NPS-derived)

```typescript
// CS = avg(NPS / 10) pentru deals WON ale agentului în window. Cu clasă pondere:
//   promoter (9-10) → 1.0
//   passive  (7-8)  → 0.7
//   detractor (0-6) → score/10
async function calcCS(tx: Tx, agentId: string, cfg: APSWeightsConfig): Promise<{ value: number; raw: any }> {
  const result = await tx.executeQuery<{ avg_score: number; promoters: number; passives: number; detractors: number; total: number }>(/* sql */`
    SELECT
      AVG(score)::NUMERIC                                    AS avg_score,
      COUNT(*) FILTER (WHERE classification='promoter')      AS promoters,
      COUNT(*) FILTER (WHERE classification='passive')       AS passives,
      COUNT(*) FILTER (WHERE classification='detractor')     AS detractors,
      COUNT(*)                                                AS total
    FROM nps_response
    WHERE tenant_id = $1 AND agent_id = $2
      AND submitted_at >= NOW() - ($3 || ' days')::INTERVAL
  `, [tenant, agentId, cfg.windowDays]);

  const { avg_score, promoters, passives, detractors, total } = result.rows[0];
  if (total < cfg.csMinResponses) return { value: 0.65, raw: { total, fallback: 'low_responses' } };

  // Weighted score per class
  const cs = (1.0*promoters + 0.7*passives + (avg_score < 7 ? avg_score/10 : 0) * detractors) / total;
  return { value: clamp01(cs), raw: { avg_score, promoters, passives, detractors, total } };
}
```

### 6.5 BR-11 Gate

```typescript
async function evaluateBR11Gate(agent: Agent, cfg: APSWeightsConfig, now: Date): Promise<{ pass: boolean; reason?: 'low_deal_count'|'low_tenure' }> {
  const tenureDays = agent.agent_since_date
    ? daysBetween(agent.agent_since_date, now, 'Europe/Chisinau')
    : 0;
  if (agent.deal_count_total < cfg.br11MinDeals) return { pass: false, reason: 'low_deal_count' };
  if (tenureDays < cfg.br11MinTenureDays)        return { pass: false, reason: 'low_tenure' };
  return { pass: true };
}
```

### 6.6 Pipeline complet

```typescript
const APS_DEFAULT = 0.65;

async function recalcForAgent(agentId: string, trigger: APSTrigger): Promise<APSSnapshot> {
  return db.transaction(async (tx) => {
    const agent = await tx.selectFrom('agent').where('agent_id','=',agentId).forUpdate().executeTakeFirstOrThrow();
    const cfg = await loadConfig(tx, agent.tenant_id);

    const [cr, rt, dcr, cs] = await Promise.all([
      calcCR(tx, agentId, cfg.windowDays),
      calcRT(tx, agentId, cfg),
      calcDCR(tx, agentId, cfg.windowDays),
      calcCS(tx, agentId, cfg),
    ]);

    const apsCalculated = clamp01(
      cfg.weightCr * cr.value +
      cfg.weightRt * rt.value +
      cfg.weightDcr * dcr.value +
      cfg.weightCs  * cs.value
    );

    const gate = await evaluateBR11Gate(agent, cfg, new Date());

    const apsFinal = gate.pass ? apsCalculated : null;       // null = use default downstream
    const source = gate.pass ? 'calculated' : 'default_br11';
    const components = { CR: cr.value, RT: rt.value, DCR: dcr.value, CS: cs.value };

    await tx.updateTable('agent').set({
      aps: apsFinal,
      aps_components: components as any,
      aps_source: source,
      aps_calculated_at: new Date(),
      aps_window_days: cfg.windowDays,
      version: sql`version + 1`,
    }).where('agent_id','=',agentId).execute();

    await tx.insertInto('aps_calculation_snapshot').values({
      tenant_id: agent.tenant_id, agent_id: agentId,
      aps_value: apsFinal, cr: cr.value, rt: rt.value, dcr: dcr.value, cs: cs.value,
      source, br11_reason: gate.reason ?? null,
      raw_metrics: { cr: cr.raw, rt: rt.raw, dcr: dcr.raw, cs: cs.raw } as any,
      weights_used: { cr: cfg.weightCr, rt: cfg.weightRt, dcr: cfg.weightDcr, cs: cfg.weightCs } as any,
      window_days: cfg.windowDays, trigger,
    }).execute();

    await auditLogger.record({
      tenantId: agent.tenant_id, eventType: 'AGENT_APS_RECALCULATED',
      entityType: 'AGENT', entityId: agentId,
      oldValue: { aps: agent.aps, source: agent.aps_source },
      newValue: { aps: apsFinal, source, components },
      metadata: { trigger, br11_reason: gate.reason },
    }, tx);

    await invalidateCache(`agent:${agentId}:aps`);
    if (apsFinal !== Number(agent.aps) || source !== agent.aps_source) {
      tx.afterCommit(() => events.publish('agent.aps.updated', { agentId, aps: apsFinal, source }));
    }
    return { aps: apsFinal, source, br11Reason: gate.reason, components, rawMetrics: { cr: cr.raw, rt: rt.raw, dcr: dcr.raw, cs: cs.raw }, weights: cfg as any, windowDays: cfg.windowDays, calculatedAt: new Date() };
  });
}
```

### 6.7 Trigger handlers

```typescript
events.subscribe('deal.won', async ({ dealId, agentId }) => {
  await db.updateTable('agent').set({
    deal_count_total: sql`deal_count_total + 1`,
    deal_count_won_total: sql`deal_count_won_total + 1`,
  }).where('agent_id','=',agentId).execute();
  await queue.add('aps.recalc', { agentId, trigger: 'deal_won' }, { jobId: `aps:${agentId}:deal_won:${dealId}` });
});

events.subscribe('nps.submitted', async ({ agentId, score }) => {
  await queue.add('aps.recalc', { agentId, trigger: 'nps_submitted' }, { jobId: `aps:${agentId}:nps:${minuteSlot()}` });
});

events.subscribe('lead.status_changed', async ({ agentId, newStatus }) => {
  if (!['WON','LOST','QUALIFIED'].includes(newStatus) || !agentId) return;
  await queue.add('aps.recalc', { agentId, trigger: 'lead_status_change' }, { jobId: `aps:${agentId}:lead:${minuteSlot()}` });
});

events.subscribe('activity.created', async ({ agentId, type }) => {
  if (type !== 'message_sent') return;     // doar mesaje de la agent contribuie la RT
  await queue.add('aps.recalc', { agentId, trigger: 'activity' }, {
    jobId: `aps:${agentId}:activity:${hourSlot()}`,             // hourly coalesce — RT nu se schimbă rapid
  });
});
```

### 6.8 Window refresh cron

```typescript
// cron 5 * * * * — orar la minut 5
async function windowRefresh() {
  // Recalc agents care au snapshot vechi (>1h) sau care au deal/lead/nps action în ultima oră (window edge)
  const agents = await db.selectFrom('agent')
    .where('is_active','=',true)
    .where(eb => eb.or([
      eb('aps_calculated_at','<', sql`NOW() - INTERVAL '1 hour'`),
      eb('aps_calculated_at','is',null),
    ]))
    .select('agent_id').limit(500).execute();
  for (const a of agents) await queue.add('aps.recalc', { agentId: a.agent_id, trigger: 'cron_window' }, { jobId: `aps:${a.agent_id}:cron:${hourSlot()}` });
}
```

### 6.9 Explainer (dashboard agent)

```typescript
async function explain(agentId: string): Promise<APSExplanation> {
  const snap = await loadLatestSnapshot(agentId);
  return {
    apsValue: snap.aps_value,
    source: snap.source,
    br11Reason: snap.br11_reason,
    components: { CR: snap.cr, RT: snap.rt, DCR: snap.dcr, CS: snap.cs },
    contributions: {
      CR: snap.weights_used.cr * snap.cr,
      RT: snap.weights_used.rt * snap.rt,
      DCR: snap.weights_used.dcr * snap.dcr,
      CS: snap.weights_used.cs * snap.cs,
    },
    headlines: buildHeadlines(snap),    // ex: "Răspuns rapid 78% — peste medie agency"
    suggestions: buildSuggestions(snap), // ex: "Crește CR — 2/8 leads pierdute la t<24h"
  };
}
```

---

## 7. State Machines

APS nu are state machine propriu (valoare scalară). Sursă comutator:

```
default_br11 ──(deals≥5 ∧ tenure≥30d)──> calculated
calculated   ──(N/A — odată trecut, rămâne calculated până la deal_count regression hypothetic)
```

---

## 8. Concurrency

- Optimistic locking pe `agent.version`.
- Idempotent recalc via `jobId` minute/hour bucket (vezi §6.7 handlers).
- `triggerDcrIncrement` chemat din DEAL_CLOSURE_SAGA (concurrency-hardening §6.4.2 step 6) — idempotent (verificare `deal_count_won_total` vs `nps_response.deal_id` audit).
- NPS pipeline cu **circuit breaker** dedicat (`engine:aps:nps`) → fallback APS calc fără CS dacă NPS sistem instabil.

---

## 9. Caching

| Key Redis | Conținut | TTL | Invalidare |
|---|---|---|---|
| `agent:{id}:aps` | { aps, source, components } | 30 sec | event `agent.aps.updated` |
| `agent:{id}:aps:explain` | dashboard payload | 5 min | event `agent.aps.updated` |
| `aps:config:{tenantId}` | weights config | 10 min | event `aps.config.changed` |

---

## 10. Background Jobs

| Job | Tip | Idempotent | Retry |
|---|---|---|---|
| `aps.recalc` | event-driven (deal.won, nps.submitted, etc.) | DA (jobId bucket) | 3× backoff |
| `aps.cron.window_refresh` | cron `5 * * * *` (orar) | DA | 3× |
| `aps.snapshot.gc` | cron `0 5 * * *` zilnic — purge >365d | DA | 3× |
| `aps.recalc.full_tenant` | manual (admin trigger la weights change) | DA | manual |

---

## 11. Error Handling

| Cod | Caz | Răspuns |
|---|---|---|
| `APS_VERSION_CONFLICT` | optimistic | retry 3× |
| `APS_AGGREGATION_TIMEOUT` | query >2s | abandon + reenqueue |
| `APS_CONFIG_INVALID_WEIGHTS_SUM` | sum ≠ 1 ± 0.001 | 422 |
| `APS_RATE_LIMITED` | recalc forțat 1/min/agent | 429 |
| `APS_AGENT_INACTIVE` | recalc pe agent inactive | 200 + skip |
| `APS_NPS_PIPELINE_OPEN` | circuit breaker pe NPS | continue cu CS=lastKnown sau fallback 0.65 |

---

## 12. Security

- **JWT RS256** + RBAC.
- **AUDIT_LOG events:**
  - `AGENT_APS_RECALCULATED` (cu source, br11_reason)
  - `APS_CONFIG_UPDATED` (admin) cu old/new weights
  - `APS_RECALC_FORCED` (manager+)
- **PII**: niciun PII în calc (count + scor); raw_metrics nu conține texte.
- **Privacy**: agent vede doar APS-ul propriu; team_lead+ vede team; manager+ vede agency. Admin vede config + agg.
- **Rate limiting**: forțare recalc 1/min/agent · admin config update 5/min.

---

## 13. Observability

| Metric | Tip | Alert |
|---|---|---|
| `aps_recalc_duration_ms` (p95) | histogram | p95 > 500ms |
| `aps_recalc_lag_seconds` (event → updated) | histogram | p95 > 30s — VIOLATES NFR-01 |
| `aps_default_br11_rate` | gauge | proporție agents pe default · monitor pre/post BR-11 exit cohort |
| `aps_distribution{tenant}` | histogram | drift detection |
| `aps_components_correlation` | matrix | identifică componente dominante |
| `aps_breaker_open_total` | counter | NPS pipeline issues |

Dashboard: `REVYX / Agent Performance`.

---

## 14. Performance Budgets

| Metric | Target | Sursă |
|---|---|---|
| `recalcForAgent` | p95 < 500 ms | UX |
| Aggregator queries (4 paralele) | p95 < 300 ms | UX |
| `windowRefresh` cron (500 agents) | p95 < 90 s | infra |
| `GET /agents/:id/aps/explain` | p95 < 200 ms | UX |
| Cascade APS → DP recalc | p95 ≤ 30 s | NFR-01 |

---

## 15. Testing Strategy

### 15.1 Unit
- `calcCR`: handled=0 → fallback 0.50; happy path
- `calcRT`: <30 observations → fallback 0.65; pctWithin + avgPenalty corecți
- `calcDCR`: started=0 → fallback 0.50; happy path
- `calcCS`: <3 NPS → fallback 0.65; class weights aplicați
- BR-11 gate: deal_count<5 → low_deal_count; tenure<30 → low_tenure
- Weights sum validation (config CHECK)

### 15.2 Integration
- Deal WON → trigger DCR + CR cascade · APS recalc cu source='calculated' (dacă pass BR-11)
- NPS submitted → CS update · breaker stays CLOSED
- Lead.status=WON → CR component refreshed
- BR-11 exit transition: agent cu 4 deals → 5th deal WON → APS first time `calculated`

### 15.3 E2E
- Agent cu deal_count=10, tenure=60d, CR=0.5, RT=0.6, DCR=0.7, CS=0.8 → APS = 0.35*0.5 + 0.25*0.6 + 0.20*0.7 + 0.20*0.8 = 0.175+0.15+0.14+0.16 = **0.625**
- Agent cu deal_count=4 → APS=null, source='default_br11', match-engine folosește 0.65

### 15.4 Load
- 1000 agents recalc cron orar → cron <90s
- 100 deal.won/h burst → APS cascade lag ≤ 30s
- NPS submitted spike → breaker remains CLOSED

### 15.5 Chaos
- NPS table lock → calcCS fallback `low_responses` + breaker tracking
- Activity table slow query → calcRT timeout + fallback 0.65

### 15.6 Coverage

| Layer | Coverage |
|---|---|
| `recalcForAgent` | ≥ 95% |
| Each component calc (CR/RT/DCR/CS) | ≥ 95% |
| BR-11 gate | ≥ 100% |
| API handlers | ≥ 85% |

---

## 16. Deployment

| Aspect | Detaliu |
|---|---|
| Feature flag | `flag.aps_engine_v1.enabled` (prerequisite `deal_closure_v1.enabled` + `concurrency_hardening_v1.enabled`) |
| Rollout | shadow 1 săpt (calc fără publish APS impact) → canary 10% → 50% → 100% |
| Rollback | flag OFF · match-engine v1 rămâne pe APS_default=0.65 (BR-11) |
| Owner | Solution Architect + Data Science Lead |

---

## 17. Migration Strategy

```
0210_agent_aps.sql
0211_aps_calculation_snapshot.sql
0212_aps_weights_config.sql
0213_deal_negotiation_started_at.sql   -- col helper pentru DCR (FOLLOWUP minor)
```

Idempotente. Backfill: la flag activ, job `aps.recalc.full_tenant` enqueued în background (5/min/tenant rate limit). Estimate 10k agents în 30 min.

---

## 18. Risks & Mitigations

| # | Risc | Probab. | Impact | Mitigare |
|---|---|---|---|---|
| R1 | RT calc inaccurate (ACTIVITY ne-instrumentat complet) | MED | MED | `rt_min_observations` fallback 0.65 · instrumentare Phase 3 (auto-derive response_time) |
| R2 | NPS sample mic → CS volatil | MED | MED | `cs_min_responses=3` fallback · weighted class scoring stabilizator |
| R3 | Agent perceived unfair (transparency) | MED | MED | Explainability dashboard · drill-down per componentă |
| R4 | Window edge effects (90d cutoff) | LOW | LOW | Cron orar refresh · gradient soft (no hard cutoff) considerat Phase 3 |
| R5 | Weights misconfigured (admin error) | LOW | HIGH | CHECK sum=1 · audit log · admin UI cu validation |
| R6 | NPS pipeline outage → CS lipsă | LOW | MED | Circuit breaker `engine:aps:nps` + fallback CS=lastKnown |
| R7 | Cascade DP storm la weights change | MED | MED | Backpressure + rate limit `aps.recalc.full_tenant` |

---

## 19. Impact Assessment

### 19.1 Scope of Change

| Element | Detaliu |
|---|---|
| Document | TECH_SPEC_REVYX_aps-engine_v1.0.0.md |
| Tip schimbare | NEW (Phase 2 — APS real, exit BR-11 fallback parțial) |
| Aria afectată | Pilon 07 · ALTER agent (APS metadata) · NEW `aps_calculation_snapshot`, `aps_weights_config` · trigger pe deal-closure + offer + NPS + activity |
| Origine | BRD §7.7 APS · §6.1 BR-11 · S5 deliverable #7 |

### 19.2 Impact pe documente conexe

| Document | Tip impact | Acțiune |
|---|---|---|
| BRD_REVYX_v1.0.0.md | None | Implementare §7.7 |
| TECH_SPEC_REVYX_match-engine_v1.0.0.md | Minor | `resolveAPS` rămâne (BR-11 fallback compat) — APS calculated când disponibil |
| TECH_SPEC_REVYX_match-engine_v2.0.0.md | None | Consum APS via DP unchanged |
| TECH_SPEC_REVYX_deal-closure_v1.0.0.md | Major (consumer) | DCR trigger din saga step 7 |
| TECH_SPEC_REVYX_offer-engine_v1.0.0.md | None (cascade indirect via deal.won) | — |
| TECH_SPEC_REVYX_lead-scoring_v1.0.0.md | Minor | lead.status WON/LOST → trigger APS |
| TECH_SPEC_REVYX_audit-log_v1.0.0.md | Minor | + `AGENT_APS_RECALCULATED` cu source, `APS_CONFIG_UPDATED`, `APS_RECALC_FORCED` |
| TECH_SPEC_REVYX_concurrency-hardening_v1.0.0.md | None (consumer) | Idempotent recalc + breaker |

### 19.3 Impact pe scoring

| Scor | Afectat? | Detaliu |
|---|---|---|
| **APS** | DA | Calc real (era default 0.65 pentru toți în Phase 1) |
| **DP** | DA (cascade) | Schimbare APS → DP pe deal-uri afectate |
| NBA, DHI | DA (cascade indirect) | via DP |
| LS, IS, PS, TS | NU | — |

### 19.4 Impact pe entități / schema BD

| Entitate | Modificare | Migrare |
|---|---|---|
| AGENT | ALTER (+5 câmpuri APS metadata) | 0210 |
| `aps_calculation_snapshot` | NEW | 0211 |
| `aps_weights_config` | NEW | 0212 |
| DEAL | minor ALTER (negotiation_started_at helper) | 0213 |

### 19.5 Impact pe RBAC

| Rol | Permisiuni adăugate |
|---|---|
| agent | self APS + explanation + drill-down |
| team_lead | team APS + explanations |
| manager | agency APS + force recalc |
| admin | weights config update |

### 19.6 Impact pe SLA & NFR

| NFR / SLA | Înainte | După | Validare |
|---|---|---|---|
| NFR-01 (recalc cascade) | aplicabil indirect | aplicabil direct (APS event → DP) | Load |
| BR-11 (default 0.65) | static | dynamic exit la 5+ deals & 30+ zile | Unit + Integration |

### 19.7 Impact pe Securitate & GDPR

| Aspect | Status | Notă |
|---|---|---|
| PII | NU | Counts + scoruri only |
| AUDIT_LOG events noi | DA | §12 |
| Consent flow | NU | — |
| HMAC / JWT / RBAC | DA | Explainability per rol |
| Rate limiting | DA | recalc + config update |

### 19.8 Risks & Mitigations

Vezi §18.

### 19.9 Test Plan

Vezi §15. Critical: BR-11 exit transition + cascade DP după prima APS calculated; weights sum validation.

### 19.10 Rollout & Rollback

| Aspect | Detaliu |
|---|---|
| Feature flag | `flag.aps_engine_v1.enabled` |
| Strategie | shadow → 10% → 50% → 100% în 3 săpt |
| Rollback | flag OFF · match-engine v1 default 0.65 |
| Owner | Solution Architect + Data Science Lead |

### 19.11 Approval Gate

| Aprobator | Necesar pentru |
|---|---|
| Senior PM | Component formulas · CS class weights · BR-11 thresholds |
| Solution Architect | Schema · cascade · breaker integration |
| Data Science Lead | RT computation · CS classification · auto-tune (Phase 3 ready) |
| Security Lead | RBAC · AUDIT |
| HR / People Ops | Validare etică transparency dashboard agent |

---

*docs/tech-spec/TECH_SPEC_REVYX_aps-engine_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
