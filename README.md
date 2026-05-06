# REVYX

**Real Estate Execution Intelligence**
Agent Operating System (AOS) pentru agenți imobiliari — nu un CRM clasic.

> **CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL**

---

## Despre REVYX

REVYX automatizează și controlează întregul ciclu de viață al unei tranzacții imobiliare prin intermediul unui AI layer nativ. Piața primară: **Republica Moldova**.

Diferențiatori:

- 7 piloni funcționali (Lead, Supply, Match, Execution, Negotiation, Deal, Performance Intelligence)
- 8 formule de scoring AI (LS, PS, IS, DP, NBA, TS, APS, DHI)
- Lead Firewall + Manager Override + Escalation Protocol 3 niveluri
- Property Showcase Links (link public unic per proprietate)
- Maximum 3 task-uri active per agent — focus și execuție
- GDPR-compliant by design

---

## Structura repo

```
REVYX.app/
├── CLAUDE.md                     ← citit de Claude Code la fiecare sesiune
├── README.md                     ← acest fișier
└── docs/
    ├── brand-configs/
    │   └── revyx.md              ← brand system (culori, font, componente)
    ├── BRD_REVYX_v1.0.0.md       ← Business Requirements Document
    ├── prd/                      ← Product Requirements Documents
    ├── tech-spec/                ← Technical Specifications
    ├── workflow/                 ← Workflow & Process Maps
    ├── skills/                   ← Skill definitions (DOC_MASTER + sub-skills)
    ├── templates/                ← Templates documente (BRD, PRD, etc)
    └── legal/                    ← Privacy Policy, Cookie Policy, ToS
```

## Documente cheie

| Document | Scop |
|---|---|
| [`CLAUDE.md`](./CLAUDE.md) | Context per-sesiune pentru Claude Code |
| [`docs/brand-configs/revyx.md`](./docs/brand-configs/revyx.md) | Brand system complet |
| [`docs/BRD_REVYX_v1.0.0.md`](./docs/BRD_REVYX_v1.0.0.md) | Business Requirements |
| [`docs/templates/HEADER_STANDARD.md`](./docs/templates/HEADER_STANDARD.md) | Header standard documente |
| [`docs/templates/IMPACT_ASSESSMENT.md`](./docs/templates/IMPACT_ASSESSMENT.md) | Template Impact Assessment (CLAUDE.md §13) |
| [`docs/tech-spec/TECH_SPEC_REVYX_audit-log_v1.0.0.md`](./docs/tech-spec/TECH_SPEC_REVYX_audit-log_v1.0.0.md) | AUDIT_LOG append-only · Phase 0 |
| [`docs/tech-spec/TECH_SPEC_REVYX_webhook-intake_v1.0.0.md`](./docs/tech-spec/TECH_SPEC_REVYX_webhook-intake_v1.0.0.md) | Webhook intake HMAC + DLQ · Phase 0 |
| [`docs/tech-spec/TECH_SPEC_REVYX_tenancy-roles-extension_v1.0.0.md`](./docs/tech-spec/TECH_SPEC_REVYX_tenancy-roles-extension_v1.0.0.md) | 4 custom roles tenancy · Phase 0 |
| [`docs/tech-spec/TECH_SPEC_REVYX_lead-scoring_v1.0.0.md`](./docs/tech-spec/TECH_SPEC_REVYX_lead-scoring_v1.0.0.md) | Lead Scoring Engine: LS, IS, TS · Lead Firewall · Escalation · Phase 1 |
| [`docs/tech-spec/TECH_SPEC_REVYX_property_v1.0.0.md`](./docs/tech-spec/TECH_SPEC_REVYX_property_v1.0.0.md) | Property Engine: PS, LF, Pricing AI hooks, pgvector · Phase 1 |
| [`docs/tech-spec/TECH_SPEC_REVYX_showcase-links_v1.0.0.md`](./docs/tech-spec/TECH_SPEC_REVYX_showcase-links_v1.0.0.md) | Showcase Links: token 6 char · rate limiting · 410 Gone · Phase 1 |
| [`docs/tech-spec/TECH_SPEC_REVYX_showing_v1.0.0.md`](./docs/tech-spec/TECH_SPEC_REVYX_showing_v1.0.0.md) | SHOWING schema dedicată: EXCLUDE calendar · reminder T-24h · no-show · feedback · Phase 1 |
| [`docs/tech-spec/TECH_SPEC_REVYX_nba-engine_v1.0.0.md`](./docs/tech-spec/TECH_SPEC_REVYX_nba-engine_v1.0.0.md) | NBA Engine: DP×UF×e^(−0.1·Δt) · scala [0,2.0] · Task Allocator BR-04 · UTC+2 · Phase 1 |
| [`docs/tech-spec/TECH_SPEC_REVYX_dhi-engine_v1.0.0.md`](./docs/tech-spec/TECH_SPEC_REVYX_dhi-engine_v1.0.0.md) | DHI Engine: DP×(1−RF)×TF · TF_default=0.70 (BR-10) · alert <0.40 · NFR-03 · Phase 1 |
| [`docs/tech-spec/TECH_SPEC_REVYX_match-engine_v1.0.0.md`](./docs/tech-spec/TECH_SPEC_REVYX_match-engine_v1.0.0.md) | Match Engine: DP=0.30·LS+0.30·PS+0.20·APS+0.20·IS · 12 criterii · BR-05/11 · Phase 1 |
| [`docs/workflow/WORKFLOW_REVYX_tenant-lifecycle_v1.0.0.md`](./docs/workflow/WORKFLOW_REVYX_tenant-lifecycle_v1.0.0.md) | Lifecycle tenant: ACTIVE → DELETED |
| [`docs/workflow/WORKFLOW_REVYX_lead-lifecycle_v1.0.0.md`](./docs/workflow/WORKFLOW_REVYX_lead-lifecycle_v1.0.0.md) | Lead lifecycle: INTAKE → FIREWALL → QUEUE → CONTACT → SHOWING → OFFER → DEAL/LOST |
| [`docs/workflow/WORKFLOW_REVYX_property-onboarding_v1.0.0.md`](./docs/workflow/WORKFLOW_REVYX_property-onboarding_v1.0.0.md) | Property onboarding: INTAKE → VALIDATION → PRICING → SHOWCASE_PUBLISH → MONITORING |
| [`docs/workflow/WORKFLOW_REVYX_showing-flow_v1.0.0.md`](./docs/workflow/WORKFLOW_REVYX_showing-flow_v1.0.0.md) | Showing flow: SCHEDULED → REMINDER → ATTENDED/NO_SHOW → FEEDBACK → IS+LS update |
| [`docs/workflow/WORKFLOW_REVYX_escalation_v1.0.0.md`](./docs/workflow/WORKFLOW_REVYX_escalation_v1.0.0.md) | Escalation Protocol: N1/N2/N3 · auto-reasignare BR-04 + BR-11 · BR-03 |
| [`docs/workflow/WORKFLOW_REVYX_offer-chain_v1.0.0.md`](./docs/workflow/WORKFLOW_REVYX_offer-chain_v1.0.0.md) | Offer Chain: counter_to_offer_id · 3-7 runde · accept → WON_PENDING_NOTARY |
| [`docs/workflow/WORKFLOW_REVYX_deal-closure_v1.0.0.md`](./docs/workflow/WORKFLOW_REVYX_deal-closure_v1.0.0.md) | Deal Closure path WON: notarial chain MD · NPS · APS DCR · GDPR retention 3 ani |
| [`docs/legal/privacy-policy.md`](./docs/legal/privacy-policy.md) | Privacy Policy draft (v0.1) |
| [`docs/legal/cookie-policy.md`](./docs/legal/cookie-policy.md) | Cookie Policy draft (v0.1) |

## Convenții

- **Limbă documentație**: română (primar) · engleză (cod, GitHub) · rusă (UI secundar)
- **Versionare documente**: semantic versioning `vMAJOR.MINOR.PATCH`
- **Header obligatoriu** pentru orice document Markdown nou (vezi `CLAUDE.md` §2)
- **Marcaj modificări**: `★` = nou sau actualizat față de versiunea anterioară
- **Timezone**: UTC+2 (Chișinău) pentru toate calculele temporale
- **Currency**: EUR default · MDL · USD

## Roadmap sesiuni

| Sesiune | Conținut | Status |
|---|---|---|
| S1 | Brand · BRD · Templates · Skills | ✅ |
| S2 | Phase 0 Security: AUDIT_LOG · Webhook Intake · Tenancy Roles · Privacy/Cookie | ✅ |
| S3 | Phase 1 Core: Lead Scoring · Property · Showcase + 3 workflows (lead, property, showing) | ✅ |
| S4 | Phase 1 rest: SHOWING schema · NBA Engine · DHI Engine · Match Engine · workflows (escalation, offer-chain, deal-closure) | ✅ |
| S5 | Phase 2: Pricing AI · Match Engine v2 (pgvector ANN) · IS engine · Concurrency hardening · Offer · Deal Closure · APS engine | ✅ |
| S5+ Audit | External audit pass (Architect+Security+DBA+Compliance+Product+QA) — schema/GDPR/security fixes + Regula 3 (recurring checkpoints) | ✅ |

---

## Status

| Componentă | Versiune | Status |
|---|---|---|
| Brand Config | v1.0.0 | ✅ Aprobat |
| BRD | v1.0.0 | ✅ Aprobat |
| Templates · HEADER_STANDARD | v1.0.0 | ✅ Aprobat |
| Templates · IMPACT_ASSESSMENT | v1.0.0 | ✅ Aprobat |
| Skills · DOC_MASTER + 4 sub-skills | v1.0.0 | ✅ Aprobat |
| Tech Spec · AUDIT_LOG | v1.0.0 | ✅ Aprobat (Phase 0) |
| Tech Spec · Webhook Intake | v1.0.0 | ✅ Aprobat (Phase 0) |
| Tech Spec · Tenancy Roles Extension | v1.0.0 | ✅ Aprobat (Phase 0) |
| Workflow · Tenant Lifecycle | v1.0.0 | ✅ Aprobat |
| Tech Spec · Lead Scoring | v1.0.0 | ✅ Aprobat (Phase 1 — S3) |
| Tech Spec · Property | v1.0.0 | ✅ Aprobat (Phase 1 — S3) |
| Tech Spec · Showcase Links | v1.0.0 | ✅ Aprobat (Phase 1 — S3) |
| Workflow · Lead Lifecycle | v1.0.0 | ✅ Aprobat (S3) |
| Workflow · Property Onboarding | v1.0.0 | ✅ Aprobat (S3) |
| Workflow · Showing Flow | v1.0.0 | ✅ Aprobat (S3) |
| Privacy Policy (draft) | v0.1.0 | ⏳ LEGAL_REVIEW_PENDING |
| Cookie Policy (draft) | v0.1.0 | ⏳ LEGAL_REVIEW_PENDING |
| PRD | — | ⏳ În pregătire |
| Tech Spec · SHOWING (schema dedicată) | v1.0.0 | ✅ Aprobat (Phase 1 — S4) |
| Tech Spec · NBA Engine | v1.0.0 | ✅ Aprobat (Phase 1 — S4) |
| Tech Spec · DHI Engine | v1.0.0 | ✅ Aprobat (Phase 1 — S4) |
| Tech Spec · Match Engine | v1.0.0 | ✅ Aprobat (Phase 1 — S4) |
| Workflow · Escalation Protocol | v1.0.0 | ✅ Aprobat (S4) |
| Workflow · Offer Chain | v1.0.0 | ✅ Aprobat (S4) |
| Workflow · Deal Closure path WON | v1.0.0 | ✅ Aprobat (S4) |
| Phase 0 Security | — | 🟡 Specs livrate · cod aplicație blocat până implementare |
| Phase 1 Core Engines | — | 🟢 Specs complete (Lead Scoring · Property · Showcase · SHOWING · NBA · DHI · Match) |
| Phase 2 (S5) | — | ✅ Pricing AI · Match Engine v2 (pgvector) · IS engine · Concurrency hardening · Offer · Deal Closure · APS engine |

---

*© 2026 REVYX · ITPRO SYSTEM SRL · All Rights Reserved*
