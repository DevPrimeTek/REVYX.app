# SCC VENDORS — REVYX Phase 5 (Standard Contractual Clauses register)
<!-- SCC_VENDORS_phase5_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | DPO + Legal Lead + Senior Compliance Auditor + CISO | ★ Initial — closes F-S11-03 LOW (AUDIT_REVYX_s11-external-pass v1.0.0 §4) · register central pentru toate Standard Contractual Clauses (SCC) ale procesoarelor US-based + non-EU implicate în Phase 5 (Apple FCM, Google FCM/Push, Cloudflare, AWS eu-west-1, Stripe) · pre-flight gating Stage 1 (Mobile TestFlight) entry per `READINESS_REVYX_phase5` §0.14 · cross-ref `DPIA_REVYX_phase5` v1.0.0 §3.1 Art. 44+ și §6.2 |

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
| Stage 3 — ML Pricing CANARY | Cloudflare (edge worker pentru tenant white-label nu e activ stage 3, dar AWS eu-west-1 procesare features) | §3.3 + §3.4 verde |
| Stage 4 — Churn pilot | Cloudflare + AWS (idem) | §3.3 + §3.4 verde |
| Stage 5 — White-Label first Enterprise | Cloudflare (HMAC edge worker activ) + DKIM provider (Cloudflare/Route53) | §3.3 verde + DKIM provider per `RUNBOOK_REVYX_dkim-rotation` §5 |

> **Regula:** niciun stage nu poate intra (Entry gate ❌) dacă **un singur** SCC obligatoriu pentru acel stage e listat 🔴 sau ⏳ EXPIRED în acest register.

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
| Data semnare | _____________ (planned: pre-Stage 1 entry T-7) |
| Data expirare / re-review | T+12 luni de la semnare |
| Audit firm verification | n/a (Apple e self-assessed prin SOC 2 Type II + ISO 27001 certificate disponibil) |
| Status @ S13 | 🔴 **PENDING SIGNATURE** — necesar pre-Stage 1 entry T-7 |
| Owner negotiate | Mobile Lead + Legal Lead |
| Owner sign-off | DPO |
| File location | `legal-vault/contracts/scc/apple-apns/2026-05/SCC_apple_module3_signed.pdf` (target) |

**Fallback dacă SCC nu e semnat la T-7:** defer Stage 1 cu 1 săpt + escalation Mobile Lead → CTO. Niciun fallback tehnic acceptabil (Expo Push e deja Apple sub-processed; nu există alternativă fără SCC).

### 3.2 Google — FCM (Firebase Cloud Messaging) + Google Push

| Câmp | Valoare |
|---|---|
| Vendor legal entity | Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Irlanda) |
| Sub-processor pentru | Android push notifications (FCM) + (opțional) Cross-device delivery |
| Jurisdicție data processing | Multi-region cu primary US (`us-central1`); EU residency option negociat (`europe-west1`) |
| Tip date procesate | `fcm_token_hash` (SHA-256), payload `{"data": {...}}` minim conform `mobile-rn` §12.3 |
| Mecanism transfer | **SCC Modul 3 (Processor → Sub-processor)** + Google Cloud DPA v.2024 cu addendum FCM + Anexa SCC standard (2021/914) |
| Data semnare | _____________ (planned: pre-Stage 1 entry T-7) |
| Data expirare / re-review | T+12 luni de la semnare |
| Audit firm verification | Google Cloud SOC 2 Type II + ISO 27001 + ISO 27018 (certificate links arhivate) |
| Status @ S13 | 🔴 **PENDING SIGNATURE** — necesar pre-Stage 1 entry T-7 |
| Owner negotiate | Mobile Lead + Legal Lead |
| Owner sign-off | DPO |
| File location | `legal-vault/contracts/scc/google-fcm/2026-05/SCC_google_module3_signed.pdf` (target) |

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
| Status @ S13 | 🟢 **ON FILE** (Cloudflare Master DPA semnat 2025-Q3 + addendum SCC 2021 update aplicat 2026-04) |
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
| Status @ S13 | 🟢 **ON FILE** |
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
| Status @ S13 | 🟢 **ON FILE** |
| Owner negotiate | Billing Lead + Legal Lead |
| Owner sign-off | DPO ✅ |
| File location | `legal-vault/contracts/scc/stripe/2026-04/SCC_stripe_module3_signed.pdf` ✅ |

### 3.6 BSI Group MD (Audit firm — Stage 5/GA gating extern)

| Câmp | Valoare |
|---|---|
| Vendor legal entity | BSI Group Moldova SRL (Chișinău, RM) |
| Procesează | Audit logs samples + risk register + incident records (read-only, time-boxed) pe durata audit firm engagement |
| Jurisdicție | RM (operator local) |
| Mecanism transfer | **n/a** (operator local; nu e cross-border) |
| DPA | În negociere (target sign-off pre-Stage 5 entry) |
| Status @ S13 | 🟡 **PENDING NEGOTIATION** — pre-Stage 5 (T+77) gating; out-of-scope Stage 1 entry |
| Owner | CTO + CISO |

---

## 4. Vendor SCC summary table (Stage 1 entry)

| # | Vendor | Mecanism | Data semnare | Status | Stage 1 blocker? |
|---|---|---|---|---|---|
| 1 | Apple APNS | SCC Modul 3 + DPA + PLA | _____________ | 🔴 PENDING | **DA** — gating Stage 1 entry |
| 2 | Google FCM | SCC Modul 3 + GCP DPA | _____________ | 🔴 PENDING | **DA** — gating Stage 1 entry |
| 3 | Cloudflare | SCC Modul 3 + EU DLS | 2026-04-15 | 🟢 ON FILE | NU (gating Stage 5) |
| 4 | AWS eu-west-1 | DPA (no-transfer) | 2026-03-10 | 🟢 ON FILE | NU (gating Stage 1+) |
| 5 | Stripe | SCC Modul 3 + EU DPA | 2026-04-22 | 🟢 ON FILE | NU (gating Stage 2) |
| 6 | BSI Group MD | DPA local | TBD | 🟡 PENDING | NU (gating Stage 5) |

**Concluzie pentru Stage 1 (Mobile TestFlight) entry:** **2 vendori critici (Apple APNS + Google FCM) blocheaza** entry până la signature. Plan operațional în §5.

---

## 5. Plan operațional pre-Stage 1 (T-14 → T-0)

| Zi | Pas | Owner | Output |
|---|---|---|---|
| T-14 | Solicitare Apple Enterprise Sales (Apple Account Manager) pentru SCC v.2024 customer-side draft | Mobile Lead | Email reply cu draft DPA (Apple side) |
| T-13 | Solicitare Google Cloud Account Manager pentru GCP DPA + FCM sub-addendum + SCC Module 3 customer copy | Mobile Lead | Email reply cu draft + Anexa SCC |
| T-12..T-9 | Legal review ambele draft-uri (Schrems II clause review + Anexa II measures) | Legal Lead + DPO | Markup PDF cu acceptance comments |
| T-9 | Semnare Apple SCC (DocuSign / iCloud Business agreement portal) | Mobile Lead → DPO | PDF semnat în `legal-vault/scc/apple-apns/2026-05/` |
| T-8 | Semnare Google SCC + DPA addendum (Google admin console signature flow) | Mobile Lead → DPO | PDF semnat în `legal-vault/scc/google-fcm/2026-05/` |
| T-7 | Pre-flight 3-eyes review (VP Product + CTO + Audit Lead) marchează §0.14 din `READINESS_REVYX_phase5` ☑ | Audit Lead | Sign-off în readiness matrix |
| T-7 | DPIA cross-ref update — `DPIA_REVYX_phase5` §6.2 trece Apple/Google de la `SCC + push payload zero PII (mitigat upstream)` la `SCC signed YYYY-MM-DD ★` | DPO | DPIA changelog patch (PATCH bump → v1.0.1 dacă semnatari agree) |
| T-6..T-1 | Internal smoke test cu test devices (5 iOS + 5 Android) — verificare push delivery + audit-log `MOBILE_PUSH_SENT` cu zero PII în payload | Mobile Lead + Senior QA | Snapshot tests E2E PASS |
| T-0 | Stage 1 entry (Mobile TestFlight build submit la Apple review) | Mobile Lead | App Store Connect "Waiting for review" |

---

## 6. Verificare pre-flight (checklist DPO)

DPO marchează **înainte** de a semna 3-eyes pre-flight (§0.14 din `READINESS_REVYX_phase5`):

- [ ] Apple SCC PDF prezent în `legal-vault/scc/apple-apns/<YYYY-MM>/` cu signature DPO + Apple counterparty
- [ ] Apple SCC Anexa I (Lista părți) completă: REVYX/ITPRO SYSTEM SRL + Apple Distribution International Limited
- [ ] Apple SCC Anexa II (Măsuri tehnice) acoperă: encryption in transit (TLS 1.3) + payload minimization (`mobile-rn` §12.3 ref) + access control + breach notification 72h
- [ ] Apple SCC Anexa III (Lista sub-processors) verificat: niciun sub-processor neaprobat
- [ ] Google SCC PDF prezent + Anexele I/II/III complete (idem)
- [ ] Cross-ref DPIA §6.2 actualizat cu data semnare (sau planuit patch v1.0.1)
- [ ] Cross-ref `READINESS_REVYX_phase5` §0.14 marcat 🟢 după dual signature
- [ ] AUDIT_LOG event manual `RBAC_PII_REGISTRY_DEPLOYED` — n/a aici, dar similar SCC tracking — adăugare opțională `LEGAL_VENDOR_SCC_SIGNED` (revisit la audit-log v2.0.0; cosmetic; NO-OP)
- [ ] T-7 sync DPO + Legal + Mobile Lead pe Slack #legal-rollout cu confirmation messag

---

## 7. Re-review trimestrial (T+90 cycle)

| Eveniment | Acțiune | Owner |
|---|---|---|
| Vendor schimbă sub-processor list | Re-evaluare risc + (dacă necesar) re-semnare addendum | DPO |
| Apple/Google publică versiune nouă SCC | Compare delta + sign update în 30 zile | Legal |
| Schrems III sau orice CJEU ruling cu impact | Imediat audit firm consultation + revisit gating | DPO + CISO |
| Vendor breach notification | INC declared (per `incident-response` §3) + freeze rollout până remediation | DPO + Security Lead |
| Anual: review complet register | Update toate `Data expirare / re-review` + Anexele | DPO + Legal |

Următorul review: **2026-08-10 (T+90 from this register init).**

---

## 8. Cross-references

- `DPIA_REVYX_phase5` v1.0.0 §3.1 (Art. 44+) + §6.2 (International transfers)
- `READINESS_REVYX_phase5` v1.0.x §0.14 (Pre-flight SCC vendor sign-off)
- `RUNBOOK_REVYX_stage1-mobile-launch` v1.0.0 §1 (Stage 1 entry pre-flight)
- `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §2 (Pre-flight master gate)
- `TECH_SPEC_REVYX_mobile-rn` v1.0.0 §12.3 (Push payload privacy — zero PII)
- `RUNBOOK_REVYX_dkim-rotation` v1.0.0 §5 (Cloudflare DNS provider — Stage 5)
- `AUDIT_REVYX_s11-external-pass` v1.0.0 §4 F-S11-03

---

## 9. Approval

| Aprobator | Rol | Sign-off |
|---|---|---|
| DPO | Privacy + GDPR Art. 44+ owner | ✅ |
| Legal Lead | Contract negotiation owner | ✅ |
| Senior Compliance Auditor | Cross-spec consistency | ✅ |
| CISO | Risk register cross-check | ✅ |
| Audit Lead | F-S11-03 closure verification | ✅ |

---

*docs/legal/SCC_VENDORS_phase5_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
