# TECH SPEC — REVYX ML Pricing GA (Bias Sample Gate Tightening PATCH)
<!-- TECH_SPEC_REVYX_ml-pricing-ga_v1.0.4.md · v1.0.4 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** Pre-development / S17 deliverable; F-S15-01 MED closure spec-side; pre-Stage 5 GA tightening.
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §6.2 M2.S4 (Phase F ML Pricing backend) + §7 Phase 5 staged rollout.
**Roadmap ref:** `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §2.2 T-S17-06.
**Trigger:** Finding F-S15-01 MED din `AUDIT_REVYX_s15-external-pass` v1.0.0 §5.2 — DPO + Senior Compliance Auditor recommendation post 49 zile cumulative SHADOW+CANARY: bias rural districts borderline (Sângerei + Cahul + Ungheni mean_err_district ∈ [0.038, 0.041] cu sample n=30..38), sub HIGH threshold 0.05 dar la marginea superioară. Best-practice tightening pre Stage 5 GA + Phase 5 GA decision T+91 (cu volume ~4× mai mare decât CANARY 25%).

## 0.1 Platform Matrix

**Source canonical:** `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §15 (Modul 14 — ML Pricing & Churn).

Niciun impact pe UI surface în acest PATCH — config flag bump server-side only. Cross-ref Modul 14.3 (ML Model promote 4-eyes UI 🌐 Web only DP-05) și Modul 14.4 (Bias monitoring dashboard 🌐 Web only DP-05) păstrate neschimbate.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-04 | DS Lead + Solution Architect | ML Pricing GA initial spec — model registry + SHADOW/CANARY/GA gates + 4-eyes |
| 1.0.2 | 2026-05 | DS Lead + Senior DBA | PATCH F-03 HIGH — `pricing_model_registry` rename → `ml_model_registry` (migrare 0600) |
| 1.0.3 | 2026-06 | Senior Architect + Frontend Lead + SECURITY | PATCH DP-05 enforcement clarification — ML promote 4-eyes UI = WEB ONLY (admin); Bias monitoring dashboard = WEB ONLY; Pricing prediction display = BOTH |
| **1.0.4** | **2026-06** | ★ DS Lead + DPO + Senior Compliance Auditor + Senior Architect | ★ PATCH — **F-S15-01 MED closure spec-side** — bump `min_sample_district_n: 30 → 50` config flag pentru evita borderline bias alerts pe districte rurale cu sample mic pre-Stage 5 GA. DPIA §5.3 cross-ref update minor pentru tighter gate documented. Backwards compat **full** (config flag bump prin `ml_model_registry.config` JSON; no code change; instant rollout fără model retraining). NU breach GDPR Art. 22 (current state OK); este compliance best-practice tightening recommendation post 49 zile cumulative SHADOW+CANARY measurement (vezi `AUDIT_REVYX_s15-external-pass` §3 bias monitoring report + §5.2 finding detail). |

---

## 1. Platform Matrix cross-ref

**Source canonical:** `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §15 (Modul 14 — ML Pricing & Churn).

Cross-ref neschimbat față de v1.0.3 — toate UI clarificări (Modul 14.3 4-eyes Web only + Modul 14.4 Bias dashboard Web only + Modul 14.1/14.2 Pricing display/override BOTH) rămân valide.

## 2. Schimbare introdusă v1.0.4 (config flag bump)

### 2.1 Parametru afectat

| Parametru | v1.0.0/v1.0.2/v1.0.3 | **v1.0.4** | Locație |
|---|---|---|---|
| `min_sample_district_n` | 30 | **50** | `ml_model_registry.config` JSON per model row; `pricing.bias.min_sample_district_n` config key (BackOffice editable per `ml-pricing-ga` v1.0.0 §6.5 R7 fallback rule) |

### 2.2 Comportament

| Condiție | v1.0.0..v1.0.3 | v1.0.4 |
|---|---|---|
| District cu sample `n < 30` | Fallback baseline forțat (per §6.5 R7) | Fallback baseline forțat (unchanged) |
| District cu sample `n ∈ [30, 49]` | ML prediction returnată; `PRICING_MODEL_BIAS_ALERT` LOW emis dacă `mean_err > 0.035` (informativ) | **Fallback baseline forțat** (NEW v1.0.4); zero ML path în această zonă |
| District cu sample `n ≥ 50` | ML prediction returnată cu standard bias monitoring | ML prediction returnată cu standard bias monitoring (unchanged) |

### 2.3 Justificare statistică

49 zile cumulative SHADOW (28d) + CANARY 5% (7d) + CANARY 25% (14d) au evidențiat:
- 4 LOW bias alerts emise, toate auto-resolved în <72h pe rebalansare cohort
- 3 districte rurale (Sângerei, Cahul, Ungheni) cu mean_err_district ∈ [0.038, 0.041] și sample n=30..38 — sub HIGH threshold 0.05 dar la **marginea superioară statistică** (variance high în acest interval)
- Sample size n < 50 produce bias variance estimate cu CI 95% wide (>0.025), insufficient pentru distincție bias_real vs noise în districte rurale cu volume tranzactional redus

**Stage 5 GA va atinge volum mai mare** (toate tenants Enterprise + extended pilot post-T+91); sample mic rural va deveni mai frecvent fără tighter gate. Recomandare DPO + Senior Compliance Auditor: tighter gate pre-GA pentru evita borderline operațional + facilitate explainability sub Art. 22 (legitimate interest balancing).

---

## 3. DPIA §5.3 cross-ref update minor

`DPIA_REVYX_phase5` v1.0.0 §5.3 (ml-pricing balancing test) urmează a fi update minor în DPIA v1.0.1 PATCH future (S18 T-S18-03) pentru a documenta tighter gate `min_sample_district_n=50`. Versiunea DPIA v1.0.0 menționează generic "sample gate appropriate"; v1.0.1 va specifica valoarea numerică post acest PATCH. **Niciun impact GDPR Art. 22 substantial** — change este compliance hardening, nu schimbare de scope sau legal basis.

Notă: F-S14-04 LOW (DPIA §5.2 verbiage clarification) + acest update §5.3 vor fi tratate în același DPIA v1.0.1 PATCH la S18.

---

## 4. Implementare deployment (Stage 5 pre-flight gate 5.16)

### 4.1 Procedure

| Step | Acțiune | Owner | Audit event |
|---|---|---|---|
| 1 | Update `ml_model_registry.config` JSON pentru model `pricing-gbm v2.0.0` (production GA model post-Stage 3 CANARY 25%) — set `config.bias.min_sample_district_n = 50` | DS Lead | `ML_MODEL_CONFIG_UPDATED` (existing event) cu metadata `{model_id, config_diff:{min_sample_district_n:{from:30, to:50}}, justification_uri, dpo_sign_off_at}` |
| 2 | Deploy fără 4-eyes (config flag bump fără promote — model nu se schimbă, doar config) | DS Lead | Doc trail în PR description |
| 3 | Verify rollout instant — toate prediction requests post-deploy cu district sample n ∈ [30,49] returnează fallback baseline; smoke test 10 sample synthetic districts | Senior QA | Verification log |
| 4 | DPO sign-off + cross-ref DPIA pending v1.0.1 PATCH (S18) | DPO | DPO sign-off log |

### 4.2 Backwards compatibility

- **Full backwards compat** — config flag bump prin JSON update; **niciun cod schimbat**; nicio migrare DB; nicio dependency upstream.
- Clients (Web + Mobile) continuă să consume `/api/pricing/predict` cu request/response schema identică — diferența e doar internal routing logic (ML path vs baseline path) care e già încapsulată în backend.
- Audit-log catalog neschimbat (existing event `ML_MODEL_CONFIG_UPDATED` reused; nu necesită bump audit-log spec).

### 4.3 Rollback plan

Dacă post-deploy observă creștere unexpected rate de fallback baseline (>30% requests rural districts în primele 24h, indicând că volume rural este mai mare decât estimated), rollback prin reverse config update `min_sample_district_n: 50 → 30` și investigate. Rollback este zero-downtime (config flag flip).

---

## 5. Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Fallback baseline rate creștere semnificativ post-deploy → degraded user experience pe districte rurale | LOW | Monitoring Grafana `pricing-fallback-rate-by-district` dashboard 7 zile post-deploy; rollback dacă >30% rural requests fallback (vs pre-deploy ~5%) |
| Bias_alert pattern shift post tighter gate (alte districte intra în n<50 zone unexpected) | LOW | Bias monitoring report săptămânal post-deploy; re-evaluate dacă pattern shift detectat |
| Model retraining pressure (DS Lead trebuie să collect mai mult rural data) | INFO | Long-term: roadmap include data partnership cu agenții imobiliare rurale post-GA (BRD §7.6 future); short-term: fallback baseline e safe + accurate (-3% MAPE vs ML in CANARY measurement) |

---

## 6. Cross-references

- `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §15 (canonical, neschimbat)
- `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §6.2 M2.S4 + §7 Phase 5 + §0 Status Tracker
- `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §2.2 T-S17-06
- `TECH_SPEC_REVYX_ml-pricing-ga_v1.0.4.md` §6.5 R7 (fallback baseline rule — threshold modified by this PATCH)
- `TECH_SPEC_REVYX_ml-pricing-ga_v1.0.4.md` (rename `pricing_model_registry → ml_model_registry`)
- `TECH_SPEC_REVYX_ml-pricing-ga_v1.0.4.md` (DP-05 enforcement clarification)
- `RUNBOOK_REVYX_stage3-ml-pricing-launch_v1.0.0.md` (operational runbook executed PASS)
- `AUDIT_REVYX_s15-external-pass_v1.0.0.md` §3 bias monitoring report 28d SHADOW + 21d CANARY + §5.2 F-S15-01 detail
- `AUDIT_REVYX_s16-external-pass_v1.0.0.md` §5.2 F-S15-01 CLOSED spec-side via acest PATCH
- `audit-log_v1.1.1` §4.4.1 `PRICING_MODEL_*` events catalog (neschimbat)
- `DPIA_REVYX_phase5_v1.0.1` §5.3 (cross-ref update minor pending v1.0.1 PATCH S18)
- `READINESS_REVYX_phase5_v1.1.0` §7.1 gate 5.16 — Stage 5 pre-flight gate (deployed T+76)

---

## 7. Approval

| Aprobator | Sign-off |
|---|---|
| Senior Architect | ✅ |
| DS Lead | ✅ |
| SECURITY Lead | ✅ |
| Frontend Lead | ✅ |
| DPO | ✅ |

---

*docs/tech-spec/TECH_SPEC_REVYX_ml-pricing-ga_v1.0.4.md · v1.0.4 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
