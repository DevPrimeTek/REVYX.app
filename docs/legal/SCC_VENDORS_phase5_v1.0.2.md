# SCC VENDORS — REVYX Phase 5 (Standard Contractual Clauses register)
<!-- SCC_VENDORS_phase5_v1.0.2.md · v1.0.2 · 2026-07 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** Pre-development / S18 deliverable; SCC vendor register PATCH post-Stage 5 close (BSI Group MD DPA signed T+77 BSI-M4 complete).
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.1.md` §0.3 (S18 deliverables) + §7 Phase 5 staged rollout.
**Roadmap ref:** `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §2.3 T-S18-04.
**Trio canonical citat:** Master Plan v1.1.1 + Platform Matrix v1.0.0 + Detailed Roadmap v1.0.0 (Regula 8 + Regula 9).

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | DPO + Legal Lead + Senior Compliance Auditor + CISO | Initial — closes F-S11-03 LOW (AUDIT_REVYX_s11-external-pass v1.0.0 §4) · register central pentru toate Standard Contractual Clauses (SCC) ale procesoarelor US-based + non-EU implicate în Phase 5 (Apple FCM, Google FCM/Push, Cloudflare, AWS eu-west-1, Stripe) · pre-flight gating Stage 1 (Mobile TestFlight) entry per `READINESS_REVYX_phase5` §0.14 · cross-ref `DPIA_REVYX_phase5` v1.0.0 §3.1 Art. 44+ și §6.2 |
| 1.0.1 | 2026-06 | DPO + Legal Lead + Senior Compliance Auditor + CISO + Audit Lead | PATCH — closes F-S13-03 LOW (AUDIT_REVYX_s13-external-pass v1.0.0 §4.4) doc-side bump post-S13 op-close · §3.1 Apple APNS Status 🟢 ON FILE + Data semnare 2026-04-29 · §3.2 Google FCM Status 🟢 ON FILE + Data semnare 2026-05-02 · §4 summary table refletă status real (Apple+Google verzi · Stage 1 blocker = NU) · §3.6 BSI Group MD DPA status pre-Stage 5 expandat cu plan operațional + checklist pre-T+77 · cross-ref `AUDIT_REVYX_s13-external-pass` §3.1 + `AUDIT_REVYX_s14-external-pass` §3.4 · zero schimbare semantică contracts existing (PATCH per regulă semver: clarificări fără breaking change) |
| **1.0.2** | **2026-07** | DPO + Legal Lead + Senior Compliance Auditor + CISO + Audit Lead | ★ PATCH — closes **BSI-M4 milestone tracking** (per `AUDIT_REVYX_s16-external-pass` §8 + `AUDIT_REVYX_s17-external-pass` §6). §3.6 BSI Group Moldova Status 🟡 PENDING NEGOTIATION → 🟢 **ON FILE** (DPA dual-signed 2026-07-13 T+77 ITPRO SYSTEM CEO + BSI Group MD CEO; PDF în `legal-vault/scc/bsi-md/2026-07/BSI_DPA_signed.pdf`). §3.6 Data semnare: TBD → **2026-07-13**. §3.6 Data expirare/re-review: 2027-07-13 (12 luni). §3.6.1 plan operațional pre-Stage 5: toate 4 milestones BSI-M1..M4 marcate ✅ executate. §3.6.2 NEW post-signing operational verification (compliance_auditor user provisionat T+76; ISO 27001 Stage 1 audit firm engagement RFP formal post-GA M+1). §4 summary table row 6 BSI Group MD: 🟡 PENDING → 🟢 **ON FILE**; Stage 5 blocker = NU. §7 re-review anniversar BSI Group MD adăugat (2027-07-13). Zero schimbare semantică alte vendor contracts (PATCH per regulă semver). Cross-ref `AUDIT_REVYX_s17-external-pass` v1.0.0 + `READINESS_REVYX_phase5` v1.1.0 GA close + `DPIA_REVYX_phase5` v1.0.1 §6.2 BSI row 🟢 ON FILE. |

---

## 1. Scop

Acest document este **register central** al Standard Contractual Clauses (SCC) Modul 2 (Controller → Processor) și Modul 3 (Processor → Sub-processor) semnate de REVYX/ITPRO SYSTEM SRL cu vendori procesoare de date personale care **transferă date în afara UE/SEE** sau care se află în jurisdicții fără adequacy decision.

| Atribut | Valoare |
|---|---|
| Tip document | Legal register (vendor SCC tracking) |
| Aplicabilitate | Toate transferurile de date personale procesate prin REVYX Phase 5 stages |
| Bază legală | GDPR Art. 44–49 + Decizia CE 2021/914 (SCC noi 2021) + Schrems II (C-311/18) |
| Refresh cycle | T+90 zile (review trimestrial) sau ad-hoc la (a) vendor change · (b) jurisdicție change · (c) breach notification de la vendor · (d) Comisia EU schimbă SCC template |
| Owner | DPO (canonical) + Legal Lead (negociere) |
| Storage location pentru SCC originali (PDF semnat) | `legal-vault/contracts/scc/<vendor>/<YYYY-MM>/SCC_<vendor>_<module>.pdf` (acces restricționat: DPO + Legal + CFO) |

---

## 2. Pre-flight gating per stage Phase 5

| Stage | Vendor SCC blocant entry | Verificare |
|---|---|---|
| Stage 1 — Mobile TestFlight | Apple APNS, Google FCM | §3.1 + §3.2 verde · pre-flight `READINESS_REVYX_phase5` §0.14 |
| Stage 2 — Marketplace pilot | Stripe (billing tier marketplace) | §3.5 verde |
| Stage 3 — ML Pricing CANARY | AWS eu-west-1 (procesare features + model artifacts S3) | §3.4 verde |
| Stage 4 — Churn pilot | AWS (idem) | §3.4 verde |
| Stage 5 — White-Label first Enterprise | Cloudflare (HMAC edge worker activ) + DKIM provider + BSI Group MD audit firm DPA | §3.3 + ★ **§3.6 verde (DPA signed T+77)** + DKIM provider per `RUNBOOK_REVYX_dkim-rotation` §5 |

> **Regula:** niciun stage nu poate intra (Entry gate ❌) dacă **un singur** SCC obligatoriu pentru acel stage e listat 🔴 sau ⏳ EXPIRED în acest register.

★ **Post-S17:** toate 5 stages CLOSED PASS; Master Phase 5 GA decision GO T+91 unanimous (per AUDIT_s17 §8). Niciun vendor SCC blocker activ.

---

## 3. Vendor SCC inventory

### 3.1 Apple — APNS (Apple Push Notification service)

| Câmp | Valoare |
|---|---|
| Vendor legal entity | Apple Distribution International Limited (Hollyhill, Cork, Irlanda) |
| Sub-processor pentru | iOS push notifications (token-based delivery) |
| Jurisdicție data processing | US (servere APNS) cu trafic intermediat prin entități EU |
| Tip date procesate | `apns_token_hash` (SHA-256), payload minimal (template_id, deep_link, no PII per `mobile-rn` §12.3) |
| Mecanism transfer | **SCC Modul 3 (Processor → Sub-processor)** + Apple Developer Program License Agreement (PLA) §3.3 + Apple Data Processing Addendum (DPA) v.2024 |
| Data semnare | **2026-04-29** (signed pre-Stage 1 T-7 by 4 zile) |
| Data expirare / re-review | 2027-04-29 (12 luni de la semnare) |
| Audit firm verification | n/a (Apple e self-assessed prin SOC 2 Type II + ISO 27001 certificate disponibil) |
| Status @ S18 | 🟢 **ON FILE** (semnat 2026-04-29; verified vault `legal-vault/contracts/scc/apple/2026-04/SCC_apple_apns_module3_signed.pdf`) |
| Owner negotiate | Mobile Lead + Legal Lead |
| Owner sign-off | DPO ✅ |
| File location | `legal-vault/contracts/scc/apple/2026-04/SCC_apple_apns_module3_signed.pdf` ✅ |

**Fallback dacă SCC nu mai e valid (re-review anual):** defer Stage 1+ cu 1 săpt + escalation Mobile Lead → CTO. Niciun fallback tehnic acceptabil (Expo Push e deja Apple sub-processed; nu există alternativă fără SCC).

### 3.2 Google — FCM (Firebase Cloud Messaging) + Google Push

| Câmp | Valoare |
|---|---|
| Vendor legal entity | Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Irlanda) |
| Sub-processor pentru | Android push notifications (FCM) + (opțional) Cross-device delivery |
| Jurisdicție data processing | Multi-region cu primary US (`us-central1`); EU residency option negociat (`europe-west1`) |
| Tip date procesate | `fcm_token_hash` (SHA-256), payload `{"data": {...}}` minim conform `mobile-rn` §12.3 |
| Mecanism transfer | **SCC Modul 3 (Processor → Sub-processor)** + Google Cloud DPA v.2024 cu addendum FCM + Anexa SCC standard (2021/914) |
| Data semnare | **2026-05-02** (signed pre-Stage 1 T-7 by 1 zi) |
| Data expirare / re-review | 2027-05-02 (12 luni de la semnare) |
| Audit firm verification | Google Cloud SOC 2 Type II + ISO 27001 + ISO 27018 (certificate links arhivate) |
| Status @ S18 | 🟢 **ON FILE** (semnat 2026-05-02; verified vault `legal-vault/contracts/scc/google/2026-05/SCC_google_fcm_module3_signed.pdf`) |
| Owner negotiate | Mobile Lead + Legal Lead |
| Owner sign-off | DPO ✅ |
| File location | `legal-vault/contracts/scc/google/2026-05/SCC_google_fcm_module3_signed.pdf` ✅ |

**Fallback:** identic §3.1.

### 3.3 Cloudflare — Edge worker + DNS + DDoS shield

| Câmp | Valoare |
|---|---|
| Vendor legal entity | Cloudflare, Inc. (101 Townsend Street, San Francisco, CA 94107, US) cu entitate europeană Cloudflare Germany GmbH (München) |
| Sub-processor pentru | (a) Edge worker HMAC signing pentru white-label custom domains · (b) DNS provider primary pentru tenant Enterprise · (c) DDoS / WAF |
| Jurisdicție data processing | EU residency setting **enabled** la nivel de account (`Cloudflare Data Localization Suite` activat); US fallback dezactivat pentru tenants EU |
| Tip date procesate | `tenant_id`, `custom_domain` (FQDN), HMAC signature, headers HTTP standard (no PII în request body — body forwarded stream fără logging) |
| Mecanism transfer | **SCC Modul 3 (Processor → Sub-processor)** semnat de ITPRO SYSTEM cu Cloudflare, Inc. (US entity) + EU Data Protection Addendum v.2023 + Cloudflare Data Localization Suite contract |
| Data semnare | 2026-04-15 (pre-Phase 5 baseline; pe Cloudflare contract activ din 2025) |
| Data expirare / re-review | 2027-04-15 (anual auto-renew dacă nu dispute) |
| Audit firm verification | Cloudflare SOC 2 Type II + ISO 27001 + ISO 27701 + PCI DSS Level 1 (compliance hub link) |
| Status @ S18 | 🟢 **ON FILE** (Cloudflare Master DPA semnat 2025-Q3 + addendum SCC 2021 update aplicat 2026-04; ★ Stage 5 production cycle T+77..T+91 verified edge HMAC defensive test PASS) |
| Owner negotiate | DevOps Lead + Legal Lead |
| Owner sign-off | DPO ✅ |
| File location | `legal-vault/contracts/scc/cloudflare/2026-04/SCC_cloudflare_module3_signed.pdf` ✅ |

### 3.4 AWS — eu-west-1 (Irlanda)

| Câmp | Valoare |
|---|---|
| Vendor legal entity | Amazon Web Services EMEA SARL (38 avenue John F. Kennedy, L-1855 Luxembourg) |
| Sub-processor pentru | (a) RDS PostgreSQL master DB · (b) S3 object storage (model artifacts ML Pricing + Churn + assets static) · (c) SQS/SNS · (d) ElastiCache Redis · (e) Cognito (dacă alegem peste Supabase) |
| Jurisdicție data processing | **Irlanda (eu-west-1)** — adequacy decision (GDPR-internal); fără transfer extra-UE pentru clusterul prod |
| Tip date procesate | Toate datele REVYX inclusiv PII (LEAD/PROPERTY/DEAL/AGENT/BUYER_PROFILE/USER) — encrypted at rest (KMS CMK) + in transit (TLS 1.3) |
| Mecanism transfer | **n/a transfer extra-UE** pentru cluster prod (eu-west-1 e UE). DPA semnat AWS EMEA SARL ↔ ITPRO SYSTEM SRL (acoperă Sub-processor list publicată de AWS) |
| Data semnare | 2026-03-10 (DPA AWS standard cu addendum Customer Agreement) |
| Data expirare / re-review | 2027-03-10 |
| Audit firm verification | AWS SOC 1/2/3 Type II + ISO 27001/27017/27018/27701 + C5 (Germany) + ISMAP (Japan) — full Artifact Hub access |
| Status @ S18 | 🟢 **ON FILE** |
| Owner negotiate | CTO + Legal Lead |
| Owner sign-off | DPO ✅ |
| File location | `legal-vault/contracts/dpa/aws/2026-03/AWS_DPA_signed.pdf` ✅ |

> **Notă critică:** AWS sub-processor list publicat (e.g. AWS Managed Services). REVYX **NU folosește** AWS sub-processors care implică transfer extra-UE pentru clusterul prod. Configurație data residency hard-pinned `eu-west-1`. Verificare lunară cu raport AWS Config (DBA owner).

### 3.5 Stripe — Billing + Payment

| Câmp | Valoare |
|---|---|
| Vendor legal entity | Stripe Payments Europe Limited (Block 4, Harcourt Centre, Harcourt Road, Dublin 2, Irlanda) cu sub-processor Stripe, Inc. (San Francisco, US) |
| Sub-processor pentru | Subscription billing (marketplace plan + WL Enterprise addon), invoice generation, payment processing |
| Jurisdicție data processing | Primary EU (Stripe Payments Europe Ltd, Irlanda); sub-processor US Stripe Inc. pentru fraud detection + advanced ML risk scoring |
| Tip date procesate | `tenant.billing_email`, `payment_method_token` (PCI-DSS scope **complet la Stripe** — REVYX nu vede card PAN), `invoice_history`, `subscription_state` |
| Mecanism transfer | **SCC Modul 3 (Processor → Sub-processor)** Stripe EU → Stripe US — semnat ca parte a Stripe Services Agreement v.2024 + EU DPA + Stripe Sub-processor List (revizuit lunar) |
| Data semnare | 2026-04-22 |
| Data expirare / re-review | 2027-04-22 |
| Audit firm verification | Stripe PCI-DSS Level 1 + SOC 1/2 Type II + ISO 27001 |
| Status @ S18 | 🟢 **ON FILE** (verified operational Stage 2 T+14..T+35; zero SCC dispute incidents; Stage 5 plan-tier downgrade test T+88 PASS conform `WL_PLAN_TIER_CHANGED` event) |
| Owner negotiate | Billing Lead + Legal Lead |
| Owner sign-off | DPO ✅ |
| File location | `legal-vault/contracts/scc/stripe/2026-04/SCC_stripe_module3_signed.pdf` ✅ |

### 3.6 BSI Group MD (Audit firm — Stage 5/GA gating extern) — ★ ON FILE v1.0.2

| Câmp | Valoare |
|---|---|
| Vendor legal entity | BSI Group Moldova SRL (Chișinău, RM) |
| Procesează | Audit logs samples (PII-redacted via `audit_log_compliance_view` per `audit-log` v1.1.0 §6.5) + risk register + incident records + ISO 27001 control evidence (read-only, time-boxed pe durata audit firm engagement 90d max) |
| Jurisdicție | RM (operator local Moldova) |
| Mecanism transfer | **n/a** (operator local; nu e cross-border UE→non-UE; jurisdicție RM Legea 133/2011 + Legea 142/2018 compliance verificată) |
| DPA | ★ **SIGNED 2026-07-13** dual signature ITPRO SYSTEM SRL CEO + BSI Group Moldova SRL CEO (T+77 BSI-M4 milestone complete per `AUDIT_REVYX_s16-external-pass` §8 + verified `AUDIT_REVYX_s17-external-pass` §6) |
| Data semnare | ★ **2026-07-13** (T+77) |
| Data expirare / re-review | **2027-07-13** (12 luni de la semnare) |
| Audit firm verification | BSI Group ISO 17021-1 accreditation + UKAS recognized (UK accreditation parent organization BSI plc — RM subsidiary licensed) |
| Plan operațional pre-Stage 5 | Vezi §3.6.1 (toate 4 milestone-uri ✅ executate) |
| Post-signing operational status | Vezi §3.6.2 (compliance_auditor user provisionat T+76; ISO 27001 Stage 1 audit firm engagement RFP formal post-GA M+1) |
| Status @ S18 | 🟢 **ON FILE** ★ (DPA dual-signed 2026-07-13) |
| Owner negotiate | CTO + CISO |
| Owner sign-off | DPO ✅ + Legal Lead ✅ |
| File location | `legal-vault/scc/bsi-md/2026-07/BSI_DPA_signed.pdf` ✅ verified |

#### 3.6.1 Plan operațional pre-Stage 5 (T+56 → T+77) — ★ TOATE EXECUTATE

| Milestone | Țintă | Owner | Status | Output verified |
|---|---|---|---|---|
| BSI-M1 | T+56: kick-off meeting BSI Group MD sales + CTO + CISO | CTO | ✅ **executat 2026-06-22** | Meeting notes Slack + scope discussion ISO 27001 Stage 1 audit firm engagement |
| BSI-M2 | T+63: draft DPA primit de la BSI Group MD | CISO + Legal | ✅ **executat 2026-06-29** | Draft PDF `legal-vault/scc/bsi-md/2026-06/draft/BSI_DPA_v1_draft.pdf` |
| BSI-M3 | T+70: Legal review + clauze sensibile (Anexa II măsuri tehnice + Anexa III sub-processors) + sign-off DPO | DPO + Legal | ✅ **executat 2026-07-06** | Markup PDF cu acceptance comments + DPO pre-approval note |
| BSI-M4 | T+77: semnare DPA (dual signature ITPRO SYSTEM + BSI Group MD) | DPO + CTO | ✅ **executat 2026-07-13** (T+77) | PDF semnat în `legal-vault/scc/bsi-md/2026-07/BSI_DPA_signed.pdf` |

**Verificare DPA conținut minim (DPO checklist) — ★ TOATE VERIFICATE post-signing AUDIT_s17 §6:**

- [x] ✅ Anexa I (Lista părți): REVYX/ITPRO SYSTEM SRL + BSI Group Moldova SRL — verified
- [x] ✅ Anexa II (Măsuri tehnice): encryption in transit (TLS 1.3 portal acces audit) + access control time-boxed (audit firm role expires post-engagement 90d max) + breach notification 24h (RM Legea 133/2011 standard mai strict decât GDPR 72h)
- [x] ✅ Anexa III (Lista sub-processors): zero sub-processors pentru BSI (operator direct fără chain processors)
- [x] ✅ Clauza de read-only access (NO modificare audit-log) cu enforcement la nivel BD prin `audit_log_compliance_view` RLS (Senior DBA verified REVOKE pe table master `audit_log`)
- [x] ✅ Clauza de retention 1 an post-engagement → ștergere automate evidence (cron `compliance_auditor_evidence_purge` configurabil)
- [x] ✅ Clauza de jurisdicție: lege RM aplicabilă; arbitraj Chișinău

**Fallback prevăzut (nu invocat):** alternative audit firms (TÜV, Deloitte Moldova) considerate, dar BSI Group MD selected first choice datorită ISO 27001 deep expertise în piața RM + UKAS lineage.

#### 3.6.2 Post-signing operational verification ★ NEW v1.0.2

Per `AUDIT_REVYX_s17-external-pass` v1.0.0 §6:

| Item | Status @ T+77 close (S17) | Verified @ S18 |
|---|---|---|
| PDF dual-signed în vault | ✅ `legal-vault/scc/bsi-md/2026-07/BSI_DPA_signed.pdf` | ✅ accesibile DPO + Legal + CFO (RBAC scope correct) |
| `compliance_auditor` user provisionat | ✅ 1 user provisionat T+76 pentru BSI access path | ✅ time-boxed 90d trigger SQL active per `tenancy-roles-extension` v1.1.0 §4.8 |
| `audit_log_compliance_view` RLS strict | ✅ filtered `event_type LIKE 'ISO_%' OR 'INC_%' OR 'DR_TEST_%'` | ✅ Senior DBA verified zero PII unmask + REVOKE master table |
| Meta-audit `AUDIT_QUERIED` cu actor_role check | ✅ catalog event present | ✅ DPO verified zero unauthorized access în 15 zile Stage 5 |
| ISO 27001 Stage 1 audit firm engagement RFP formal | 📋 PENDING (post-GA M+1 = cca 2026-08-27) | n/a (post-GA timeline) |
| ISO 27001 audit firm engagement kick-off | 📋 PENDING (post-RFP) | n/a (post-GA timeline) |

**Concluzie post-signing:** **🟢 ON FILE complet operational**. Zero finding. Niciun blocker activ. ISO 27001 Stage 1 audit formal kick-off programat post-Phase 5 GA (M+1).

---

## 4. Vendor SCC summary table — ★ S18 update post-Stage 5

| # | Vendor | Mecanism | Data semnare | Status | Stage blocker? |
|---|---|---|---|---|---|
| 1 | Apple APNS | SCC Modul 3 + DPA + PLA | 2026-04-29 | 🟢 ON FILE | NU (Stage 1 closed PASS) |
| 2 | Google FCM | SCC Modul 3 + GCP DPA | 2026-05-02 | 🟢 ON FILE | NU (Stage 1 closed PASS) |
| 3 | Cloudflare | SCC Modul 3 + EU DLS | 2026-04-15 | 🟢 ON FILE | NU (Stage 5 closed PASS) |
| 4 | AWS eu-west-1 | DPA (no-transfer) | 2026-03-10 | 🟢 ON FILE | NU (Stages 1-5 closed PASS) |
| 5 | Stripe | SCC Modul 3 + EU DPA | 2026-04-22 | 🟢 ON FILE | NU (Stage 2 closed PASS + Stage 5 plan-tier test PASS) |
| 6 | ★ **BSI Group MD** | DPA local | ★ **2026-07-13** | 🟢 **ON FILE** | **NU** — Stage 5 closed PASS T+91 |

**Concluzie pentru Phase 5 stages post-S17 audit:**
- **Stage 1 (Mobile TestFlight):** ✅ unlocked + executed CLOSED PASS T+14 (Apple+Google ON FILE).
- **Stage 2 (Marketplace):** ✅ unlocked + executed CLOSED PASS T+35 (Stripe ON FILE).
- **Stage 3 (ML Pricing CANARY):** ✅ unlocked + executed CLOSED PASS T+56 (AWS eu-west-1 ON FILE).
- **Stage 4 (Churn pilot):** ✅ unlocked + executed CLOSED PASS T+77.
- **Stage 5 (White-Label Enterprise):** ✅ unlocked + ★ **executed CLOSED PASS T+91** (5/5 exit gates; toate 6 vendor SCC ON FILE).
- **Master Phase 5 GA decision T+91:** ✅ **GO** unanimous (6/6 aprobatori VP Product + CTO + CISO + DPO + Audit Lead + CFO per AUDIT_s17 §8).

**Niciun vendor SCC blocker activ post-S17.**

---

## 5. Plan operațional pre-Stage 1 (T-14 → T-0) — EXECUTAT S13 (istoric)

(Plan original păstrat pentru istoric; toate milestone-urile executate)

| Zi | Pas | Owner | Status |
|---|---|---|---|
| T-14 | Solicitare Apple Enterprise Sales draft SCC v.2024 | Mobile Lead | ✅ executat 2026-04-20 |
| T-13 | Solicitare Google Cloud Account Manager GCP DPA + FCM addendum | Mobile Lead | ✅ executat 2026-04-21 |
| T-12..T-9 | Legal review draft-uri (Schrems II + Anexa II) | Legal Lead + DPO | ✅ executat 2026-04-22..2026-04-25 |
| T-9 | Semnare Apple SCC | Mobile Lead → DPO | ✅ executat 2026-04-29 |
| T-8 | Semnare Google SCC + DPA addendum | Mobile Lead → DPO | ✅ executat 2026-05-02 |
| T-7 | Pre-flight 3-eyes review marchează §0.14 din `READINESS_REVYX_phase5` ☑ | Audit Lead | ✅ executat 2026-05-04 |
| T-6..T-1 | Internal smoke test (5 iOS + 5 Android) | Mobile Lead + Senior QA | ✅ executat (per AUDIT_REVYX_s13 §2.2) |
| T-0 | Stage 1 entry | Mobile Lead | ✅ executat 2026-05-04 |

---

## 6. Verificare pre-flight (checklist DPO) — EXECUTAT S13 (istoric)

DPO a marcat **înainte** de a semna 3-eyes pre-flight (§0.14 din `READINESS_REVYX_phase5`):

- [x] ✅ Apple SCC PDF prezent în `legal-vault/scc/apple/2026-04/` cu signature DPO + Apple counterparty
- [x] ✅ Apple SCC Anexa I (Lista părți) completă: REVYX/ITPRO SYSTEM SRL + Apple Distribution International Limited
- [x] ✅ Apple SCC Anexa II (Măsuri tehnice) acoperă: encryption in transit (TLS 1.3) + payload minimization (`mobile-rn` §12.3 ref) + access control + breach notification 72h
- [x] ✅ Apple SCC Anexa III (Lista sub-processors) verificat: niciun sub-processor neaprobat
- [x] ✅ Google SCC PDF prezent + Anexele I/II/III complete (idem)
- [x] ✅ Cross-ref DPIA §6.2 actualizat cu data semnare (★ DPIA v1.0.1 PATCH delivered S18 cu BSI row 🟢 ON FILE)
- [x] ✅ Cross-ref `READINESS_REVYX_phase5` §0.14 marcat 🟢 după dual signature (★ v1.0.5 + v1.1.0 GA close)
- [ ] AUDIT_LOG event manual `LEGAL_VENDOR_SCC_SIGNED` — n/a (revisit la audit-log v2.0.0; cosmetic; NO-OP; F-S11-06 tracked)
- [x] ✅ T-7 sync DPO + Legal + Mobile Lead pe Slack #legal-rollout cu confirmation message

**Status:** toate checkpoint-urile critice completate. Single open item e cosmetic (NO-OP per F-S11-06).

---

## 7. Re-review trimestrial (T+90 cycle) — ★ v1.0.2 update

| Eveniment | Acțiune | Owner |
|---|---|---|
| Vendor schimbă sub-processor list | Re-evaluare risc + (dacă necesar) re-semnare addendum | DPO |
| Apple/Google publică versiune nouă SCC | Compare delta + sign update în 30 zile | Legal |
| Schrems III sau orice CJEU ruling cu impact | Imediat audit firm consultation + revisit gating | DPO + CISO |
| Vendor breach notification | INC declared (per `incident-response` §3) + freeze rollout până remediation | DPO + Security Lead |
| Anual: review complet register | Update toate `Data expirare / re-review` + Anexele | DPO + Legal |
| ★ BSI Group MD DPA post-signature anniversar 2027-07-13 | Review Anexa II măsuri tehnice + sub-processor list (zero ar trebui) + audit firm engagement status | DPO + Legal |

Următorul review: **2026-10-13** (T+90 from this PATCH v1.0.2). Următorul anniversar Apple SCC = 2027-04-29; Google = 2027-05-02; ★ **BSI Group MD = 2027-07-13**.

---

## 8. Cross-references

- `DPIA_REVYX_phase5` v1.0.0 §3.1 (Art. 44+) + §6.2 (International transfers) → ★ **v1.0.1 PATCH §6.2 BSI row 🟢 ON FILE** delivered S18
- `READINESS_REVYX_phase5` v1.0.x §0.14 (Pre-flight SCC vendor sign-off) — ★ **v1.1.0 GA close** delivered S18
- `RUNBOOK_REVYX_stage1-mobile-launch` v1.0.0 §1 (Stage 1 entry pre-flight)
- `RUNBOOK_REVYX_stage5-white-label-launch` v1.0.0 §2 (Stage 5 entry pre-flight 5.14 BSI DPA)
- `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §2 (Pre-flight master gate) + §8 (Stage 5)
- `TECH_SPEC_REVYX_mobile-rn` v1.0.0 §12.3 (Push payload privacy — zero PII)
- `RUNBOOK_REVYX_dkim-rotation` v1.0.0 §5 (Cloudflare DNS provider — Stage 5)
- `AUDIT_REVYX_s11-external-pass` v1.0.0 §4 F-S11-03 (initial finding)
- `AUDIT_REVYX_s13-external-pass` v1.0.0 §3.1 (F-S11-03 OPERATIONAL CLOSED)
- `AUDIT_REVYX_s14-external-pass` v1.0.0 §3.4 (F-S13-03 CLOSED via v1.0.1 PATCH)
- `AUDIT_REVYX_s16-external-pass` v1.0.0 §8 (BSI-M4 milestone tracking pre-T+77)
- ★ `AUDIT_REVYX_s17-external-pass` v1.0.0 §6 (BSI DPA post-signing verification)
- `TECH_SPEC_REVYX_audit-log` v1.1.0 §6.5 — `audit_log_compliance_view` RLS (BSI Group MD access path)
- `TECH_SPEC_REVYX_tenancy-roles-extension` v1.1.0 §4.8 (compliance_auditor time-boxed trigger) + §12.3 (scope)
- `TECH_SPEC_REVYX_iso27001-track` v1.0.0 — ISO 27001 audit firm engagement (BSI ON FILE)

---

## 9. Approval

| Aprobator | Rol | Sign-off |
|---|---|---|
| DPO | Privacy + GDPR Art. 44+ owner | ✅ |
| Legal Lead | Contract negotiation owner | ✅ |
| Senior Compliance Auditor | Cross-spec consistency + BSI DPA Anexa I/II/III verification | ✅ |
| CISO | Risk register cross-check + BSI engagement completion | ✅ |
| Audit Lead | F-S11-03 + F-S13-03 closure verification + BSI-M4 milestone signed verify | ✅ |

---

*docs/legal/SCC_VENDORS_phase5_v1.0.2.md · v1.0.2 · 2026-07 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
