# TECH SPEC — REVYX Property Engine
<!-- TECH_SPEC_REVYX_property_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Solution Architect | Spec inițială Property Engine — PS, Listing Freshness, Pricing AI hooks, pgvector indexare · Phase 1 |

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

Property Engine este nucleul Pilonului 02 (Supply Intelligence) și sursa Property Score (PS) consumat de Match Engine în formula DP.

| Atribut | Valoare |
|---|---|
| **Scope** | Onboarding PROPERTY · calcul PS (BRD §7.2) · Listing Freshness · Pricing AI hooks (Phase 2 ready) · pgvector embeddings (Phase 3 ready) |
| **Referință BRD** | §5 Pilon 02 · §7.2 PS · §8 PROPERTY entitate · §12 edge T04 |
| **Phase** | 1 (Core) cu interfețe extensibile spre Phase 2/3 |
| **Owner tehnic** | Solution Architect + Senior PM |
| **Dependențe upstream** | Phase 0 (auth-rbac · audit-log · webhook-intake opțional) |
| **Dependențe downstream** | Lead Scoring (BF input) · Match Engine · Showcase Links · Pricing AI (Phase 2) |

**Garanții oferite:**

1. PS calculat la onboarding și recalculat la modificare entitate sau zilnic (pentru LF degradare temporală).
2. `LF = 1 − min(1, zile_listing/90)` — penalizare liniară (BRD §7.2, edge T04).
3. PS ∈ [0,1] în orice condiție.
4. Pricing AI exposed ca interface stub `IPricingProvider` — implementare Phase 2 fără modificare Property Engine.
5. pgvector embeddings persistate la onboarding (HNSW index activat doar Phase 3).
6. Optimistic locking pe PROPERTY (BRD §9.5).

---

## 2. Architecture Overview

```mermaid
flowchart LR
  UI[Agent UI<br/>Property Onboarding] -->|POST| INTK[Property Intake Service]
  INTK -->|INSERT property<br/>LS_calc + LF=1.0| DB[(PostgreSQL<br/>PROPERTY · pgvector)]
  INTK -->|publish| Q1[property.created]
  Q1 --> SCR[Property Scoring]
  SCR -->|UPDATE optimistic| DB
  SCR -->|set| RD[(Redis<br/>PS cache)]
  SCR -->|publish| Q2[property.score.updated]
  PRC[IPricingProvider<br/>stub Phase 1<br/>impl Phase 2] -.->|enrich| SCR
  EMB[Embedding Service<br/>OpenAI / local] -->|vector(1536)| DB
  CRON[Cron LF degradation] -->|nightly| SCR
```

### 2.1 Data flow

1. Agent crează PROPERTY prin UI sau import bulk → `Property Intake Service` validează câmpuri tehnice.
2. INSERT `property` cu `LF = 1.0` (proprietate nouă), `PS` calculat preliminar fără MV.
3. Async: embedding text descriere → `property.embedding` (Phase 3 ready).
4. Async: `Property Scoring` recalculează PS complet (PF, LD, PQ, MV, LF).
5. Cron nightly recalculează LF pentru toate proprietățile (penalizare temporală).

### 2.2 Componente

| Componentă | Responsabilitate |
|---|---|
| `PropertyIntakeService` | Validare schema · normalizare · INSERT atomic + audit |
| `PropertyScoringService` | Calcul PS cu cele 5 sub-componente |
| `IPricingProvider` (stub) | Interface pentru Pricing AI Phase 2 — default returnează `priceFit=null` |
| `EmbeddingService` | Generare vector descriere (OpenAI text-embedding-3-small / local) |
| `ListingFreshnessJob` | Cron nightly recalc LF |
| `PropertyCache` | Redis: PS + breakdown |

---

## 3. Stack & Dependencies

| Layer | Tehnologie | Versiune | Justificare |
|---|---|---|---|
| Backend | Node.js + TypeScript | 20 LTS · TS 5.x | Stack standard REVYX |
| ORM | Kysely | latest stable | Type-safe SQL + control pgvector |
| DB | PostgreSQL + pgvector | 16.x · pgvector 0.7+ | Native vector type · HNSW index activabil Phase 3 |
| Cache | Redis | 7.x | PS cache + queue |
| Queue | BullMQ | latest | Cron LF degradation · dedup property |
| Embeddings | OpenAI text-embedding-3-small (default) sau local fallback | dim 1536 | Cost-eficient · multilingual (RO + RU) |

> **Notă pgvector:** Phase 1 storează vectorii dar **NU activează HNSW index** (cost mentenanță). Phase 3 activează `CREATE INDEX USING hnsw` la pragul de ~10k properties/tenant.

---

## 4. Data Model

### 4.1 Tabel `property` (Phase 1)

```sql
-- Migrare: 0060_property_phase1.sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS property (
  property_id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                UUID            NOT NULL,

  -- Identificare
  external_ref             TEXT            NULL,          -- ID intern agenție / OLX
  property_type            TEXT            NOT NULL CHECK (property_type IN ('apartment','house','commercial','land','office')),
  transaction_type         TEXT            NOT NULL CHECK (transaction_type IN ('sale','rent')),

  -- Locație
  country                  TEXT            NOT NULL DEFAULT 'MD',
  city                     TEXT            NOT NULL,
  district                 TEXT            NULL,
  address_line             TEXT            NULL,
  geo_lat                  NUMERIC(9,6)    NULL,
  geo_lng                  NUMERIC(9,6)    NULL,

  -- Caracteristici tehnice
  area_sqm                 NUMERIC(8,2)    NOT NULL CHECK (area_sqm > 0),
  rooms                    SMALLINT        NULL,
  bathrooms                SMALLINT        NULL,
  floor                    SMALLINT        NULL,
  total_floors             SMALLINT        NULL,
  year_built               SMALLINT        NULL,
  condition_grade          TEXT            NULL CHECK (condition_grade IN ('new','renovated','good','needs_repair','demolition') OR condition_grade IS NULL),
  has_parking              BOOLEAN         NOT NULL DEFAULT FALSE,
  has_balcony              BOOLEAN         NOT NULL DEFAULT FALSE,
  energy_class             TEXT            NULL,

  -- Financiar
  price_amount             NUMERIC(14,2)   NOT NULL CHECK (price_amount >= 0),
  price_currency           TEXT            NOT NULL DEFAULT 'EUR' CHECK (price_currency IN ('EUR','MDL','USD')),
  price_per_sqm_eur        NUMERIC(10,2)   GENERATED ALWAYS AS (
    CASE WHEN price_currency = 'EUR' AND area_sqm > 0
         THEN ROUND(price_amount / area_sqm, 2)
         ELSE NULL END
  ) STORED,

  -- Scoruri
  property_score           NUMERIC(4,3)    NOT NULL DEFAULT 0.500 CHECK (property_score BETWEEN 0 AND 1),
  listing_freshness_score  NUMERIC(4,3)    NOT NULL DEFAULT 1.000 CHECK (listing_freshness_score BETWEEN 0 AND 1),
  market_velocity_score    NUMERIC(4,3)    NULL CHECK (market_velocity_score IS NULL OR market_velocity_score BETWEEN 0 AND 1),
  score_components         JSONB           NULL,                -- { PF, LD, PQ, MV, LF }
  score_recalculated_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  -- Pricing AI (Phase 2 ready)
  ai_recommended_price_eur NUMERIC(14,2)   NULL,
  ai_price_provider        TEXT            NULL,
  ai_price_confidence      NUMERIC(4,3)    NULL,
  ai_price_calculated_at   TIMESTAMPTZ     NULL,

  -- Listing lifecycle
  status                   TEXT            NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','ACTIVE','RESERVED','SOLD','WITHDRAWN','EXPIRED')),
  listed_at                TIMESTAMPTZ     NULL,
  withdrawn_at             TIMESTAMPTZ     NULL,
  sold_at                  TIMESTAMPTZ     NULL,

  -- Showcase
  showcase_token           TEXT            NULL UNIQUE,        -- vezi TECH_SPEC showcase-links
  showcase_published_at    TIMESTAMPTZ     NULL,
  showcase_expires_at      TIMESTAMPTZ     NULL,

  -- Search / matching
  description              TEXT            NULL,
  embedding                vector(1536)    NULL,                 -- pgvector — index Phase 3
  features                 JSONB           NULL,                 -- amenities · proximity · etc.

  -- Owner
  seller_id                UUID            NULL,                 -- FK către SELLER (entitate Phase 2)
  listing_agent_id         UUID            NOT NULL,             -- agent responsabil

  -- Optimistic locking
  version                  BIGINT          NOT NULL DEFAULT 1,

  created_at               TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_property_tenant_status   ON property (tenant_id, status, property_score DESC);
CREATE INDEX IF NOT EXISTS idx_property_geo             ON property (tenant_id, city, district);
CREATE INDEX IF NOT EXISTS idx_property_price_eur       ON property (tenant_id, price_per_sqm_eur) WHERE price_currency = 'EUR';
CREATE INDEX IF NOT EXISTS idx_property_listed_at       ON property (listed_at) WHERE listed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_property_showcase_token  ON property (showcase_token) WHERE showcase_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_property_listing_agent   ON property (tenant_id, listing_agent_id);
-- pgvector HNSW: NOT created in Phase 1; activated in Phase 3
-- CREATE INDEX idx_property_embedding ON property USING hnsw (embedding vector_cosine_ops);
```

### 4.2 Tabel `property_market_baseline` (input pentru PF, LD, MV)

```sql
-- Per district + property_type · refresh weekly din inventory + tranzacții închise
CREATE TABLE IF NOT EXISTS property_market_baseline (
  baseline_id        UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          UUID         NOT NULL,
  city               TEXT         NOT NULL,
  district           TEXT         NULL,
  property_type      TEXT         NOT NULL,
  median_price_sqm_eur NUMERIC(10,2) NOT NULL,
  p25_price_sqm_eur    NUMERIC(10,2) NOT NULL,
  p75_price_sqm_eur    NUMERIC(10,2) NOT NULL,
  active_listings_count INTEGER  NOT NULL,
  median_days_to_sell  INTEGER   NULL,
  refreshed_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, city, district, property_type)
);
```

### 4.3 Constraints & invariants

| Invariant | Enforcement |
|---|---|
| `PS, LF ∈ [0,1]` | CHECK + clamp app-side |
| `LF = 1.0` la INSERT | DEFAULT + recalc cron |
| `version` strict crescător | optimistic locking |
| `showcase_token` unique global | UNIQUE constraint |
| `area_sqm > 0` | CHECK |

---

## 5. API Contracts

```typescript
interface PropertyIntakeService {
  create(input: PropertyCreateInput, agent: User): Promise<Property>;
  update(propertyId: string, patch: PropertyPatch, agent: User): Promise<Property>;
  publish(propertyId: string, agent: User): Promise<Property>;
  withdraw(propertyId: string, reason: string, agent: User): Promise<Property>;
}

interface PropertyScoringService {
  recalcScore(propertyId: string): Promise<PSSnapshot>;
  recalcLFAll(tenantId: string): Promise<{ updated: number }>;  // cron
}

interface IPricingProvider {
  recommendPrice(input: PricingInput): Promise<PricingRecommendation | null>;
}
```

### REST endpoints

| Method | Path | RBAC | Descriere |
|---|---|---|---|
| `POST` | `/api/v1/properties` | agent+ | Crează property (DRAFT) |
| `PATCH` | `/api/v1/properties/:id` | agent (own) / team_lead+ | Update fields |
| `POST` | `/api/v1/properties/:id/publish` | agent (own) / team_lead+ | DRAFT → ACTIVE + showcase token |
| `POST` | `/api/v1/properties/:id/withdraw` | agent (own) / team_lead+ | ACTIVE → WITHDRAWN |
| `GET` | `/api/v1/properties/:id` | agent (own) / team_lead+ | Detalii + PS breakdown |
| `GET` | `/api/v1/properties/search` | agent+ | Search (city, type, price range, area) |
| `POST` | `/api/v1/properties/:id/recalc-score` | manager+ | Forțează recalc |

---

## 6. Algorithms

### 6.1 Property Score (BRD §7.2)

```typescript
// PS = 0.40*PF + 0.20*LD + 0.15*PQ + 0.15*MV + 0.10*LF
function calculatePropertyScore(p: Property, baseline: MarketBaseline | null, ai?: PricingRecommendation | null): {
  ps: number; components: PSComponents;
} {
  const PF = priceFit(p, baseline, ai);              // [0,1]
  const LD = locationDemand(p, baseline);            // [0,1]
  const PQ = propertyQuality(p);                     // [0,1]
  const MV = marketVelocity(p, baseline);            // [0,1] sau fallback 0.5
  const LF = listingFreshness(p);                    // [0,1] vezi 6.2

  const ps = 0.40*PF + 0.20*LD + 0.15*PQ + 0.15*MV + 0.10*LF;
  return { ps: clamp01(ps), components: { PF, LD, PQ, MV, LF } };
}
```

#### Sub-formule

```typescript
// Price Fit: cât de bine se aliniază prețul cu baseline + recomandare AI
function priceFit(p: Property, b: MarketBaseline | null, ai?: PricingRecommendation | null): number {
  if (!b || !p.price_per_sqm_eur) return 0.50; // fallback
  const median = b.median_price_sqm_eur;
  const deviation = Math.abs(p.price_per_sqm_eur - median) / median; // 0 = perfect fit
  // [0, 0.10] → 1.0 ; [0.10, 0.30] → liniar 1.0→0.4 ; >0.30 → 0.0
  let pf = deviation <= 0.10 ? 1.0
         : deviation <= 0.30 ? 1.0 - (deviation - 0.10)/0.20 * 0.6
         : 0.0;
  // Ajustare opțională din IPricingProvider
  if (ai?.confidence && ai.recommendedPriceEur) {
    const aiDev = Math.abs(p.price_amount - ai.recommendedPriceEur) / ai.recommendedPriceEur;
    const aiFit = aiDev <= 0.05 ? 1.0 : aiDev <= 0.20 ? 0.7 : 0.3;
    pf = pf * (1 - ai.confidence) + aiFit * ai.confidence;
  }
  return clamp01(pf);
}

// Location Demand: din baseline.active_listings_count + sold_velocity
function locationDemand(p: Property, b: MarketBaseline | null): number {
  if (!b) return 0.50;
  const supply = Math.min(1, b.active_listings_count / 200);  // 200 = saturare
  const velocity = b.median_days_to_sell ? Math.max(0, 1 - b.median_days_to_sell / 180) : 0.5;
  return clamp01(0.6*velocity + 0.4*(1 - supply));
}

// Property Quality: scor compozit din condition + amenities + an construcție
function propertyQuality(p: Property): number {
  const condMap = { new: 1.0, renovated: 0.85, good: 0.65, needs_repair: 0.30, demolition: 0.05 };
  const cond = p.condition_grade ? condMap[p.condition_grade] : 0.50;
  const ageScore = p.year_built ? clamp01(1 - (new Date().getFullYear() - p.year_built) / 100) : 0.50;
  const amenities = (p.has_parking ? 0.10 : 0) + (p.has_balcony ? 0.05 : 0)
                  + (p.energy_class && ['A','A+','B'].includes(p.energy_class) ? 0.10 : 0);
  return clamp01(0.55*cond + 0.30*ageScore + amenities);
}

// Market Velocity: 1 - median_days_to_sell / 180 (cap)
function marketVelocity(p: Property, b: MarketBaseline | null): number {
  if (!b?.median_days_to_sell) return 0.50;
  return clamp01(1 - b.median_days_to_sell / 180);
}
```

### 6.2 Listing Freshness (BRD §7.2 + edge T04)

```typescript
// LF = 1 − min(1, zile_listing / 90)
function listingFreshness(p: Property): number {
  if (!p.listed_at) return 1.0;                                    // încă DRAFT
  const days = daysBetween(p.listed_at, new Date());
  const lf = 1 - Math.min(1, days / 90);
  return clamp01(lf);
}
// LF = 1.0 la 0 zile · LF = 0.0 la ≥90 zile · liniar
// Edge T04: PS penalizat ~10% (contribuția 0.10 × LF) la 90+ zile
```

### 6.3 Pricing AI hooks (Phase 2 ready)

```typescript
// Stub default Phase 1 — returnează null
class NoopPricingProvider implements IPricingProvider {
  async recommendPrice(_: PricingInput): Promise<PricingRecommendation | null> { return null; }
}

// Phase 2 — implementare reală
class AIPricingProvider implements IPricingProvider {
  async recommendPrice(input: PricingInput): Promise<PricingRecommendation | null> {
    // Call ML model · returnează { recommendedPriceEur, confidence, factors }
  }
}

// Property Engine selectează provider via config (default = Noop în Phase 1)
const provider: IPricingProvider = configFlag('pricing_ai_enabled')
  ? new AIPricingProvider()
  : new NoopPricingProvider();
```

### 6.4 Recalc orchestration

```typescript
async function recalcScore(propertyId: string) {
  return db.transaction(async (tx) => {
    const p = await tx.selectFrom('property').where('property_id','=',propertyId).forUpdate().executeTakeFirstOrThrow();
    const baseline = await loadBaseline(tx, p);
    const ai = await provider.recommendPrice(toPricingInput(p, baseline));
    const { ps, components } = calculatePropertyScore(p, baseline, ai);
    const lf = listingFreshness(p);

    if (sameSnapshot(p, ps, lf)) return existing(p);

    await tx.updateTable('property').set({
      property_score: ps,
      listing_freshness_score: lf,
      market_velocity_score: components.MV,
      score_components: components,
      ai_recommended_price_eur: ai?.recommendedPriceEur ?? null,
      ai_price_confidence: ai?.confidence ?? null,
      ai_price_calculated_at: ai ? new Date() : null,
      score_recalculated_at: new Date(),
      version: p.version + 1n,
    }).where('property_id','=',propertyId).where('version','=',p.version).execute();

    await auditLogger.record({
      tenantId: p.tenant_id, actorType: 'SYSTEM',
      eventType: 'PROPERTY_SCORE_UPDATED', entityType: 'PROPERTY', entityId: propertyId,
      oldValue: { ps: p.property_score, lf: p.listing_freshness_score },
      newValue: { ps, lf },
    }, tx);

    await invalidateCache(`property:${propertyId}:scores`);
    await events.publish('property.score.updated', { propertyId, ps, lf });
    return { ps, lf, components };
  });
}
```

---

## 7. State Machines

```
DRAFT ──(publish + validare)──> ACTIVE
ACTIVE ──(reserve)──> RESERVED ──(sold)──> SOLD
RESERVED ──(release)──> ACTIVE
ACTIVE ──(withdraw)──> WITHDRAWN
ACTIVE ──(180 zile fără update)──> EXPIRED
WITHDRAWN ──(re-publish)──> ACTIVE (LF reset NU se face — listed_at original păstrat)
SOLD/EXPIRED ── terminal
```

> **Notă:** la `withdraw` → `re-publish`, `listed_at` rămâne neschimbat (politica anti-gaming LF). Reset LF doar prin `RESET_LF` admin (audit-loggat).

---

## 8. Concurrency

- Optimistic locking pe `property` cu `version` field (BRD §9.5).
- Recalc declanșat de: PATCH property · cron LF · update baseline market.
- `pg_advisory_xact_lock(hashtext(property_id))` pe recalc pentru evitarea coliziunilor.
- Embedding generation async (job separat) — nu blochează intake.

---

## 9. Caching

| Key Redis | Conținut | TTL | Invalidare |
|---|---|---|---|
| `property:{id}:scores` | `{ ps, lf, mv, components, version }` | 5 min | event `property.score.updated` |
| `property:{id}:summary` | metadate UI (price, area, photos refs) | 30 sec | event `property.updated` |
| `tenant:{tid}:baseline:{city}:{district}:{type}` | MarketBaseline | 6h | refresh weekly job |
| `property:search:{queryHash}` | listă property_id | 60 sec | event `property.score.updated` (cu match query) |

---

## 10. Background Jobs

| Job | Cron / Trigger | Idempotent | Retry |
|---|---|---|---|
| `property.lf.degradation` | cron `0 2 * * *` (daily 02:00) | DA | 3× backoff 5/15/30m |
| `property.embedding.generate` | la INSERT/PATCH description | DA (skip dacă embedding != null & description hash unchanged) | 3× backoff |
| `property.market.baseline.refresh` | cron weekly Sunday 03:00 | DA | 3× backoff |
| `property.expired.detect` | cron daily 04:00 | DA | 3× backoff |
| `property.score.recalc.fallback` | cron `0 */6 * * *` | DA | 3× backoff |

---

## 11. Error Handling

| Cod | Caz | Răspuns |
|---|---|---|
| `PROPERTY_VERSION_CONFLICT` | UPDATE rejected by version | Re-fetch + retry max 3× |
| `PROPERTY_INVALID_STATUS_TRANSITION` | PATCH la SOLD | 409 |
| `PROPERTY_AREA_INVALID` | area_sqm ≤ 0 | 422 (CHECK fail) |
| `BASELINE_MISSING` | baseline lipsă pentru city/district/type | Fallback 0.50 + warn log |
| `EMBEDDING_PROVIDER_DOWN` | OpenAI 5xx | Retry exponential · fallback local model |
| `SCORE_OUT_OF_RANGE` | bug recalc | Hard-fail + alert + clamp |

---

## 12. Security

- **JWT RS256** moștenit din Phase 0.
- **RBAC**:
  - `agent` — read/write property propriu (`listing_agent_id = me`)
  - `team_lead` — read/write echipa sa
  - `manager` — read tot tenant + recalc forțat
  - `admin` — config baseline · IPricingProvider activation
- **AUDIT_LOG events:**
  - `PROPERTY_CREATED` · `PROPERTY_UPDATED` · `PROPERTY_PUBLISHED` · `PROPERTY_WITHDRAWN` · `PROPERTY_SOLD`
  - `PROPERTY_SCORE_UPDATED` · `PROPERTY_LF_RESET` (admin only)
  - `SHOWCASE_LINK_GENERATED` (vezi showcase-links spec)
- **PII:** address_line poate conține PII (stradă/număr) — redactat în AUDIT_LOG (hash).
- **Rate limiting** moștenit (NFR-06): 1.000 req/min/token.
- **Tenant isolation:** toate query-urile cu `WHERE tenant_id = :ctx`.

---

## 13. Observability

| Metric | Tip | Alert |
|---|---|---|
| `property_score_recalc_duration_ms` | histogram | p95 > 2s |
| `property_score_recalc_total{trigger}` | counter | — |
| `property_lf_degradation_run_duration_s` | histogram | > 30 min → alert |
| `property_embedding_generation_failures_total` | counter | >5/min → alert |
| `property_active_count{tenant_id}` | gauge | capacity planning |
| `property_score_distribution{bucket}` | histogram | drift detection |

---

## 14. Performance Budgets

| Metric | Target | Sursă |
|---|---|---|
| Recalc PS | p95 < 1.5 sec | UX |
| Onboarding INSERT (sync) | p95 < 500 ms | UX |
| Search query (200 results) | p95 < 300 ms | UX |
| LF cron (10k properties) | < 5 min | Capacity |
| Embedding generation | p95 < 3 sec async | UX (async) |

---

## 15. Testing Strategy

### 15.1 Unit
- Toate sub-formulele PF/LD/PQ/MV/LF — coverage ≥ 95%
- Edge T04: 90+ zile listing → LF = 0.0 ✓
- LF la 0/45/89/90/180 zile — valori așteptate
- IPricingProvider stub vs real (mock)

### 15.2 Integration
- Onboarding → INSERT → score calculat în <2s
- PATCH price → recalc PS
- Withdraw → status update + AUDIT
- Optimistic conflict → retry success

### 15.3 E2E
- Property nou (LF=1.0) vs property la 90 zile (LF=0.0) → PS diferă cu ~10% (T04)
- Showcase publish → token generat unique (vezi showcase-links spec)
- Search city + price range → top 20 sortat by PS desc

### 15.4 Load
- 500 onboarding/min sustained 10 min · p95 < 800ms
- LF cron 100k properties < 30 min
- Embedding queue 1000 properties · throughput ≥ 50/min

### 15.5 Chaos
- OpenAI 5xx → fallback local + retry
- Baseline table empty → fallback 0.50 graceful

### 15.6 Coverage target

| Layer | Coverage |
|---|---|
| Scoring formulas | ≥ 95% |
| Intake + state machine | ≥ 90% |
| API handlers | ≥ 85% |

---

## 16. Deployment

| Aspect | Detaliu |
|---|---|
| Feature flag | `flag.property_engine_v1.enabled` (default OFF în staging) |
| Rollout | canary 10% tenanți → 50% → 100% |
| Rollback | flag OFF · DOWN migration `0060_down.sql` |
| Secrets | `OPENAI_API_KEY` (Phase 1 embeddings) — vault managed |

---

## 17. Migration Strategy

```
0060_property_phase1.sql        -- ALTER property: scoring + showcase + embedding + version
0061_property_market_baseline.sql -- NEW table baseline
0062_property_indexes.sql       -- Indexes search + status
0063_pgvector_enable.sql        -- CREATE EXTENSION vector (deja prezentă opțional)
-- Phase 3:
-- 0090_pgvector_hnsw_index.sql -- ACTIVARE HNSW (decuplat)
```

Idempotent. Backwards compat: PROPERTY existent (Phase 0) primește `PS=0.50`, `LF=1.0`, `version=1` la migrare.

---

## 18. Risks & Mitigations

| # | Risc | Probab. | Impact | Mitigare |
|---|---|---|---|---|
| R1 | Baseline missing → PS underfit | MED | MED | Fallback 0.50 + alert + cron weekly refresh |
| R2 | OpenAI cost spike (embeddings) | MED | MED | Local fallback model · cache embedding pe `description_hash` |
| R3 | LF degradation thrash mass UPDATE | MED | LOW | Batch 1000 cu sleep 100ms · advisory lock |
| R4 | Anti-gaming withdraw→republish reset LF | LOW | MED | Politica `listed_at` neschimbat la re-publish |
| R5 | pgvector HNSW activat prematur | LOW | MED | Activare separată Phase 3 după prag 10k |
| R6 | PS calculat înainte de baseline refresh nou | MED | LOW | Cron baseline înainte de cron PS recalc (ordering) |

---

## 19. Impact Assessment

### 19.1 Scope of Change

| Element | Detaliu |
|---|---|
| Document | TECH_SPEC_REVYX_property_v1.0.0.md |
| Tip schimbare | NEW |
| Aria afectată | Phase 1 · Pilon 02 (Supply) · entitate PROPERTY · scoring PS/LF · pgvector ready |
| Origine | BRD §5 Pilon 02 · §7.2 PS · §8 PROPERTY |

### 19.2 Impact pe documente conexe

| Document | Tip impact | Acțiune |
|---|---|---|
| BRD_REVYX_v1.0.0.md | None | Formula PS deja documentată |
| TECH_SPEC_REVYX_audit-log_v1.0.0.md | Minor | Catalog event `PROPERTY_SCORE_UPDATED`, `PROPERTY_LF_RESET` adăugate |
| TECH_SPEC_REVYX_lead-scoring_v1.0.0.md | Minor | BF (Budget Fit) consumă inventory PROPERTY |
| TECH_SPEC_REVYX_showcase-links_v1.0.0.md (S3) | Major | Generare token + tracking depinde de PROPERTY |
| TECH_SPEC_REVYX_match-engine (S4) | Major | DP consumă PS |
| TECH_SPEC_REVYX_pricing-ai (Phase 2) | Major | Implementează `IPricingProvider` |
| WORKFLOW_REVYX_property-onboarding_v1.0.0.md (S3) | None | Reflectă mecanica acestui spec |

### 19.3 Impact pe scoring

| Scor | Afectat? | Detaliu |
|---|---|---|
| **PS** | DA | Implementare directă §6.1 |
| **LF** | DA | Implementare directă §6.2 |
| **MV** | DA | Sub-componentă PS (din baseline) |
| LS | NU (indirect) | BF consumă inventory pentru overlap |
| DP | NU (indirect) | DP = 0.30*LS + 0.30*PS + ... |
| Altele | NU | — |

### 19.4 Impact pe entități / schema BD

| Entitate | Modificare | Migrare |
|---|---|---|
| PROPERTY | ALTER (+30 câmpuri scoring/showcase/embedding/version) | 0060_property_phase1.sql |
| PROPERTY_MARKET_BASELINE | NEW | 0061_property_market_baseline.sql |
| pgvector extension | CREATE EXTENSION | 0063_pgvector_enable.sql |

### 19.5 Impact pe RBAC

| Rol | Permisiuni adăugate |
|---|---|
| agent | CRUD property propriu · publish/withdraw |
| team_lead | + view echipă |
| manager | Recalc forțat · view tot tenant |
| admin | Config baseline · activare IPricingProvider · LF_RESET |

### 19.6 Impact pe SLA & NFR

| NFR / SLA | Înainte | După | Validare |
|---|---|---|---|
| Recalc PS | nedefinit | p95 < 1.5s | Load 15.4 |
| Onboarding INSERT | nedefinit | p95 < 500ms | Load 15.4 |
| LF cron | nedefinit | < 5 min @10k | Load 15.4 |

### 19.7 Impact pe Securitate & GDPR

| Aspect | Status | Notă |
|---|---|---|
| PII | DA | `address_line` redactat în AUDIT_LOG |
| AUDIT_LOG events noi | DA | `PROPERTY_*`, `SHOWCASE_LINK_GENERATED` (delegat showcase spec) |
| Consent flow | NU | PROPERTY = bun, nu persoană |
| HMAC / JWT / RBAC | DA | RBAC §12 |
| Rate limiting | NU | Moștenit |

### 19.8 Risks & Mitigations

Vezi §18.

### 19.9 Test Plan

Vezi §15. Edge T04 obligatoriu (LF=0.0 la 90 zile).

### 19.10 Rollout & Rollback

| Aspect | Detaliu |
|---|---|
| Feature flag | `flag.property_engine_v1.enabled` default OFF |
| Strategie rollout | canary 10% → 50% → 100% |
| Rollback | flag OFF + DOWN migration |
| Owner rollout | Senior PM + Solution Architect |

### 19.11 Approval Gate

| Aprobator | Necesar pentru |
|---|---|
| Senior PM | Formula PS aliniat cu BRD §7.2 |
| Solution Architect | Schema BD · pgvector strategy · IPricingProvider |
| Security Lead | PII redact · AUDIT events |

---

*docs/tech-spec/TECH_SPEC_REVYX_property_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
