# Template — Impact Assessment
<!-- docs/templates/IMPACT_ASSESSMENT.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

> Template **obligatoriu** pentru orice PR care modifică documente sau cod în REVYX.
> Referință: `CLAUDE.md` §13 Protocol Impact & Testare.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM | Template inițial |

---

## Cum se folosește

1. Copiază blocul de mai jos în descrierea PR-ului
2. Completează fiecare câmp — **NU lăsa gol nicio secțiune**
3. Marchează checkbox-urile pe măsură ce rulezi testele
4. PR-ul **nu se merge** cu Impact Assessment incomplet

---

## Bloc Impact Assessment (copiază în PR)

```markdown
## Impact Assessment

### 1. Tipul modificării

> Bifează **toate** categoriile aplicabile (poate fi mai mult de una):

- [ ] BRD — cerință business (BR-XX)
- [ ] Formulă scoring (LS / PS / IS / DP / NBA / TS / APS / DHI)
- [ ] Entitate nouă în data model
- [ ] Permisiune nouă / RBAC change
- [ ] Tenancy model nou / comportament per tenancy
- [ ] API contract change
- [ ] UI / UX change
- [ ] Schema migration
- [ ] Performance budget change (NFR)
- [ ] Security / GDPR change
- [ ] Brand-config change
- [ ] Skill definition change (`SKILL_*`)
- [ ] Doc-only (clarificare, typo, reformulare)

### 2. Documente actualizate

> Listează fiecare fișier modificat și de ce. Bump versiune (PATCH/MINOR/MAJOR) pentru fiecare.

| Fișier | Versiune înainte → după | Motivul modificării |
|---|---|---|
| `docs/...` | vX.Y.Z → vX.Y.Z | ... |

### 3. Documente afectate care NU au fost actualizate

> Dacă lași un document neatins, justifică EXPLICIT de ce nu necesită update. Lista de propagare obligatorie din `CLAUDE.md` §13.2:
> - BRD change → PRD + Tech Spec + Workflow MD
> - Tech Spec change → cod + tests
> - Brand-config change → toate documentele care referențiază paleta
> - Skill change → toate documentele generate cu acel skill

| Document | De ce NU a fost actualizat |
|---|---|
| ... | ... |

### 4. Cod afectat

> Listează fișiere modificate SAU "N/A (docs-only)" dacă nu există cod încă.

- `src/...` — descriere
- SAU: **N/A** (docs-only — niciun cod scris încă)

### 5. Teste rulate / specificate

> Bifează doar testele **efectiv rulate**. Pentru cele necesare dar nerulate (cod nu există încă), notează "specificat" și creează issue.

| Tip | Status | Note |
|---|---|---|
| Doc lint (header, version, changelog, footer, anchor TOC) | [ ] rulat / [ ] N/A | ... |
| Unit tests | [ ] rulat / [ ] specificat / [ ] N/A | ... |
| Integration tests | [ ] rulat / [ ] specificat / [ ] N/A | ... |
| E2E tests | [ ] rulat / [ ] specificat / [ ] N/A | ... |
| Regression scoring T01-T07 (BRD §12) | [ ] rulat / [ ] N/A | OBLIGATORIU dacă atinge formulă scoring |
| Migration up+down | [ ] rulat / [ ] N/A | OBLIGATORIU dacă atinge schema |
| RLS bypass test | [ ] rulat / [ ] N/A | OBLIGATORIU dacă atinge tenant_id sau RBAC |
| Permission resolution (cu lanț moștenire) | [ ] rulat / [ ] N/A | OBLIGATORIU dacă atinge RBAC |
| Load test (k6) | [ ] rulat / [ ] N/A | OBLIGATORIU dacă atinge NFR performanță |
| Security scan (OWASP ZAP / pen test) | [ ] rulat / [ ] N/A | OBLIGATORIU dacă atinge auth / GDPR |
| Visual regression | [ ] rulat / [ ] N/A | OBLIGATORIU dacă atinge brand-config sau UI |
| Accessibility (axe-core, WCAG 2.1 AA) | [ ] rulat / [ ] N/A | OBLIGATORIU dacă atinge UI |
| Contract test (Pact / OpenAPI diff) | [ ] rulat / [ ] N/A | OBLIGATORIU dacă atinge API |
| Cross-doc consistency check | [ ] rulat / [ ] N/A | Verificare manuală: BR-XX / AC-XX / entități referențiate consistent |

### 6. Riscuri identificate & mitigări

| Risc | Severitate (low/med/high/critical) | Mitigare |
|---|---|---|
| ... | ... | ... |

### 7. Backwards compatibility

- [ ] Modificare păstrează compat
- [ ] Modificare e BREAKING — vezi `Tech Spec §17 Migration Strategy` pentru plan

> Dacă BREAKING: indică versiunea API afectată, fereastra de deprecation, comunicare către consumatori.

### 8. Performanță & SLO

> Doar dacă atinge NFR-uri din BRD §6.2. Listează măsurătorile p50/p99 vs. ținta din NFR.

| NFR | Țintă | Măsurat | OK? |
|---|---|---|---|
| ... | ... | ... | ... |

### 9. Validări manuale efectuate

> Lista a ceea ce ai testat manual (UI flow, scenarii de afaceri, edge cases).

- ...

### 10. Reviewers necesari

> Conform `CLAUDE.md` §10:
> - PM aprobă orice modificare de cerință / scoring
> - Solution Architect aprobă orice modificare arhitecturală / Tech Spec

- [ ] PM
- [ ] Solution Architect
- [ ] Senior Product Designer (dacă UI)
- [ ] QA Lead (dacă AC re-validat)
```

---

## Reguli pentru cazuri specifice

### Modificare doar de documentație (no code yet)

- Bifează **Doc-only**
- Setează `Cod afectat: N/A (docs-only)`
- Marchează tests ca `specificat` și creează issue de tracking
- Doc lint OBLIGATORIU rulat

### Modificare formulă scoring

- **NICIODATĂ** fără re-run regression T01-T07
- Bump **MINOR** pe BRD dacă adaugă variabilă, **MAJOR** dacă schimbă pondere
- Specifică explicit recalc pentru rolling 90 zile (APS, DHI)
- Cache invalidate Redis: `DEL scores:*`

### Modificare entitate / schema

- **NICIODATĂ** fără migration up+down testat
- Plan backfill pentru date existente
- RLS policy obligatorie dacă entitatea e tenant-scoped
- AUDIT_LOG event mapping

### Modificare RBAC / permisiune nouă

- Update seed migration `0003_seed_system_roles.sql`
- Re-validare custom roles existente: dacă perm e `critical`, doar parent=admin
- JWT `perms_hash` rotation
- Update Tech Spec §10.4 catalog permisiuni

### Modificare brand-config

- Listare obligatorie a TUTUROR documentelor care referențiază paleta/tipografia
- Visual regression run obligatoriu
- Contrast WCAG AA verificat

---

## Anti-patterns (NU FACE)

- ❌ "Tests: pass" fără să spui CARE teste
- ❌ "N/A" pe toate categoriile (înseamnă că n-ai analizat impactul)
- ❌ PR cu modificare BRD dar fără update PRD/Tech Spec corespunzător
- ❌ "Will add tests later" — testele se scriu ÎMPREUNĂ cu modificarea
- ❌ Skip secțiunea "Riscuri identificate" — orice modificare are cel puțin un risc

---

*docs/templates/IMPACT_ASSESSMENT.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
