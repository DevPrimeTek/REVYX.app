# Template — Header Standard REVYX
<!-- docs/templates/HEADER_STANDARD.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

> Template-ul oficial pentru orice document Markdown din proiectul REVYX.
> **Toate** skillurile DOC_* trebuie să respecte această structură.

## Changelog
| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM | Template inițial |

---

## 1. Header obligatoriu

Orice document nou (`BRD_*.md`, `PRD_*.md`, `TECH_SPEC_*.md`, `WORKFLOW_*.md`, `brand-configs/*.md`) începe cu **exact acest bloc**:

```markdown
# [TITLU DOCUMENT ÎN MAJUSCULE]
<!-- [filename].md · v[MAJOR.MINOR.PATCH] · [YYYY-MM] -->
<!-- CONFIDENȚIAL · Uz Intern · © [YYYY] REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| x.y.z | YYYY-MM | Autor / Rol | Descriere modificare |

---
```

### Reguli header

| Element | Regulă |
|---|---|
| Titlu | H1 unic per document · majuscule pentru acronime (BRD, PRD, AOS) |
| Filename | În comentariul HTML — exact ca pe disc |
| Versiune | Semantic versioning `vMAJOR.MINOR.PATCH` |
| Data | Format ISO scurt `YYYY-MM` |
| An copyright | Anul curent — `2026` la momentul creării |
| Confidențialitate | Mereu inclusă · niciun document REVYX nu e public fără aprobare |

---

## 2. Cuprins (TOC)

Pentru documente >5 secțiuni, include cuprins cu link-uri ancoră:

```markdown
## Cuprins

1. [Executive Summary](#1-executive-summary)
2. [Context](#2-context)
3. [...](#3-...)
```

Anchor format: lowercase, spații → `-`, fără diacritice (GitHub convention).

---

## 3. Marcaj modificări

`★` = element nou sau actualizat față de versiunea anterioară.

```markdown
### 7.3 Interaction Strength (IS) ★ Formulă Nouă
```

```markdown
- Escalation Protocol 3 niveluri (★ nou v1.1)
```

Folosit în:
- Titluri secțiuni
- Rânduri tabel
- Bullet points
- Inline pentru atribute noi în paragrafe

**Curățare:** la următoarea versiune MAJOR, marcajele `★` din versiunea precedentă pot fi îndepărtate.

---

## 4. Limbă

| Conținut | Limbă |
|---|---|
| Documentație business (BRD, PRD) | Română |
| Documentație tehnică (Tech Spec) | Română (cu termeni tehnici EN păstrați) |
| Workflow & Process Maps | Română |
| Cod în exemple | Engleză (variabile, comentarii) |
| Termeni tehnici standard | Engleză (Lead Score, JWT, webhook, etc) |

---

## 5. Stil & ton

- **Profesional · precis · executiv**
- Fără jargon inutil · fără emoji în corp document
- Tabele preferate listelor lungi când e structurat
- Cod blocks cu syntax highlight (` ```sql `, ` ```typescript `, ` ```yaml `)
- Diagrame ASCII / Mermaid pentru flow-uri (nu screenshots când se poate evita)

---

## 6. Footer obligatoriu

Ultimul bloc al oricărui document:

```markdown
---

*[filename].md · v[MAJOR.MINOR.PATCH] · [YYYY-MM] · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © [YYYY] REVYX · ITPRO SYSTEM SRL*
```

---

## 7. Checklist pre-commit document nou

- [ ] Header complet cu filename, versiune, data, copyright
- [ ] Changelog cu intrare pentru versiunea curentă
- [ ] Cuprins (dacă >5 secțiuni)
- [ ] `★` aplicat consistent pentru elemente noi
- [ ] Footer prezent
- [ ] Filename respectă convenția: `[TIP]_REVYX_v[X.Y.Z].md`
- [ ] Validate cu `docs/brand-configs/revyx.md` (paletă, ton)
- [ ] Validate cu `docs/BRD_REVYX_v1.1.0.md` (cerințe business)
- [ ] Niciun secret / date reale clienți în exemple

---

*docs/templates/HEADER_STANDARD.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
