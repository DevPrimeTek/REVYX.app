# TECH SPEC — REVYX AUDIT_LOG (PATCH v1.1.1)
<!-- TECH_SPEC_REVYX_audit-log_v1.1.1.md · v1.1.1 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Solution Architect | Spec inițială AUDIT_LOG · APPEND-ONLY · Phase 0 |
| 1.1.0 | 2026-05 | Senior PM + Solution Architect + Security Auditor | Closes F-04 HIGH (S9 audit) — 75 events Phase 5 catalogați, severitate, retention, alerting hook |
| 1.1.1 | 2026-05 | Senior PM + Solution Architect + Security Auditor + Audit Lead | ★ PATCH — closes F-S10-09 LOW + F-S11-02 LOW (AUDIT_REVYX_s11-external-pass v1.0.0) · clarifying §4.4.5 `CHURN_CS_TASK_OPENED` alerting hook (remove dual-statement ambiguity) · adăugare ★ §4.4.9 familia nouă `PHASE5_*` cu 4 events oficiale (`PHASE5_STAGE_ENTRY` / `PHASE5_STAGE_EXIT_PASS` / `PHASE5_STAGE_ROLLBACK` / `PHASE5_GA_DECISION`) mutate din "propunere" §10 phase5-rollout-sequence v1.0.0 la catalog official · count 75→79 events Phase 5 |

---

> **Backwards compat (v1.1.0 → v1.1.1):** Doc-only patch. Toate eventurile catalogate în v1.1.0 §4.3 + §4.4 rămân **neschimbate** ca string `event_type`. v1.1.1 **doar** (a) clarifică alerting hook pentru `CHURN_CS_TASK_OPENED`; (b) adaugă §4.4.9 cu 4 events `PHASE5_*` noi pentru meta-audit Phase 5 stage transitions. Schema tabel `audit_log` neschimbată. Migrările existente (0010–0013) rămân autoritative; nicio migrare nouă.

---

## 1–3 (identic cu v1.1.0)

(Vezi `TECH_SPEC_REVYX_audit-log_v1.1.0.md` §1–§3 pentru Executive Summary, Architecture Overview, Stack & Dependencies — neschimbate.)

---

## 4. Data Model

### 4.1–4.3 (identic cu v1.1.0)

(Schema, constraints, catalog Phase 0–4 — neschimbate.)

### 4.4 Catalog Events Phase 5 (S8 + S9) — total 79 events post-patch

> **Scope:** Toate eventurile noi introduse de specs S8 + runbookurile S9 + 4 events `PHASE5_*` pentru meta-audit stage transitions Phase 5 rollout.

#### 4.4.1 Family `PRICING_MODEL_*` (10 events) — sursă `ml-pricing-ga` v1.0.0+

(Neschimbat față de v1.1.0 §4.4.1.)

#### 4.4.2 Family `BUYER_*` (12 events) — sursă `marketplace-two-sided` v1.0.1

(Neschimbat față de v1.1.0 §4.4.2.)

#### 4.4.3 Family `WL_*` white-label (12 events) — sursă `white-label` v1.0.1

(Neschimbat față de v1.1.0 §4.4.3.)

#### 4.4.4 Family `MOBILE_*` + `AUTH_MOBILE_*` (8 events) — sursă `mobile-rn` v1.0.0

(Neschimbat față de v1.1.0 §4.4.4.)

#### 4.4.5 Family `CHURN_*` (14 events) — sursă `churn-ga` v1.0.0+ ★ alerting clarifying

> **Patch v1.1.1 (F-S10-09 closed):** linia `CHURN_CS_TASK_OPENED` avea în v1.1.0 `Alerting hook: none (HIGH+ Slack la riskBand=CRITICAL)` — dual-statement ambiguu (`none` și `Slack` se contrazic). v1.1.1 înlocuiește cu formularea unică, neambiguă: **`Slack #cs-ops la risk_band=CRITICAL; none altfel`**.

| Event | Entity | Severity | Retention | Payload `metadata` (canonical) | Alerting hook |
|---|---|---|---|---|---|
| `CHURN_SCORE_COMPUTED` | TENANT/AGENT | INFO | STANDARD | `{score_id, subject_type, subject_id, prob_30d, prob_60d, risk_band, model_id, features_hash}` | none |
| `CHURN_CS_TASK_OPENED` | TENANT/AGENT | INFO | STANDARD | `{task_id, score_id, risk_band, sla_hours, due_at, playbook_id}` | ★ **Slack #cs-ops la `risk_band=CRITICAL`; none altfel** (F-S10-09) |
| `CHURN_CS_TASK_UPGRADED` | TENANT/AGENT | INFO | STANDARD | `{task_id, from_band, to_band, new_due_at}` | none |
| `CHURN_CS_TASK_ASSIGNED` | TENANT/AGENT | INFO | STANDARD | `{task_id, assigned_to:user_id, assignment_strategy}` | none |
| `CHURN_CS_TASK_STARTED` | TENANT/AGENT | INFO | STANDARD | `{task_id, started_by:user_id}` | none |
| `CHURN_CS_TASK_CONTACTED` | TENANT/AGENT | INFO | STANDARD | `{task_id, contact_channel, contacted_at}` | none |
| `CHURN_CS_TASK_EXPIRED` | TENANT/AGENT | WARN | STANDARD | `{task_id, expired_at, sla_breach_minutes}` | Slack #cs-sla |
| `CHURN_OUTCOME_RECORDED` | TENANT/AGENT | INFO | STANDARD | `{outcome_id, task_id, outcome, reason_code, contact_channel}` | none |
| `CHURN_RETENTION_VERIFIED` | TENANT/AGENT | INFO | EXTENDED | `{outcome_id, retained:bool, verified_at}` | none |
| `CHURN_AUC_DRIFT_ALERT` | — | HIGH/CRITICAL | EXTENDED | `{model_id, alert_type:'AUC_DRIFT', metric_value, baseline_value, delta, window}` | PagerDuty cs-on-call |
| `CHURN_PREVENTION_RATE_BELOW_TARGET` | — | HIGH | EXTENDED | `{rate, target:0.30, cohort_size, window:'90d'}` | Slack #exec-kpi (HIGH) |
| `CHURN_RETRAIN_TRIGGERED` | — | INFO | STANDARD | `{model_id, reasons:[]}` | none |
| `CHURN_TASK_GENERATION_PAUSED` | — | HIGH | EXTENDED | `{paused_by:'AUTO'\|user_id, reason}` | PagerDuty cs-on-call |
| `CHURN_TASK_GENERATION_RESUMED` | — | INFO | EXTENDED | `{resumed_by:user_id, reason}` | Slack #cs-ops |

#### 4.4.6 Family `ISO_*` (4 events) — sursă `iso27001-track` v1.0.0

(Neschimbat față de v1.1.0 §4.4.6.)

#### 4.4.7 Family `INC_*` (8 events) — sursă `RUNBOOK_REVYX_incident-response` v1.0.0

(Neschimbat față de v1.1.0 §4.4.7.)

#### 4.4.8 Family `DR_TEST_*` (7 events) — sursă `RUNBOOK_REVYX_dr-test` v1.0.0

(Neschimbat față de v1.1.0 §4.4.8.)

#### 4.4.9 ★ Family `PHASE5_*` (4 events) — sursă `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 (NEW v1.1.1)

> **Patch v1.1.1 (F-S11-02 closed):** Master runbook §10 listase 4 events ca "propunere" pentru v1.1.1. Acest patch le mută la catalog official. Eventurile sunt emise **manual de stage owner** la stage transitions (no auto-emit; e o decizie executivă cu sign-off).

| Event | Entity | Severity | Retention | Payload `metadata` (canonical) | Alerting hook |
|---|---|---|---|---|---|
| `PHASE5_STAGE_ENTRY` | — | INFO | COMPLIANCE_84M | `{stage:1\|2\|3\|4\|5, stage_name, entry_gates_status:'PASS', approver_ids:[vp_product, cto, audit_lead], dpia_version:'1.0.0', readiness_doc_uri}` | Slack #phase5-rollout |
| `PHASE5_STAGE_EXIT_PASS` | — | INFO | COMPLIANCE_84M | `{stage, stage_name, exit_metrics:{}, ready_for_next_stage:true, signed_off_by:[vp_product,cto,audit_lead]}` | Slack #phase5-rollout |
| `PHASE5_STAGE_ROLLBACK` | — | CRITICAL | COMPLIANCE_84M | `{stage, stage_name, rollback_reason, decision_tree_branch, rollback_executed_by, rollback_at, follow_up_inc_id?}` | PagerDuty exec-on-call (CRITICAL) + Slack #phase5-rollout + email VP Product/CTO/CISO |
| `PHASE5_GA_DECISION` | — | INFO | COMPLIANCE_84M | `{decision:'GO'\|'HOLD'\|'BLOCKED', t_plus_91_review_at, board_signoff:[vp_product,cto,ciso,dpo,audit_lead,cfo], cumulative_metrics:{}, next_review_at?}` | Slack #exec-kpi + email all-board |

> **Notă mapping cu master runbook:** Stage transitions log-uite anterior `RBAC_ROLE_GRANTED` cu `metadata.reason='PHASE5_STAGE_TRANSITION'` (workaround §10 phase5-rollout-sequence v1.0.0) pot fi backfilled opțional cu `PHASE5_*` events ulterior; mandatory de la v1.1.1 deploy înainte.

### 4.5 ★ Catalog hygiene (CI guard) — neschimbat

(Neschimbat față de v1.1.0 §4.5; CI parsează acum și `PHASE5_*` events.)

---

## 5. API Contracts

### 5.1 ★ Internal write API — TypeScript enum extins (Phase 5) v1.1.1

```typescript
// types/audit-events-phase5.ts (additive v1.1.1)
export type AuditEventTypePhase5 =
  // PRICING_MODEL_* (10) — vezi v1.1.0
  // BUYER_* (12) — vezi v1.1.0
  // WL_* (12) — vezi v1.1.0
  // MOBILE_* + AUTH_MOBILE_* (8) — vezi v1.1.0
  // CHURN_* (14) — vezi v1.1.0
  // ISO_* (4) — vezi v1.1.0
  // INC_* (8) — vezi v1.1.0
  // DR_TEST_* (7) — vezi v1.1.0
  // ★ PHASE5_* (4) NEW v1.1.1
  | 'PHASE5_STAGE_ENTRY' | 'PHASE5_STAGE_EXIT_PASS'
  | 'PHASE5_STAGE_ROLLBACK' | 'PHASE5_GA_DECISION';
// Total Phase 5: 79 events (75 + 4 noi)
```

---

## 6–11 (identic cu v1.1.0)

(Append-Only Enforcement, State Machines, Concurrency, Caching, Background Jobs, Error Handling — neschimbate.)

---

## 12. Security

### 12.1–12.4 (identic cu v1.1.0)

### 12.5 Acces consolidat per rol — addendum v1.1.1

| Rol | Read scope | Restricții |
|---|---|---|
| `manager` | Audit timeline tenant propriu | Niciun PII unmask |
| `admin` | Tenant + export GDPR | Tenant propriu |
| `compliance_auditor` | Tenant întreg + cross-tenant ISO/INC/DR_TEST/★PHASE5 events | **Niciun PII unmask** · time-boxed |
| `data_science_lead` | PRICING_MODEL_* + CHURN_* | Filtru pe families ML |
| `cs_lead`, `cs_user` | CHURN_* (CS pool) | Niciun acces alte families |
| `super_admin` (ITPRO) | Cross-tenant complet incl. PHASE5_* | Logged ca `AUDIT_QUERIED` |

> **Note pentru `PHASE5_*`:** events vizibile compliance_auditor pentru audit ISO 27001 (track Phase 5 governance maturity) — nu conțin PII (meta operational). Adăugat la view `audit_log_compliance_view` filter `event_type LIKE 'PHASE5_%'`.

---

## 13. Observability

(Identic cu v1.1.0; metric `audit_event_uncatalogued_total` rămâne; adăugare metric:)

| Metric | Tip | Alert |
|---|---|---|
| ★ `phase5_stage_transition_total{stage,kind}` | counter | trend; >1 ROLLBACK în 7d → exec review |

---

## 14–18 (identic cu v1.1.0)

---

## 19. Impact Assessment

### 19.1 Scope of Change

| Element | Detaliu |
|---|---|
| Document | TECH_SPEC_REVYX_audit-log_v1.1.1.md |
| Tip schimbare | PATCH (clarifying + 4 events noi, doc-only) |
| Aria afectată | Catalog events Phase 5 (CHURN alerting + PHASE5_* meta) |
| Origine | F-S10-09 LOW + F-S11-02 LOW (AUDIT_REVYX_s11-external-pass v1.0.0) |

### 19.2 Impact pe documente conexe

| Document | Tip impact | Acțiune |
|---|---|---|
| `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §10 | Cross-ref — events `PHASE5_*` sunt acum oficial catalogate | Aliniat (no rebump) |
| `RUNBOOK_REVYX_phase5-rollout-sequence` future v1.0.1 | Update cross-ref §10 din "propunere v1.1.1" la "catalog v1.1.1 §4.4.9" | Optional cleanup |
| `tenancy-roles-extension` v1.1.0 §12.4 | View filter extins cu `'PHASE5_%'` | Optional la următoarea migrare |
| `churn-ga` v1.0.1 §19.x cs playbook references | Confirmă alerting hook unic | Aliniat (no change) |
| `audit-catalog-lint.yml` | Spec path actualizabil la v1.1.1 când patch deployed | Optional update spec path |

### 19.3–19.6 Impact

(Toate scoring/schema/RBAC/SLA: identic cu v1.1.0 + 4 events `PHASE5_*` adăugat în catalog memory <2KB; zero impact perf.)

### 19.7 Impact pe Securitate & GDPR

| Aspect | Status | Notă |
|---|---|---|
| PII handling | NU se schimbă | `PHASE5_*` events sunt operational meta (zero PII) |
| Retention class | DA — `PHASE5_*` toate la `COMPLIANCE_84M` | Aliniat ISO 27001 audit cycle |
| AUDIT_LOG events noi | DA (4) | §4.4.9 |

### 19.8 Risks & Mitigations

(Identic cu v1.1.0.)

### 19.9 Test Plan

- Unit: `PHASE5_STAGE_ROLLBACK` cu `severity=CRITICAL` triggers PagerDuty exec mock.
- Integration: emit `PHASE5_STAGE_ENTRY` la entry Stage 1 simulation; verifică retention `COMPLIANCE_84M`.
- Lint: `audit-catalog-lint` recunoaște `PHASE5_*` ca catalogate post-deploy v1.1.1.

### 19.10 Rollout & Rollback

| Aspect | Detaliu |
|---|---|
| Feature flag | N/A (doc + enum extension) |
| Rollout | Spec publicat; backend tag-ează events conform §4.4.9 înainte de prima Stage 1 entry |
| Rollback | N/A doc-only |

### 19.11 Approval Gate

| Aprobator | Necesar pentru |
|---|---|
| Solution Architect | Catalog extension consistency |
| Security Lead | Severity + alerting `PHASE5_STAGE_ROLLBACK` CRITICAL |
| Audit Lead | Master runbook §10 → catalog official mapping |
| Senior PM | Aliniere cu phase5-rollout-sequence v1.0.0 |

---

*docs/tech-spec/TECH_SPEC_REVYX_audit-log_v1.1.1.md · v1.1.1 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
