# DOC_MASTER — Orchestrator Documentație REVYX
<!-- docs/skills/DOC_MASTER.md · v1.0.1 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM | Definiție inițială orchestrator |
| 1.0.1 | 2026-05 | Senior PM | §3.4 Impact propagation (CLAUDE.md §13) — orchestrator forțează Impact Assessment |

---

## 1. Identitate skill

| Atribut | Valoare |
|---|---|
| **Nume** | DOC_MASTER |
| **Tip** | Orchestrator skill |
| **Rol** | Coordonează toate sub-skillurile de documentație REVYX |
| **Inputuri obligatorii** | `docs/brand-configs/revyx.md` · `docs/templates/HEADER_STANDARD.md` |
| **Inputuri context** | `docs/BRD_REVYX_v1.0.0.md` · documente versiune anterioară |

---

## 2. Sub-skilluri coordonate

```
DOC_MASTER
├── SKILL_BRD       → Business Requirements Document
├── SKILL_PRD       → Product Requirements Document
├── SKILL_TECH_SPEC → Technical Specification
└── SKILL_WORKFLOW  → Workflow & Process Maps
```

| Sub-skill | Output | Audiență |
|---|---|---|
| `SKILL_BRD` | `docs/BRD_REVYX_v[X.Y.Z].md` | PM · Solution Architect · Stakeholders |
| `SKILL_PRD` | `docs/prd/PRD_REVYX_[scope]_v[X.Y.Z].md` | Product Designer · Frontend · QA |
| `SKILL_TECH_SPEC` | `docs/tech-spec/TECH_SPEC_REVYX_[scope]_v[X.Y.Z].md` | Backend · DevOps · Security |
| `SKILL_WORKFLOW` | `docs/workflow/WORKFLOW_REVYX_[scope]_v[X.Y.Z].md` | Toate rolurile |

---

## 3. Reguli orchestrare

### 3.1 Order of operations

1. **Citește brand-config** (`docs/brand-configs/revyx.md`) — paletă, ton, structură header
2. **Citește template-ul header** (`docs/templates/HEADER_STANDARD.md`)
3. **Citește versiunea anterioară** dacă există (pentru changelog & ★ marking)
4. **Citește BRD-ul curent** (`docs/BRD_REVYX_v1.0.0.md`) — sursa de adevăr business
5. Apelează sub-skillul potrivit cu contextul agregat
6. Validează output-ul cu checklist-ul din `HEADER_STANDARD.md` §7

### 3.2 Detectare versiune

Pe baza modificării cerută:

| Tip modificare | Increment |
|---|---|
| Schimbare cerințe / breaking change business logic | MAJOR (`+1.0.0`) |
| Adăugare cerință / formulă / entitate fără breaking change | MINOR (`+0.1.0`) |
| Clarificare / typo / reformulare | PATCH (`+0.0.1`) |

### 3.3 Reguli inflexibile

- ❌ Nu generează un document fără header complet conform `HEADER_STANDARD.md`
- ❌ Nu modifică formulele scoring fără referință explicită la BRD §7 + aprobare PM
- ❌ Nu introduce CRM-isme — REVYX = AOS
- ❌ Nu folosește culori/fonturi în afara paletei `revyx.md`
- ❌ Nu omite changelog-ul la nicio modificare
- ❌ ★ Nu finalizează un PR fără **Impact Assessment** completat (`CLAUDE.md` §13)
- ✅ Marchează cu `★` orice element nou față de versiunea anterioară
- ✅ La orice contradicție între documente: BRD prevalează asupra PRD/Tech Spec

### 3.4 ★ Impact Propagation (v1.0.1)

DOC_MASTER **forțează** propagarea modificărilor între documente conform matricei din `CLAUDE.md` §13.2:

| Modificare în | Propagă obligatoriu către | Test obligatoriu |
|---|---|---|
| BRD §4-§6 (cerințe) | PRD afectat + Tech Spec impl + Workflow MD | AC re-validate |
| BRD §7 (scoring) | Tech Spec algorithm | Regression T01-T07 |
| BRD §8 (entitate) | Tech Spec schema + PRD UI + Workflow MD | Migration up+down |
| BRD §10 (RBAC) | Tech Spec catalog + PRD UI | Permission resolution + RLS |
| BRD §4.3 (tenancy) | Tech Spec behavior + PRD per-tenancy + Workflow MD | E2E per tenant_type |
| `revyx.md` (brand) | Toate documentele care referențiază paleta/tipografia | Visual regression |
| Skill `SKILL_*` | Toate documentele generate cu acel skill | Doc lint |

**Comportament orchestrator la modificare:**

1. Detectează tipul modificării (vezi tabel)
2. Identifică TOATE documentele afectate prin grep referințe
3. Generează update propus pentru fiecare document afectat
4. Refuză merge dacă vreun document afectat nu e actualizat SAU justificat în Impact Assessment

---

## 4. Trigger usage

DOC_MASTER se invocă atunci când:

| Trigger | Acțiune |
|---|---|
| "Generează BRD" | → `SKILL_BRD` |
| "Generează PRD pentru [pilon]" | → `SKILL_PRD` cu scope=pilon |
| "Generează Tech Spec pentru [componentă]" | → `SKILL_TECH_SPEC` cu scope=componentă |
| "Generează Workflow MD pentru [proces]" | → `SKILL_WORKFLOW` cu scope=proces |
| "Actualizează [document] cu [modificare]" | → sub-skill corespunzător + bump versiune |

---

## 5. Output policy

Toate sub-skillurile trebuie să:

1. Returneze un singur fișier `.md` cu nume conform convenției
2. Includă Changelog actualizat cu intrare nouă
3. Marcheze `★` pe toate adăugările/modificările
4. Includă footer brandat
5. Treacă checklist-ul `HEADER_STANDARD.md` §7

---

## 6. Trasabilitate cross-document

| Sursă | Destinație | Regulă |
|---|---|---|
| BRD (cerință business BR-XX) | PRD (user story US-XX) | PRD trebuie să referențieze BR sursă |
| BRD (formulă scoring §7) | Tech Spec (algoritm) | Tech Spec implementează exact formula din BRD |
| BRD (entitate §8) | Tech Spec (schema BD) | Tech Spec materializează schema |
| BRD / PRD (acceptance criteria) | Workflow MD (validare flux) | Workflow demonstrează AC-urile |

Niciun document nu poate introduce cerințe noi care nu sunt în BRD. Dacă apar, **DOC_MASTER cere update BRD întâi**.

---

*docs/skills/DOC_MASTER.md · v1.0.1 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
