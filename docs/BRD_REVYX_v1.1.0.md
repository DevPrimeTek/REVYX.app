# BRD — REVYX Agent Operating System
<!-- BRD_REVYX_v1.1.0.md · v1.1.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2025-04 | Senior PM | Document inițial — sinteză din Spec v1.1 + BrandBook v2.2 + Workflow v3 |
| 1.1.0 | 2026-05 | Senior PM | ★ Modele de Tenancy (6 tipuri: SOLO, NETWORK_FLAT, NETWORK_LED, AGENCY, AGENCY_CUSTOM, FRANCHISE) · ★ Entități noi: TENANT, ROLE, PERMISSION, ROLE_PERMISSION · ★ Custom Roles definibile în-app · ★ glosar extins |

---

## Cuprins

1. [Executive Summary](#1-executive-summary)
2. [Context & Problemă de Business](#2-context--problemă-de-business)
3. [Obiective de Business](#3-obiective-de-business)
4. [Stakeholders & Actori](#4-stakeholders--actori)
5. [Perimetrul Soluției — 7 Piloni Funcționali](#5-perimetrul-soluției--7-piloni-funcționali)
6. [Cerințe de Business Cheie](#6-cerințe-de-business-cheie)
7. [Sistemul de Scoring AI — 8 Formule](#7-sistemul-de-scoring-ai--8-formule)
8. [Data Model — 13 Entități](#8-data-model--13-entități)
9. [Securitate & Conformitate](#9-securitate--conformitate)
10. [RBAC — System Roles + Custom Roles](#10-rbac--system-roles--custom-roles)
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
| **Versiune spec bază** | Spec Consolidată v1.1 (Post Hard Stress Test — 47 gap-uri integrate) |
| **Piața primară** | Republica Moldova |
| **Status** | CRITIC — Ajustări obligatorii înainte de dev (Phase 0 blocantă) |
| **Echipa** | Senior PM · Solution Architect · Senior Product Designer · QA × 2 |

### Diferențiatori principali

REVYX nu este un CRM — este un sistem de operare pentru agenți care:

- **Controlează complet pipeline-ul tranzacțional** de la primul contact până la predarea cheilor
- **AI Layer nativ** — scoring, matching și next-best-action în timp real
- **Property Showcase Links** — fiecare proprietate generează un link public unic, personalizat
- **Lead Firewall cu Manager Override** — doar lead-uri calificate ajung la agenți, protejând timpul lor
- **Max 3 task-uri active per agent** — focus și execuție optimizată
- **Escalation Protocol 3 niveluri** — ★ niciun lead HOT nu rămâne nealocat
- **GDPR-compliant by design** — consimțământ, retenție automată, drept la ștergere

---

## 2. Context & Problemă de Business

### 2.1 Piața imobiliară din Republica Moldova

Piața imobiliară din Republica Moldova operează în mare parte manual sau cu instrumente generice (Excel, CRM-uri generice) care nu sunt adaptate specificului local și volumului de tranzacții imobiliare. Agenții imobiliari pierd timp semnificativ pe lead-uri necalificate, nu au vizibilitate asupra probabilității de succes a tranzacțiilor active și nu au instrumente AI pentru prioritizare.

### 2.2 Probleme identificate

| Problemă | Impact |
|---|---|
| Agenții primesc lead-uri necalificate | Timp pierdut · conversie scăzută |
| Nicio prioritizare automată a task-urilor | Agenții lucrează pe intuiție, nu date |
| Lipsa vizibilității asupra sănătății deal-urilor | Deal-uri pierdute nedetectate |
| Matching manual buyer-property | Lent, subiectiv, scalabilitate zero |
| Comunicare haotică pe WhatsApp/email | Urmărire imposibilă · GDPR risc |
| Lipsa audit trail | Conformitate imposibilă |
| Agenți noi penalizați artificial | APS=0 bloca orice nou venit |

### 2.3 Fluxul actual (As-Is)

```
Client sună/scrie → Agent răspunde manual → Excel/notepad → Vizionare → Negociere informală → Act notarial
```

Probleme: nicio prioritizare · nicio scoring · nicio urmărire · GDPR neconform.

### 2.4 Fluxul țintă (To-Be cu REVYX)

```
AI Lead Intake
  → Lead Scoring (LS)
  → Lead Firewall (calificare automată)
  → Match Engine (buyer ↔ property, DP)
  → Agent Task Queue (NBA prioritizat)
  → SHOWING (vizionare programată + feedback)
  → OFFER / Negociere (lanț oferte complet)
  → Deal Close (workflow notarial)
  → Feedback Loop (NPS → APS)
```

Paralel — Supply Engine:
```
Property Intake → Pricing AI → Market Fit Score → Go Live → Demand Signals → Price Adjustment
```

---

## 3. Obiective de Business

| # | Obiectiv | Indicator de succes | Fază |
|---|---|---|---|
| OB-01 | Reducerea timpului de vânzare | −40% față de baseline | Phase 2 |
| OB-02 | Creșterea ratei de conversie lead → deal | +35% față de baseline | Phase 2 |
| OB-03 | Tripling capacitate per agent | 3× deal-uri gestionate simultan | Phase 1-2 |
| OB-04 | SLA răspuns lead urgent respectat | <15 minute · automatizat | Phase 2 |
| OB-05 | Zero lead HOT nealocat | Escalation Protocol activ | Phase 2 |
| OB-06 | Conformitate GDPR | Audit complet · consimțământ înregistrat | Phase 0 |
| OB-07 | Onboarding agenți noi fără penalizare | APS_default=0.65 activ | Phase 1 |

---

## 4. Stakeholders & Actori

### 4.1 Actori interni (sistem)

| Actor | Rol | Interes principal |
|---|---|---|
| **Agent Imobiliar** | Utilizator primar | Task queue clar · lead-uri calificate · scoring transparent |
| **Senior Agent** | Utilizator avansat | + Override prioritate lead |
| **Team Lead** | Supervizare echipă | Vizibilitate deal-uri echipei |
| **Manager Agenție** | Control operațional | Override firewall · alertă escaladare · GDPR tools |
| **Admin** | Control total sistem | Config sistem · scoring weights · AUDIT_LOG complet |

### 4.2 Actori externi (workflow tranzacție)

| Actor | Rol în tranzacție |
|---|---|
| 🏠 **Proprietar / Vânzător** | Furnizează proprietatea · semnează mandat |
| 👤 **Client Potențial / Cumpărător** | Lead → buyer activ |
| 🏦 **Bancă / Finanțator** | Aprobă creditul ipotecar |
| ⚖️ **Notar** | Autentifică actul de vânzare-cumpărare |
| 📱 **Platforme & Rețele Sociale** | Meta / Google / OLX — surse lead intake |
| 🤖 **Sistem REVYX AI** | Orchestrator automat al tuturor scorurilor și task-urilor |

### 4.3 Modele de Tenancy ★ (v1.1.0)

REVYX suportă **6 modele organizaționale** distincte. Modelul ales determină comportamentul Lead Firewall, Manager Override, RBAC și algoritmul de distribuție al lead-urilor.

| Cod | Model | Descriere | Roluri active | Lead Firewall | Override | Fază |
|---|---|---|---|---|---|---|
| `SOLO` | Agent independent | 1 persoană deține tenant-ul | `owner` (combine agent+admin) | Soft (doar reject lead-uri spam) | N/A | Phase 1 |
| `NETWORK_FLAT` | Grup egal de agenți | Toți peers, lead pool partajat, fără ierarhie | toți `agent` | Da · distribuție prin scoring + round-robin | Consens (3/5 agenți) sau Skip | Phase 2 |
| `NETWORK_LED` | Grup cu coordonator | 1 lider + N agenți independenți (ne-angajați) | 1 `network_lead` + N `agent` | Da · standard | `network_lead` | Phase 2 |
| `AGENCY` | Companie ierarhică standard | 5 roluri implicite, angajați | `agent` → `senior_agent` → `team_lead` → `manager` → `admin` | Da · standard | `manager` / `admin` | Phase 1 |
| `AGENCY_CUSTOM` | Companie cu roluri custom | Roluri definite din app, moștenire din 5 sistem | Definibile per-tenant (vezi §8 ROLE) | Da · standard | Permisiune `LEAD_FIREWALL_OVERRIDE` | Phase 2 |
| `FRANCHISE` | Multi-agency sub același brand | Tenant părinte (brand) + tenanți copil (agenții) | Per-agency identic cu AGENCY | Da · cu routing teritorial | Per-agency · brand-level read-only | Phase 3 |

#### 4.3.1 Reguli de comportament per tenancy

| Comportament | SOLO | NETWORK_FLAT | NETWORK_LED | AGENCY | AGENCY_CUSTOM | FRANCHISE |
|---|---|---|---|---|---|---|
| Lead Firewall (LS≥0.60 + contact valid) | Aplicat | Aplicat | Aplicat | Aplicat | Aplicat | Aplicat |
| Manager Override Firewall | N/A | Consens 3/5 | `network_lead` | `manager` | Custom permission | Per-agency |
| Max 3 task-uri active per agent | Da | Da | Da | Da | Da | Da |
| Distribuție lead la agent | Owner | Round-robin + LS-weighted | `network_lead` decide sau auto | NBA + APS | NBA + APS + custom rules | NBA + APS + teritoriu |
| Pipeline view "echipă" | Ascuns | Vizibil tuturor | `network_lead` only | `team_lead+` | Custom permission | Per-agency |
| Comisioane split (referral) | N/A | Da · auto-calculat | Da · cu fee `network_lead` | N/A (intern) | N/A (intern) | Da · cross-agency |
| Brand white-label | Nu | Nu | Nu | Nu | Nu | Da · per-agency |

#### 4.3.2 Mapare subscription tier → tenancy

| Tier comercial | Tenancy permise | Limite |
|---|---|---|
| **Solo** | `SOLO` | 1 user · 100 leads/lună |
| **Team** | `NETWORK_FLAT` · `NETWORK_LED` | ≤10 users · 1.000 leads/lună |
| **Agency** | `AGENCY` | ≤50 users · 10.000 leads/lună |
| **Agency Pro** | `AGENCY` · `AGENCY_CUSTOM` | ≤200 users · custom roles · scoring weights tunabile |
| **Enterprise / Franchise** | `FRANCHISE` (+ orice de mai sus) | Nelimitat · multi-tenant ierarhic · white-label |

---

## 5. Perimetrul Soluției — 7 Piloni Funcționali

### Pilon 01 — Lead Intelligence

**Scop:** Capturare, calificare și scoring automat al lead-urilor inbound.

Funcționalități:
- Lead intake automat din Meta / Google / OLX (webhooks HMAC-SHA256)
- Lead Score (LS) calculat la intake și actualizat la fiecare interacțiune (max 30 sec)
- `LS_initial = 0.30` pentru orice lead nou (nu 0 — Gap #3 rezolvat)
- `TS_initial = 0.50` — Trust Score inițial
- Detecție duplicate prin fuzzy match >85% similaritate
- Nurturing automat pentru lead-uri reci (LS < 0.40) fără implicarea agentului
- GDPR consent capturat obligatoriu la intake

Output: **Lead Score (LS)**

### Pilon 02 — Supply Intelligence

**Scop:** Managementul inventarului de proprietăți cu evaluare AI.

Funcționalități:
- Property onboarding cu câmpuri tehnice complete
- Property Score (PS) calculat automat
- Listing Freshness (LF): penalizare liniară `LF = 1 − min(1, zile/90)`
- Pricing AI și Market Fit Score
- Property Showcase Link — link public unic cu token 6 caractere alfanumerice
- Rate limiting showcase: 20 req/oră per IP · blocare automată 60 min la depășire
- Link expirat → HTTP 410 Gone + pagina "Link Expirat" cu contact agenție

Output: **Property Score (PS)**

### Pilon 03 — Match Intelligence

**Scop:** Potrivire automată buyer-property în timp real.

Funcționalități:
- Match Engine pe 12 criterii de compatibilitate
- Deal Probability (DP) calculat complet: DP = 0.30×LS + 0.30×PS + 0.20×APS + 0.20×IS
- Re-matching trigger: deal-uri active primesc `needs_review=true` · manager decide în 48h · deal-urile NU se anulează automat
- IS (Interaction Strength) calculat din entitatea ACTIVITY (formulă nouă ★)

Output: **Deal Probability (DP)**

### Pilon 04 — Execution Intelligence

**Scop:** Next-best-action automat și managementul task-urilor agentului.

Funcționalități:
- NBA (Next Best Action) calculat continuu: `NBA = DP × UF × e^(−0.1 × Δt)`
- Max 3 task-uri active per agent (`tasks < 3` — condiție alocare)
- Lead Firewall: doar lead-uri cu LS ≥ 0.60 + contact valid → agent queue (max 2 min)
- Manager Override pe Firewall — logat obligatoriu în AUDIT_LOG
- Escalation Protocol 3 niveluri (★ nou v1.1):
  - **Nivel 1** T+SLA: auto follow-up + notificare push agent
  - **Nivel 2** T+SLA+30min: manager alertat cu detalii complete
  - **Nivel 3** T+SLA+2h: auto-reasignare la agentul cu APS maxim disponibil

SLA-uri:
- Lead urgent (HOT): 15 minute
- Lead calificat: 2 ore
- Lead warm: 24 ore

Output: **NBA Score + Task Queue**

### Pilon 05 — Negotiation Intelligence

**Scop:** Asistarea negocierii cu AI și tracking complet al ofertelor.

Funcționalități:
- Entitate OFFER cu lanț complet de negociere (counter_to_offer_id)
- Suport 3-7 runde de negociere per deal
- Sugestii AI contra-ofertă și timing optimal
- Offer status: pending / accepted / rejected / countered / withdrawn
- Valute: EUR (default) / MDL / USD

Output: **Counter-offer Recommendations**

### Pilon 06 — Deal Intelligence

**Scop:** Monitorizarea sănătății fiecărui deal activ.

Funcționalități:
- Deal Health Index (DHI): `DHI = DP × (1 − RF) × TF`
- `TF_default = 0.70` când `expected_close_date = NULL` (★ Gap #17 rezolvat)
- RF binar detectat automat din entitatea ACTIVITY
- Praguri DHI:
  - DHI > 0.70 → Deal sănătos
  - 0.40 ≤ DHI ≤ 0.70 → Atenție · revizuire strategy
  - DHI < 0.40 → Deal în pericol → alertă manager
- Deal fără activitate 5 zile → DHI recalculat + alertă manager automată
- Actualizare DHI în max 10 minute de la orice modificare

Output: **Deal Health Index (DHI)**

### Pilon 07 — Performance Intelligence

**Scop:** Analiza și îmbunătățirea continuă a performanței agenților.

Funcționalități:
- Agent Performance Score (APS) rolling 90 zile
- `APS_default = 0.65` pentru agenți cu <5 deal-uri SAU <30 zile în sistem (★ Gap #2 rezolvat)
- Câmp `agent_since_date` pe entitatea AGENT
- CS (Client Satisfaction) alimentat din NPS post-tranzacție
- Task Allocator verifică `is_active` și `out_of_office_until` înainte de alocare

Output: **Agent Performance Score (APS)**

---

## 6. Cerințe de Business Cheie

### 6.1 Cerințe Funcționale Critice

| ID | Cerință | Prioritate |
|---|---|---|
| BR-01 | Lead Firewall: LS ≥ 0.60 + contact valid pentru acces agent queue | CRITIC |
| BR-02 | LS_initial = 0.30 pentru orice lead nou (nu 0) | CRITIC |
| BR-03 | Escalation Protocol 3 niveluri activ pentru lead-uri HOT | CRITIC |
| BR-04 | Max 3 task-uri active per agent la orice moment | CRITIC |
| BR-05 | Deal-urile NU se anulează automat la re-matching trigger | CRITIC |
| BR-06 | GDPR consent capturat și stocat la intake orice lead | CRITIC |
| BR-07 | AUDIT_LOG append-only pentru toate acțiunile WRITE | CRITIC |
| BR-08 | Showcase Link → HTTP 410 la expirare/invalidare | RIDICAT |
| BR-09 | WhatsApp templates pre-aprobate Meta (5 templates obligatorii) | CRITIC |
| BR-10 | TF_default = 0.70 când expected_close_date lipsește | CRITIC |
| BR-11 | APS_default = 0.65 pentru agenți noi | RIDICAT |
| BR-12 | Single session per agent · forțare logout la password change | CRITIC |

### 6.2 Cerințe Non-Funcționale

| ID | Cerință | Valoare |
|---|---|---|
| NFR-01 | LS actualizare după interacțiune | ≤ 30 secunde |
| NFR-02 | Lead calificat → queue agent | ≤ 2 minute |
| NFR-03 | DHI actualizare după modificare deal | ≤ 10 minute |
| NFR-04 | Showcase analytics → dashboard agent | ≤ 1 minut |
| NFR-05 | Rate limiting endpoint-uri publice | 20 req/min per IP |
| NFR-06 | Rate limiting API intern | 1.000 req/min per token |
| NFR-07 | Rate limiting showcase /p/ | 20 req/oră per IP |
| NFR-08 | JWT access token TTL | 15 minute |
| NFR-09 | JWT refresh token TTL + rotație | 7 zile + rotație automată |
| NFR-10 | GDPR data retention default | NOW + 3 ani de la ultima activitate |
| NFR-11 | Timezone sistem | UTC+2 (Chișinău) |

### 6.3 WhatsApp Templates obligatorii (5)

Submisie Meta cu minimum 2 săptămâni înainte de lansare. Timp aprobare: 24-48h.

| # | Template ID | Trigger |
|---|---|---|
| 1 | `follow_up_warm` | Lead warm — follow-up automat |
| 2 | `follow_up_qualified` | Lead calificat — notificare agent |
| 3 | `showcase_link` | Trimitere link proprietate |
| 4 | `showing_reminder` | Reminder vizionare programată |
| 5 | `offer_received` | Notificare ofertă primită |

---

## 7. Sistemul de Scoring AI — 8 Formule

> Toate scorurile ∈ [0,1] **cu o singură excepție documentată**: NBA ∈ [0, 2.0].

### 7.1 Lead Score (LS)

```
LS = (0.35 × I) + (0.25 × BF) + (0.15 × TU) + (0.15 × E) + (0.10 × TS)

I = Intent · BF = Budget Fit · TU = Timeline Urgency · E = Engagement · TS = Trust Score

★ LS_initial = 0.30 la creare lead nou
★ TS_initial = 0.50
★ La t=0 (date incomplete): LS = (0.25 × BF_declared) + (0.30 × contact_verified)
```

| Prag LS | Acțiune |
|---|---|
| < 0.40 | Lead rece — nurturing automat, fără intervenție agent |
| 0.40 – 0.60 | Lead warm — follow-up automatizat + monitorizare |
| 0.60 – 0.75 | Lead calificat — intră în queue agent (prioritate normală) |
| ≥ 0.75 | Lead HOT — prioritate maximă · alertă imediată |

### 7.2 Property Score (PS)

```
PS = (0.40 × PF) + (0.20 × LD) + (0.15 × PQ) + (0.15 × MV) + (0.10 × LF)

PF = Price Fit · LD = Location Demand · PQ = Property Quality
MV = Market Velocity · LF = Listing Freshness

★ LF = 1 − min(1, zile_listing / 90)
   LF = 1.0 proprietăți noi · LF = 0.0 la ≥ 90 zile · penalizare liniară
```

### 7.3 Interaction Strength (IS) ★ Formulă Nouă

```
IS = (0.40 × SF) + (0.30 × RF_show) + (0.20 × MF) + (0.10 × CF)

SF = Showing Frequency · RF_show = Return visits Showcase
MF = Message Frequency · CF = Call Frequency
Toate componentele normalizate [0-1] · Calculat din entitatea ACTIVITY
```

> ⚠️ **Impact Critic (Gap #21):** IS era complet absent din v1.0. IS este factor DP cu ponderea 20%. Fără IS definit, DP era incomplet.

### 7.4 Deal Probability (DP) ★

```
DP = (0.30 × LS) + (0.30 × PS) + (0.20 × APS) + (0.20 × IS)

★ APS_default = 0.65 pentru agenți cu <5 deal-uri sau <30 zile în sistem
★ IS calculabil acum via formula nouă
```

### 7.5 Next Best Action (NBA) ★ — EXCEPȚIE SCALA

```
NBA = DP × UF × e^(−0.1 × Δt)

UF: 1.0 normal · 1.3 termen apropiat · 1.6 urgency declarat · 2.0 deadline critic
Δt = zile de la ultima interacțiune (timezone UTC+2)

★ NBA ∈ [0, 2.0] — excepție documentată de la regula generală [0,1]
   NBA_max = 2.0 când DP=1.0 · UF=2.0 · Δt=0
   Sort descrescător după valoarea brută (nu normalizată)
```

### 7.6 Trust Score (TS) ★

```
TS = (0.40 × RC) + (0.30 × FV) + (0.30 × BS)

RC = Response Consistency · FV = Financial Validation · BS = Behavior Stability
★ TS_initial = 0.50
RC, FV, BS calculate din entitatea ACTIVITY
```

### 7.7 Agent Performance Score (APS) ★

```
APS = (0.35 × CR) + (0.25 × RT) + (0.20 × DCR) + (0.20 × CS)

CR = Conversion Rate · RT = Response Time Score
DCR = Deal Close Rate · CS = Client Satisfaction

★ APS_default = 0.65 pentru agenți cu <5 deal-uri SAU <30 zile
   Câmp: agent_since_date pe AGENT
```

### 7.8 Deal Health Index (DHI) ★

```
DHI = DP × (1 − RF) × TF

RF = Risk Factor:
  Finanțare problematică: 0.4
  Comunicare ruptă:       0.3
  Concurență:             0.2
  Timeline alunecat:      0.1

★ TF = 0.70 default când expected_close_date = NULL
★ RF binar detectat automat din ACTIVITY
```

| Prag DHI | Acțiune |
|---|---|
| > 0.70 | Deal sănătos — execuție normală |
| 0.40 – 0.70 | Atenție — revizuire strategy, acțiune proactivă |
| < 0.40 | Deal în pericol — alertă manager, re-evaluare obligatorie |

---

## 8. Data Model — 13 Entități

> Entitățile marcate ★ sunt noi în v1.1 și sunt **obligatorii** înainte de dev.

### Entități originale (5) — extinse

| Entitate | Modificări v1.1 |
|---|---|
| **LEAD** | + câmpuri GDPR (gdpr_consent_at, gdpr_consent_channel, gdpr_consent_version, data_retention_expires_at, erasure_requested_at, score_initialized_at) |
| **PROPERTY** | + câmpuri tehnice (showcase_token, listing_freshness_score, market_velocity_score) |
| **DEAL** | + escalation_level [0-3] · needs_review (Boolean) |
| **AGENT** | + is_active · out_of_office_until · language_skills · calendar_sync_token · agent_since_date |
| **TASK** | Extins cu NBA integration |

### Entități noi (4) ★ — obligatorii

#### SHOWING ★
Calculul IS și DP depinde de această entitate.

| Câmp | Tip | Specificație |
|---|---|---|
| showing_id | UUID PK | Primary key |
| deal_id | FK → DEAL | Obligatoriu |
| property_id / lead_id / agent_id | FK | Participanți |
| scheduled_at | Timestamp | Data/ora programată |
| duration_minutes | Int nullable | Durata efectivă |
| attended | Boolean | Lead-ul a participat |
| cancellation_reason | Enum nullable | no_show / reschedule / lead_cancelled / agent_cancelled / other |
| feedback_score | Int [1-5] nullable | Scor interes post-vizionare |
| feedback_notes | Text nullable | Note agent |
| feedback_at | Timestamp nullable | Când a fost completat feedback-ul |

#### OFFER ★
Suport 3-7 runde de negociere (câmpul offer_price pe DEAL era insuficient).

| Câmp | Tip | Specificație |
|---|---|---|
| offer_id | UUID PK | Primary key |
| deal_id | FK → DEAL | Deal-ul asociat |
| offered_by | Enum | buyer / agent_on_behalf_buyer / seller / agent_on_behalf_seller |
| amount | Decimal | Suma ofertei |
| currency | Enum | EUR (default) / MDL / USD |
| status | Enum | pending / accepted / rejected / countered / withdrawn |
| valid_until | Timestamp nullable | Termenul de valabilitate |
| counter_to_offer_id | FK → OFFER nullable | Referință lanț negociere |
| notes | Text nullable | Condiții speciale |
| created_at / responded_at | Timestamp | Audit temporal |

#### ACTIVITY ★
Log complet interacțiuni — sursa pentru IS, TS, NBA Δt.

| Câmp | Tip | Specificație |
|---|---|---|
| activity_id | UUID PK | Primary key |
| entity_type | Enum | lead / deal / property / agent |
| entity_id | UUID | FK dinamic |
| activity_type | Enum | call / message_sent / message_received / showing / offer_made / note_added / score_updated / status_changed / showcase_viewed / document_downloaded |
| performed_by | UUID FK nullable | FK → AGENT · NULL = acțiune sistem |
| channel | Enum nullable | whatsapp / email / sms / platform / phone / in_app |
| duration_seconds | Int nullable | Pentru call și showing |
| metadata | JSONB | Date adiționale specifice tipului |
| timestamp | Timestamp TZ | UTC+2 — timezone-aware |

#### AUDIT_LOG ★ — APPEND-ONLY
Toate acțiunile WRITE → AUDIT_LOG. **Niciun UPDATE sau DELETE permis la nivel BD.** Acces: exclusiv admin (read-only).

| Câmp | Tip | Specificație |
|---|---|---|
| log_id | UUID PK | Primary key, imutabil |
| user_id | UUID FK nullable | FK → AGENT · NULL = acțiune sistem |
| action | String | Ex: LEAD_FIREWALL_OVERRIDE / SCORE_MANUAL_UPDATE / AGENT_DEACTIVATED |
| entity_type / entity_id | String / UUID | Tipul și ID-ul entității afectate |
| old_value / new_value | JSONB nullable | Starea anterioară și nouă |
| ip_address | INET | Adresa IP utilizator |
| timestamp | Timestamp TZ IMMUTABLE | Nu poate fi modificat sub nicio condiție |

### Entități tenancy (4) ★ — multi-org support (v1.1.0)

> Entitățile de mai jos suportă cele 6 modele de tenancy din §4.3. **AGENT primește câmp nou `tenant_id` FK → TENANT** (toate entitățile core sunt scopate per tenant).

#### TENANT ★

Container root pentru orice instanță REVYX. Toate entitățile (LEAD, PROPERTY, DEAL, AGENT etc.) se asociază cu un TENANT prin `tenant_id`.

| Câmp | Tip | Specificație |
|---|---|---|
| tenant_id | UUID PK | Primary key |
| tenant_type | Enum | `SOLO` / `NETWORK_FLAT` / `NETWORK_LED` / `AGENCY` / `AGENCY_CUSTOM` / `FRANCHISE` |
| tenant_parent_id | FK → TENANT nullable | NU NULL doar pentru FRANCHISE (agency copil al brandului) |
| display_name | String | Numele afișat al tenantului (agenție, network sau persoană SOLO) |
| legal_name | String nullable | Denumire juridică (IDNO/CUI pentru companie) |
| subscription_plan | Enum | `solo` / `team` / `agency` / `agency_pro` / `enterprise` |
| subscription_active | Boolean | Tenant suspendat → blocaj WRITE, păstrare READ |
| max_users | Int | Limită utilizatori conform tier |
| max_leads_per_month | Int | Limită lead-uri/lună conform tier |
| billing_email | String | Email facturare |
| timezone | String | Default UTC+2 (Chișinău) |
| currency_default | Enum | EUR (default) / MDL / USD |
| white_label_config | JSONB nullable | Per-FRANCHISE: brand override (logo, paletă) |
| created_at / updated_at | Timestamp TZ | Audit temporal |

#### ROLE ★

Definește un rol în cadrul unui tenant. Cele 5 roluri sistem (`agent`, `senior_agent`, `team_lead`, `manager`, `admin`) există ca rânduri sistem (`is_system=true`, `tenant_id=NULL`). Tenanții `AGENCY_CUSTOM` pot defini roluri proprii care moștenesc dintr-un sistem role.

| Câmp | Tip | Specificație |
|---|---|---|
| role_id | UUID PK | Primary key |
| tenant_id | FK → TENANT nullable | NULL pentru sistem roles · NOT NULL pentru custom |
| role_code | String | Slug unic per tenant (ex: `senior_agent`, `lead_qualifier`) |
| role_name | String | Numele afișat |
| parent_role_id | FK → ROLE nullable | Moștenire permisiuni din rol părinte (ex: `lead_qualifier` extinde `senior_agent`) |
| is_system | Boolean | `true` pentru cele 5 roluri default · imutabile |
| description | Text nullable | Descriere business |
| created_at / updated_at | Timestamp TZ | Audit |

#### PERMISSION ★

Listă atomică de permisiuni. Read-only (gestionată de sistem la deploy). Tenanții nu pot crea permisiuni noi — doar le compun în roluri custom.

| Câmp | Tip | Specificație |
|---|---|---|
| permission_id | UUID PK | Primary key |
| code | String unique | Ex: `LEAD_FIREWALL_OVERRIDE` · `AUDIT_LOG_READ` · `SCORING_WEIGHTS_TUNE` |
| description | Text | Descriere permisiune |
| risk_level | Enum | `low` / `medium` / `high` / `critical` (pentru audit) |
| applies_to_tenancy | Array<Enum> | Modele de tenancy unde permisiunea este aplicabilă |

#### ROLE_PERMISSION ★ — junction

| Câmp | Tip | Specificație |
|---|---|---|
| role_id | FK → ROLE | Compoziție |
| permission_id | FK → PERMISSION | Compoziție |
| granted_at | Timestamp TZ | Audit |
| granted_by | FK → AGENT nullable | NULL = sistem · NOT NULL = admin tenant |

PK compus: `(role_id, permission_id)`.

> **Modificări entități existente (v1.1.0):**
> - `AGENT` primește `tenant_id` FK → TENANT (NOT NULL) și `role_id` FK → ROLE (înlocuiește enum-ul fix de rol)
> - `LEAD`, `PROPERTY`, `DEAL`, `SHOWING`, `OFFER`, `ACTIVITY`, `AUDIT_LOG` primesc `tenant_id` FK → TENANT (NOT NULL) pentru izolare multi-tenant

---

## 9. Securitate & Conformitate

> ⛔ **Phase 0 — Condiție Blocantă:** Niciun cod de aplicație nu poate fi scris fără completarea Security Foundation.

### 9.1 Autentificare & Autorizare

| Componentă | Specificație |
|---|---|
| Protocol | JWT RS256 |
| Access token TTL | 15 minute |
| Refresh token TTL | 7 zile + rotație automată |
| Provider | Supabase Auth sau Auth0 · SSO Google opțional |
| Model autorizare | RBAC cu 5 roluri (permisiuni aditive) |
| Session management | Single session per agent |
| Forțare logout | La password change · La deactivare agent |

### 9.2 Rate Limiting

| Endpoint | Limită |
|---|---|
| Endpoint-uri publice | 20 req/min per IP |
| Showcase `/p/` | 20 req/oră per IP · blocare 60 min la 5 token-uri greșite consecutive |
| API intern | 1.000 req/min per token |

### 9.3 Webhook Security

Toate webhook-urile inbound (Meta, Google, platforme imobiliare): **HMAC-SHA256 signature verification** obligatorie.

### 9.4 GDPR

Câmpuri obligatorii pe LEAD:
- `gdpr_consent_at` — momentul consimțământului (Art. 7)
- `gdpr_consent_channel` — web_form / whatsapp / phone / email (Art. 13)
- `gdpr_consent_version` — versiunea politicii de confidențialitate
- `data_retention_expires_at` — default NOW + 3 ani · job nightly de purjare
- `erasure_requested_at` — dreptul la ștergere Art. 17 → cascade: LEAD → DEAL (anonimizat) → ACTIVITY (șterse)

Documente legale obligatorii pre-lansare: Privacy Policy + Cookie Policy.

### 9.5 Concurență & Race Conditions

Optimistic locking cu `version` field pe entitățile cu scoruri. La conflict: **re-calculare, nu suprascriere**.

### 9.6 AI Multi-tenant

Model per agenție SAU feature isolation cu `tenant_id` în training data.

---

## 10. RBAC — System Roles + Custom Roles

### 10.1 System Roles (5 default)

Permisiuni aditive (fiecare rol include permisiunile rolului precedent). Roluri imutabile la nivel de sistem (`is_system=true`).

| Permisiune | agent | senior_agent | team_lead | manager | admin |
|---|:---:|:---:|:---:|:---:|:---:|
| Leads & Deals proprii | ✅ | ✅ | ✅ | ✅ | ✅ |
| Override lead priority | ❌ | ✅ | ✅ | ✅ | ✅ |
| Lead Firewall Manager Override | ❌ | ❌ | ❌ | ✅ | ✅ |
| Toate deal-urile echipei | ❌ | ❌ | Echipa sa | ✅ | ✅ |
| AUDIT_LOG access | ❌ | ❌ | ❌ | Read-only | Full |
| GDPR Tools & Export | ❌ | ❌ | ❌ | Export | Full |
| Config sistem & Scoring weights | ❌ | ❌ | ❌ | ❌ | ✅ |
| Tenant management (users, billing) | ❌ | ❌ | ❌ | ❌ | ✅ |

### 10.2 Roluri suplimentare per Tenancy ★ (v1.1.0)

| Rol | Tenancy | Notă |
|---|---|---|
| `owner` | `SOLO` | Combine toate permisiunile (agent + admin) într-un singur user |
| `network_lead` | `NETWORK_LED` | Are `LEAD_FIREWALL_OVERRIDE` + vizibilitate pool · NU are `SCORING_WEIGHTS_TUNE` |
| `network_member` | `NETWORK_FLAT` · `NETWORK_LED` | Echivalent `agent`, dar cu lead pool partajat |
| `franchise_admin` | `FRANCHISE` | Admin la nivel de brand (tenant părinte) · read-only pe agenții copii |

### 10.3 Custom Roles ★ (AGENCY_CUSTOM)

Tenanții pe planul `Agency Pro` pot crea roluri custom:

- Fiecare custom role moștenește dintr-un **system role** (`parent_role_id` obligatoriu)
- Custom role poate **adăuga** permisiuni atomice din `PERMISSION`, **nu poate scădea** sub setul rolului părinte
- Permisiuni cu `risk_level=critical` (ex: `SCORING_WEIGHTS_TUNE`, `AUDIT_LOG_FULL`) sunt acordabile **doar** dacă `parent_role_id = admin`
- Modificările la roluri custom sunt logate în AUDIT_LOG cu `action=ROLE_DEFINITION_CHANGED`

**Exemple roluri custom valide:**

| Custom Role | Parent | Permisiuni adiționale |
|---|---|---|
| `lead_qualifier` | `senior_agent` | `LEAD_BULK_REASSIGN` |
| `compliance_officer` | `manager` | `GDPR_FULL_EXPORT` · `AUDIT_LOG_FULL` (read) |
| `regional_manager` | `manager` | `MULTI_TEAM_VIEW` |

### 10.4 Permisiuni atomice (extras — listă completă în Tech Spec)

| Code | Risk | Descriere |
|---|---|---|
| `LEAD_OWN_RW` | low | CRUD pe lead-urile proprii |
| `LEAD_TEAM_R` | medium | Vizibilitate lead-uri echipă |
| `LEAD_FIREWALL_OVERRIDE` | high | Forțare lead sub LS threshold |
| `DEAL_TEAM_R` | medium | Vizibilitate deal-uri echipă |
| `AUDIT_LOG_READ` | high | Citire AUDIT_LOG |
| `AUDIT_LOG_FULL` | critical | Acces complet AUDIT_LOG |
| `GDPR_EXPORT` | high | Export date GDPR |
| `GDPR_ERASURE` | critical | Executare cerere ștergere |
| `SCORING_WEIGHTS_TUNE` | critical | Modificare ponderi formule scoring |
| `TENANT_MANAGE` | critical | Management tenant (users, billing, plan) |
| `ROLE_DEFINITION_RW` | critical | Creare/editare roluri custom (doar Agency Pro) |
| `WHITE_LABEL_CONFIG` | high | Configurare brand per-agency (FRANCHISE) |

---

## 11. Roadmap — 4 Faze

### Phase 0 — Security Foundation ⛔ BLOCANT (Luna 0)

> Niciun alt cod de aplicație nu poate fi scris înainte de completarea acestei faze.

- JWT RS256 + RBAC system roles (5 default)
- ★ Entitate TENANT + tenant_id pe toate entitățile core (multi-tenant ready)
- ★ Entitate ROLE + PERMISSION + ROLE_PERMISSION (system roles seed la deploy)
- GDPR câmpuri LEAD + consent management
- AUDIT_LOG + middleware logging
- Webhook HMAC-SHA256 verification
- Rate limiting endpoint-uri publice
- Privacy Policy + Cookie Policy legal

### Phase 1 — Core (Luna 1–3)

- Tenancy modes activate: `SOLO` + `AGENCY` ★
- Tenant Onboarding Flow (signup → tenant_type selection → seed roles) ★
- Property Management + câmpuri tehnice noi
- Lead Management + câmpuri GDPR
- Lead Score cu LS_initial = 0.30
- Lead Score Initialization Engine ★
- Entitate SHOWING + feedback vizionare ★
- Entitate OFFER + lanț oferte ★
- Entitate ACTIVITY + log interacțiuni ★
- Showcase Links: rate limiting + 410 page
- Agent Dashboard cu APS_default = 0.65 (UI adaptat per tenant_type) ★

### Phase 2 — Intelligence (Luna 4–6)

- Tenancy modes activate: `NETWORK_FLAT` + `NETWORK_LED` + `AGENCY_CUSTOM` ★
- Custom Role Builder UI (Agency Pro tier) ★
- Match Engine cu IS Formula completă
- DP complet cu IS calculabil
- NBA Score scala [0, 2.0] + UTC+2
- Lead Firewall + Manager Override + AUDIT (comportament per tenancy ★)
- Escalation Protocol 3 niveluri SLA ★
- DHI cu TF_default = 0.70
- Negotiation cu OFFER chain history
- Concurrent access protection (optimistic locking) ★
- Lead pool sharing pentru NETWORK_FLAT (round-robin + LS-weighted) ★

### Phase 3 — Optimization (Luna 7–12)

- Tenancy mode `FRANCHISE` activat ★
- White-label config per-agency (logo, paletă, domeniu custom) ★
- Cross-agency referral tracking + comision split ★
- AI Pricing, Advanced Analytics
- Dynamic Pricing, Deal Loss Analyzer
- API Public + Webhooks outbound
- Mobile App iOS/Android (offline support) ★
- WCAG 2.1 AA compliance ★
- pgvector HNSW + Redis cache invalidation ★

---

## 12. Acceptance Criteria Esențiale

Criterii obligatorii pentru release. Lista completă în Spec v1.1, Secțiunea 12.

### Lead Firewall

| ID | Criteriu |
|---|---|
| AC-LF-01 | Lead cu LS ≥ 0.60 + contact valid → queue agent în ≤ 2 minute de la calcul |
| AC-LF-02 | Lead cu LS < 0.60 → NU apare în dashboard agent; intră în nurturing în ≤ 5 minute |
| AC-LF-03 | Manager poate face override pe LS < 0.60; acțiunea logată în AUDIT_LOG cu user_id, lead_id, motiv, timestamp |
| AC-LF-04 | La override → lead apare în queue agent desemnat în ≤ 2 minute |
| AC-LF-05 | Lead duplicate (fuzzy match >85%) → marcat automat + notificare agent |

### Lead Score

| ID | Criteriu |
|---|---|
| AC-LS-01 | Lead nou fără date suplimentare → LS_initial = 0.30 (nu 0) |
| AC-LS-02 | LS actualizat în ≤ 30 secunde de la orice interacțiune |
| AC-LS-03 | Lead cu budget valid + telefon verificat → LS ≥ 0.40 după prima evaluare |
| AC-LS-04 | Modificare manuală budget → recalcul LS imediat |
| AC-LS-05 | LS ∈ [0.0, 1.0] în orice condiție de input |

### Showcase Link

| ID | Criteriu |
|---|---|
| AC-SL-01 | Link expirat → HTTP 410 Gone + pagina "Link Expirat" cu contact agenție |
| AC-SL-02 | 5 token-uri greșite consecutive de pe același IP → blocare 60 minute |
| AC-SL-03 | Vizualizare showcase → ACTIVITY înregistrată în ≤ 5 secunde |
| AC-SL-04 | Analytics showcase → dashboard agent în ≤ 1 minut |
| AC-SL-05 | Regenerare token → link vechi → HTTP 410 imediat |

### Deal Health Index

| ID | Criteriu |
|---|---|
| AC-DHI-01 | Deal fără activitate 5 zile → DHI recalculat cu RF comunicare (0.3) + alertă manager |
| AC-DHI-02 | Deal cu DHI < 0.40 → marcat roșu în Pipeline Board + secțiunea "Deal-uri în Risc" |
| AC-DHI-03 | expected_close_date NULL → DHI calculat cu TF = 0.70 + warning vizibil în Deal Detail |
| AC-DHI-04 | DHI actualizat în ≤ 10 minute de la modificare deal sau activitate asociată |

### Edge Cases Obligatorii

| # | Input | Expected Output | Verificare |
|---|---|---|---|
| T01 | LS cu toți factorii = 0 (lead nou) | LS = 0.30 (LS_initial) | Verificat în BD la INSERT lead |
| T02 | NBA cu Δt = 100 zile (deal inactiv) | NBA ≈ 0 (e^−10 ≈ 0.0000454) | Deal apare ultimul în task sort |
| T03 | DHI cu TF = 0 (deal la scadență) | DHI = 0 → alertă critică < 5 min | Alert trimis automat managerului |
| T04 | PS cu LF la 90+ zile listing | LF = 0.0 → PS penalizat 10% | PS scade față de listing nou |
| T05 | APS agent nou (0 deal-uri) | APS = 0.65 (default) | DP nu penalizat artificial |
| T06 | DP=1.0, UF=2.0, Δt=0 | NBA = 2.0 (maxim posibil) | Deal apare primul în task queue |
| T07 | OFFER chain: A → B → C → D | counter_to_offer_id corect per rând | Navigare completă lanț oferte |

---

## 13. KPI & Metrici de Succes

| KPI | Baseline | Țintă | Fază |
|---|---|---|---|
| Timp mediu vânzare | Baseline actual | −40% | Phase 2 |
| Rata conversie lead → deal | Baseline actual | +35% | Phase 2 |
| Deal-uri per agent simultan | ~1-2 | 3× | Phase 1-2 |
| SLA răspuns lead urgent | Manual / variabil | <15 minute | Phase 2 |
| Lead HOT nealocat > SLA | Frecvent | 0 (zero) | Phase 2 |
| GDPR compliance | Neconform | 100% | Phase 0 |
| Agenți noi onboardați ≤ 7 zile | N/A | ≥80% | Phase 1 |
| NPS client post-tranzacție | N/A | Capturat 100% | Phase 1 |

---

## 14. Constrângeri & Dependențe

### 14.1 Constrângeri tehnice

| # | Constrângere |
|---|---|
| C-01 | Phase 0 Security este blocantă — niciun cod de aplicație fără aceasta |
| C-02 | WhatsApp templates trebuie trimise cu ≥2 săptămâni înainte de lansare |
| C-03 | Single session per agent — arhitectură de autentificare afectată |
| C-04 | AUDIT_LOG APPEND-ONLY implementat la nivel de BD (trigger / policy) |
| C-05 | Optimistic locking cu version field pe toate entitățile cu scoruri |
| C-06 | Timezone forțat UTC+2 (Chișinău) pentru toate calculele temporale |

### 14.2 Dependențe externe

| Dependență | Detaliu | Timp estimat |
|---|---|---|
| Meta WhatsApp API | 5 templates pre-aprobate | 24-48h aprobare |
| Meta Lead Ads webhook | HMAC-SHA256 · Dead Letter Queue | - |
| Google Ads webhook | Verificare signature | - |
| OLX webhook | Integrare platformă locală | - |
| Supabase Auth / Auth0 | Provider autentificare | - |
| Google Calendar | calendar_sync_token pe AGENT | Phase 2 |

### 14.3 Riscuri identificate

| Risc | Severitate | Mitigare |
|---|---|---|
| Meta întârzie aprobarea templates WhatsApp | RIDICAT | Submisie cu ≥2 săptămâni înainte |
| Race conditions la calculul scorurilor | CRITIC | Optimistic locking implementat Phase 0 |
| GDPR neconform la lansare | CRITIC | Phase 0 obligatorie · legal review |
| APS_default absent → agenți noi penalizați | RIDICAT | Implementat Phase 1 |
| IS formulă absentă → DP incomplet | CRITIC | IS implementat Phase 2 (din ACTIVITY) |

---

## 15. Glosar

| Termen EN | Termen RO | Definiție |
|---|---|---|
| AOS | Sistem de Operare pentru Agenți | Ce este REVYX — nu CRM clasic |
| Lead Score (LS) | Scorul Clientului Potențial | Probabilitate de cumpărare [0,1] · actualizat la fiecare interacțiune |
| Property Score (PS) | Scorul Proprietății | Atractivitatea proprietății pe piață [0,1] |
| Deal Probability (DP) | Probabilitate Tranzacție | Șansa client+proprietate specifică → deal [0,1] |
| Interaction Strength (IS) | Intensitate Interacțiuni | Activitatea clientului [0,1] · din ACTIVITY |
| Agent Performance Score (APS) | Scor Performanță Agent | Eficiența agentului rolling 90 zile [0,1] |
| Trust Score (TS) | Scor de Fiabilitate | Credibilitatea clientului [0,1] |
| Deal Health Index (DHI) | Indice Sănătate Dosar | Starea deal-ului activ [0,1] |
| Next Best Action (NBA) | Acțiunea Prioritară Recomandată | Task prioritar pentru agent [0, 2.0] |
| Lead | Client Potențial | Persoana interesată să cumpere |
| Deal | Dosar de Tranzacție | Legătura client-proprietate-agent activă |
| Showing | Vizionare | Vizita fizică la proprietate |
| Matching | Potrivire Automată AI | Buyer ↔ Property pe 12 criterii |
| Nurturing | Cultivare Automată | Secvență auto pentru lead-uri nedecise |
| Firewall | Filtru de Calificare | Bariera LS ≥ 0.60 + contact valid |
| Escalation | Escaladare Urgentă | 3 niveluri automate la depășire SLA |
| Pipeline | Tabloul Dosarelor Active | Kanban al tranzacțiilor active |
| Showcase Link | Pagina de Prezentare | Link public unic cu token 6 caractere |
| SLA | Timp Maxim de Răspuns | 15 min (urgent) / 2h (calificat) / 24h (warm) |
| Override | Derogare Manuală Manager | Forțare lead sub LS threshold → agent |
| RBAC | Control Acces pe Roluri | 5 niveluri: agent → senior → TL → manager → admin |
| AUDIT_LOG | Jurnal Imutabil | APPEND-ONLY · acces exclusiv admin |
| NBA | Next Best Action | Task prioritar recomandat de AI |
| LF | Listing Freshness | Penalizare listing >90 zile: LF = 1 − zile/90 |
| DHI | Deal Health Index | Sănătatea unui deal activ |
| TF | Time Factor | Factor temporal pentru DHI · default 0.70 |
| UF | Urgency Factor | Factor urgență pentru NBA · [1.0 – 2.0] |
| Δt | Delta timp | Zile de la ultima interacțiune pentru NBA |
| Tenant ★ | Tenant | Container root al unei instanțe (agent solo, agenție, network sau franciză) |
| Tenancy Model ★ | Model de Tenancy | Unul din 6: SOLO, NETWORK_FLAT, NETWORK_LED, AGENCY, AGENCY_CUSTOM, FRANCHISE |
| System Role ★ | Rol Sistem | Unul din 5 roluri default imutabile: agent, senior_agent, team_lead, manager, admin |
| Custom Role ★ | Rol Custom | Rol definit în-app de tenanți Agency Pro, moștenește dintr-un system role |
| Permission ★ | Permisiune Atomică | Unitate minimă de acces (ex: LEAD_FIREWALL_OVERRIDE) |
| White-label ★ | Branding Per-Agency | Override brand (logo, paletă) pentru tenanți copil într-un FRANCHISE |

---

## 16. Aprobare

| Rol | Responsabilitate | Semnătură | Data |
|---|---|---|---|
| Senior PM | Validare business logic & roadmap | ___________________________ | Aprilie 2025 |
| Solution Architect | Validare data model & formule v1.1 | ___________________________ | Aprilie 2025 |
| Senior Product Designer | Validare UX & Showcase | ___________________________ | Aprilie 2025 |
| Senior Automation Tester | Validare AC & edge cases | ___________________________ | Aprilie 2025 |
| Manual Tester | Validare fluxuri complete | ___________________________ | Aprilie 2025 |

---

*BRD_REVYX_v1.1.0.md · v1.1.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
