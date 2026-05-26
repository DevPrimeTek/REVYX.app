# REVYX — Website Promotion Plan (revyx.app)
<!-- docs/marketing/WEBSITE_PROMOTION_PLAN_REVYX_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Stage:** Mkt-M1 — Pre-Launch Marketing Foundation (paralel cu M1.S3 → M2.S1 dev track)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4-§5
**Strategy doc:** `MARKETING_STRATEGY_REVYX_v1.0.0.md`
**Roadmap doc:** `MARKETING_ROADMAP_REVYX_v1.0.0.md`
**Brand ref:** `docs/brand-configs/revyx.md` §2 (paletă) + §3 (tipografie) + §5 (componente UI) + §7 (ton)
**Platform Matrix:** `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` — site = 🌐 WEB exclusiv

## 0.1 Platform Matrix

🌐 **revyx.app = WEB exclusiv.** Mobile screen-uri prezentate doar ca product preview imagine static; nu există flow nativ mobile pre-MVP.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior Marketing + DESIGNER (Creative Director) + DEV + DOC + Senior PM | ★ INITIAL — Sitemap 14 pagini publice + 6 pagini gated + content brief per pagină + conversion flow detaliat + SEO foundation + tech stack alignment cu `apps/web-preview/` Next.js 14 existent (separat de demo `/app` agent UI). Lead magnet integration cu Tally + Beehiiv. Performance budget Lighthouse ≥ 90 mobile. Cross-ref strategy §5 canale + §6 funnel + §7 content pillars. |

---

## 1. Arhitectură site (sitemap)

### 1.1 Pagini publice (indexabile, SEO target)

```
revyx.app
│
├── /                                  [Hero · Pillars · Social proof · CTA]
├── /produs
│   ├── /produs/agent                  [Persona P1 — independent agent]
│   ├── /produs/agentii                [Persona P2 — agenții 3-15]
│   └── /produs/manager                [Persona P3 — manager 15+] (stretch M2+)
│
├── /piloni                            [7 piloni AOS — overview]
│   ├── /piloni/lead-intelligence
│   ├── /piloni/supply-intelligence
│   ├── /piloni/match-intelligence
│   ├── /piloni/execution-intelligence  ⭐ flagship
│   ├── /piloni/negotiation-intelligence
│   ├── /piloni/deal-intelligence
│   └── /piloni/performance-intelligence
│
├── /comparativ
│   ├── /comparativ/excel              [REVYX vs Excel/Google Sheets]
│   ├── /comparativ/whatsapp           [REVYX vs WhatsApp groups]
│   ├── /comparativ/bitrix24           [REVYX vs Bitrix24]
│   └── /comparativ/amocrm             [REVYX vs AmoCRM]
│
├── /resurse                           [Lead magnets hub]
│   ├── /resurse/checklist-anunt       [L1 — Tally gated PDF]
│   ├── /resurse/script-call-olx       [L2]
│   ├── /resurse/contract-preliminar   [L3]
│   ├── /resurse/calculator-comision   [L4 — interactive mini-app]
│   ├── /resurse/gdpr-checklist        [L5]
│   ├── /resurse/raport-piata-2026     [L6]
│   ├── /resurse/okr-template          [L7]
│   └── /resurse/audit-funnel          [L8 — Calendly gate]
│
├── /blog                              [SEO content hub]
│   └── /blog/[slug]                   [individual articles — RO + RU]
│
├── /webinare                          [Webinar archive + upcoming registration]
│   └── /webinare/[slug]
│
├── /despre                            [Story + fondator + companie]
├── /press                             [Press kit + media coverage links]
├── /pricing                           [Public T+170+; hidden pre-launch]
├── /contact                           [Form + Calendly + Telegram link]
└── /legal
    ├── /legal/privacy                 [Privacy Policy — legal review M1.S2 pending]
    ├── /legal/cookie                  [Cookie Policy]
    └── /legal/termeni                 [ToS — M2.S1 pending]
```

### 1.2 Pagini gated (auth wall) post-MVP

```
revyx.app
├── /beta                              [Beta application — public T+85+, gated post-MVP]
├── /demo                              [Demo account — gated, deja există apps/web-preview]
├── /app                               [App live MVP — gated, M1.S5+]
├── /onboarding                        [Self-serve onboarding flow]
├── /admin                             [Internal admin dashboard]
└── /docs                              [Customer docs — post-MVP M2]
```

### 1.3 Localizare RO/RU

**Strategie URL-uri multilingue:**
- **RO default** — `revyx.app/` (RO root)
- **RU prefix** — `revyx.app/ru/` (e.g. `revyx.app/ru/blog/lead-leakage-olx`)
- **EN deferred M2+** — `revyx.app/en/`

`hreflang` tags obligatoriu între versiuni paralele + canonical pointing self.

---

## 2. Page-by-page content brief

### 2.1 Homepage (/)

**Audiență:** P1 + P2 (first touch).
**Obiectiv:** Comunică categoria (AOS, nu CRM) + pain point + 5 piloni messaging + CTA cohort beta.
**Target time-on-page:** 90+ sec.
**CTA primar:** "Înscrie-te în beta" → `/beta`
**CTA secundar:** "Descarcă raport gratuit piață RM" → `/resurse/raport-piata-2026`

**Structură sections:**

| # | Section | Conținut |
|---|---|---|
| H1 | **Hero** | Bebas Neue 80-130px: "Sistemul tău de operare, nu un CRM." · Sub: "Filtrăm lead-urile. Îți spunem ce să faci acum. Cu maximum 3 sarcini active." · Primary CTA + Secondary CTA · Background: navy radial + gold glow (brand §5.6) |
| H2 | **Problem stat** | 3 cifre mari Bebas Neue: "**30%** lead-uri OLX se pierd primele 24h" · "**Pentru ce ne pierdem clienții?** Lipsă follow-up" · "**5h/zi** petrec agenții organizându-se" · Sources cited (mock pre-data: "estimare estimate OLX intake 2026 + interviuri 15 agenți RM") |
| H3 | **What is AOS** | "AOS ≠ CRM. Iată diferența:" — comparison table 4 rânduri (CRM stochează / AOS execută; CRM e pasiv / AOS e activ; CRM îți cere date / AOS îți dă decizii; CRM e generic / AOS e built pentru agent imobiliar) |
| H4 | **5 Pillar messages** | Carousel 5 carduri brand `--navy-card` cu accent line gold — câte unul pentru fiecare pillar message §4.2 strategy (M1 Filtru · M2 Direcție · M3 Disciplină · M4 Local · M5 Încredere) |
| H5 | **Demo screenshots** | 3 screenshots cu hover-zoom: `/leads` (lead queue) · `/leads/[id]` (lead detail cu Top-3 match) · `/manager` (manager dashboard). Sourced din apps/web-preview/. |
| H6 | **For who** | 3 cards: "Agent independent" → /produs/agent · "Agenție 3-15" → /produs/agentii · "Manager 15+" → /produs/manager |
| H7 | **Build in public** | Live metric "Săptămâna asta am construit: …" (manual update Notion sync); embed 1 LinkedIn post fondator |
| H8 | **Resources teaser** | 3 lead magnet cards cu CTA fiecare → /resurse |
| H9 | **Final CTA** | "Înscrie-te în beta — 80 locuri rămase" · big primary button gold |
| Footer | Standard | Logo + tagline RO/RU/EN · 4 col nav · social icons · copyright |

**Performance budget:** LCP ≤ 1.8s · TBT ≤ 200ms · CLS ≤ 0.05 · Lighthouse mobile ≥ 90.

**SEO target keywords:** "sistem agent imobiliar Moldova" · "software agenți imobiliari Chișinău" · "alternativă CRM imobiliar RM" · "agent operating system Moldova".

### 2.2 Persona pages (/produs/{agent|agentii|manager})

Each page urmează același template, conținut adaptat persona:

| # | Section | Conținut |
|---|---|---|
| Hero | Pain anchor specific persona | Agent: "Pierzi 1 din 3 lead-uri și nu știi care." · Agenție: "Echipa ta lucrează în Excel-uri paralele." · Manager: "Forecast-ul vine din ghicit." |
| Day-in-the-life | 3 mini-scenarii ZTBM (Zero To Best Move) | Înainte de REVYX vs. cu REVYX — pe momente concrete (8:30 morning · 11:00 follow-up · 14:00 showing · 18:00 retrospect) |
| Features matrix | Lista features prioritate persona | Agent: NBA · Lead Firewall · max 3 task · WhatsApp. Agenție: Trust Score · APS · escalation · white-label intent. Manager: Forecast · audit-log · GDPR · reporting. |
| Pricing teaser | "EUR 19/lună early-bird per agent" | + Trial 30 zile · Cancel anytime |
| Social proof | Logo-uri pilot users (post-beta) | Pre-launch: "Founding Members include 80 agenți pilot din Moldova" |
| FAQ | 6-8 Q&A persona-specific | Cu schema FAQ |
| CTA | Beta application sau Calendly demo | Persona button label |

### 2.3 Pillars pages (/piloni/{1-7})

Fiecare pillar = pagină dedicată cu deep dive technic + benefits + screenshot demo + cross-link BR-XX.

Exemplu `/piloni/execution-intelligence` (flagship):

| # | Section | Conținut |
|---|---|---|
| Hero | "Pilonul 4 — Execution Intelligence" · "Sistemul îți spune ce să faci acum, cu cine, cum." | Background brand `--navy-deep` + grid overlay |
| Concept | "Execution Intelligence = NBA + Escalation + BR-04 max 3 task" | Diagram pillar architecture (Mermaid render static) |
| NBA explainer | "Next Best Action — formula matematică" | Formula card brand `--navy-card` + accent gold (per §5.2): `NBA = base × UF × IS × decay` cu explainer prose |
| Escalation flow | Diagram 3 niveluri T+SLA → T+SLA+30min → T+SLA+2h | Visualizare colorată semaforic |
| BR-04 trigger | Code snippet PL/pgSQL real | "Maximum 3 task active enforced la nivel BD" |
| Use case | Story Andrei beta user | Pain → REVYX → impact (cifre mock pre-launch) |
| Demo video | 60-sec screen recording | YouTube embed |
| CTA | "Vezi pilon următor" → /piloni/negotiation-intelligence | + Sticky beta button |

### 2.4 Comparison pages (/comparativ/{excel|whatsapp|bitrix24|amocrm})

Format common — high-intent SEO traffic, conversie directă beta signup.

| # | Section | Conținut |
|---|---|---|
| Hero | "REVYX vs Excel — care dintre ele merită timpul tău" | Honest framing — NU bash gratuit |
| Honest summary | 1 paragraf "Când Excel e OK / Când e timpul să schimbi" | Credibility builder |
| Comparison table | 15 capabilities × 3 col (Excel · Bitrix24 · REVYX) | Tabel brand cu `td-gold` pe REVYX advantages |
| Migration story | "Cum migrezi de la Excel la REVYX în 2 ore" | Step-by-step |
| Cost comparison | TCO cumulat 12 luni | Excel free + 5h/săpt salary lost = €X; REVYX = €Y; net win |
| Testimonial | "De ce am trecut de la Excel" (beta user) | post-T+120 |
| CTA | "Înscrie-te în beta" | High-intent CTA |

### 2.5 Blog (/blog + /blog/[slug])

**Template articol blog standard:**

```
Header: breadcrumb (Home / Blog / Article)
Title: H1 Bebas Neue 64-80px
Meta: Author + Reading time + Date + Tags
Cover image: 1200×630 brand
TOC: sticky sidebar (≥3 H2) cu scroll-spy
Body:
  - Lead paragraph 1-2 propoziții hook
  - H2 sections cu max 300-400 cuvinte fiecare
  - Inline images (charts, screenshots) cu lazy load
  - Pull quotes branded `--navy-card` borderleft gold
  - CTA box mid-article (lead magnet)
  - "Citește următor" 3 cards related
End-of-article:
  - Author bio mini
  - Newsletter signup inline
  - Share buttons (LinkedIn + Facebook + Telegram + Email copy URL)
  - Comments? NO M1 (M2+ via Disqus)
```

**SEO essentials per articol:**
- Title tag ≤ 60 char cu primary keyword
- Meta description ≤ 155 char cu CTA
- URL slug short + keyword
- H1 unique + H2-H4 logical
- Internal link min 3
- External link min 2 authoritative
- Schema markup `Article` + `BreadcrumbList`
- Open Graph + Twitter Card

**Editorial calendar T0-T180** (target: 4 articole / lună × 6 luni = 24 articole)

Vezi Roadmap §3.2-3.3 + §4.3 pentru calendar detaliat.

### 2.6 Resources hub (/resurse + /resurse/[slug])

**Lead magnet landing pattern (per L1-L8):**

```
Hero — title + 1-paragraph value prop + thumbnail PDF
Inline form (Tally embed) — Email + Name + Agenție (optional)
"What you'll learn" — bullet list 5-7 points
"Inside" — 3-5 screenshot pages din PDF
"Cine sunt eu" — fondator mini-bio (trust signal)
Testimonial — post-T+90 (1 beta user)
CTA — "Trimite-mi gratuit" → Tally
After submit: Thank you page + Email delivered + Telegram invite + Newsletter opt-in checkbox
```

**Conversion tracking obligatoriu:**
- UTM params păstrate prin form → Notion CRM
- Email automation Beehiiv → welcome 5-sequence
- Notion CRM tagging — sursă · lead magnet · timestamp · UTM

### 2.7 Press kit (/press)

**Conținut:**
- Bio fondator + photo (RO+RU+EN)
- About REVYX 1-paragraph + 5-paragraph versions
- 3 brand tagline-uri (10/30/60 cuv.)
- 5 key facts cu source (piață RM + product)
- 3 download-uri (logo SVG+PNG · pitch one-pager PDF · screenshot pack)
- Media coverage links (post-earned-media)
- Contact press inquiry (Calendly 15min + email)

### 2.8 Beta application page (/beta)

**Mod**: PUBLIC T+85+ (înainte hidden cu redirect home).

**Conținut:**

| # | Section | Conținut |
|---|---|---|
| Hero | "REVYX Beta — 80 locuri rămase" + countdown locuri | Live counter (manual updated Notion sync) |
| What you get | 4 benefits | 6 luni gratuit · 50% rebate next 6mo · Founding Member badge · Direct access fondator |
| Requirements | 4 pre-conditions | Agent activ RM · 3+ lead/săpt · Engagement în 1+ canal · 30min/săpt feedback |
| Application form | Tally 12 fields | Nume · Email · Telefon · Agenție · Oraș · OLX/FB link · Volum lead · Motivație 1 paragraf · Disponibilitate · Sursă (UTM) · Consent GDPR · Submit |
| Process | 4-step timeline | 1. Apply (5min) · 2. Screening call (15min) · 3. Setup tenant (30min) · 4. Welcome cohort (4-săpt onboarding) |
| FAQ | 8 Q&A | Beta cost? · Date sigure? · Pot anula? · Etc. |
| Counter testimonial | 1 case study video (post-T+120) | YouTube embed |

---

## 3. Tech Stack alignment

### 3.1 Continuă pe Next.js 14 existent

**Decizie:** `revyx.app` website public = **același monorepo** `apps/web-preview/` upgrade la production mode + adăugare landing routes.

**Avantaje:**
- Reuse brand design tokens (`apps/web-preview/styles/tokens.css`)
- Reuse componente UI deja construite (Card, InteractiveCard, ScoreBadge dar nu pe landing — doar pe demo)
- Single Vercel deploy + Root Directory `apps/web-preview/`
- Zero adițional tech complexity

**Rute landing noi în `apps/web-preview/app/`:**
```
app/
├── (marketing)/                       [NEW route group T-Mkt-DEV-01]
│   ├── layout.tsx                     [Marketing layout — fără auth gate]
│   ├── page.tsx                       [/ Homepage]
│   ├── produs/
│   │   ├── agent/page.tsx
│   │   ├── agentii/page.tsx
│   │   └── manager/page.tsx
│   ├── piloni/
│   │   ├── page.tsx                   [/piloni overview]
│   │   ├── [pillar]/page.tsx          [dynamic 1-7]
│   ├── comparativ/
│   │   └── [target]/page.tsx          [dynamic]
│   ├── resurse/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── webinare/page.tsx
│   ├── despre/page.tsx
│   ├── press/page.tsx
│   ├── pricing/page.tsx
│   ├── contact/page.tsx
│   └── legal/
│       ├── privacy/page.tsx
│       ├── cookie/page.tsx
│       └── termeni/page.tsx
├── beta/page.tsx                      [public T+85+]
├── (app)/                             [existing demo agent UI — gated post-MVP]
│   └── ... (existing routes)
```

### 3.2 Blog content management

**Decizie:** **MDX files** în `apps/web-preview/content/blog/{ro,ru}/[slug].mdx` (no CMS pre-MVP).

**Avantaje:**
- Version controlled Git
- Frontmatter cu metadata standard
- Build-time SEO + RSS feed generation
- Zero monthly cost
- Author = git author

**Frontmatter standard:**
```yaml
---
title: "De ce 30% dintre lead-urile OLX se pierd"
slug: "lead-leakage-olx"
locale: "ro"
date: "2026-05-20"
author: "fondator"
tags: ["lead intake", "OLX", "agent moldova"]
description: "Meta description ≤155 char..."
cover: "/blog/lead-leakage-olx/cover.png"
ogImage: "/blog/lead-leakage-olx/og.png"
readingTime: 8
related: ["aos-vs-crm", "gdpr-agent-moldova"]
---
```

**Migrare la Notion CMS** post-MVP (M2.S2+) doar dacă autor non-tech adăugat.

### 3.3 Lead capture flow tehnic

```
User pe landing page
    ↓
Click CTA "Descarcă PDF gratuit"
    ↓
Tally form embed (iframe sau popup)
    ↓
Submit → Tally webhook → Beehiiv API + Notion CRM
    ↓
Beehiiv: enroll în "welcome sequence" 5 emails
Notion: row nou în "Leads" database cu tags
    ↓
Email #1 livrat instant cu PDF link (signed Google Drive URL 7 days)
    ↓
Track UTM + lead source + lead magnet via Plausible custom events
```

**Stack components:**
- Tally.so (free) — forms
- Beehiiv (free <2,500) — email + automation
- Notion (free) — CRM lightweight
- Plausible (self-hosted free) — analytics
- Google Drive (free 15GB) — PDF asset storage
- Zapier free (5 zaps) — connectors emergency
- Make (free 1,000 ops/lună) — connectors primary

### 3.4 Performance budget

| Metric | Target | Tools de verificare |
|---|---|---|
| Lighthouse Performance | ≥ 90 mobile / ≥ 95 desktop | Lighthouse CI gate la fiecare PR |
| LCP | ≤ 1.8s mobile | Real User Monitoring Plausible + WebPageTest free |
| TBT | ≤ 200ms | Lighthouse |
| CLS | ≤ 0.05 | Lighthouse |
| Total page weight | ≤ 1MB (excl. images) | Bundle analyzer |
| Image format | WebP + AVIF fallback | Next.js Image native |
| Font loading | `font-display: swap` + preload | next/font config |
| JS bundle landing | ≤ 100KB gzipped | Bundle analyzer |

### 3.5 SEO foundation

**Obligatorii la launch:**
- `robots.txt` cu sitemap reference
- `sitemap.xml` autogen Next.js
- Schema markup `Organization` + `Product` + `Article` + `FAQPage` + `BreadcrumbList`
- Open Graph + Twitter Card per page
- Canonical URL self-pointing
- `hreflang` RO ↔ RU pairs
- 301 redirects map (orice URL veche existent → nou)
- Google Search Console verified
- Bing Webmaster Tools verified
- Google Analytics 4 (free tier) BACKUP — primary Plausible

---

## 4. Conversion Flow Master Diagram

```
                ┌───────────────────────────────────────┐
                │   LANDING SOURCES (organic)           │
                │  - LinkedIn click                     │
                │  - Google organic search              │
                │  - Facebook click                     │
                │  - Telegram click                     │
                │  - Direct (brand search)              │
                │  - Earned media referral              │
                └────────────────┬──────────────────────┘
                                 │
                                 ▼
            ┌────────────────────────────────────────────┐
            │       LANDING ENTRY POINT                  │
            │  Homepage (90%) · Blog (8%) · Comparison(2%)│
            └─────┬───────────────────────────┬──────────┘
                  │                           │
        Browse content                  Direct CTA click
                  │                           │
                  ▼                           ▼
       ┌─────────────────┐         ┌──────────────────┐
       │  Lead magnet    │         │  Beta apply form │
       │  download       │         │  /beta           │
       │  (Tally form)   │         └────────┬─────────┘
       └────────┬────────┘                  │
                │                           │
                ▼                           ▼
       ┌─────────────────┐         ┌──────────────────┐
       │  Email captured │         │ Notion CRM       │
       │  → Beehiiv      │         │ status=applied   │
       │  welcome seq    │         └────────┬─────────┘
       └────────┬────────┘                  │
                │                           ▼
                │                  ┌──────────────────┐
                │                  │ Screening call   │
                │                  │ (Calendly 15min) │
                │                  └────────┬─────────┘
                │                           │
                │                           ▼
                │                  ┌──────────────────┐
                │                  │  Onboarding      │
                │                  │  Setup tenant +  │
                │                  │  Training 30min  │
                │                  └────────┬─────────┘
                │                           │
                ▼                           ▼
       ┌─────────────────┐         ┌──────────────────┐
       │ Newsletter      │         │  Beta active     │
       │ weekly nurture  │         │  Weekly check-in │
       │ 4-12 weeks      │         │  Feedback loop   │
       └────────┬────────┘         └────────┬─────────┘
                │                           │
                ▼                           ▼
       ┌─────────────────┐         ┌──────────────────┐
       │ Webinar invite  │         │  Conversion to   │
       │ Beta apply CTA  │         │  PAID @ GA       │
       │ 8% conversion   │         │  25% conversion  │
       └────────┬────────┘         └──────────────────┘
                │
                └───→ (back to Beta apply form)
```

---

## 5. SEO Content Calendar 180 zile

### 5.1 Articole — calendar canonical (24 articole RO + 12 RU traduceri)

| Săpt | Articol RO | Keyword principal | Lead magnet linked |
|---|---|---|---|
| **S4** | De ce 30% dintre lead-urile OLX se pierd primele 24 ore | "lead OLX agent imobiliar" | L2 |
| **S4** | AOS vs CRM: de ce agentul RM are nevoie de altceva | "CRM agenți imobiliari Moldova" | L1 |
| **S4** | GDPR pentru agentul imobiliar din Moldova — ghid 2026 | "GDPR agent imobiliar Moldova" | L5 |
| **S5** | Top 7 greșeli în preluarea anunțului imobiliar OLX | "preluare anunț imobiliar" | L1 |
| **S6** | Cum măsori performanța agentului tău (APS explicat) | "evaluare performanță agent imobiliar" | L7 |
| **S7** | Lead Score explicat fără matematică | "calificare lead imobiliar" | L1 |
| **S8** | Calculator comision agent imobiliar RM (interactiv) | "calculator comision imobiliar Moldova" | L4 |
| **S9** | GDPR audit gratuit step-by-step pentru agenții imobiliare | "audit GDPR Moldova" | L5 |
| **S10** | BR-01 Lead Firewall: cum filtrăm lead-urile prost calificate | "filtru lead imobiliar" | L1 |
| **S11** | Story Diana — broker care a scalat de la 3 la 8 agenți | "agenție imobiliară creștere" | L7 |
| **S12** | Raport piață imobiliară RM Q1 2026 (analiză date) | "piața imobiliară Moldova 2026" | L6 |
| **S13** | Maximum 3 task-uri active: de ce limita asta crește venitul | "productivitate agent imobiliar" | L1 |
| **S14** | NBA — Next Best Action explicat pentru agentul imobiliar | "automatizare agent imobiliar" | L2 |
| **S15** | Cum scrii un contract preliminar de vânzare-cumpărare în RM | "contract preliminar vânzare cumpărare Moldova" | L3 |
| **S16** | Top 10 instrumente gratuite pentru agentul imobiliar 2026 | "instrumente agent imobiliar gratuite" | L1+L2 |
| **S17** | Funnel agent imobiliar — de la lead OLX la notar | "funnel vânzare imobiliar" | L8 |
| **S18** | Trust Score — încredere clienți cuantificată | "fidelizare clienți imobiliar" | L7 |
| **S19** | Cum integrezi WhatsApp Business în lucrul tău de agent | "WhatsApp Business agent imobiliar" | L2 |
| **S20** | Match Engine — cum potrivim Top-3 proprietăți pentru fiecare lead | "potrivire proprietate cumpărător" | L4 |
| **S21** | Escalation Protocol 3 niveluri: cum nu mai pierzi un lead HOT | "SLA lead imobiliar" | L1 |
| **S22** | Story Andrei — agent independent care a închis +40% deal-uri | "creștere venituri agent" | L7 |
| **S23** | Q2 2026 raport piață RM (update) | "piață imobiliară RM" | L6 |
| **S24** | Pregătire MVP — sneak peek REVYX launch | "REVYX MVP" | beta CTA |
| **S25-26** | Launch week content burst — 3 articole launch + recap | "lansare REVYX" | beta CTA |

### 5.2 Distribuție content pillar (strategy §7)

| Content Pillar | # articole | % |
|---|---|---|
| CP1 — Pain stories | 7 | 29% |
| CP2 — Educație piață | 6 | 25% |
| CP3 — Demo produs | 5 | 21% |
| CP4 — Build in public | 4 | 17% |
| CP5 — Comunitate cazuri | 2 | 8% |

### 5.3 Traduceri RU (12 articole high-value)

Priorities pentru RU translation: S4 (3 articole) + cele cu highest organic search volume estimate RU în RM (~7 articole din lunile 2-5) + lansare launch articles (2 articole).

---

## 6. Cookie banner + privacy

### 6.1 Cookie banner obligatoriu (GDPR + Legea 133/2011 RM)

**Implementare:** custom built `<CookieBanner>` componentă în `apps/web-preview/components/`.

**Layout (per brand revyx.md §5):**
- Sticky bottom + transparent backdrop
- Cards `--navy-card` + accent gold border
- 3 toggles: Essential (preselectat blocat) · Analytics (Plausible) · Marketing (Meta Pixel post-MVP, Beehiiv tracking pre-MVP)
- "Accept all" gold button · "Reject non-essential" border button · "Customize" link
- Persistence localStorage `revyx.cookie-consent` JSON
- Audit-log entry persistat în Notion CRM (lead row update)

### 6.2 Privacy policy + Cookie policy

Cross-ref `docs/legal/PRIVACY_POLICY_REVYX_v0.1.0.md` + `docs/legal/COOKIE_POLICY_REVYX_v0.1.0.md` (deja draftat M1.S1, pending legal review).

**Status:** v0.1.0 → v1.0.0 BLOCKING `/legal/privacy` public la T+0 publicare website. Legal review pending OD-legal-01..05 + OD-cookie-01..03.

---

## 7. Conversion CTA inventory

| CTA | Destinație | Page locations | Hot/cold |
|---|---|---|---|
| **"Înscrie-te în beta"** | /beta | Home hero + footer + pillars + comparison + blog inline | 🔥 Hot — high intent |
| **"Descarcă PDF gratuit"** | /resurse/[slug] | Blog inline + home teaser + resources hub | ❄️ Cold — lead magnet |
| **"Rezervă demo 30min"** | Calendly | Pricing + Press + persona pages high-intent | 🔥 Hot — high intent |
| **"Vezi cum funcționează"** | /demo (gated post-MVP) | Hero + persona pages | 🔥 Warm — middle funnel |
| **"Citește case study"** | /blog/[case-study] | Persona pages + comparison | ❄️ Warm |
| **"Înscrie-te la webinar"** | Calendly registration | Blog post launches + footer + dedicated banner | ❄️ Cold-Warm |
| **"Vorbește cu fondatorul"** | Calendly 15min | Pricing + Press + footer | 🔥 Hot — high intent |
| **"Alătură-te comunității Telegram"** | t.me/revyx_md | All pages footer | ❄️ Cold — community |

**A/B test plan minimum:**
- Lună 1: Hero CTA primary ("Înscrie-te în beta" vs. "Vezi demo gratuit")
- Lună 2: Lead magnet form length (3 fields vs. 5 fields)
- Lună 3: Blog post end-CTA (lead magnet vs. beta apply)

---

## 8. Build phasing

### 8.1 Sprint 1 — Foundation (Săpt. 1-2 din Roadmap T-Mkt-001..028)

| Sprint task | Owner | Output |
|---|---|---|
| Setup route group `(marketing)/` cu layout | DEV | Layout brand cu nav + footer |
| Build `/` Homepage 9 sections | DEV + D | Homepage live |
| Build `/press` static | DEV + D | Press kit pagină |
| Build cookie banner + privacy/cookie pages | DEV + LEGAL | Compliance baseline |
| Plausible + UTM setup | SM + DEV | Analytics functional |
| Beehiiv embed + Tally embed integrations | SM + DEV | Lead capture flow tehnic |

### 8.2 Sprint 2 — Content infrastructure (Săpt. 3-4)

| Sprint task | Owner | Output |
|---|---|---|
| Build `/blog` + `[slug]` MDX rendering | DEV | Blog template cu RO/RU support |
| Build `/resurse` + `[slug]` lead magnet template | DEV + D | 4 landing pages L1-L4 live |
| Build 3 articole MDX seed | F + SM | Primele 3 blog posts live |
| Schema markup + sitemap + robots | DEV | SEO foundation |
| `/produs/{agent|agentii|manager}` 3 persona pages | DEV + D | Persona pages live |

### 8.3 Sprint 3 — Comparison + Pillars (Săpt. 5-6)

| Sprint task | Owner | Output |
|---|---|---|
| Build `/comparativ/[target]` template | DEV + D | 4 comparison pages live |
| Build `/piloni` overview + 7 pillar pages | DEV + D | 8 pages live |
| Build `/despre` story page | DEV + F | About page live |
| `/contact` form + Calendly embed | DEV + SM | Contact page live |

### 8.4 Sprint 4 — Beta + Pricing (Săpt. 11-12, alignment cu Faza C beta launch)

| Sprint task | Owner | Output |
|---|---|---|
| Build `/beta` application page | DEV + D + SM | Beta page (hidden until T+85) |
| Build `/webinare` + `[slug]` template | DEV | Webinare hub |
| Build `/pricing` page (hidden until T+170) | DEV + D | Pricing live |
| A/B test framework (Vercel Edge Config or Flagsmith free) | DEV | A/B testing capability |

### 8.5 Sprint 5 — Launch polish (Săpt. 24-25)

| Sprint task | Owner | Output |
|---|---|---|
| `/legal/termeni` ToS public | LEGAL + DEV | Legal full set |
| Performance audit + optimization pass | DEV | Lighthouse ≥ 90 toate paginile |
| 301 redirect map verification | DEV + SM | Zero dead links |
| Hreflang verification + canonical audit | DEV + SM | Multilingual SEO health |
| Final visual audit per brand revyx.md | D + CD | Brand consistency 100% |
| Press kit final update | SM | Updated post-launch ready |

---

## 9. Cross-Reference Documente

- `MARKETING_STRATEGY_REVYX_v1.0.0.md` — strategy canonical (§2 poziționare house messaging cross-link cu §2 site brief)
- `MARKETING_ROADMAP_REVYX_v1.0.0.md` — atomic tasks T-Mkt-XXX cu effort + dependencies
- `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/` — pitch deck source pentru `/press` content
- `docs/brand-configs/revyx.md` — design system pentru toate componentele website
- `BRD_REVYX_v1.1.0.md` §5 (7 piloni) — sursă pentru `/piloni/[pillar]` content
- `apps/web-preview/` — codebase existent unde se va construi marketing site
- `docs/legal/PRIVACY_POLICY_REVYX_v0.1.0.md` + `COOKIE_POLICY_REVYX_v0.1.0.md` — legal blocking publish

---

## 10. Sign-off

| Rol | Responsabilitate | Semnătură | Data |
|---|---|---|---|
| Senior Marketing | Owner content + funnel | ___________________________ | Mai 2026 |
| FRONTEND WEB DEV | Owner technical build | ___________________________ | Mai 2026 |
| DESIGNER (Creative Director) | Owner brand consistency | ___________________________ | Mai 2026 |
| Senior PM | Aprobare sitemap + launch sequencing | ___________________________ | Mai 2026 |
| Senior Compliance | Aprobare cookie banner + privacy live | ___________________________ | Mai 2026 |
| Fondator / CEO | Aprobare poziționare + messaging | ___________________________ | Mai 2026 |

---

*WEBSITE_PROMOTION_PLAN_REVYX · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
