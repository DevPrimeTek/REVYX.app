# WORKFLOW — REVYX Property Onboarding
<!-- WORKFLOW_REVYX_property-onboarding_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Solution Architect | Workflow inițial — INTAKE → VALIDATION → PRICING → SHOWCASE_PUBLISH → MONITORING |

---

## Cuprins

1. [Executive Summary](#1-executive-summary)
2. [Actori implicați](#2-actori-implicați)
3. [Pre-conditions](#3-pre-conditions)
4. [Flow Diagram](#4-flow-diagram)
5. [Etape detaliate](#5-etape-detaliate)
6. [Decision points](#6-decision-points)
7. [Timing & SLA](#7-timing--sla)
8. [Score impacts](#8-score-impacts)
9. [AUDIT_LOG events](#9-audit_log-events)
10. [Notifications](#10-notifications)
11. [Error / Exception paths](#11-error--exception-paths)
12. [Post-conditions](#12-post-conditions)
13. [Acceptance Criteria](#13-acceptance-criteria)
14. [Glosar specific](#14-glosar-specific)
15. [Impact Assessment](#15-impact-assessment)

---

## 1. Executive Summary

Workflow Pilon 02 — Supply Intelligence: ciclu complet de la primirea unei proprietăți de la un proprietar până la publicare cu showcase link și monitorizarea în piață. 5 etape principale.

| Atribut | Valoare |
|---|---|
| **Scope** | INTAKE → VALIDATION → PRICING → SHOWCASE_PUBLISH → MONITORING |
| **Referință BRD** | §5 Pilon 02 · §6.1 BR-08 · §7.2 PS · §12 AC-SL-* + edge T04 |
| **Tech spec referite** | property v1.0.0 · showcase-links v1.0.0 · audit-log v1.0.0 |
| **Aplicabilitate** | Toate transaction_type (sale, rent) și property_type (apartment, house, commercial, land, office) |

---

## 2. Actori implicați

| Actor | Token culoare | Sistem | Responsabilitate |
|---|---|---|---|
| 🏠 **Proprietar / Vânzător** | `--sel` | extern + REVYX | Furnizează proprietate · semnează mandat · aprobă preț |
| 🤝 **Agent Imobiliar** | `--agt` | REVYX | Onboarding · validare date tehnice · publish |
| 🤖 **Sistem REVYX AI** | `--ai` | REVYX | PS calc · LF degradare · pricing AI hooks · embedding |
| 👔 **Manager Agenție** | `--mgr` | REVYX | Approval pricing diferit de AI · oversight inventar |
| 📱 **Platforme externe** | `--soc` | extern | (opțional Phase 2) sindicare listing → OLX, fotocasa |

---

## 3. Pre-conditions

- Tenant `ACTIVE` (vezi tenant-lifecycle).
- Agent `is_active = true` cu RBAC `agent` sau superior.
- TECH_SPEC property + showcase-links deployed cu feature flag ON.
- Mandat semnat cu proprietarul (legal precondition — verificat manual la VALIDATION).
- Cel puțin 1 baseline `property_market_baseline` existent pentru `(city, district, property_type)` SAU fallback graceful 0.50 acceptat.

---

## 4. Flow Diagram

```mermaid
flowchart TD
  S[🏠 Seller] -->|trimite informații| A[🤝 Agent]
  A -->|POST /properties<br/>DRAFT| AI1[🤖 Property Intake]
  AI1 -->|INSERT property<br/>status=DRAFT, LF=1.0| DB[(PostgreSQL)]
  AI1 --> V{VALIDATION<br/>schema + mandat}
  V -->|missing fields| A
  V -->|OK| PRC[🤖 Pricing AI hook<br/>IPricingProvider stub Phase 1]
  PRC --> PS[🤖 PS calc<br/>PF/LD/PQ/MV/LF]
  PS -->|UPDATE property<br/>property_score| DB
  PS --> EMB[🤖 Embedding async<br/>vector(1536)]
  PS --> A2{Agent review<br/>price OK?}
  A2 -->|adjust| A
  A2 -->|publish| PUB[🤝 Publish action]
  PUB -->|generate token 6 char| SC[🤖 Showcase Service]
  SC -->|UPDATE property<br/>status=ACTIVE, showcase_token| DB
  SC -->|AUDIT SHOWCASE_LINK_GENERATED| AUD[(AUDIT_LOG)]
  PUB --> MON[🤖 Monitoring]
  MON -->|cron daily| LF[🤖 LF degradation<br/>recalc PS]
  MON -->|on visit| TRK[🤖 RF_show tracker]
  TRK --> ACT[(ACTIVITY)]
  MON -->|status change| WD[⚠ WITHDRAWN/SOLD/EXPIRED]
  WD -->|410 Gone| SC
```

---

## 5. Etape detaliate

### Etapa 1 — INTAKE (creare DRAFT)

**Trigger:** Agent crează property prin UI (`POST /api/v1/properties`) sau import bulk

**Actor:** 🤝 Agent Imobiliar

**Acțiuni:**
- Agent completează schema PROPERTY (vezi TECH_SPEC property §4.1):
  - Identificare: `property_type`, `transaction_type`, `external_ref`
  - Locație: `city`, `district`, `address_line`, `geo_lat/lng`
  - Tehnice: `area_sqm` (>0 — CHECK), `rooms`, `floor`, `condition_grade`, `year_built`
  - Financiar: `price_amount`, `price_currency` (default EUR)
  - Descriere + fotografii (referință storage extern, S3)
- Sistem INSERT `property` cu `status=DRAFT`, `LF=1.0`, `version=1`, `seller_id` (dacă seller existent în Phase 2)
- AUDIT_LOG event `PROPERTY_CREATED` în aceeași tranzacție

**AUDIT_LOG event:** `PROPERTY_CREATED`

**Score impact:** PS inițial calculat preliminar (fără MV) după INSERT — vezi Etapa 3

---

### Etapa 2 — VALIDATION (schema + mandat)

**Trigger:** post-INSERT sau acțiunea Agent „Validează"

**Actor:** 🤝 Agent + 🤖 AI

**Acțiuni sistem:**
- Validare schema (CHECK constraints + app-level Zod):
  - `area_sqm > 0`
  - `price_amount >= 0`
  - `condition_grade ∈ enum`
  - `transaction_type ∈ ('sale','rent')`
- Verificare mandat (manual — agent confirmă bifa „Mandat semnat" + upload PDF la S3 cu link în `features.mandate_pdf_ref`)
- Verificare adresă geocodat: dacă lipsă `geo_lat/lng` → reverse geocode din `address_line`
- Detecție duplicate: query pe `(city, address_line, area_sqm)` cu fuzzy >85% → flag duplicate

**AUDIT_LOG events:**
- `PROPERTY_VALIDATION_FAILED` (dacă fail) cu detalii câmpuri
- `PROPERTY_DUPLICATE_DETECTED` (dacă fuzzy match)

**Score impact:** niciuna directă (precondiție pentru Etapa 3)

---

### Etapa 3 — PRICING (AI hooks + PS calc)

**Trigger:** event `property.created` sau `property.updated`

**Actor:** 🤖 AI (Pricing + Scoring)

**Acțiuni:**
- Load `property_market_baseline` pentru `(city, district, property_type)`
  - Dacă lipsă → fallback PF/LD/MV = 0.50 + warn log
- Apel `IPricingProvider.recommendPrice(input)`:
  - **Phase 1**: `NoopPricingProvider` returnează `null` (stub)
  - **Phase 2**: `AIPricingProvider` returnează `{ recommendedPriceEur, confidence, factors }`
- Calcul PS: `PS = 0.40*PF + 0.20*LD + 0.15*PQ + 0.15*MV + 0.10*LF` (BRD §7.2)
- LF inițial = 1.0 (proprietate nouă)
- UPDATE `property.property_score`, `score_components`, `ai_recommended_price_eur`, `version++`

**Decision agent (manual):**
- Dacă `ai_recommended_price_eur` ≠ `price_amount` cu deviație >10% → UI flag „Pricing AI Recommendation"
  - Agent: ACCEPT (PATCH price) sau OVERRIDE (păstrează preț cu motivare)
  - OVERRIDE >20% deviație → necesită aprobare manager (Phase 2)

**AUDIT_LOG events:**
- `PROPERTY_SCORE_UPDATED` — old/new PS, components
- `PROPERTY_PRICING_AI_OVERRIDE` (Phase 2) — agent overrides AI suggestion

**Score impact:**
- PS calculat (full sau fallback)
- PF dependent de `price_per_sqm_eur` vs baseline median
- LF = 1.0 (T+0)

---

### Etapa 4 — SHOWCASE_PUBLISH (publish + token gen)

**Trigger:** Agent acțiune „Publish" (`POST /api/v1/properties/:id/showcase/publish`)

**Actor:** 🤝 Agent

**Pre-conditions:**
- VALIDATION OK (etapa 2)
- PS calculat (etapa 3)
- `status = DRAFT`

**Acțiuni:**
- Apel `ShowcaseService.publish(propertyId, agent, { ttlDays: 90 })` (vezi TECH_SPEC showcase-links §6.2)
- Generare `showcase_token` (6 char alfanumeric, collision check ≤5 retries)
- UPDATE PROPERTY: `status=ACTIVE`, `showcase_token`, `showcase_published_at=NOW()`, `showcase_expires_at=NOW()+90d`, `listed_at=NOW()` (pentru LF), `version++`
- Redis: `showcase:token:{token} → property_id` cu TTL = expires_at
- Generare embedding async (BullMQ job `property.embedding.generate`) → `property.embedding`

**AUDIT_LOG events:**
- `PROPERTY_PUBLISHED` — old status DRAFT → ACTIVE
- `SHOWCASE_LINK_GENERATED` — `metadata.token_hint = first2 + '****'`, `ttl_days = 90`

**Score impact:**
- Status ACTIVE → property eligibilă pentru match engine (Phase 2) și BF (Budget Fit) în lead-scoring
- LF = 1.0 (listed_at = NOW)

---

### Etapa 5 — MONITORING (post-publish ongoing)

**Trigger:** Continuu după ACTIVE

**Actor:** 🤖 AI

**Sub-procese:**

#### 5.1 LF Degradation (cron daily 02:00 UTC+2)

- Cron `property.lf.degradation` rulează zilnic
- Pentru fiecare PROPERTY ACTIVE: `LF = 1 - min(1, days_since_listed / 90)`
- Recalc PS dacă LF schimbat
- AUDIT_LOG event `PROPERTY_SCORE_UPDATED` doar dacă PS efectiv schimbat (ΔPS > 0.01)
- **Edge T04**: la 90+ zile → LF=0.0 → PS penalizat ~10% (contribuția 0.10×LF)

#### 5.2 RF_show tracking (per visit)

- Vizitator hit `/p/{token}` → INSERT `showcase_event` (vezi TECH_SPEC showcase-links §6.4)
- Aggregator job (cron 1 min) → ACTIVITY `showcase_viewed` (per `lead_id, property_id, day`)
- ACTIVITY feed-uri RF_show în IS pentru lead asociat (Phase 2 când lead matchează)

#### 5.3 Market Baseline Refresh (weekly)

- Cron Sunday 03:00 UTC+2: `property.market.baseline.refresh`
- Recalculează `median_price_sqm_eur`, `p25/p75`, `active_listings_count`, `median_days_to_sell`
- Re-trigger PS recalc pentru toate properties ACTIVE din `(city, district, property_type)` afectate

#### 5.4 Status Transitions (manual / sistem)

| Event | Acțiune | AUDIT |
|---|---|---|
| Agent „Reserve" | `ACTIVE → RESERVED` (offer accepted, pre-notarial) | `PROPERTY_RESERVED` |
| Agent „Sold" | `RESERVED → SOLD` post-notarial | `PROPERTY_SOLD` |
| Agent „Withdraw" | `* → WITHDRAWN` cu reason | `PROPERTY_WITHDRAWN` |
| Cron 180d fără update | `ACTIVE → EXPIRED` | `PROPERTY_EXPIRED` |
| Manager „Reset LF" (special) | `listed_at = NOW()` (audit-loggat strict) | `PROPERTY_LF_RESET` |

> ⚠ **Anti-gaming:** la `WITHDRAWN → re-publish`, `listed_at` rămâne neschimbat (politica TECH_SPEC property §7).

#### 5.5 Showcase Lifecycle

- Token expirat / regenerat / withdrawn → HTTP 410 Gone (BR-08, vezi showcase-links §6)
- Manager poate regenera token via `POST /properties/:id/showcase/regenerate` cu `reason` → vechiul token instant 410

---

## 6. Decision points

| # | Întrebare | Ramuri |
|---|---|---|
| D1 | Mandat semnat verificat? | DA → continuă; NU → blocaj la VALIDATION + alert agent |
| D2 | Câmpuri minime complete? | DA → continuă; NU → return errors la agent |
| D3 | Duplicate fuzzy >85% (city, address, area)? | DA → flag + manager review; NU → continuă |
| D4 | Baseline disponibilă? | DA → calcul complet PS; NU → fallback 0.50 + warn |
| D5 | Pricing AI suggested ≠ agent price? | <10% deviație → silent; 10-20% → flag UI; >20% → manager approval (Phase 2) |
| D6 | LF la cron < 0.05 (>85 zile)? | Notificare agent „Listing fades" + sugestie price adjustment |
| D7 | Status PROPERTY la `WITHDRAWN`? | Showcase token → 410 imediat · invalidate Redis |
| D8 | Manager regenerare token? | Vechiul token → 410 imediat · audit cu reason |
| D9 | EXPIRED detection (180d fără update)? | Auto-status EXPIRED + email agent · poate re-publica (LF reset prin admin only) |

---

## 7. Timing & SLA

| Etapă | Timing țintă | SLA | Sursă |
|---|---|---|---|
| INTAKE → INSERT | < 500 ms | — | UX |
| VALIDATION sync | < 1 sec | — | UX |
| PRICING + PS calc | < 1.5 sec | — | NFR (TECH_SPEC property) |
| Embedding async | < 3 sec p95 | — | NFR (TECH_SPEC property) |
| SHOWCASE_PUBLISH | < 800 ms | — | UX |
| LF Degradation cron | < 30 min @ 100k properties | — | NFR |
| Market Baseline Refresh | < 60 min weekly | — | Capacity |
| Showcase analytics | ≤ 1 min refresh | NFR-04 | BRD |

---

## 8. Score impacts

| Etapă | Scor afectat | Tip impact | Magnitude |
|---|---|---|---|
| INTAKE (DRAFT) | PS | Init preliminary | Calcul fără LF/MV stable |
| VALIDATION | — | — | — |
| PRICING (Phase 1 stub) | PS | Update | PF din baseline median |
| PRICING (Phase 2 AI) | PS | Update | PF blended cu AI confidence |
| PUBLISH | PS, LF | Update | LF=1.0, status ACTIVE |
| LF Degradation 30 zile | PS | Penalizare | LF≈0.67 → ΔPS ≈ -0.033 |
| LF Degradation 60 zile | PS | Penalizare | LF≈0.33 → ΔPS ≈ -0.067 |
| LF Degradation 90+ zile (T04) | PS | Penalizare | LF=0 → ΔPS ≈ -0.10 |
| Showcase view (per IP unic) | RF_show (în IS lead) | Boost | +1 incrementare în RF_show window |
| Market baseline shift | PS | Recalc | depinde de median delta |
| WITHDRAWN | PS | Freeze | Property nu mai e candidate |
| SOLD | PS | Final | Property terminal — apare în statistici close |

---

## 9. AUDIT_LOG events

| Event | Etapă | Severity |
|---|---|---|
| `PROPERTY_CREATED` | 1 | INFO |
| `PROPERTY_VALIDATION_FAILED` | 2 | WARN |
| `PROPERTY_DUPLICATE_DETECTED` | 2 | INFO |
| `PROPERTY_UPDATED` | 1/3 (PATCH) | INFO |
| `PROPERTY_SCORE_UPDATED` | 3 + 5.1 + 5.3 | INFO |
| `PROPERTY_PRICING_AI_OVERRIDE` (Phase 2) | 3 | WARN |
| `PROPERTY_PUBLISHED` | 4 | INFO |
| `SHOWCASE_LINK_GENERATED` | 4 | INFO |
| `SHOWCASE_TOKEN_REGENERATED` | 5.5 | WARN |
| `PROPERTY_RESERVED` / `_SOLD` / `_WITHDRAWN` / `_EXPIRED` | 5.4 | INFO |
| `PROPERTY_LF_RESET` (admin) | 5.4 | WARN (admin only) |

Toate events păstrate per retention AUDIT_LOG (7 ani — vezi audit-log §10).

---

## 10. Notifications

| Eveniment | Canal | Destinatar | Template |
|---|---|---|---|
| Validation failed | Push | agent | intern |
| Duplicate detected | Push + email | agent + team_lead | intern |
| Pricing AI suggestion 10-20% off | Push | agent | intern |
| Pricing AI suggestion >20% off (Phase 2) | Push + email | agent + manager | intern (approval flow) |
| Property published | Push + email | agent + seller (opțional) | intern + email tranzacțional |
| Showcase link send to buyer | WhatsApp | buyer | `showcase_link` (Meta-aprobat — BR-09) |
| LF < 0.20 (75+ zile) | Push | agent | intern „Listing aging" |
| EXPIRED auto | Email digest | agent + team_lead | intern |
| WITHDRAWN | Email | seller (notificare formală) | intern tranzacțional |
| Token regenerated | Email | agent | intern audit |

---

## 11. Error / Exception paths

| Eroare | Etapă | Acțiune |
|---|---|---|
| `area_sqm <= 0` | 1 | 422 + return errors la agent |
| Mandat lipsă PDF | 2 | 422 + blocaj publish · UI prompts upload |
| Geocoding fail | 2 | Continuă cu adresa text-only · warn log |
| Baseline missing | 3 | Fallback 0.50 + cron baseline refresh forțat |
| `IPricingProvider` 5xx (Phase 2) | 3 | Retry 3× backoff · skip cu null fallback |
| Optimistic conflict pe property | 3/4/5 | Retry max 3× cu backoff |
| Token collision exhausted (5×) | 4 | 500 + alert SecOps (PRNG check) |
| Embedding provider down | 4 (async) | Retry exponențial · fallback local model · skip non-blocking |
| LF cron lag >24h | 5.1 | Alert + manual rerun |
| EXPIRED detection ratează | 5.4 | Re-run manual + adjust cron |
| Showcase regenerate fail (Redis down) | 5.5 | Retry + fallback DB lookup (degraded perf) |

---

## 12. Post-conditions

| Stare finală | Garanții |
|---|---|
| **ACTIVE** | PS calculat · showcase_token activ · LF degradation cron armed · embedding generated · market baseline tracked |
| **RESERVED** | Status freeze · OFFER chain accepted · pre-notarial in progress |
| **SOLD** | Status terminal · sold_at populat · PS arhivat · market baseline include tranzacție |
| **WITHDRAWN** | Status terminal (re-pub posibilă fără LF reset) · showcase 410 Gone · audit reason logat |
| **EXPIRED** | Status terminal · auto-detected 180d inactivitate · re-pub via admin LF_RESET |

---

## 13. Acceptance Criteria

Validare AC din BRD §12 + spec edge cases:

| AC / Edge | Validare |
|---|---|
| **T04** | Property la 90+ zile → LF=0.0 → PS penalizat ~10% (E2E cron simulation) |
| **AC-SL-01** | Showcase link expirat → HTTP 410 + pagina „Link Expirat" (din showcase-links spec) |
| **AC-SL-05** | Token regenerat → vechiul → 410 imediat |
| Schema validation | `area_sqm <= 0` → 422 (CHECK constraint) |
| Duplicate detection | Property cu același `(city, address, area)` fuzzy >85% → flag + agent notification |
| Pricing AI override audit (Phase 2) | Agent override >20% → manager approval + AUDIT |

---

## 14. Glosar specific

| Termen | Sensul |
|---|---|
| **INTAKE** | Etapa 1 — agent crează DRAFT property |
| **VALIDATION** | Etapa 2 — schema + mandat + duplicate check |
| **PRICING** | Etapa 3 — AI hook + PS calc |
| **SHOWCASE_PUBLISH** | Etapa 4 — token gen + status ACTIVE |
| **MONITORING** | Etapa 5 — LF degradation + RF_show + baseline + status mgmt |
| **LF Degradation** | Penalizare temporală PS: `LF = 1 - min(1, days/90)` |
| **Mandat** | Document legal semnat seller→agency (PDF în storage S3) |
| **Reset LF** | Acțiune admin only: `listed_at = NOW()` cu audit (anti-gaming protection) |

---

## 15. Impact Assessment

### 15.1 Scope of Change

| Element | Detaliu |
|---|---|
| Document | WORKFLOW_REVYX_property-onboarding_v1.0.0.md |
| Tip schimbare | NEW |
| Aria afectată | Pilon 02 (Supply) · entitate PROPERTY · scoring PS/LF · showcase publishing |
| Origine | BRD §5 Pilon 02 · §7.2 PS · §6.1 BR-08 · §12 edge T04 + AC-SL-* |

### 15.2 Impact pe documente conexe

| Document | Tip impact | Acțiune |
|---|---|---|
| BRD_REVYX_v1.1.0.md | None | Reflectă mecanica spec |
| TECH_SPEC_REVYX_property_v1.0.0.md | None | Workflow consumă spec |
| TECH_SPEC_REVYX_showcase-links_v1.0.0.md | None | Etapa 4 + 5.5 referențiază |
| TECH_SPEC_REVYX_audit-log_v1.1.1.md | Minor | Catalog event extins (`PROPERTY_VALIDATION_FAILED`, `PROPERTY_DUPLICATE_DETECTED`, `PROPERTY_PRICING_AI_OVERRIDE`, `PROPERTY_RESERVED`, `PROPERTY_EXPIRED`, `PROPERTY_LF_RESET`) |
| WORKFLOW_REVYX_lead-lifecycle_v1.0.1.md | None | Paralel — demand side |
| WORKFLOW_REVYX_offer-chain (S4) | Referențiat | Etapa 5.4 RESERVED transition |

### 15.3 Impact pe scoring

| Scor | Afectat? | Detaliu |
|---|---|---|
| **PS** | DA | Calcul direct etape 3 + 5.1 + 5.3 |
| **LF** | DA | Init 1.0 etapa 4 · degradare cron 5.1 |
| **MV** | DA | Update via baseline refresh 5.3 |
| IS | DA (indirect) | RF_show feed via showcase tracking 5.2 |
| LS | DA (indirect) | BF (Budget Fit) consumă inventory din această workflow |
| DP | DA (indirect) | DP = 0.30*LS + 0.30*PS + ... |

### 15.4 Impact pe entități / schema BD

| Entitate | Modificare | Migrare |
|---|---|---|
| PROPERTY | None (definite în 0060) | — |
| PROPERTY_MARKET_BASELINE | None (definite în 0061) | — |
| SHOWCASE_EVENT | None (definite în 0070) | — |

### 15.5 Impact pe RBAC

| Rol | Permisiuni implicate |
|---|---|
| agent | CRUD property propriu · publish · withdraw · view analytics |
| team_lead | + view/edit echipă · merge duplicate |
| manager | Approval pricing override (Phase 2) · regenerate token · view tot tenant |
| admin | LF_RESET · config baseline · IPricingProvider activation |

### 15.6 Impact pe SLA & NFR

| NFR / SLA | Înainte | După | Validare |
|---|---|---|---|
| Recalc PS | nedefinit | p95 < 1.5s | Load (TECH_SPEC property) |
| LF cron | nedefinit | < 30 min @ 100k | Load |
| NFR-04 (analytics) | nedefinit | ≤ 1 min | E2E AC-SL-04 |

### 15.7 Impact pe Securitate & GDPR

| Aspect | Status | Notă |
|---|---|---|
| PII | Parțial | `address_line` redactat în AUDIT_LOG |
| AUDIT_LOG events noi | DA | Vezi §9 |
| Consent flow | NU | PROPERTY = bun, nu persoană (dar form contact buyer din showcase respectă consent în lead-lifecycle) |
| HMAC / JWT / RBAC | DA | RBAC §15.5 |
| Rate limiting | DA | Showcase /p/ moștenește NFR-07 |

### 15.8 Risks & Mitigations

| # | Risc | Probab. | Impact | Mitigare |
|---|---|---|---|---|
| R1 | Mandat absent → publishing ilegal | LOW | CRITIC | Blocaj publish la VALIDATION + audit |
| R2 | Duplicate listings inflează inventory | MED | MED | Fuzzy detection + manager review |
| R3 | Anti-gaming withdraw→re-publish reset LF | LOW | MED | `listed_at` neschimbat la re-pub (TECH_SPEC §7) |
| R4 | Baseline stale → PS underfit | MED | MED | Cron weekly refresh + alert pe lag |
| R5 | Pricing AI hallucinations (Phase 2) | MED | HIGH | Manager approval >20% deviație + confidence threshold |
| R6 | Showcase token leak prin Referer | LOW | MED | `Referrer-Policy: same-origin` (TECH_SPEC showcase-links §12) |
| R7 | EXPIRED detection ratează properties idle | LOW | LOW | Cron daily + manual run capability |

### 15.9 Test Plan

Vezi §13. Edge T04 (LF=0.0 la 90 zile) obligatoriu E2E.

### 15.10 Rollout & Rollback

| Aspect | Detaliu |
|---|---|
| Feature flag | Compus: `flag.property_engine_v1.enabled` + `flag.showcase_links_v1.enabled` |
| Strategie rollout | canary 10% → 50% → 100% în 2 săptămâni |
| Rollback | Flags OFF · properties existente păstrate read-only · DOWN migrations |
| Owner | Senior PM + Solution Architect |

### 15.11 Approval Gate

| Aprobator | Necesar pentru |
|---|---|
| Senior PM | Workflow alignment cu BRD §5 Pilon 02 |
| Solution Architect | Tranziții stare + cron orchestration |
| Security Lead | Audit events + token leak prevention |
| Legal / DPO | Mandat verification flow + GDPR (lead form via showcase) |

---

*docs/workflow/WORKFLOW_REVYX_property-onboarding_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
