# REVYX — Pitch Deck (RO)
<!-- docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/deck-ro.md · v1.2.0 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Stage:** M0.S4 / M1.S3 (update AGI Layer) — Pitch Deck (T-M0.S4-02 RO, T-M0.S4-05 speaker notes RO)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.2 AC-M0-04
**Brand ref:** `docs/brand-configs/revyx.md` §1 (claim) + §2 (paletă) + §3 (tipografie) + §7 (ton)

## 0.1 Platform Matrix

🌐 **WEB demo only.** Toate screenshot-uri trase din `apps/web-preview/` (Next.js 14). Mobile companion menționat doar slide 10 Arhitectură ca livrabil M2.S3 (vezi `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §17).

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| **1.2.0** | **2026-06** | ★ DESIGNER (Creative Director) + Senior PM | ★ MINOR — Corecție număr piloni: **6 → 8 Piloni** (PM directive). Slide 05 rescris cu tabel complet 8 Piloni × motor × scală × descriere (mapați 1:1 cu BRD §7 v1.3.0). Pipeline diagram extins: 8 noduri individuale (LS / PS / IS·3 / NBA / DP / DHI / TS+PKI / APS). Speaker note actualizat. Changelog v1.1.0 → v1.2.0. |
| **1.1.0** | **2026-06** | DESIGNER (Creative Director) + Senior PM | MINOR — Sync cu BRD v1.3.0 (AGI Layer §18) + M1.S1/M1.S2 milestones ✅. Slide 05: 5→6 Piloni (parțial); NEW Slide 05b AGI Layer; Slide 11 ✅; Slide 13 AGI roadmap; Slide 14 traction extinsă. |
| 1.0.0 | 2026-05 | DOC + DESIGNER (Creative Director) + ARCHITECT + Senior PM | ★ INITIAL — 16 slides RO + speaker notes inline. Hook (slide 1), Problem (2), Solution (3), Market (4), Product overview (5), 4 demo slides (6-9), Tech (10), Trust (11), Business (12), Roadmap (13), Team (14), Ask (15), Closing (16). |

---

## SLIDE 01 — Cover

**Headline:** REVYX
**Subheadline:** Real Estate Execution Intelligence
**Tagline:** Nu un CRM. Un Agent Operating System pentru imobiliare.
**CTA secundar:** Demo live → `demo.revyx.app`
**Visual:** Logo REVYX centrat pe navy `#0C1428` + glow gold radial · grid overlay subtle · footer "© 2026 REVYX · ITPRO SYSTEM SRL"

> _Speaker note RO:_ "Bună ziua. Sunt {{NUME PM}} și astăzi vă prezint REVYX — primul Agent Operating System gândit pentru piața imobiliară din Republica Moldova. Nu construim încă un CRM. Construim un sistem care preia controlul fluxului de tranzacții și ghidează agentul, pas cu pas, către închidere." _(30s)_

---

## SLIDE 02 — Problema

**Headline:** Agenții imobiliari sunt copleșiți. Pierderile sunt mascate.

**Trei probleme principale (3 carduri navy-card cu accent gold top):**

1. **Lead overflow fără calificare** — Un agent primește 80-150 lead-uri/lună din 8 surse (Meta, Google, OLX, recomandări, walk-in). Doar 12-18% sunt reali. Restul = timp irosit.
2. **Pipeline opac pentru manager** — Niciun manager nu știe în timp real care deal e sănătos și care e pe cale să cadă. Decizii de escalare se iau prea târziu.
3. **Performanță agent nemăsurată corect** — APS (Agent Performance Score) lipsește. Bonus + alocare lead = subiectiv, dependent de manager.

**Footer impact:** ~70% pipeline value pierdut pe lead-uri nelivrate la timp (SLA missed > 24h) sau deal-uri abandonate fără follow-up structurat.

> _Speaker note RO:_ "Am vorbit cu 23 de agenții imobiliare din Chișinău și Bălți. Aceleași trei dureri, mereu. Un agent bun pierde 30% din timpul productiv pe lead-uri care nu se vor închide niciodată. Iar managerul descoperă pierderea după două săptămâni — atunci când e prea târziu să intervină." _(60s)_

---

## SLIDE 03 — Soluția: REVYX AOS

**Headline:** Un Agent Operating System pentru imobiliare

**4 diferențiatori (2x2 grid cards):**

| 🛡️ **Lead Firewall** | 🤖 **NBA Layer** |
|---|---|
| Doar lead-uri cu LS ≥ 0.60 + contact valid ajung la agent (BR-01). Restul intră în nurturing automat. | Next-Best-Action recomandat în timp real pe fiecare lead/deal: call, WhatsApp, vizionare, follow-up. NBA ∈ [0, 2.0]. |

| ⏱️ **Max 3 task active** | 🔥 **Escalation 3 niveluri** |
|---|---|
| Forțăm focus: niciun agent nu lucrează mai mult de 3 deal-uri active simultan (BR-04). | T+SLA → T+SLA+30min → T+SLA+2h. Niciun lead HOT (LS ≥ 0.75) nu rămâne neatins peste 15 min. |

**Footer claim:** *REVYX nu cere agentului ce să facă. Îi spune.*

> _Speaker note RO:_ "Diferența între CRM și AOS e fundamentală. Un CRM stochează date și raportează. Un AOS prioritizează, alocă, escaladează — face execuția. Cele 4 reguli de business pe care le vedeți aici sunt non-negociabile: sunt encoded direct în engine. Niciun manager nu le poate ocoli. Asta înseamnă predictibilitate." _(60s)_

---

## SLIDE 04 — Piața

**Headline:** Republica Moldova — piață sub-digitalizată, agenții pregătite de salt

**Cifre cheie (navy-card mono numbers):**

- **~400 agenții imobiliare** active în RM (estimare 2025, focus Chișinău + Bălți + Cahul)
- **~2.800 agenți individuali** licențiați (Camera de Comerț + Asociația Agenților Imobiliari MD)
- **0 platforme AOS** specifice. Concurența curentă: Excel + WhatsApp + 1-2 CRM-uri generice rusești/românești neadaptate
- **TAM RM (SaaS):** ~€5M/an la full penetration (50€/agent/lună × 8.400 agenți regionali România+Moldova combinat)

**Extensii Phase 5 (slide footer):** România (București + Cluj + Timișoara) · Ucraina post-stabilizare · Buyer-side marketplace (`marketplace-two-sided`) · White-Label Enterprise (tenant brand-config)

> _Speaker note RO:_ "Piața RM nu e mică. E neglijată. Ucrainele și românește îți vând tool-uri din 2017 care nu vorbesc românește, nu calculează scoring AI și nu au modul de escalare. Noi suntem nativi. Construim de la zero pentru aici, cu lege RM-compliant — Legea 133/2011 GDPR + Legea 142/2018 SaaS — și extindere ulterioară pe RO/UA." _(45s)_

---

## SLIDE 05 — 8 Piloni AI + Agent Growth Intelligence

**Headline:** O singură platformă. Opt motoare AI + un strat de creștere agent.

**Diagrama (pipeline 8 noduri + AGI Layer jos):**

```
[ LS ]  →  [ PS ]  →  [ IS·3 ]  →  [ NBA ]  →  [ DP ]  →  [ DHI ]  →  [ TS+PKI ]  →  [ APS ]
                                       ↕ feedback loop continuu
                         ★ [ Agent Growth Intelligence (AGI Layer — strat transversal) ]
```

**8 Piloni (BRD §5 v1.3.0 — mapați 1:1 cu §7 scoring formulas):**

| # | Pilon | Motor | Scală | Ce face |
|---|---|---|---|---|
| 01 | Lead Intelligence | **LS** | [0,1] | Califică automat lead-urile la intake. Firewall BR-01: LS ≥ 0.60. |
| 02 | Supply Intelligence | **PS** | [0,1] | Evaluează calitatea + freshness-ul proprietăților. |
| 03 | Match Intelligence | **IS** | [0,1] | ★ 3 sub-dimensiuni: frecvență · calitate · reciprocitate interacțiune. |
| 04 | Execution Intelligence | **NBA** | **[0, 2.0]** | Acțiunea optimă acum. Singura excepție de scală. ★ Ghiduri execuție. |
| 05 | Negotiation Intelligence | **DP** | [0,1] | Probabilitatea de închidere a unui deal. |
| 06 | Deal Intelligence | **DHI** | [0,1] | Sănătatea continuă: TF · UF · RF. Flag review (BR-05). |
| 07 | Performance Intelligence | **APS** | [0,1] | Scorul agentului. Baza alocării + bonus. BR-11: default 0.65. |
| 08 | ★ Trust Intelligence | **TS + PKI** | [0,1] | ★ Extins cu PKI (Promise Keeping Index, BR-26). Target ≥ 0.75. |

**★ AGI Layer (strat transversal §18):** 7 dimensiuni (slide următor) — transformă AOS din sistem de control în sistem de dezvoltare agent.

**Footer:** *8 Piloni core (BRD §5) = 8 formule scoring (BRD §7). Validate T01-T07. NBA singura excepție scală [0, 2.0].*

> _Speaker note RO:_ "Opt motoare. O singură stivă. Față de versiunea inițială am adăugat Pilon 08 Trust Intelligence — un agent care respectă promisiunile față de client câștigă Trust Score mai mare și primește lead-uri mai bune. Și am separat toate cele 8 motoare distinct: nu mai grupăm DP cu DHI, sau PS cu IS — fiecare motor are un scop propriu, măsurabil. Asta înseamnă responsabilitate clară și debugging rapid în producție." _(75s)_

---

## SLIDE 05b — ★ Agent Growth Intelligence (AGI Layer)

**Headline:** REVYX nu controlează agentul. Îl dezvoltă.

**Subheadline:** 7 dimensiuni. Un sistem care crește profesioniști imobiliari, nu doar pipeline.

**Grid 7 carduri (3+3+1 centrat, navy-card cu accent gold top, ★ badge pe fiecare):**

| 🤝 Relationship Intelligence | 🎯 Obiective lunare | 📖 Ghiduri de execuție |
|---|---|---|
| IS cu 3 sub-dimensiuni (frecvență · calitate · reciprocitate) + PKI (Promise Keeping Index) în Trust Score. Agentul vede cât de mult are încredere clientul în el. | Tracker lunar: deal-uri țintă · scor performanță · comision estimat. Progress vizibil zilnic. Dashboard personal. | Template per tip acțiune NBA: script apel / WhatsApp / vizionare / follow-up / ofertă. 1-click din sugestia sistemului. |

| ⚖️ Puncte de etică | 💼 Toolkit valoare agent | 👥 Alumni – relație post-deal |
|---|---|---|
| 4 situații sensibile: reprezentare duală · oferte concurente · disclosure proprietate · gap finanțare. Human-in-the-loop obligatoriu (BR-28, Art. 22 GDPR). | Card argumentare valoare pentru agent (contra comision). Adaptat per tip client + tip tranzacție. | Contact T+12 luni (aniversare mutare) + T+24 (potențial recomandare sau upgrade). Alumni Return Rate target ≥ 15%. |

**Centrat jos — ★ Moldova-specific (BR-25):**

| 💰 Disponibilitate financiară |
|---|
| Buget declarat vs confirmat (divergență 15-25% piață RM) + pre-aprobare bancară (MoldIndConBank / Victoriabank / Mobiasbancă). Agent știe din prima dacă lead-ul este realist qualificat. |

**Footer claim:** *AOS care crește agentul, nu doar pipeline-ul.*

**KPI-uri AGI noi (BRD §18):**
- PKI team average ≥ 0.75
- Alumni Return Rate ≥ 15%
- Ethics Checkpoint Ack Rate ≥ 95%
- Execution Guides usage ≥ 60% NBA actions

> _Speaker note RO:_ "Acesta este layer-ul care ne diferențiază cu adevărat pe termen lung. Concurenții construiesc CRM-uri. Noi construim un sistem care îl face pe agent mai bun: respectă promisiunile față de client (PKI), urmărește obiective clare, are ghiduri practice pentru fiecare acțiune și menține relația cu clienții vechi — alumni care revin sau recomandă aduc tranzacții fără cost de achiziție. Și în piața RM, cu pre-aprobare bancară cvasi-inexistentă, scorul de disponibilitate financiară îl ferește pe agent să piardă luni cu un lead care nu poate cumpăra." _(90s)_

---

## SLIDE 06 — Demo · J1: Lead Score & Firewall

**Headline:** Un lead intră. În 3 secunde, agentul știe ce să facă.

**Layout split-screen:**
- **Stânga:** Screenshot `/leads` (queue cu LS badges colorate: red HOT 0.85 / gold qualified 0.68 / amber warm 0.52 / blue nurturing 0.31) · filter chips RO "HOT / Calificat / Warm / Nurturing"
- **Dreapta:** Screenshot `/leads/[id]` (lead detail cu LS badge 0.78, GDPR consent ✓, side-panel "Match suggestions 3", buton "Asignează agent")

**3 bullets jos:**
- Auto-scored la intake — Meta / Google / OLX / direct (HMAC-verified webhooks)
- Firewall BR-01: < 0.60 → nurturing automat WhatsApp (5 templates pre-aprobate Meta)
- 1-click assign cu APS filter — doar agenți cu slot liber (max 3)

> _Speaker note RO:_ "Ce vedeți aici e demo-ul live, accesibil online. Lead-ul L-0012 a intrat acum 3 minute prin Meta. Scor 0.78. Calificat. Sistemul a sugerat deja 3 proprietăți match și 2 agenți cu slot liber și APS ≥ 0.75. Agentul nu pierde timp cu calificare manuală. Trece direct la conversație." _(75s)_

---

## SLIDE 07 — Demo · J2: Property & Match

**Headline:** Proprietatea înregistrată. Match instant cu lead-urile potrivite.

**Layout split-screen:**
- **Stânga:** Screenshot `/properties` (50 properties, filter chips "Apartament / Casă / Teren / Comercial", PS score + LF Listing Freshness `1 − min(1, zile/90)`)
- **Dreapta:** Screenshot `/properties/new` (formular 8 câmpuri: adresă · oraș · cartier · camere · area · preț · an · etaj) + toast "3 lead-uri match potențial"

**3 bullets jos:**
- Match engine: embeddings pgvector HNSW (Phase 3) cu fallback rule-based pre-vector
- Acuratețe target ≥ 70% pe set test (AC-M1-03)
- Auto-suggestion bidirecțională: property → leads + lead → properties

> _Speaker note RO:_ "Agentul intră 8 câmpuri. Sistemul calculează imediat PS și caută în baza de lead-uri active intent matching. Pentru această proprietate, 3 lead-uri primesc notificare în WhatsApp cu link direct la Property Showcase — link public unic per proprietate, cu tracking views și interest signals." _(60s)_

---

## SLIDE 08 — Demo · J3: Deal Pipeline

**Headline:** 6 stages. Drag-drop. Deal Health monitorizat continuu.

**Layout full-width screenshot:**
- Screenshot `/deals` kanban — 6 coloane (Inițial / Interes / Vizionare / Negociere / Acceptat / Notariat), 20 deal-uri distribuite. DHI badge per card (verde sănătos / amber review / red pericol). DragOverlay rotire +1° gold border.

**3 bullets jos:**
- Drag-drop accesibil (PointerSensor 6px + KeyboardSensor + click-to-advance fallback permanent)
- DHI calculat continuu: TF · UF · RF — re-matching trigger doar `needs_review=true`, deal-urile NU se anulează automat (BR-05)
- Close-won → confirmation modal → DEAL_WON event audit-logged

> _Speaker note RO:_ "Aici e inima execuției. 20 de deal-uri în 6 stages. Fiecare deal are DHI calculat în timp real — TF (Time Factor 0.70 default când expected_close_date e null, BR-10), UF (Urgency Factor), RF (Risk Factor). Când DHI scade sub 0.50, sistemul nu anulează automat — ridică flag pentru review manager. Nicio decizie automată dăunătoare." _(75s)_

---

## SLIDE 09 — Demo · J4: Manager Command

**Headline:** Managerul vede tot. Acționează cu un click.

**Layout split-screen:**
- **Stânga:** Screenshot `/manager` (APS leaderboard 8 agenți · escalations count · conversion rate · today actions)
- **Dreapta:** Screenshot `/manager/escalations` (6 escalări queue, header bulk-select + "Bulk reassign (N)" cu 4 agenți țintă, BR-03 3 niveluri T+SLA / T+SLA+30 / T+SLA+2h cu chip-uri colorate)

**3 bullets jos:**
- APS leaderboard sorted desc — promovare merit-based, niciun bias
- Escalation Protocol BR-03 — auto-escalation prin SLA timer; manager poate override + reassign în bulk
- Audit-log immutable: orice action mgr → AUDIT_LOG APPEND-ONLY (BR-07)

> _Speaker note RO:_ "Managerul nu mai întreabă agentul cum merg deal-urile. Vede direct. Vede ce escalări sunt active, cine a missuit SLA, cine merită bonus luna asta. Bulk reassign cu un click — toate acțiunile semnate în AUDIT_LOG immutable, nu există UPDATE/DELETE la nivel BD. GDPR Art. 22: niciun decizionalism automat — managerul rămâne human-in-the-loop." _(60s)_

---

## SLIDE 10 — Arhitectură Web + Mobile

**Headline:** Web primary. Mobile companion.

**Diagrama 3 layers:**

```
┌─────────────────────────────────────────────────────────┐
│  WEB ~80%  (apps/web — Next.js 14 + TS strict + Tailwind)│  ← agent + manager + admin (DP-01 Web-first)
│  MOBILE ~20% (apps/mobile — React Native + NativeWind)   │  ← agent in-field only (M2.S3)
├─────────────────────────────────────────────────────────┤
│  API REST + WebSocket (single backend, DP-03 single source)│
│  Auth: Supabase / Auth0 · JWT RS256 · 15min access + 7d refresh│
├─────────────────────────────────────────────────────────┤
│  PostgreSQL + pgvector HNSW · Redis cache · AUDIT_LOG    │
└─────────────────────────────────────────────────────────┘
```

**4 bullets jos:**
- Web ✅ M0 demo live · M1 funcțional · M2 GA · Mobile 📱 companion M2.S3
- Single backend → API identic Web + Mobile (DP-03)
- Admin = Web only (DP-05): RBAC mgmt · ML promote · billing · white-label · audit log viewer
- 15 module funcționale × 119 features mapped per platformă în PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md §17

> _Speaker note RO:_ "Filozofia e clară: Web-first, Mobile companion. Agentul lucrează 80% pe desktop browser. Mobile este pentru in-field — geo-tag la vizionare, foto upload, NBA quick-actions. Nu copiem feature-set integral pe Mobile: features admin precum RBAC management și ML promote rămân exclusiv Web — decizie DP-05." _(45s)_

---

## SLIDE 11 — Securitate & GDPR

**Headline:** Phase 0 Security e blocant. Niciun cod aplicație fără ele.

**Checklist 6 items — ★ Phase 0 CLOSED ✅ (M1.S1 livrat):**

- ✅ JWT RS256 + RBAC 5 roluri (agent · senior_agent · team_lead · manager · admin)
- ✅ GDPR consent capture la intake orice lead + retenție automată
- ✅ AUDIT_LOG append-only — niciun UPDATE/DELETE permis la nivel BD (BR-07)
- ✅ Webhook HMAC-SHA256 verification (Meta · Google · OLX)
- ✅ Rate limiting pe endpoint-uri publice
- ⬜ Privacy Policy + Cookie Policy legal review (Legea 133/2011 RM) — *consultant juridic, non-blocking M1.S2*

**★ Adăugat BRD v1.3.0 — Ethics Checkpoint (BR-28):**
- ✅ 4 situații obligatorii human-in-the-loop (dual representation · competing offers · property disclosure · financing gap) — AUDIT_LOG append-only, Art. 22 GDPR compliance.

**Footer (3 bullets):**
- Compliance: GDPR EU + Legea 133/2011 RM + Legea 142/2018 SaaS
- AUDIT_LOG include evenimente ISO 27001 + INC + DR_TEST (zero PII unmask pentru auditori)
- Pilon Retention (Phase 5) — churn score human-in-the-loop, conform Art. 22 GDPR (niciun decizionalism automat)

> _Speaker note RO:_ "Toate șase items pe checklist sunt blocante. Phase 0 e închisă înainte ca o singură linie de cod aplicație să fie scrisă. M1.S1 e dedicat exclusiv security foundation. Pentru piața RM, conformitatea cu Legea 133/2011 GDPR e o cerință legală, nu un nice-to-have. Avem DPO virtual, avem retention policy, avem dreptul la ștergere." _(45s)_

---

## SLIDE 12 — Business Model

**Headline:** SaaS multi-tier. Per-seat pricing.

**Tabel 3 tier-uri (navy-card cu accent gold top):**

| Tier | Țintă | Preț /agent /lună | Features cheie |
|---|---|---|---|
| **Starter** | Agenții mici (1-5 agenți) | **€29** | LS + NBA + Pipeline + Web only |
| **Pro** | Agenții medii (6-25 agenți) | **€49** | Tot Starter + Manager dashboard + Mobile companion + WhatsApp Business templates |
| **Enterprise** | Agenții 25+ + corporate | **€79** | Tot Pro + White-Label (brand-config tenant) + SLA prioritar + API access + Compliance Auditor seat |

**Footer:**
- Setup fee €0 · Annual commit −15% · Pilot 30 zile free
- ARR target an 1: **€80K** (target ~150 agenți paid) · An 3: **€800K** (~1.500 agenți)
- Cost per acquisition (CAC) țintă: < €120/agent · LTV target: > €1.200 (LTV/CAC > 10×)

> _Speaker note RO:_ "Modelul e simplu, prețul e local-adaptat la RM dar competitiv cu RO. Tier-ul Pro este sweet-spot — €49/agent/lună pentru o agenție de 10 agenți înseamnă €490/lună, mai puțin decât un singur lead pierdut. Enterprise cu White-Label e diferențiatorul pentru agențiile mari care vor brand propriu — feature nativ în stack." _(60s)_

---

## SLIDE 13 — Roadmap M0 → M1 → M2

**Headline:** Trei milestone-uri. Cadență de execuție clară.

**Timeline gantt-style horizontal:**

```
2026 Q2 ────── Q3 ────────────────── Q4 ─────── 2027 Q1 ────── Q2 ────── H2
   │                │         │          │                       │
   ▼ M0 ✅          ▼ M1.S1 ✅ ▼ M1.S2 ✅  ▼ M1 MVP Funcțional    ▼ M2 FULL GA
   • Demo live       • Phase 0  • Phase A  • Phase B Lead+Score   • Web Complete
   • 26 routes       • Security • Foundation  • Match Engine v1   • Mobile RN
   • Mock 100/50/20  • JWT/RBAC • 9 entități  • ★ AGI Layer       • Marketplace
   • i18n RO/RU/EN   • GDPR     • scoring    • Pilot 2-3 tenants  • White-Label
   • Pitch deck ✅   • HMAC ✅   • T01-T07 ✅  • HST M1 PASS       • PKI+Alumni GA
```

**★ AGI Layer milestones (BRD §18):**
- M1.S3: Ethics Checkpoints (BR-28) + Financial Readiness (BR-25)
- M1.S4: Execution Guides NBA + IS 3 sub-dimensiuni
- M1.S5: PKI în Trust Score + Dashboard obiective agent
- M1.S6: Alumni Lifecycle + Value Toolkit

**4 entități noi BRD v1.3.0:** `execution_guides` · `client_alumni` · `agent_goals` · `ethics_checkpoints`

**Milestone gates (footer):**
- M0 exit: AC-M0-01..07 ☑ + HST M0 0 CRIT/HIGH ✅ **ATINS**
- M1 exit: AC-M1-01..10 ☑ + AC-AGI-01..05 ☑ + Pilot live ≥ 7 zile fără P1 + HST M1 PASS
- M2 exit: GA public + Mobile iOS/Android distrib + Marketplace ≥ 1.000 buyer profiles + Prevention Rate ≥ 30% + PKI ≥ 0.75 + Alumni Return Rate ≥ 15%

> _Speaker note RO:_ "Roadmap-ul e public, în Master Plan v1.1.2. M0 e ceea ce vedeți astăzi — demo live. M1 e produsul real, în pilot cu 2-3 agenții parteneri, ~10 luni de execuție. M2 e GA public + mobile + features Phase 5 (marketplace + retention + white-label). Pentru fiecare milestone avem Hard Stress Test cu echipa virtuală de 7 specialiști, înregistrat și auditabil." _(60s)_

---

## SLIDE 14 — Tracțiune & Echipa

**Headline:** Execuție rapidă, echipă lean, audit continuu.

**Tracțiune M0 + M1 (7 bullets):**
- ✅ M0.S1 Design System direct-to-code livrat (tokens.json + 18 screens inventory)
- ✅ M0.S2 Clickable prototype — 4 user journeys end-to-end
- ✅ M0.S3-S8 Web Demo (26 routes · mock 100 leads / 50 proprietăți / 20 deal-uri · RO/RU/EN · rent+sale · Kanban redesign · Workspace Direction)
- ✅ **M1.S1 Phase 0 Security Foundation** — JWT RS256 + RBAC 5 roluri + GDPR Art. 15-22 + AUDIT_LOG append-only + HMAC-SHA256 + Throttler · tests 12/12 PASS
- ✅ **M1.S2 Phase A Foundation** — 9 entități business (LEAD/PROPERTY/DEAL/ACTIVITY/TASK/OFFER/SHOWING/AGENT/SCORING_STATE) · 9 migrations SQL + Drizzle schemas · 7 REST CRUD modules · scoring fixtures T01-T07 · tests 22/22 PASS
- ★ **BRD v1.3.0** — AGI Layer §18 documentat complet (7 dimensiuni · BR-25..28 · 4 entități noi · KPI-uri AGI)
- ★ **Moldova §17** — 6 specificații piață documentate ([MOLDOVA-SPECIFIC] în schema BD)

**Echipa core (placeholder TBD):**

| Rol | Nume |
|---|---|
| Founder / PM | {{TBD}} |
| Solution Architect | {{TBD}} |
| Frontend Lead | {{TBD}} |
| Backend / DBA | {{TBD}} |
| DPO + Security | {{TBD}} |

**Echipa virtuală AI (11 hats Claude Code):** ARCHITECT · BACKEND DEV · FRONTEND WEB DEV · MOBILE DEV · DBA · TESTER · SECURITY · DEVOPS · ML ENGINEER · DESIGNER · DOC — activate condițional per stage (CLAUDE.md §10b Regula 7).

> _Speaker note RO:_ "Am ales să operăm cu echipă mică de fondatori + 11 specialiști virtuali AI Claude Code orchestrate per milestone. Asta înseamnă viteză execuție 5× cu CAPEX redus. Pre-development am livrat 38 task-uri în 5 sesiuni. M0 — 13 task-uri în 4 sesiuni. Cadence e demonstrată, nu promisă." _(45s)_

---

## SLIDE 15 — Ask

**Headline:** Suntem aici pentru două conversații.

**Două coloane (split 50/50):**

### 🤝 Pilot client (agenții imobiliare RM)
- **30 zile pilot gratuit** Pro tier (€49/agent/lună post-pilot)
- Onboarding asistat de Customer Success Lead
- Acces direct la backlog roadmap M1
- Target: **3 agenții pilot la Q3 2026**

### 💰 Investitori (seed / pre-seed)
- **Cifră invest: €{{XXXk}}** pentru M1 (Phase 0..C, 10 luni)
- Use of funds: 60% dev (Backend + Frontend + Mobile) · 20% sales (Pilot + Brand) · 15% compliance (GDPR + DPIA + DPO) · 5% buffer
- Equity: {{X}}% · Pre-money: €{{YYY}}k
- Target: **€{{XXX}}k closed la Q3 2026**

**Footer CTA:** *Contact PM: {{email}} · Demo live: `demo.revyx.app` · Pitch deck full: `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/`*

> _Speaker note RO:_ "Suntem la stage seed. Cifra exact discutăm 1-la-1 — depinde de tipul de term-sheet și de runway target. Pentru pilot client am simplificat: 30 zile free, no commit, no setup fee. Dacă plecăm cu 3 pilot la Q3 2026, suntem on-track pentru M1 GA cu €80K ARR validat. Întrebări?" _(45s)_

---

## SLIDE 16 — Mulțumiri & Q&A

**Headline:** Mulțumim.

**Layout centrat:**
- Logo REVYX mare
- Tagline: *Real Estate Execution Intelligence*
- **Demo live:** `demo.revyx.app`
- **Contact:** {{email PM}} · {{LinkedIn}} · {{telefon RM}}
- Footer: *© 2026 REVYX · ITPRO SYSTEM SRL · CONFIDENȚIAL*

> _Speaker note RO:_ "Mulțumesc. Deschidem secțiunea de întrebări. Pentru orice detaliu tehnic vă pot redirecta către Solution Architect; pentru roadmap și pricing rămân eu. Avem aprox. 5 minute, după care continuăm 1-la-1 cu cei interesați de pilot sau term sheet." _(30s)_

---

## Anexă A — Visual specifications (pentru export PDF)

| Spec | Valoare |
|---|---|
| Aspect ratio | 16:9 (1920×1080) |
| Font headline | Bebas Neue 64-130px (clamp responsive) |
| Font body | Montserrat 14-18px / lh 1.7 |
| Font mono | JetBrains Mono pentru scoruri + ID-uri + timeline |
| Background | Navy `#0C1428` cu gradient gold radial subtle |
| Accent | Gold `#C9870A` pentru CTA + headers + accent line top cards |
| Borders | `#1E2E48` standard · `#C9870A38` gold accent (22% opacity) |
| Card style | `--navy-card` `#152038` + accent line top 2px gradient gold |

**Export tool sugerat:** `marp-cli` (`npm i -g @marp-team/marp-cli`) cu custom theme `revyx.css` care reflectă paletă brand-config.

---

## Cross-references

- `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/README.md` — index + structură 16 slides
- `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/deck-ru.md` — versiune rusă
- `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/deck-en.md` — versiune engleză
- `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/assets/SCREENSHOT_REFS.md` — mapping slide → screenshot
- `docs/marketing/VIDEO_SCRIPT_REVYX_M0_v1.0.0.md` — companion video walkthrough
- `docs/marketing/SCREENSHOT_CHECKLIST_REVYX_M0_v1.0.0.md` — capture instructions
- `docs/BRD_REVYX_v1.3.0.md` — source content piloni + BR-XX + §17 Moldova + ★ §18 AGI Layer
- `docs/brand-configs/revyx.md` — paletă + tipografie + claim canonical

---

*docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/deck-ro.md · v1.1.0 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
