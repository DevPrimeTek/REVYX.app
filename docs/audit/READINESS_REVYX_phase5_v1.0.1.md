# READINESS — REVYX Phase 5 (Pre-rollout sign-off matrix)
<!-- READINESS_REVYX_phase5_v1.0.1.md · v1.0.1 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Audit Lead + Senior PM + VP Product + CTO + CISO + DPO | Initial — closes F-S11-05 MED + F-S11-03 LOW + F-S11-08 LOW (AUDIT_REVYX_s11-external-pass v1.0.0) · single-page sign-off matrix per stage (1..5) cu gate status + owner + blocker findings + sign-off date placeholder · ties together AUDIT_REVYX_s11 + DPIA + runbook sequences pentru board sign-off pre-T0 |
| 1.0.1 | 2026-05 | Audit Lead + Senior PM | ★ PATCH — post S12 audit pass + S13 stage 1 launch prep · update §0 Pre-flight cu cross-ref `SCC_VENDORS_phase5` v1.0.0 (F-S11-03 doc-closed) · §3.1 Stage 1 entry gate 1.8 trecut la 🟡 status (signature pending pre-T-7) cu link `RUNBOOK_REVYX_stage1-mobile-launch` v1.0.0 §3 + `SCC_VENDORS_phase5` §3.1+§3.2 · §0.13 specs frozen confirmat post-S13 · §10 cross-ref nou (audit S12 + stage1-mobile-launch + scc-vendors) · sign-off date placeholders fără valori reale (board review urmează la T-7) |

---

## 1. Identitate

| Atribut | Valoare |
|---|---|
| Tip document | Readiness sign-off matrix (board pre-T0 + per-stage gate review) |
| Aplicabil pe | Phase 5 GA rollout per `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 |
| Format | Single-page table per stage; designed pentru board review în <30 min |
| Refresh cycle | T-7d Pre-flight + la fiecare stage transition (luni 10:00 UTC) + ad-hoc la finding/incident |
| Owner refresh | Audit Lead (orchestrare) |

---

## 2. Pre-flight master gate (T-7d înainte de Stage 1)

| # | Gate | Sursă spec | Status @ S13 | Owner | Blocker active | Sign-off | Data sign-off |
|---|---|---|---|---|---|---|---|
| 0.1 | DPIA Phase 5 sign-off triple (DPO + Security Lead + CISO) | `DPIA_REVYX_phase5` v1.0.0 §10 | 🟢 GREEN | DPO | — | ☐ | __ |
| 0.2 | Audit S11 + S12 findings F-S10-01..03/05/06/10 + F-S10-04/08/09 + F-S11-01/02/04/05 closed | `AUDIT_REVYX_s11-external-pass` v1.0.0 + `AUDIT_REVYX_s12-external-pass` v1.0.0 | 🟢 GREEN | Audit Lead | — | ☐ | __ |
| 0.3 | Audit S12 findings F-S11-03/08 closed doc-side; operational gating la T-7 / T+35 | `AUDIT_REVYX_s12-external-pass` §2.1 | 🟢 GREEN doc | Audit Lead | F-S11-03 (operational T-7), F-S11-08 (operational T+35) | ☐ | __ |
| 0.4 | `pii_field_registry` seed in prod (≥80 active rows) + E2E `assertNoPII` PASS | `TECH_SPEC_REVYX_pii-field-registry` v1.0.0 §11 | 🟡 PENDING (post-deploy 0611) | Senior DBA + DPO | Migrare 0611 deploy | ☐ | __ |
| 0.5 | Migrările 0500-0544 + 0600 + 0610 + 0611 + 0612 aplicate în prod | All Phase 5 specs | 🟡 PENDING (deploy schedule) | Senior DBA | — | ☐ | __ |
| 0.6 | `audit-catalog-lint` workflow live (script `.mjs` activat, multi-spec support post-S13) | `.github/workflows/audit-catalog-lint.yml` + `audit-catalog-lint.mjs` | 🟢 GREEN — script funcțional smoke-tested S13 | Senior QA | — | ☐ | __ |
| 0.7 | Stripe products + price catalog REAL (marketplace plan + WL Enterprise addon) | external | 🔴 PENDING | Billing Lead | (operational, gating Stage 2) | ☐ | __ |
| 0.8 | App Store + Google Play accounts active + cert + provisioning profiles | external | 🔴 PENDING | Mobile Lead | (operational) | ☐ | __ |
| 0.9 | DNS Cloudflare + Let's Encrypt ACME setup; test domain provisioned | external | 🟡 PENDING staging rehearsal | DevOps | — | ☐ | __ |
| 0.10 | DKIM rotation runbook rehearsal pe staging PASS | `RUNBOOK_REVYX_dkim-rotation` v1.0.0 §11 | 🟡 PENDING staging | Security + DevOps | — | ☐ | __ |
| 0.11 | Partition maintenance runbook v1.0.1 deployed; cron 02:00 UTC running | `RUNBOOK_REVYX_partition-maintenance` v1.0.1 | 🟡 PENDING (post-0612) | Senior DBA | — | ☐ | __ |
| 0.12 | WhatsApp Business API templates 5/5 aprobate Meta | BRD v1.1.0 §6.3 | 🟢 GREEN | PM Lead | — | ☐ | __ |
| 0.13 | All Phase 5 specs frozen ≥7 zile (no changes pe specs) | git log | 🟢 ★ confirmat post-S13 (S12 deliverables = ultima sesiune cu spec changes) | PM Lead | — | ☐ | __ |
| 0.14 | ★ Vendor SCC files signed: Apple FCM + Google Push (F-S11-03) — register `SCC_VENDORS_phase5` v1.0.0 §3.1 + §3.2 | `SCC_VENDORS_phase5` v1.0.0 + DPIA §3.1 Art. 44+ | 🟡 PENDING SIGNATURE (per `SCC_VENDORS_phase5` §5 plan operațional T-14 → T-0); Cloudflare + AWS + Stripe 🟢 ON FILE | DPO + Legal | Apple/Google signature pre-T-7 | ☐ | __ |
| 0.15 | ★ Stage 1 launch runbook day-by-day approved (`RUNBOOK_REVYX_stage1-mobile-launch` v1.0.0) | `RUNBOOK_REVYX_stage1-mobile-launch` v1.0.0 §9 | 🟢 GREEN — approved S13 | Mobile Lead + Senior QA + CS Lead | — | ☐ | __ |

### 2.1 Pre-flight 3-eyes decision GO/NO-GO

| Aprobator | Rol | RO | RU | EN | Sign-off | Data |
|---|---|---|---|---|---|---|
| VP Product | Aliniere obiective business (BRD §3 OB-08..OB-10) | Aprobă strategic | Утверждает стратегически | Approves strategically | ☐ | __ |
| CTO | Stabilitate tehnică (NFR + S11/S12 audit closed) | Aprobă tehnic | Утверждает технически | Approves technically | ☐ | __ |
| Audit Lead | Toate findings ≤MED tracked + HIGH closed | Aprobă audit | Утверждает аудит | Approves audit | ☐ | __ |

**Decizie pre-flight:** dacă **toate** check-urile §2 marcate 🟢 sau 🟡 (cu plan deploy explicit) **ȘI** 3-eyes sign-off → GO Stage 1 entry. Orice 🔴 fără mitigation plan → NO-GO + defer 1 săptămână.

---

## 3. Stage 1 — Mobile TestFlight (T+0d → T+14d)

### 3.1 Entry gates

| # | Gate | Sursă | Status | Owner | Blocker | Sign-off | Data |
|---|---|---|---|---|---|---|---|
| 1.1 | App Store Connect: build TestFlight uploaded + privacy questionnaire submitted | `mobile-rn` §16 + `stage1-mobile-launch` §3.1 | ☐ | Mobile Lead | — | ☐ | __ |
| 1.2 | FCM (Android) credentials provisioned + push permission test | `mobile-rn` §16 | ☐ | Mobile Lead | — | ☐ | __ |
| 1.3 | E2E `assertNoPII(push_payload)` verde 100% (snapshot tests) | `mobile-rn` §15.6 | ☐ | Senior QA | — | ☐ | __ |
| 1.4 | Min supported app version pinned + test PASS | `mobile-rn` | ☐ | Solution Architect | — | ☐ | __ |
| 1.5 | Backend `MOBILE_DEVICE_*` + `AUTH_MOBILE_OT_*` events live | `audit-log` v1.1.1 §4.4.4 | ☐ | Backend Lead | — | ☐ | __ |
| 1.6 | OT flow rate-limited per ISO 27001 controls | `iso27001-track` | ☐ | Security Lead | — | ☐ | __ |
| 1.7 | Cohort selectat (25 interni REVYX + 25 externi tenants pilot) | `stage1-mobile-launch` §7 | ☐ | CS Lead | — | ☐ | __ |
| 1.8 | ★ SCC Apple FCM + Google Push on file (F-S11-03) — `SCC_VENDORS_phase5` §3.1 + §3.2 | DPIA Art. 44+ + `SCC_VENDORS_phase5` v1.0.0 | 🟡 PENDING SIGNATURE pre-T-7 | DPO + Legal | (gating signature) | ☐ | __ |
| 1.9 | ★ Sentry mobile project + dashboards online + Slack #mobile-pilot canal creat | `stage1-mobile-launch` §2.10 | ☐ | Senior QA + Mobile Lead | — | ☐ | __ |
| 1.10 | ★ `PHASE5_STAGE_ENTRY` event manual emis la T+0 cu metadata complete | `audit-log` v1.1.1 §4.4.9 + `stage1-mobile-launch` §3.1 | ☐ | Mobile Lead | — | ☐ | __ |

### 3.2 Exit gates → Stage 2 ready

| Metric | Target | Measured | Status | Sign-off |
|---|---|---|---|---|
| Crash-free sessions (Sentry) | ≥ 99% | __ | ☐ | ☐ |
| Push delivery rate | ≥ 95% | __ | ☐ | ☐ |
| `MOBILE_PUSH_RECEIPT_FAILED` rate alert fired (7d) | 0 | __ | ☐ | ☐ |
| OT flow success rate | ≥ 98% | __ | ☐ | ☐ |
| `assertNoPII` snapshot fails CI | 0 | __ | ☐ | ☐ |
| Bug critic deschis | 0 | __ | ☐ | ☐ |
| Cohort NPS | ≥ +30 | __ | ☐ | ☐ |
| `PHASE5_STAGE_EXIT_PASS` event emis | 1 | __ | ☐ | ☐ |
| `AUTH_MOBILE_OT_INVALID_ATTEMPT` count anormal (>50/h) | 0 | __ | ☐ | ☐ |

**Stage 1 sign-off:** VP Product + CTO + Audit Lead ☐ Data: __

---

## 4. Stage 2 — Marketplace pilot tenant (T+14d → T+35d)

### 4.1 Entry gates

| # | Gate | Sursă | Status | Owner | Blocker | Sign-off | Data |
|---|---|---|---|---|---|---|---|
| 2.1 | Stage 1 exit gates ✅ | §3.2 | ☐ | Audit Lead | — | ☐ | __ |
| 2.2 | Migrarea `marketplace_*` (0500-0544) aplicată în prod | DBA | ☐ | Senior DBA | — | ☐ | __ |
| 2.3 | `BUYER_*` events 12/12 funcționale | `audit-log` §4.4.2 | ☐ | Backend Lead | — | ☐ | __ |
| 2.4 | Tenant pilot selectat + acord scris pentru pilot | CS | ☐ | CS Lead + Legal | — | ☐ | __ |
| 2.5 | Buyer self-service UX revizuit + tradus RO + RU | Designer | ☐ | Senior Designer | — | ☐ | __ |
| 2.6 | GDPR consent flow live cu `gdpr_consent_at` + `_version` non-NULL | DPO | ☐ | DPO | — | ☐ | __ |
| 2.7 | Contact-grant flow live cu rate-limiting (3/buyer/zi) | Security | ☐ | Security Lead | — | ☐ | __ |
| 2.8 | Stripe products + plan-tier gating verificat | Billing | ☐ | Billing Lead | (operational from §0.7) | ☐ | __ |

### 4.2 Exit gates → Stage 3 ready

| Metric | Target | Measured | Status |
|---|---|---|---|
| Buyer profiles publicate | ≥ 10 | __ | ☐ |
| Contact grants approved | ≥ 3 | __ | ☐ |
| `BUYER_PII_REVEALED` events log-uite cu Slack alert | 100% | __ | ☐ |
| Auto-EXPIRE pe `last_active_at` test E2E | Pass | __ | ☐ |
| GDPR consent `gdpr_consent_version` non-NULL | 100% | __ | ☐ |
| Niciun `BUYER_PROFILE` cu `data_retention_expires_at` în trecut activ | 100% | __ | ☐ |
| Tenant pilot NPS | ≥ +20 | __ | ☐ |

**Stage 2 sign-off:** VP Product + CTO + DPO ☐ Data: __

---

## 5. Stage 3 — ML Pricing CANARY 5% (T+35d → T+56d)

### 5.1 Entry gates

| # | Gate | Sursă | Status | Owner | Blocker | Sign-off | Data |
|---|---|---|---|---|---|---|---|
| 3.1 | Stage 2 exit gates ✅ | §4.2 | ☐ | Audit Lead | — | ☐ | __ |
| 3.2 | Migrarea 0600 RENAME + view backwards-compat aplicată | DBA | ☐ | Senior DBA | — | ☐ | __ |
| 3.3 | Model `pricing-gbm` SHADOW 4 săpt + monitoring PASS | DS | ☐ | DS Lead | — | ☐ | __ |
| 3.4 | Bias check `district` + `property_type` (<1 BIAS_ALERT/lună) | DS | ☐ | DS Lead | — | ☐ | __ |
| 3.5 | Model card publicat (model_card_uri) | DS + DPO | ☐ | DS Lead + DPO | — | ☐ | __ |
| 3.6 | Approver IDs configurați (primary + second admin) | Security | ☐ | Security Lead | — | ☐ | __ |
| 3.7 | `PRICING_MODEL_*` events 10/10 funcționale | `audit-log` §4.4.1 | ☐ | Backend Lead | — | ☐ | __ |
| 3.8 | Auto-rollback wired (3 consecutive CRITICAL OR 30% delta) | SA | ☐ | Solution Architect | — | ☐ | __ |
| 3.9 | ★ 4-eyes E2E smoke-test PASS pe staging (F-S11-08): full path REQUEST → APPROVE primary + second | Senior QA | ☐ | Senior QA | — | ☐ | __ |

### 5.2 Exit gates → Stage 4 ready

| Metric | Target | Measured | Status |
|---|---|---|---|
| MAE delta vs baseline locked | <10% | __ | ☐ |
| MAPE delta vs baseline | <10% | __ | ☐ |
| BIAS alerts (HIGH/CRITICAL) nereziliate | 0 | __ | ☐ |
| AUTO_ROLLBACK fired | 0 | __ | ☐ |
| 4-eyes approval audit trail complet | 100% | __ | ☐ |
| Cohort 25% stabil ≥14 zile | Pass | __ | ☐ |

**Stage 3 sign-off:** CTO + DS Lead + Audit Lead ☐ Data: __

---

## 6. Stage 4 — Churn pilot CS playbook dry-run (T+56d → T+77d)

### 6.1 Entry gates

| # | Gate | Sursă | Status | Owner | Blocker | Sign-off | Data |
|---|---|---|---|---|---|---|---|
| 4.1 | Stage 3 exit gates ✅ (CANARY 25% stabil) | §5.2 | ☐ | Audit Lead | — | ☐ | __ |
| 4.2 | Model `churn-gbm` SHADOW 4 săpt PASS | DS | ☐ | DS Lead | — | ☐ | __ |
| 4.3 | AUC SHADOW >0.75 baseline locked | DS | ☐ | DS Lead | — | ☐ | __ |
| 4.4 | `CHURN_*` events 14/14 funcționale (incl. v1.1.1 alerting clarifying) | `audit-log` §4.4.5 | ☐ | Backend Lead | — | ☐ | __ |
| 4.5 | `cs_user`+`cs_lead` provisionați tenant pilot CS REVYX | RBAC owner | ☐ | RBAC owner | — | ☐ | __ |
| 4.6 | CS Playbooks v1.1.0 (RO+RU+EN) tipărite + role-play complet | CS | ☐ | CS Lead | — | ☐ | __ |
| 4.7 | KPI Prevention Rate dashboard live (cohort gate ≥30) | DS | ☐ | DS Lead | — | ☐ | __ |
| 4.8 | DPIA acoperă explicit churn-ga Art. 22 + balancing test | DPO | ☐ | DPO | — | ☐ | __ |
| 4.9 | ★ `CHECKLIST_pre-pilot` v1.0.0 disponibil + cs_user familiarizat | CS Lead | ☐ | CS Lead | — | ☐ | __ |

### 6.2 Exit gates → Stage 5 ready

| Metric | Target | Measured | Status | Sursă verify |
|---|---|---|---|---|
| Task SLA compliance dry-run (9 task-uri) | 100% | __ | ☐ | `CHURN_CS_TASK_EXPIRED`=0 |
| 0 leak PII în cs_notes (assertNoPII PASS) | 0 | __ | ☐ | PII_REDACTION_FIXTURES §5.3 |
| BR-18 RLS test E2E | Pass | __ | ☐ | Senior QA |
| AUC drift / 7d | <2% | __ | ☐ | `CHURN_AUC_DRIFT_ALERT`=0 |
| Outcome flow PREVENTED→RETAINED 90d | Pass | __ | ☐ | time-skip test |
| Playbook adoption (RO+RU+EN ≥1 outcome) | 3 | __ | ☐ | CS survey |
| `CHECKLIST_pre-pilot` v1.0.0 100% verde | 100% | __ | ☐ | CS Lead aggregate §6 |

**Stage 4 sign-off:** VP Product + CS Lead + DS Lead + Audit Lead ☐ Data: __

---

## 7. Stage 5 — White-Label first Enterprise tenant (T+77d → T+91d)

### 7.1 Entry gates

| # | Gate | Sursă | Status | Owner | Blocker | Sign-off | Data |
|---|---|---|---|---|---|---|---|
| 5.1 | Stage 4 exit gates ✅ | §6.2 | ☐ | Audit Lead | — | ☐ | __ |
| 5.2 | DKIM rotation runbook validat pe staging | `dkim-rotation` §11 | ☐ | Security + DevOps | — | ☐ | __ |
| 5.3 | Tenant Enterprise pilot selectat cu `plan.tier=ENTERPRISE` + DPA semnat | Sales + Legal | ☐ | Sales Lead + Legal | — | ☐ | __ |
| 5.4 | `tenant_admin` user provisionat cu plan-tier validation trigger | RBAC | ☐ | RBAC owner | — | ☐ | __ |
| 5.5 | DNS ownership tenant validated (CNAME `tenant.example.com → revyx-edge`) | DevOps | ☐ | DevOps | — | ☐ | __ |
| 5.6 | Cloudflare HMAC signing key rotated + edge worker deployed | Security | ☐ | Security Lead | — | ☐ | __ |
| 5.7 | Let's Encrypt provisioning live + auto-renew cron | DevOps | ☐ | DevOps | — | ☐ | __ |
| 5.8 | `WL_*` events 12/12 funcționale | `audit-log` §4.4.3 | ☐ | Backend Lead | — | ☐ | __ |
| 5.9 | DMARC report-only mode aplicat 7 zile pre-rotation cu zero failure | Security | ☐ | Security | — | ☐ | __ |
| 5.10 | ★ **`pii_field_registry` seed populat în prod (≥80 rows)** | `pii-field-registry` v1.0.0 §11 | ☐ | DPO + Senior DBA | F-S10-04 (resolved S12 inline) | ☐ | __ |
| 5.11 | ★ E2E `assertNoPII(audit_log_compliance_view.row)` PASS pe fixtures sintetice | Senior QA | ☐ | Senior QA | — | ☐ | __ |
| 5.12 | ★ AUDIT_LOG event manual `RBAC_PII_REGISTRY_DEPLOYED` emis | DBA | ☐ | Senior DBA | — | ☐ | __ |
| 5.13 | ★ Provisioning compliance_auditor neblocant (verificare nu mai e gating BLOCKED) | Security | ☐ | Security Lead | — | ☐ | __ |

### 7.2 Exit gates → Phase 5 GA ready

| Metric | Target | Measured | Status |
|---|---|---|---|
| TLS auto-renew test (`WL_TLS_RENEWED` 30d) | Pass | __ | ☐ |
| DMARC pass rate post-DKIM rotation | 100% | __ | ☐ |
| Plan-tier downgrade test (ENTERPRISE→BUSINESS) cron suspends domain | Pass | __ | ☐ |
| Edge HMAC reject pe skew >120s | Pass | __ | ☐ |
| Tenant Enterprise NPS | ≥ +40 | __ | ☐ |

**Stage 5 sign-off:** VP Product + CTO + CISO + DPO ☐ Data: __

---

## 8. Master Phase 5 GA decision (T+91)

### 8.1 Cumulative metrics review

| Domain | Metric | Target acceptat la GA | Measured | Status |
|---|---|---|---|---|
| Mobile | DAU mobile / total active agents | ≥ 30% | __ | ☐ |
| Marketplace | Buyer profiles publicate | ≥ 50 | __ | ☐ |
| ML Pricing | MAE post-GA | <10% degradare | __ | ☐ |
| Churn | Prevention Rate (cohort ≥30) | ≥20% (30d) → 30% (90d) | __ | ☐ |
| White-Label | Active Enterprise tenants cu DKIM rotated automat | ≥ 1 | __ | ☐ |
| ISO 27001 | Stage 1 audit firm engaged | RFP în derulare | __ | ☐ |
| `PHASE5_*` events catalogate funcționale | 4 events | __ | ☐ |

### 8.2 GA approval gate (board)

| Aprobator | Rol | Sign-off | Data |
|---|---|---|---|
| VP Product | Aliniere obiective business (BRD §3 OB-08..OB-10) | ☐ | __ |
| CTO | Stabilitate tehnică (NFR-uri respectate) | ☐ | __ |
| CISO | Securitate (zero P1 incidents în Phase 5 stages) | ☐ | __ |
| DPO | GDPR + DPIA aplicat conform | ☐ | __ |
| Audit Lead | S11/S12/S13/S14 audit checkpoints PASS | ☐ | __ |
| CFO | Cost rollout în budget (Stripe + infra) | ☐ | __ |

**3-eyes go decision:** VP Product + CTO + CISO ☐. Sign-off documentat în AUDIT_LOG event `PHASE5_GA_DECISION` (per `audit-log` v1.1.1 §4.4.9).

---

## 9. Status legend

| Symbol | Meaning |
|---|---|
| 🟢 GREEN | Gate passed; no blockers; sign-off pending only |
| 🟡 YELLOW | Gate in progress with explicit deploy/remediation plan; eligibil sign-off conditioning |
| 🔴 RED | Gate blocked; remediation explicit needed before sign-off; defer rollout |
| ☐ | Sign-off open |
| ☑ | Sign-off complete (initials + data în coloana respectivă) |

---

## 10. Cross-references

- `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 — master gate sequence (5 stages + GA decision §9)
- ★ `RUNBOOK_REVYX_stage1-mobile-launch` v1.0.0 — operational day-by-day Stage 1 (T+0..T+14)
- `AUDIT_REVYX_s11-external-pass` v1.0.0 — findings status verify
- ★ `AUDIT_REVYX_s12-external-pass` v1.0.0 — findings post-S12 status (NEW)
- `DPIA_REVYX_phase5` v1.0.0 — DPIA single-source (Art. 35) cu sign-off triple
- ★ `SCC_VENDORS_phase5` v1.0.0 — SCC vendor register (Apple/Google/Cloudflare/AWS/Stripe) — pre-flight §0.14
- `RUNBOOK_REVYX_dkim-rotation` v1.0.0 — Stage 5 dependency
- `RUNBOOK_REVYX_partition-maintenance` v1.0.1 — Pre-flight gate (cron + retention)
- `TECH_SPEC_REVYX_pii-field-registry` v1.0.0 — Stage 5 entry blocker (F-S10-04 closed)
- `TECH_SPEC_REVYX_audit-log` v1.1.1 — `PHASE5_*` events catalog + `CHURN_CS_TASK_OPENED` clarifying
- `CHECKLIST_pre-pilot` v1.0.0 — Stage 4 dry-run operational
- CS Playbooks v1.1.0 (MEDIUM, HIGH, CRITICAL) — RO+RU+EN
- BRD v1.1.0 §11.5 — Phase 5 maturity scope

---

## 11. Update protocol

Acest document e **single-page** intentionat. Updates:

1. La stage transition (Pre-flight → Stage 1 → ... → GA decision): Audit Lead reset coloanele `Status` + `Measured` la valorile actuale.
2. Sign-off-uri **NU se șterg** după ce sunt marcate complete — devin istoric.
3. Findings noi descoperite mid-stage: append în coloana `Blocker` cu referință la AUDIT new finding ID; NU bump versiune document (e operational artifact, nu spec).
4. Bump versiune (v1.1.0 minor) la **Phase 5 GA close** — doc devine archive cu toate sign-off-urile colectate.
5. ★ Bump PATCH (v1.0.x) la fiecare audit checkpoint închis (S12 → v1.0.1, S13 audit pre-Stage 1 → v1.0.2, etc.).

---

## 12. Approval (acest document v1.0.1)

| Aprobator | Sign-off |
|---|---|
| Audit Lead | ✅ |
| Senior PM | ✅ |
| VP Product | ✅ |
| CTO | ✅ |
| CISO | ✅ |
| DPO | ✅ |

---

*docs/audit/READINESS_REVYX_phase5_v1.0.1.md · v1.0.1 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
