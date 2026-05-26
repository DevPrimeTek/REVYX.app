# Template — Impact Assessment REVYX
<!-- docs/templates/IMPACT_ASSESSMENT.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

> Template-ul oficial pentru analiza de impact (CLAUDE.md §13).
> Orice document `BRD_*`, `PRD_*`, `TECH_SPEC_*`, `WORKFLOW_*` cu impact funcțional **trebuie** să includă o secțiune Impact Assessment construită din acest template.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM | Template inițial — Protocol Impact & Testare |

---

## 1. Bloc obligatoriu

Inclus la finalul oricărui document funcțional, înainte de footer:

```markdown
## X. Impact Assessment

### X.1 Scope of Change

| Element | Detaliu |
|---|---|
| **Document** | [filename · versiune] |
| **Tip schimbare** | NEW / MAJOR / MINOR / PATCH |
| **Aria afectată** | [pilon BRD · entitate · scoring · workflow] |
| **Origine** | [BRD §X · PRD §Y · gap descoperit · cerere stakeholder] |

### X.2 Impact pe documente conexe

| Document | Tip impact | Acțiune necesară |
|---|---|---|
| BRD_REVYX_v1.1.0.md | None / Minor / Major | [descriere acțiune sau "—"] |
| TECH_SPEC_REVYX_*.md | ... | ... |
| WORKFLOW_REVYX_*.md | ... | ... |
| brand-configs/revyx.md | ... | ... |

### X.3 Impact pe scoring

| Scor | Afectat? | Detaliu |
|---|---|---|
| LS · PS · IS · DP · NBA · TS · APS · DHI | DA / NU | [formulă · prag · default] |

### X.4 Impact pe entități / schema BD

| Entitate | Modificare | Migrare necesară |
|---|---|---|
| LEAD · PROPERTY · DEAL · AGENT · TASK · SHOWING · OFFER · ACTIVITY · AUDIT_LOG · ... | NEW / ALTER / NONE | [migration ID dacă există] |

### X.5 Impact pe RBAC

| Rol (system / custom) | Permisiuni adăugate | Permisiuni revocate |
|---|---|---|
| agent · senior_agent · team_lead · manager · admin · [custom] | ... | ... |

### X.6 Impact pe SLA & NFR

| NFR / SLA | Înainte | După | Validare |
|---|---|---|---|
| NFR-XX | ... | ... | [test ID sau metoda] |

### X.7 Impact pe Securitate & GDPR

| Aspect | Status | Notă |
|---|---|---|
| Date personale (PII) | DA / NU | [câmpuri afectate] |
| AUDIT_LOG events noi | DA / NU | [event names] |
| Consent flow | DA / NU | [versiune nouă consent] |
| HMAC / JWT / RBAC | DA / NU | [detaliu] |
| Rate limiting | DA / NU | [endpoint · prag] |

### X.8 Risks & Mitigations

| # | Risc | Probabilitate | Impact | Mitigare |
|---|---|---|---|---|
| R1 | ... | LOW / MED / HIGH | LOW / MED / HIGH | ... |

### X.9 Test Plan

| # | Tip | Scenariu | Rezultat așteptat | Owner |
|---|---|---|---|---|
| T1 | Unit / Integration / E2E / Load / Manual | ... | ... | QA / Dev |

### X.10 Rollout & Rollback

| Aspect | Detaliu |
|---|---|
| Feature flag | `flag.<scope>.enabled` (default OFF) |
| Strategie rollout | canary 10% → 50% → 100% |
| Rollback | feature flag OFF · DOWN migration documentată |
| Owner rollout | [rol / persoană] |

### X.11 Approval Gate

| Aprobator | Rol | Necesar pentru |
|---|---|---|
| Senior PM | Business | Modificări scoring · pilon · entitate |
| Solution Architect | Tehnic | Schema BD · arhitectură · NFR |
| Security Lead | Securitate | GDPR · AUDIT_LOG · auth |
| Legal | Conformitate | Privacy · Cookie · ToS · DPA |
```

---

## 2. Reguli de utilizare

| Tip schimbare | Impact Assessment necesar? |
|---|---|
| PATCH (typo, reformulare) | Opțional · doar X.1 + X.2 |
| MINOR (adăugare cerință) | OBLIGATORIU · toate secțiunile |
| MAJOR (breaking change) | OBLIGATORIU · + Approval Gate complet |
| NEW document funcțional | OBLIGATORIU · toate secțiunile |

---

## 3. Numerotare secțiuni

`X` = ultima secțiune funcțională a documentului + 1. Exemplu: într-un Tech Spec cu 18 secțiuni standard, Impact Assessment devine §19.

---

## 4. Validare pre-commit

- [ ] Bloc Impact Assessment prezent
- [ ] Toate sub-secțiunile X.1–X.11 completate (sau marcate explicit "—")
- [ ] Referințe către documente conexe valide (există în repo)
- [ ] AUDIT_LOG events documentate dacă există impact WRITE
- [ ] Aprobatori identificați

---

*docs/templates/IMPACT_ASSESSMENT.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
