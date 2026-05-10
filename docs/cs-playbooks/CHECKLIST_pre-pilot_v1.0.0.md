# CS PLAYBOOK CHECKLIST — Pre-pilot dry-run (Stage 4) — RO + RU + EN
<!-- CHECKLIST_pre-pilot_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | CS Lead + Senior PM + CS RU + CS EN + Senior QA | ★ Initial — closes F-S11-04 MED (AUDIT_REVYX_s11-external-pass v1.0.0) · operational checklist Stage 4 dry-run (5 task-uri MEDIUM + 3 HIGH + 1 CRITICAL) per `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §7.2 · tri-lingvistic (RO + RU + EN coloane paralele) · format printable (cs_user marchează manual) + integrare `CHURN_*` events emit |

---

## 1. Identitate

| Atribut | Valoare |
|---|---|
| Scope | Stage 4 (Churn pilot CS playbook dry-run) per master rollout sequence v1.0.0 §7 |
| Trigger | T+56..T+77 timeline |
| Cohort dry-run | 1 tenant pilot CS REVYX intern (5 MEDIUM dummy + 3 HIGH + 1 CRITICAL test tasks) |
| Owner | CS Lead (orchestrare) · cs_user-i nominalizați (execuție) · cs_lead (escalation HIGH/CRITICAL) |
| Acceptance | 100% checkboxes verzi pe toate 9 task-uri dry-run; rezultat → `READINESS_REVYX_phase5` Stage 4 entry |
| Limbă | Coloane paralele RO + RU + EN; cs_user folosește limba primară a tenantului dummy |

---

## 2. Pre-execuție (T+56)

### 2.1 Setup tenant pilot CS REVYX intern

| # | Item | RO | RU | EN | ✓ |
|---|---|---|---|---|---|
| 2.1.1 | Tenant pilot intern creat în prod (flag `pilot.churn=true`) | Tenant intern creat și activat | Внутренний тенант создан и активирован | Internal pilot tenant created & active | ☐ |
| 2.1.2 | `cs_user` + `cs_lead` users provisionați conform `tenancy-roles-extension` v1.1.0 §6.5 | Useri CS provisionați | Пользователи CS подготовлены | CS users provisioned | ☐ |
| 2.1.3 | CS Playbooks v1.1.0 (RO+RU+EN) tipărite + role-play complet | Playbook-uri tipărite + role-play complet | Playbooks распечатаны + role-play выполнен | Playbooks printed + role-play complete | ☐ |
| 2.1.4 | Slack channels create: `#cs-ops`, `#cs-sla`, `#cs-pilot-dryrun` | Canale Slack create | Slack каналы созданы | Slack channels created | ☐ |
| 2.1.5 | PagerDuty CS on-call rotation activă pentru CRITICAL test | PagerDuty CS on-call activ | PagerDuty CS on-call активен | PagerDuty CS on-call active | ☐ |
| 2.1.6 | Dashboard KPI Prevention Rate live (cohort gate ≥30) | Dashboard KPI live | Dashboard KPI live | KPI dashboard live | ☐ |

### 2.2 Sign-off pre-dry-run

| Aprobator | Necesar | RO | RU | EN | ✓ |
|---|---|---|---|---|---|
| CS Lead | Confirmare prep playbook + cohort | Confirmare cohort + playbook | Подтверждение когорты + playbook | Cohort + playbook confirmed | ☐ |
| DS Lead | AUC SHADOW > 0.75 baseline | AUC SHADOW ≥ 0.75 verificat | AUC SHADOW ≥ 0.75 проверен | AUC SHADOW ≥ 0.75 verified | ☐ |
| Audit Lead | Coverage events `CHURN_*` 14/14 | Events 14/14 funcționale | События 14/14 функциональны | Events 14/14 functional | ☐ |
| DPO | DPIA §5.1 churn-ga semnat | DPIA churn-ga semnat | DPIA churn-ga подписан | DPIA churn-ga signed | ☐ |

---

## 3. Dry-run task MEDIUM (5 instanțe) — T+57..T+63

> **Obiectiv:** verificare end-to-end flow pentru `risk_band=MEDIUM`, SLA 168h (7 zile), cs_user solo (no escalation). 5 task-uri dummy creați manual via `CHURN_CS_TASK_OPENED` eveniment cu metadata sintetică.

### 3.1 Per task MEDIUM checklist (executat de cs_user)

| Pas | RO | RU | EN | ✓ task#1 | ✓ #2 | ✓ #3 | ✓ #4 | ✓ #5 |
|---|---|---|---|---|---|---|---|---|
| 3.1.1 Citește `churn_score.factors` top 3 | Citit factors top 3 | Прочитал факторы top 3 | Read top 3 factors | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.1.2 Verificare BR-18 (agent subject NU vede score) | BR-18 verificat (RLS) | BR-18 проверен (RLS) | BR-18 verified (RLS) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.1.3 Identificare pattern dominant (5 categorii) | Pattern identificat | Паттерн идентифицирован | Pattern identified | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.1.4 Selectare template per `tenant.locale_primary` | Template selectat (RO/RU/EN) | Шаблон выбран (RO/RU/EN) | Template selected (RO/RU/EN) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.1.5 Touch 1 — Email trimis (T0) | Email trimis | Email отправлен | Email sent | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.1.6 `CHURN_CS_TASK_CONTACTED` channel=EMAIL emis | Eveniment emis | Событие отправлено | Event emitted | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.1.7 Touch 2 — Slack DM la T+5d (dacă no-reply) | Slack DM trimis (dacă cazul) | Slack DM отправлен (если применимо) | Slack DM sent (if applicable) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.1.8 Discovery questions — preg pentru call (dacă acceptă) | Întrebări pregătite | Вопросы подготовлены | Questions prepped | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.1.9 Outcome înregistrat (PREVENTED/DEFERRED/UNREACHABLE) | Outcome înregistrat | Исход записан | Outcome recorded | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.1.10 `CHURN_OUTCOME_RECORDED` cu reason_code valid | Eveniment outcome OK | Событие outcome OK | Outcome event OK | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.1.11 cs_notes redactare PII manual (preferă) — verifică NO PII direct | cs_notes fără PII | cs_notes без PII | cs_notes no PII | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.1.12 Schedule follow-up 30d dacă PREVENTED | Follow-up 30d setat | Follow-up 30d установлен | Follow-up 30d set | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3.1.13 Verificare SLA 168h respectat (NO `CHURN_CS_TASK_EXPIRED`) | SLA 168h respectat | SLA 168h соблюден | SLA 168h respected | ☐ | ☐ | ☐ | ☐ | ☐ |

### 3.2 Aggregate verificare MEDIUM (la final T+63)

| Verificare | Target | Actual | ✓ |
|---|---|---|---|
| 5/5 task-uri completate | 5 | __ | ☐ |
| 0 `CHURN_CS_TASK_EXPIRED` events | 0 | __ | ☐ |
| 0 leak PII în cs_notes (assertNoPII PASS) | 0 | __ | ☐ |
| Distribuție outcome reasonable (cel puțin 2 PREVENTED + 1 UNREACHABLE) | divers | __ | ☐ |
| Toate 3 limbi (RO/RU/EN) folosite cel puțin 1× | RO+RU+EN | __ | ☐ |

---

## 4. Dry-run task HIGH (3 instanțe) — T+64..T+70

> **Obiectiv:** flow `risk_band=HIGH`, SLA 72h, cs_lead escalation activ în 4h dacă cs_user nu acționează. 3 task-uri sintetic create.

### 4.1 Per task HIGH checklist

| Pas | RO | RU | EN | ✓ #1 | ✓ #2 | ✓ #3 |
|---|---|---|---|---|---|---|
| 4.1.1 Pre-contact prep ≤2h (factors + 30d activitate + tickets/billing/APS) | Prep ≤2h efectuat | Prep ≤2h выполнен | Prep ≤2h done | ☐ | ☐ | ☐ |
| 4.1.2 Identificare decision-maker (owner/manager/admin) | Decision-maker identificat | Decision-maker определен | Decision-maker identified | ☐ | ☐ | ☐ |
| 4.1.3 Concession matrix pregătit (§6 HIGH playbook) | Matrix pregătit | Matrix подготовлен | Matrix prepped | ☐ | ☐ | ☐ |
| 4.1.4 Touch 1 — Personal call în 24h | Call efectuat | Звонок выполнен | Call completed | ☐ | ☐ | ☐ |
| 4.1.5 Opening script aplicat (RO/RU/EN per locale) | Opening aplicat | Opening применен | Opening applied | ☐ | ☐ | ☐ |
| 4.1.6 Discovery 6 întrebări (§4.1 playbook) | Discovery completă | Discovery выполнено | Discovery completed | ☐ | ☐ | ☐ |
| 4.1.7 `CHURN_CS_TASK_CONTACTED` channel=CALL emis | Eveniment emis | Событие отправлено | Event emitted | ☐ | ☐ | ☐ |
| 4.1.8 Concession ofertă propusă (sau `OTHER` dacă nu) | Ofertă/notă | Предложение/заметка | Offer/note | ☐ | ☐ | ☐ |
| 4.1.9 Outcome PREVENTED/DEFERRED înregistrat în 72h | Outcome în 72h | Исход в 72h | Outcome in 72h | ☐ | ☐ | ☐ |
| 4.1.10 Verificare cs_lead notification dacă cs_user inactiv >4h | Escalation testat | Escalation проверен | Escalation tested | ☐ | ☐ | ☐ |
| 4.1.11 cs_notes PII-free | cs_notes fără PII | cs_notes без PII | cs_notes no PII | ☐ | ☐ | ☐ |

### 4.2 Aggregate HIGH

| Verificare | Target | Actual | ✓ |
|---|---|---|---|
| 3/3 task-uri completate în 72h | 3 | __ | ☐ |
| Cel puțin 1 cs_lead escalation triggered (test escalation path) | ≥1 | __ | ☐ |
| 0 leak PII | 0 | __ | ☐ |

---

## 5. Dry-run task CRITICAL (1 instanță) — T+71..T+77

> **Obiectiv:** flow `risk_band=CRITICAL`, SLA 24h, PagerDuty cs-on-call alert + Slack #cs-ops auto. 1 task sintetic.

### 5.1 Checklist CRITICAL

| Pas | RO | RU | EN | ✓ |
|---|---|---|---|---|
| 5.1.1 `CHURN_CS_TASK_OPENED` cu `risk_band=CRITICAL` emis | Event CRITICAL emis | Событие CRITICAL отправлено | Event CRITICAL emitted | ☐ |
| 5.1.2 Slack #cs-ops alert primit automat (per audit-log v1.1.1 §4.4.5 clarifying) | Slack alert primit | Slack alert получен | Slack alert received | ☐ |
| 5.1.3 PagerDuty cs-on-call paged (P2/P1) | PD page primit | PD page получен | PD page received | ☐ |
| 5.1.4 cs_lead acknowledge în ≤15 min (NFR business) | Ack ≤15 min | Ack ≤15 min | Ack ≤15 min | ☐ |
| 5.1.5 Pre-contact ≤30 min (CRITICAL playbook §2) | Prep ≤30 min | Prep ≤30 min | Prep ≤30 min | ☐ |
| 5.1.6 Touch 1 — Personal call în 4h (CEO/Owner direct) | Call în 4h | Звонок в 4h | Call in 4h | ☐ |
| 5.1.7 Concession matrix CRITICAL aplicat (oferte agresive auth) | Matrix CRITICAL | Matrix CRITICAL | Matrix CRITICAL | ☐ |
| 5.1.8 Outcome înregistrat în 24h | Outcome ≤24h | Исход ≤24h | Outcome ≤24h | ☐ |
| 5.1.9 Post-touch debrief CS Lead (regardless of outcome) | Debrief CS Lead | Debrief CS Lead | Debrief CS Lead | ☐ |
| 5.1.10 Verificare BR-18 RLS (CEO/Owner NU vede score) | BR-18 confirmat | BR-18 подтвержден | BR-18 confirmed | ☐ |
| 5.1.11 cs_notes PII-free + sentiment-conștient | cs_notes curate | cs_notes чистые | cs_notes clean | ☐ |

### 5.2 Aggregate CRITICAL

| Verificare | Target | Actual | ✓ |
|---|---|---|---|
| 1/1 task completat în 24h | 1 | __ | ☐ |
| PagerDuty page → ack ≤15 min | ≤15 min | __ | ☐ |
| Outcome PREVENTED sau RETAINED log-uit | retained | __ | ☐ |

---

## 6. Post dry-run review (T+77 — exit Stage 4)

| Verificare | Sursă | RO | RU | EN | ✓ |
|---|---|---|---|---|---|
| 6.1 Toate cele 9 task-uri completate | aggregate §3+§4+§5 | 9/9 completed | 9/9 выполнено | 9/9 completed | ☐ |
| 6.2 0 `CHURN_CS_TASK_EXPIRED` | KPI | 0 expired | 0 просрочено | 0 expired | ☐ |
| 6.3 0 leak PII (assertNoPII pe `cs_notes` export) | PII_REDACTION_FIXTURES | 0 leak | 0 утечка | 0 leak | ☐ |
| 6.4 AUC monitoring stabil <2% drift / 7d | DS Lead | AUC stabil | AUC стабилен | AUC stable | ☐ |
| 6.5 BR-18 RLS test E2E PASS (agent subiect 0 access) | Senior QA | BR-18 PASS | BR-18 PASS | BR-18 PASS | ☐ |
| 6.6 Outcome PREVENTED→RETAINED 90d auto-job verificat (time-skip test) | Backend Lead | Job verificat | Задача проверена | Job verified | ☐ |
| 6.7 Playbook adoption: cel puțin 1 outcome per limbă (RO+RU+EN) | CS Lead survey | RO+RU+EN ≥1 | RO+RU+EN ≥1 | RO+RU+EN ≥1 | ☐ |
| 6.8 cs_user feedback survey (NPS pe playbook) | CS Lead | NPS colectat | NPS собран | NPS collected | ☐ |
| 6.9 PagerDuty CRITICAL test → ack ≤15 min | PD report | ack ≤15 min | ack ≤15 min | ack ≤15 min | ☐ |
| 6.10 cs_lead escalation HIGH testată funcțional ≤4h | Audit verify | escalation OK | escalation OK | escalation OK | ☐ |
| 6.11 Decision Stage 5 entry (recomandare CS Lead) | CS Lead | GO/HOLD | GO/HOLD | GO/HOLD | ☐ |

---

## 7. Sign-off post dry-run

| Rol | RO | RU | EN | Sign-off | Data |
|---|---|---|---|---|---|
| CS Lead | Aprobă recomandarea Stage 5 entry | Утверждает рекомендацию для Stage 5 | Approves Stage 5 entry recommendation | ☐ | __ |
| DS Lead | AUC stabil + retraining nevoia? | AUC стабилен + потребность переобучения? | AUC stable + retraining needed? | ☐ | __ |
| Senior QA | E2E tests + PII leak 0 | E2E tests + PII leak 0 | E2E tests + PII leak 0 | ☐ | __ |
| DPO | cs_notes PII compliance | cs_notes PII соответствие | cs_notes PII compliance | ☐ | __ |
| Audit Lead | Toate 9 task-uri events emise + 0 uncatalogued | 9 задач + 0 некаталогизированных | 9 tasks + 0 uncatalogued | ☐ | __ |
| VP Product (3-eyes Stage 5 entry) | GO/NO-GO Stage 5 | GO/NO-GO Stage 5 | GO/NO-GO Stage 5 | ☐ | __ |

---

## 8. Rollback dry-run

Dacă oricare din §6.1–§6.10 ❌ → **HOLD Stage 5 entry**:

1. Document failure în `INC_DECLARED` (severity P3 dacă playbook flow; P2 dacă PII leak; P1 dacă cs_lead escalation broke).
2. CS Lead post-mortem 48h cu lessons learned.
3. Iterate fix → re-run dry-run subset (only failed flows) înainte de re-attempt Stage 5.
4. Audit Lead notifie + readiness matrix actualizat.

---

## 9. Cross-references

- `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §7 — Stage 4 sequence
- `CHURN_MEDIUM` v1.1.0 — playbook MEDIUM tri-lingual
- `CHURN_HIGH` v1.1.0 — playbook HIGH tri-lingual
- `CHURN_CRITICAL` v1.1.0 — playbook CRITICAL tri-lingual
- `audit-log` v1.1.1 §4.4.5 — `CHURN_*` events catalog (incl. `CHURN_CS_TASK_OPENED` alerting clarifying)
- `tenancy-roles-extension` v1.1.0 §6.5 — `cs_user`/`cs_lead` permissions
- `DPIA_REVYX_phase5` v1.0.0 §5.1 — DPIA churn-ga
- `PII_REDACTION_FIXTURES` v1.0.0 §5.3 — cs_notes export PII test
- `READINESS_REVYX_phase5` v1.0.0 — Stage 4 entry/exit gates
- BR-16 (HITL), BR-18 (RLS subject blind), BR-13..BR-18 (Pilon Retention, BRD v1.1.0 §6.4)

---

## 10. Approval

| Aprobator | Sign-off |
|---|---|
| CS Lead | ✅ |
| Senior PM | ✅ |
| Senior QA / Test Architect | ✅ |
| Audit Lead | ✅ |
| DPO | ✅ |

---

*docs/cs-playbooks/CHECKLIST_pre-pilot_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
