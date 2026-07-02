# REVYX

**Real Estate Execution Intelligence**
Agent Operating System (AOS) pentru agenți imobiliari — nu un CRM clasic.

> **CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL**

---

## Despre REVYX

REVYX automatizează și controlează întregul ciclu de viață al unei tranzacții imobiliare prin intermediul unui AI layer nativ. Piața primară: **Republica Moldova**.

**Diferențiatori cheie:**

- 8 formule de scoring AI (LS, PS, IS, DP, NBA, TS, APS, DHI)
- Suport nativ **vânzare + închiriere** (calibration profiles sale/rent)
- Lead Firewall (BR-01) + Escalation Protocol 3 niveluri (BR-03)
- Maximum 3 task-uri active per agent — focus și execuție (BR-04)
- AGI Layer — Buyer Needs Assessment, Execution Guides, Qualification Wizard
- Partner Registry + MLS Cooperation (BR-32)
- GDPR-compliant by design (Art. 15/17/18/20)
- AUDIT_LOG append-only la nivel BD (trigger PL/pgSQL + REVOKE rol app)

---

## Structura repo

```
REVYX.app/
├── CLAUDE.md                        ← context per-sesiune Claude Code (v1.2.32)
├── README.md                        ← acest fișier
├── apps/
│   ├── web-preview/                 ← Next.js 14 demo UI (zero backend)
│   │   ├── app/                     ← 26 routes (dashboard, leads, properties,
│   │   │                               deals, showings, tasks, notary, cabinet,
│   │   │                               tutorial, manager, notifications, profile)
│   │   ├── components/              ← design system + feature components
│   │   ├── lib/                     ← stores (localStorage), mock data, helpers
│   │   └── messages/                ← i18n RO/RU/EN (ro.json, ru.json, en.json)
│   └── api/                         ← NestJS 10 + Fastify + Drizzle ORM
│       └── src/
│           ├── auth/                ← JWT RS256 + refresh rotation + BR-12
│           ├── rbac/                ← RolesGuard 5 roluri aditiv
│           ├── audit/               ← AuditInterceptor global
│           ├── webhooks/            ← HMAC-SHA256 + replay dedup
│           ├── gdpr/                ← Art. 15/17/18/20 endpoints
│           ├── business/            ← leads, properties, deals, activities,
│           │                           tasks, offers, showings (CRUD + DTO Zod)
│           ├── scoring/             ← fixtures T01..T07 + helpers compute*
│           └── db/migrations/       ← 0001..0015 SQL idempotente
└── docs/
    ├── MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md   ← backbone M0/M1/M2
    ├── PLATFORM_MATRIX_REVYX_web-mobile_v1.1.0.md      ← feature×platform map
    ├── ROADMAP_REVYX_detailed-execution_v1.0.17.md     ← atomic tasks T-XXX
    ├── BRD_REVYX_v1.5.0.md                             ← cerințe business + formule
    ├── INDEX_REVYX_documents_v1.1.24.md                ← catalog toate documentele
    ├── brand-configs/revyx.md                          ← brand system complet
    ├── tech-spec/                                      ← 20 specificații tehnice
    ├── workflow/                                       ← 9 workflow & process maps
    ├── audit/                                          ← HST M0 + pre-dev reports
    ├── arch/                                           ← ARCH AGI capability map
    └── legal/                                          ← Privacy Policy, Cookie Policy
```

---

## Milestone-uri

| Milestone | Status | Conținut |
|---|---|---|
| **M0 — MVP Prezentare** | ✅ CLOSED | Design system · Demo UI 26 routes · Pitch deck · Hard Stress Test PASS 8/8 |
| **M1.S1 — Phase 0 Security** | ✅ CLOSED | JWT RS256 + RBAC 5 roluri + GDPR + AUDIT_LOG + HMAC webhook |
| **M1.S2 — Phase A Foundation** | ✅ CLOSED | 9 migrations + 9 Drizzle schemas + 7 REST modules + scoring fixtures T01..T07 |
| **M1.S3 — Phase B** | 🔜 NEXT | Webhook intake Meta/Google/OLX + scoring engines + BR-01 Firewall + GDPR erasure |

---

## Funcționalități demo (`apps/web-preview/`)

### Lead Management
- **4 tipuri lead**: Cumpărător / Vânzător / Chiriaș / Proprietar (Regula 19+20)
- **Buyer Needs Assessment**: buget declarat/confirmat, pre-aprobare bancară, deal-breakers
- **Financial Readiness Badge**: derivat automat din profilul financiar
- **Qualification Wizard**: 10 pași seller cu captură verdict/preț/motivație
- **Execution Guides**: 9 ghiduri operaționale RO (apel + obiecții + 10 pași)
- **Match Podium**: Top-3 potriviri cu raționament inline (buyer/tenant)
- **Task Management**: max 3 active (BR-04) + modal adăugare + filtre

### Property Management
- **3 tipuri listing**: De vânzare / De închiriat / Vânzare+chirie
- **Comision configurabil** per proprietate (2.0% / 2.5% / 3.0%)
- **Property detail**: galerie foto + tur video + link public showcase
- **Freshness labels**: Anunț nou / De reîmprospătat / Necesită atenție

### Deal Pipeline (Kanban)
- **5 stage-uri**: Descoperire → Calificat → Ofertă → Negociere → Notariat/Câștigat
- **Card 4 zone**: tip tranzacție · client+adresă · preț+comision+agent · detalii
- **Intent badge**: Vânzare / Chirie cu commission hint adaptiv

### Workspace Direction
- Toggle global `sale | rent | both` per cabinet (Regula 20 §9)
- Filtrare automată leads/properties/deals/notary la schimbare direcție

### Cabinet Personal
- **Agent**: sumar + obiective lunare (catalog 10 obiective) + parteneri (cont individual)
- **Agenție**: KPI 30 zile + echipă + Partner Registry (editat de team_lead/manager)
- **Grup**: leaderboard + cotă proprie
- **BR-32 Partner Registry**: governance agency vs individual + MLS cooperation

### Notariat & Contracte
- **Acte notariale** (vânzare): SCHEDULED → SIGNED → CADASTRE_REGISTERED
- **Contracte chirie** (rent): DRAFTED → REVIEWED → SIGNED × 2 → DEPOSIT_PAID → ACTIVE

### i18n
- **RO / RU / EN** complete pentru toate paginile și componentele
- Regula 11 (puritate i18n): zero anglicisme nejustificate în RO/RU

---

## Stack tehnic

| Layer | Tehnologie |
|---|---|
| Frontend demo | Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui |
| Backend API | NestJS 10 · Fastify adapter · Drizzle ORM |
| Baza de date | PostgreSQL + pgvector (HNSW Phase M1.S4+) |
| Cache | Redis |
| Auth | JWT RS256 (jose) · Argon2id · refresh rotation |
| Mesagerie | WhatsApp Business API (5 templates pre-aprobate) |
| Lead Intake | Webhooks Meta / Google / OLX (HMAC-SHA256) |
| Deployment | Vercel (web-preview) · Docker (api) |

---

## Documente cheie

| Document | Versiune | Scop |
|---|---|---|
| [`CLAUDE.md`](./CLAUDE.md) | v1.2.32 | Context per-sesiune + 21 reguli operaționale |
| [`BRD_REVYX_v1.5.0.md`](./docs/BRD_REVYX_v1.5.0.md) | v1.5.0 | Cerințe business + formule scoring + BR-01..32 |
| [`MASTER_PLAN`](./docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md) | v1.1.2 | Milestones M0/M1/M2 + acceptance criteria |
| [`PLATFORM_MATRIX`](./docs/PLATFORM_MATRIX_REVYX_web-mobile_v1.1.0.md) | v1.1.0 | Feature × platform map (131 features) |
| [`ROADMAP`](./docs/ROADMAP_REVYX_detailed-execution_v1.0.17.md) | v1.0.17 | Atomic tasks T-XXX (~308 total) |
| [`INDEX`](./docs/INDEX_REVYX_documents_v1.1.24.md) | v1.1.24 | Catalog complet toate documentele |
| [`TECH_SPEC phase0-security`](./docs/tech-spec/TECH_SPEC_REVYX_phase0-security_v1.0.0.md) | v1.0.0 | JWT + RBAC + GDPR + AUDIT_LOG + HMAC |
| [`TECH_SPEC audit-log`](./docs/tech-spec/TECH_SPEC_REVYX_audit-log_v1.1.2.md) | v1.1.2 | AUDIT_LOG append-only + catalog events |
| [`TECH_SPEC realtor-ethics`](./docs/tech-spec/TECH_SPEC_REVYX_realtor-ethics_v1.0.0.md) | v1.0.0 | NAR/APAIM mapping + ethics checkpoints |
| [`TECH_SPEC mls-cooperation`](./docs/tech-spec/TECH_SPEC_REVYX_mls-cooperation_v1.0.0.md) | v1.0.0 | MLS commission split + Open House + BR-29 |
| [`ARCH AGI capability map`](./docs/ARCH_REVYX_agent-routine-capability-map_v1.0.0.md) | v1.0.0 | Operating Loop + AGI Val 1-4 + datorie D-1..D-7 |

---

## Convenții

- **Limbă documentație**: română (primar) · engleză (cod, GitHub, commit messages) · rusă (UI secundar)
- **Versionare**: semantic `vMAJOR.MINOR.PATCH` — un singur fișier viu per document (Regula 18)
- **Marcaj modificări**: `★` = nou sau actualizat față de versiunea anterioară
- **Timezone**: UTC+2 (Chișinău) pentru toate calculele temporale
- **Currency**: EUR default · MDL · USD
- **Scoring range**: toate scorurile ∈ [0, 1] — excepție unică NBA ∈ [0, 2.0]

---

*© 2026 REVYX · ITPRO SYSTEM SRL · All Rights Reserved*
