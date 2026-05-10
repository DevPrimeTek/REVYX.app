# TECH SPEC — ML PRICING GA (Graduation 100% + Shadow/Canary Discipline)
<!-- TECH_SPEC_REVYX_ml-pricing-ga_v1.0.2.md · v1.0.2 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Solution Architect + Data Science Lead | Spec inițială S8 — graduate ML pricing din A/B la 100% trafic · A/B gates · rollout · monitoring post-GA · shadow mode · model card |
| 1.0.1 | 2026-05 | (rezervat — nu emis; săritură pentru aliniere semver între ml-pricing-ga și marketplace/white-label fixați la v1.0.1 inline pe S9 audit) | — |
| 1.0.2 | 2026-05 | Senior PM + Solution Architect + DBA | ★ Closes F-03 HIGH (AUDIT_REVYX_s8-external-pass v1.0.0) — rename `pricing_model_registry` → `ml_model_registry` ca registry generic ML (pricing + churn + viitor) · migrarea 0600 ALTER TABLE + CREATE VIEW backwards-compat · update referințe spec către `ml_model_registry` cu marker ★ · zero breaking change pentru consumatori (view `pricing_model_registry` păstrează contractul) |

---

> **Backwards compat (v1.0.0/1 → v1.0.2):**
> - **Doar** numele tabelei se schimbă (`pricing_model_registry` → `ml_model_registry`).
> - **View read-only `pricing_model_registry`** păstrează shape-ul așteptat de codul vechi (filtrată la `model_name LIKE 'pricing%'`).
> - **Writes**: codul nou trebuie să folosească `ml_model_registry` direct (canonical); writes pe view-ul vechi sunt **interzise** (view marcat read-only via privileges).
> - Schema coloanelor neschimbată; FK-urile existente din `pricing_prediction_audit`, `pricing_outcome_join`, `pricing_model_alert` sunt redirecționate la noul nume prin migrarea 0600 (`ALTER TABLE ... RENAME` păstrează FK transparently).

---

## Cuprins

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Stack & Dependencies](#3-stack--dependencies)
4. [Data Model](#4-data-model)
5. [API Contracts](#5-api-contracts)
6. [Algorithms (A/B Gates · Shadow · Canary · GA)](#6-algorithms)
7. [State Machines](#7-state-machines)
8. [Concurrency](#8-concurrency)
9. [Caching](#9-caching)
10. [Background Jobs](#10-background-jobs)
11. [Error Handling](#11-error-handling)
12. [Security](#12-security)
13. [Observability](#13-observability)
14. [Performance Budgets](#14-performance-budgets)
15. [Testing Strategy](#15-testing-strategy)
16. [Deployment & Rollout](#16-deployment--rollout)
17. [Migration Strategy](#17-migration-strategy)
18. [Risks & Mitigations](#18-risks--mitigations)
19. [Model Card](#19-model-card)
20. [Impact Assessment](#20-impact-assessment)

---

## 1. Executive Summary

(Identic cu v1.0.0 §1.)

---

## 2. Architecture Overview

(Identic cu v1.0.0 §2 — diagrama păstrată; etichetele `Model Registry` se referă acum la **`ml_model_registry`** pentru orice cod nou; `pricing_model_registry` rămâne ca view backwards-compat.)

---

## 3. Stack & Dependencies

(Identic cu v1.0.0 §3.)

---

## 4. Data Model

### 4.1 ★ Tabel `ml_model_registry` (rebotezat din `pricing_model_registry`) — F-03 closed

```sql
-- Migrare: 0600_rename_pricing_to_ml_model_registry.sql (★ S10)
-- Step 1: rename canonical table
ALTER TABLE IF EXISTS pricing_model_registry RENAME TO ml_model_registry;

-- Step 2: rename indexes for clarity (idempotent)
ALTER INDEX IF EXISTS idx_pricing_model_ga RENAME TO idx_ml_model_ga;

-- Step 3: backwards-compat read-only view (FOR SELECT writes redirected to canonical)
CREATE VIEW pricing_model_registry AS
  SELECT * FROM ml_model_registry WHERE model_name LIKE 'pricing%';

-- Step 4: revoke writes on view; grant SELECT only
REVOKE INSERT, UPDATE, DELETE ON pricing_model_registry FROM PUBLIC;
GRANT SELECT ON pricing_model_registry TO revyx_app, revyx_readonly;
COMMENT ON VIEW pricing_model_registry IS
  'BACKWARDS-COMPAT (v1.0.0/1) — filtrare pe model_name LIKE ''pricing%''. Codul nou folosește ml_model_registry. Writes via service layer pe canonical.';
```

**Schema canonică (neschimbată ca structură, doar redenumită):**

```sql
-- ml_model_registry (post-rename)
CREATE TABLE IF NOT EXISTS ml_model_registry (
  model_id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name            TEXT         NOT NULL,         -- 'pricing-gbm', 'churn-gbm', viitor 'recommendation-gbm', 'fraud-gbm'
  semver                TEXT         NOT NULL,
  artifact_uri          TEXT         NOT NULL,
  artifact_sha256       TEXT         NOT NULL,
  feature_schema_hash   TEXT         NOT NULL,
  trained_at            TIMESTAMPTZ  NOT NULL,
  trained_on_window     TSTZRANGE    NOT NULL,
  trained_on_rows       INTEGER      NOT NULL,
  eval_metrics          JSONB        NOT NULL,
  model_card_uri        TEXT         NOT NULL,
  status                TEXT         NOT NULL CHECK (status IN ('DRAFT','SHADOW','CANARY','GA','RETIRED','ROLLED_BACK')),
  promoted_to_ga_at     TIMESTAMPTZ  NULL,
  retired_at            TIMESTAMPTZ  NULL,
  rolled_back_reason    TEXT         NULL,
  created_by            UUID         NOT NULL,
  created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (model_name, semver)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ml_model_ga
  ON ml_model_registry (model_name) WHERE status = 'GA';
```

> **Convenție post-rename:** `model_name` rămâne unicul discriminator între familii (pricing-gbm vs churn-gbm vs viitor). Niciun model_name suprapus între familii. Spec-urile consumatoare (ml-pricing-ga, churn-ga, etc.) referează `ml_model_registry` direct.

### 4.2 Tabel `pricing_prediction_audit`

(Identic cu v1.0.0 §4.2; FK `model_id REFERENCES pricing_model_registry(model_id)` ★ rebrandat la `ml_model_registry(model_id)` automat prin `ALTER TABLE RENAME` — PostgreSQL păstrează FK-urile transparent.)

```sql
-- v1.0.2 reformulare comment în spec; SQL nou nu e necesar.
-- FK-ul existent rămâne valid post-rename:
-- FOREIGN KEY (model_id) REFERENCES ml_model_registry(model_id)
```

### 4.3 Tabel `pricing_outcome_join`

(Identic cu v1.0.0 §4.3; FK redirected la `ml_model_registry` post-rename.)

### 4.4 Tabel `pricing_model_alert`

(Identic cu v1.0.0 §4.4; FK redirected la `ml_model_registry` post-rename.)

---

## 5. API Contracts

(Identic cu v1.0.0 §5. Internal services `IPricingProvider`, `IPricingRouter`, `IPricingModelOps` păstrate; implementarea backend interogează `ml_model_registry` filtrat la `model_name='pricing-gbm'`.)

### 5.3 ★ Service-layer guard (v1.0.2)

```typescript
// services/pricing/registry.ts (v1.0.2)
const PRICING_MODEL_NAME = 'pricing-gbm';

export async function getCurrentGA(): Promise<RegistryRow | null> {
  return db.selectFrom('ml_model_registry')                    // ★ canonical table
    .where('model_name', '=', PRICING_MODEL_NAME)
    .where('status', '=', 'GA')
    .selectAll()
    .executeTakeFirst();
}
```

> **Ban:** searches code statice care țintesc `pricing_model_registry` ca tabel (nu view) → CI lint regula `no-direct-pricing-model-registry-table-write`. View-ul e disponibil pentru tooling vechi (read-only).

---

## 6. Algorithms

(Identic cu v1.0.0 §6.)

## 7. State Machines

(Identic cu v1.0.0 §7. State transitions pe `ml_model_registry.status`.)

## 8. Concurrency

(Identic cu v1.0.0 §8.)

## 9. Caching

(Identic cu v1.0.0 §9. Redis key `pricing:routing:current` păstrat — referință la `ml_model_registry` rândul GA filtrat la `model_name='pricing-gbm'`.)

## 10. Background Jobs

(Identic cu v1.0.0 §10.)

## 11. Error Handling

(Identic cu v1.0.0 §11.)

## 12. Security

(Identic cu v1.0.0 §12. AUDIT_LOG events `PRICING_MODEL_*` referă `ml_model_registry` rows; payload `metadata.registry_table='ml_model_registry'` adăugat pentru claritate forensic — vezi `audit-log` v1.1.0 §4.4.1.)

## 13. Observability

(Identic cu v1.0.0 §13.)

## 14. Performance Budgets

(Identic cu v1.0.0 §14.)

## 15. Testing Strategy

(Identic cu v1.0.0 §15.)

### 15.7 ★ Tests v1.0.2 (rename safety)

- Migration 0600 idempotency: `ALTER TABLE IF EXISTS ... RENAME` rerunable safe.
- View parity: `SELECT * FROM pricing_model_registry` returnează doar `model_name LIKE 'pricing%'` rows (test cu mixed pricing+churn rows în `ml_model_registry`).
- Negative: `INSERT INTO pricing_model_registry` → eroare (privilege REVOKE) — verificat ca rol `revyx_app`.
- Old code path test: cod legacy care SELECT din view-ul vechi primește rows pricing only.

---

## 16. Deployment & Rollout

(Identic cu v1.0.0 §16. v1.0.2 e migrare doc + DDL — fără rolling restart workers; DDL `ALTER TABLE RENAME` ia un AccessExclusiveLock scurt — programat în window low-traffic.)

### 16.4 ★ Rollback migrare 0600

```sql
-- 0600_down.sql (rezervat — execut manual în caz)
DROP VIEW IF EXISTS pricing_model_registry;
ALTER TABLE IF EXISTS ml_model_registry RENAME TO pricing_model_registry;
ALTER INDEX IF EXISTS idx_ml_model_ga RENAME TO idx_pricing_model_ga;
```

Rollback safe — niciun data loss. Aplicabil dacă post-rename se descoperă incompatibilitate critică la un consumer ne-anticipat.

---

## 17. Migration Strategy

```
0500_pricing_model_registry.sql              -- v1.0.0 baseline
0501_pricing_prediction_audit.sql            -- v1.0.0 baseline
0502_pricing_outcome_join.sql                -- v1.0.0 baseline
0503_pricing_model_alert.sql                 -- v1.0.0 baseline
★ 0600_rename_pricing_to_ml_model_registry.sql  -- v1.0.2 (S10): RENAME + view + revoke writes
```

Migrarea 0600 idempotentă (toate `IF EXISTS` / `OR REPLACE`).

---

## 18. Risks & Mitigations

(Identic cu v1.0.0 §18, plus:)

| # | Risc | Probab. | Impact | Mitigare |
|---|---|---|---|---|
| ★ R9 | Cod legacy scrie în `pricing_model_registry` (view) → eroare permisiuni | LOW | LOW | REVOKE + CI lint regula §5.3; fail fast la deploy |
| ★ R10 | Migrarea 0600 lock prea lung pe traffic spike | LOW | MED | Programat în window 02:00-04:00 UTC; lock <1 sec teoretic (rename = metadata-only DDL) |
| ★ R11 | View `pricing_model_registry` filtrare incorectă (de ex. churn model cu `model_name='pricing-...-test'` accidentally vizibil) | LOW | LOW | Test 15.7 (parity); convenție model_name strict (canonical naming PR review) |

---

## 19. Model Card

(Identic cu v1.0.0 §19.)

## 20. Impact Assessment

### 20.1 Scope of Change

| Element | Detaliu |
|---|---|
| Document | TECH_SPEC_REVYX_ml-pricing-ga_v1.0.2.md |
| Tip | PATCH (rename + view, no functional change) |
| Aria | Registry renaming · backwards-compat — closes F-03 HIGH |
| Origine | F-03 HIGH audit S9 (AUDIT_REVYX_s8-external-pass v1.0.0) |

### 20.2 Impact pe documente conexe

| Document | Impact | Acțiune |
|---|---|---|
| `churn-ga` v1.0.1 | Direct (rezolvă comentariul "Notă: pricing_model_registry e reutilizat ca registry generic — rename viitor") | Cross-ref `ml_model_registry` direct |
| `audit-log` v1.1.0 | Cross-ref event PRICING_MODEL_* metadata | Aliniat |
| BRD v1.1.0 | None | — |

### 20.3 Impact pe scoring

(Identic cu v1.0.0 §20.3.)

### 20.4 Impact pe entități / schema BD

| Entitate | Modificare | Migrare |
|---|---|---|
| `ml_model_registry` | RENAME din `pricing_model_registry` | 0600 |
| `pricing_model_registry` | NEW (view read-only, filtrată) | 0600 |
| `pricing_prediction_audit` | FK redirected automat la `ml_model_registry` | 0600 (transparent) |
| `pricing_outcome_join` | idem | 0600 (transparent) |
| `pricing_model_alert` | idem | 0600 (transparent) |

### 20.5 Impact pe RBAC

(Identic cu v1.0.0 §20.5.)

### 20.6 Impact pe SLA & NFR

(Identic cu v1.0.0 §20.6. Migration window <1 sec lock — neglijabil.)

### 20.7 Securitate & GDPR

| Aspect | Status | Notă |
|---|---|---|
| Acces tabel canonică | Restricted | View `pricing_model_registry` SELECT only |
| AUDIT events | DA | Toate `PRICING_MODEL_*` cu `metadata.registry_table='ml_model_registry'` |

### 20.8 Test Plan

Vezi §15.7.

### 20.9 Rollout & Rollback

Vezi §16.4. Hard rollback DDL <1 sec.

### 20.10 Approval Gate

| Aprobator | Necesar pentru |
|---|---|
| Solution Architect | Rename + view design |
| Senior DBA | Migration 0600 + lock semantics |
| Data Science Lead | Confirmation niciun consumer downstream rupt |
| Security Lead | Privileges view read-only |

---

*docs/tech-spec/TECH_SPEC_REVYX_ml-pricing-ga_v1.0.2.md · v1.0.2 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
