# TECH SPEC — CHURN MODEL GA (Monitoring · CS Playbook · Feedback Loop · KPI ≥30%)
<!-- TECH_SPEC_REVYX_churn-ga_v1.0.1.md · v1.0.1 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Solution Architect + Customer Success Lead + Data Science Lead | Spec inițială S8 — graduate churn model la GA · monitoring AUC drift · CS playbook · feedback loop · KPI ≥30% |
| 1.0.1 | 2026-05 | Senior PM + Solution Architect + DBA | ★ Closes F-03 HIGH (AUDIT_REVYX_s8-external-pass v1.0.0) — actualizare referință la `ml_model_registry` (canonical post-migrare 0600) în loc de `pricing_model_registry` · ștergere notă "★ rename viitor" din §4.1 · zero schimbare schema/cod · cross-ref BRD v1.1.0 §6.4 Pilon Retention |

---

> **Backwards compat (v1.0.0 → v1.0.1):**
> - **Doar referința** spec face update (`pricing_model_registry` → `ml_model_registry`). Migrarea 0600 (în spec-ul `ml-pricing-ga` v1.0.2) realizează rename + view backwards-compat — codul vechi nealterat continuă să funcționeze prin view.
> - **Niciun cod nou** introdus de v1.0.1.
> - **Niciun row schimbat** în `churn_score`; FK-ul `model_id REFERENCES ml_model_registry(model_id)` rezolvă transparent post-rename (PostgreSQL FK păstrate).

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
12. [Security & GDPR](#12-security--gdpr)
13. [Observability](#13-observability)
14. [Performance Budgets](#14-performance-budgets)
15. [Testing Strategy](#15-testing-strategy)
16. [Deployment & Rollout](#16-deployment--rollout)
17. [Migration Strategy](#17-migration-strategy)
18. [Risks & Mitigations](#18-risks--mitigations)
19. [CS Playbook](#19-cs-playbook)
20. [Impact Assessment](#20-impact-assessment)

---

## 1. Executive Summary

(Identic cu v1.0.0 §1, cu mențiunea: ★ Pilon Retention referit canonic în BRD v1.1.0 §6.4 — F-09 closed.)

| Atribut | Valoare |
|---|---|
| **Scope** | (idem v1.0.0) |
| **Referință BRD** | ★ BRD v1.1.0 §6.4 Pilon Retention (canonical, post-F-09) |
| **Phase** | 5 (Maturitate platformă) |
| **Owner tehnic** | Data Science Lead + CS Lead + Solution Architect |
| **Dependențe upstream** | Billing/Metering S7 · `audit-log` v1.1.0 · APS engine · ★ `ml-pricing-ga` v1.0.2 (registry generic `ml_model_registry`) |

(Restul §1 identic cu v1.0.0.)

---

## 2. Architecture Overview

(Identic cu v1.0.0 §2.)

---

## 3. Stack & Dependencies

(Identic cu v1.0.0 §3.)

---

## 4. Data Model

### 4.1 ★ Tabel `churn_score` (referință registry actualizată — F-03 closed)

```sql
-- Migrare: 0540_churn_score.sql (NEUSCHIMBATĂ — schema rămâne identică)
CREATE TABLE IF NOT EXISTS churn_score (
  score_id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_type          TEXT         NOT NULL CHECK (subject_type IN ('TENANT','AGENT')),
  subject_id            UUID         NOT NULL,
  tenant_id             UUID         NOT NULL,
  -- ★ v1.0.1: FK referă canonical `ml_model_registry` post-migrare 0600 (ml-pricing-ga v1.0.2).
  --   Numele coloanei (model_id) rămâne; ALTER TABLE RENAME pe registry e transparent pentru FK.
  --   Filtru aplicare: model_name='churn-gbm' la query.
  model_id              UUID         NOT NULL REFERENCES ml_model_registry(model_id),
  prob_30d              NUMERIC(4,3) NOT NULL CHECK (prob_30d BETWEEN 0 AND 1),
  prob_60d              NUMERIC(4,3) NOT NULL CHECK (prob_60d BETWEEN 0 AND 1),
  risk_band             TEXT         NOT NULL CHECK (risk_band IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  factors               JSONB        NOT NULL,
  features_hash         TEXT         NOT NULL,
  is_current            BOOLEAN      NOT NULL DEFAULT TRUE,
  computed_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  expires_at            TIMESTAMPTZ  NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_cs_current
  ON churn_score (subject_type, subject_id) WHERE is_current = TRUE;
CREATE INDEX IF NOT EXISTS idx_cs_band
  ON churn_score (tenant_id, risk_band, computed_at DESC) WHERE is_current = TRUE AND risk_band <> 'LOW';
```

> **Notă v1.0.1:** Comentariul anterior din v1.0.0 ("pricing_model_registry e reutilizat ca registry generic models — rename viitor or new table; v1 reuses it") este **rezolvat**. Registry-ul canonic se cheamă acum `ml_model_registry` (vezi `ml-pricing-ga` v1.0.2 §4.1). View-ul `pricing_model_registry` rămâne disponibil read-only pentru backwards-compat dar codul nou (inclusiv churn) folosește direct numele canonic.

### 4.2 Tabel `churn_outcome`

(Identic cu v1.0.0 §4.2.)

### 4.3 Tabel `churn_cs_task`

(Identic cu v1.0.0 §4.3.)

### 4.4 Tabel `churn_kpi_daily`

(Identic cu v1.0.0 §4.4.)

### 4.5 Tabel `churn_features_snapshot`

(Identic cu v1.0.0 §4.5.)

---

## 5. API Contracts

(Identic cu v1.0.0 §5. ★ În service layer, `getCurrentChurnGA()` folosește `ml_model_registry` filtrat la `model_name='churn-gbm'`.)

```typescript
// services/churn/registry.ts (v1.0.1)
const CHURN_MODEL_NAME = 'churn-gbm';

export async function getCurrentGA(): Promise<RegistryRow | null> {
  return db.selectFrom('ml_model_registry')                    // ★ canonical (post-0600)
    .where('model_name', '=', CHURN_MODEL_NAME)
    .where('status', '=', 'GA')
    .selectAll()
    .executeTakeFirst();
}
```

---

## 6. Algorithms

(Identic cu v1.0.0 §6.)

## 7. State Machines

(Identic cu v1.0.0 §7.)

## 8. Concurrency

(Identic cu v1.0.0 §8.)

## 9. Caching

(Identic cu v1.0.0 §9.)

## 10. Background Jobs

(Identic cu v1.0.0 §10.)

## 11. Error Handling

(Identic cu v1.0.0 §11.)

## 12. Security & GDPR

(Identic cu v1.0.0 §12.)

## 13. Observability

(Identic cu v1.0.0 §13.)

## 14. Performance Budgets

(Identic cu v1.0.0 §14.)

## 15. Testing Strategy

(Identic cu v1.0.0 §15.)

### 15.7 ★ Tests v1.0.1 (cross-spec rename safety)

- Migration order test: 0540–0544 (churn) trebuie aplicată **după** 0500–0503 (pricing baseline) și înainte sau după 0600 (rename) — verificat prin migration runner DAG.
- Post-rename FK valid: `INSERT INTO churn_score (model_id=...)` cu un `model_id` existent în `ml_model_registry` (cu `model_name='churn-gbm'`) — succes.
- Negative: insert cu `model_id` care există dar are `model_name='pricing-gbm'` — accept la nivel BD (FK valid pe `ml_model_registry`); însă **filtru aplicare** la service layer (§5) garantează că churn nu folosește accidental model pricing.

---

## 16. Deployment & Rollout

(Identic cu v1.0.0 §16.)

### 16.5 ★ Ordine deploy vs migrarea 0600

| Pas | Acțiune | Ordine |
|---|---|---|
| 1 | Deploy migrarea 0600 (`ml-pricing-ga` v1.0.2) — RENAME + view | înainte de orice cod v1.0.1 |
| 2 | Deploy cod churn-ga v1.0.1 (referință `ml_model_registry`) | după 0600 |
| 3 | Verify post-deploy: `SELECT count(*) FROM ml_model_registry WHERE model_name='churn-gbm' AND status='GA'` returnează ≥1 dacă era ≥1 înainte | smoke test |

Dacă codul v1.0.1 ajunge înainte de migrare 0600 → fallback view-ul vechi încă funcționează (read-only) → fără impact funcțional pe churn citiri; writes ale churn (NU ținta migrării) rămân OK.

---

## 17. Migration Strategy

```
0540_churn_score.sql                    -- v1.0.0 baseline
0541_churn_outcome.sql                  -- v1.0.0 baseline
0542_churn_cs_task.sql                  -- v1.0.0 baseline
0543_churn_kpi_daily.sql                -- v1.0.0 baseline
0544_churn_features_snapshot.sql        -- v1.0.0 baseline
(★ Dependență: 0600 din ml-pricing-ga v1.0.2 — rename pricing_model_registry → ml_model_registry)
```

Niciun migration nou introdus de v1.0.1. FK-ul în 0540 referențiază `ml_model_registry` post-rename (sau `pricing_model_registry` dacă instalat înainte de 0600 — în acest caz rename-ul propagă FK-urile transparent).

---

## 18. Risks & Mitigations

(Identic cu v1.0.0 §18.)

---

## 19. CS Playbook

(Identic cu v1.0.0 §19.)

---

## 20. Impact Assessment

### 20.1 Scope of Change

| Element | Detaliu |
|---|---|
| Document | TECH_SPEC_REVYX_churn-ga_v1.0.1.md |
| Tip | PATCH (referință registry actualizată, doc-only) |
| Aria | Cross-spec naming · BRD reference resolution — closes F-03 HIGH + F-09 MED |
| Origine | F-03 HIGH + F-09 MED audit S9 |

### 20.2 Impact pe documente conexe

| Document | Impact | Acțiune |
|---|---|---|
| `ml-pricing-ga` v1.0.2 | Direct dependency (rename) | Aliniat |
| `audit-log` v1.1.0 | None | Cross-ref Phase 5 catalog deja aliniat |
| BRD v1.1.0 §6.4 | Pilon Retention canonic | Cross-ref aliniat (F-09 closed) |
| `tenancy-roles-extension` v1.1.0 | None | Cross-ref `cs_user`/`cs_lead` aliniat |

### 20.3 Impact pe scoring

(Identic cu v1.0.0 §20.3.)

### 20.4 Impact pe entități / schema BD

| Entitate | Modificare | Migrare |
|---|---|---|
| `churn_score` | NONE (FK redirected transparent) | — |

### 20.5 Impact pe RBAC

(Identic cu v1.0.0 §20.5.)

### 20.6 Impact pe SLA & NFR

(Identic cu v1.0.0 §20.6.)

### 20.7 Securitate & GDPR

(Identic cu v1.0.0 §20.7.)

### 20.8 Test Plan

Vezi §15.7.

### 20.9 Rollout & Rollback

Vezi §16.5. Rollback prin reversiune migrare 0600 (`ml-pricing-ga` v1.0.2 §16.4) — churn rămâne funcțional fie pre, fie post rename.

### 20.10 Approval Gate

| Aprobator | Necesar pentru |
|---|---|
| Solution Architect | Cross-spec naming alignment |
| Senior DBA | FK redirect transparent confirmation |
| Data Science Lead | Service-layer model_name filter |
| Senior PM | BRD §6.4 cross-ref |

---

*docs/tech-spec/TECH_SPEC_REVYX_churn-ga_v1.0.1.md · v1.0.1 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
