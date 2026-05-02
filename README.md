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
| PRD | — | ⏳ În pregătire |
| Tech Spec | — | ⏳ În pregătire |
| Workflow MD | — | ⏳ În pregătire |
| Phase 0 Security | — | ⛔ Blocant pentru dev |

---

*© 2026 REVYX · ITPRO SYSTEM SRL · All Rights Reserved*
