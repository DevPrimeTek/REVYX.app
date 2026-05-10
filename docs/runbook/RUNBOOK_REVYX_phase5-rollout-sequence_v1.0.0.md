# RUNBOOK — REVYX Phase 5 Rollout Sequence (Master Gate)
<!-- RUNBOOK_REVYX_phase5-rollout-sequence_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Solution Architect + Audit Lead + CS Lead + DS Lead + Security Lead | ★ Initial — closes F-S10-03 MED (AUDIT_REVYX_s10-external-pass v1.0.0) · ordine canonică Phase 5 GA gates: Mobile TestFlight → Marketplace pilot → ML Pricing CANARY 5% → Churn pilot CS dry-run → White-Label first Enterprise tenant · entry/exit gates per stage · rollback decision tree · master matrix metrici |

---

## 1. Scop

Acest runbook este **master gate** pentru rolloutul Phase 5 (deliverable S8/S9/S10). Toate spec-urile Phase 5 (`mobile-rn`, `marketplace-two-sided`, `ml-pricing-ga`, `churn-ga`, `white-label`, `iso27001-track`) au planuri proprii de rollout în secțiunile §16 / §20.10 — acest document **ordonează** execuția lor și definește gating-ul cross-stage.

| Atribut | Valoare |
|---|---|
| Tip rollout | Sequential (un stage la un moment dat) cu overlap controlat (vezi §3) |
| Owner | VP Product + CTO + Audit Lead (3-eyes la stage transitions) |
| Trigger inițial | DPIA semnat triple (DPO + Security Lead + CISO) per `DPIA_REVYX_phase5_v1.0.0` |
| Frecvență de gate-review | Săptămânal (luni 10:00 UTC), în plus on-demand la stage transition |
| Audit checkpoint | CLAUDE.md §10b Regula 3 trigger 2 — pre-rampa 100% per stage |

> **Regula de aur:** niciun stage trece la următoarea rampă fără ca exit gate-ul anterior să fie 100% verificat. Niciun rollback dintr-un stage nu blochează stage anterior deja la GA.

---

## 2. Pre-flight (T-7 zile înainte de Stage 1)

| Pre-flight check | Owner | Verificare |
|---|---|---|
| DPIA Phase 5 sign-off triple | DPO | `docs/legal/DPIA_REVYX_phase5_v1.0.0.md` semnat de DPO + Security Lead + CISO |
| AUDIT S10 finding F-03..F-09 closed | Audit Lead | `AUDIT_REVYX_s10-external-pass v1.0.0` §2.2 ✅ |
| `pii_field_registry` seed populat în prod | DPO + Senior DBA | F-S10-04 closed — verificare E2E `assertNoPII(audit_log_compliance_view)` |
| Migrarile 0500-0544 + 0600 + 0610 aplicate în prod | Senior DBA | Schema audit pass |
| `audit-catalog-lint` CI guard verde | Senior QA | Last 10 PR-uri în main fără uncatalogued events |
| Stripe products + price configurat (REAL catalog) | Billing Lead | Marketplace plan + WL Enterprise addon |
| Apple Developer + Google Play accounts active | Mobile Lead | Cert + provisioning profiles ready |
| DNS Cloudflare + Let's Encrypt ACME setup | DevOps | Test domain `tenant-test.revyx.app` provision OK |
| DKIM rotation runbook aplicabil (selector `rvxYYYYMMDD`) | Security + DevOps | `docs/runbook/RUNBOOK_REVYX_dkim-rotation_v1.0.0.md` rehearsal pe staging |
| Partition maintenance runbook aplicat și verificat | Senior DBA | Cron 02:00 UTC running, partiții pentru luna curentă + 6 luni viitoare exist |
| WhatsApp Business API templates 5/5 aprobate Meta | PM Lead | BRD §6.3 |
| All Phase 5 specs frozen (no changes ≥7 zile) | PM Lead | Git log ultimele 7 zile pe specs |

**Decizie GO/NO-GO Pre-flight:** review sincron VP Product + CTO + Audit Lead (3-eyes) la T-7 zile. Dacă oricare check ❌ → defer rollout cu 1 săptămână + remediere.

---

## 3. Sequence master

```
                                                    Cumulative timeline
T+0d   ┌─[ Stage 1 ] Mobile TestFlight (closed beta) ────────────────────────────────────► (D+14)
T+14d  ├─[ Stage 2 ] Marketplace pilot tenant (1 tenant) ──────────────────────────────► (D+35)
T+35d  ├─[ Stage 3 ] ML Pricing CANARY 5% ─────────────────────────────────────────────► (D+56)
T+56d  ├─[ Stage 4 ] Churn pilot CS playbook dry-run (1 tenant) ────────────────────────► (D+77)
T+77d  └─[ Stage 5 ] White-Label first Enterprise tenant ───────────────────────────────► (D+91)
T+91d   READY → Phase 5 GA decision (board sign-off)
```

> **Overlap:** Stage 2 și Stage 3 pot rula partial overlapped (sources de risc diferite); Stage 4 cere stage 3 stabilizat (>14 zile metric stabil); Stage 5 e dependent de DKIM rehearsal completat OK.

---

## 4. Stage 1 — Mobile TestFlight (closed beta)

**Spec:** `mobile-rn` v1.0.0 §16

### 4.1 Entry gates

| # | Gate | Sursă |
|---|---|---|
| 4.1.1 | App Store Connect: build TestFlight uploaded + privacy questionnaire submitted | Mobile Lead |
| 4.1.2 | FCM (Android) credentials provisioned + push permission test | Mobile Lead |
| 4.1.3 | E2E `assertNoPII(push_payload)` verde 100% (snapshot tests `mobile-rn` v1.0.0 §15.6) | Senior QA |
| 4.1.4 | Min supported app version pinned (`MOBILE_VERSION_UNSUPPORTED` test pass) | Solution Architect |
| 4.1.5 | Backend support pentru `MOBILE_DEVICE_*` + `AUTH_MOBILE_OT_*` events live (audit-log v1.1.0 §4.4.4) | Backend Lead |
| 4.1.6 | OT (One-Time-Token) flow rate-limited (per `iso27001-track` controls) | Security Lead |
| 4.1.7 | Cohort selectat: 25 agenți interni REVYX + 25 early-adopter agenți tenants pilot | CS Lead |

### 4.2 Rollout steps

1. Submit build TestFlight (T+0)
2. Apple review pass (typical 1-3 zile)
3. Invite cohort initial (25 interni) — D+3
4. Day 7 health check: crash rate <1%, push delivery rate >95%, no `assertNoPII` regressions
5. Expand cohort la +25 externi — D+7
6. Day 14 exit review

### 4.3 Exit gates → Stage 2 ready

| Metric | Target | Sursă |
|---|---|---|
| Crash-free sessions | ≥ 99% | Sentry (mobile-rn §13) |
| Push delivery rate | ≥ 95% | `MOBILE_PUSH_RECEIPT_FAILED` rate <5% (audit-log §4.4.4) |
| `MOBILE_PUSH_RECEIPT_FAILED` rate alert | 0 fired în ultimele 7 zile | Counter alert §4.4.4 |
| OT flow success rate (T0→T+exchanged) | ≥ 98% | `AUTH_MOBILE_OT_*` events |
| `assertNoPII` snapshot fails în CI | 0 | Senior QA report |
| Bug critic deschis | 0 | Mobile Lead triage |
| Cohort feedback NPS | ≥ +30 | CS survey |

### 4.4 Rollback decision tree (Stage 1)

```
Crash rate >2% sustained 24h?
  ├─ YES → ROLLBACK: revoke TestFlight build; force-revoke devices via MOBILE_DEVICE_REVOKED reason='COMPROMISED'? NO — use reason='ADMIN' (no security implication)
  └─ NO
     ├─ Push delivery <90% sustained 1h? → INVESTIGATE FCM/APNS quotas; downgrade Stage 1 cohort by 50%
     ├─ assertNoPII regression? → STOP TestFlight expansion; patch + re-test pe staging înainte de continuare
     └─ NPS <0 sau panică cohort? → PAUSE expansion 7 zile; CS Lead 1:1 cu cohort
```

---

## 5. Stage 2 — Marketplace pilot tenant (1 tenant)

**Spec:** `marketplace-two-sided` v1.0.1 §16

### 5.1 Entry gates

| # | Gate | Sursă |
|---|---|---|
| 5.1.1 | Stage 1 exit gates ✅ | §4.3 |
| 5.1.2 | Migrarea `marketplace_*` (0500-0544 family) aplicată în prod | Senior DBA |
| 5.1.3 | `BUYER_*` events 12/12 funcționale (audit-log §4.4.2) | Backend Lead |
| 5.1.4 | Tenant pilot selectat (MARKETPLACE tenant_type, GROWTH tier+) cu acord scris pentru pilot | CS Lead |
| 5.1.5 | Buyer self-service UX revizuit + tradus RO + RU | Senior Designer |
| 5.1.6 | GDPR consent flow live: `BUYER_PROFILE_CREATED` cu `gdpr_consent_at` + `gdpr_consent_version` non-NULL | DPO |
| 5.1.7 | Contact-grant flow live cu rate-limiting agent → buyer (max 3 requests/buyer/zi) | Security Lead |

### 5.2 Rollout steps

1. T+14: Activare feature flag `marketplace.enabled` la tenant pilot
2. T+15: Onboarding workshop cu 5-10 buyer-i din rețea pilot (manual onboarding)
3. T+18: Activare contact-grant flow agenți tenant
4. T+21: First `BUYER_CONTACT_GRANT_APPROVED` + `BUYER_PII_REVEALED` validated (audit pass cu Slack #privacy-watch alert verificat)
5. T+28: Health check D+14: ≥10 buyer profiles publicate, ≥3 contact grants approved
6. T+35: Exit review

### 5.3 Exit gates → Stage 3 ready

| Metric | Target | Sursă |
|---|---|---|
| Buyer profiles publicate | ≥ 10 | `BUYER_PROFILE_PUBLISHED` count |
| Contact grants approved | ≥ 3 | `BUYER_CONTACT_GRANT_APPROVED` count |
| `BUYER_PII_REVEALED` events log-uite cu Slack alert | 100% | Audit verify |
| Auto-EXPIRE pe `last_active_at` test E2E | Pass | Senior QA |
| GDPR consent `gdpr_consent_version` non-NULL | 100% | DBA report |
| Niciun `BUYER_PROFILE` cu `data_retention_expires_at` în trecut activ | 100% | Cron health |
| Tenant pilot NPS | ≥ +20 | CS survey |

### 5.4 Rollback decision tree (Stage 2)

```
PII leak detected (BUYER_PII_REVEALED fără grant)?
  ├─ YES → ROLLBACK CRITICAL: feature flag OFF imediat; INC_DECLARED P1; INC_GDPR_NOTIFIED_DPO automat
  └─ NO
     ├─ Contact-grant abuse rate (>3 denied grants/buyer în 24h)? → Rate-limit ajustat la 2/zi/buyer
     ├─ Buyer profile spam (>50 PUBLIC_LIMITED nepublicate la <1% LS contact)? → Status REVOKED automat + revisit fraud detection
     └─ Tenant pilot nemulțumit? → Stage 2 pause; debrief CS + Product
```

---

## 6. Stage 3 — ML Pricing CANARY 5%

**Spec:** `ml-pricing-ga` v1.0.2 §16 + §6 (algoritmi A/B gates)

### 6.1 Entry gates

| # | Gate | Sursă |
|---|---|---|
| 6.1.1 | Stage 2 exit gates ✅ (sau parallel-ready dacă overlap controlat) | §5.3 |
| 6.1.2 | Migrarea 0600 RENAME + view backwards-compat aplicată în prod | Senior DBA |
| 6.1.3 | Model `pricing-gbm` registered în `ml_model_registry` cu status SHADOW + 4 săpt monitoring SHADOW pass | DS Lead |
| 6.1.4 | Bias check pe `district` + `property_type` (`PRICING_MODEL_BIAS_ALERT` <1/lună în SHADOW) | DS Lead |
| 6.1.5 | Model card publicat (URI în `model_card_uri`) cu features + metrici + ethical considerations | DS Lead + DPO |
| 6.1.6 | Approver IDs configurați pentru 4-eyes GA (primary + second admin) | Security Lead |
| 6.1.7 | `PRICING_MODEL_*` events 10/10 funcționale (audit-log §4.4.1) | Backend Lead |
| 6.1.8 | Auto-rollback wired: 3 consecutive CRITICAL drift OR single 30% delta → `PRICING_MODEL_AUTO_ROLLBACK` | Solution Architect |

### 6.2 Rollout steps

1. T+35: `PRICING_MODEL_PROMOTED_CANARY` cu `cohort_pct=5` (4-eyes admin sign-off)
2. T+35..T+42: monitoring CANARY 5% — daily drift report (`PRICING_MODEL_DRIFT_ALERT` MAE/MAPE)
3. T+42 health check: MAE delta vs baseline <5%, niciun BIAS HIGH alert nereziliat, niciun AUTO_ROLLBACK
4. T+49: dacă health OK → ramp la 25% (re-cere 4-eyes); altfel hold/rollback
5. T+56: exit review (decision: ramp 100% în Stage 5 sau hold pentru drift normalization)

### 6.3 Exit gates → Stage 4 ready

| Metric | Target | Sursă |
|---|---|---|
| MAE delta vs baseline locked | <10% | `PRICING_MODEL_DRIFT_ALERT` rolling 7d |
| MAPE delta vs baseline | <10% | idem |
| BIAS alerts (HIGH/CRITICAL) | 0 nereziliate | `PRICING_MODEL_BIAS_ALERT` |
| AUTO_ROLLBACK fired | 0 | `PRICING_MODEL_AUTO_ROLLBACK` |
| 4-eyes approval audit trail | 100% complet | `PRICING_MODEL_4EYES_APPROVED` per promote |
| Cohort 25% stabil ≥ 14 zile | Pass | DS Lead daily report |

### 6.4 Rollback decision tree (Stage 3)

```
PRICING_MODEL_AUTO_ROLLBACK fired?
  ├─ YES → AUTO: revert la previous GA (ml_model_registry.status='ROLLED_BACK'); PD pricing-on-call P1
  └─ NO
     ├─ MAE delta sustained >15%? → Manual rollback: PRICING_MODEL_ROLLED_BACK cu reason='MANUAL_DRIFT'
     ├─ BIAS HIGH district X? → Pause CANARY; DS Lead retrain cu fairness constraint; re-promote SHADOW
     └─ Bug în feature pipeline? → Hotfix; menține CANARY 5% sau ramp-down la 1%
```

---

## 7. Stage 4 — Churn pilot CS playbook dry-run (1 tenant)

**Spec:** `churn-ga` v1.0.1 §19 + CS playbooks v1.1.0

### 7.1 Entry gates

| # | Gate | Sursă |
|---|---|---|
| 7.1.1 | Stage 3 exit gates ✅ (CANARY 25% stabil) | §6.3 |
| 7.1.2 | Model `churn-gbm` în `ml_model_registry` status SHADOW (4 săpt SHADOW pass) | DS Lead |
| 7.1.3 | AUC SHADOW >0.75 baseline locked | DS Lead |
| 7.1.4 | `CHURN_*` events 14/14 funcționale (audit-log §4.4.5) | Backend Lead |
| 7.1.5 | `cs_user` + `cs_lead` users provisionați la tenant pilot CS REVYX intern | RBAC owner |
| 7.1.6 | CS Playbooks v1.1.0 (RO+RU+EN) tipărite + role-play complet pentru cs_user | CS Lead |
| 7.1.7 | KPI Prevention Rate dashboard live cu cohort gate (≥30 flagged înainte de alert) | DS Lead |
| 7.1.8 | DPIA acoperă explicit churn-ga Art. 22 + legitimate interest balancing test | DPO |

### 7.2 Rollout steps

1. T+56: Activare `churn.enabled` la tenant pilot interim (CS REVYX intern, 1 tenant simulat)
2. T+57: Primul score compute → first `CHURN_CS_TASK_OPENED` la risk_band=MEDIUM (intern, fără impact real)
3. T+63: Dry-run cu 5 task-uri MEDIUM dummy → measure SLA-uri 168h respect
4. T+70: Dry-run 3 task-uri HIGH (escalation cs_lead în 4h test); 1 task CRITICAL (PD test)
5. T+77: Exit review — decizie pilot extern (Stage 5 sau hold)

### 7.3 Exit gates → Stage 5 ready

| Metric | Target | Sursă |
|---|---|---|
| Task SLA compliance dry-run | 100% | `CHURN_CS_TASK_EXPIRED` count = 0 |
| Cs_user fără PII unmask la `churn_score.factors` | 100% | RLS verify |
| `BR-18` test E2E (agent subiect nu vede churn score) | Pass | Senior QA |
| AUC monitoring stabil | <2% drift / 7d | `CHURN_AUC_DRIFT_ALERT` 0 |
| Outcome flow: PREVENTED→RETAINED 90d auto-job | Test pass cu time-skip | Backend Lead |
| Playbook adoption (RO+RU+EN versiuni efectiv folosite) | ≥1 outcome per limbă | CS Lead survey |

### 7.4 Rollback decision tree (Stage 4)

```
CHURN_AUC_DRIFT_ALERT CRITICAL?
  ├─ YES → CHURN_TASK_GENERATION_PAUSED cu reason='AUC_DROP'; PD cs-on-call; DS Lead retrain
  └─ NO
     ├─ Cs_user accesează churn_score.factors al unui agent prin alt path? → SECURITY_INCIDENT_REPORTED P1; remediere RBAC
     ├─ Playbook RO/RU/EN feedback negativ? → Iterate v1.1.x prin pull request normal; pilot extended
     └─ False positive rate >40%? → Threshold-uri retunate (0.20→0.25 MEDIUM); spec churn-ga v1.0.x patch
```

---

## 8. Stage 5 — White-Label first Enterprise tenant

**Spec:** `white-label` v1.0.1 §16 + DKIM runbook

### 8.1 Entry gates

| # | Gate | Sursă |
|---|---|---|
| 8.1.1 | Stage 4 exit gates ✅ | §7.3 |
| 8.1.2 | DKIM rotation runbook validat pe staging (rehearsal completă: rvxYYYYMMDD calendar + rollback) | Security + DevOps |
| 8.1.3 | Tenant Enterprise pilot selectat cu `plan.tier=ENTERPRISE` și DPA semnat | Sales Lead + Legal |
| 8.1.4 | `tenant_admin` user provisionat la tenant cu plan-tier validation trigger active (§4.7 tenancy-roles-extension) | RBAC owner |
| 8.1.5 | DNS ownership tenant validated (CNAME `tenant.example.com → revyx-edge`) | DevOps |
| 8.1.6 | Cloudflare HMAC signing key rotated + edge worker deployed cu skew ±120s (F-01 fix verificat) | Security Lead |
| 8.1.7 | Let's Encrypt provisioning live + auto-renew cron configurat | DevOps |
| 8.1.8 | `WL_*` events 12/12 funcționale (audit-log §4.4.3) | Backend Lead |
| 8.1.9 | DMARC report-only mode aplicat 7 zile pre-rotation cu zero failure pe baseline traffic | Security |

### 8.2 Rollout steps

1. T+77: Activare `wl.enabled` pentru tenant pilot Enterprise
2. T+78: `WL_DOMAIN_CLAIMED` → DNS verify → `WL_DOMAIN_VERIFIED`
3. T+79: TLS provision → `WL_TLS_PROVISIONED` (verifică expires_at >30 zile)
4. T+80: Configurare brand (logo, paletă, copy) → `WL_CONFIG_UPDATED`
5. T+81: Configurare DKIM domain → `WL_EMAIL_DOMAIN_VERIFIED` cu selector `rvxYYYYMMDD`
6. T+82: Test email send via tenant DKIM → verificare DMARC pass + SPF align
7. T+84: First DKIM rotation rehearsal pe acest tenant (per dkim-rotation runbook §4)
8. T+91: Exit review — decizie GA generală sau pilot extended

### 8.3 Exit gates → Phase 5 GA ready

| Metric | Target | Sursă |
|---|---|---|
| TLS auto-renew test | Pass | `WL_TLS_RENEWED` în ultimele 30 zile pe pilot |
| DMARC pass rate post-DKIM rotation | 100% | `WL_EMAIL_DOMAIN_VERIFIED` + extern DMARC report |
| Plan-tier downgrade test (ENTERPRISE→BUSINESS) cron suspends domeniul | Pass | `tenant_plan_downgrade_audit` + `WL_DOMAIN_SUSPENDED` |
| Edge HMAC reject pe skew >120s | Test pass | Security Lead Q&A |
| Tenant Enterprise NPS | ≥ +40 | CS survey |

### 8.4 Rollback decision tree (Stage 5)

```
DMARC failure post-rotation?
  ├─ YES → AUTO: rollback DKIM la selector vechi (per dkim-rotation runbook §6); WL_EMAIL_DOMAIN_REVOKED dacă imposibil
  └─ NO
     ├─ TLS provision fail (Let's Encrypt rate-limited)? → WL_TLS_FAILED retry; manual ACME challenge dacă retry≥3
     ├─ Edge HMAC mismatch (replay attack suspectat)? → SECURITY_INCIDENT_REPORTED; rotate signing key; force re-claim
     └─ Tenant nemulțumit branding? → Stage 5 hold; iterate config; nu blochează Phase 5 decision
```

---

## 9. Master Phase 5 GA decision (T+91)

### 9.1 Cumulative metrics

| Domain | Metric | Target acceptat la GA decision |
|---|---|---|
| Mobile | DAU mobile / total active agents | ≥ 30% (tinde spre 60% la 6 luni — BRD KPI) |
| Marketplace | Buyer profiles publicate | ≥ 50 (tinde spre 1.000 la 6 luni — BRD KPI) |
| ML Pricing | MAE post-GA | <10% degradare vs baseline locked |
| Churn | Prevention Rate (cohort ≥30) | Initial: ≥20% în primele 30 zile post-GA, target 30% la 90 zile |
| White-Label | Active Enterprise tenants | ≥ 1 cu DKIM rotated automat fără incident |
| ISO 27001 | Stage 1 audit firm engaged | RFP în derulare |

### 9.2 Approval gate Phase 5 GA

| Aprobator | Aprobare necesară pentru |
|---|---|
| VP Product | Aliniere obiective business (BRD §3 OB-08..OB-10) |
| CTO | Stabilitate tehnică (NFR-uri respectate) |
| CISO | Securitate (zero P1 incidents în Phase 5 stages) |
| DPO | GDPR + DPIA aplicat conform |
| Audit Lead | S11/S12 audit checkpoints PASS |
| CFO | Cost rollout în budget (Stripe + infra) |

3-eyes go decision: VP Product + CTO + CISO. Sign-off documented in `RBAC_ROLE_GRANTED` analog board-decision audit.

### 9.3 Rollback global Phase 5

Dacă în T+91 review oricare metric e CRITIC fail (de ex. P1 incident nereziliat, GDPR breach reportat regulator), Phase 5 GA blocked:

1. Toate stage-urile rămân în starea curentă (CANARY/pilot/Enterprise pilot).
2. RCA cu Audit Lead în 48h.
3. Replanificare Phase 5 GA cu ≥30 zile întârziere.
4. Comunicare board.

---

## 10. Stage transition events (audit trail)

Pentru meta-audit, fiecare stage transition emite în `AUDIT_LOG` un eveniment compus (custom):

| Eveniment | Trigger | Cataloged |
|---|---|---|
| `PHASE5_STAGE_ENTRY` | Stage transition la entry gates pass | NEW — propunere `audit-log` v1.1.1 (vezi F-S10-09 follow-up) |
| `PHASE5_STAGE_EXIT_PASS` | Exit gates 100% verde | NEW |
| `PHASE5_STAGE_ROLLBACK` | Decision tree triggers rollback | NEW |
| `PHASE5_GA_DECISION` | T+91 board sign-off | NEW |

> **Notă tracking:** aceste 4 events sunt propuneri pentru `audit-log` v1.1.1 (S12). Până atunci, transitions log-uite manual ca `RBAC_ROLE_GRANTED` analog cu `metadata.reason='PHASE5_STAGE_TRANSITION'`.

---

## 11. RACI

| Rol | Responsabilitate |
|---|---|
| VP Product | Decizii GO/NO-GO la fiecare stage transition |
| CTO | Aprobare tehnică + risk acceptance |
| Audit Lead | Verificare gate compliance + S11/S12 audit reports |
| CS Lead | Selectare cohort + tenant pilot + onboarding |
| DS Lead | Stage 3 + Stage 4 metric ownership (ML drift + churn AUC) |
| Security Lead | DKIM + edge HMAC + RBAC validation cross-stage |
| DPO | DPIA enforcement + Art. 22 monitoring (churn) + consent flow (marketplace) |
| Senior DBA | Migrations 0600 + 0610 + partition health pre-stage |
| SRE Lead | Cron health + alerting pipelines per stage |
| Backend Lead | Audit catalog events 75/75 functional |
| Mobile Lead | Stage 1 ownership |
| DevOps | TLS + DNS + DKIM rotation orchestration |
| Billing Lead | Stripe products + plan-tier gating |

---

## 12. Cross-references

- `AUDIT_REVYX_s10-external-pass` v1.0.0 §3.4 (F-S10-03 closed)
- `DPIA_REVYX_phase5` v1.0.0 (Pre-flight gate)
- `RUNBOOK_REVYX_dkim-rotation` v1.0.0 (Stage 5 dependency)
- `RUNBOOK_REVYX_partition-maintenance` v1.0.0 (Pre-flight gate)
- `RUNBOOK_REVYX_incident-response` v1.0.0 (Rollback PD/INC events)
- `mobile-rn` v1.0.0 §16 (Stage 1)
- `marketplace-two-sided` v1.0.1 §16 (Stage 2)
- `ml-pricing-ga` v1.0.2 §16 (Stage 3)
- `churn-ga` v1.0.1 §16 (Stage 4)
- `white-label` v1.0.1 §16 (Stage 5)
- `audit-log` v1.1.0 §4.4 (events catalog cross-stage)
- `tenancy-roles-extension` v1.1.0 (RBAC stage permissions)
- `PII_REDACTION_FIXTURES` v1.0.0 (assertNoPII gates)
- BRD v1.1.0 §11.5 (Phase 5 maturity scope)

---

## 13. Approval

| Aprobator | Sign-off |
|---|---|
| VP Product | ✅ |
| CTO | ✅ |
| CISO | ✅ |
| DPO | ✅ |
| Audit Lead | ✅ |
| CS Lead | ✅ |
| DS Lead | ✅ |
| Security Lead | ✅ |
| Senior DBA | ✅ |
| SRE Lead | ✅ |

---

*docs/runbook/RUNBOOK_REVYX_phase5-rollout-sequence_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
