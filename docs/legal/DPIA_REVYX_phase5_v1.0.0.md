# DPIA — REVYX Phase 5 (Data Protection Impact Assessment)
<!-- DPIA_REVYX_phase5_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | DPO + Security Lead + CISO + Senior PM + Solution Architect | ★ Initial — closes F-S10-01 HIGH + F-S10-10 LOW (AUDIT_REVYX_s10-external-pass v1.0.0) · single-source DPIA pentru toate Phase 5 features (churn-ga · marketplace BUYER_PROFILE · ML pricing · mobile push · white-label) · risk register + balancing test (Art. 22 + legitimate interest) · sign-off triple DPO + Security Lead + CISO |

---

## 1. Identitate documentului

| Atribut | Valoare |
|---|---|
| Tip document | Data Protection Impact Assessment (GDPR Art. 35) |
| Scope | REVYX Phase 5 deliverables — toate features S8/S9 cu impact PII |
| Controller | ITPRO SYSTEM SRL (REVYX) |
| Joint-controller | None (REVYX e single controller pentru date proprii; tenants sunt joint-controllers pentru date end-user prin DPA) |
| Processor | Vendori cloud (AWS / Cloudflare / Stripe / Apple / Google FCM) — DPA-uri în vigoare |
| Aplicabil pe | Republica Moldova (Legea 133/2011) + GDPR (operațiuni cross-border via tenants UE) |
| Trigger DPIA | GDPR Art. 35(1) — "operațiune cu risc ridicat pentru drepturile și libertățile persoanelor" — confirmată pentru: profilare churn (Art. 22), prelucrare la scară mare (marketplace), tehnologie nouă (ML pricing) |
| Sign-off triple | DPO · Security Lead · CISO |
| Următoarea revizie | 90 zile post-Phase 5 GA sau la orice modificare materială |

---

## 2. Sumar executiv (1-pager)

REVYX Phase 5 introduce 5 features cu impact PII (priorități descrescătoare):

1. **`churn-ga`** — scoring churn la nivel tenant/agent. Risc principal: profilare automată (Art. 22). **Mitigare:** human-in-the-loop strict (BR-16), legitimate interest balancing test §6, scor invizibil agentului subiect (BR-18).
2. **`marketplace-two-sided`** — BUYER_PROFILE public limitat + contact-grant flow. Risc principal: PII reveal nepermis. **Mitigare:** consent explicit Art. 7, contact-grant approval flow, `BUYER_PII_REVEALED` audit cu severity HIGH.
3. **`ml-pricing-ga`** — ML pricing (zero PII features). Risc principal: algorithmic transparency. **Mitigare:** model card public, A/B + canary discipline cu 4-eyes admin.
4. **`mobile-rn`** — mobile app cu push notifications. Risc principal: PII în push payload. **Mitigare:** zero PII validat prin `@revyx/test-fixtures-pii` (CI gate).
5. **`white-label`** — domain custom per tenant cu DKIM. Risc principal: cross-tenant data leak via shared infra. **Mitigare:** edge HMAC signing F-01 fix, plan-tier gating, tenant_admin RBAC strict.

| # | Feature | Categoria date PII | Risc rezidual | Mitigare verificată | Sign-off |
|---|---|---|---|---|---|
| 1 | `churn-ga` | Telemetry tenant/agent (no end-user PII direct) + cs_notes free-text → redactare 365d | LOW | Art. 22 evitat prin HITL (BR-16) | ✅ DPO |
| 2 | `marketplace-two-sided` | Buyer email + phone + intent + budget + locație preferințe | MED | Contact-grant + audit HIGH severity | ✅ DPO |
| 3 | `ml-pricing-ga` | Zero PII (features anonimizate) | LOW | `assertNoPII` CI gate | ✅ DPO |
| 4 | `mobile-rn` | Push payload zero PII; cache local SQLite criptat | LOW | `assertNoPII` snapshot tests | ✅ DPO |
| 5 | `white-label` | Tenant brand config + DKIM keys (no end-user PII) | LOW | Edge HMAC + plan-tier gating | ✅ Security Lead |

**Concluzie globală:** Phase 5 prezintă risc rezidual **MEDIUM** dominat de marketplace BUYER_PROFILE; toate riscurile au mitigations validate; **DPIA APPROVED** pentru rollout conform `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0.

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
| Art. 44+ — International transfers | DA (parțial) | SCC pentru transfer la US-based vendors (FCM Apple/Google); RM e adequacy pendinte |

### 3.2 Republica Moldova

| Lege | Aplicabil | Notă |
|---|---|---|
| Legea 133/2011 — Protecția datelor cu caracter personal | DA | Aliniată cu GDPR în cea mai mare parte |
| Legea 142/2018 — Securitatea cibernetică | DA | Notification CNPDCP la breach |
| CNPDCP (Centrul Național pentru Protecția Datelor) | Autoritate de reglementare | Notification template în `incident-response` §11.4 |

### 3.3 ISO 27001 (track)

DPIA-ul satisface controale A.18.1.4 (privacy and protection of PII) + A.5.34 (privacy and protection of PII) ale ISO 27001:2022. Tracking în `iso27001-track` v1.0.0.

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
4. **BR-18 (CRITIC):** scorul nu e partajat cu agentul subiect — comunicare CS doar la nivel "risc retentie" în conversație.

**Concluzie:** Art. 22 **nu se aplică** churn-ga datorită HITL strict. Document oricum balancing test în §5.1.4 pentru due diligence.

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

**Concluzie LIA:** Legitimate interest **valabil**. Balancing favorabil. Mitigations adecvate.

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

### 5.2 `marketplace-two-sided` — BUYER_PROFILE

#### 5.2.1 Description

Self-service flow prin care un cumpărător își creează `BUYER_PROFILE` cu intent, budget, locație preferințe, vizibilitate PUBLIC_LIMITED. Agenții pot trimite contact requests; buyer-ul aprobă/refuză; PII reveals doar după approval.

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

#### 5.2.4 Contact-grant flow

```
Agent → BUYER_CONTACT_REQUEST (cu mesaj template)
Buyer notificat (email + push) → 72h timeout
Buyer →
  ├─ Approve → BUYER_CONTACT_GRANT_APPROVED + PII revealed la agent
  │           → BUYER_PII_REVEALED audit event (severity HIGH + Slack #privacy-watch)
  └─ Deny    → BUYER_CONTACT_GRANT_DENIED + lock pe acel agent (no re-request 7 zile)
72h timeout fără răspuns → auto-DENIED
```

**Garanții:**
- Niciun PII revealed la agent fără approval explicit
- Audit log immutable cu `BUYER_PII_REVEALED` retention EXTENDED (audit-log §4.4.2)
- Buyer poate `BUYER_CONTACT_GRANT_REVOKED` post-fact → agent pierde acces

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
| DPO | ✅ — Consent flow + contact-grant + audit HIGH OK |
| Security Lead | ✅ — RLS + rate-limit + cross-tenant tests OK |
| CISO | ✅ — risk rezidual MED acceptabil cu monitoring continuu |

---

### 5.3 `ml-pricing-ga`

#### 5.3.1 Description

Model ML care prezice preț listat optim pe property cu features `district_code`, `property_type`, `size_m2`, `built_year`, `condition_band`, `historical_market_index`. Zero PII direct (no owner_name, no contact info).

#### 5.3.2 Date prelucrate

Toate features sunt **anonimizate** la nivel district (≥1.000 locuitori). Niciun feature unique-identifier (no apartment number, no street name, no exact coordinates — doar `district_code` + `zone_code` ce acoperă ≥1k locuințe).

`assertNoPII(model_card.features)` enforced ca CI gate (`PII_REDACTION_FIXTURES` §5.4).

#### 5.3.3 Algorithmic transparency

- Model card public (Internal): `model_card_uri` per `ml_model_registry` row
- Disponibil tenant la cerere
- Conține: training data window, evaluation metrics (MAE, MAPE, R², bias_max per district), features list + descriere, ethical considerations, intended use, out-of-scope use

#### 5.3.4 Risk register ml-pricing

| # | Risc | Probab. | Impact | Mitigare | Rezidual |
|---|---|---|---|---|---|
| P1 | Bias district (anumite districts subevaluate) | MED | MED | `PRICING_MODEL_BIAS_ALERT` în catalog audit + retrain cu fairness | LOW |
| P2 | Drift gradual nedetectat | LOW | MED | `PRICING_MODEL_DRIFT_ALERT` cu auto-rollback la 3 consecutive CRITICAL | LOW |
| P3 | Promote la GA fără 4-eyes | LOW | HIGH | Permission map: `data_science_lead` exclude `ml.model.promote.ga`; admin 4-eyes obligatoriu | LOW |
| P4 | PII accidentally în model card | LOW | HIGH | `assertNoPII(model_card.features)` CI gate | LOW |

#### 5.3.5 Sign-off pricing

| Rol | Sign-off |
|---|---|
| DPO | ✅ — Zero PII validat + model card public OK |
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

### 5.5 `white-label`

#### 5.5.1 Description

Tenant-ii Enterprise pot servi REVYX sub propriul domeniu cu branding și DKIM email separat.

#### 5.5.2 Date prelucrate

| Categoria | Sensibilitate |
|---|---|
| Tenant brand config (logo, paletă, copy) | LOW (corporate, not personal) |
| DKIM keys (private key) | HIGH (security material) |
| TLS certs (private key Let's Encrypt) | HIGH |
| Edge HMAC signing key | CRITICAL (cross-tenant compromise potential) |

> **Nicio data PII end-user direct procesată de `white-label`** — feature-ul e infra/branding. Date PII end-user sunt procesate de pillarii core (lead, deal, etc.) și sunt acoperite de DPIA-urile lor pre-existente.

#### 5.5.3 Risk register white-label

| # | Risc | Probab. | Impact | Mitigare | Rezidual |
|---|---|---|---|---|---|
| W1 | Cross-tenant data leak via shared infra | LOW | CRITICAL | F-01 fix: edge HMAC `X-REVYX-Tenant-Ts` + skew ±120s | LOW |
| W2 | DKIM key compromise → email spoofing | LOW | HIGH | 90-day rotation runbook + Vault | LOW |
| W3 | Plan downgrade lasă tenant_admin nelegitim | LOW | MED | `tenant_plan_downgrade_audit` cron + auto-revoke | LOW |
| W4 | TLS auto-renew fail → unavailable site | LOW | MED | `WL_TLS_FAILED` alert PD la retry≥3 + manual recover | LOW |
| W5 | Phishing via tenant branding (legitimitate domain folosit pentru phishing) | LOW | MED | Tenant DPA include "no phishing" clause + abuse@revyx.app monitoring | LOW |

#### 5.5.4 Sign-off white-label

| Rol | Sign-off |
|---|---|
| DPO | ✅ — Zero PII end-user direct + tenant DPA enforced |
| Security Lead | ✅ — F-01 fix + DKIM rotation + key management |
| CISO | ✅ — risk rezidual LOW acceptabil |

---

## 6. Cross-feature considerations

### 6.1 Compliance auditor (extern, time-boxed)

Per `tenancy-roles-extension` v1.1.0 §12.3 + §12.4:

- Acces strict read-only la `audit_log_compliance_view` (filtrat la `event_type LIKE 'ISO_%' OR 'INC_%' OR 'DR_TEST_%'`)
- Zero PII unmask (RLS + view + REVOKE pe table master)
- Time-boxed max 90 zile (trigger SQL §4.8)
- 4-eyes provisioning CISO + DPO sign-off
- Meta-audit `AUDIT_QUERIED` cu `metadata.actor_role='compliance_auditor'`

**Pre-condiție DPIA-approved:** `pii_field_registry` populat (F-S10-04 tracked S12). **Provisioning compliance_auditor BLOCKED** până când seed validat în prod.

### 6.2 International transfers

| Vendor | Țară | Mecanism transfer | Status |
|---|---|---|---|
| AWS (eu-west-1) | Irlanda | Adequacy decision (GDPR-internal) | OK |
| Cloudflare | US (HQ) cu data residency EU | SCC + EU data localization | OK |
| Stripe | US | SCC + DPA | OK |
| Apple APNS | US | SCC + push payload zero PII (mitigat upstream) | OK |
| Google FCM | US | SCC + push payload zero PII | OK |
| BSI Group MD (audit firm) | RM | Local — n/a | OK |

> **RM e adequacy pendinte UE.** Transfer din UE către RM operator (REVYX/ITPRO) e acoperit prin SCC inclus în DPA cu tenant-ii UE; tracking în Legal/contracts.

### 6.3 Data minimization (Art. 5(1)(c))

Per feature, verificat că features ML / payload push / events audit conțin **doar** minimum necesar:

- **churn-ga:** features sunt agregate (counts, ratios, deltas), zero direct PII → ✅
- **marketplace:** doar fields esențiale pentru matching (intent, budget, locație) → ✅; PII fields sunt pe approval-grant, nu by default
- **ml-pricing:** features sunt anonimizate la district level → ✅
- **mobile push:** payload minimal (IDs + template ID) → ✅
- **white-label:** doar config tenant, no end-user → ✅

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
| Art. 22 (no automated decision) | HITL strict per `churn-ga` BR-16 |

---

## 8. Audit & accountability

DPIA-ul e referenced cross-doc:

- BRD v1.1.0 §9.7 (extension v1.1.0)
- `iso27001-track` v1.0.0 risk register link
- `tenancy-roles-extension` v1.1.0 §12.3 (compliance_auditor scope aliniat cu §6.1 din acest DPIA)
- `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §2 (Pre-flight gate cere acest DPIA semnat)

DPIA review post-Phase 5 GA:
- Reuniune sincronă DPO + Security Lead + CISO la T+90 zile post GA
- Update risk register cu signal real (incidents observed)
- Bump v1.1.0 dacă schimbări materiale; v1.0.x patch pentru clarificări

---

## 9. CNPDCP notification

Niciun consult prealabil CNPDCP necesar la acest moment (Art. 36 GDPR-RM equivalent threshold nu atins — risc rezidual MED gestionat). Reevaluat la primele 90 zile de operare reală.

În caz de breach (DPIA risk realizat):
- `INC_GDPR_NOTIFIED_DPO` + `INC_GDPR_REGULATOR_NOTIFIED` per `RUNBOOK_REVYX_incident-response` §11.4
- 72h notification window (Art. 33 GDPR + Legea 133/2011)

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
| Audit Lead | ✅ | DPIA inclus în catalog deliverables S11 |

---

## 11. Cross-references

- BRD v1.1.0 §9 Securitate · §9.7 (DPIA referenced)
- `audit-log` v1.1.0 §4.4 (events catalog)
- `tenancy-roles-extension` v1.1.0 §12 (compliance_auditor scope)
- `churn-ga` v1.0.1 §12 (Security & GDPR)
- `marketplace-two-sided` v1.0.1 §5 (BUYER_PROFILE consent flow)
- `ml-pricing-ga` v1.0.2 §12 (Security)
- `mobile-rn` v1.0.0 §12 (Security)
- `white-label` v1.0.1 §6 (Edge HMAC + DKIM)
- `iso27001-track` v1.0.0 (risk register)
- `RUNBOOK_REVYX_incident-response` v1.0.0 §11 (breach notification)
- `RUNBOOK_REVYX_dkim-rotation` v1.0.0 (white-label crypto)
- `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §2 (Pre-flight gate)
- `PII_REDACTION_FIXTURES` v1.0.0 (CI gate enforcement)

---

*docs/legal/DPIA_REVYX_phase5_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
