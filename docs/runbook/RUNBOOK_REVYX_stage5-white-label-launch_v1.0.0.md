# RUNBOOK — REVYX Phase 5 Stage 5 White-Label First Enterprise Tenant (T+77 → T+91)
<!-- RUNBOOK_REVYX_stage5-white-label-launch_v1.0.0.md · v1.0.0 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** Pre-development / S17 deliverable; Phase 5 Stage 5 operational runbook.
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.1.md` §7 Phase 5 staged rollout + §0.3 (S17 deliverables).
**Roadmap ref:** `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §2.2 T-S17-03.
**Trio canonical citat:** Master Plan v1.1.1 + Platform Matrix v1.0.0 + Detailed Roadmap v1.0.0 (Regula 8 + Regula 9).

## 0.1 Platform Matrix

**Source canonical:** `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §14 (Modul 13 — White-Label Configuration ⛔ **DP-05 — Web only complet**) + §16 Modul 15 (Audit & Compliance — `WL_*` audit log viewer Web only).

UI touchpoints Stage 5 (cu tag platform explicit per Regula 9):

| Feature | Web | Mobile | Spec sursă | Note |
|---|---|---|---|---|
| Custom domain claim | 🌐 tenant_admin | ⛔ DP-05 | `white-label` v1.0.0 §4.1+§5.1 | Web only — Modul 13.1 |
| Brand colors + logo upload | 🌐 tenant_admin | ⛔ DP-05 | `white-label` v1.0.0 §6.7 | Web only — Modul 13.2 |
| DKIM rotation status | 🌐 admin | ⛔ DP-05 | `dkim-rotation` runbook | Web only — Modul 13.3 |
| Custom email templates | 🌐 tenant_admin | ⛔ DP-05 | `white-label` v1.0.0 §6.5 | Web only — Modul 13.4 |
| Plan-tier upgrade (Enterprise) | 🌐 tenant_admin | ⛔ DP-05 | TBD billing module | Web only — Modul 13.5 |
| `WL_*` audit log viewer | 🌐 compliance + admin | ⛔ DP-05 | `audit-log` v1.1.1 §4.4.3 | Web only — Modul 15.2 |
| Public tenant landing (post-domain claim) | 🌐 public visitor | 🌐 webview iframe | `white-label` v1.0.0 §6.1 | Public Web; Mobile uses native browser deep-link |

**DP-05 enforcement în Stage 5:** **100% admin features Web only complet** — 5/5 features în Modul 13 sunt admin-only Web. Zero touchpoint Mobile pentru orice operațiune Stage 5. Server-side RBAC guard + client-side route guard pe `/admin/branding/*` + `/admin/wl-config/*`. Test E2E §4 daily check verifica acces denied din Mobile build (Detox automated).

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-06 | DevOps + Security Lead + Backend Lead + DPO + Audit Lead + VP Product + CTO + CISO + Sales Lead + Legal | ★ Initial — operational runbook day-by-day Stage 5 (White-Label first Enterprise tenant) per `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §8 + `TECH_SPEC_REVYX_white-label` v1.0.0 §16 + `RUNBOOK_REVYX_dkim-rotation` v1.0.0 § 4-§9 · cohort = **1 tenant Enterprise pilot real (TENANT-ENT-PILOT-01)** cu DPA semnat T+74 + tenant_admin provisionat T+75 + DNS ownership validated T+75 + custom domain `pilot.example-revyx-enterprise.md` · acoperă pre-flight T+76 entry gates (17 items: Stage 4 exit + DKIM staging rehearsal + DPA + DNS + Cloudflare HMAC + Let's Encrypt + WL_* 12 events + DMARC report-only 7d + BSI DPA + 4 migrări bundle + ml-pricing-ga v1.0.4 + warm pool tune) · day-by-day T+77..T+91 (15 zile) · daily health 10 metrici WL_* · rollback decision tree 5 branches (DMARC fail / TLS provision fail / edge HMAC mismatch / plan-tier downgrade / DKIM compromise) · Platform Matrix §14 Modul 13 cross-ref (White-Label **🌐 Web only complet DP-05**) · creat post-S16 audit pass (Stage 5 entry unblocked complet 17/17 gates GREEN) |

---

## 1. Scop

Acest runbook este **operational day-by-day** pentru Stage 5 Phase 5 (White-Label first Enterprise tenant). Master gate `phase5-rollout-sequence` v1.0.0 §8 definește entry/exit gates; acest doc descrie **execuția** zilnică cu owners, comenzi, audit events așteptate. Cohort este **1 tenant Enterprise pilot real** (TENANT-ENT-PILOT-01, REVYX intern partner Moldova) — pilot extins post-Stage 5 cu 2-3 tenants suplimentari va fi decis la GA decision T+91.

| Atribut | Valoare |
|---|---|
| Stage | 5 — White-Label first Enterprise tenant |
| Durată | T+77 → T+91 zile (15 zile cu 5 milestone checks: T+77 entry, T+80 brand config + DKIM activate, T+84 first DKIM rotation rehearsal pe tenant, T+88 plan-tier downgrade test, T+91 exit + GA decision) |
| Cohort target | **1 tenant Enterprise pilot** (TENANT-ENT-PILOT-01) cu `plan.tier=ENTERPRISE`; domain `pilot.example-revyx-enterprise.md`; 1 tenant_admin user TENT-ADM-01 |
| Distribuție | Feature flag `wl.enabled=true` la tenant pilot only; activare DKIM signing cu selector `rvx20260801` post-rotation rehearsal |
| Owner | DevOps (TLS + DNS + provisioning lead) · Security Lead (DKIM + edge HMAC + DMARC) · Backend Lead (WL_* events + subdomain routing) · DPO (DPA + GDPR review) · Audit Lead (gating) · VP Product + CTO + CISO (3-eyes go decision) · Sales Lead + Legal (tenant DPA) |
| Timezone | UTC+2 (Chișinău) |
| Cross-spec | `white-label` v1.0.0 (backend + DB schema + algorithms) · `audit-log` v1.1.1 §4.4.3 (`WL_*` 12 events) + §4.4.9 (`PHASE5_*`) · `dkim-rotation` v1.0.0 §3-§9 (full cycle) · `tenancy-roles-extension` v1.1.0 §4.7 (`tenant_admin` role + plan-tier validation trigger) · `DPIA_REVYX_phase5` v1.0.0 §5.5 (white-label data flows) · `SCC_VENDORS_phase5` v1.0.1 §3.6 (BSI Group MD DPA signed T+77 BSI-M4) · `incident-response` v1.0.0 (P1 security incident protocol) |

---

## 2. Pre-flight T+76 (verificare entry gates pre-T+77 GO)

| # | Gate (din `phase5-rollout-sequence` §8.1 + `READINESS_REVYX_phase5` §7.1) | Owner | Verificare |
|---|---|---|---|
| 5.1 | Stage 4 exit gates ✅ | Audit Lead | Link `AUDIT_REVYX_s16-external-pass` v1.0.0 §2.1 (7/7 PASS) + `READINESS_REVYX_phase5` v1.0.5 §6.2 |
| 5.2 | DKIM rotation runbook validat pe staging (rehearsal completă: rvxYYYYMMDD calendar + rollback) | Security Lead + DevOps | Staging rehearsal T+72 PASS; selector `rvx20260714` test cycle complete cu DMARC pass rate 100% post-rotation + rollback simulated; per `dkim-rotation` §4-§9 full cycle |
| 5.3 | Tenant Enterprise pilot selectat cu `plan.tier=ENTERPRISE` + DPA semnat | Sales Lead + Legal | TENANT-ENT-PILOT-01 selectat 2026-07-08 (T+74); DPA semnat 2026-07-08 dual signature (Tenant CTO + ITPRO SYSTEM CEO); PDF în `legal-vault/contracts/dpa/tenant-ent-pilot-01/2026-07/DPA_signed.pdf` |
| 5.4 | `tenant_admin` user provisionat la tenant cu plan-tier validation trigger active | RBAC owner (Security Lead) | TENT-ADM-01 provisionat 2026-07-09 (T+75); `tenancy-roles-extension` v1.1.0 §4.7 plan-tier validation trigger active; single-session BR-12 verify |
| 5.5 | DNS ownership tenant validated (CNAME `pilot.example-revyx-enterprise.md → revyx-edge.app`) | DevOps | DNS validated 2026-07-09 (T+75); CNAME propagat global; TXT record `_revyx-domain-claim` confirmat (token 32-byte signed) |
| 5.6 | Cloudflare HMAC signing key rotated + edge worker deployed cu skew ±120s | Security Lead | Signing key rotated 2026-07-07 (T+73); edge worker deployed 2026-07-08 (T+74); skew test ±120s reject confirmed via `WL_HEADER_SIG_INVALID` 400 response în smoke test |
| 5.7 | Let's Encrypt provisioning live + auto-renew cron | DevOps | Live 2026-07-09 (T+75); auto-renew cron `tls.acme.renew.daily` 02:30 UTC+2 active; test cycle renewal at 60d expiry threshold verified pe staging |
| 5.8 | `WL_*` events 12/12 funcționale (audit-log §4.4.3) | Backend Lead | Smoke test staging 2026-07-08 (T+74): toate 12 events emit cu payload assertNoPII PASS (Senior QA verify) |
| 5.9 | DMARC report-only mode aplicat 7 zile pre-rotation cu zero failure | Security Lead | T+68 → T+75 (7 zile); `p=none` report-only; rua reports clean; zero failure pe baseline traffic (verified DMARC parser daily) |
| 5.10 | `pii_field_registry` seed populat în prod (≥80 rows) | DPO + Senior DBA | 2026-07-09 (T+75): migrare 0611 deployed; seed 84 rows active (above target 80); `RBAC_PII_REGISTRY_DEPLOYED` event manual emis 16:00 UTC+2 |
| 5.11 | E2E `assertNoPII(audit_log_compliance_view.row)` PASS | Senior QA | Senior QA 2026-07-09 (T+75) PASS pe 500 sample rows random; zero PII leak |
| 5.12 | AUDIT_LOG event manual `RBAC_PII_REGISTRY_DEPLOYED` emis | Senior DBA | Emis 2026-07-09 (T+75) 16:00 UTC+2 cu metadata complete (registry_version, seed_count=84, deployed_by, dpo_sign_off_at) |
| 5.13 | Provisioning compliance_auditor neblocant | Security Lead | 1 compliance_auditor user provisionat T+76 pentru BSI Group MD audit firm access path |
| 5.14 | BSI Group MD DPA semnat | DPO + CISO | BSI-M4 completat T+77 (DPA semnat dual ITPRO SYSTEM + BSI Group MD); PDF în `legal-vault/scc/bsi-md/2026-07/BSI_DPA_signed.pdf`; SCC v1.0.2 PATCH planificat S18 |
| 5.15 | Migrare 0545 (F-S14-03) + 0613 (F-S15-03) aplicate prod | Senior DBA | Bundle 0611+0612+0545+0613 deployed T+75 PM (4 migrări idempotente cumulative); post-deploy benchmark: `buyer_profile_search_view` p95=24ms + `outcome_join` job 78min |
| 5.16 | `ml-pricing-ga` v1.0.4 PATCH (F-S15-01 min_sample 30→50) deployed | DS Lead + DPO | Config flag deploy T+76 prin `ml_model_registry.config` JSON update; backwards compat full; instant rollout (no model retraining) |
| 5.17 | ONNX warm pool tune (F-S15-02) + outcome_join cron tune (F-S15-03) deployed | DevOps + Senior DBA | Toate deployed T+68 + T+75 per AUDIT_REVYX_s16-external-pass §5.3 + §5.4 |

**Decizie pre-flight:** dacă **toate** ☑ → emit `PHASE5_STAGE_ENTRY` event manual (owner: Backend Lead via admin tool) cu `{stage:5, stage_name:'white_label_enterprise', entry_gates_status:'PASS', approver_ids:[vp_product, cto, ciso, dpo], dpia_version:'1.0.0', readiness_doc_uri, tenant_id:'TENANT-ENT-PILOT-01', tenant_domain:'pilot.example-revyx-enterprise.md', dkim_rehearsal_selector:'rvx20260714', bsi_dpa_signed_at}`; altfel defer +1 săpt.

**Decizie 4-eyes GO:** VP Product + CTO + CISO + DPO sync T+76 16:00 UTC+2 confirmation GO.

---

## 3. Sequence day-by-day

### 3.1 T+77 (Luni 2026-07-13) — Pre-flight + activare wl.enabled

| Ora (UTC+2) | Acțiune | Owner | Output / Audit event |
|---|---|---|---|
| 09:00 | Pre-flight 4-eyes sync confirm GO (VP Product + CTO + CISO + DPO) | Audit Lead | `READINESS_REVYX_phase5` v1.0.5 §7.1 sign-off ☑ |
| 09:30 | Emit `PHASE5_STAGE_ENTRY` (stage=5) event manual cu metadata complete | Backend Lead | AUDIT_LOG verified |
| 10:00 | Activare `wl.enabled=true` la tenant pilot Enterprise (config flag, fără 4-eyes per spec; doar `PHASE5_STAGE_ENTRY` audit) | DevOps + Backend Lead | `WL_CONFIG_UPDATED` event emis (per audit-log §4.4.3) |
| 10:30 | Verify subdomain routing middleware (host header → tenant lookup) — smoke test request la `https://pilot.example-revyx-enterprise.md/api/health` | Backend Lead | 200 + `tenant_id=TENANT-ENT-PILOT-01` în response header `X-REVYX-Tenant` |
| 11:00 | Edge HMAC test: tentative request fără signing header → 400 + `WL_HEADER_SIG_INVALID` event | Security Lead | Test PASS |
| 14:00 | DPO verify `assertNoPII` pe `WL_CONFIG_UPDATED` payload + verify white_label_config JSON schema match `white-label` §4.2 | DPO + Senior QA | Verification PASS |
| 17:00 | Daily standup #wl-stage5 — green/red status | DevOps + Backend Lead | Slack thread |

**Health threshold T+77:** zero `WL_*` failure events; tenant pilot enabled; edge worker active.

### 3.2 T+78 (Marți) — Domain claim + DNS verification

| Ora | Acțiune | Owner | Output |
|---|---|---|---|
| 09:00 | Tenant_admin TENT-ADM-01 (Web only, `/admin/branding/domain` 🌐 per Platform Matrix §14 Modul 13.1) claim domain `pilot.example-revyx-enterprise.md` | DevOps + Tenant TENT-ADM-01 | `WL_DOMAIN_CLAIMED` event emis (per audit-log §4.4.3) |
| 09:30 | DNS verification: backend `wl.dns.verify.cron` execută la 09:30 (sub-15min cycle); verifică CNAME + TXT record `_revyx-domain-claim` | Backend Lead | `WL_DOMAIN_VERIFIED` event emis (cca 09:35) |
| 10:00 | TLS provisioning via Let's Encrypt ACME challenge (HTTP-01 challenge); auto-renew config aplicat | DevOps | `WL_TLS_PROVISIONED` event emis cu `expires_at = now() + 90d` |
| 11:00 | Smoke test HTTPS: `curl -I https://pilot.example-revyx-enterprise.md/api/health` → 200 + valid TLS cert | DevOps + Security Lead | Test PASS |
| 14:00 | Senior QA verify acces din Mobile build → redirect to Web admin URL (DP-05 enforcement per Modul 13) | Senior QA | Mobile blocked confirmed (Detox automated) |
| 17:00 | Standup | DevOps + Backend Lead | Slack thread |

**Threshold T+78:** `WL_DOMAIN_VERIFIED` + `WL_TLS_PROVISIONED` events emise; HTTPS live; Mobile DP-05 enforcement verified.

### 3.3 T+79 → T+80 (Miercuri + Joi) — Brand config + DKIM domain setup

- **T+79 (Miercuri):**
  - 09:00: TENT-ADM-01 (🌐 `/admin/branding/colors-logo` Web only) upload logo (200KB max per `white-label` §6.7 + §12 R0) + paletă culori brand + font selection.
  - 09:30: `WL_LOGO_UPLOADED` event emis cu `{logo_url, content_hash_sha256, file_size_bytes}` (assertNoPII PASS — URL nu conține PII).
  - 10:00: `WL_CONFIG_UPDATED` event emis cu schema JSON validation per `white-label` §4.2 (color contrast WCAG AA verify cu auto-correction la `WL_INVALID_COLOR_CONTRAST` dacă fail).
  - 11:00: Theme injection SSR verify (per `white-label` §6.2): smoke test request la `https://pilot.example-revyx-enterprise.md/login` → verify HTML response include CSS variables corecte; screenshot Slack.
  - 14:00: Cs_user vorbitor RU access landing page → verify language switch UI + brand integrity (Mobile webview redirect to Web per Modul 13).
  - 17:00: Standup.

- **T+80 (Joi):**
  - 09:00: TENT-ADM-01 (🌐 `/admin/branding/email-domain` Web only) configure email sending domain `mail.pilot.example-revyx-enterprise.md`.
  - 09:30: DNS verification email domain: SPF (`v=spf1 include:_spf.revyx.app -all`) + DKIM TXT record (selector `rvx20260801` pe domeniu tenant); MX records optional pentru reply tracking.
  - 10:00: `WL_EMAIL_DOMAIN_VERIFIED` event emis cu selector `rvx20260801` (cycle activă post-rehearsal T+72 staging).
  - 11:00: Test email send: synthetic transactional email (welcome cs_user message) via tenant DKIM signing → verify DMARC pass + SPF align (DMARC parser daily check).
  - 14:00: Security Lead verify Cloudflare edge HMAC headers correctly propagated; replay attack simulation (request cu skew >120s) → 400 + `WL_HEADER_SIG_INVALID`.
  - 17:00: Standup.

**Audit events așteptate cumulative (T+77..T+80, 4 zile):**

| Event | Expected | Threshold |
|---|---|---|
| `PHASE5_STAGE_ENTRY` (stage=5) | 1 (T+77) | exact 1 |
| `WL_CONFIG_UPDATED` | 3 (T+77 init + T+79 brand + T+80 email) | exact 3 |
| `WL_DOMAIN_CLAIMED` | 1 (T+78) | exact 1 |
| `WL_DOMAIN_VERIFIED` | 1 (T+78) | exact 1 |
| `WL_TLS_PROVISIONED` | 1 (T+78) | exact 1 |
| `WL_LOGO_UPLOADED` | 1 (T+79) | exact 1 |
| `WL_EMAIL_DOMAIN_VERIFIED` | 1 (T+80 cu selector rvx20260801) | exact 1 |
| `WL_HEADER_SIG_INVALID` (test smoke) | ≥1 | informativ defensive |

### 3.4 T+81 → T+83 (Vineri + Sâmb-Dum) — Monitoring + DMARC pass rate

- Telemetria zilnică (Sentry + AUDIT_LOG + Grafana `wl-pilot-dashboard` 🌐 Web only):
  - `WL_TLS_PROVISIONED` count rolling 24h (target stable 1 — no re-provision needed).
  - `WL_TLS_FAILED` count (target 0).
  - `WL_HEADER_SIG_INVALID` count (target 0 production traffic; informativ defensive tests OK).
  - DMARC pass rate rolling 24h (target 100% post-rotation T+80).
  - `WL_EMAIL_DKIM_NOT_VERIFIED` count (target 0 — toate emails signed).
  - SPF align rate (target 100%).
- T+81: First production email batch (welcome message la TENT-ADM-01 + 3 sintetic user invites) → toate 4 emails delivered cu DMARC pass.
- T+82..T+83: Continued monitoring + DMARC parser daily (extern DMARC aggregator service).
- T+83 EOD: Cumulative DMARC pass rate = **100%** (3 zile post-DKIM activate).

### 3.5 T+84 (Marți) — First DKIM rotation rehearsal pe tenant pilot

| Ora | Acțiune | Owner | Output |
|---|---|---|---|
| 09:00 | Pre-rehearsal check: current selector `rvx20260801` active 4 zile; DMARC pass rate 100%; zero failure | Security Lead | Health report Slack |
| 09:30 | Generate new DKIM key (RSA-2048) per `dkim-rotation` v1.0.0 §4.1; store in Vault per §4.2; emit pre-activation `WL_EMAIL_DOMAIN_VERIFIED` audit event (per §4.3) | Security Lead + DevOps | Vault entry + audit event |
| 10:00 | Publicare DNS TXT record nou selector `rvx20260814` (per `dkim-rotation` §5.1 Cloudflare API automation) | DevOps | TXT record published; both selectors live simultaneous |
| 10:30 | DNS propagation check (T-1 in normal cycle, but accelerated rehearsal): verify global resolvers see both selectors | DevOps | Propagation verified |
| 14:00 | **T0 simulated activation**: switch outbound signing la noua cheie `rvx20260814` (per `dkim-rotation` §6.1); emit final `WL_EMAIL_DOMAIN_VERIFIED` cu noua selector | Security Lead | Activation complete; audit event |
| 14:30 | Smoke-test outbound: synthetic email send via noua selector → DMARC parser verify pass (per `dkim-rotation` §6.3 + §7.1) | Security Lead | Test PASS sau ROLLBACK §3.7 |
| 15:00 | Old selector rămâne TXT record live (parallel period 14 zile per `dkim-rotation` §3 calendar; sunset T+98 efective, post-Stage 5 close); zero emails signed cu vechi key începând T+84 14:00 | DevOps | Cycle correct |
| 17:00 | Standup + rehearsal report | Security Lead + DevOps | Slack + retrospective notes |

**Threshold T+84:** zero DMARC failure post-rotation; both selectors live in DNS (parallel period); active signing pe noua selector; rollback drill validated (not invoked).

### 3.6 T+85 → T+87 (Miercuri-Vineri) — Post-rotation stability + Tenant NPS prep

- Telemetria intensivă DMARC + DKIM:
  - DMARC pass rate rolling 24h (target 100% post-rotation).
  - `WL_EMAIL_DOMAIN_REVOKED` count (target 0 — no revoke needed; sunset pending T+98).
  - DKIM signature verification în rua reports (Google + Microsoft).
- T+85..T+87: Production email traffic monitored; zero DMARC failure observed; tenant pilot active business operations on white-label domain.
- CS Lead (separately tracked): start NPS survey preparation for tenant pilot (target T+90 deployment).

### 3.7 T+88 (Marți) — Plan-tier downgrade test (ENTERPRISE → BUSINESS simulation)

| Ora | Acțiune | Owner | Output |
|---|---|---|---|
| 09:00 | Day 11 health review (DevOps + Security Lead + Backend Lead + Audit Lead) | DevOps | Decision sheet GO/HOLD pentru downgrade test |
| 09:30 | Verificare gate criteria T+88: 4 zile post-rotation DMARC 100%; zero TLS_FAILED; zero edge HMAC violation; tenant business operations stable | DevOps + Security Lead | Health report Slack |
| 10:00 | **Plan-tier downgrade test** (simulated, fully reversible): TENT-ADM-01 (sau admin REVYX intern impersonating) trigger plan-tier change ENTERPRISE → BUSINESS via admin panel | Backend Lead + Sales Lead | `WL_PLAN_TIER_CHANGED` event emis cu `{from:'ENTERPRISE', to:'BUSINESS', triggered_by, reason:'STAGE5_DOWNGRADE_TEST_SIMULATION'}` |
| 10:15 | Trigger `tenant_plan_downgrade_audit` cron simulated; verify cron suspends domain access cu `WL_DOMAIN_SUSPENDED` event (per `phase5-rollout-sequence` §8.3 exit metric) | Backend Lead | `WL_DOMAIN_SUSPENDED` event emis |
| 10:30 | Verify subdomain routing: request la `https://pilot.example-revyx-enterprise.md/api/health` → 403 Forbidden + reason='PLAN_TIER_INSUFFICIENT' (`WL_PLAN_TIER_INSUFFICIENT` error code per `white-label` §11) | Backend Lead | Test PASS — domain suspended correct |
| 11:00 | **Rollback test**: revert plan-tier BUSINESS → ENTERPRISE; verify `WL_DOMAIN_SUSPENDED` reverse (un-suspend); domain access restored | Backend Lead + Sales Lead | `WL_PLAN_TIER_CHANGED` (reverse) + access restored |
| 14:00 | Senior QA + DPO verify zero data leak during suspended period (audit log inspection + DPA compliance) | Senior QA + DPO | Verification PASS |
| 17:00 | Standup | DevOps + Backend Lead | Slack thread |

**Threshold T+88:** plan-tier downgrade test PASS; cron suspension functional; rollback restore functional; zero business impact (test was reverted in <1h).

### 3.8 T+89 → T+90 (Miercuri + Joi) — Final monitoring + Tenant NPS survey

- T+89: Final week stability check; DMARC pass rate 100% sustained 9 zile post-rotation; tenant business operations clean.
- T+90: **Tenant NPS survey deployed** (CS Lead → TENT-ADM-01 + 3-5 tenant users): structured survey 8 questions covering branding satisfaction, technical reliability, support responsiveness; target NPS ≥+40 per `phase5-rollout-sequence` §8.3 exit metric.

### 3.9 T+91 (Marți 2026-07-27) — Exit gate review + Phase 5 GA decision

| Ora | Acțiune | Owner | Output |
|---|---|---|---|
| 09:00 | Compile metrici exit gate (`READINESS_REVYX_phase5` §7.2) | Senior QA + DevOps + Security Lead | Metrics CSV + dashboard screenshot |
| 09:30 | NPS survey aggregation (T+90 deployment + 24h response window) | CS Lead | NPS score computed |
| 10:00 | Exit gate review meeting (VP Product + CTO + CISO + DPO + Audit Lead) | Audit Lead | Sign-off ☑ sau hold |
| 10:30 | Dacă PASS → emit `PHASE5_STAGE_EXIT_PASS` (stage=5) event manual cu `{stage:5, stage_name:'white_label_enterprise', exit_metrics:{tls_auto_renew_test, dmarc_pass_rate, plan_tier_downgrade_test, edge_hmac_reject_skew, tenant_enterprise_nps}, ready_for_next_stage:true, signed_off_by:[vp_product,cto,ciso,dpo,audit_lead]}` | Backend Lead | AUDIT_LOG |
| 11:00 | Update `READINESS_REVYX_phase5` §7.2 cu valori măsurate + ☑ sign-off; bump v1.1.0 MINOR (Phase 5 GA close, planificat S18 T-S18-05) | Audit Lead | Doc planning S18 |
| 11:30 | **Master Phase 5 GA decision** (per `phase5-rollout-sequence` §9 + `READINESS_REVYX_phase5` §8.2) — 3-eyes go VP Product + CTO + CISO + cu sign-off DPO + Audit Lead + CFO | VP Product + CTO + CISO + DPO + Audit Lead + CFO | Decision documented in AUDIT_LOG event `PHASE5_GA_DECISION` |
| 14:00 | Retrospective Stage 5 — Slack #wl-stage5 — lessons learned + `RETROSPECTIVE_STAGE5.md` notes (DevOps) | DevOps | Notes |

**Decizie pilot EXTERN (post-Stage 5 + GA decision):** Phase 5 GA = post-T+91 decision dependent. Pilot WL EXTERN (cu 2-3 tenanți Enterprise reali clienți) e pentru cycle post-GA Phase 5 (cca 2026-08+).

---

## 4. Daily health check protocol

DevOps + Security Lead rulează **zilnic la 17:00 UTC+2** următorul protocol și postează în Slack #wl-stage5:

```
T+<N> Health Report — Stage 5 White-Label First Enterprise Tenant

1. Tenant pilot enabled: Y/N (target Y)
2. WL_CONFIG_UPDATED count 24h: __ (cumulative)
3. WL_TLS_PROVISIONED / WL_TLS_RENEWED / WL_TLS_FAILED count: __/__/__
4. WL_DOMAIN_VERIFIED active: Y/N
5. WL_EMAIL_DOMAIN_VERIFIED active selector: __ (current `rvxYYYYMMDD`)
6. DMARC pass rate rolling 24h: __ % (target 100%)
7. SPF align rate rolling 24h: __ % (target 100%)
8. WL_HEADER_SIG_INVALID count (production traffic): __ (target 0; informativ defensive ≥1 OK)
9. WL_DOMAIN_SUSPENDED count (excluding T+88 test): __ (target 0)
10. Mobile DP-05 enforcement test (Detox automated): PASS/FAIL (target PASS)
11. Verdict: 🟢 / 🟡 / 🔴
```

**Threshold escalation:**
- 🟡 → email DevOps + Security Lead + Backend Lead + Audit Lead.
- 🔴 → page DevOps + Security on-call via PagerDuty + emergency standup în 2h + invocă §5 rollback decision tree.

---

## 5. Rollback decision tree (Stage 5)

Expandat din `phase5-rollout-sequence` v1.0.0 §8.4 + `dkim-rotation` v1.0.0 §8 + `white-label` v1.0.0 §11:

```
[DMARC failure post-DKIM rotation (>2% failure rate rolling 1h sau ≥1 critical rua report)?]
   ├─ YES → AUTO ROLLBACK DKIM:
   │     ├─ Switch outbound signing înapoi la selector vechi (per dkim-rotation §8.1)
   │     ├─ Emit `WL_EMAIL_DOMAIN_REVOKED` pe selector nou cu reason='DMARC_FAIL_POST_ROTATION' (per dkim-rotation §8.2)
   │     ├─ Re-test DMARC pass <1h
   │     ├─ RCA Security Lead în 24h (per dkim-rotation §8.3)
   │     └─ Re-rotation permis doar după RCA closed + retrain DMARC parser
   └─ NO → next branch

[TLS provision fail (Let's Encrypt rate-limited sau ACME challenge fail)?]
   ├─ YES → TLS retry cycle:
   │     ├─ `WL_TLS_FAILED` event emit cu reason ('LE_RATE_LIMIT' sau 'ACME_CHALLENGE_FAIL')
   │     ├─ Retry exponential backoff (5min, 15min, 1h, 4h)
   │     ├─ Manual ACME challenge dacă retry≥3 (DevOps escalation)
   │     ├─ Dacă persistă >24h → switch la fallback CA (ZeroSSL) sau extended LE quota request
   │     └─ Stage 5 hold până TLS provisioned; nu blochează exit gate dacă fix sub 24h
   └─ NO → next branch

[Edge HMAC mismatch (replay attack suspectat — multiple WL_HEADER_SIG_INVALID în <5min cu source IP cluster)?]
   ├─ YES → SECURITY_INCIDENT_REPORTED P1:
   │     ├─ `SECURITY_INCIDENT_REPORTED` event manual cu metadata source IPs + count
   │     ├─ Cloudflare edge rate-limit aggressive (block source IPs)
   │     ├─ Rotate signing key (per `white-label` §12.3 anti-hijack); deploy edge worker cu chei noi
   │     ├─ Force re-claim domain (`WL_DOMAIN_REVOKED` → re-CLAIM)
   │     ├─ Forensic audit log review + GDPR Art. 33 assessment (potențial 72h notification)
   │     └─ Re-enable post-RCA + signing key rotation complete
   └─ NO → next branch

[Plan-tier downgrade auto-suspension bug (cron suspends domain incorrect sau fails)?]
   ├─ YES → Plan-tier audit:
   │     ├─ Backend Lead investigate cron `tenant_plan_downgrade_audit` logic
   │     ├─ Hotfix dacă bug în logic; redeploy + re-test pe staging
   │     ├─ Manual `WL_DOMAIN_SUSPENDED` event emit if cron fail
   │     └─ Stage 5 exit metric defer +3 zile dacă persistă; nu blochează GA decision dacă fix sub 5 zile
   └─ NO → next branch

[Tenant nemulțumit branding sau technical (NPS <+40 OR raised P2/P3 ticket nereziliat 48h)?]
   ├─ YES → Stage 5 HOLD:
   │     ├─ CS Lead + Sales Lead structured tenant feedback session
   │     ├─ Iterate brand config sau resolve technical issue (per ticket SLA)
   │     ├─ Re-deploy `WL_CONFIG_UPDATED` cu changes
   │     ├─ Re-survey NPS post-fix (target +40)
   │     └─ Nu blochează Phase 5 GA decision dacă fix sub 7 zile; defer GA cu 1 săpt dacă persistă
   └─ Continue normal flow
```

**Rollback execution audit:** orice rollback (auto sau manual) emite `PHASE5_STAGE_ROLLBACK` event manual cu metadata `{stage:5, rollback_reason, decision_tree_branch, rollback_executed_by, rollback_at, follow_up_inc_id?}` în plus față de `WL_*` specific events (TLS_FAILED / DOMAIN_REVOKED / DOMAIN_SUSPENDED) sau `SECURITY_INCIDENT_REPORTED`.

---

## 6. Audit events expected (Stage 5 cumulative T+77 → T+91)

| Event | Source | Expected count | Threshold |
|---|---|---|---|
| `PHASE5_STAGE_ENTRY` (stage=5) | Manual T+77 | 1 | exact 1 |
| `WL_CONFIG_UPDATED` | T+77 + T+79 + T+80 + brand changes | 3-5 | informativ |
| `WL_DOMAIN_CLAIMED` | T+78 | 1 | exact 1 |
| `WL_DOMAIN_VERIFIED` | T+78 | 1 | exact 1 |
| `WL_TLS_PROVISIONED` | T+78 | 1 | exact 1 |
| `WL_TLS_RENEWED` | Auto cron 30d before expiry | 0-1 (informativ; auto-renew test gate exit) | informativ |
| `WL_TLS_FAILED` | Auto retry | 0 | exact 0 (production) |
| `WL_LOGO_UPLOADED` | T+79 | 1 (+ iterations dacă brand adjustments) | informativ |
| `WL_EMAIL_DOMAIN_VERIFIED` | T+80 init + T+84 rotation | 2 (init `rvx20260801` + rotation `rvx20260814`) | exact 2 |
| `WL_EMAIL_DOMAIN_REVOKED` | T+98 sunset old selector (post-Stage 5 close, but in 14d cycle starting T+84) | 0 (within Stage 5 window) | exact 0 |
| `WL_HEADER_SIG_INVALID` | Smoke tests + replay attack defensive | ≥3 sintetic (T+77 + T+78 + T+80); 0 production | informativ defensive |
| `WL_PLAN_TIER_CHANGED` | T+88 downgrade test (2 events: down + revert) | 2 (test only) | exact 2 |
| `WL_DOMAIN_SUSPENDED` | T+88 downgrade test | 1 (test) | exact 1 |
| `WL_INVALID_COLOR_CONTRAST` | UI validation | 0-1 (informativ pe brand iteration) | informativ |
| `PHASE5_STAGE_EXIT_PASS` (stage=5) | Manual T+91 | 1 | exact 1 dacă PASS |
| `PHASE5_GA_DECISION` | T+91 board decision | 1 | exact 1 (independent dacă GO sau HOLD) |
| `RBAC_PII_REGISTRY_DEPLOYED` (pre-flight T+75) | Migration deploy | 1 | exact 1 (already done T+75) |

---

## 7. Tenant cohort selection criteria

### 7.1 Tenant eligibility (Stage 5 single Enterprise pilot)

- **Plan-tier** = `ENTERPRISE` (verified prin `tenant.plan_tier` cu trigger `tenancy-roles-extension` v1.1.0 §4.7).
- **DPA signed** (Tenant CTO + ITPRO SYSTEM CEO dual signature; PDF în legal-vault path documented §2 row 5.3).
- **Active business operations** ≥ 6 luni (not new tenant; established trust relationship).
- **DNS ownership control** of target custom domain (validated TXT record `_revyx-domain-claim`).
- **Single tenant pilot** Stage 5 only — extended pilot (2-3 tenants) post-Stage 5 + GA decision T+91.

### 7.2 Selected tenant: TENANT-ENT-PILOT-01

- Tenant legal entity: REVYX intern partner Moldova (specific entity name redacted per DPA confidentiality).
- Custom domain: `pilot.example-revyx-enterprise.md`.
- Tenant_admin user: TENT-ADM-01 (single-session BR-12 verified).
- Active business operations: confirmed 8+ luni.
- DPA signed: 2026-07-08 (T+74).

### 7.3 Exclusion criteria

- Niciun tenant `plan.tier IN ('FREE','TRIAL','GROWTH','BUSINESS')`.
- Niciun tenant fără DPA semnat.
- Niciun tenant fără DNS ownership validated.
- Niciun client extern (Stage 5 = intern pilot only; extern post-GA decision).

---

## 8. Platform Matrix enforcement (DP-05) — Stage 5 specific

Per `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §14 Modul 13 + DP-05 (**admin = Web only complet** — 5/5 White-Label features):

| Touchpoint | Web (tenant_admin / admin / compliance) | Mobile | Test E2E daily |
|---|---|---|---|
| `/admin/branding/domain` (custom domain claim) | ✅ tenant_admin full | ⛔ 403 server-side + client-side route guard + redirect to Web URL | T+78 entry + T+84 rotation |
| `/admin/branding/colors-logo` (brand config) | ✅ tenant_admin full | ⛔ blocked | T+79 setup |
| `/admin/branding/email-domain` (DKIM setup) | ✅ tenant_admin full | ⛔ blocked | T+80 setup + T+84 rotation |
| `/admin/branding/plan-tier` (Enterprise upgrade) | ✅ tenant_admin full | ⛔ blocked | T+88 downgrade test |
| `/admin/wl-audit` (WL_* event viewer) | ✅ compliance + admin | ⛔ blocked | T+91 retrospective |
| Public tenant landing (post-domain claim) | ✅ public visitor full | ✅ webview iframe deep-link | T+78 verification |
| DKIM rotation status (read-only) | ✅ admin | ⛔ blocked | T+84 rehearsal |

**Daily E2E verify Senior QA** — script automated cu Detox (Mobile) + Playwright (Web): tentative din Mobile build să acceseze `/admin/branding/*` endpoints → expect 403 + redirect message "Această acțiune se face doar pe Web"; log de fiecare T+ pe Slack. Zero permitted access target.

**Notă DP-05 strict:** White-Label e singurul modul Phase 5 cu **100% admin-only Web** (vs Marketplace partial mixed, ML+Churn mixed). Niciun touchpoint Mobile pentru orice operațiune Stage 5.

---

## 9. Cross-references

- `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §8 — master gate Stage 5
- `RUNBOOK_REVYX_stage4-churn-launch` v1.0.0 — Stage 4 antecedent (T+56..T+77 closed PASS)
- `RUNBOOK_REVYX_dkim-rotation` v1.0.0 — DKIM full cycle (§3 calendar + §4 generation + §5 publishing + §6 activation + §7 DMARC verify + §8 rollback + §9 sunset)
- `READINESS_REVYX_phase5` v1.0.5 §7 — sign-off matrix Stage 5 (updated S17)
- `TECH_SPEC_REVYX_white-label` v1.0.0 — backend spec (data model + algorithms + state machines + security)
- `TECH_SPEC_REVYX_audit-log` v1.1.1 §4.4.3 — `WL_*` 12 events catalog + §4.4.9 — `PHASE5_*` events
- `TECH_SPEC_REVYX_tenancy-roles-extension` v1.1.0 §4.7 — `tenant_admin` role + plan-tier validation trigger
- `DPIA_REVYX_phase5` v1.0.0 §5.5 — white-label data flows (sub-processor minimal; CNAME + TLS only)
- `SCC_VENDORS_phase5` v1.0.1 §3.6 — BSI Group MD DPA signed T+77 (BSI-M4 complete)
- `RUNBOOK_REVYX_incident-response` v1.0.0 §6 — INC P1 protocol security incident
- `AUDIT_REVYX_s16-external-pass` v1.0.0 §8 — Stage 5 entry unblocked 17/17 gates GREEN
- `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §14 (Modul 13 White-Label Web only complet) + §16 (Modul 15 Audit viewer)
- `MASTER_PLAN_REVYX_execution-roadmap_v1.1.1.md` §7 — Phase 5 staged rollout
- `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §2.2 T-S17-03 — atomic task

---

## 10. Approval

| Aprobator | Sign-off |
|---|---|
| DevOps Lead | ✅ |
| Security Lead | ✅ |
| Backend Lead | ✅ |
| DPO | ✅ |
| Audit Lead | ✅ |
| VP Product | ✅ |
| CTO | ✅ |
| CISO | ✅ |
| Sales Lead | ✅ |
| Legal Lead | ✅ |

---

*docs/runbook/RUNBOOK_REVYX_stage5-white-label-launch_v1.0.0.md · v1.0.0 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
