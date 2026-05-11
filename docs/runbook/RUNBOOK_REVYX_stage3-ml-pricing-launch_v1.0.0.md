# RUNBOOK — REVYX Phase 5 Stage 3 ML Pricing CANARY launch (T+35 → T+56)
<!-- RUNBOOK_REVYX_stage3-ml-pricing-launch_v1.0.0.md · v1.0.0 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-06 | DS Lead + Solution Architect + Senior QA + Security Lead + Backend Lead + DPO + Audit Lead | ★ Initial — operational runbook day-by-day Stage 3 (ML Pricing CANARY 5% → 25%) per `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §6 + `TECH_SPEC_REVYX_ml-pricing-ga` v1.0.2 §16 · model `pricing-gbm v2.0.0` SHADOW 28d PASS · CANARY 5% T+35→T+42 · CANARY 25% T+42→T+56 (cu 4-eyes admin sign-off la fiecare promote) · acoperă bias monitoring + drift alerting + auto-rollback wiring + day-by-day cu owners + audit events așteptate + rollback decision tree expandat · creat post-S14 audit pass `AUDIT_REVYX_s14-external-pass` v1.0.0 §6 (Stage 3 entry unblocked, F-S11-08 op-closed) |

---

## 1. Scop

Acest runbook este **operational day-by-day** pentru Stage 3 Phase 5 (ML Pricing CANARY rollout 5% → 25%). Master gate `phase5-rollout-sequence` v1.0.0 §6 definește entry/exit gates; acest doc descrie **execuția** zilnică cu owners, comenzi, audit events așteptate. Cohort este **toți tenanții activi** cu `flag.pricing_ml_ga.enabled=true`, ramp cohort_pct 5 → 25.

| Atribut | Valoare |
|---|---|
| Stage | 3 — ML Pricing CANARY (5% → 25%) |
| Durată | T+35 → T+56 zile (21 zile cu 2 promote gates) |
| Cohort target | Tenants Phase 5 active (excl. tenant pilot Stage 2); ramp cohort_pct 5 → 25 cohort-stable hashing pe `property_id` (per `ml-pricing-ga` §6.3 deterministic bucket) |
| Distribuție | Feature flag `flag.pricing_ml_ga.cohort_pct={5,25}` + `flag.pricing_ml_ga.enabled=true` |
| Owner | DS Lead (model owner) · Solution Architect (auto-rollback) · Senior QA (smoke + monitoring) · Security Lead (4-eyes approval + bias) · Backend Lead (API + events) · DPO (model card + bias compliance) · Audit Lead (gating) |
| Timezone | UTC+2 (Chișinău) — toate timestamp-urile interne |
| Cross-spec | `ml-pricing-ga` v1.0.2 (§6.1 A/B gates, §6.4 drift alert, §6.5 bias check, §16 rollout) · `audit-log` v1.1.1 §4.4.1 (`PRICING_MODEL_*`) + §4.4.9 (`PHASE5_*`) · `DPIA_REVYX_phase5` v1.0.0 §5.3 ml-pricing · `incident-response` v1.0.0 (auto-rollback PD on-call) |

---

## 2. Pre-flight T+34 (verificare entry gates pre-T+35 GO)

| # | Gate (din `phase5-rollout-sequence` §6.1 + `READINESS_REVYX_phase5` §5.1) | Owner | Verificare |
|---|---|---|---|
| 3.1 | Stage 2 exit gates ✅ (9/9 PASS per `AUDIT_REVYX_s14-external-pass` §2.1) | Audit Lead | Link `READINESS_REVYX_phase5` v1.0.3 §4.2 + AUDIT_REVYX_s14 §2.1 |
| 3.2 | Migrarea 0600 RENAME + view backwards-compat aplicată în prod | Senior DBA | `psql -c "SELECT to_regclass('ml_model_registry')"` returnează NOT NULL + view `pricing_model_registry` SELECT-only |
| 3.3 | Model `pricing-gbm v2.0.0` SHADOW ≥14 zile + monitoring PASS | DS Lead | `ml_model_registry.status='SHADOW'` cu `trained_at < now()-14d` + MAE_shadow_rolling_7d report `≤ MAE_baseline × 1.05` |
| 3.4 | Bias check `district` + `property_type` (<1 `PRICING_MODEL_BIAS_ALERT`/lună în SHADOW) | DS Lead | AUDIT_LOG count `PRICING_MODEL_BIAS_ALERT` ultima lună = 0; max `mean_err_district ≤ 0.05` |
| 3.5 | Model card publicat (`model_card_uri` non-NULL) | DS Lead + DPO | `docs/model-cards/pricing-v2.0.0.md` exists; sign-off DS Lead + Solution Architect + Security Lead + DPO documentat |
| 3.6 | Approver IDs configurați (primary + second admin distinct) | Security Lead | `app_config.4eyes.approvers={admin_a,admin_b,admin_c}` cu admin_a≠admin_b în approval flow runtime |
| 3.7 | `PRICING_MODEL_*` events 10/10 funcționale (audit-log §4.4.1) | Backend Lead | Smoke test staging: 10 events emit cu payload assertNoPII PASS |
| 3.8 | Auto-rollback wired (3 consecutive CRITICAL drift OR 30% delta → `PRICING_MODEL_AUTO_ROLLBACK`) | Solution Architect | Chaos test staging: 3 injected CRITICAL → rollback fired în <30s |
| 3.9 | ★ 4-eyes E2E smoke-test PASS pe staging (F-S11-08 op-closed) | Senior QA | Staging rehearsal 2026-05-30 (cf. `AUDIT_REVYX_s14-external-pass` §3.1); evidence în `legal-vault/test-evidence/4eyes-e2e/2026-05-30/` |

**Decizie pre-flight:** dacă **toate** ☑ → emit `PHASE5_STAGE_ENTRY` event (manual, owner: Backend Lead via admin tool) cu `{stage:3, stage_name:'ml_pricing_canary', entry_gates_status:'PASS', approver_ids:[cto,ds_lead,audit_lead], dpia_version:'1.0.0', readiness_doc_uri, model_id:'<pricing-gbm-v2.0.0-uuid>', initial_cohort_pct:5}`; altfel defer +1 săpt.

**Decizie 3-eyes:** CTO + DS Lead + Audit Lead sync T+34 16:00 UTC+2 confirmation GO.

---

## 3. Sequence day-by-day

### 3.1 T+35 (Luni) — Pre-flight + 4-eyes promote CANARY 5%

| Ora (UTC+2) | Acțiune | Owner | Output / Audit event |
|---|---|---|---|
| 09:00 | Pre-flight 3-eyes sync confirm GO (CTO + DS Lead + Audit Lead) | Audit Lead | `READINESS_REVYX_phase5` v1.0.3 §5.1 sign-off |
| 09:30 | Emit `PHASE5_STAGE_ENTRY` event manual cu metadata complete | Backend Lead | AUDIT_LOG verified |
| 10:00 | 4-eyes REQUEST: `POST /api/v1/admin/pricing/models/:id/promote` cu `{target:'CANARY',cohortPct:5}` (admin_a = DS Lead) | DS Lead | `PRICING_MODEL_4EYES_REQUEST` event emis cu `request_id`, `expires_at=now+24h` |
| 10:30 | 4-eyes APPROVE: admin_b = Security Lead `POST /api/v1/admin/pricing/models/:id/4eyes-approve` cu `request_id` | Security Lead | `PRICING_MODEL_4EYES_APPROVED` + `PRICING_MODEL_PROMOTED_CANARY` events; `flag.pricing_ml_ga.cohort_pct=5` |
| 11:00 | Smoke test E2E prod: 200 requests, ~10 ML path (5%), ~190 baseline; verify routing deterministic pe property_id hash | Senior QA + Backend Lead | E2E test PASS + AUDIT_LOG count match |
| 11:30 | DS Lead inspect Grafana dashboard `pricing-ga-canary`: MAE_ml_5pct vs MAE_baseline_95pct rolling 1h | DS Lead | Dashboard screenshot + Slack #pricing-canary |
| 14:00 | DPO verify model card link + assertNoPII pe payload `PRICING_MODEL_PROMOTED_CANARY` | DPO + Senior QA | Verification PASS |
| 17:00 | Daily standup #pricing-canary — green/red status | DS Lead | Slack thread |

**Health threshold T+35:** zero `PRICING_MODEL_AUTO_ROLLBACK` events; routing 5% confirmed cohort-stable; MAE_ml vs baseline delta ±5%.

### 3.2 T+36 → T+41 (Marți-Duminică săpt 6) — CANARY 5% stabilization

- Telemetria zilnică (Sentry + AUDIT_LOG + Grafana `pricing-ga-canary`):
  - `PRICING_MODEL_DRIFT_ALERT` count rolling 24h (target 0 CRITICAL, ≤1 HIGH/zi).
  - `PRICING_MODEL_BIAS_ALERT` count rolling 7d (target 0 HIGH/CRITICAL; LOW informativ).
  - `MAE_ml_5pct_rolling_7d` vs `MAE_baseline_95pct_rolling_7d` — ratio ≤1.05 zilnic.
  - `MAPE_ml_5pct_rolling_7d` vs baseline — idem.
  - `PRICING_MODEL_NOT_FOUND` fallback count (target 0).
  - Latency p95 ML inference (target <200ms warm; <500ms cold start).
- DS Lead emite raport zilnic Slack #pricing-canary la 17:00.
- Senior QA verifică `assertNoPII(audit_log_compliance_view.row WHERE event_name LIKE 'PRICING_%')` la T+38 + T+41.

**Audit events așteptate cumulative (T+36..T+41):**

| Event | Expected (6 zile) | Threshold |
|---|---|---|
| `PRICING_MODEL_PREDICTION` (per request ML path) | ~1500 (5% × estimat 30k requests) | informativ |
| `PRICING_MODEL_DRIFT_ALERT` (LOW) | ≤6 (≤1/zi) | <2/zi sustained |
| `PRICING_MODEL_DRIFT_ALERT` (HIGH) | ≤2 | <1/zi sustained |
| `PRICING_MODEL_DRIFT_ALERT` (CRITICAL) | 0 | exact 0 (trigger auto-rollback la 3 consecutive) |
| `PRICING_MODEL_BIAS_ALERT` (HIGH/CRITICAL) | 0 | exact 0 |
| `PRICING_MODEL_AUTO_ROLLBACK` | 0 | exact 0 |
| `PRICING_MODEL_NOT_FOUND` | <5 | informativ |

**Trigger rollback intermediate (T+36..T+41):**
- `PRICING_MODEL_AUTO_ROLLBACK` fired → AUTO branch §5 (PD pricing-on-call P1).
- MAE_ml_5pct vs baseline ratio sustained >1.15 (>15% degradare) 24h → MANUAL rollback `PRICING_MODEL_ROLLED_BACK` reason='MANUAL_DRIFT'.
- BIAS_ALERT HIGH/CRITICAL pe district X → PAUSE ramp; DS Lead retrain cu fairness constraint.

### 3.3 T+42 (Luni) — Health check + decizie ramp CANARY 25%

| Ora | Acțiune | Owner | Output |
|---|---|---|---|
| 09:00 | Day 7 (CANARY 5%) health review (DS Lead + Solution Architect + Audit Lead + Security Lead) | DS Lead | Decision sheet GO/HOLD pentru ramp 25% |
| 09:30 | Verificare gate criteria T+42 (§6.1 ml-pricing-ga §6.1): MAE_ml_5pct ≤ MAE_baseline_95pct × 0.97 (≥3% mai bun real) · zero CRITICAL · ≤1 HIGH alert sustained | DS Lead | Health report cu raw metrics CSV |
| 10:00 | Decizie GO ramp 25%: 4-eyes REQUEST admin_a = DS Lead `POST .../promote {target:'CANARY',cohortPct:25}` | DS Lead | `PRICING_MODEL_4EYES_REQUEST` cu `request_id` |
| 10:30 | 4-eyes APPROVE admin_b = Solution Architect (sau Security Lead backup) | Solution Architect | `PRICING_MODEL_4EYES_APPROVED` + `PRICING_MODEL_PROMOTED_CANARY` cohort_pct=25 |
| 11:00 | Smoke test E2E: 200 requests, ~50 ML path (25%), ~150 baseline | Senior QA + Backend Lead | E2E PASS + routing verify |
| 14:00 | DS Lead inspect `pricing-ga-canary-25pct` dashboard primul 4h trafic | DS Lead | Slack #pricing-canary update |
| 17:00 | Standup | DS Lead | Slack thread |

**Decizie health T+42:** dacă criteria PASS → ramp 25%; dacă <target → defer ramp +7 zile + remediere; dacă >5% degradare → MANUAL rollback la `cohort_pct=0` + analiză.

### 3.4 T+43 → T+55 (13 zile) — CANARY 25% stabilization + drift monitoring

- Telemetria intensivă (frecvență dublă față de Stage 5%):
  - `PRICING_MODEL_DRIFT_ALERT` rolling 7d ≤1 CRITICAL (trigger auto-rollback la 3 consecutive 1h).
  - `MAE_ml_25pct_rolling_7d` vs `MAE_baseline_75pct_rolling_7d` ratio target ≤0.95 (≥5% mai bun).
  - `MAPE_ml_25pct_rolling_7d` vs baseline target ≤0.90 (≥10% mai bun).
  - `bias_district_max_delta_rolling_7d` target ≤0.05.
  - `PRICING_MODEL_OUTCOME_JOIN` count (DEAL won within 30d post-prediction) — backfill OK.
- DS Lead emite raport zilnic Slack #pricing-canary.
- Senior QA verifică drift dashboard la T+49 (mid-window) + T+54 (pre-exit).
- DPO re-review bias compliance T+50 cross-check `bias_district_max_delta` distribuție.

**Cohort 25% gate (per ml-pricing-ga §6.1):** stabil ≥14 zile = T+42→T+56 exact window.

### 3.5 T+56 (Luni) — Exit gate review + Stage 4 readiness

| Ora | Acțiune | Owner | Output |
|---|---|---|---|
| 09:00 | Compile metrici exit gate (`READINESS_REVYX_phase5` §5.2) | Senior QA + DS Lead | Metrics CSV + dashboard screenshot |
| 10:00 | Exit gate review meeting (CTO + DS Lead + Audit Lead) | Audit Lead | Sign-off ☑ sau hold |
| 10:30 | Dacă PASS → emit `PHASE5_STAGE_EXIT_PASS` event manual cu `{stage:3, stage_name:'ml_pricing_canary', exit_metrics:{mae_delta,mape_delta,bias_alerts_high,auto_rollback_fired,four_eyes_audit_trail,cohort_25pct_stable_days}, ready_for_next_stage:true, signed_off_by:[cto,ds_lead,audit_lead]}` | Backend Lead | AUDIT_LOG |
| 11:00 | Update `READINESS_REVYX_phase5` §5.2 cu valori măsurate + ☑ sign-off | Audit Lead | Doc PATCH bump v1.0.4 |
| 11:30 | Pre-flight sync Stage 4 (Churn pilot CS dry-run) — entry gates §7.1 din phase5-rollout-sequence | Audit Lead + CS Lead + DS Lead | Slack #phase5-rollout |
| 14:00 | Retrospective Stage 3 — Slack #pricing-canary — lessons learned + `RETROSPECTIVE_STAGE3.md` notes | DS Lead | Notes |

**Decizie GA promote 100%:** NU în Stage 3 scope. Promote 100% GA programat la T+91 (Master GA decision §9 phase5-rollout-sequence) după Stage 5 close. Stage 3 exit doar valida CANARY 25% stabil 14+ zile.

---

## 4. Daily health check protocol

DS Lead rulează **zilnic la 17:00 UTC+2** următorul protocol și postează în Slack #pricing-canary:

```
T+<N> Health Report — Stage 3 ML Pricing CANARY

1. Cohort pct activ: __ (5 / 25)
2. PRICING_MODEL_PREDICTION count 24h: __ (ML path)
3. MAE_ml_<pct>_rolling_7d: __ / MAE_baseline_complement_rolling_7d: __ → ratio: __
   (target 5%: ≤1.05 · target 25%: ≤0.95)
4. MAPE_ml_<pct>_rolling_7d: __ / baseline: __ → ratio: __
5. PRICING_MODEL_DRIFT_ALERT counts 24h: __ LOW / __ HIGH / __ CRITICAL
6. PRICING_MODEL_BIAS_ALERT counts 7d: __ LOW / __ HIGH / __ CRITICAL
7. bias_district_max_delta_rolling_7d: __ (target ≤0.05)
8. PRICING_MODEL_AUTO_ROLLBACK fired: __ (target 0)
9. PRICING_MODEL_NOT_FOUND fallback count: __
10. Latency p95 ML inference: __ms (target <200ms warm)
11. 4-eyes approval audit trail intact (request → approved): Y/N (target Y)
12. Verdict: 🟢 / 🟡 / 🔴
```

**Threshold escalation:**
- 🟡 → email DS Lead + Solution Architect + Audit Lead + Security Lead.
- 🔴 → page DS Lead + Pricing-on-call via PagerDuty + emergency standup în 2h + invocă §5 rollback decision tree.

---

## 5. Rollback decision tree (expandat din `ml-pricing-ga` §6.4 + `phase5-rollout-sequence` §6.4)

```
[PRICING_MODEL_AUTO_ROLLBACK fired?]
   ├─ YES → AUTO ROLLBACK CRITICAL:
   │     ├─ `flag.pricing_ml_ga.cohort_pct=0` automat aplicat de auto-rollback handler
   │     ├─ `ml_model_registry.status='ROLLED_BACK'` cu `rollback_reason='AUTO_DRIFT'`
   │     ├─ Previous baseline reactivat (no GA model înlocuit, doar cohort_pct → 0)
   │     ├─ PD pricing-on-call P1 (Solution Architect + DS Lead)
   │     ├─ INC_DECLARED severity:P1 (model degradation risk pricing accuracy)
   │     ├─ Post-mortem în 48h conform `incident-response` §6
   │     └─ Re-promote permis doar după re-training + SHADOW 7d + cooldown 7 zile
   └─ NO → next branch

[MAE_ml vs baseline ratio sustained >1.15 24h (degradare >15%)?]
   ├─ MANUAL ROLLBACK:
   │     ├─ 4-eyes REQUEST `cohortPct=0` (admin_a) + APPROVE (admin_b)
   │     ├─ `PRICING_MODEL_ROLLED_BACK` event cu `reason='MANUAL_DRIFT'`
   │     ├─ DS Lead investigate root cause (feature drift / data quality)
   │     └─ Defer Stage 3 exit +7 zile
   └─ next

[PRICING_MODEL_BIAS_ALERT HIGH/CRITICAL pe district X sustained 48h?]
   ├─ PAUSE ramp (no promote 5%→25%; sau cohort_pct=5 stay)
   ├─ DS Lead retrain cu fairness constraint (per ml-pricing-ga §6.5)
   ├─ Re-promote SHADOW 7d cu noul model
   ├─ DPO consultation pe DPIA §5.3 bias balancing test
   └─ Reset Stage 3 timeline +14 zile (SHADOW + CANARY restart)

[PRICING_MODEL_NOT_FOUND fallback >5%?]
   ├─ INVESTIGATE: model registry sync (Redis cache stale?) sau model_id gone
   ├─ Hotfix backend: refresh cache + verify model_id consistency
   └─ Re-test smoke E2E înainte de continue ramp

[4-eyes approval blocat 24h+ (request expirat fără approve)?]
   ├─ Defer ramp; DS Lead re-emit REQUEST
   ├─ Verify approver availability (rotation policy)
   └─ Override admin permis doar cu reason + AUDIT (per ml-pricing-ga R4)

[Latency p95 ML inference >500ms sustained 1h?]
   ├─ INVESTIGATE: ONNX runtime warm cache / GC pressure
   ├─ Activate cold-rollback (cohort_pct=0 temp) dacă SLO breach
   ├─ Solution Architect tune worker pool
   └─ Resume after p95 <250ms sustained 15 min
```

**Rollback execution audit:** orice rollback (auto sau manual) emite `PHASE5_STAGE_ROLLBACK` event manual cu metadata `{stage:3, rollback_reason, decision_tree_branch, rollback_executed_by, rollback_at, follow_up_inc_id?}` în plus față de `PRICING_MODEL_ROLLED_BACK` / `PRICING_MODEL_AUTO_ROLLBACK`.

---

## 6. Audit events expected (Stage 3 cumulative T+35 → T+56)

| Event | Source | Expected count | Threshold |
|---|---|---|---|
| `PHASE5_STAGE_ENTRY` (stage=3) | Manual T+35 | 1 | exact 1 |
| `PRICING_MODEL_4EYES_REQUEST` | Per promote (2 promotes Stage 3: 5% + 25%) | 2 | exact 2 (+ retry-uri) |
| `PRICING_MODEL_4EYES_APPROVED` | Per approve | 2 | exact 2 |
| `PRICING_MODEL_PROMOTED_CANARY` | Auto post-4eyes | 2 | exact 2 (cohort_pct=5 + 25) |
| `PRICING_MODEL_PREDICTION` | Per ML request | ~10000 (5%×7d + 25%×14d) | informativ |
| `PRICING_MODEL_DRIFT_ALERT` (LOW) | Drift monitor | ~20 | <30 sustained |
| `PRICING_MODEL_DRIFT_ALERT` (HIGH) | Drift monitor | ≤7 | <2/zi |
| `PRICING_MODEL_DRIFT_ALERT` (CRITICAL) | Drift monitor | 0 | exact 0 (trigger auto-rollback la 3 consec) |
| `PRICING_MODEL_BIAS_ALERT` (HIGH/CRITICAL) | Bias check daily | 0 | exact 0 |
| `PRICING_MODEL_AUTO_ROLLBACK` | Auto-handler | 0 | exact 0 |
| `PRICING_MODEL_NOT_FOUND` | Routing fallback | <50 | informativ |
| `PRICING_MODEL_OUTCOME_JOIN` | Outcome join job | ~500 (DEAL won within 30d) | informativ |
| `PHASE5_STAGE_EXIT_PASS` (stage=3) | Manual T+56 | 1 | exact 1 dacă PASS |

---

## 7. Bias & fairness monitoring protocol

### 7.1 Daily bias check (cron 03:00 UTC+2)

```sql
-- Job: pricing.bias.check.daily
WITH district_errors AS (
  SELECT
    p.district,
    AVG(p.predicted_price - o.actual_price) AS mean_err,
    COUNT(*) AS n
  FROM pricing_prediction_audit p
  JOIN pricing_outcome_join o ON p.prediction_id = o.prediction_id
  WHERE p.predicted_at > now() - interval '7 days'
    AND o.actual_price IS NOT NULL
  GROUP BY p.district
  HAVING COUNT(*) >= 30
)
SELECT district, mean_err, n,
  CASE
    WHEN ABS(mean_err) > 0.10 THEN 'CRITICAL'
    WHEN ABS(mean_err) > 0.05 THEN 'HIGH'
    WHEN ABS(mean_err) > 0.03 THEN 'MEDIUM'
    ELSE 'LOW'
  END AS severity
FROM district_errors
WHERE ABS(mean_err) > 0.03;
```

Output → AUDIT_LOG `PRICING_MODEL_BIAS_ALERT` per row HIGH/CRITICAL. Districte cu `n<30` (rurale) marcate `LOW (insufficient sample)` și fallback baseline forțat (per ml-pricing-ga §6.5 R7).

### 7.2 DPO sign-off pe bias report T+50 (mid-Stage 3)

DPO review săptămânal pe `bias_district_max_delta` distribuție + cumulative `PRICING_MODEL_BIAS_ALERT` counts. Confirmation Slack #privacy-watch + sign-off în AUDIT_LOG cu `DPO_BIAS_REVIEW_PASS` event (cosmetic; pe audit-log v2.0.0 catalog) sau în absența eventului dedicat, sign-off documentat în `READINESS_REVYX_phase5` §5.2 sub Stage 3 progress notes.

---

## 8. Tenant cohort selection criteria

### 8.1 Tenant eligibility (CANARY 5% + 25%)

- Toți tenants `plan.tier IN ('GROWTH','BUSINESS','ENTERPRISE')` cu `flag.pricing_ml_ga.enabled=true`.
- Excludere tenant pilot Stage 2 (marketplace pilot) pentru evita interaction effects.
- Routing deterministic pe `property_id` hash (per ml-pricing-ga §6.3): cohort-stable, nu se schimbă în mid-experiment.
- Tenants `plan.tier='FREE'` sau `'TRIAL'` → baseline only (nu sunt în CANARY).

### 8.2 Property cohort

- Toate property-urile cu status `ACTIVE` sau `STALE` (excl. `ARCHIVED`).
- Filtrare automate la `n_features_complete < 8` (min schema) → fallback baseline cu reason='FEATURE_INCOMPLETE'.
- Property cu district `n<30` (rurale) → fallback baseline (bias prevention §6.5 R7).

### 8.3 Exclusion criteria

- Tenants în trial period (<30 zile).
- Tenants cu `plan.payment_overdue > 7d` (Stripe blocked).
- Properties cu `feature_schema_hash` mismatch (auto-fallback per ml-pricing-ga §6.6).

---

## 9. Cross-references


- `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §6 — master gate Stage 3
- `RUNBOOK_REVYX_stage2-marketplace-launch` v1.0.0 — Stage 2 antecedent (T+14..T+35)
- `READINESS_REVYX_phase5` v1.0.3 §5 — sign-off matrix Stage 3 (updated S15)
- `TECH_SPEC_REVYX_ml-pricing-ga` v1.0.2 — model registry rename + canary discipline
- `TECH_SPEC_REVYX_ml-pricing-ga` v1.0.0 §6.1 (A/B gates) + §6.4 (drift alert) + §6.5 (bias check) + §16 (rollout)
- `TECH_SPEC_REVYX_audit-log` v1.1.1 §4.4.1 — `PRICING_MODEL_*` events catalog + §4.4.9 — `PHASE5_*` events
- `DPIA_REVYX_phase5` v1.0.0 §5.3 — ml-pricing balancing test
- `docs/model-cards/pricing-v2.0.0.md` — model card (Stage 3 entry gate 3.5)
- `RUNBOOK_REVYX_incident-response` v1.0.0 §6 — auto-rollback INC P1 protocol
- `AUDIT_REVYX_s14-external-pass` v1.0.0 §3.1 + §6 — F-S11-08 op-closed + Stage 3 entry unblocked

---

## 10. Approval

| Aprobator | Sign-off |
|---|---|
| DS Lead | ✅ |
| Solution Architect | ✅ |
| Senior QA / Test Architect | ✅ |
| Security Lead | ✅ |
| Backend Lead | ✅ |
| DPO | ✅ |
| Audit Lead | ✅ |
| CTO | ✅ |

---

*docs/runbook/RUNBOOK_REVYX_stage3-ml-pricing-launch_v1.0.0.md · v1.0.0 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
