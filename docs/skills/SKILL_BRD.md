# SKILL_BRD — Business Requirements Document Generator
<!-- docs/skills/SKILL_BRD.md · v1.0.1 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM | Definiție inițială sub-skill |
| 1.0.1 | 2026-05 | Senior PM | Aliniat cu BRD v1.1.0: 13 entități · 6 modele tenancy · custom roles |

---

## 1. Identitate

| Atribut | Valoare |
|---|---|
| **Parent** | DOC_MASTER |
| **Output** | `docs/BRD_REVYX_v[X.Y.Z].md` |
| **Audiență** | Senior PM · Solution Architect · Stakeholders ITPRO |
| **Limbă** | Română |

---

## 2. Structură obligatorie

Orice BRD generat trebuie să conțină **toate** secțiunile, în ordine:

| # | Secțiune | Conținut minim |
|---|---|---|
| 1 | Executive Summary | Diferențiatori · status · echipă |
| 2 | Context & Problemă de Business | As-Is · To-Be · probleme identificate |
| 3 | Obiective de Business | Tabel cu indicator de succes & fază |
| 4 | Stakeholders & Actori | Interni (sistem) + externi (workflow) |
| 5 | Perimetrul Soluției — 7 Piloni | 1 pilon = 1 sub-secțiune cu scop, funcționalități, output |
| 6 | Cerințe de Business | Funcționale (BR-XX) + Non-Funcționale (NFR-XX) |
| 7 | Sistemul de Scoring — 8 Formule | LS, PS, IS, DP, NBA, TS, APS, DHI cu formula completă |
| 8 | Data Model — 13 Entități | Câmpuri obligatorii per entitate (9 core + 4 tenancy) |
| 9 | Securitate & Conformitate | Auth · Rate limit · Webhook · GDPR · Concurență · Multi-tenant |
| 10 | RBAC — System Roles + Custom Roles | 5 system roles · roluri suplimentare per tenancy · custom role builder |
| 11 | Roadmap — 4 Faze | Phase 0 (blocant) → Phase 3 |
| 12 | Acceptance Criteria | AC-XX-XX per pilon + Edge Cases T01-T0N |
| 13 | KPI & Metrici | Baseline · țintă · fază |
| 14 | Constrângeri & Dependențe | Tehnice · externe · riscuri |
| 15 | Glosar | Min 25 termeni · EN-RO-Definiție |
| 16 | Aprobare | 5 roluri cu semnătură |

---

## 3. Reguli inflexibile

### Scoring (BRD §7)

- Toate scorurile ∈ `[0, 1]`, cu **o singură excepție**: `NBA ∈ [0, 2.0]`
- `LS_initial = 0.30` (NU 0)
- `TS_initial = 0.50`
- `APS_default = 0.65` pentru agenți cu <5 deal-uri SAU <30 zile
- `TF_default = 0.70` când `expected_close_date = NULL`
- `LF = 1 − min(1, zile/90)`

### Entități (BRD §8)

Cele 4 entități core noi (v1.1) sunt **obligatorii**: `SHOWING`, `OFFER`, `ACTIVITY`, `AUDIT_LOG`.
`AUDIT_LOG` este APPEND-ONLY la nivel de BD.

Cele 4 entități tenancy (v1.1.0) sunt **obligatorii**: `TENANT`, `ROLE`, `PERMISSION`, `ROLE_PERMISSION`.
Toate entitățile core primesc `tenant_id` FK → TENANT.

### Modele de Tenancy (BRD §4.3)

REVYX suportă **6 modele**: `SOLO`, `NETWORK_FLAT`, `NETWORK_LED`, `AGENCY`, `AGENCY_CUSTOM`, `FRANCHISE`.
- `SOLO` + `AGENCY` → Phase 1
- `NETWORK_FLAT` + `NETWORK_LED` + `AGENCY_CUSTOM` → Phase 2
- `FRANCHISE` → Phase 3

### Securitate (BRD §9)

- JWT RS256 · access 15min · refresh 7 zile + rotație
- HMAC-SHA256 obligatoriu pe webhooks inbound
- GDPR câmpuri obligatorii pe LEAD: `gdpr_consent_at`, `gdpr_consent_channel`, `gdpr_consent_version`, `data_retention_expires_at`, `erasure_requested_at`
- Single session per agent · forțare logout la password change

### Roadmap (BRD §11)

Phase 0 Security este **BLOCANTĂ**. Niciun alt cod nu se scrie fără ea.

---

## 4. Output checklist

- [ ] Header standard conform `HEADER_STANDARD.md`
- [ ] Cuprins cu toate cele 16 secțiuni
- [ ] Toate cele 8 formule scoring prezente
- [ ] Toate cele 13 entități documentate (9 core + 4 tenancy)
- [ ] Cele 6 modele de tenancy documentate cu reguli per-model
- [ ] Tabelul RBAC cu 5 system roles × ≥7 permisiuni
- [ ] Custom Roles documentate (Agency Pro tier)
- [ ] Min 12 BR-uri + Min 10 NFR-uri
- [ ] Min 20 Acceptance Criteria + 7 Edge Cases (T01-T07)
- [ ] Glosar min 25 termeni
- [ ] Footer brandat

---

## 5. Anti-pattern (NU FACE)

- ❌ Nu folosi termenul "CRM" pentru REVYX (e AOS)
- ❌ Nu seta `LS_initial = 0` (penalizează nedrept lead-uri noi)
- ❌ Nu seta `APS_default = 0` (penalizează nedrept agenți noi)
- ❌ Nu omite Phase 0 Security
- ❌ Nu inventa entități noi fără validare PM
- ❌ Nu modifica ponderile formulelor scoring fără aprobare explicită PM + Solution Architect

---

*docs/skills/SKILL_BRD.md · v1.0.1 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
