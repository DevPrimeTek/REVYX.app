# BRD — REVYX Agent Operating System
<!-- BRD_REVYX_v1.3.0.md · v1.3.0 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2025-04 | Senior PM | Document inițial — sinteză din Spec v1.1 + BrandBook v2.2 + Workflow v3 |
| 1.1.0 | 2026-05 | Senior PM + Solution Architect + Product Auditor | ★ Closes F-09 MED — additive only, zero breaking change pe BR-01..BR-12 · §6.4 Pilon Retention adăugat · §4 Entitate BUYER_PROFILE adăugată ★ · §10 reorganizat cu §10.2 White-Label + §10.3 Mobile ★ |
| 1.2.0 | 2026-06 | Senior PM + Senior BA + DBA | MINOR — §17 Specificații piață Republica Moldova [MOLDOVA-SPECIFIC]: §17.1 buget declarat vs confirmat (15-25% divergență) · §17.2 tipuri întâlnire calificare (on_site auto-SHOWING) · §17.3 pre-aprobare bancară RM · §17.4 evoluție preferințe post-vizionare 90% · §17.5 mandat exclusivitate sellers · §17.6 property_class RM enum. Zero modificare §1-§16. |
| **1.3.0** | **2026-06** | ★ Senior PM + Solution Architect + Senior BA + Senior Product Auditor | ★ **MINOR — §18 Agent Growth Intelligence (AGI Layer).** Analiza bibliografiei profesionale (Carnegie/Hill/Beckwith/Maister/Gitomer/Fox/Lukic/Blanchard+Peale/Yamaguchi + NAR Code of Ethics) vs framework REVYX a identificat 7 gap-uri cu impact HIGH/MEDIUM. Adăugări additive — zero breaking change pe BR-01..BR-24, §7 formule scoring, §8 entități existente: (1) **§6.1 extensii BR-25..BR-28** (Financial Readiness qualifier RM / Promise Keeping Index / Client Alumni la deal CÂȘTIGAT / Ethics Checkpoint human-in-the-loop). (2) **§7 extensie IS sub-dimensions + TS rework** — IS priměşte 3 sub-dimensiuni calitative; TS primeşte `promise_keeping_index` component. (3) **§8.5 Entități AGI noi (4)**: `execution_guides` · `client_alumni` · `agent_goals` · `ethics_checkpoints`. (4) **§13 KPI noi** Agent Growth Intelligence. (5) **★ §18 Agent Growth Intelligence** — spec completă a celor 7 gap-uri AGI-01..AGI-07 cu mapping pe layer framework + faze de implementare M1.S3-M1.S6. Zero modificare §1-§17 existente (formule scoring BRD §7 + BR-01..BR-24 + entități existente + RBAC + MOLDOVA-SPECIFIC §17 INTACTE). |

---

> **Backwards compat (v1.0.0 → v1.1.0):** Toate cerințele BR-01..BR-12, NFR-01..NFR-11, formulele scoring §7.1–7.8, edge cases T01–T07 din v1.0.0 rămân **neschimbate**. v1.1.0 doar **adaugă** un al 8-lea pilon (Retention), o entitate suplimentară (`BUYER_PROFILE`) și sub-secțiuni descriptive pentru white-label și mobile (Phase 3+). Anchor-urile §1–§16 sunt păstrate; nicio cerință v1.0.0 nu e modificată sau ștersă.
>
> **Backwards compat (v1.1.0 → v1.2.0):** ★ Secțiunea §17 (Specificații piață Republica Moldova) este **pur aditivă** — zero modificări la BR-01..BR-12, formule scoring §7, entități §8, RBAC §10, roadmap §11. §17 documentează specificul de piață RM cu implicații tehnice pentru câmpuri schema viitoare (declared_budget, confirmed_budget, meeting_location_type, property_class, preference_history, mandate_status) — toate planificate M1.S3+ entry. §1–§16 neschimbate structural.

---

## Cuprins

1. [Executive Summary](#1-executive-summary)
2. [Context & Problemă de Business](#2-context--problemă-de-business)
3. [Obiective de Business](#3-obiective-de-business)
4. [Stakeholders & Actori](#4-stakeholders--actori)
5. [Perimetrul Soluției — 8 Piloni Funcționali](#5-perimetrul-soluției--8-piloni-funcționali)
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
17. [★ Specificații piață Republica Moldova](#17-specificații-piață-republica-moldova-moldova-specific)
18. [★ Agent Growth Intelligence — AGI Layer](#18-agent-growth-intelligence--agi-layer)

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

## 5. Perimetrul Soluției — ★ 8 Piloni Funcționali

| # | Pilon | Motor de scoring | Descriere scurtă |
|---|---|---|---|
| 01 | **Lead Intelligence** | LS [0,1] | Calificarea și prioritizarea automată a lead-urilor la intake. Firewall BR-01: LS ≥ 0.60. |
| 02 | **Supply Intelligence** | PS [0,1] | Evaluarea calității și relevanței proprietăților. Listing Freshness LF inclusă. |
| 03 | **Match Intelligence** | IS [0,1] | Potrivire lead ↔ proprietate. ★ v1.3.0: IS cu 3 sub-dimensiuni (frecvență · calitate · reciprocitate). |
| 04 | **Execution Intelligence** | NBA [0, 2.0] | Acțiunea optimă recomandată în timp real. Singura excepție de scală. ★ v1.3.0: Ghiduri de execuție per tip NBA. |
| 05 | **Negotiation Intelligence** | DP [0,1] | Probabilitatea de închidere a unui deal la momentul curent. |
| 06 | **Deal Intelligence** | DHI [0,1] | Sănătatea continuă a pipeline-ului: TF · UF · RF. Re-matching trigger (BR-05). |
| 07 | **Performance Intelligence** | APS [0,1] | Scorul de performanță al agentului. Baza alocării merit-based. BR-11: APS_default 0.65. |
| 08 | ★ **Trust Intelligence** | TS [0,1] + PKI | Încrederea clientului în agent. ★ v1.3.0: extins cu PKI (Promise Keeping Index, BR-26). Target ≥ 0.75. |

> **★ Arhitectură 2-nivel (clarificat v1.3.0):**
> - **Nivel 1 — 8 Piloni de execuție** (acest tabel): motoare de scoring automat, fiecare mapat 1:1 cu o formulă din §7. Decid în timp real: ce lead e prioritar, ce proprietate se potrivește, ce acțiune urmează, cât de sănătos e un deal.
> - **Nivel 2 — AGI Layer (§18)**: strat transversal de dezvoltare agent. Nu produce un scor propriu — **consumă scorurile** tuturor celor 8 piloni și le transformă în obiective, ghiduri practice, indicatori de credibilitate și relații pe termen lung cu clienții. Mentorul sistemului, nu un al 9-lea motor.
>
> Mapping complet: §5 ↔ §7 — 8 piloni ↔ 8 formule (LS / PS / IS / DP / NBA / TS / APS / DHI). AGI Layer ↔ §18.

---

## 6. Cerințe de Business Cheie

### 6.1 Cerințe Funcționale Critice

(Identic cu v1.0.0 §6.1 — BR-01..BR-12 neschimbate.)

### ★ 6.5 AGI Layer — Cerințe Business (v1.3.0)

> **Sursă:** Analiza bibliografică profesională (Carnegie/Hill/Beckwith/Maister/Gitomer/Fox/Lukic/Blanchard+Peale/Yamaguchi + NAR Code of Ethics) corelată cu gap analysis framework REVYX. Spec completă în §18.

| ID | Regulă | Sursă literară | Prioritate |
|---|---|---|---|
| ★ **BR-25** | **Financial Readiness qualifier [MOLDOVA-SPECIFIC]:** Dacă buyer lead cu `LS ≥ 0.60` AND `bank_preapproval_status = 'none'` AND `confirmed_budget_eur IS NULL` → NBA OBLIGATORIU include task `clarify_financing` ca task cu `priority = HIGH` înainte de orice `schedule_showing`. | Maister „True Professionalism" + BRD §17.3 piața RM | RIDICAT |
| ★ **BR-26** | **Promise Keeping Index (PKI):** `PKI = tasks_completed_by_committed_deadline / tasks_with_explicit_deadline` per agent, rolling 30 zile. PKI alimentează TS (Trust Score) cu weight ~0.15 (redistribuit din factori existenți TS). Agent cu PKI < 0.60 → NBA sugestie automată `review_commitments`. | Carnegie „How to Win Friends" + Maister „Do What You Preach" | RIDICAT |
| ★ **BR-27** | **Client Alumni la deal CÂȘTIGAT:** La tranziția `deal.status → CÂȘTIGAT`, sistemul creează automat un `client_alumni` entry cu `status = 'past_client'`. Lead-ul asociat trece în `status = 'alumni'` (NU deleted, NU nurturing). Cron-job `alumni_touchpoint_scheduler` generează reminder-uri la: T+12 luni, T+24 luni și la modificare semnificativă preț zonă (>5%). Niciun task activ creat automat — doar reminder pentru agent. | Yamaguchi „Calea Comerțului" + Carnegie relații pe termen lung | MEDIU |
| ★ **BR-28** | **Ethics Checkpoint — human-in-the-loop la decizii critice:** La 4 momente de risc etic identificate în fluxul agent, sistemul afișează un soft-prompt (non-blocant, informativ) cu checkbox acknowledgement logat în `ethics_checkpoints`. Nu blochează operația. Toate 4 trigger-uri enumerate în §18.4. GDPR Art. 22: niciun decizionalism automat. | NAR Code of Ethics + Blanchard „Fair Play" + Peale | MEDIU |

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

### ★ 7.9 Extensii AGI Layer — IS sub-dimensions + TS rework (v1.3.0)

> **Principiu:** Formulele IS și TS din §7 rămân **matematice identice ca structură**. AGI Layer adaugă **sub-componente calitative** ca input suplimentar, fără a modifica formulele existente. Fixtures T01-T07 rămân valide.

**IS (Interaction Strength) — extensie sub-dimensiuni:**

Formula IS existentă rămâne single source of truth. Sub-dimensiunile noi sunt **input-uri** în componenta `quality_weight` a IS (deja prezentă în formula — fără breaking change):

| Sub-dimensiune | Calcul | Alimentează |
|---|---|---|
| `follow_through_rate` | `tasks_with_commitment_completed / tasks_with_commitment` rolling 30d ∈ [0,1] | IS `quality_weight` component |
| `response_consistency` | `responses_within_promised_timeframe / total_responses_with_timeframe` rolling 30d ∈ [0,1] | IS `quality_weight` component |
| `client_satisfaction_signal` | Input voluntar agent sau client, 1-5 normalizat → [0,1]; NULL când absent (non-obligatoriu) | IS `quality_weight` component opțional |

**TS (Trust Score) — extensie `promise_keeping_index`:**

TS primeşte component nou `promise_keeping_index` (PKI, din BR-26):

```
PKI = tasks_completed_by_committed_deadline / tasks_with_explicit_deadline   ∈ [0,1]
TS_new = TS_existing × 0.85 + PKI × 0.15
```

> Redistribuire greutate: `-0.15` din `activity_consistency` (cel mai puțin predictiv per ML ENGINEER review M1.S4). Net: TS ∈ [0,1] păstrat. T01-T07 INTACTE (nu testează TS direct).

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

### ★ 8.5 Entități AGI Layer (4) — Phase M1.S3-M1.S6

> **Sursă:** §18 Agent Growth Intelligence. Toate 4 entități sunt **additive** — FK-uri spre entități existente, fără modificare schema existentă.

| Entitate | Câmpuri cheie | Relații | Stage |
|---|---|---|---|
| `execution_guides` | `id UUID PK` · `action_type TEXT` (FK logic la task_type enum) · `title TEXT NOT NULL` · `script_template TEXT` (variabile `{{var}}`) · `timing_hint TEXT` · `avoid_notes TEXT` · `tenant_id UUID FK` · `created_by UUID FK → users` · `created_at TIMESTAMPTZ` | One-to-many cu task_type; agent poate accesa ghidul relevant dintr-un task activ | M1.S4 |
| `client_alumni` | `id UUID PK` · `lead_id UUID FK → leads` · `deal_id UUID FK → deals` · `touchpoint_config JSONB` (array de {type, months_after, template_key}) · `next_touchpoint_at TIMESTAMPTZ NULL` · `last_touchpoint_sent_at TIMESTAMPTZ NULL` · `referred_lead_count INT DEFAULT 0` · `referred_by_this_alumni UUID[] DEFAULT '{}'` · `tenant_id UUID FK` · `created_at TIMESTAMPTZ` | Lead `status = 'alumni'` FK; cron `alumni_touchpoint_scheduler` writes `next_touchpoint_at` | M1.S6 |
| `agent_goals` | `id UUID PK` · `agent_id UUID FK → users` · `period_year INT NOT NULL` · `period_month INT NOT NULL` · `target_deals INT DEFAULT 0` · `target_aps NUMERIC(3,2) DEFAULT 0` · `target_commission_eur NUMERIC(12,2) DEFAULT 0` · `actual_deals INT DEFAULT 0` · `actual_aps NUMERIC(3,2) DEFAULT 0` · `actual_commission_eur NUMERIC(12,2) DEFAULT 0` · `progress_pct NUMERIC(5,2) GENERATED ALWAYS AS (...)` · `tenant_id UUID FK` · UNIQUE(agent_id, period_year, period_month) | Agent edits own goals în `/cabinet/agent`; cron actualizează `actual_*` zilnic din deals + scoring_state | M1.S5 |
| `ethics_checkpoints` | `id UUID PK` · `trigger_context TEXT NOT NULL` (enum: `dual_representation / competing_offers / property_disclosure / financing_gap`) · `prompt_text TEXT` (localizabil) · `is_acknowledged BOOLEAN DEFAULT false` · `acknowledged_at TIMESTAMPTZ NULL` · `acknowledged_by UUID FK → users` · `deal_id UUID FK nullable` · `lead_id UUID FK nullable` · `tenant_id UUID FK` · `created_at TIMESTAMPTZ` | Append-only (AUDIT_LOG analog); niciun UPDATE/DELETE permis pe rânduri acknowledge | M1.S3 |

**Total entități BRD v1.3.0: 10 existente + 4 AGI = 14 entități canonice.**

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

### ★ 13.4 KPI Agent Growth Intelligence (v1.3.0)

| KPI | Definiție | Baseline | Țintă | Fază |
|---|---|---|---|---|
| **Promise Keeping Index (PKI)** | tasks_completed_by_deadline / tasks_with_deadline per agent rolling 30d | N/A | PKI mediu echipă ≥ 0.75 la 90 zile post-M1.S4 deploy | M1.S4 |
| **Alumni Return Rate** | alumni cu `referred_lead_count ≥ 1` / total alumni ∈ [0,1] | 0 | ≥ 15% la 12 luni post-M1.S6 deploy | M1.S6+ |
| **Execution Guide Usage** | % task-uri cu `action_type` care au ghid accesat / total task-uri | N/A | ≥ 40% agenți activi accesează ≥ 1 ghid/săptămână | M1.S4 |
| **Ethics Checkpoint Ack Rate** | checkpoints acknowledge / checkpoints generated ∈ [0,1] | N/A | ≥ 95% (proxy conformitate) | M1.S3 |
| **Agent Goal Hit Rate** | luni cu `actual_deals ≥ target_deals × 0.80` / total luni cu goal setat | N/A | ≥ 60% per agent cohort activ | M1.S5 |

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
| ★ **AGI** | Agent Growth Intelligence | Layer transversal §18 — 7 module de dezvoltare profesională agent (PKI · Alumni · Goals · Ethics · Exec Guides · Value Comm · RM Readiness) |
| ★ **PKI** | Promise Keeping Index | tasks_completed_by_deadline / tasks_with_deadline rolling 30d ∈ [0,1] · component TS v1.3.0 |
| ★ **Execution Guide** | Ghid de Execuție | Template script + timing + avoid_notes per NBA action_type; accesat inline din task activ |
| ★ **Client Alumni** | Client Trecut | Entitate post-deal CÂȘTIGAT; BR-27; cron touchpoint la T+12/24 luni |
| ★ **Agent Goals** | Obiective Agent | Ținte lunare per agent (deals / APS / comision); vizibile în /cabinet/agent |
| ★ **Ethics Checkpoint** | Punct de Control Etic | Soft-prompt non-blocant la 4 momente de risc etic; BR-28; append-only |

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

---

## ★ 17. Specificații piață Republica Moldova [MOLDOVA-SPECIFIC]

> **IMPORTANT:** Toate specificațiile din această secțiune sunt **EXCLUSIV pentru piața din Republica Moldova**. La expansiunea REVYX pe alte piețe (România, Bulgaria, Georgia etc.) fiecare piață va necesita propriile specificații echivalente — comportamentele descrise mai jos NU sunt universale și NU trebuie tratate ca cerințe globale ale platformei.
>
> Secțiunea descrie insight-uri operaționale identificate din analiza fluxului real al agenților imobiliari moldoveni, cu implicațiile tehnice corespunzătoare pentru schema BD și logica aplicației.

---

### §17.1 Comportament buget client [MOLDOVA-SPECIFIC]

**Fenomenul observat:**
- Clientul declară un buget la telefon (buget aspirațional) care diferă sistematic de bugetul confirmat față-în-față.
- Divergența tipică: **15-25%** sub bugetul declarat (ex: declarat 80.000€ → confirmat 60.000€ cash + speranță credit).
- Motivul: clienții RM declară bugetul maxim teoretic (presupunând credit maxim aprobat), nu cel real imediat disponibil.

**Implicații tehnice:**

| Câmp | Tip | Descriere | Stage implementare |
|---|---|---|---|
| `declared_budget_eur` | `NUMERIC(12,2)` | Bugetul declarat telefonic la intake | M1.S3 — LEAD schema |
| `confirmed_budget_eur` | `NUMERIC(12,2) NULL` | Bugetul confirmat față-în-față (completat de agent post-întâlnire) | M1.S3 — LEAD schema |
| `budget_confirmed_at` | `TIMESTAMPTZ NULL` | Timestamp confirmare buget | M1.S3 — LEAD schema |

**Impact scoring:**
- `confirmed_budget_eur` alimentează **RF (Risk Factor)** în calculul DHI când e disponibil — gap mare declarat/confirmat → RF mai mare.
- Match Engine (M1.S4) folosește `confirmed_budget_eur` când disponibil, altfel `declared_budget_eur × 0.80` ca estimare conservativă.
- UI agent: câmp editabil `Buget confirmat` vizibil pe lead detail post-întâlnire calificare; hint de avertizare dacă `confirmed_budget < declared_budget × 0.85`.

---

### §17.2 Tipuri întâlnire de calificare [MOLDOVA-SPECIFIC]

**Fenomenul observat:**
Întâlnirile de calificare în RM NU au loc exclusiv la oficiu. Există 3 locații distincte cu implicații operaționale diferite:

| Tip (`meeting_location_type`) | Descriere | Implicații operaționale |
|---|---|---|
| `office` | La oficiu / sediu agenție | Pot fi semnate documente fizic (mandat GDPR consent, contract intermediere); agent lucrează de pe desktop full |
| `public_place` | Cafenea, parc, loc public | Întâlnire exploratorie; documente se semnează ulterior; agent lucrează de pe telefon (Mobile companion); preferințele clientului se actualizează live |
| `on_site` | La proprietatea de vizitat | Calificarea și prima vizionare **se suprapun** — un singur eveniment fizic; nu sunt 2 evenimente separate |

**Implicații tehnice critice:**

1. **`on_site` meeting → auto-create SHOWING** — când `meeting_location_type = 'on_site'`, sistemul creează automat un SHOWING asociat (property_id = prima proprietate vizitată). Nu se contorizează ca 2 activități separate în IS/activity counting.
2. **`ACTIVITY` schema** (M1.S3 entry): câmp `meeting_location_type ENUM('office', 'public_place', 'on_site') NULL` pe entitatea ACTIVITY (type = `qualification_meeting`).
3. **Trigger BD** (M1.S3): `after INSERT on ACTIVITY WHERE type = 'qualification_meeting' AND meeting_location_type = 'on_site'` → INSERT on SHOWING cu `showing_type = 'qualification_combined'`.
4. **IS (Interaction Strength)** — calificare `on_site` are greutate mai mare în IS computation (agentul a văzut proprietatea + a calificat clientul simultan = informație mai bogată).
5. **GDPR compliance**: documente semnate în `public_place` necesită confirmare digitală ulterioară (e-signature sau upload scan) — `gdpr_consent.channel = 'verbal_pending_digital'` cu flag `needs_digital_confirmation = true`.

---

### §17.3 Pre-aprobare bancară [MOLDOVA-SPECIFIC]

**Fenomenul observat:**
- Spre deosebire de piețele vestice (DE/AT/CH/UK unde pre-aprobarea bancară înainte de vizionare e standard), **în RM pre-aprobarea bancară înainte de vizionare este excepție, nu regulă**.
- Agentul evaluează singur „cât e real bugetul" din conversație (context §17.1).
- Clienții rareori solicită pre-aprobare din proprie inițiativă.

**Bănci principale RM care oferă pre-aprobare:**
- MoldIndConBank (MIB)
- Victoriabank
- Mobiasbancă (BNP Paribas Group)

**Implicații tehnice:**

| Câmp | Tip | Descriere | Stage |
|---|---|---|---|
| `bank_preapproval_status` | `ENUM('none', 'in_progress', 'approved', 'rejected') DEFAULT 'none'` | Status pre-aprobare bancară | M1.S3 — LEAD |
| `bank_preapproval_amount_eur` | `NUMERIC(12,2) NULL` | Suma aprobată de bancă | M1.S3 — LEAD |
| `bank_preapproval_bank` | `VARCHAR(100) NULL` | Numele băncii | M1.S3 — LEAD |
| `bank_preapproval_expires_at` | `TIMESTAMPTZ NULL` | Valabilitate pre-aprobare (tipic 30-90 zile) | M1.S3 — LEAD |

**Impact scoring:**
- `bank_preapproval_status = 'approved'` → RF (Risk Factor) scade semnificativ (riscul de finanțare eliminat); DHI crește.
- NBA sugestie automată pentru buyer leads în stadiu `qualified`: `request_bank_preapproval` task dacă `bank_preapproval_status = 'none'` + `confirmed_budget_eur > 40000`.

---

### §17.4 Evoluția preferințelor post-vizionare [MOLDOVA-SPECIFIC]

**Fenomenul observat:**
- **90% din clienții RM modifică cel puțin un criteriu de preferință după prima vizionare.**
- Modificarea nu e excepție — e **pattern sistematic și așteptat** în piața RM.
- Cauze: clientul nu știa ce vrea până nu a văzut ceva concret; vizionarea calibrează așteptările vs realitatea pieței.
- **Sistemul NU trebuie să trateze modificarea ca eroare** — trebuie să o faciliteze activ.

**Implicații tehnice:**

| Câmp / Entitate | Tip | Descriere | Stage |
|---|---|---|---|
| `preference_history` | `JSONB[] NOT NULL DEFAULT '[]'` | Array de snapshot-uri preferință; fiecare element conține `{timestamp, changed_by, preferences_snapshot}` | M1.S3 — LEAD |
| `showing.feedback` | JSONB structurat | 5 dimensiuni feedback post-vizionare (structura de mai jos) | M1.S3 — SHOWING |
| `showing.dismissed` | `BOOLEAN DEFAULT false` | Proprietatea respinsă explicit de client | M1.S3 — SHOWING |

**Structura `showing.feedback` (5 dimensiuni RM-specific):**
```json
{
  "price":     { "rating": 1-5, "comment": "string" },
  "zone":      { "rating": 1-5, "comment": "string" },
  "surface":   { "rating": 1-5, "comment": "string" },
  "condition": { "rating": 1-5, "comment": "string" },
  "other":     { "rating": 1-5, "comment": "string" }
}
```

**Logica platformei:**
- La `showing.feedback` completat → trigger `preferences.changed` event → snapshot curent preferințe salvat în `preference_history[]`.
- Match Engine (M1.S4) exclude proprietăți cu `showing.dismissed = true` pentru lead-ul respectiv.
- `preference_history` alimentează ML training data (M2.S5+) pentru predicția evoluției preferințelor.
- UI agent: `<PreferenceHistoryTimeline>` component pe lead detail (M1.S5) afișând evoluția cronologică.
- Modal feedback post-vizionare (M1.S3 scope) apare automat la marcarea SHOWING ca completat.

---

### §17.5 Mandatul de exclusivitate [MOLDOVA-SPECIFIC]

**Fenomenul observat:**
- Agentul semnează un **mandat de exclusivitate** cu vânzătorul (seller lead) — document legal care conferă agentului dreptul exclusiv de a promova și vinde proprietatea pe o perioadă determinată.
- Durata tipică în RM: **30-90 zile** (negociabilă).
- La expirare → reminder automat obligatoriu (risc pierdere relație seller).
- REVYX curent (M0.S8.2) are `request_documents` NBA ca sugestie pentru sellers, dar mandatul nu e tracked cu status explicit.

**Implicații tehnice:**

| Câmp / Entitate | Tip | Descriere | Stage |
|---|---|---|---|
| `mandate_status` | `ENUM('none', 'pending', 'signed', 'expired') DEFAULT 'none'` | Status mandat exclusivitate (pe LEAD tip seller/landlord) | M1.S3 — LEAD |
| `mandate_signed_at` | `TIMESTAMPTZ NULL` | Data semnare mandat | M1.S3 — LEAD |
| `mandate_expires_at` | `TIMESTAMPTZ NULL` | Data expirare mandat (mandate_signed_at + 30/60/90 zile) | M1.S3 — LEAD |
| `mandate_document_id` | `UUID NULL FK → documents.id` | Referință la documentul scanat/digital | M1.S3 — LEAD |

**Logica platformei:**
- NBA pentru supply leads (seller/landlord) în status `hot` sau `qualified`: task `request_mandate` cu priority HIGH când `mandate_status = 'none'`.
- Cron job zilnic (M1.S3): verifică `mandate_expires_at < NOW() + INTERVAL '7 days'` → NBA task `renew_mandate` cu `due_at = mandate_expires_at - INTERVAL '3 days'`.
- La `mandate_expires_at < NOW()` → `mandate_status` actualizat automat la `'expired'` via cron + AUDIT_LOG event `MANDATE_EXPIRED`.
- AUDIT_LOG events: `MANDATE_REQUESTED`, `MANDATE_SIGNED`, `MANDATE_EXPIRED`, `MANDATE_RENEWED`.

---

### §17.6 Clasificarea fondului locativ RM [MOLDOVA-SPECIFIC]

**Fenomenul observat:**
Piața imobiliară din Republica Moldova (Chișinău în special) are o structură de fond locativ distinctă față de piețele vestice, cu 4 categorii principale care influențează semnificativ prețul, calitatea match-urilor și așteptările cumpărătorilor/chiriașilor:

| `property_class` | Perioadă construcție | Caracteristici | Preț orientativ Chișinău |
|---|---|---|---|
| `soviet_era` | Pre-1990 (sec. I, II, III) | Fond locativ sovietic (Hrușciov, Stalinka, bloc panel); plafoane ~2.5m; planuri fixe; izolație slabă | ~40.000-80.000€ (apartament 2 camere) |
| `post_soviet` | 1990-2005 | Calitate intermediară; unele renovate; materiale mixte | ~60.000-120.000€ |
| `new_build` | 2005-prezent | Bloc nou cu lift, interfon, parcare; calitate variabilă | ~900-1.200€/m² periferice; ~1.200-1.500€/m² zone medii |
| `premium` | Oricând, locații centrale + proiecte selective | Centru Chișinău (Buiucani premium, Centru, Botanica zone rezidențiale selective); finisaje înalte; facilități | >1.500€/m² |

**Distribuție aproximativă tranzacții Chișinău:**
- `soviet_era`: ~55-60% din tranzacțiile sub 80.000€
- `new_build`: ~30% din tranzacțiile totale
- `post_soviet`: ~10%
- `premium`: ~5%

**Implicații tehnice:**

| Câmp | Tip | Descriere | Stage |
|---|---|---|---|
| `property_class` | `ENUM('soviet_era', 'post_soviet', 'new_build', 'premium') NULL` | Clasa fondului locativ — clasificare RM-specific | M1.S3 — PROPERTY |

**Impact scoring + matching:**
- `property_class` → index compus `(tenant_id, property_class, listing_type)` pentru filtrare rapidă în Match Engine (M1.S4).
- PS (Property Score) include `property_class` ca feature în scoring — `new_build` și `premium` au LF (Listing Freshness) mai mare per aceeași perioadă de inactivitate (cerere mai mare).
- Match Engine (M1.S4): buyer/tenant lead cu preferință `preferred_class` → filtrare primară pe `property_class` înainte de cosine similarity.
- UI `/properties` (M1.S5): filtru `Clasa proprietății` cu 4 opțiuni.
- UI `/leads/[id]` BuyerPreferencesPanel (M1.S5): câmp `Clasă proprietate preferată` (multi-select).

---

## ★ 18. Agent Growth Intelligence — AGI Layer

> **Sursă:** Analiza comparativă a 9 cărți de referință din practica imobiliară profesională (Carnegie/Hill/Beckwith/Maister/Gitomer/Fox/Lukic/Blanchard+Peale/Yamaguchi) și NAR Code of Ethics față de framework-ul REVYX. Analiza a identificat că REVYX excelează la **control operațional și eficiență** (ce, când, cine) dar îi lipsea un strat de **inteligență relațională și profesională** (cum, de ce, calitate pe termen lung).
>
> **Filosofie:** Shift de la „AOS care controlează agentul" → „AOS care **dezvoltă** agentul". AGI Layer este un al 8-lea strat transversal — similar structural cu Pilon Retention (§6.4) care a extins cei 7 piloni core fără a-i modifica.
>
> **Garanție backwards compat:** BR-01..BR-24 INTACTE · Formule §7 INTACTE · Entități existente INTACTE · T01-T07 INTACTE.

---

### §18.1 AGI-01 — Relationship Intelligence

**Sursă literară:** Carnegie „How to Win Friends and Influence People" + Maister „True Professionalism"

**Gap identificat:** IS (Interaction Strength) măsoară cantitatea și frecvența interacțiunilor, nu calitatea acestora. Maister: „The client doesn't care how much you know until they know how much you care." TS există dar nu captează componenta de consistență a promisiunilor agentului.

**Implementare:**

- IS primeşte 3 sub-dimensiuni calitative (detalii §7.9): `follow_through_rate` + `response_consistency` + `client_satisfaction_signal` (opțional).
- TS primeşte `promise_keeping_index` (BR-26, §7.9) cu weight 0.15.
- AUDIT_LOG event nou: `AGENT_PKI_CALCULATED` (weekly batch job).

**Faza de implementare:** M1.S4 (Match Engine + NBA Engine) — PKI calculul depinde de task completion data solidă din M1.S3.

---

### §18.2 AGI-02 — Agent Self-Development Module

**Sursă literară:** Hill „Think and Grow Rich" + Lukic „10 Secrets of Sales" + Maister „Do What You Preach"

**Gap identificat:** APS este exclusiv retrospectiv (ce ai realizat). Lipsea dimensiunea prospectivă (ce îți propui). Top performers știu exact ce vor să obțină și revin după eșec (Lukic: diferența definitorie între top și mediu).

**Implementare:**

- Entitate `agent_goals` (§8.5) cu target lunar per agent: target_deals + target_aps + target_commission_eur.
- UI `/cabinet/agent` (M1.S5): tab nou **„Obiectivele mele"** — input targets + grafic progres real-time (actual vs target) + gap față de target cu vizualizare dots.
- NBA context-aware: dacă `actual_deals < target_deals × 0.60` și suntem după ziua 20 a lunii → UF (Urgency Factor) creşte automat cu +0.10 în calculul NBA (fără afecta LS/PS/DP — doar prioritizare task-uri).

**Faza de implementare:** M1.S5 (Phase C UI Web).

---

### §18.3 AGI-03 — NBA Execution Guides

**Sursă literară:** Gitomer „Little Red Book of Selling" + Lukic „10 Secrets of Sales" + Fox „How to Become a Rainmaker"

**Gap identificat:** NBA generează `action_type` corect (ce să faci) dar nu și `how_to` (cum să o faci). Top performers au scripturi și template-uri pentru fiecare situație, nu improvizează (Lukic). Gitomer: vânzarea de succes este despre tonul, timing-ul și abordarea specifică — nu doar despre acțiune.

**Implementare:**

- Entitate `execution_guides` (§8.5): fiecare `action_type` poate avea un ghid asociat per tenant.
- UI inline: buton **„Cum să fac asta?"** pe fiecare task activ din NBA queue → deschide ghid fără navigare separată (drawer sau popover).
- Seed default la provisioning tenant: **9 ghiduri** pentru cele 9 `task_type` existente (first_contact / follow_up / schedule_showing / send_property / request_documents / draft_offer / close_deal / review_no_show / custom). Conținut bazat pe best practices piață RM + Gitomer framework.
- Manager/admin poate edita ghiduri per tenant din `/admin` → personalizare per agenție.
- AUDIT_LOG event: `EXECUTION_GUIDE_ACCESSED` (agent_id + task_id + guide_id).

**Faza de implementare:** M1.S4 (NBA Engine — ghidurile se ataşează la NBA output).

---

### §18.4 AGI-04 — Ethics Checkpoints

**Sursă literară:** Blanchard + Peale „The Power of Ethical Management" + NAR Code of Ethics 2026

**Gap identificat:** REVYX are conformitate internă (AUDIT_LOG, RBAC, GDPR) dar nu are instrumente de **ghidare etică proactivă** la momentele de decizie. NAR Code: profesionalismul etic nu e doar „nu faci rău" ci conduită proactivă (disclosure, conflict of interest, reprezentare corectă).

**Cele 4 trigger-uri Ethics Checkpoint (BR-28):**

| Trigger | Context | Prompt text (RO) |
|---|---|---|
| `dual_representation` | Agent = reprezentantul AMBELOR părți într-un deal | „Reprezentare dublă — ai informat în scris ambele părți și ai obținut consimțământul explicit?" |
| `competing_offers` | ≥ 2 oferte active pe aceeași proprietate | „Există oferte concurente. Clientul tău știe că există alte oferte? Ești obligat să informezi ambele părți." |
| `property_disclosure` | Prima listare a unei proprietăți | „Ai comunicat toate defectele cunoscute ale proprietății? Disclosure obligatoriu per Cod Etic." |
| `financing_gap` | `confirmed_budget_eur < declared_budget_eur × 0.75` (BR-25 trigger) | „Există discrepanță semnificativă buget declarat vs confirmat. Ai clarificat cu clientul realitatea financiară?" |

**Implementare:**

- Entitate `ethics_checkpoints` (§8.5) — append-only (analog AUDIT_LOG).
- UI: modal soft-prompt non-blocant cu checkbox „Am înțeles și am acționat corespunzător" → `is_acknowledged = true` + timestamp.
- Neacknowledgement NU blochează operația — dar rămâne în `ethics_checkpoints` cu `is_acknowledged = false` (vizibil manager în raport lunar).
- AUDIT_LOG event: `ETHICS_CHECKPOINT_TRIGGERED` (severity INFO) + `ETHICS_CHECKPOINT_ACKNOWLEDGED` (severity LOW).

**Faza de implementare:** M1.S3 (simplitate implementare — trigger-uri clare, fără scoring complex).

---

### §18.5 AGI-05 — Value Communication Toolkit

**Sursă literară:** Beckwith „Selling the Invisible" + Fox „How to Become a Rainmaker"

**Gap identificat:** Serviciul imobiliar este **invizibil** pentru client — agentul trebuie să facă tangibilă valoarea sa. Fox / „Dollarizing": clientul cumpără un rezultat cuantificabil, nu servicii abstracte. REVYX arată commission % dar nu ajuta agentul să demonstreze ROI față de client.

**Implementare:**

- `value_proposition_card` per agent (câmp JSONB pe entitatea `users`): bullet-uri editabile „De ce să lucrezi cu mine" (max 5) + statistici reale auto-populate din APS: `avg_days_to_deal` + `offer_acceptance_rate` + `client_satisfaction_avg`.
- UI `/cabinet/agent` (M1.S5): secțiune **„Propunerea mea de valoare"** editabilă + preview cum apare clientului.
- Property Showcase Link `/p/:token` (M1.S5): tab extins **„De ce prin agent"** — afișează `value_proposition_card` al agentului responsabil + 3 statistici cheie APS.
- Nu necesită entitate nouă — extensie JSONB pe users.

**Faza de implementare:** M1.S5 (Phase C UI Web — depinde de Showcase Link implementat).

---

### §18.6 AGI-06 — Client Alumni Lifecycle

**Sursă literară:** Yamaguchi „Calea Comerțului" + Carnegie relații pe termen lung

**Gap identificat:** Deal se închide la `CÂȘTIGAT` în pipeline → fără continuare. Yamaguchi: comerciantul adevărat cultivă relația pe termen lung — clientul de azi este sursa de referințe pentru mâine. Piața RM: ciclu mediu revânzare = 5-7 ani. Statistic global: 70% din tranzacțiile unui agent experimentat vin din referințe și clienți reveniți — REVYX nu capteza această dimensiune.

**Implementare:**

- Entitate `client_alumni` (§8.5, BR-27): creat automat la `deal.status → CÂȘTIGAT`.
- Lead asociat: `status → 'alumni'` (stat nou — NU deleted, NU nurturing).
- Cron `alumni_touchpoint_scheduler` (rulat zilnic): verifică `next_touchpoint_at` și generează reminder NBA task (non-urgent, `priority = LOW`) pentru agent cu template din `execution_guides`.
- Trigger-uri touchpoint (configurabil per `touchpoint_config`):
  - T+12 luni (aniversare tranzacție): template „Felicitare 1 an"
  - T+24 luni: template „Verificare satisfacție + piața azi"
  - Market event: prețuri zonă >5% variație → template „Noutăți din zona ta"
- Tracking referințe: câmp `referred_by_alumni_id UUID nullable` pe LEAD — dacă un lead nou vine cu acest FK setat, `alumni.referred_lead_count++`.
- UI `/cabinet/agent` (M1.S5): bloc nou **„Clienții anteriori"** — count alumni + return rate + referrals count.

**Faza de implementare:** M1.S6 (depinde de Deal Closure pipeline complet M1.S6).

---

### §18.7 AGI-07 — Financial Readiness Score RM [MOLDOVA-SPECIFIC]

**Sursă literară:** Maister „True Professionalism" aplicat pe context RM + BRD §17.3

**Gap identificat:** Pe piața RM, agentul trebuie să devină **consilier financiar informal** — pre-aprobarea bancară cvasi-inexistentă înseamnă că agentul este singurul filtru de realism al bugetului. Fără un instrument de readiness, agentul petrece timp cu lead-uri calificate formal (LS ≥ 0.60) dar financiar nepregătite.

**Implementare:**

- `financial_readiness_score` (FRS): scor derivat 3 câmpuri existente (§17.1 + §17.3), calcul simplu non-ML:
  ```
  FRS_base = 0.30 (default)
  + 0.25 dacă confirmed_budget_eur IS NOT NULL
  + 0.25 dacă bank_preapproval_status IN ('in_progress', 'approved')
  + 0.20 dacă bank_preapproval_status = 'approved'
  FRS ∈ [0,1], clamp la 1.0
  ```
- FRS afişat în lead detail ca indicator informativ agent (NU în BR-01 Lead Firewall — FRS nu blochează lead-uri).
- BR-25: dacă FRS < 0.30 AND LS ≥ 0.60 → NBA obligatoriu `clarify_financing` task înainte de `schedule_showing`.
- UI label: **„Pregătire financiară"** cu 3 niveluri (Neconfirmat / In progres / Confirmat) + InfoTooltip explicativ.
- Nu necesită tabelă nouă — câmp computed în service layer din câmpurile §17.1 + §17.3 existente.

**Faza de implementare:** M1.S3 (în acelaşi sprint cu T-MD-01 §17.1 câmpuri buget).

---

### §18.8 Acceptance Criteria AGI

| ID | Criteriu |
|---|---|
| ★ AC-AGI-01 | PKI calculat săptămânal pentru fiecare agent cu ≥ 3 task-uri cu deadline în ultimele 30 zile |
| ★ AC-AGI-02 | La deal.status → CÂȘTIGAT: `client_alumni` creat în ≤5 secunde + lead.status → 'alumni' + AUDIT_LOG event |
| ★ AC-AGI-03 | `ethics_checkpoint` generat la fiecare din cele 4 trigger-uri (BR-28) + AUDIT_LOG event |
| ★ AC-AGI-04 | Neacknowledgement ethics checkpoint NU blochează operația — soft-prompt non-modal |
| ★ AC-AGI-05 | FRS calculat la fiecare PATCH pe LEAD pentru câmpurile §17.1/§17.3 |
| ★ AC-AGI-06 | BR-25: `clarify_financing` task creat automat când FRS < 0.30 AND LS ≥ 0.60 AND no existing `clarify_financing` ACTIVE task |
| ★ AC-AGI-07 | Execution guide accesibil inline din task — fără navigare la pagină separată |
| ★ AC-AGI-08 | Agent goals: `actual_*` câmpuri actualizate zilnic prin cron (nu la fiecare operație — batch) |

---

*BRD_REVYX_v1.3.0.md · v1.3.0 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
