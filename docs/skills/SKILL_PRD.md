# SKILL_PRD — Product Requirements Document Generator
<!-- docs/skills/SKILL_PRD.md · v1.0.1 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM | Definiție inițială sub-skill |
| 1.0.1 | 2026-05 | Senior PM | Output checklist extins cu Impact Assessment (CLAUDE.md §13) |

---

## 1. Identitate

| Atribut | Valoare |
|---|---|
| **Parent** | DOC_MASTER |
| **Output** | `docs/prd/PRD_REVYX_[scope]_v[X.Y.Z].md` |
| **Audiență** | Product Designer · Frontend · QA · UX |
| **Limbă** | Română |
| **Granularitate** | 1 PRD per pilon funcțional sau per feature mare |

---

## 2. Scope possibilities

| Scope | Filename pattern |
|---|---|
| Lead Intelligence | `PRD_REVYX_lead-intelligence_v[X.Y.Z].md` |
| Supply Intelligence | `PRD_REVYX_supply-intelligence_v[X.Y.Z].md` |
| Match Intelligence | `PRD_REVYX_match-intelligence_v[X.Y.Z].md` |
| Execution Intelligence | `PRD_REVYX_execution-intelligence_v[X.Y.Z].md` |
| Negotiation Intelligence | `PRD_REVYX_negotiation-intelligence_v[X.Y.Z].md` |
| Deal Intelligence | `PRD_REVYX_deal-intelligence_v[X.Y.Z].md` |
| Performance Intelligence | `PRD_REVYX_performance-intelligence_v[X.Y.Z].md` |
| Showcase Links | `PRD_REVYX_showcase-links_v[X.Y.Z].md` |
| Dashboard Agent | `PRD_REVYX_agent-dashboard_v[X.Y.Z].md` |

---

## 3. Structură obligatorie

| # | Secțiune | Conținut |
|---|---|---|
| 1 | Executive Summary | Scope · referință BRD pilon · diferențiator |
| 2 | Linkare BRD | Tabel BR-XX → US-XX (trasabilitate) |
| 3 | User Personas | Min 2 personas relevante (agent, manager, etc) |
| 4 | User Stories | Format `As [persona], I want [action] so that [benefit]` |
| 5 | Functional Requirements | FR-XX cu prioritate (Must/Should/Could) |
| 6 | UI Specifications | Componente folosite din `revyx.md` §5 · paletă · tipografie |
| 7 | Wireframes / Mockups | Referințe Figma SAU diagrame ASCII |
| 8 | Interaction Flows | Mermaid sau ASCII per flow major |
| 9 | Empty States | Tot ce poate fi gol → mesaj + CTA |
| 10 | Error States | Mapare erori backend → mesaj user-friendly RO |
| 11 | Loading States | Skeleton / spinner / progress per scenariu |
| 12 | Accessibility | WCAG 2.1 AA · keyboard nav · screen reader |
| 13 | i18n | RO primar · RU secundar (UI labels) |
| 14 | Acceptance Criteria | AC-XX detaliate UI (separat de AC business din BRD) |
| 15 | Out of Scope | Explicit ce NU face acest PRD |
| 16 | Open Questions | Întrebări deschise pentru PM/Arhitect |

---

## 4. Reguli inflexibile

### Brand consistency

- Toate culorile, font-urile, componentele **strict** din `docs/brand-configs/revyx.md`
- Spațiere pe grid 8px (sp1=8, sp2=16, ...)
- Border-radius: r-sm=4, r-md=8, r-lg=14, r-xl=20, badge=100
- Ton UI copy: profesional · concis · fără jargon · în română

### Lead Temperature visual coding

| Nivel LS | Token culoare |
|---|---|
| Rece (<0.40) | `--blue` (#3B82F6) |
| Warm (0.40-0.60) | `--sel` amber (#F59E0B) |
| Calificat (0.60-0.75) | `--gold` (#C9870A) |
| HOT (≥0.75) | `--red` (#E03030) cu animație pulsantă |

### Trasabilitate BRD

Fiecare User Story trebuie să referențieze cel puțin un BR-XX din BRD §6.
Format obligatoriu:

```markdown
**US-12** — Vizualizare lead nou în queue
> _Refs: BR-01, BR-02, AC-LF-01_

As an **agent**, I want to see new qualified leads in my task queue
so that I can respond within SLA.
```

### Limbi UI

- Toate string-urile UI documentate în RO + RU
- Niciun copy în engleză în UI client (decât termeni standard precum "WhatsApp", "GDPR")

---

## 5. Output checklist

- [ ] Header standard
- [ ] Linkare cu BR-XX din BRD prezentă
- [ ] Min 5 user stories per pilon
- [ ] FR-XX cu prioritate Must/Should/Could
- [ ] Empty / Error / Loading states pentru toate ecranele
- [ ] Toate culorile și font-urile referențiate sunt în `revyx.md`
- [ ] Out of Scope completat (nu lăsa gol)
- [ ] Footer brandat
- [ ] **★ Impact Assessment** completat în PR description (`docs/templates/IMPACT_ASSESSMENT.md`)
- [ ] **★ Cross-link cu BRD verificat**: fiecare US-XX referențiază BR-XX existent
- [ ] **★ E2E + Accessibility (WCAG 2.1 AA) listate ca obligatorii** (chiar dacă cod încă nu există)
- [ ] **★ Visual regression listat dacă atinge brand-config**

---

## 6. Anti-pattern

- ❌ Nu introduce stări UI fără spec brand-config
- ❌ Nu duplica cerințe din BRD — referențiază-le
- ❌ Nu propune feature-uri care nu sunt în BRD (cere update BRD întâi)
- ❌ Nu omite stările goale / de eroare / de loading
- ❌ Nu folosi screenshot-uri cu date reale clienți (mock data only)

---

*docs/skills/SKILL_PRD.md · v1.0.1 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
