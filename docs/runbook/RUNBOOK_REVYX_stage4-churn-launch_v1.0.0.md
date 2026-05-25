# RUNBOOK — REVYX Phase 5 Stage 4 Churn CS Pilot Dry-Run (T+56 → T+77)
<!-- RUNBOOK_REVYX_stage4-churn-launch_v1.0.0.md · v1.0.0 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** Pre-development / S16 deliverable; Phase 5 Stage 4 operational runbook.
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §7 Phase 5 staged rollout + §0.3 (S16 deliverables).
**Roadmap ref:** `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §2.1 T-S16-04.
**Trio canonical citat:** Master Plan v1.1.1 + Platform Matrix v1.0.0 + Detailed Roadmap v1.0.0 (Regula 8 + Regula 9).

## 0.1 Platform Matrix

**Source canonical:** `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §15 (Modul 14 — ML Pricing & Churn).

UI touchpoints Stage 4 (cu tag platform explicit per Regula 9):

| Feature | Web | Mobile | Note |
|---|---|---|---|
| CS analytics dashboard (Prevention Rate, AUC trend, segment breakdown) | 🌐 cs_lead + manager + admin | ⛔ DP-05 | **Web only** — Modul 14.6; `churn-ga` v1.0.2 §3.1 route `/cs/churn-dashboard` |
| CS task inbox (full + bulk actions + filters) | 🌐 cs_lead + cs_user | ⛔ DP-05 | Web only — Modul 14.7 web side |
| CS task call list (assigned to cs_user, simple list) | ⛔ | 📱 cs_user only | Mobile limited — Modul 14.7 mobile side; tap → call native |
| Churn score per agent (own, read-only) | 🔁 BOTH | 🔁 BOTH | Modul 14.5; BR-18 (nu partajat cu alți agenți) |
| Playbook execute checklist (MEDIUM/HIGH/CRITICAL) | 🔁 BOTH | 🔁 BOTH | Modul 14.8; tri-lingual RO/RU/EN |
| 4-eyes approval (n/a Stage 4 — churn nu necesită 4-eyes) | n/a | n/a | Doar ML Pricing necesită 4-eyes per `ml-pricing-ga` |
| Audit log viewer (compliance review post-pilot) | 🌐 compliance + admin | ⛔ DP-05 | Modul 15.2 |

**DP-05 enforcement în Stage 4:** CS dashboard + audit log viewer + bulk task actions = Mobile blocked. Server-side RBAC guard + client-side route guard pe `/admin/*` și `/cs/churn-dashboard`. Test E2E §4 daily check verifica acces denied din Mobile build.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-06 | DS Lead + CS Lead + Solution Architect + Senior QA + Security Lead + Backend Lead + DPO + Audit Lead + VP Product | ★ Initial — operational runbook day-by-day Stage 4 (Churn pilot CS playbook **dry-run intern**, 1 tenant simulat = REVYX intern) per `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §7 + `TECH_SPEC_REVYX_churn-ga` v1.0.1 §19 + `TECH_SPEC_REVYX_churn-ga` v1.0.2 (platform PATCH) · model `churn-gbm v1.0.0` SHADOW 4 săpt PASS (AUC 0.78-0.82 vs baseline 0.75) · cohort = 1 tenant intern + 3 cs_user + 1 cs_lead + 9 task-uri sintetice (5 MED + 3 HIGH + 1 CRITICAL) · acoperă pre-flight T+55 entry gates · day-by-day T+56..T+77 · daily health 12 metrici · rollback decision tree 6 branches (AUC drop / RLS leak / playbook adoption / SLA breach / false positive / outcome flow regression) · cohort selection criteria CS pilot · Platform Matrix §15 Modul 14.6 cross-ref (CS dashboard 🌐 Web only DP-05) · creat post-S15 audit pass (Stage 4 entry unblocked) |

---

## 1. Scop

Acest runbook este **operational day-by-day** pentru Stage 4 Phase 5 (Churn pilot CS playbook **dry-run intern**). Master gate `phase5-rollout-sequence` v1.0.0 §7 definește entry/exit gates; acest doc descrie **execuția** zilnică cu owners, comenzi, audit events așteptate. Cohort este **1 tenant intern simulat** (CS REVYX intern); zero impact pe clienți reali; zero `BUYER_PROFILE` impact. Dry-run pentru a valida flow înainte de a deschide pilot extern (post-Stage 4 decizie boards).

| Atribut | Valoare |
|---|---|
| Stage | 4 — Churn pilot CS dry-run (intern only) |
| Durată | T+56 → T+77 zile (21 zile cu 4 milestone checks: T+56 entry, T+63 first MED task SLA, T+70 HIGH+CRITICAL escalation, T+77 exit) |
| Cohort target | 1 tenant intern simulat (CS REVYX intern); 3 cs_user + 1 cs_lead provisionați; 9 task-uri sintetice gradual generate |
| Distribuție | Feature flag `flag.churn_ga.enabled=true` la tenant intern only; `churn.task_generation_threshold={MEDIUM:0.20, HIGH:0.40, CRITICAL:0.60}` configurat |
| Owner | DS Lead (model owner) · CS Lead (playbooks + role-play) · Solution Architect (RBAC + RLS) · Senior QA (SLA + assertNoPII) · Security Lead (BR-18 + RLS) · Backend Lead (API + events) · DPO (Art. 22 + balancing test) · Audit Lead (gating) · VP Product (3-eyes go) |
| Timezone | UTC+2 (Chișinău) |
| Cross-spec | `churn-ga` v1.0.0/v1.0.1/v1.0.2 · `audit-log` v1.1.1 §4.4.5 (`CHURN_*` 14 events) + §4.4.9 (`PHASE5_*`) · `DPIA_REVYX_phase5` v1.0.0 §5.4 churn-ga · `incident-response` v1.0.0 (P1 cs-on-call) · `cs-playbooks/CHURN_MEDIUM_v1.1.0.md` + `CHURN_HIGH_v1.1.0.md` + `CHURN_CRITICAL_v1.1.0.md` + `CHECKLIST_pre-pilot` v1.0.0 |

---

## 2. Pre-flight T+55 (verificare entry gates pre-T+56 GO)

| # | Gate (din `phase5-rollout-sequence` §7.1 + `READINESS_REVYX_phase5` §6.1) | Owner | Verificare |
|---|---|---|---|
| 4.1 | Stage 3 exit gates ✅ (CANARY 25% stabil) | Audit Lead | Link `AUDIT_REVYX_s15-external-pass` v1.0.0 §2.1 (6/6 PASS) + `READINESS_REVYX_phase5` v1.0.4 §5.2 |
| 4.2 | Model `churn-gbm` SHADOW 4 săpt PASS (AUC stabil) | DS Lead | `ml_model_registry.status='SHADOW'` cu `trained_at < now()-28d`; AUC_shadow_rolling_7d ≥0.75 baseline locked; sustained 28 zile |
| 4.3 | AUC SHADOW >0.75 baseline locked (sign-off DS+SA+DPO) | DS Lead | `docs/model-cards/churn-v1.0.0.md` baseline AUC=0.75 (BRD §7.5); measured 0.78-0.82; signed-off report 2026-06-20 |
| 4.4 | `CHURN_*` events 14/14 funcționale (audit-log §4.4.5) | Backend Lead | Smoke test staging: 14 events emit cu payload assertNoPII PASS; cs_user RLS verify pe `churn_score.factors` |
| 4.5 | `cs_user`+`cs_lead` provisionați tenant pilot CS REVYX intern | Security Lead (RBAC owner) | 3 cs_user + 1 cs_lead în RBAC; `tenancy-roles-extension` v1.1.0 §4.5 verify; single-session per user BR-12 |
| 4.6 | CS Playbooks v1.1.0 (RO+RU+EN) tipărite + role-play complet | CS Lead | 3 cs_user × 3 scenarii MEDIUM+HIGH+CRITICAL role-play 2026-06-19 PASS; attestation signed |
| 4.7 | KPI Prevention Rate dashboard live (cohort gate ≥30 flagged înainte alert) | DS Lead + Frontend Lead | Dashboard `/cs/churn-dashboard` live (**🌐 Web only DP-05** per Platform Matrix §15 Modul 14.6); cohort gate `flagged_count >= 30` confirmed în config |
| 4.8 | DPIA acoperă explicit churn-ga Art. 22 + balancing test | DPO | `DPIA_REVYX_phase5` v1.0.0 §5.4 churn-ga; legitimate interest documented; human override (cs_lead manual close/snooze) verified; sign-off triple DPO+SL+CISO |
| 4.9 | `CHECKLIST_pre-pilot` v1.0.0 disponibil + cs_user familiarizat | CS Lead | Checklist tri-lingual 9 task-uri operational; cs_user attestation 3/3 PASS |

**Decizie pre-flight:** dacă **toate** ☑ → emit `PHASE5_STAGE_ENTRY` event manual (owner: Backend Lead via admin tool) cu `{stage:4, stage_name:'churn_cs_dry_run', entry_gates_status:'PASS', approver_ids:[vp_product,cs_lead,ds_lead,audit_lead], dpia_version:'1.0.0', readiness_doc_uri, model_id:'<churn-gbm-v1.0.0-uuid>', tenant_pilot_id:'<revyx-internal-tenant-uuid>'}`; altfel defer +1 săpt.

**Decizie 3-eyes:** VP Product + CS Lead + DS Lead + Audit Lead sync T+55 16:00 UTC+2 confirmation GO.

---

## 3. Sequence day-by-day

### 3.1 T+56 (Luni) — Pre-flight + activare churn la tenant intern

| Ora (UTC+2) | Acțiune | Owner | Output / Audit event |
|---|---|---|---|
| 09:00 | Pre-flight 3-eyes sync confirm GO (VP Product + CS Lead + DS Lead + Audit Lead) | Audit Lead | `READINESS_REVYX_phase5` v1.0.4 §6.1 sign-off |
| 09:30 | Emit `PHASE5_STAGE_ENTRY` event manual cu metadata complete | Backend Lead | AUDIT_LOG verified |
| 10:00 | Activare `flag.churn_ga.enabled=true` la tenant pilot intern (config flag, fără 4-eyes — Stage 4 nu necesită 4-eyes per spec, doar `PHASE5_STAGE_ENTRY` audit) | DS Lead + Backend Lead | `CHURN_FEATURE_FLAG_ENABLED` event emis (per audit-log §4.4.5 #14) |
| 10:30 | Promote `churn-gbm v1.0.0` SHADOW → ACTIVE pentru tenant pilot intern (single-tenant flag, NU global) | DS Lead | `CHURN_MODEL_ACTIVATED` event emis |
| 11:00 | Smoke test E2E: 5 sintetic profiles cu varying risk → score compute → verify routing CS task generation pentru risk_band={MEDIUM, HIGH} | Senior QA + Backend Lead | E2E PASS + AUDIT_LOG count match |
| 14:00 | DPO verify `assertNoPII` pe `CHURN_CS_TASK_OPENED` payload + verify cs_user RLS NU vede `churn_score.factors` raw | DPO + Senior Security Auditor | Verification PASS |
| 17:00 | Daily standup #cs-churn-pilot — green/red status | DS Lead + CS Lead | Slack thread |

**Health threshold T+56:** zero `CHURN_AUC_DRIFT_ALERT` events; tenant pilot intern activ; 0 task-uri auto-generate real (test sintetic doar).

### 3.2 T+57 (Marți) — Primul score compute + first MED task

| Ora | Acțiune | Owner | Output |
|---|---|---|---|
| 09:00 | Cron `churn.score.compute.daily` execută la 03:00 UTC+2 (background) — generează scoruri pentru toți agenții tenant intern simulat (sintetic, fără client real) | Backend Lead | `CHURN_SCORE_COMPUTED` events emise (per agent) |
| 09:30 | DS Lead inspect dashboard `/cs/churn-dashboard` (**🌐 Web only**) — verify cohort flagged ≥30 (sintetic data prepared să atingă gate) | DS Lead | Dashboard screenshot Slack |
| 10:00 | Primul `CHURN_CS_TASK_OPENED` la risk_band=MEDIUM (agent sintetic "AG-INT-01"); assign automat la cs_user "CSU-01" per round-robin | Backend Lead | AUDIT_LOG event verified |
| 10:30 | cs_user CSU-01 deschide task din `/cs/inbox` (**🌐 Web**) — vizualizează playbook MEDIUM (RO); începe checklist | CS Lead | task `status='IN_PROGRESS'` |
| 14:00 | cs_user execute outreach sintetic (email template + Slack DM) per playbook MEDIUM §4.1; logging activitate | CS Lead | `CHURN_CS_TASK_OUTCOME_LOGGED` event |

**Threshold T+57:** task SLA 168h pentru MED (start clock); zero unmask PII observat cs_user.

### 3.3 T+58 → T+62 (Mier-Sâmb săpt 8) — MED task SLA window + L10n CMS deploy

- Telemetria zilnică (Sentry + AUDIT_LOG + Grafana `cs-churn-dashboard`):
  - `CHURN_CS_TASK_OPENED` count rolling 24h (target 1-2 MED/zi sintetic generation).
  - `CHURN_CS_TASK_EXPIRED` count (target 0 — task SLA respect 168h).
  - `CHURN_AUC_DRIFT_ALERT` rolling 7d (target 0 HIGH/CRITICAL).
  - RLS test sintetic — pe cs_user-uri secundare să acceseze `churn_score.factors` ale altui agent (verify 403).
  - BR-18 test: agent subiect query own score (vede), query alt agent score (403).
- T+58: cs_user CSU-01 finalize MED task #1 cu outcome=`INTERVENED_SUCCESS` (sintetic); `CHURN_CS_TASK_CLOSED` event emise.
- T+59: încă 2 MED task-uri sintetice deschise (agent sintetic "AG-INT-02" + "AG-INT-03"); assign CSU-02 + CSU-03.
- T+60: ★ Mobile push deep-link build deploy TestFlight (F-S13-01 op deploy din S16) — verify în paralel; n/a Stage 4 scope direct.
- T+61: 2 MED task-uri sintetice noi (cumulat 5 MED target conform §1 cohort plan).
- **T+62: CMS deploy RU email template (F-S14-01 PARTIAL closed)** — CS Lead + Backend Lead deploy email template în CMS; verify RO+RU+EN paritate (cross-tenant pilot intern test); status F-S14-01 → ✅ CLOSED FULL post-deploy.
- DS Lead emite raport zilnic Slack #cs-churn-pilot la 17:00.
- Senior QA verifică `assertNoPII(audit_log_compliance_view.row WHERE event_name LIKE 'CHURN_%')` la T+58 + T+61.

**Audit events așteptate cumulative (T+57..T+62, 6 zile):**

| Event | Expected | Threshold |
|---|---|---|
| `CHURN_SCORE_COMPUTED` (per agent sintetic per cron daily) | ~30 (5 agenți × 6 zile) | informativ |
| `CHURN_CS_TASK_OPENED` (MED) | 5 (gradual T+57..T+61) | target 5 sintetic |
| `CHURN_CS_TASK_CLOSED` (outcome) | 2-3 (early closures sintetic) | informativ |
| `CHURN_CS_TASK_EXPIRED` | 0 | exact 0 (target SLA 168h respect) |
| `CHURN_AUC_DRIFT_ALERT` (HIGH/CRITICAL) | 0 | exact 0 |
| `CHURN_RLS_VIOLATION_ATTEMPT` | informativ (test sintetic) | toate 403; zero permitted access |

### 3.4 T+63 (Marți) — Health check + MED task SLA review

| Ora | Acțiune | Owner | Output |
|---|---|---|---|
| 09:00 | Day 7 (MED dry-run) health review (DS Lead + CS Lead + Solution Architect + Audit Lead) | DS Lead + CS Lead | Decision sheet GO/HOLD pentru HIGH task injection |
| 09:30 | Verificare gate criteria T+63: 5/5 MED task-uri SLA-compliant (zero EXPIRED) · cs_user feedback survey (CS Lead) PASS · zero RLS leak · zero AUC drift | DS Lead + CS Lead | Health report Slack |
| 10:00 | Decizie GO HIGH injection: CS Lead generate 3 task-uri HIGH sintetice (escalation cs_lead în 4h target SLA 72h) | CS Lead | `CHURN_CS_TASK_OPENED` (HIGH) × 3 |
| 10:30 | cs_user assign + execute playbook HIGH (RO + RU + EN test, fiecare cu un task pentru paritate trilingual) | CS Lead | `CHURN_CS_TASK_ASSIGNED` + `CHURN_CS_TASK_ESCALATED` (la cs_lead intern T+63 17:00 dacă playbook §3 trigger) |
| 14:00 | DPO + Senior Security Auditor verify RLS BR-18 test E2E (agent subiect NU vede churn score; alt agent NU vede churn score; cs_user vede mask-uit) | DPO + Senior Security Auditor | Test PASS log |
| 17:00 | Standup | DS Lead + CS Lead | Slack thread |

**Decizie health T+63:** dacă criteria PASS → procede HIGH; dacă SLA breach MED → defer HIGH +3 zile + retraining playbook cs_user.

### 3.5 T+64 → T+69 (6 zile) — HIGH task SLA window + audit lichidare

- Telemetria intensivă HIGH track:
  - `CHURN_CS_TASK_ESCALATED` (la cs_lead) — target ≤1 per HIGH task (cs_lead intervention).
  - `CHURN_CS_TASK_EXPIRED` rolling — target 0 HIGH.
  - Cs_user adoption per playbook RO/RU/EN — minimum 1 outcome per limbă (gate exit).
- T+64..T+66: cs_user execute HIGH outreach (personal call simulat + concession matrix discussion); `CHURN_CS_TASK_OUTCOME_LOGGED` events.
- T+67..T+69: HIGH task closures cu outcome `INTERVENED_SUCCESS` (2) + `INTERVENED_PARTIAL` (1, intentional test scenariu); `CHURN_CS_TASK_CLOSED` events.
- Senior QA verify dashboard `/cs/churn-dashboard` (**🌐 Web only**) — Prevention Rate KPI computed; segment breakdown per risk_band.
- DPO re-review balancing test sample T+68: human override invoked (cs_lead manual close 1 task → outcome `INTERVENED_BUT_RETAINED`) ⇒ verifică Art. 22 compliance respect.

### 3.6 T+70 (Marți) — CRITICAL task injection (PD test)

| Ora | Acțiune | Owner | Output |
|---|---|---|---|
| 09:00 | Day 14 health review (cumulative MED 5/5 + HIGH 3/3 + sumarul Prevention Rate KPI sintetic) | DS Lead + CS Lead | Decision sheet GO/HOLD pentru CRITICAL |
| 09:30 | Verificare gate criteria T+70: 8/8 task-uri închise outcome-categorizate; zero EXPIRED; RLS 100% verde; AUC stabil | DS Lead + CS Lead | Health report Slack |
| 10:00 | Decizie GO CRITICAL: CS Lead generate 1 task CRITICAL sintetic (escalation PD test cs-on-call) | CS Lead | `CHURN_CS_TASK_OPENED` (CRITICAL) |
| 10:15 | `CHURN_CS_TASK_OPENED` (CRITICAL) triggerează `PD_ALERT_FIRED` simulat la cs-on-call (intern test) | Backend Lead + Security Lead | `INC_DECLARED` severity=P1 (test ASCII flag `simulated=true`) |
| 10:30 | cs_lead intervention executive (simulat) — playbook CRITICAL §3 (emergency call + executive escalation VP Product) | CS Lead | `CHURN_CS_TASK_ESCALATED` (la VP Product) |
| 14:00 | cs_lead close CRITICAL cu outcome `INTERVENED_SUCCESS` (sintetic happy-path); `INC_RESOLVED` simulat | CS Lead + Backend Lead | `CHURN_CS_TASK_CLOSED` + `INC_RESOLVED` events |

**Threshold T+70:** zero real-world impact (test sintetic intern); zero PD page real (simulated flag); CRITICAL playbook §3 executat T+70 EOD.

### 3.7 T+71 → T+76 (6 zile) — Outcome flow + Prevention Rate KPI

- Telemetria outcome:
  - `CHURN_CS_TASK_CLOSED` cu outcome categorizat (INTERVENED_SUCCESS / INTERVENED_PARTIAL / NO_INTERVENTION).
  - Outcome flow E2E test time-skip: simulat 90 zile prin `clock-mock` (dev env) — verify că outcome `INTERVENED_SUCCESS` se promote la `RETAINED_90D` automat după 90 zile real (Backend Lead time-skip test).
  - Prevention Rate KPI sintetic computed: target ≥20% în primele 30 zile post-GA (Stage 4 dry-run e baseline pentru a valida formula).
- T+71: Outcome flow time-skip test (Backend Lead) — `CHURN_OUTCOME_PROMOTED_RETAINED` event emis după sim 90d.
- T+72..T+74: Continued task lifecycle + AUC drift monitoring + assertNoPII spot-checks.
- T+75..T+76: Compile metrics exit gate + CS Lead survey final cs_user pe playbook adoption + DPO sign-off final balancing test.

### 3.8 T+77 (Luni) — Exit gate review + Stage 5 readiness

| Ora | Acțiune | Owner | Output |
|---|---|---|---|
| 09:00 | Compile metrici exit gate (`READINESS_REVYX_phase5` §6.2) | Senior QA + DS Lead + CS Lead | Metrics CSV + dashboard screenshot |
| 10:00 | Exit gate review meeting (VP Product + CS Lead + DS Lead + Audit Lead) | Audit Lead | Sign-off ☑ sau hold |
| 10:30 | Dacă PASS → emit `PHASE5_STAGE_EXIT_PASS` event manual cu `{stage:4, stage_name:'churn_cs_dry_run', exit_metrics:{task_sla_compliance,pii_leak_count,br18_rls_pass,auc_drift_7d,outcome_flow_test,playbook_adoption_trilingual,checklist_aggregate}, ready_for_next_stage:true, signed_off_by:[vp_product,cs_lead,ds_lead,audit_lead]}` | Backend Lead | AUDIT_LOG |
| 11:00 | Update `READINESS_REVYX_phase5` §6.2 cu valori măsurate + ☑ sign-off | Audit Lead | Doc PATCH bump v1.0.5 (S17) |
| 11:30 | Pre-flight sync Stage 5 (White-Label Enterprise) — entry gates §8.1 din phase5-rollout-sequence + READINESS §7.1 | Audit Lead + Sales Lead + DevOps + Security Lead | Slack #phase5-rollout |
| 14:00 | Retrospective Stage 4 — Slack #cs-churn-pilot — lessons learned + `RETROSPECTIVE_STAGE4.md` notes (CS Lead) | CS Lead | Notes |

**Decizie pilot EXTERN:** NU în Stage 4 scope. Pilot churn extern (cu clienți reali) este decis post-Stage 5 + post-GA decision T+91 (Master GA §9 phase5-rollout-sequence). Stage 4 dry-run intern doar valida flow E2E.

---

## 4. Daily health check protocol

CS Lead + DS Lead rulează **zilnic la 17:00 UTC+2** următorul protocol și postează în Slack #cs-churn-pilot:

```
T+<N> Health Report — Stage 4 Churn CS Pilot Dry-Run

1. Tenant pilot intern activ: Y/N (target Y)
2. CHURN_CS_TASK_OPENED count 24h: __ (cumulat per risk_band: MED/HIGH/CRIT)
3. CHURN_CS_TASK_CLOSED count 24h: __ (outcome breakdown)
4. CHURN_CS_TASK_EXPIRED count 24h: __ (target 0)
5. CHURN_AUC_DRIFT_ALERT counts 7d: __ LOW / __ HIGH / __ CRITICAL (target 0 H/C)
6. RLS BR-18 spot-check (cs_user vs agent subiect): PASS/FAIL (target PASS)
7. assertNoPII pe `audit_log_compliance_view WHERE event_name LIKE 'CHURN_%'`: PASS/FAIL
8. Playbook adoption count tri-lingual (RO/RU/EN outcome): __/__/__
9. Prevention Rate sintetic computed (cohort ≥30 flagged): __ %
10. CS Lead override count (manual close/snooze) — Art. 22 human override: __
11. Cs_user satisfaction CS Lead survey: __/5 (target ≥4)
12. Verdict: 🟢 / 🟡 / 🔴
```

**Threshold escalation:**
- 🟡 → email DS Lead + CS Lead + Solution Architect + Audit Lead + Security Lead.
- 🔴 → page DS Lead + cs-on-call via PagerDuty + emergency standup în 2h + invocă §5 rollback decision tree.

---

## 5. Rollback decision tree (Stage 4)

Expandat din `phase5-rollout-sequence` v1.0.0 §7.4 + `churn-ga` v1.0.1 §15:

```
[CHURN_AUC_DRIFT_ALERT CRITICAL fired?]
   ├─ YES → CHURN_TASK_GENERATION_PAUSED:
   │     ├─ `flag.churn_ga.task_generation_enabled=false` (config flag, fără 4-eyes; CS Lead + DS Lead authority)
   │     ├─ `CHURN_TASK_GENERATION_PAUSED` event emis cu reason='AUC_DROP'
   │     ├─ PD cs-on-call P1 (DS Lead + CS Lead)
   │     ├─ INC_DECLARED severity=P1 (real, NU simulat)
   │     ├─ DS Lead retrain churn-gbm; SHADOW 7d re-test
   │     └─ Re-activate permis doar după AUC stable ≥0.75 sustained 7d post-retrain
   └─ NO → next branch

[RLS BR-18 violation detectat (cs_user accesează churn_score.factors raw)?]
   ├─ YES → SECURITY_INCIDENT_REPORTED P1:
   │     ├─ `flag.churn_ga.enabled=false` la tenant pilot (full pause)
   │     ├─ Security Lead audit RLS policy + RBAC role definitions
   │     ├─ Forensic AUDIT_LOG query — scope of leak
   │     ├─ DPIA review post-mortem (Art. 32 breach assessment)
   │     ├─ Notify DPO + CISO; potențial GDPR Art. 33/34 notification (72h)
   │     └─ Hotfix RLS policy + re-test E2E înainte de resume
   └─ NO → next branch

[CHURN_CS_TASK_EXPIRED count >0 (SLA breach pe MED 168h / HIGH 72h / CRITICAL 24h)?]
   ├─ YES → SLA breach investigation:
   │     ├─ CS Lead survey cs_user — playbook utilizat? bottleneck identificat?
   │     ├─ Recalibrate task assignment round-robin (load balance verify)
   │     ├─ Iterate playbook v1.1.x dacă confuzie observată
   │     └─ Threshold-uri retunate (0.20 MED → 0.25) dacă false positive >40%
   └─ NO → next branch

[Playbook adoption tri-lingual gate (RO+RU+EN ≥1 outcome each) NOT met by T+70?]
   ├─ YES → CS Lead extended dry-run +7 zile cu focus pe limba lipsă
   │     ├─ Generate task sintetic forțat pentru cs_user vorbitor limba lipsă
   │     ├─ Re-evaluate la T+77+7
   │     └─ Dacă persistă → playbook v1.1.x localization review (CS Lead + Senior PM)
   └─ NO → next branch

[Outcome flow E2E test time-skip (PREVENTED→RETAINED 90d) FAIL?]
   ├─ Backend Lead investigate cron `churn.outcome.promote.90d`
   │     ├─ Hotfix logic dacă bug; re-test pe staging cu fixtures
   │     └─ Defer exit +3 zile; nu blochează Stage 5 entry doar dacă test PASS post-fix
   └─ NO → next branch

[False positive rate >40% (cs_user reports task ireal)?]
   ├─ YES → Thresholds retunate:
   │     ├─ Bump MED threshold 0.20 → 0.25 (config flag, fără spec change)
   │     ├─ Re-compute scores; verify reduced flagged count
   │     ├─ Update `churn-ga` v1.0.x PATCH spec post-Stage 4
   │     └─ Document în retrospective
   └─ Continue normal flow
```

**Rollback execution audit:** orice rollback (auto sau manual) emite `PHASE5_STAGE_ROLLBACK` event manual cu metadata `{stage:4, rollback_reason, decision_tree_branch, rollback_executed_by, rollback_at, follow_up_inc_id?}` în plus față de `CHURN_TASK_GENERATION_PAUSED` / `CHURN_MODEL_DEACTIVATED`.

---

## 6. Audit events expected (Stage 4 cumulative T+56 → T+77)

| Event | Source | Expected count | Threshold |
|---|---|---|---|
| `PHASE5_STAGE_ENTRY` (stage=4) | Manual T+56 | 1 | exact 1 |
| `CHURN_FEATURE_FLAG_ENABLED` | Config flag T+56 | 1 | exact 1 |
| `CHURN_MODEL_ACTIVATED` | Model promote T+56 | 1 | exact 1 |
| `CHURN_SCORE_COMPUTED` | Cron daily | ~105 (5 agenți × 21 zile) | informativ |
| `CHURN_CS_TASK_OPENED` (MED) | T+57..T+61 | 5 | exact 5 sintetic |
| `CHURN_CS_TASK_OPENED` (HIGH) | T+63 | 3 | exact 3 |
| `CHURN_CS_TASK_OPENED` (CRITICAL) | T+70 | 1 | exact 1 |
| `CHURN_CS_TASK_ASSIGNED` | Per task | 9 | exact 9 |
| `CHURN_CS_TASK_ESCALATED` (la cs_lead) | HIGH/CRITICAL | ≤4 | informativ |
| `CHURN_CS_TASK_OUTCOME_LOGGED` | Per outreach | ≥9 | informativ |
| `CHURN_CS_TASK_CLOSED` | Per close | 9 (toate închise pre-T+77) | exact 9 |
| `CHURN_CS_TASK_EXPIRED` | SLA breach | 0 | exact 0 |
| `CHURN_AUC_DRIFT_ALERT` (LOW) | Drift monitor | ≤4 (informativ) | <2/zi sustained |
| `CHURN_AUC_DRIFT_ALERT` (HIGH/CRITICAL) | Drift monitor | 0 | exact 0 |
| `CHURN_OUTCOME_PROMOTED_RETAINED` | Time-skip test T+71 | 1 (sim 90d) | exact 1 |
| `CHURN_RLS_VIOLATION_ATTEMPT` | Sintetic test (404 expected) | ≥3 sintetic test attempts | toate 403 |
| `INC_DECLARED` (simulated CRITICAL T+70) | PD simulated | 1 (flag simulated=true) | exact 1 simulat |
| `INC_RESOLVED` (simulated) | PD simulated | 1 | exact 1 |
| `PHASE5_STAGE_EXIT_PASS` (stage=4) | Manual T+77 | 1 | exact 1 dacă PASS |

---

## 7. Tenant cohort selection criteria

### 7.1 Tenant eligibility (Stage 4 dry-run intern)

- **Doar 1 tenant intern simulat** (CS REVYX intern). Zero impact pe clienți reali.
- Tenant flag `feature.is_internal_pilot_tenant=true` configurat în admin panel; protejat de modificare client-side.
- Niciun client real **NU** are `flag.churn_ga.enabled=true` în Stage 4 — această activare e amânată post-GA decision T+91.

### 7.2 Agent cohort în tenant intern

- 5 agenți sintetici (AG-INT-01 ... AG-INT-05) cu profile churn risk varied (calibrated să atingă cohort ≥30 cumulative ≤T+57).
- Agenți reali REVYX (echipa internă) **NU** sunt subiect în scoring real — doar agenți sintetici cu data sintetic generated.

### 7.3 cs_user + cs_lead cohort

- 3 cs_user (CSU-01..CSU-03) — vorbitori RO/RU/EN respectiv pentru tri-lingual playbook coverage.
- 1 cs_lead (CSL-01) — supervisor & override authority.
- Toate cu single-session BR-12 verify; provisioning RBAC per `tenancy-roles-extension` v1.1.0 §4.5.

### 7.4 Task generation thresholds

- MED: `risk_score ≥ 0.20 AND risk_score < 0.40` → 5 task-uri sintetice T+57..T+61.
- HIGH: `risk_score ≥ 0.40 AND risk_score < 0.60` → 3 task-uri sintetice T+63.
- CRITICAL: `risk_score ≥ 0.60` → 1 task sintetic T+70.

### 7.5 Exclusion criteria

- Niciun tenant `plan.tier IN ('FREE','TRIAL')`.
- Niciun client real (toate tenants externe `feature.is_internal_pilot_tenant=false`).
- Niciun `BUYER_PROFILE` impact (Stage 4 nu touch buyer flow).
- Niciun cs_user fără role-play attestation completă (gate 4.6 + 4.9).

---

## 8. Platform Matrix enforcement (DP-05) — Stage 4 specific

Per `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §15 + DP-05 (admin = Web only):

| Touchpoint | Web (cs_lead/manager/admin) | Mobile (cs_user only) | Test E2E daily |
|---|---|---|---|
| `/cs/churn-dashboard` (analytics) | ✅ full + filters + export CSV | ⛔ 403 server-side + client-side route guard | T+57 + T+63 + T+70 + T+77 Senior QA |
| `/cs/inbox` (task list) | ✅ full + bulk actions | 📱 cs_user limited (call list, no bulk) | T+58 + T+70 |
| `/admin/churn-config` (thresholds) | ✅ admin only | ⛔ blocked | T+57 entry |
| `/admin/audit-log` (compliance review) | ✅ compliance + admin | ⛔ blocked | T+76 post-pilot |
| Playbook execute (checklist) | ✅ BOTH | ✅ BOTH | T+61 + T+68 |
| Own churn score widget | ✅ agent self | ✅ agent self (BR-18) | T+58 spot-check |
| Audit log export CSV | ✅ admin/compliance only | ⛔ blocked | T+77 retrospective |

**Daily E2E verify Senior QA** — script automated cu Detox (Mobile) + Playwright (Web): tentative cs_user-uri Mobile să acceseze admin endpoints → expect 403; log de fiecare T+ pe Slack. Zero permitted access target.

---

## 9. Cross-references

- `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §7 — master gate Stage 4
- `RUNBOOK_REVYX_stage3-ml-pricing-launch` v1.0.0 — Stage 3 antecedent (T+35..T+56)
- `READINESS_REVYX_phase5` v1.0.4 §6 — sign-off matrix Stage 4 (updated S16)
- `TECH_SPEC_REVYX_churn-ga` v1.0.0 — initial churn spec (scoring + CS task gen + Prevention Rate)
- `TECH_SPEC_REVYX_churn-ga` v1.0.1 — FK alignment post ml-pricing-ga v1.0.2 rename
- `TECH_SPEC_REVYX_churn-ga` v1.0.2 — ★ platform PATCH (CS dashboard Web only DP-05)
- `TECH_SPEC_REVYX_audit-log` v1.1.1 §4.4.5 — `CHURN_*` 14 events catalog + §4.4.9 — `PHASE5_*` events
- `DPIA_REVYX_phase5` v1.0.0 §5.4 — churn-ga Art. 22 balancing test
- `RUNBOOK_REVYX_incident-response` v1.0.0 §6 — INC P1 protocol cs-on-call
- `cs-playbooks/CHURN_MEDIUM_v1.1.0.md` + `CHURN_HIGH_v1.1.0.md` + `CHURN_CRITICAL_v1.1.0.md` — tri-lingual playbooks
- `cs-playbooks/CHECKLIST_pre-pilot_v1.0.0.md` — 9 task-uri operational checklist
- `tenancy-roles-extension` v1.1.0 §4.5 — `cs_user` + `cs_lead` role definitions + RLS
- `AUDIT_REVYX_s15-external-pass` v1.0.0 §7 — Stage 4 entry unblocked
- `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §15 — Modul 14 ML Pricing & Churn (canonical)
- `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §7 — Phase 5 staged rollout
- `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §2.1 T-S16-04 — atomic task

---

## 10. Approval

| Aprobator | Sign-off |
|---|---|
| DS Lead | ✅ |
| CS Lead | ✅ |
| Solution Architect | ✅ |
| Senior QA / Test Architect | ✅ |
| Security Lead | ✅ |
| Backend Lead | ✅ |
| DPO | ✅ |
| Audit Lead | ✅ |
| VP Product | ✅ |

---

*docs/runbook/RUNBOOK_REVYX_stage4-churn-launch_v1.0.0.md · v1.0.0 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
