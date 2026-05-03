# SKILL_TECH_SPEC — Technical Specification Generator
<!-- docs/skills/SKILL_TECH_SPEC.md · v1.0.1 · 2026-05 -->
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
| **Output** | `docs/tech-spec/TECH_SPEC_REVYX_[scope]_v[X.Y.Z].md` |
| **Audiență** | Backend · DevOps · Security · QA Automation |
| **Limbă** | Română (cu termeni tehnici EN păstrați) |

---

## 2. Scope possibilities

| Scope | Filename pattern |
|---|---|
| Auth & RBAC | `TECH_SPEC_REVYX_auth-rbac_v[X.Y.Z].md` |
| Lead Scoring Engine | `TECH_SPEC_REVYX_lead-scoring_v[X.Y.Z].md` |
| NBA Engine | `TECH_SPEC_REVYX_nba-engine_v[X.Y.Z].md` |
| DHI Engine | `TECH_SPEC_REVYX_dhi-engine_v[X.Y.Z].md` |
| Match Engine | `TECH_SPEC_REVYX_match-engine_v[X.Y.Z].md` |
| Showcase Links | `TECH_SPEC_REVYX_showcase-links_v[X.Y.Z].md` |
| Webhook Intake | `TECH_SPEC_REVYX_webhook-intake_v[X.Y.Z].md` |
| AUDIT_LOG | `TECH_SPEC_REVYX_audit-log_v[X.Y.Z].md` |
| WhatsApp Integration | `TECH_SPEC_REVYX_whatsapp_v[X.Y.Z].md` |

---

## 3. Structură obligatorie

| # | Secțiune | Conținut |
|---|---|---|
| 1 | Executive Summary | Scope tehnic · referință BRD/PRD |
| 2 | Architecture Overview | Diagramă componente · data flow |
| 3 | Stack & Dependencies | Versiuni exacte · justificare alegeri |
| 4 | Data Model | Schema SQL completă · indexes · constraints |
| 5 | API Contracts | OpenAPI 3.x sau tabel endpoint × method × payload × response |
| 6 | Algorithms | Formule scoring în pseudocod / TypeScript / SQL |
| 7 | State Machines | Status transitions cu validări |
| 8 | Concurrency | Optimistic locking · version field · retry policy |
| 9 | Caching | Redis keys · TTL · invalidation triggers |
| 10 | Background Jobs | Cron / queue · idempotență · retry exponential backoff |
| 11 | Error Handling | Error codes · structured logging · alerting |
| 12 | Security | JWT · HMAC · rate limit · OWASP top 10 mitigations |
| 13 | Observability | Logs · metrics · traces · dashboards |
| 14 | Performance Budgets | NFR-uri din BRD §6.2 cu țintă măsurabilă |
| 15 | Testing Strategy | Unit · integration · e2e · load · chaos |
| 16 | Deployment | Environments · feature flags · rollback procedure |
| 17 | Migration Strategy | DB migrations numerotate · backwards compat |
| 18 | Risks & Mitigations | Tehnice · operationale |

---

## 4. Reguli inflexibile

### Stack obligatoriu

| Layer | Tehnologie |
|---|---|
| Backend | TypeScript / Node.js (preferat) sau Python — confirmat per scope |
| DB | PostgreSQL + pgvector |
| Cache | Redis |
| Auth | Supabase Auth sau Auth0 cu JWT RS256 |
| Mesagerie | WhatsApp Business API (templates pre-aprobate) |

### Convenții cod

- `strict: true` în tsconfig SAU `mypy --strict` în Python
- Toate timestamp-urile: `TIMESTAMPTZ` în PostgreSQL
- Timezone: UTC+2 (Chișinău) la afișare · UTC la storage
- Toate scorurile: clamp explicit la output `Math.max(0, Math.min(1, score))`
- NBA: clamp `[0, 2.0]`
- Optimistic locking obligatoriu pe entitățile cu scoruri (cu `version` field)

### Securitate

- JWT RS256 — niciodată HS256
- Niciun secret în cod / commit / log
- Webhooks: HMAC-SHA256 verification înainte de orice procesare
- Rate limiting documentat per endpoint
- AUDIT_LOG insert pentru orice WRITE

### Algorithms

Formulele scoring trebuie implementate **exact** ca în BRD §7. Orice deviere = update BRD întâi.

```typescript
// Exemplu pattern obligatoriu — Lead Score
function calculateLeadScore(lead: Lead): number {
  const I = lead.intent ?? 0;
  const BF = lead.budgetFit ?? 0;
  const TU = lead.timelineUrgency ?? 0;
  const E = lead.engagement ?? 0;
  const TS = lead.trustScore ?? 0.5; // TS_initial = 0.50

  const ls = 0.35 * I + 0.25 * BF + 0.15 * TU + 0.15 * E + 0.10 * TS;
  return Math.max(0, Math.min(1, ls));
}
```

### Database

- Migrări numerotate secvențial: `0001_init.sql`, `0002_lead_gdpr.sql`, ...
- Idempotente unde posibil (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`)
- AUDIT_LOG: trigger sau RLS pentru blocaj UPDATE/DELETE
- Indexes pe FK-uri și pe câmpurile folosite în scoring (lead.score, deal.dhi)

---

## 5. Output checklist

- [ ] Header standard
- [ ] Diagrame arhitectură (Mermaid sau ASCII)
- [ ] Schema SQL completă cu types, constraints, indexes
- [ ] OpenAPI sau tabel endpoint complet
- [ ] Toate formulele relevante implementate în pseudocod
- [ ] Performance budgets aliniate cu NFR din BRD
- [ ] Strategie testare cu coverage target
- [ ] Migration strategy
- [ ] Risk table
- [ ] Footer brandat
- [ ] **★ Impact Assessment** completat în PR description (`docs/templates/IMPACT_ASSESSMENT.md`)
- [ ] **★ Migration up+down test specificat ca obligatoriu** (dacă atinge schema)
- [ ] **★ RLS bypass test specificat** (dacă atinge tenant_id sau RBAC)
- [ ] **★ Regression scoring T01-T07 specificat** (dacă atinge formulă scoring)
- [ ] **★ Load test (k6) specificat** (dacă atinge NFR performanță)
- [ ] **★ Security scan specificat** (dacă atinge auth / GDPR)

---

## 6. Anti-pattern

- ❌ Nu deviază de la formulele BRD §7 fără update prealabil al BRD
- ❌ Nu folosește JWT HS256 (doar RS256)
- ❌ Nu introduce UPDATE/DELETE pe AUDIT_LOG
- ❌ Nu storează secrete în config files versionate
- ❌ Nu omite optimistic locking pe entitățile cu scoruri
- ❌ Nu folosește timestamps fără timezone (`TIMESTAMP` vs `TIMESTAMPTZ`)

---

*docs/skills/SKILL_TECH_SPEC.md · v1.0.1 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
