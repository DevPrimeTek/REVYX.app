# RUNBOOK — REVYX Phase 5 Stage 2 Marketplace pilot launch (T+14 → T+35)
<!-- RUNBOOK_REVYX_stage2-marketplace-launch_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Marketplace Lead (Backend Lead) + Senior QA + CS Lead + DPO + Security Lead + Solution Architect + Audit Lead | ★ Initial — operational runbook day-by-day Stage 2 (Marketplace pilot tenant) per `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §5 + `TECH_SPEC_REVYX_marketplace-two-sided` v1.0.0 §16 · tenant pilot 1 (MARKETPLACE tenant_type, GROWTH tier+) · acoperă Stripe products live · GDPR consent flow + rate-limiting · contact-grant ops · day-by-day cu owners + audit events așteptate + rollback decision tree expandat · creat post-S13 audit pass `AUDIT_REVYX_s13-external-pass` v1.0.0 §6 (Stage 2 entry unblocked) |

---

## 1. Scop

Acest runbook este **operational day-by-day** pentru Stage 2 Phase 5 (Marketplace pilot tenant). Master gate `phase5-rollout-sequence` v1.0.0 §5 definește entry/exit gates; acest doc descrie **execuția** zilnică cu owners, comenzi, audit events așteptate. Cohort este **1 tenant pilot + buyer-i din rețea + agenți tenant**.

| Atribut | Valoare |
|---|---|
| Stage | 2 — Marketplace pilot (1 tenant) |
| Durată | T+14 → T+35 zile (cu opțiune extension +7 zile dacă health gate indică defer) |
| Cohort target | 1 tenant pilot MARKETPLACE (GROWTH tier+) · 5-10 buyer-i onboarded manual · agenți tenant (estimat 5-10) |
| Distribuție | Feature flag `marketplace.enabled=true` per tenant pilot |
| Owner | Marketplace Lead = Backend Lead (execuție) · CS Lead (onboarding buyer-i + tenant pilot) · Senior QA (health) · DPO (consent + PII) · Security Lead (rate-limiting + abuse) · Audit Lead (gating) |
| Timezone | UTC+2 (Chișinău) — toate timestamp-urile interne |
| Cross-spec | `marketplace-two-sided` v1.0.0 (§16 rollout, §6.5 contact-unlock, §12 security) · `audit-log` v1.1.1 §4.4.2 (`BUYER_*`) + §4.4.9 (`PHASE5_*`) · `DPIA_REVYX_phase5` v1.0.0 §5.2 marketplace · `SCC_VENDORS_phase5` v1.0.0 §3.5 (Stripe) · `match-engine` v2.0.0 (inverse path) |

---

## 2. Pre-flight T+13 (verificare entry gates pre-T+14 GO)

| # | Gate (din `phase5-rollout-sequence` §5.1 + `READINESS_REVYX_phase5` §4.1) | Owner | Verificare |
|---|---|---|---|
| 2.1 | Stage 1 exit gates ✅ (9/9 PASS per `AUDIT_REVYX_s13-external-pass` §2.1) | Audit Lead | Link `READINESS_REVYX_phase5` v1.0.2 §3.2 + AUDIT_REVYX_s13 §2.1 |
| 2.2 | Migrarea `marketplace_*` (0500-0544 family) aplicată în prod | Senior DBA | `psql -d revyx_prod -c "SELECT MAX(migration_id) FROM schema_migrations"` → ≥544 |
| 2.3 | `BUYER_*` events 12/12 funcționale (audit-log §4.4.2) | Backend Lead | Smoke test staging tenant: 12 events emit cu payload assertNoPII PASS |
| 2.4 | Tenant pilot selectat + acord scris pentru pilot (NDA + DPA + pilot agreement) | CS Lead + Legal | Contract semnat în `legal-vault/contracts/pilot/marketplace/{tenant_id}/2026-05/agreement.pdf` |
| 2.5 | Buyer self-service UX revizuit + tradus RO + RU | Senior Designer | Design hand-off PR merged + screenshot per locale (RO/RU) în `docs/design/marketplace-buyer-flow/` |
| 2.6 | GDPR consent flow live: `BUYER_PROFILE_CREATED` cu `gdpr_consent_at` + `gdpr_consent_version` non-NULL | DPO | Smoke test 1 buyer profile creation staging — verify columns populated |
| 2.7 | Contact-grant flow live cu rate-limiting agent → buyer (max 3 requests/buyer/zi) | Security Lead | Rate-limit test: 4th request în 24h same agent+buyer → 429 + audit `BUYER_CONTACT_GRANT_RATE_LIMITED` |
| 2.8 | Stripe products + plan-tier gating verificat (live mode) | Billing Lead | Stripe Dashboard live: `revyx_buyer_profile_listing` products FREE/PRO/PREMIUM cu pricing real + tier→ttl mapping (FREE=30 zile, PRO=90, PREMIUM=180) verified |
| 2.9 | DPO sign-off pe DPIA §5.2 + Privacy Policy update (buyer-side RO+RU+EN) | DPO + Legal | DPIA §10 triple sign-off + privacy-policy.md updated cu §marketplace-section |
| 2.10 | Sentry marketplace project + Slack #marketplace-pilot canal creat | Senior QA + CS Lead | Project URL + Slack channel pinned cu on-call rotation Backend Lead + CS Lead |

**Decizie pre-flight:** dacă **toate** ☑ → emit `PHASE5_STAGE_ENTRY` event (manual, owner: Backend Lead via admin tool) cu `{stage:2, stage_name:'marketplace_pilot', entry_gates_status:'PASS', approver_ids:[vp_product,cto,dpo], dpia_version:'1.0.0', readiness_doc_uri, tenant_pilot_id}`; altfel defer +1 săpt.

**Decizie 3-eyes:** VP Product + CTO + DPO sync T+13 16:00 UTC+2 confirmation GO.

---

## 3. Sequence day-by-day

### 3.1 T+14 (Luni) — Feature flag activation + tenant onboarding workshop scheduling

| Ora (UTC+2) | Acțiune | Owner | Output / Audit event |
|---|---|---|---|
| 09:00 | Pre-flight 3-eyes sync confirm GO (VP Product + CTO + DPO) | Audit Lead | `READINESS_REVYX_phase5` v1.0.2 §4.1 sign-off |
| 09:30 | Activare feature flag `marketplace.enabled=true` la tenant pilot (LaunchDarkly cohort = `tenant_id:{pilot}`) | Backend Lead | Feature flag history log + smoke test get config |
| 10:00 | Emit `PHASE5_STAGE_ENTRY` event manual cu metadata complete | Backend Lead | AUDIT_LOG event verified |
| 10:30 | Smoke test E2E: 1 buyer profile creation (staging-like cu tenant pilot fixture) → publish → search visible | Senior QA + Backend Lead | E2E test report + `BUYER_PROFILE_CREATED` + `BUYER_PROFILE_PUBLISHED` events |
| 14:00 | Onboarding workshop scheduling cu tenant pilot — kickoff meeting confirmed T+15 09:00 (PM + CS + tenant admin) | CS Lead | Calendar invite + agenda RO+RU |
| 17:00 | Daily standup #marketplace-pilot — green/red status | Backend Lead | Slack thread |

**Health threshold T+14:** zero erori 5xx pe API `/api/v1/buyer-profiles/*` în staging; feature flag activation 0 incidenți.

### 3.2 T+15 (Marți) — Tenant onboarding workshop + manual buyer profile assist

| Ora | Acțiune | Owner | Output |
|---|---|---|---|
| 09:00 | Workshop tenant pilot (PM + CS + tenant admin) — demo UX + RBAC marketplace + agent flows | CS Lead | Workshop notes + recording (consent-based) |
| 11:00 | Tenant admin + 2-3 agenți cheie creează **buyer profile fixture** (lead existing → buyer profile assist) | Tenant admin + CS Lead | First 3-5 `BUYER_PROFILE_CREATED` events real cu `gdpr_consent_at` + `_version` non-NULL |
| 14:00 | Senior QA verifică `assertNoPII(audit_log_compliance_view.row WHERE event_name LIKE 'BUYER_%')` PASS | Senior QA | Verification script run + report |
| 17:00 | Standup | Backend Lead | Slack thread |

**Health threshold T+15:** 3-5 buyer profiles create cu consent OK + zero PII leak în audit-log.

### 3.3 T+16 → T+17 (Miercuri-Joi) — Buyer onboarding ramp + agent contact-request flow enable

| Ora | Acțiune | Owner | Output |
|---|---|---|---|
| T+16 10:00 | CS Lead invită 5 buyer-i externi (din rețea tenant pilot existing leads) prin email-template RO+RU pentru self-service profile publish | CS Lead | Email send + tracking |
| T+16 10:00-18:00 | Buyer-i create profil (FREE tier initially) → Stripe checkout (FREE=no charge) → `BUYER_PROFILE_PUBLISHED` | Buyers | Target ≥3 profiles publicate by EOD T+17 |
| T+17 09:00 | Activare contact-request flow agenți tenant (admin tool emit `MARKETPLACE_CONTACT_FLOW_ENABLED`) | Backend Lead | Audit event + Slack #marketplace-pilot announce |
| T+17 11:00 | Smoke test: 1 agent → `POST /api/v1/marketplace/buyer-profiles/:id/contact-request` cu rate-limit verify (5/zi/agent) | Senior QA | E2E test PASS + `BUYER_CONTACT_REQUEST_OPENED` event |
| T+17 14:00 | First buyer approve contact-grant → `BUYER_CONTACT_GRANT_APPROVED` + `BUYER_PII_REVEALED` cu Slack #privacy-watch alert verify | DPO + Backend Lead | Alert fired în <30s + event payload PII-safe (registry `pii_field_registry` redaction respectat) |
| T+17 17:00 | Standup | Backend Lead | Slack thread |

**Health threshold T+17:** ≥3 buyer profiles publicate; ≥1 contact-grant approved; zero `BUYER_PII_REVEALED` fără grant precedent.

**Trigger rollback intermediate:**
- `BUYER_PII_REVEALED` fără `BUYER_CONTACT_GRANT_APPROVED` precedent (= PII leak) → ROLLBACK CRITICAL §5.
- Rate-limit breach >10/h (agenți spam) → Security Lead rate-limit aggressive (2/zi/buyer temp).

### 3.4 T+18 → T+27 (Vineri săpt 3 → Duminică săpt 4) — Pilot live use + telemetria

- Tenant pilot agenți folosesc marketplace în lucru zilnic (search buyer-i, contact-request, NBA `OUTREACH_BUYER_MATCH`).
- Telemetria zilnică (Sentry + AUDIT_LOG):
  - `BUYER_PROFILE_CREATED` cumulative target ≥10 by T+28.
  - `BUYER_CONTACT_GRANT_APPROVED` cumulative target ≥3 by T+28.
  - `BUYER_PII_REVEALED` toate cu grant precedent verified Slack alert 100%.
  - `BUYER_CONTACT_GRANT_RATE_LIMITED` count alert >5/agent/zi.
  - `gdpr_consent_version` non-NULL pe TOATE rows `buyer_profile` (DBA daily check report).
  - Auto-EXPIRE pe `last_active_at` ≥30 zile → status=EXPIRED (cron 04:00 UTC zilnic) — verificat cu fixture sintetic backdated.
- Senior QA emite raport zilnic pe Slack #marketplace-pilot la 17:00.
- CS Lead colectează feedback ad-hoc + survey T+25 NPS.

**Audit events așteptate cumulative (T+18..T+27):**

| Event | Expected | Threshold |
|---|---|---|
| `BUYER_PROFILE_CREATED` | ~12 (target ≥10) | ≥10 |
| `BUYER_PROFILE_PUBLISHED` | ~10 | ≥8 |
| `BUYER_CONTACT_REQUEST_OPENED` | ~20 | ≥10 |
| `BUYER_CONTACT_GRANT_APPROVED` | ~5 | ≥3 |
| `BUYER_CONTACT_GRANT_REJECTED` | ~10 | (informativ — buyer poate refuza) |
| `BUYER_PII_REVEALED` | =count GRANT_APPROVED | 100% match grant |
| `BUYER_CONTACT_GRANT_RATE_LIMITED` | <5 | alert >5/agent/zi |
| `BUYER_PROFILE_EXPIRED` (auto-cron) | 0 (cohort recent <30d) | exact 0 |
| `MARKETPLACE_NBA_OUTREACH_GENERATED` (NBA action `OUTREACH_BUYER_MATCH`) | ~10 | ≥3 |

**Trigger rollback intermediate (T+18..T+27):**
- PII leak `BUYER_PII_REVEALED` fără grant → ROLLBACK CRITICAL §5.
- Buyer profile spam (>5 PROF_REVOKED automat / 24h) → freeze profile creation tenant + investigate fraud detection.
- Stripe webhook desync (`bp_stripe_sync_lag_s` p95 >300s) → reconciliation cron emergency + Stripe API GET fallback (per marketplace-two-sided §11).
- Tenant pilot panic (NPS <0 sau escalation CS Lead) → PAUSE expansion + 1:1 cu tenant admin.

### 3.5 T+28 (Luni) — Day 14 health check + tenant pilot survey

| Ora | Acțiune | Owner | Output |
|---|---|---|---|
| 09:00 | Day 14 health review meeting (Backend Lead + Senior QA + DPO + Audit Lead) | Backend Lead | Decision sheet GO/HOLD pentru week 4 |
| 09:30 | Verificare gate criteria T+28: ≥10 buyer profiles · ≥3 grants · 100% PII alert match · zero rate-limit anomaly · zero `BUYER_PROFILE` cu `data_retention_expires_at` în trecut activ | Senior QA | Health report |
| 10:00 | NPS survey send tenant pilot agenți + 5-10 buyer-i (Form RO+RU) | CS Lead | Survey responses target ≥80% by T+33 |
| 14:00 | Senior DBA verifică `BUYER_PROFILE.data_retention_expires_at` cron + count 0 active expired | Senior DBA | Cron run log |
| 17:00 | Standup | Backend Lead | Slack thread |

**Decizie health T+28:** dacă criteria PASS → continue T+29..T+34; dacă <target → defer exit gate review + remediere 7 zile.

### 3.6 T+29 → T+34 (Marți-Duminică săpt 5) — Stabilization + cumulative metrics

- Telemetria continuă (vezi §3.4).
- NPS responses colectate cumulative.
- DPO verifică DPIA balancing test §5.2 marketplace în practică — toate `BUYER_PII_REVEALED` cu grant + retention `last_active_at` activ.
- Senior QA pregătește exit gate metrics CSV pentru T+35 review.

### 3.7 T+35 (Luni) — Exit gate review + Stage 3 readiness

| Ora | Acțiune | Owner | Output |
|---|---|---|---|
| 09:00 | Compile metrici exit gate (`READINESS_REVYX_phase5` §4.2) | Senior QA | Metrics CSV + dashboard screenshot |
| 10:00 | Exit gate review meeting (VP Product + CTO + DPO + Audit Lead) | Audit Lead | Sign-off ☑ sau hold |
| 10:30 | Dacă PASS → emit `PHASE5_STAGE_EXIT_PASS` event manual cu `{stage:2, stage_name:'marketplace_pilot', exit_metrics:{buyer_profiles_published, grants_approved, pii_alerts_match_rate, gdpr_consent_compliance, retention_compliance, nps}, ready_for_next_stage:true, signed_off_by:[vp_product,cto,dpo,audit_lead]}` | Backend Lead | AUDIT_LOG |
| 11:00 | Update `READINESS_REVYX_phase5` §4.2 cu valori măsurate + ☑ sign-off | Audit Lead | Doc PATCH bump v1.0.3 |
| 11:30 | Pre-flight sync Stage 3 (ML Pricing CANARY 5%) — entry gates §5.1 din phase5-rollout-sequence + ★ verify F-S11-08 (4-eyes E2E smoke staging PASS) | Audit Lead + DS Lead + Senior QA | Slack #phase5-rollout |
| 14:00 | Retrospective Stage 2 — Slack #marketplace-pilot — lessons learned + `RETROSPECTIVE_STAGE2.md` notes | Backend Lead | Notes |

---

## 4. Daily health check protocol

Senior QA rulează **zilnic la 17:00 UTC+2** următorul protocol și postează în Slack #marketplace-pilot:

```
T+<N> Health Report — Stage 2 Marketplace pilot

1. BUYER_PROFILE_CREATED cumulative: __ (target ≥10 by T+28)
2. BUYER_PROFILE_PUBLISHED cumulative: __ (target ≥8 by T+28)
3. BUYER_CONTACT_GRANT_APPROVED cumulative: __ (target ≥3 by T+28)
4. BUYER_PII_REVEALED count = BUYER_CONTACT_GRANT_APPROVED count? Y/N (target Y 100%)
5. BUYER_CONTACT_GRANT_RATE_LIMITED count 24h: __ (alert >5/agent/zi)
6. gdpr_consent_version NULL rows în buyer_profile: __ (target 0)
7. data_retention_expires_at în trecut + status=ACTIVE: __ (target 0)
8. Stripe webhook lag p95: __s (target <300s)
9. assertNoPII snapshot CI BUYER_*: PASS/FAIL
10. Tenant pilot NPS in-progress: __ (final at T+33)
11. Open bug critic: __ (target 0)
12. Verdict: 🟢 / 🟡 / 🔴
```

**Threshold escalation:**
- 🟡 → email Backend Lead + Senior QA + DPO + Audit Lead.
- 🔴 → page Backend Lead via PagerDuty + emergency standup în 2h + invocă §5 rollback decision tree.

---

## 5. Rollback decision tree (expandat din `phase5-rollout-sequence` §5.4)

```
[BUYER_PII_REVEALED fără BUYER_CONTACT_GRANT_APPROVED precedent în 60s window?]
   ├─ YES → ROLLBACK CRITICAL:
   │     ├─ Feature flag `marketplace.enabled=false` la tenant pilot imediat
   │     ├─ INC_DECLARED severity:P1 (PII leak — GDPR Art. 33 breach risk)
   │     ├─ INC_GDPR_NOTIFIED_DPO event manual emis în <1h (per DPIA §5.2)
   │     ├─ DPO assess Art. 33 (72h notification ANSPDCP) + Art. 34 (data subject) — decision tree per incident-response §6
   │     └─ Forensic: query audit-log pentru toate `BUYER_PII_REVEALED` ultima săpt + verifică pattern
   └─ NO → next branch

[Contact-grant abuse rate (>10 denied grants/buyer/zi sustained 48h)?]
   ├─ Rate-limit ajustat la 2/zi/buyer (temp) + Security Lead investigate agenți spammer
   ├─ Cool-down per agent: 24h post-third denial
   └─ Audit `BUYER_CONTACT_GRANT_RATE_LIMITED` count alert →Slack #marketplace-pilot

[Buyer profile spam (>50 PROF_REVOKED / 24h sau >5 fraud-flagged)?]
   ├─ Freeze buyer profile creation la tenant pilot
   ├─ Backend Lead + Security Lead investigate fraud detection rule
   ├─ Revisit phone OTP requirement (`marketplace-two-sided` §12.4 anti-abuse)
   └─ Restaurare după patch + verify

[Stripe webhook lag p95 >300s sustained 1h sau `BP_STRIPE_DESYNC` >0?]
   ├─ INVESTIGATE: Stripe Dashboard webhook delivery status + retry queue
   ├─ Activate reconciliation cron emergency (Stripe API GET fallback per marketplace-two-sided §11)
   ├─ Mitigation: pause new PRO/PREMIUM upgrades 30 min
   └─ Resume after lag <60s sustained 15 min

[Tenant pilot NPS <0 sau panic escalation?]
   ├─ PAUSE expansion (no new buyer onboarding)
   ├─ CS Lead 1:1 cu tenant admin
   └─ Re-evaluate UX + workshop refresh

[GDPR consent regression: gdpr_consent_version NULL rows >0?]
   ├─ Backend Lead investigate code path → most likely deploy regression
   ├─ Hotfix branch + redeploy
   ├─ DPO notification (DPIA §5.2 enforcement)
   └─ INC_DECLARED severity:P2 (GDPR risk)
```

**Rollback execution audit:** orice rollback emite `PHASE5_STAGE_ROLLBACK` event manual cu metadata `{stage:2, rollback_reason, decision_tree_branch, rollback_executed_by, rollback_at, follow_up_inc_id?}`.

---

## 6. Audit events expected (Stage 2 cumulative T+14 → T+35)

| Event | Source | Expected count | Threshold |
|---|---|---|---|
| `PHASE5_STAGE_ENTRY` (stage=2) | Manual T+14 | 1 | exact 1 |
| `BUYER_PROFILE_CREATED` | Per buyer signup | ~15 | ≥10 |
| `BUYER_PROFILE_PUBLISHED` | Per publish | ~12 | ≥10 |
| `BUYER_PROFILE_UPDATED` | Edit | ~20 | informativ |
| `BUYER_PROFILE_REVOKED` | Manual revoke buyer | <3 | informativ |
| `BUYER_PROFILE_EXPIRED` | Cron auto-EXPIRE | 0 | exact 0 (cohort recent) |
| `BUYER_CONTACT_REQUEST_OPENED` | Agent request | ~20 | ≥10 |
| `BUYER_CONTACT_GRANT_APPROVED` | Buyer approve | ~5 | ≥3 |
| `BUYER_CONTACT_GRANT_REJECTED` | Buyer reject | ~10 | informativ |
| `BUYER_CONTACT_GRANT_RATE_LIMITED` | Rate-limit hit | <10 | alert >5/agent/zi |
| `BUYER_PII_REVEALED` | Post-grant unmask | =count GRANT_APPROVED | 100% match (alert non-match) |
| `MARKETPLACE_NBA_OUTREACH_GENERATED` | NBA agent | ~10 | ≥3 |
| `PHASE5_STAGE_EXIT_PASS` (stage=2) | Manual T+35 | 1 | exact 1 dacă PASS |

---

## 7. Tenant pilot selection criteria

### 7.1 Tenant eligibility

- Plan tier ≥ GROWTH (multi-agent capability + DPA semnat).
- Vechime tenant ≥6 luni pe REVYX (operational stable).
- Zero incident P1/P2 ultimele 90 zile.
- Acord NDA semnat + acord pilot scris (1-pager: feedback rapid + GDPR consent + retention 30d post-Stage 2).
- Tenant admin disponibil pentru workshop T+15 (calendar block 2h).

### 7.2 Buyer onboarding selection criteria

- Buyer-i existenți ca LEAD în CRM-ul tenant pilot (high engagement, IS ≥0.5).
- Consent GDPR explicit pentru marketplace participation (separate consent flow per privacy-policy.md §marketplace).
- Mix RO+RU primarily; minim 2 buyer-i RU pentru test localizare.
- Manual onboarding cu CS Lead pentru primii 5-10 (assisted self-service); de la T+18 self-service deschis.

### 7.3 Exclusion criteria

- Tenants în trial period (<30 zile).
- Tenants cu Stripe payment overdue >7 zile.
- Buyer-i fără număr telefon verificat (per marketplace-two-sided §12.4 phone OTP).
- Lead-uri cu LS <0.30 (initial — nu calified pentru marketplace exposure).

---

## 8. Cross-references

- `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §5 — master gate Stage 2
- `RUNBOOK_REVYX_stage1-mobile-launch` v1.0.0 — Stage 1 antecedent (T+0..T+14)
- `READINESS_REVYX_phase5` v1.0.2 §4 — sign-off matrix Stage 2 (updated S13)
- `TECH_SPEC_REVYX_marketplace-two-sided` v1.0.0 §16 — rollout plan + §6.5 contact-unlock + §12 security & privacy
- `TECH_SPEC_REVYX_audit-log` v1.1.1 §4.4.2 — `BUYER_*` events catalog + §4.4.9 — `PHASE5_*` events
- `SCC_VENDORS_phase5` v1.0.0 §3.5 — Stripe SCC ON FILE (gating Stage 2 vendor)
- `DPIA_REVYX_phase5` v1.0.0 §5.2 — marketplace DPIA balancing test
- `TECH_SPEC_REVYX_match-engine` v2.0.0 — inverse path (property → buyer matching) pentru NBA
- `RUNBOOK_REVYX_incident-response` v1.0.0 — INC declaration protocol + GDPR breach Art. 33/34
- `AUDIT_REVYX_s13-external-pass` v1.0.0 §6 — Stage 2 entry gates unblocked
- `docs/legal/privacy-policy.md` — buyer-side consent section update pre-T+14

---

## 9. Approval

| Aprobator | Sign-off |
|---|---|
| Marketplace Lead (Backend Lead) | ✅ |
| Senior QA / Test Architect | ✅ |
| CS Lead | ✅ |
| DPO | ✅ |
| Security Lead | ✅ |
| Solution Architect | ✅ |
| Audit Lead | ✅ |
| CTO | ✅ |
| VP Product | ✅ |

---

*docs/runbook/RUNBOOK_REVYX_stage2-marketplace-launch_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
