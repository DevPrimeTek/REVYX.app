# BRD — REVYX Agent Operating System
<!-- BRD_REVYX_v1.1.0.md · v1.1.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2025-04 | Senior PM | Document inițial — sinteză din Spec v1.1 + BrandBook v2.2 + Workflow v3 |
| 1.1.0 | 2026-05 | Senior PM + Solution Architect + Product Auditor | ★ Closes F-09 MED (AUDIT_REVYX_s8-external-pass v1.0.0) — additive only, zero breaking change pe BR-01..BR-12 · §6.4 Pilon Retention adăugat (referință `churn-ga` v1.0.0 + KPI Prevention Rate ≥30%) · §4 Entitate BUYER_PROFILE adăugată ★ (sursă `marketplace-two-sided` v1.0.1) · §10 reorganizat în §10.1 RBAC (neschimbat) + §10.2 White-Label as Enterprise feature ★ + §10.3 Mobile surface ★ |

---

> **Backwards compat (v1.0.0 → v1.1.0):** Toate cerințele BR-01..BR-12, NFR-01..NFR-11, formulele scoring §7.1–7.8, edge cases T01–T07 din v1.0.0 rămân **neschimbate**. v1.1.0 doar **adaugă** un al 8-lea pilon (Retention), o entitate suplimentară (`BUYER_PROFILE`) și sub-secțiuni descriptive pentru white-label și mobile (Phase 3+). Anchor-urile §1–§16 sunt păstrate; nicio cerință v1.0.0 nu e modificată sau ștersă.

---

## Cuprins

1. [Executive Summary](#1-executive-summary)
2. [Context & Problemă de Business](#2-context--problemă-de-business)
3. [Obiective de Business](#3-obiective-de-business)
4. [Stakeholders & Actori](#4-stakeholders--actori)
5. [Perimetrul Soluției — 7 Piloni Funcționali](#5-perimetrul-soluției--7-piloni-funcționali)
6. [Cerințe de Business Cheie](#6-cerințe-de-business-cheie)
7. [Sistemul de Scoring AI — 8 Formule](#7-sistemul-de-scoring-ai--8-formule)
8. [Data Model — 9 Entități + 1 ★](#8-data-model)
9. [Securitate & Conformitate](#9-securitate--conformitate)
10. [RBAC, White-Label & Mobile Surfaces](#10-rbac-white-label--mobile-surfaces)
11. [Roadmap — 4 Faze](#11-roadmap--4-faze)
12. [Acceptance Criteria Esențiale](#12-acceptance-criteria-esențiale)
13. [KPI & Metrici de Succes](#13-kpi--metrici-de-succes)
14. [Constrângeri & Dependențe](#14-constrângeri--dependențe)
15. [Glosar](#15-glosar)
16. [Aprobare](#16-aprobare)

---

## 1. Executive Summary

**REVYX** este un **Agent Operating System (AOS)** pentru agenți imobiliari — nu un CRM clasic. Automatizează și controlează întregul ciclu de viață al unei tranzacții imobiliare prin intermediul unui AI layer nativ.

| Atribut | Detaliu |
|---|---|
| **Produs** | REVYX — Real Estate Execution Intelligence |
| **Companie** | ITPRO SYSTEM SRL |
| **Versiune spec bază** | Spec Consolidată v1.1 (Post Hard Stress Test — 47 gap-uri integrate) + S8 Phase 5 maturity |
| **Piața primară** | Republica Moldova |
| **Status** | CRITIC — Ajustări obligatorii înainte de dev (Phase 0 blocantă); S8 deliverables în maturare |
| **Echipa** | Senior PM · Solution Architect · Senior Product Designer · QA × 2 |

### Diferențiatori principali

REVYX nu este un CRM — este un sistem de operare pentru agenți care:

- **Controlează complet pipeline-ul tranzacțional** de la primul contact până la predarea cheilor
- **AI Layer nativ** — scoring, matching și next-best-action în timp real
- **Property Showcase Links** — fiecare proprietate generează un link public unic, personalizat
- **Lead Firewall cu Manager Override** — doar lead-uri calificate ajung la agenți, protejând timpul lor
- **Max 3 task-uri active per agent** — focus și execuție optimizată
- **Escalation Protocol 3 niveluri** — niciun lead HOT nu rămâne nealocat
- **GDPR-compliant by design** — consimțământ, retenție automată, drept la ștergere
- ★ **Two-Sided Marketplace** — buyer profiles publice cu contact-grant flow (`marketplace-two-sided` v1.0.1)
- ★ **Retention Intelligence** — churn prevention proactiv prin CS playbook (`churn-ga` v1.0.0)
- ★ **White-Label** — branding tenant-specific pe domeniu propriu (Enterprise plan-tier)
- ★ **Mobile-first** — iOS + Android native cu push notifications și offline support

---

## 2. Context & Problemă de Business

(Identic cu v1.0.0 §2 — piața RM, probleme identificate, fluxuri As-Is / To-Be.)

---

## 3. Obiective de Business

(Identic cu v1.0.0 §3, plus:)

| # | Obiectiv | Indicator de succes | Fază |
|---|---|---|---|
| ★ OB-08 | Reducerea churn-ului tenant | Prevention rate ≥ 30% MEDIUM+ flagged | Phase 5 |
| ★ OB-09 | Activare segment buyer cumpărător (marketplace) | ≥ 1.000 buyer profiles publicate la 6 luni post-launch | Phase 5 |
| ★ OB-10 | Adopție mobile (iOS+Android) | ≥ 60% agenți activi cu app instalată DAU | Phase 3 |

---

## 4. Stakeholders & Actori

### 4.1 Actori interni (sistem)

(Identic cu v1.0.0 §4.1, plus:)

| Actor | Rol | Interes principal |
|---|---|---|
| ★ **Customer Success User** (`cs_user`) | Outreach retention + outcome capture | Queue clar · script playbook · feedback loop |
| ★ **Customer Success Lead** (`cs_lead`) | Supervizare CS + KPI | Dashboard prevention rate · reassignment · pause |
| ★ **Data Science Lead** | Promovare + monitoring modele ML | A/B gates · drift alerts · 4-eyes governance |
| ★ **Tenant Admin** (Enterprise) | Configurare brand + domeniu | White-label settings · DKIM · plan tier visibility |
| ★ **Compliance Auditor** (extern, time-boxed) | Audit ISO 27001 / GDPR | Read-only AUDIT_LOG (ISO/INC/DR_TEST) fără PII unmask |

### 4.2 Actori externi (workflow tranzacție)

(Identic cu v1.0.0 §4.2, plus:)

| Actor | Rol în tranzacție |
|---|---|
| ★ 🛒 **Buyer self-service (cumpărător marketplace)** | Lead public limitat — își creează `BUYER_PROFILE` și gestionează contact-grants |

---

## 5. Perimetrul Soluției — 7 Piloni Funcționali

(Identic cu v1.0.0 §5 — Pilon 01 Lead Intelligence, Pilon 02 Supply Intelligence, Pilon 03 Match Intelligence, Pilon 04 Execution Intelligence, Pilon 05 Negotiation Intelligence, Pilon 06 Deal Intelligence, Pilon 07 Performance Intelligence.)

> **Notă v1.1.0:** Cei 7 piloni rămân baseline-ul AOS. Pilon Retention (§6.4) este o **extensie operațională** — nu un al 8-lea pilon de produs core, ci un layer transversal de governance retention bazat pe scoring extern (`churn-ga`).

---

## 6. Cerințe de Business Cheie

### 6.1 Cerințe Funcționale Critice

(Identic cu v1.0.0 §6.1 — BR-01..BR-12 neschimbate.)

### 6.2 Cerințe Non-Funcționale

(Identic cu v1.0.0 §6.2 — NFR-01..NFR-11 neschimbate.)

### 6.3 WhatsApp Templates obligatorii (5)

(Identic cu v1.0.0 §6.3.)

### 6.4 ★ Pilon Retention (extensie S8 — F-09 closed)

> **Sursă canonical:** `TECH_SPEC_REVYX_churn-ga` v1.0.0+ (Phase 5 maturity). Această secțiune referențiază și sumarizează — formula completă, pipeline-ul ML și CS playbook-urile rămân în spec-ul tehnic.

**Scop:** Detecție proactivă a riscului de churn la nivel tenant (agency) și agent, cu intervenție Customer Success structurată pentru a maximiza retention rate. Layer transversal peste pilonii 01–07.

#### 6.4.1 Cerințe funcționale Retention

| ID | Cerință | Prioritate |
|---|---|---|
| ★ BR-13 | Churn score calculat săptămânal pentru fiecare tenant + agent activ; recompute la `subscription.changed` sau `usage.spike` | RIDICAT |
| ★ BR-14 | Risk band ∈ {LOW, MEDIUM, HIGH, CRITICAL} cu praguri `prob30d`: <0.20 / 0.20–0.45 / 0.45–0.70 / ≥0.70 | RIDICAT |
| ★ BR-15 | Fiecare semnalare MEDIUM+ generează un `churn_cs_task` cu SLA: CRITICAL 24h · HIGH 72h · MEDIUM 168h | RIDICAT |
| ★ BR-16 | Decizia churn este **suport** pentru CS — niciun decizionalism automat (Art. 22 GDPR) — întotdeauna human-in-the-loop | CRITIC |
| ★ BR-17 | Outcome verificat la 90 zile post-flag (auto-job) → KPI prevention rate calculat strict pe `outcome=RETAINED` | RIDICAT |
| ★ BR-18 | Churn score-ul **nu** este partajat cu agentul subiect — comunicare CS doar la nivel "risc retentie" în conversație | CRITIC |

#### 6.4.2 KPI Prevention Rate (target ≥30%)

```
PreventionRate = retained_90d / flagged_medium_plus
Target: ≥ 30%
Fereastră: rolling 90 zile, cohort flagged la T-90d (verificat la T)
Min cohort size: 30 (altfel KPI nu emit alert)
Alert: PreventionRate < 0.30 cu cohort ≥ 30 → HIGH (Slack #exec-kpi)
```

#### 6.4.3 Roluri Customer Success

Vezi §10.1 RBAC pentru permisiunile `cs_user`, `cs_lead`, `data_science_lead` (matricea consolidată în `tenancy-roles-extension` v1.1.0 §4.9).

---

## 7. Sistemul de Scoring AI — 8 Formule

(Identic cu v1.0.0 §7.1–7.8 — LS, PS, IS, DP, NBA, TS, APS, DHI neschimbate.)

> **Notă v1.1.0:** `churn_score` (Pilon Retention §6.4) este un scor **operațional** la nivel tenant/agent — distinct de cele 8 formule de produs și **nu se integrează** în formulele DP/DHI. Excepția de scală NBA ∈ [0, 2.0] rămâne unica excepție; toate scorurile produs (LS, PS, IS, DP, TS, APS, DHI) și scorul retention (`churn_score.prob_30d/60d`) sunt ∈ [0,1].

---

## 8. Data Model

### 8.1 Entități originale (5) — extinse

(Identic cu v1.0.0 §8 — LEAD, PROPERTY, DEAL, AGENT, TASK.)

### 8.2 Entități noi (4) ★ — obligatorii Phase 1–2

(Identic cu v1.0.0 §8 — SHOWING, OFFER, ACTIVITY, AUDIT_LOG.)

### 8.3 ★ Entitate Phase 5 — BUYER_PROFILE (1)

> **Sursă canonical:** `TECH_SPEC_REVYX_marketplace-two-sided` v1.0.1. Această secțiune sumarizează contractul BRD-level.

`BUYER_PROFILE` reprezintă un profil public limitat creat de un cumpărător prin self-service în segmentul MARKETPLACE. Permite tooling agent (inverse matching: agent → buyer relevant) cu protecția PII prin contact-grant flow (buyerul aprobă explicit divulgarea contactelor).

| Câmp | Tip | Specificație |
|---|---|---|
| buyer_profile_id | UUID PK | Primary key |
| user_id | UUID FK | FK → USER cu rol `buyer` (sau LEAD upgraded) |
| tenant_id | UUID FK | Tenant MARKETPLACE |
| intent | Enum | buy_residential / buy_commercial / rent / invest |
| budget_band | Enum | <50k / 50–100k / 100–200k / 200–500k / 500k+ EUR |
| location_preferences | JSONB | districts + zone codes |
| property_type_preferences | TEXT[] | apartment / house / land / commercial |
| size_min_m2 / size_max_m2 | Int nullable | Range suprafață |
| status | Enum | DRAFT / PUBLISHED / PAUSED / REVOKED / EXPIRED |
| visibility | Enum | PUBLIC_LIMITED / AGENT_ONLY |
| billing_tier | Enum nullable | FREE / PROMOTED |
| gdpr_consent_at | Timestamp | Art. 7 |
| gdpr_consent_version | TEXT | Versiune politică |
| data_retention_expires_at | Timestamp | Default NOW + 12 luni inactivitate |
| created_at / updated_at | Timestamp | Audit temporal |
| last_active_at | Timestamp | Pentru auto-EXPIRE |

**Relația cu LEAD:** un `BUYER_PROFILE` poate fi creat:
- self-service de un buyer (rol `buyer` per `tenancy-roles-extension` v1.1.0 §4.6),
- prin upgrade dintr-un `LEAD` existent cu consimțământ explicit (cumpărătorul devine self-managed).

**Contact-grant flow:** agentul trimite `BUYER_CONTACT_REQUEST`; buyerul aprobă/refuză via `BUYER_CONTACT_GRANT_APPROVED/DENIED`; revealed PII e log-uit ca `BUYER_PII_REVEALED` (audit-log v1.1.0 §4.4.2 — severity HIGH cu Slack alert).

**Status machine:** DRAFT → PUBLISHED → (PAUSED ↔ PUBLISHED) → REVOKED | EXPIRED.

### 8.4 ★ Total entități v1.1.0

Entități canonice BRD: **5 originale + 4 noi v1.0.0 + 1 nouă v1.1.0 = 10 entități**. Pentru schema completă consultă spec-urile tehnice respective.

---

## 9. Securitate & Conformitate

(Identic cu v1.0.0 §9.1–9.6.)

### 9.7 ★ Extensii v1.1.0

| Aspect | Status |
|---|---|
| **AUDIT_LOG catalog Phase 5** | Consolidate în `audit-log` v1.1.0 §4.4 (75 events noi: PRICING_MODEL_*, BUYER_*, WL_*, MOBILE_*, AUTH_MOBILE_*, CHURN_*, ISO_*, INC_*, DR_TEST_*) |
| **RBAC matrice consolidată** | Vezi `tenancy-roles-extension` v1.1.0 §4.9 |
| **Compliance auditor (time-boxed)** | Procedură provisioning în `tenancy-roles-extension` v1.1.0 §12.3 |
| **GDPR Art. 22 — Profilare automată** | Reconfirmat: niciun decizionalism automat în churn (BR-16) sau pricing ML (4-eyes admin pentru promote GA) |
| **DPIA** | Anexă la `iso27001-track` v1.0.0 — risk register actualizat |

---

## 10. RBAC, White-Label & Mobile Surfaces

> **Notă structurală v1.1.0:** Secțiunea §10 din v1.0.0 (RBAC — 5 Roluri) este păstrată integral ca §10.1 mai jos. Sub-secțiunile §10.2 (White-Label) și §10.3 (Mobile) sunt **adăugări noi** ★, conform F-09 și brief S10.

### 10.1 RBAC — 5 Roluri (system) + 6 Phase 5 (custom)

Permisiuni aditive pe lanțul system. Custom roles (Phase 5) descriu domenii operaționale specifice.

#### 10.1.1 System roles (5) — neschimbat v1.0.0

| Permisiune | agent | senior_agent | team_lead | manager | admin |
|---|:---:|:---:|:---:|:---:|:---:|
| Leads & Deals proprii | ✅ | ✅ | ✅ | ✅ | ✅ |
| Override lead priority | ❌ | ✅ | ✅ | ✅ | ✅ |
| Lead Firewall Manager Override | ❌ | ❌ | ❌ | ✅ | ✅ |
| Toate deal-urile echipei | ❌ | ❌ | Echipa sa | ✅ | ✅ |
| AUDIT_LOG access | ❌ | ❌ | ❌ | Read-only | Full |
| GDPR Tools & Export | ❌ | ❌ | ❌ | Export | Full |
| Config sistem & Scoring weights | ❌ | ❌ | ❌ | ❌ | ✅ |

#### 10.1.2 ★ Custom roles Phase 5 (6) — referință

| Rol | Sursă spec | Esență |
|---|---|---|
| `data_science_lead` | `ml-pricing-ga` v1.0.0+ §12 · `churn-ga` v1.0.0+ §12.1 | Register/promote modele ML până la CANARY(25%); GA necesită 4-eyes admin |
| `cs_user` | `churn-ga` v1.0.0+ §12.1 | CS task ops queue propriu + outcome record |
| `cs_lead` | `churn-ga` v1.0.0+ §12.1 | Reassign + pause task gen + dashboard tenant-wide |
| `compliance_auditor` | `iso27001-track` v1.0.0 §17.2 | Time-boxed (max 90 zile) read-only ISO/INC/DR_TEST events fără PII unmask |
| `buyer` | `marketplace-two-sided` v1.0.1 §5 | Self-service buyer_profile own only (public limited) |
| `tenant_admin` | `white-label` v1.0.1 §6 | White-label config + tenant settings (Enterprise plan-tier obligatoriu) |

> **Matricea completă** RBAC (system + custom) este în `tenancy-roles-extension` v1.1.0 §4.9 (single source of truth).

### 10.2 ★ White-Label as Enterprise Feature

> **Sursă canonical:** `TECH_SPEC_REVYX_white-label` v1.0.1 (după F-01 fix).

White-label permite tenant-ilor de tier `ENTERPRISE` să servească aplicația REVYX sub propriul domeniu și brand:

- **Domain custom**: CNAME tenant.example.com → revyx-edge cu HMAC-signed headers (`X-REVYX-Tenant-Id` + `X-REVYX-Tenant-Ts`, skew ±120s) per F-01 fix.
- **TLS automat**: Let's Encrypt provision + renew (alerting `WL_TLS_FAILED` la retry≥3).
- **Branding**: logo, paletă culori (validate WCAG AA contrast), font (whitelist), copy email templates per locale.
- **Email DKIM**: DKIM selector tenant-specific cu rotation calendar `rvxYYYYMMDD` (gating S10+ per audit out-of-scope).
- **Plan-tier gating**: rolul `tenant_admin` și endpoint-urile WL refuză acces dacă `plan.tier ≠ ENTERPRISE` (HTTP 403 `WL_PLAN_TIER_INSUFFICIENT`).

#### 10.2.1 Cerințe funcționale White-Label

| ID | Cerință | Prioritate |
|---|---|---|
| ★ BR-19 | Tenant cu `plan_tier=ENTERPRISE` poate revendica un domeniu custom; verificare CNAME + TLS provision automat | RIDICAT |
| ★ BR-20 | Plan downgrade (ENTERPRISE → BUSINESS sau mai jos) auto-revocă rolurile `tenant_admin` (cron `tenant_plan_downgrade_audit`) și suspendă domeniul custom | CRITIC |
| ★ BR-21 | Toate config updates white-label generează `WL_CONFIG_UPDATED` în AUDIT_LOG (audit-log v1.1.0 §4.4.3) | RIDICAT |

### 10.3 ★ Mobile Surface (iOS + Android)

> **Sursă canonical:** `TECH_SPEC_REVYX_mobile-rn` v1.0.0.

REVYX expune un client nativ React Native pentru iOS și Android, cu suport offline pentru pipeline core (lead queue, task list, deal detail, showing scheduling):

- **Auth mobile**: One-Time-Token flow (`AUTH_MOBILE_OT_*` events) + biometric unlock secondary; refresh token ≤7 zile cu rotație (NFR-09 reutilizat).
- **Push notifications**: APNS (iOS) + FCM (Android); zero PII în payload (validat prin `@revyx/test-fixtures-pii` — vezi `PII_REDACTION_FIXTURES` v1.0.0).
- **Offline support**: cache local SQLite cu sync optimist + conflict resolution server-side (BRD §9.5 optimistic locking).
- **App version gating**: `MOBILE_VERSION_UNSUPPORTED` (HTTP 426) când client < `min_supported`; force upgrade flow.
- **Device management**: register/revoke per `MOBILE_DEVICE_*` events; revoke `reason='COMPROMISED'` triggers Slack #security-watch alert.

#### 10.3.1 Cerințe funcționale Mobile

| ID | Cerință | Prioritate |
|---|---|---|
| ★ BR-22 | Push notification payload **fără PII**; agent name doar prin lookup post-token | CRITIC |
| ★ BR-23 | Push receipt failed rate >5%/5min → counter alert (telemetry, not PagerDuty) | MEDIU |
| ★ BR-24 | Device revoke cu `reason=COMPROMISED` forțează logout toate sesiunile user (BR-12 analog) | CRITIC |

---

## 11. Roadmap — 4 Faze

(Identic cu v1.0.0 §11. Phase 3+ extins implicit cu items din §10.2/10.3 deja prezenți la "Mobile App iOS/Android".)

### 11.5 ★ Phase 5 — Maturity (S8+ deliverables)

- ML Pricing GA (graduate la 100% trafic, A/B governance, model card, drift monitoring)
- Churn Model GA + CS Playbook + KPI prevention rate ≥30%
- Marketplace two-sided (buyer profiles + contact grants)
- White-Label (domain + TLS + branding + DKIM)
- Mobile RN (iOS + Android cu offline + push)
- ISO 27001 track (gap analysis → certificare 12-18 luni)

---

## 12. Acceptance Criteria Esențiale

(Identic cu v1.0.0 §12 — AC-LF, AC-LS, AC-SL, AC-DHI, edge cases T01–T07 neschimbate.)

### 12.6 ★ Acceptance Criteria Phase 5 (Retention)

| ID | Criteriu |
|---|---|
| ★ AC-CHURN-01 | Tenant cu `prob_30d ≥ 0.45` → `churn_cs_task` deschis în ≤5 min de la score compute |
| ★ AC-CHURN-02 | CS task CRITICAL → escalare `cs_lead` în 4h dacă status=OPEN |
| ★ AC-CHURN-03 | Outcome `PREVENTED` la T → re-verificat la T+90d → `RETAINED` doar dacă subscripția încă activă |
| ★ AC-CHURN-04 | Prevention rate < 0.30 cu cohort ≥30 → alert HIGH Slack #exec-kpi |
| ★ AC-CHURN-05 | Churn score nu este partajat cu agentul subiect (BR-18 verificat în UI agent) |

### 12.7 ★ Acceptance Criteria Phase 5 (Marketplace)

| ID | Criteriu |
|---|---|
| ★ AC-BUYER-01 | Buyer self-service publish profile → `BUYER_PROFILE_PUBLISHED` event în AUDIT_LOG |
| ★ AC-BUYER-02 | Agent contact request → buyerul primește notificare; aprobat/refuzat în ≤72h sau auto-DENIED |
| ★ AC-BUYER-03 | PII reveal după approval log-at ca `BUYER_PII_REVEALED` (HIGH severity) |

### 12.8 ★ Acceptance Criteria Phase 5 (White-Label)

| ID | Criteriu |
|---|---|
| ★ AC-WL-01 | Plan downgrade ENTERPRISE→BUSINESS → cron auto-suspend domeniu custom în max 24h |
| ★ AC-WL-02 | TLS renewal failure 3× → alert HIGH on-call |
| ★ AC-WL-03 | Edge HMAC verify cu skew >±120s → reject + log `WL_HEADER_SIG_INVALID` |

---

## 13. KPI & Metrici de Succes

(Identic cu v1.0.0 §13, plus:)

| KPI | Baseline | Țintă | Fază |
|---|---|---|---|
| ★ Churn Prevention Rate | N/A | ≥ 30% | Phase 5 |
| ★ Adopție Mobile DAU | N/A | ≥ 60% agenți activi | Phase 3 |
| ★ Buyer profiles publicate | 0 | ≥ 1.000 la 6 luni | Phase 5 |
| ★ ML Pricing MAE post-GA | N/A | < 10% degradare vs baseline locked | Phase 5 |

---

## 14. Constrângeri & Dependențe

(Identic cu v1.0.0 §14, plus:)

### 14.4 ★ Dependențe externe Phase 5

| Dependență | Detaliu | Timp estimat |
|---|---|---|
| Apple Developer Account | iOS distribution + APNS | 1-2 săpt |
| Google Play Console | Android + FCM | 1 săpt |
| Stripe (subscriptions multi-tier) | Plan-tier gating + downgrade webhooks | Pre-pilot |
| Let's Encrypt + DNS provider | TLS provision + DKIM rotation | Phase 3 |
| ISO 27001 audit firm | Stage 1 + Stage 2 | M+12-18 |

---

## 15. Glosar

(Identic cu v1.0.0 §15, plus:)

| Termen EN | Termen RO | Definiție |
|---|---|---|
| ★ Churn Score | Scor Churn | Probabilitate renunțare subscripție tenant/agent în 30/60 zile [0,1] |
| ★ Prevention Rate | Rată Prevenție Churn | retained_90d / flagged_medium_plus · target ≥30% |
| ★ Buyer Profile | Profil Cumpărător | Entitate self-service în MARKETPLACE cu contact-grant flow |
| ★ White-Label | Etichetă Albă | Branding tenant-specific pe domeniu propriu (Enterprise) |
| ★ DKIM | DomainKeys Identified Mail | Selector rvxYYYYMMDD per tenant |
| ★ OT (One-Time-Token) | Token Unic | Auth flow mobile primary |

---

## 16. Aprobare

| Rol | Responsabilitate | Semnătură | Data |
|---|---|---|---|
| Senior PM | Validare business logic & roadmap (v1.0.0 + v1.1.0 deltas) | ___________________________ | Mai 2026 |
| Solution Architect | Validare data model + entitate BUYER_PROFILE + cross-spec | ___________________________ | Mai 2026 |
| Senior Product Designer | Validare UX & Showcase + mobile surface | ___________________________ | Mai 2026 |
| Senior Automation Tester | Validare AC & edge cases (Phase 5 incluse) | ___________________________ | Mai 2026 |
| Manual Tester | Validare fluxuri complete | ___________________________ | Mai 2026 |
| ★ Customer Success Lead | Validare Pilon Retention §6.4 + KPI | ___________________________ | Mai 2026 |
| ★ Data Science Lead | Validare scoring churn + ML governance | ___________________________ | Mai 2026 |

---

*BRD_REVYX_v1.1.0.md · v1.1.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
