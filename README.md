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
| [`docs/workflow/WORKFLOW_REVYX_tenant-lifecycle_v1.0.0.md`](./docs/workflow/WORKFLOW_REVYX_tenant-lifecycle_v1.0.0.md) | Lifecycle tenant: ACTIVE → DELETED |
| [`docs/legal/privacy-policy.md`](./docs/legal/privacy-policy.md) | Privacy Policy draft (v0.1) |
| [`docs/legal/cookie-policy.md`](./docs/legal/cookie-policy.md) | Cookie Policy draft (v0.1) |

## Convenții

- **Limbă documentație**: română (primar) · engleză (cod, GitHub) · rusă (UI secundar)
- **Versionare documente**: semantic versioning `vMAJOR.MINOR.PATCH`
- **Header obligatoriu** pentru orice document Markdown nou (vezi `CLAUDE.md` §2)
- **Marcaj modificări**: `★` = nou sau actualizat față de versiunea anterioară
- **Timezone**: UTC+2 (Chișinău) pentru toate calculele temporale
- **Currency**: EUR default · MDL · USD

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
| Privacy Policy (draft) | v0.1.0 | ⏳ LEGAL_REVIEW_PENDING |
| Cookie Policy (draft) | v0.1.0 | ⏳ LEGAL_REVIEW_PENDING |
| PRD | — | ⏳ În pregătire (S3) |
| Tech Spec · Lead Scoring · Property · Showcase | — | ⏳ În pregătire (S3) |
| Workflow · Lead Lifecycle · Property Onboarding · Showing | — | ⏳ În pregătire (S3) |
| Phase 0 Security | — | 🟡 Specs livrate · cod aplicație blocat până implementare |

---

*© 2026 REVYX · ITPRO SYSTEM SRL · All Rights Reserved*
