# DPIA — REVYX Phase 5 (Data Protection Impact Assessment)
<!-- DPIA_REVYX_phase5_v1.0.1.md · v1.0.1 · 2026-07 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** Pre-development / S18 deliverable; DPIA single-source PATCH post-Stage 5 close (Phase 5 GA decision T+91 input).
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §0.3 (S18 deliverables) + §7 Phase 5 staged rollout.
**Roadmap ref:** `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §2.3 T-S18-03.
**Trio canonical citat:** Master Plan v1.1.1 + Platform Matrix v1.0.0 + Detailed Roadmap v1.0.0 (Regula 8 + Regula 9).

## 0.1 Platform Matrix

Acest DPIA acoperă 5 features Phase 5 cu impact UI variabil. Cross-ref `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md`:
- §15 Modul 14 (ML+Churn — `churn-ga` + `ml-pricing-ga`): CS analytics dashboard 🌐 Web only DP-05; CS task list cs_user 📱 Mobile limited; churn score widget per agent 🔁 Both
- §13 Modul 12 (Marketplace BUYER_PROFILE): buyer self-publish + agent search 🌐 Web only (per `marketplace-two-sided` v1.0.1 platform PATCH)
- §3 Modul 2 (Mobile push notifications): 🔁 Both (push delivery iOS+Android)
- §14 Modul 13 (White-Label): 100% 🌐 Web only complet DP-05 (5/5 features admin-only Web)
- §16 Modul 15 (Audit & Compliance — `audit_log_compliance_view` BSI access): 🌐 Web only DP-05

Niciun touchpoint Mobile pentru DPO/compliance auditor access (BSI Group MD audit firm) — toate read-only audit views sunt Web admin only.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | DPO + Security Lead + CISO + Senior PM + Solution Architect | ★ Initial — closes F-S10-01 HIGH + F-S10-10 LOW (AUDIT_REVYX_s10-external-pass v1.0.0) · single-source DPIA pentru toate Phase 5 features (churn-ga · marketplace BUYER_PROFILE · ML pricing · mobile push · white-label) · risk register + balancing test (Art. 22 + legitimate interest) · sign-off triple DPO + Security Lead + CISO |
| **1.0.1** | **2026-07** | DPO + Security Lead + CISO + Senior Compliance Auditor + Audit Lead | ★ PATCH — closes **F-S14-04 LOW** doc-side (AUDIT_REVYX_s14-external-pass + tracking S15/S16/S17). §5.2 verbiage clarification BUYER_PROFILE contact-grant flow (audit event cross-ref + 72h pending retention). §5.3 ml-pricing-ga cross-ref update minor (`min_sample_district_n=50` post `ml-pricing-ga` v1.0.4 PATCH F-S15-01 closed S17). §5.5 white-label data flows expansion minor (BSI Group MD DPA signed T+77 BSI-M4 cross-ref + sub-processor minimal confirmed Stage 5 production). §6.1 compliance_auditor pre-condiție status update (pii_field_registry deployed T+75 cu 84 rows; compliance_auditor user provisionat T+76 BSI access path). §6.2 international transfers BSI row updated 🟢. Zero schimbare semantică DPIA risk register (PATCH per regulă semver: clarificări + cross-ref refresh fără breaking change). Cross-ref `AUDIT_REVYX_s17-external-pass` v1.0.0 + `READINESS_REVYX_phase5` v1.1.0 GA close. |

---

## 1. Identitate documentului

| Atribut | Valoare |
|---|---|
| Tip document | Data Protection Impact Assessment (GDPR Art. 35) |
| Scope | REVYX Phase 5 deliverables — toate features S8/S9 cu impact PII |
| Controller | ITPRO SYSTEM SRL (REVYX) |
| Joint-controller | None (REVYX e single controller pentru date proprii; tenants sunt joint-controllers pentru date end-user prin DPA) |
| Processor | Vendori cloud (AWS / Cloudflare / Stripe / Apple / Google FCM) + ★ **BSI Group MD audit firm** (DPA signed T+77 BSI-M4 complete per `SCC_VENDORS_phase5` v1.0.2 §3.6) — DPA-uri în vigoare |
| Aplicabil pe | Republica Moldova (Legea 133/2011) + GDPR (operațiuni cross-border via tenants UE) |
| Trigger DPIA | GDPR Art. 35(1) — "operațiune cu risc ridicat pentru drepturile și libertățile persoanelor" — confirmată pentru: profilare churn (Art. 22), prelucrare la scară mare (marketplace), tehnologie nouă (ML pricing) |
| Sign-off triple | DPO · Security Lead · CISO |
| Următoarea revizie | 90 zile post-Phase 5 GA (cca 2026-10-25; cycle T+91+90d) sau la orice modificare materială |

---

## 2. Sumar executiv (1-pager)

REVYX Phase 5 introduce 5 features cu impact PII (priorități descrescătoare):

1. **`churn-ga`** — scoring churn la nivel tenant/agent. Risc principal: profilare automată (Art. 22). **Mitigare:** human-in-the-loop strict (BR-16), legitimate interest balancing test §6, scor invizibil agentului subiect (BR-18). ★ **Verified Stage 4 (S17 audit) 7/7 exit gates PASS** cu BR-18 RLS 6/6 + Art. 22 human override 1 invocation T+68 cs_lead manual close documented.
2. **`marketplace-two-sided`** — BUYER_PROFILE public limitat + contact-grant flow. Risc principal: PII reveal nepermis. **Mitigare:** consent explicit Art. 7, contact-grant approval flow, `BUYER_PII_REVEALED` audit cu severity HIGH. ★ **Verified Stage 2 (S15 audit) 9/9 exit gates PASS** cu PII match 100%, NPS +28 baseline + post-CMS L10n RU fix +35 (S17 close).
3. **`ml-pricing-ga`** — ML pricing (zero PII features). Risc principal: algorithmic transparency. **Mitigare:** model card public, A/B + canary discipline cu 4-eyes admin. ★ **Verified Stage 3 (S16 audit) 6/6 exit gates PASS**; ★ v1.0.1 update: `min_sample_district_n=50` post v1.0.4 PATCH (F-S15-01 closed S17) — tighter bias gate documented §5.3.
4. **`mobile-rn`** — mobile app cu push notifications. Risc principal: PII în push payload. **Mitigare:** zero PII validat prin `@revyx/test-fixtures-pii` (CI gate). ★ **Verified Stage 1 (S14 audit) 9/9 exit gates PASS**.
5. **`white-label`** — domain custom per tenant cu DKIM. Risc principal: cross-tenant data leak via shared infra. **Mitigare:** edge HMAC signing F-01 fix, plan-tier gating, tenant_admin RBAC strict. ★ **Verified Stage 5 (S17 audit) 5/5 exit gates PASS** cu DKIM rotation rehearsal PASS T+84 + plan-tier downgrade test PASS T+88 + tenant NPS +47 + DMARC 100% sustained 9d.

| # | Feature | Categoria date PII | Risc rezidual | Mitigare verificată | Sign-off |
|---|---|---|---|---|---|
| 1 | `churn-ga` | Telemetry tenant/agent (no end-user PII direct) + cs_notes free-text → redactare 365d | LOW | Art. 22 evitat prin HITL (BR-16) | ✅ DPO |
| 2 | `marketplace-two-sided` | Buyer email + phone + intent + budget + locație preferințe | MED | Contact-grant + audit HIGH severity | ✅ DPO |
| 3 | `ml-pricing-ga` | Zero PII (features anonimizate) | LOW | `assertNoPII` CI gate + ★ tighter bias gate v1.0.4 (n=50) | ✅ DPO |
| 4 | `mobile-rn` | Push payload zero PII; cache local SQLite criptat | LOW | `assertNoPII` snapshot tests | ✅ DPO |
| 5 | `white-label` | Tenant brand config + DKIM keys (no end-user PII) | LOW | Edge HMAC + plan-tier gating + ★ BSI DPA signed T+77 | ✅ Security Lead |

**Concluzie globală:** Phase 5 prezintă risc rezidual **MEDIUM** dominat de marketplace BUYER_PROFILE; toate riscurile au mitigations validate; **DPIA APPROVED** pentru rollout conform `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0. ★ **Stage 1-5 toate CLOSED PASS** (S14/S15/S16/S17/S18 audit checkpoints); Master Phase 5 GA decision = **GO** T+91 unanimous (per AUDIT_s17 §8).

---

## 3. Cadru legal aplicabil

### 3.1 GDPR (Regulamentul (UE) 2016/679)

| Articol | Aplicabil aici? | Mod aplicare |
|---|---|---|
| Art. 5 — Principles | DA (toate) | Lawfulness §4, purpose limitation §5, data minimization §5, accuracy, storage limitation, integrity, accountability |
| Art. 6 — Lawful basis | DA | (a) consimțământ pentru BUYER_PROFILE; (b) contract pentru pricing; (f) legitimate interest pentru churn |
| Art. 7 — Conditions for consent | DA (BUYER_PROFILE) | `gdpr_consent_at` + `gdpr_consent_version` (BR-06 + §8.3 BRD) |
| Art. 13/14 — Information to data subject | DA | Privacy policy actualizată cu Phase 5 (gating Stage 5) |
| Art. 15-22 — Rights | DA | Acces · rectificare · ștergere · portabilitate · obiecție · automated decision-making (Art. 22) |
| Art. 22 — Automated individual decision-making | DA (churn-ga) | Risc evitat prin HITL (BR-16) — nicio decizie automatizată cu efecte legale/semnificative |
| Art. 25 — Data protection by design | DA | Audit-log redaction, RBAC strict, time-boxed compliance auditor |
| Art. 32 — Security of processing | DA | Encryption at rest + in transit, RBAC, MFA, AUDIT_LOG immutable |
| Art. 33-34 — Breach notification | DA | Runbook `incident-response` §11.4 + events `INC_GDPR_*` |
| Art. 35 — DPIA | DA | Acest document |
| Art. 44+ — International transfers | DA (parțial) | SCC pentru transfer la US-based vendors (FCM Apple/Google); RM e adequacy pendinte. ★ BSI Group MD = operator local RM, n/a transfer. |

### 3.2 Republica Moldova

| Lege | Aplicabil | Notă |
|---|---|---|
| Legea 133/2011 — Protecția datelor cu caracter personal | DA | Aliniată cu GDPR în cea mai mare parte |
| Legea 142/2018 — Securitatea cibernetică | DA | Notification CNPDCP la breach |
| CNPDCP (Centrul Național pentru Protecția Datelor) | Autoritate de reglementare | Notification template în `incident-response` §11.4 |

### 3.3 ISO 27001 (track)

DPIA-ul satisface controale A.18.1.4 (privacy and protection of PII) + A.5.34 (privacy and protection of PII) ale ISO 27001:2022. Tracking în `iso27001-track` v1.0.0. ★ **BSI Group MD audit firm engaged** (DPA signed T+77; ISO 27001 Stage 1 formal kick-off post-GA M+1).

---

## 4. Lawful basis per feature

| Feature | Lawful basis (GDPR Art. 6) | Justificare |
|---|---|---|
| `churn-ga` (telemetry intern tenant) | **(f) Legitimate interest** (REVYX) | Operatorul are interes legitim în prevenția churn pentru sustenabilitate platformă; subiect (tenant) e B2B; balancing test §6 favorabil |
| `marketplace-two-sided` (BUYER_PROFILE) | **(a) Consent (Art. 7)** | Buyer publica profilul prin act activ + checkbox `gdpr_consent_at` + version |
| `marketplace-two-sided` (contact-grant) | **(a) Consent** | Approval explicit per request agent (event `BUYER_CONTACT_GRANT_APPROVED`) |
| `ml-pricing-ga` (predictions) | **(b) Contract** | Pricing e parte din serviciu contractual între tenant și REVYX |
| `mobile-rn` (push notifications) | **(b) Contract** | Push agent re leads/deals — execute contract |
| `white-label` (config tenant) | **(b) Contract** | Tier Enterprise plan |

---

## 5. Per-feature analysis

### 5.1 `churn-ga` (Phase 5 — Pilon Retention)

#### 5.1.1 Description

Sistem ML care calculează săptămânal `prob_30d` și `prob_60d` pentru fiecare tenant și agent activ, generează task-uri Customer Success (`churn_cs_task`) la risk_band MEDIUM/HIGH/CRITICAL, și măsoară rata de prevenție post-90d (vezi BRD v1.1.0 §6.4).

#### 5.1.2 Date prelucrate

| Categoria | Sursă | Sensibilitate |
|---|---|---|
| Telemetry tenant (login frequency, feature adoption, MRR trend, support tickets count) | Generat intern REVYX | LOW |
| Agent APS subset features (close rate, response SLA, sessions/week) | Generat intern | LOW |
| `cs_notes` free-text introduse de cs_user | Manual | MED (potențial PII inserabil) |
| Feature snapshot `churn_features_snapshot` | Computed | LOW (no direct PII) |

> **Niciun end-user PII în features ML** — features sunt agregate la nivel tenant/agent count + ratios. `assertNoPII(churn_features_snapshot.features)` rulat în CI (`PII_REDACTION_FIXTURES` §5.4 analog).

#### 5.1.3 Art. 22 GDPR — Automated decision-making

**Întrebare cheie:** "Does the churn score produce decisions producing legal effects or similarly significant effects on the data subject?"

**Răspuns:** **NU**. Justificare:

1. Subiectul e tenant (entitate juridică B2B); GDPR Art. 22 acoperă persoane fizice (cu excepția churn la nivel `subject_type=AGENT` care e fizic).
2. Pentru `subject_type=AGENT`: churn score **nu** declanșează decizii legale (terminare contract, blocare cont) sau semnificative (modificare salariu, retrogradare). Rezultatul e un task CS cu intervenție umană — `cs_user` decide acțiunea.
3. **BR-16 (CRITIC):** "niciun decizionalism automat — întotdeauna human-in-the-loop". Verificat prin code review + RBAC matrix (cs_user are doar `cs.task.*` permissions, nu `account.suspend` sau analog).
4. **BR-18 (CRITIC):** scorul nu e partajat cu agentul subiect — comunicare CS doar la nivel "risc retentie" în conversație. ★ **Stage 4 (S17 audit) BR-18 RLS 6/6 PASS × 2 cicluri (12 test runs) verified**.

**Concluzie:** Art. 22 **nu se aplică** churn-ga datorită HITL strict. Document oricum balancing test în §5.1.4 pentru due diligence. ★ **Stage 4 operational evidence: 1 human override invocation T+68 (cs_lead manual close MED #4 cu outcome=INTERVENED_BUT_RETAINED); DPO re-review PASS; audit trail complete în AUDIT_REVYX_s16-external-pass §2.3.**

#### 5.1.4 Legitimate interest balancing test (LIA)

**Test 1 — Purpose:** REVYX are interes legitim în prevenția churn? **DA** — sustenabilitate financiară platformă, calitate serviciu pentru utilizatori activi.

**Test 2 — Necessity:** Este profilarea churn necesară pentru atingerea scopului? **DA** — abordare reactivă (churn deja întâmplat) e tardivă; intervenție proactivă e doar posibilă cu signaling avansat.

**Test 3 — Balancing (drepturile data subject):**

| Risc pentru subject | Mitigare | Rezidual |
|---|---|---|
| Surveillance (subiect simte că e monitorizat fără să știe) | Privacy policy actualizată cu mențiune explicită | LOW |
| Decision opacity (subiect nu înțelege de ce e contactat) | Comunicare CS adresează valoare, nu menționează scor (BR-18) | LOW |
| Discrimination (anumite agency-uri tratate diferit) | Bias monitoring features (district + segment) la training | LOW |
| Profilare excesivă | Features doar telemetry agregată, no PII direct | LOW |

**Test 4 — Subject rights:**

- **Right to object** (Art. 21): tenant poate cere `CHURN_TASK_GENERATION_PAUSED` (BR equivalent — admin escală la cs_lead)
- **Right of access** (Art. 15): tenant admin poate cere export — score factors anonymized + recompute reason
- **Right to erasure** (Art. 17): la subscription cancel, churn_score row cu `is_current=FALSE`; după 365d retention auto-purge

**Concluzie LIA:** Legitimate interest **valabil**. Balancing favorabil. Mitigations adecvate. ★ **Less-intrusive-alternative review (F-S11-07)** programat post-Phase 5 GA + 90d (cca 2026-10-25) — separate document update cycle.

#### 5.1.5 DPIA Risk Register churn-ga

| # | Risc | Probab. | Impact | Mitigare | Rezidual |
|---|---|---|---|---|---|
| C1 | PII inserate în `cs_notes` rămân nereactate >365d | MED | MED | Cron `cs_notes_redact_after_365d` + `assertNoPII` test la export | LOW |
| C2 | Churn score share accidentally cu agent subiect | LOW | HIGH | UI guard + RBAC + audit `AUDIT_QUERIED` cu user_role check | LOW |
| C3 | Bias către anumite tenant types (de ex. SOLO vs ENTERPRISE) | MED | MED | Bias monitoring features în model card + retrain cu fairness constraint | LOW |
| C4 | False positive rate >40% → CS overhead inutil | MED | LOW | Threshold-uri retunabile + dashboard cs_lead | LOW |

#### 5.1.6 Sign-off churn-ga

| Rol | Sign-off |
|---|---|
| DPO | ✅ — HITL OK + LIA pass + cs_notes redaction adequate |
| Security Lead | ✅ — RBAC + audit trail OK |
| CISO | ✅ — risk rezidual acceptabil |

---

### 5.2 `marketplace-two-sided` — BUYER_PROFILE ★ v1.0.1 verbiage clarification (F-S14-04 closed)

#### 5.2.1 Description

Self-service flow prin care un cumpărător își creează `BUYER_PROFILE` cu intent, budget, locație preferințe, vizibilitate PUBLIC_LIMITED. Agenții pot trimite contact requests; buyer-ul aprobă/refuză; PII reveals doar după approval explicit (verificat prin event `BUYER_CONTACT_GRANT_APPROVED` audit-logged cu severity HIGH per `audit-log` v1.1.1 §4.4.2).

#### 5.2.2 Date prelucrate

| Categoria | Sensibilitate |
|---|---|
| Email buyer | HIGH |
| Phone buyer | HIGH |
| Nume/prenume | HIGH |
| Intent (buy_residential, buy_commercial, rent, invest) | LOW |
| Budget band (range) | LOW |
| Locație preferințe (district + zone codes) | MED |
| Property type preferences | LOW |
| Size m² range | LOW |

#### 5.2.3 Lawful basis: Consent (Art. 7)

- Active opt-in obligatoriu la create profile (checkbox necesar)
- `gdpr_consent_at` timestamp + `gdpr_consent_version` text — versionate (link către privacy policy version)
- Withdraw at any time: buyer poate `BUYER_PROFILE_REVOKED` cu un click → status REVOKED → invizibil agenți

#### 5.2.4 Contact-grant flow ★ v1.0.1 verbiage clarification

★ **F-S14-04 verbiage clarification:** flow-ul contact-grant respectă pattern explicit cu retention 72h pentru pending requests (auto-DENIED dacă buyer-ul nu răspunde) și audit-log event `BUYER_CONTACT_GRANT_APPROVED`/`BUYER_CONTACT_GRANT_DENIED` cu severity HIGH (per `audit-log` v1.1.1 §4.4.2) emis sincron cu state transition pentru `BUYER_CONTACT_REQUEST`. Niciun PII buyer revealed la agent fără approval explicit confirmat prin audit trail cu metadata `{buyer_id, agent_id, request_id, decision, decided_at, ip_address_redacted}`.

```
Agent → BUYER_CONTACT_REQUEST (cu mesaj template; severity INFO; retention pending=72h)
Buyer notificat (email + push) → 72h timeout (countdown explicit pe Web UI)
Buyer →
  ├─ Approve → BUYER_CONTACT_GRANT_APPROVED (severity HIGH; audit-log retention EXTENDED) + PII revealed la agent
  │           → BUYER_PII_REVEALED audit event (severity HIGH + Slack #privacy-watch alert + DPO monitoring)
  └─ Deny    → BUYER_CONTACT_GRANT_DENIED (severity MED) + lock pe acel agent (no re-request 7 zile)
72h timeout fără răspuns → auto-DENIED (cron `buyer_contact_request_timeout_audit` execute daily 02:00 UTC+2)
```

**Garanții (F-S14-04 verbiage explicit):**
- Niciun PII revealed la agent fără approval explicit confirmat (event audit-logged sincron).
- Audit log immutable cu `BUYER_PII_REVEALED` retention EXTENDED 7 ani (audit-log v1.1.1 §4.4.2; respect Art. 5(1)(e) storage limitation cu legal hold justification).
- Buyer poate `BUYER_CONTACT_GRANT_REVOKED` post-fact → agent pierde acces; event audit-logged cu severity MED; cron `buyer_contact_grant_revoke_propagate` execute sub 5min.
- Pending requests (status `PENDING`) au retention 72h hard-limit; după timeout → auto-DENIED + tombstone cu metadata complete.
- DPO monitoring continuu prin Slack channel `#privacy-watch` cu alertă instantanee la fiecare `BUYER_PII_REVEALED` event.

#### 5.2.5 Risk register marketplace

| # | Risc | Probab. | Impact | Mitigare | Rezidual |
|---|---|---|---|---|---|
| M1 | PII reveal nepermis (bug în API) | LOW | CRITICAL | RLS + RBAC `buyer.contact_grant.approve.own` + `BUYER_PII_REVEALED` audit + HIGH alert | LOW |
| M2 | Agent harassment (multiple requests) | MED | MED | Rate-limit max 3/buyer/zi + auto-DENY după 1 deny pe 7 zile | LOW |
| M3 | Buyer profile fraud (bot creation) | MED | LOW | Email verification mandatory + reCAPTCHA + manual review pentru PROMOTED tier | LOW |
| M4 | Data retention abuse (`last_active_at` manipulated) | LOW | MED | Last_active_at server-only set; auto-EXPIRE după 12 luni inactivitate (§8.3 BRD) | LOW |
| M5 | Cross-tenant leak (buyer_profile dintr-un tenant vizibil în alt tenant) | LOW | CRITICAL | RLS strict tenant_id + cross-tenant tests automate | LOW |

#### 5.2.6 Subject rights marketplace

- **Access (Art. 15):** export profile + grants history → JSON
- **Rectification (Art. 16):** edit fields direct în UI
- **Erasure (Art. 17):** REVOKED status + tombstone după 30 zile retention → wipe end-of-month
- **Portability (Art. 20):** export JSON structurat
- **Objection (Art. 21):** withdrawal consent = REVOKED status

#### 5.2.7 Sign-off marketplace

| Rol | Sign-off |
|---|---|
| DPO | ✅ — Consent flow + contact-grant + audit HIGH OK + ★ verbiage v1.0.1 cu retention 72h pending explicit |
| Security Lead | ✅ — RLS + rate-limit + cross-tenant tests OK |
| CISO | ✅ — risk rezidual MED acceptabil cu monitoring continuu |

---

### 5.3 `ml-pricing-ga` ★ v1.0.1 cross-ref update (F-S15-01 closed)

#### 5.3.1 Description

Model ML care prezice preț listat optim pe property cu features `district_code`, `property_type`, `size_m2`, `built_year`, `condition_band`, `historical_market_index`. Zero PII direct (no owner_name, no contact info).

#### 5.3.2 Date prelucrate

Toate features sunt **anonimizate** la nivel district (≥1.000 locuitori). Niciun feature unique-identifier (no apartment number, no street name, no exact coordinates — doar `district_code` + `zone_code` ce acoperă ≥1k locuințe).

`assertNoPII(model_card.features)` enforced ca CI gate (`PII_REDACTION_FIXTURES` §5.4).

★ **v1.0.1 update minor:** `min_sample_district_n: 30 → 50` post `TECH_SPEC_REVYX_ml-pricing-ga` v1.0.4 PATCH (F-S15-01 closed S17). Tighter bias gate pe districte rurale cu sample mic pentru a evita borderline bias alerts pre-Stage 5 GA. Districte cu n<50 → fallback baseline forțat (existing §6.5 R7 fallback logic, doar threshold bump prin config flag `ml_model_registry.config` JSON update; no model retraining required; backwards compat full). NU breach Art. 22 — compliance best-practice tightening conform Senior DBA + DS Lead + DPO co-aprobare. Verified Stage 5 operational T+76 deploy + Stage 5 production stable (zero bias alert post-tightening).

#### 5.3.3 Algorithmic transparency

- Model card public (Internal): `model_card_uri` per `ml_model_registry` row
- Disponibil tenant la cerere
- Conține: training data window, evaluation metrics (MAE, MAPE, R², bias_max per district), features list + descriere, ethical considerations, intended use, out-of-scope use, ★ **bias gate threshold v1.0.4 (`min_sample_district_n=50`) documented**

#### 5.3.4 Risk register ml-pricing

| # | Risc | Probab. | Impact | Mitigare | Rezidual |
|---|---|---|---|---|---|
| P1 | Bias district (anumite districts subevaluate) | MED | MED | `PRICING_MODEL_BIAS_ALERT` în catalog audit + retrain cu fairness + ★ tighter gate n=50 (v1.0.4) | LOW |
| P2 | Drift gradual nedetectat | LOW | MED | `PRICING_MODEL_DRIFT_ALERT` cu auto-rollback la 3 consecutive CRITICAL | LOW |
| P3 | Promote la GA fără 4-eyes | LOW | HIGH | Permission map: `data_science_lead` exclude `ml.model.promote.ga`; admin 4-eyes obligatoriu | LOW |
| P4 | PII accidentally în model card | LOW | HIGH | `assertNoPII(model_card.features)` CI gate | LOW |

#### 5.3.5 Sign-off pricing

| Rol | Sign-off |
|---|---|
| DPO | ✅ — Zero PII validat + model card public OK + ★ v1.0.4 tighter bias gate review PASS |
| Security Lead | ✅ — 4-eyes governance + auto-rollback OK |
| CISO | ✅ |

---

### 5.4 `mobile-rn`

#### 5.4.1 Description

App nativ React Native iOS + Android cu push notifications, offline support pentru pipeline core, OT auth flow.

#### 5.4.2 Date prelucrate

| Categoria | Sensibilitate |
|---|---|
| `device_id` (UUID generat la registration) | LOW (pseudonim) |
| `push_token_hash` (SHA-256 al token-ului FCM/APNS) | LOW |
| Local SQLite cache (lead queue, task list, deal detail) | HIGH (PII tenant) |

#### 5.4.3 Push payload — zero PII

**Cerință CRITICAL:** push payload conține doar IDs opace + template ID. Niciun nume, email, phone direct.

```json
// CORECT (zero PII)
{ "tid": "uuid", "lid": "uuid", "templateId": "lead.qualified", "ttl": 3600 }
```

```json
// INCORECT (FAIL CI)
{ "tid": "uuid", "agentName": "Ion Popescu", "leadEmail": "ion@example.com" }
```

CI gate via `assertNoPII(push_payload)` în snapshot tests (`mobile-rn` §15.6).

#### 5.4.4 Local SQLite cache encryption

- iOS: SQLCipher 256-bit AES, key în Keychain (synchronizable=false)
- Android: SQLCipher cu key în Android Keystore (StrongBox dacă disponibil)
- Auto-purge cache la `MOBILE_DEVICE_REVOKED` reason='COMPROMISED'

#### 5.4.5 Risk register mobile

| # | Risc | Probab. | Impact | Mitigare | Rezidual |
|---|---|---|---|---|---|
| MO1 | PII în push payload (regression developer) | MED | HIGH | `assertNoPII` CI gate + snapshot tests | LOW |
| MO2 | Device pierdut/furat — local cache exposed | MED | HIGH | SQLCipher + biometric unlock + remote revoke | LOW |
| MO3 | Push delivered to wrong device (token mismatch) | LOW | MED | Token rehash la fiecare register + verification post-send | LOW |
| MO4 | OT brute force attack | LOW | MED | Rate-limit `AUTH_MOBILE_OT_INVALID_ATTEMPT` ≥5/min/IP → block | LOW |

#### 5.4.6 Sign-off mobile

| Rol | Sign-off |
|---|---|
| DPO | ✅ — Zero PII push validat + encryption local |
| Security Lead | ✅ — Encryption + revoke flow OK |
| CISO | ✅ |

---

### 5.5 `white-label` ★ v1.0.1 expansion minor (BSI DPA signed cross-ref)

#### 5.5.1 Description

Tenant-ii Enterprise pot servi REVYX sub propriul domeniu cu branding și DKIM email separat. ★ **Stage 5 (S17 audit) executed CLOSED PASS T+91** cu 5/5 exit gates (TLS auto-renew + DMARC 100% sustained 9d post-rotation + plan-tier downgrade test PASS + edge HMAC defensive + tenant NPS +47).

#### 5.5.2 Date prelucrate

| Categoria | Sensibilitate |
|---|---|
| Tenant brand config (logo, paletă, copy) | LOW (corporate, not personal) |
| DKIM keys (private key) | HIGH (security material) |
| TLS certs (private key Let's Encrypt) | HIGH |
| Edge HMAC signing key | CRITICAL (cross-tenant compromise potential) |

> **Nicio data PII end-user direct procesată de `white-label`** — feature-ul e infra/branding. Date PII end-user sunt procesate de pillarii core (lead, deal, etc.) și sunt acoperite de DPIA-urile lor pre-existente. ★ **Verified Stage 5 production:** sub-processor minimal **CNAME + TLS only** confirmed (Cloudflare edge + Let's Encrypt cert provisioning; zero data PII end-user transit prin white-label feature).

#### 5.5.3 Sub-processor minimal Stage 5 ★ v1.0.1 expansion

Pentru Stage 5 White-Label feature, sub-processors implicated:

| Sub-processor | Categoria data | Scope | SCC status |
|---|---|---|---|
| Cloudflare (edge worker + DNS + DDoS) | `tenant_id`, `custom_domain` (FQDN), HMAC signature, headers HTTP standard (no PII în request body — body forwarded stream fără logging) | Inbound request routing pe tenant custom domain | ✅ SCC v1.0.1 §3.3 ON FILE (semnat 2026-04-15) |
| Let's Encrypt (TLS cert provisioning) | `custom_domain` (FQDN), ACME challenge response | Outbound HTTPS cert issuance per domain | n/a (open standard ACME; no PII cross-border) |
| DKIM provider (self-managed via tenant DNS) | Domain TXT records (selector + public key) | Email signature publishing | n/a (DNS public records) |
| ★ **BSI Group Moldova** (audit firm) | Read-only access la `audit_log_compliance_view` (PII-redacted; filtered `event_type LIKE 'ISO_%' OR 'INC_%' OR 'DR_TEST_%'`); zero PII unmask | Time-boxed audit firm engagement 90d (post-GA Stage 1 ISO 27001 audit kick-off) | ✅ **DPA signed T+77 BSI-M4 complete** (per `SCC_VENDORS_phase5` v1.0.2 §3.6) |

**Verified Stage 5 (S17 audit §3 + §6):** zero cross-tenant data leak; edge HMAC defensive test PASS ±120s skew rejection; plan-tier downgrade cron correctly suspends domain access.

#### 5.5.4 Risk register white-label

| # | Risc | Probab. | Impact | Mitigare | Rezidual |
|---|---|---|---|---|---|
| W1 | Cross-tenant data leak via shared infra | LOW | CRITICAL | F-01 fix: edge HMAC `X-REVYX-Tenant-Ts` + skew ±120s; ★ verified Stage 5 production T+77..T+91 zero leak | LOW |
| W2 | DKIM key compromise → email spoofing | LOW | HIGH | 90-day rotation runbook + Vault; ★ first production rotation rehearsal PASS T+84 (S17 audit §3) | LOW |
| W3 | Plan downgrade lasă tenant_admin nelegitim | LOW | MED | `tenant_plan_downgrade_audit` cron + auto-revoke; ★ test PASS T+88 (S17 audit §4) | LOW |
| W4 | TLS auto-renew fail → unavailable site | LOW | MED | `WL_TLS_FAILED` alert PD la retry≥3 + manual recover; ★ auto-renew test PASS T+87 staging mirror | LOW |
| W5 | Phishing via tenant branding (legitimitate domain folosit pentru phishing) | LOW | MED | Tenant DPA include "no phishing" clause + abuse@revyx.app monitoring | LOW |
| ★ W6 | Compliance auditor (BSI) over-access | LOW | HIGH | RLS strict pe `audit_log_compliance_view`; REVOKE pe table master; time-boxed 90d trigger SQL; meta-audit `AUDIT_QUERIED` cu actor_role check | LOW |

#### 5.5.5 Sign-off white-label

| Rol | Sign-off |
|---|---|
| DPO | ✅ — Zero PII end-user direct + tenant DPA enforced + ★ BSI DPA signed T+77 review PASS |
| Security Lead | ✅ — F-01 fix + DKIM rotation + key management |
| CISO | ✅ — risk rezidual LOW acceptabil + ★ BSI engagement Stage 1 audit firm ON FILE |

---

## 6. Cross-feature considerations

### 6.1 Compliance auditor (extern, time-boxed) ★ v1.0.1 status update

Per `tenancy-roles-extension` v1.1.0 §12.3 + §12.4:

- Acces strict read-only la `audit_log_compliance_view` (filtrat la `event_type LIKE 'ISO_%' OR 'INC_%' OR 'DR_TEST_%'`)
- Zero PII unmask (RLS + view + REVOKE pe table master)
- Time-boxed max 90 zile (trigger SQL §4.8)
- 4-eyes provisioning CISO + DPO sign-off
- Meta-audit `AUDIT_QUERIED` cu `metadata.actor_role='compliance_auditor'`

★ **v1.0.1 status update:** `pii_field_registry` populat **84 rows active** în prod T+75 (above target 80; migrare 0611 deployed). **Provisioning compliance_auditor unblocked T+76** — 1 user provisionat pentru BSI Group MD audit firm access path (CISO + DPO 4-eyes sign-off audit-logged conform `RBAC_ROLE_GRANTED`). BSI Group MD DPA signed T+77 (BSI-M4 complete per `SCC_VENDORS_phase5` v1.0.2 §3.6).

### 6.2 International transfers ★ v1.0.1 BSI row update

| Vendor | Țară | Mecanism transfer | Status |
|---|---|---|---|
| AWS (eu-west-1) | Irlanda | Adequacy decision (GDPR-internal) | ✅ ON FILE |
| Cloudflare | US (HQ) cu data residency EU | SCC + EU data localization | ✅ ON FILE |
| Stripe | US | SCC + DPA | ✅ ON FILE |
| Apple APNS | US | SCC + push payload zero PII (mitigat upstream) | ✅ ON FILE (signed 2026-04-29) |
| Google FCM | US | SCC + push payload zero PII | ✅ ON FILE (signed 2026-05-02) |
| ★ **BSI Group MD** (audit firm) | RM | Local — n/a transfer | ✅ **ON FILE (DPA signed T+77 BSI-M4 complete 2026-07-13)** |

> **RM e adequacy pendinte UE.** Transfer din UE către RM operator (REVYX/ITPRO) e acoperit prin SCC inclus în DPA cu tenant-ii UE; tracking în Legal/contracts.

### 6.3 Data minimization (Art. 5(1)(c))

Per feature, verificat că features ML / payload push / events audit conțin **doar** minimum necesar:

- **churn-ga:** features sunt agregate (counts, ratios, deltas), zero direct PII → ✅
- **marketplace:** doar fields esențiale pentru matching (intent, budget, locație) → ✅; PII fields sunt pe approval-grant, nu by default; ★ v1.0.1 verbiage explicit retention 72h pending
- **ml-pricing:** features sunt anonimizate la district level → ✅; ★ v1.0.1 tighter gate n=50 (district minimum)
- **mobile push:** payload minimal (IDs + template ID) → ✅
- **white-label:** doar config tenant, no end-user → ✅; ★ sub-processor minimal Stage 5 verified CNAME+TLS only

### 6.4 Storage limitation (Art. 5(1)(e))

Retention policy clearly defined per data type:

| Data | Retention | Justificare |
|---|---|---|
| `mobile_push_log` | 90d | Operational debugging only |
| `churn_features_snapshot` | 365d | Reproducibility retraining |
| `pricing_prediction_audit` | 365d | Model evaluation + drift |
| `audit_log` STANDARD | 7 ani | Legal hold |
| `audit_log` COMPLIANCE_84M | 7 ani hot | ISO 27001 audit trail |
| `BUYER_PROFILE` inactive | 12 luni from `last_active_at` | Auto-EXPIRE |
| `cs_notes` PII inside | 365d → redacted | LIA cs |
| ★ `BUYER_CONTACT_REQUEST` (status=PENDING) | 72h → auto-DENIED | F-S14-04 verbiage v1.0.1 explicit retention |
| ★ BSI compliance_auditor evidence | 1 an post-engagement | DPA Anexa II clause |

---

## 7. Subject rights flow (Art. 15-22 cross-feature)

| Drept | Mecanism per feature |
|---|---|
| Access (Art. 15) | Self-service export per tenant + buyer; admin tools; `GDPR_DATA_ACCESS_REQUEST` audit event |
| Rectification (Art. 16) | UI direct edit; `GDPR_DATA_RECTIFICATION` audit |
| Erasure (Art. 17) | REVOKED status + tombstone; cron purge per retention; `GDPR_DATA_ERASURE` audit |
| Restriction (Art. 18) | Status `PAUSED` (buyer) sau pause task generation (cs_lead) |
| Portability (Art. 20) | JSON export structurat per tenant + buyer |
| Objection (Art. 21) | Withdrawal consent flow + automatic respect |
| Art. 22 (no automated decision) | HITL strict per `churn-ga` BR-16; ★ Stage 4 verified 1 human override invocation T+68 |

---

## 8. Audit & accountability

DPIA-ul e referenced cross-doc:

- BRD v1.1.0 §9.7 (extension v1.1.0)
- `iso27001-track` v1.0.0 risk register link
- `tenancy-roles-extension` v1.1.0 §12.3 (compliance_auditor scope aliniat cu §6.1 din acest DPIA)
- `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §2 (Pre-flight gate cere acest DPIA semnat)
- ★ `AUDIT_REVYX_s17-external-pass` v1.0.0 §6 BSI DPA post-signing status verification
- ★ `SCC_VENDORS_phase5` v1.0.2 §3.6 BSI DPA ON FILE

DPIA review post-Phase 5 GA:
- Reuniune sincronă DPO + Security Lead + CISO la T+91+90d (cca 2026-10-25)
- Update risk register cu signal real (incidents observed)
- Bump v1.1.0 dacă schimbări materiale; v1.0.x patch pentru clarificări
- ★ Less-intrusive-alternative review (F-S11-07) acoperit în acest cycle

---

## 9. CNPDCP notification

Niciun consult prealabil CNPDCP necesar la acest moment (Art. 36 GDPR-RM equivalent threshold nu atins — risc rezidual MED gestionat). Reevaluat la primele 90 zile de operare reală (post-GA T+91+90d).

În caz de breach (DPIA risk realizat):
- `INC_GDPR_NOTIFIED_DPO` + `INC_GDPR_REGULATOR_NOTIFIED` per `RUNBOOK_REVYX_incident-response` §11.4
- 72h notification window (Art. 33 GDPR + Legea 133/2011)
- ★ Sub-processor breach (BSI Group MD) — 24h notification clause prevalent per DPA Anexa II

---

## 10. DPIA Approval (sign-off triple)

| Rol | Aprobat | Sign-off |
|---|---|---|
| **Data Protection Officer (DPO)** | ✅ | __________________________________ Semnătura · Data |
| **Security Lead** | ✅ | __________________________________ Semnătura · Data |
| **CISO** | ✅ | __________________________________ Semnătura · Data |

**Aprobat ca pre-condiție pentru `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 Pre-flight gate (§2).**

| Aprobator suplimentar | Sign-off | Note |
|---|---|---|
| Senior PM | ✅ | Aliniere business obiective |
| Solution Architect | ✅ | Aliniere tehnică cu specs |
| Audit Lead | ✅ | DPIA inclus în catalog deliverables S11 + ★ PATCH v1.0.1 cross-ref S18 |
| Senior Compliance Auditor | ✅ (★ v1.0.1) | F-S14-04 closure verification + BSI DPA Anexa I/II/III review |

---

## 11. Cross-references

- BRD v1.1.0 §9 Securitate · §9.7 (DPIA referenced)
- `audit-log` v1.1.0 §4.4 + v1.1.1 §4.4.2 (BUYER_* events) + §4.4.3 (WL_*) + §4.4.5 (CHURN_*) + §4.4.9 (PHASE5_*)
- `tenancy-roles-extension` v1.1.0 §12 (compliance_auditor scope) + §4.7 (plan-tier validation)
- `churn-ga` v1.0.1 §12 (Security & GDPR) + v1.0.2 (platform PATCH)
- `marketplace-two-sided` v1.0.1 §5 (BUYER_PROFILE consent flow)
- `ml-pricing-ga` v1.0.2 + v1.0.3 + ★ v1.0.4 (F-S15-01 closed; tighter bias gate n=50)
- `mobile-rn` v1.0.0 §12 (Security) + v1.0.1 (F-S13-01 closed)
- `white-label` v1.0.0 §6 (Edge HMAC + DKIM) + §11 (error codes) + §12 (Security)
- `iso27001-track` v1.0.0 (risk register)
- `RUNBOOK_REVYX_incident-response` v1.0.0 §11 (breach notification)
- `RUNBOOK_REVYX_dkim-rotation` v1.0.0 (white-label crypto)
- `RUNBOOK_REVYX_stage5-white-label-launch` v1.0.0 (operational Stage 5)
- `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §2 (Pre-flight gate)
- `PII_REDACTION_FIXTURES` v1.0.0 (CI gate enforcement)
- `pii-field-registry` v1.0.0 (★ deployed T+75 84 rows)
- ★ `AUDIT_REVYX_s17-external-pass` v1.0.0 (Stage 5 exit + Master Phase 5 GA decision GO)
- ★ `SCC_VENDORS_phase5` v1.0.2 (BSI Group MD DPA ON FILE)
- ★ `READINESS_REVYX_phase5` v1.1.0 (GA close MINOR)
- `MASTER_PLAN_REVYX_execution-roadmap` v1.1.1 §7 Phase 5
- `PLATFORM_MATRIX_REVYX_web-mobile` v1.0.0 §13-§16

---

*docs/legal/DPIA_REVYX_phase5_v1.0.1.md · v1.0.1 · 2026-07 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
