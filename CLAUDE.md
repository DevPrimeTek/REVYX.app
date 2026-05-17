# CLAUDE.md — REVYX Agent Operating System
<!-- CLAUDE.md · v1.2.6 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

> Acest fișier este citit de Claude Code la **fiecare sesiune** din acest repo.
> Conține contextul minim necesar pentru a lucra corect pe REVYX fără brief repetat.

---

## 0a. STATUS EXECUȚIE (LIVE) ★ v1.2.6

> Single source of truth pentru "unde suntem ACUM". Actualizat la fiecare sesiune `/sN`.
> Pentru detaliu complet → `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §0.

| Atribut | Valoare curentă |
|---|---|
| **Macro-milestone activ** | ★ **M0 — MVP Prezentare** (M0.S1 ✅ + ★ M0.S2 ✅ CLOSED; M0.S3 next) |
| **Sesiune curentă** | ★ **Deploy pipeline online** — bring-forward T-M0.S3-14 partial pentru visibility live pe prototype M0.S2 înainte de M0.S3 substantive work. Livrate: (1) `apps/web-preview/vercel.json` config Next.js + 4 security headers default (X-Frame-Options DENY + nosniff + Referrer-Policy + Permissions-Policy) + region `fra1`. (2) `.github/workflows/web-preview-ci.yml` build gate paralel (typecheck + `next build`) trigger pe `apps/web-preview/**` sau `design/tokens.json` modificate. (3) `docs/runbook/RUNBOOK_REVYX_demo-deploy_v1.0.0.md` cu steps Vercel project creation (Root Directory = `apps/web-preview`) + Vercel GitHub App install + Ignored Build Step recipe + troubleshooting 5 simptome. (4) INDEX PATCH v1.1.4. Custom domain `demo.revyx.app` rămâne tracked M0.S3 T-M0.S3-14 (DNS step). |
| **M0.S2 (predecesor)** | ✅ CLOSED prin PR #25 merged. Livrate în `apps/web-preview/`: 4 user journeys J1-J4 end-to-end (Assign modal, intake form, click-to-advance + Close-won, bulk reassign escalations); ToastProvider global; 13 routes prerendered. Roadmap v1.0.2 (T-M0.S2-01..05 ☑). |
| **Următoarea sesiune** | **M0.S3** — Web Static Demo (Next.js, mock data full). Hats: FRONTEND WEB DEV (P) + DEVOPS (S) + DESIGNER (S). Input: `apps/web-preview/` extins în M0.S2 (J1-J4 clickable). Output: promovare → `apps/web/` + mock data 100/50/20 + content full 12 pagini + i18n RO/RU/EN (next-intl) + drag-drop @dnd-kit pe `/deals` + Vercel deploy `demo.revyx.app`. |
| **Documentație rămasă** | 0 sesiuni doc-only (M0+ development active) |
| **Hard Stress Test #2** | ✅ PASS clean S20 per `docs/audit/HST_REVYX_pre-dev_v1.0.0.md` §10 sign-off 7-rol |
| **Modul Claude activ** | DEVOPS (primary, deploy pipeline) + FRONTEND WEB DEV (secondary, vercel.json + CI validation) + DOC |
| **Plan tariff** | Claude.ai Pro $20/lună (sustained M0; Max $100/lună anticipat M1.S3 per F-S20-09 tracking) |
| **Master Plan status** | v1.1.2 active (Trio canonical: Master Plan v1.1.2 + Platform Matrix v1.0.0 + ★ **Detailed Roadmap v1.0.2** post-M0.S2) · §13 approval ✅ SIGNED 6/6 |
| **Arhitectură platforme** | Dual-channel: WEB primary (~80%, browser desktop) + MOBILE companion (~20% in-field, M2.S3) |
| **Phase 5 progress** S19→S20 | Stage 1-5 ✅ PASS · Master Phase 5 GA = GO unanimous T+91 · HST #2 PASS clean S20 |
| **Findings register lifecycle** ★ M0.S2 | **13 CLOSED FULL** Phase 5 + **2 CLOSED M0.S1** (F-S20-04 component half + F-S20-10 DP-06 brand parity) · 2 TRACKED pre-GA (F-S14-02 + F-S16-01) · 1 TRACKED next cycle (F-S11-07) · 6 NEW S20 LOW/MED remaining tracked (F-S20-05/06/07/08/09/11) · ★ zero NEW M0.S2 · zero CRIT/HIGH cumulative S10..M0.S2 |
| **Open decisions (PM)** | OD-01 font (brand-config Bebas Neue+Montserrat+JetBrains Mono — currently shipped — vs AC-M0-02 "Inter") · OD-02 spacing grid (8px confirmed vs 4px prompt) · OD-03 dark mode stance (single dark M0-M1, switch M2+) — vezi `TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` §10. **Nimic blocant M0.S3 entry.** |

### Roadmap macro

```
Pre-dev (S16-S20) ──→ M0 MVP Prezentare ──→ M1 MVP Funcțional ──→ M2 FULL Release GA
   S20 ✅ CLOSED        M0.S1 ✅ + ★ M0.S2 ✅    (Pilot 2-3 tenanți)    (Public Moldova)
                        → M0.S3 next            Phase 5 GA-ready ✅ · HST #2 PASS clean ✅
```

### Următoarele 3 sesiuni programate

| Sesiune | Scop | Output |
|---|---|---|
| ★ **M0.S3** next | Web Static Demo (Next.js, mock data full) | promovare `apps/web-preview/` → `apps/web/` + mock-data 100 leads/50 props/20 deals + content full pe 12 pagini + i18n RO/RU/EN (next-intl) + drag-drop @dnd-kit pe `/deals` (T-M0.S3-10) + Vercel deploy `demo.revyx.app` |
| **M0.S4** | Pitch Deck + Video Walkthrough | Deck 15-20 slide RO/RU/EN + video 5 min cu voice-over |
| **M0.S5** | HST M0 ⚠️ GATE | Hard Stress Test pre-M1; sign-off 7-rol pentru M1.S1 entry |

**Gating pentru a continua M0.S3:** ✅ TOATE atinse — M0.S2 closed cu 4 user journeys end-to-end clickable, `next build` pass (13/13 routes), zero findings CRIT/HIGH/MED noi, ARCHITECT a11y review pass (focus trap + ESC + click-to-advance keyboard fallback). Pending PM OD-01..OD-03 (non-blocking M0.S3 entry — implementation continuă brand-config).

---

## 0. Identitate proiect

| Atribut | Valoare |
|---|---|
| **Produs** | REVYX — Agent Operating System (AOS) pentru imobiliare |
| **NU este** | CRM clasic |
| **Companie** | ITPRO SYSTEM SRL |
| **Piața primară** | Republica Moldova |
| **Tagline** | Real Estate Execution Intelligence |
| **Limbă primară** | Română · Secundar: Rusă (UI local) · Engleză (cod, GitHub, tech docs) |
| **Timezone** | UTC+2 (Chișinău) — forțat în toate calculele temporale |
| **Currency** | EUR default · MDL · USD |
| **Confidențialitate** | CONFIDENȚIAL · Uz intern |

---

## 1. Documente de referință (Source of Truth)

Înainte de orice modificare cu impact funcțional, **citește în această ordine**:

| Prioritate | Document | Scop |
|---|---|---|
| **0** | `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` ★ | **Structural backbone** — milestones M0/M1/M2, sub-stages, echipa virtuală hats, acceptance criteria. Orice cod/doc nou trebuie să citeze stage-ul din care face parte (Regula 8). §13 approval ✅ SIGNED 6/6 post-HST #2 S20. |
| **0.1** ★ v1.2.2 | `docs/PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` | **Canonical feature × platform mapping** — single source of truth pentru întrebarea "Această funcționalitate e Web, Mobile sau Both?". Acoperă 15 module (119 features) cu RBAC role per platform + reguli DP-01..DP-07. Orice spec/workflow trebuie cross-ref aici (Regula 9). |
| **0.2** ★ v1.2.4 | `docs/ROADMAP_REVYX_detailed-execution_v1.0.1.md` | **Detailed roadmap** — descompunere Master Plan §4-§6 în atomic tasks (T-XXX) cu owner hat, effort estimate, dependencies, output, platform tag. ~308 tasks · ~122-164 sesiuni estimate. v1.0.1 PATCH M0.S1 direct-to-code shift §3.1 + §3.3 (v1.0.0 [HISTORY-partial] valid pentru §2/§4/§5/§6/§7). |
| 1 | `docs/brand-configs/revyx.md` | Brand system (culori, font, componente, ton) |
| 2 | `docs/BRD_REVYX_v1.0.0.md` + `v1.1.0.md` | Business Requirements (piloni, scoring, RBAC, roadmap) |
| 3 | `docs/PRD_REVYX_*.md` | Product Requirements (când există) |
| 4 | `docs/TECH_SPEC_REVYX_*.md` | Technical Specification (când există) |
| 5 | `docs/WORKFLOW_REVYX_*.md` | Workflow & Process Maps (când există) |

**Reguli:**
- Nu inventa cerințe. Dacă un comportament nu e documentat → întreabă PM-ul, nu presupune.
- Brand-config-ul e legea pentru orice UI. Nu introduce culori/fonturi în afara paletei.
- Spec v1.1 a integrat 47 gap-uri din Hard Stress Test — păstrează compatibilitatea.

---

## 2. Reguli de versionare documente

Toate documentele Markdown urmează **semantic versioning** `vMAJOR.MINOR.PATCH`:

- **MAJOR** — schimbare cerințe / breaking change în logica business
- **MINOR** — adăugare cerință / formulă / entitate fără breaking change
- **PATCH** — clarificări, corecții, typo, reformulări

**Header obligatoriu** pentru orice document nou:

```markdown
# [TITLU DOCUMENT]
<!-- [filename] · v[MAJOR.MINOR.PATCH] · [YYYY-MM] -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX -->

## Changelog
| Versiune | Data | Autor | Note |
|---|---|---|---|
| x.y.z | YYYY-MM | Autor | Descriere modificare |
```

Marcaj modificări în text: `★` = element nou sau actualizat față de versiunea anterioară.

---

## 3. Stack tehnic (referință)

| Layer | Tehnologie | Note |
|---|---|---|
| Auth | Supabase Auth **sau** Auth0 | JWT RS256 · access 15min · refresh 7 zile + rotație |
| Authorization | RBAC 5 roluri | agent → senior_agent → team_lead → manager → admin (aditiv) |
| Database | PostgreSQL + pgvector | pgvector HNSW activat în Phase 3 |
| Cache | Redis | Score cache cu invalidare la modificare entitate |
| Mesagerie | WhatsApp Business API | 5 templates pre-aprobate Meta (obligatoriu) |
| Lead Intake | Webhooks Meta / Google / OLX | HMAC-SHA256 verification obligatorie |
| Audit | AUDIT_LOG (PostgreSQL) | APPEND-ONLY · niciun UPDATE/DELETE permis la nivel BD |

---

## 4. Reguli critice de business (NU LE ÎNCALCA)

| ID | Regulă | Sursă |
|---|---|---|
| BR-01 | Lead Firewall: doar lead-uri cu **LS ≥ 0.60 + contact valid** ajung la agent | BRD §6.1 |
| BR-02 | `LS_initial = 0.30` la creare lead (NU 0) | BRD §7.1 |
| BR-03 | Escalation Protocol 3 niveluri: T+SLA → T+SLA+30min → T+SLA+2h | BRD §5 Pilon 04 |
| BR-04 | Maximum **3 task-uri active** per agent în orice moment | BRD §6.1 |
| BR-05 | Re-matching trigger → `needs_review=true` · **deal-urile NU se anulează automat** | BRD §5 Pilon 03 |
| BR-06 | GDPR consent capturat și stocat la intake orice lead | BRD §9.4 |
| BR-07 | AUDIT_LOG append-only pentru toate WRITE-urile | BRD §8 |
| BR-10 | `TF_default = 0.70` când `expected_close_date = NULL` | BRD §7.8 |
| BR-11 | `APS_default = 0.65` pentru agenți cu <5 deal-uri SAU <30 zile | BRD §7.7 |
| BR-12 | Single session per agent · forțare logout la password change | BRD §9.1 |

**Excepție de scală:** toate scorurile ∈ [0,1] **cu o singură excepție**: `NBA ∈ [0, 2.0]`.

---

## 5. SLA (răspuns lead)

| Tip lead | SLA |
|---|---|
| HOT (LS ≥ 0.75) | **15 minute** |
| Calificat (0.60–0.75) | 2 ore |
| Warm (0.40–0.60) | 24 ore |
| Rece (< 0.40) | Nurturing automat — fără intervenție agent |

---

## 6. Phase 0 — Security Foundation ⛔ BLOCANT

**Niciun cod de aplicație nu poate fi scris fără completarea Phase 0.**

Checklist:
- [ ] JWT RS256 + RBAC 5 roluri
- [ ] GDPR câmpuri pe LEAD + consent management
- [ ] AUDIT_LOG + middleware logging WRITE
- [ ] Webhook HMAC-SHA256 verification
- [ ] Rate limiting endpoint-uri publice
- [ ] Privacy Policy + Cookie Policy legal review

---

## 7. Sistem de skilluri pentru documentație

```
DOC_MASTER (orchestrator)
├── SKILL_BRD       → Business Requirements Document
├── SKILL_PRD       → Product Requirements Document
├── SKILL_TECH_SPEC → Technical Specification
├── SKILL_WORKFLOW  → Workflow & Process Maps
└── brand-configs/
    └── revyx.md    ← config brand citit de toate skillurile
```

Orice skill care generează un document **trebuie**:
1. Să citească `docs/brand-configs/revyx.md` pentru ton, header, paletă
2. Să respecte structura header + changelog + footer brandat
3. Să marcheze cu `★` orice element nou față de versiunea precedentă

---

## 8. Limbă & ton

- **Documentație**: română (primar). Termeni tehnici păstrați în engleză când sunt standard (Lead Score, Deal Probability, NBA, RBAC, JWT, webhook, etc).
- **Cod, comentarii cod, commit messages, PR titluri**: engleză.
- **UI labels & copy utilizator**: română (primar) · rusă (secundar pentru piața locală).
- **Ton documente**: profesional · precis · executiv. Fără jargon inutil. Fără emoji în documente (doar în UI dacă e specificat).

---

## 9. Convenții cod (când începe development)

- Backend: TypeScript / Node.js (preferat) sau Python — confirmat în Tech Spec
- Strict types obligatoriu (`strict: true` în tsconfig sau `mypy --strict`)
- Migrări BD: numerotate secvențial, idempotente unde posibil
- Toate timestamp-urile: `TIMESTAMPTZ` în PostgreSQL · normalizate UTC+2 la afișare
- Toate scorurile [0,1] (sau [0,2] pentru NBA) — clamp explicit la output
- Optimistic locking cu `version` field pe entitățile cu scoruri
- Niciun secret în cod / commit / log (folosește variabile de mediu)

---

## 10. Convenții Git

- Branch feature: `feature/<scope>-<short-desc>` (ex: `feature/lead-scoring-engine`)
- Branch fix: `fix/<issue-id>-<short-desc>`
- Branch docs: `docs/<scope>` (ex: `docs/prd-v1`)
- Commit: `<type>(<scope>): <subject>` — types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- PR: titlu sub 70 caractere · descriere cu Summary + Test plan
- PR pentru schimbări de scoring/cerințe: necesită aprobare PM + Solution Architect

---

## 10b. Reguli operaționale (post-S5)

### Regula 1 — Prompts în chat
Toate prompturile/rezumatele de sesiune se livrează **doar în chat**. Nu se scriu în CLAUDE.md, README.md sau alte fișiere repo.

### Regula 2 — Senior Architect + PM + Tester
Claude operează ca Senior Architect + Senior PM + Senior Tester. După scriere, citește documentele și aplică un self-review pass înainte de a marca task-ul complet (validare formule, schema, cross-refs, edge cases).

### Regula 3 — Audit checkpoints recurente (echipă audit extern)
La **fiecare etapă** de creare documentație ȘI **fiecare etapă** de dezvoltare, se rulează audit complet cu echipă virtuală de specialiști rang superior:

| Rol | Domeniu |
|---|---|
| Audit Lead | Orchestrare + severity scoring + remediation tracking |
| Senior Solution Architect | Cross-spec consistency, integration contracts, NFR alignment |
| Senior Security Auditor | RBAC matrix, GDPR Art. 5/6/15-22/32, OWASP, encryption, secrets |
| Senior DBA | Schema, FK/index, RLS, migrations, partitioning |
| Senior QA / Test Architect | Test coverage, edge cases, BR-XX traceability, NFR validation |
| Senior Compliance Auditor | GDPR, Legea 133/2011 RM, Legea 142/2018, retention, DPIA |
| Senior Product Auditor | BRD ↔ specs ↔ workflows formula alignment |

**Output audit:** raport în chat cu findings tabelate (severitate CRIT/HIGH/MED/LOW) + fixes aplicate direct în documente; out-of-scope items (legal counsel, regulator registration) sunt enumerate ca gating items pentru milestone.

**Trigger checkpoints:**
1. La final de fiecare sesiune `/sN` — înainte de final commit
2. La înainte de orice rampa de feature flag → 100%
3. La major release (vMAJOR bump în BRD/spec)
4. La schimbare regulatorie (GDPR amendment, Moldova Legea modificare)
5. Ad-hoc la cerere stakeholder (PM, DPO, Security Lead)

### ★ Regula 4 — Verificare finală post-commit (CRITIC)
Claude (AI) este **direct responsabil** pentru verificarea corectitudinii informației create în baza analizei Senior Architect + echipa de auditori externi (§10b Regula 3). **După fiecare commit** dintr-o sesiune `/sN`:

1. Re-citește integral fiecare document creat/modificat în acest commit (NU se rezumă la diff).
2. Verifică cross-reference integrity: orice mențiune `vX.Y.Z` / `§N.M` / `F-XXX` să corespundă realității.
3. Verifică formule scoring: dacă un scor e menționat → valid contra BRD §7 + T01-T07.
4. Verifică schema BD coherence: orice migrare nouă (0XXX) — număr unic, nesuprapus, idempotent.
5. Verifică audit-log catalog: orice eveniment introdus → catalogat în `audit-log` v1.x §4.x.
6. Verifică approval gate: fiecare document tech-spec/runbook/audit are §19/§14 cu aprobatori semnați.
7. Raportează în chat orice inconsistență detectată **înainte** de a marca task-ul complet.

Această verificare **substituie review-ul uman** doar la nivel sintactic + cross-ref; **NU** substituie sign-off-ul Senior Architect / Auditors externi (Regula 3) care rămân autoritatea finală.

### ★ Regula 5 — Prompt next session (obligatoriu la final)
La finalizarea **fiecărei** sesiuni `/sN`, Claude generează **în chat** (NU în repo, conform Regula 1) promptul propus pentru sesiunea următoare `/sN+1`. Format:

```
Prompt /sN+1 (proposed):
- Branch: claude/<scope>-<short-id>
- Context: <ce s-a închis în /sN, ce rămâne deschis din audit>
- Task: <obiectiv principal>
- Files to read (in order): <lista>
- Deliverables: <lista numerotată>
- Operating rules: <referință la CLAUDE.md §10b reguli aplicabile>
```

Fără acest prompt, sesiunea NU e considerată închisă. Promptul e self-contained (poate fi copiat 1:1 în următorul `claude /sN+1`).

### ★ Regula 6 — INDEX documents update (obligatoriu)
La **fiecare** document nou creat (spec, runbook, audit, playbook, checklist, workflow, etc.), Claude trebuie să:

1. Adauge entry în `docs/INDEX_REVYX_documents_v1.0.X.md` (versiunea curentă) — categoria corespunzătoare §2a-§11.
2. Descriere maximum **10 rânduri** — focus pe (a) ce e documentul · (b) ce findings/feature acoperă · (c) versiune · (d) cross-ref-uri majore.
3. Bump PATCH al INDEX la ≥1 doc nou; MINOR la ≥3 docs noi în aceeași sesiune.
4. Marcaj `★` înaintea numelui pentru documente noi/actualizate la sesiunea curentă.
5. La deprecare doc: append `[DEPRECATED]` + cross-ref successor.

Fără update INDEX, sesiunea NU e considerată închisă (verificat de Regula 4 step 7).

### ★ Regula 7 — Roluri operaționale Claude (★ v1.2.1)
Claude operează ca **11 hats** distincte (★ extins din 10 la v1.2.1): ARCHITECT + BACKEND DEV + FRONTEND WEB DEV ★ + MOBILE DEV + DBA + TESTER + SECURITY + DEVOPS + ML ENGINEER + DESIGNER + DOC. Activare condiționată per stage conform `MASTER_PLAN_REVYX_execution-roadmap_v1.1.1` §2.3 matrice. Maximum 2-3 hats simultan pentru focus + token efficiency.

**Notă rename v1.1.0:** "IMPLEMENTER" generic s-a split în BACKEND DEV + FRONTEND WEB DEV + MOBILE DEV pentru claritate dual-platform Web (PRIMARY ~80%) + Mobile (COMPANION ~20%).

### ★ Regula 9 — Platform Matrix compliance (NEW v1.2.2)
Pentru orice spec, workflow, runbook sau cod care **atinge UI** (frontend Web sau Mobile), Claude trebuie:

1. Să citeze în header `## 0.1 Platform Matrix` cu cross-ref la modul-ul corespunzător din `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §X.
2. Să marcheze fiecare feature/screen menționat cu tag explicit: 🌐 WEB / 📱 MOBILE / 🔁 BOTH / 🔧 Backend (no UI).
3. Să respecte regulile DP-01..DP-07 (Web-first, single backend, admin = Web only, etc.).
4. Niciun feature admin (RBAC mgmt, ML promote, white-label config, billing, audit log viewer, reports complete) NU poate apărea pe Mobile per DP-05.
5. Pentru orice termen ambiguu ("dashboard", "queue", "list") → **obligatoriu** specificare platform.

Violarea Regulii 9 → finding HIGH în HST + rollback PR până la rezolvare.

### ★ Regula 8 — Master Plan compliance (NEW v1.2.0)
Orice document nou (spec, runbook, audit, playbook) ȘI orice cod scris (Phase 0 → G) **trebuie**:

1. Să citeze în header `## 0. Stage Master Plan` cu referință explicită la stage-ul de care aparține (ex: `M1.S3 — Phase B Lead Intake + Scoring`).
2. Să respecte acceptance criteria definite pentru milestone-ul respectiv (AC-M0-XX / AC-M1-XX / AC-M2-XX).
3. Să respecte matricea de hats activi din §2.3 Master Plan — nu introduce funcționalitate care necesită un hat inactiv pentru stage-ul curent.
4. La închidere stage → update §0a Status Execuție din acest CLAUDE.md ȘI §0 din Master Plan.
5. Niciun cod aplicație înainte de aprobarea Master Plan (§13) și PASS la Hard Stress Test #2 (S20).

Violarea Regulii 8 → rollback sesiune + raport în chat cu remedierea propusă.

---

## 11. Ce să faci & ce să nu faci

### ✅ Fă
- Citește documentele de referință înainte de schimbări funcționale
- Întreabă când o cerință lipsește din spec (NU presupune)
- Marchează modificări noi cu `★` în documente
- Actualizează changelog-ul la fiecare modificare de document
- Validează formulele scoring cu valorile de test din §12 BRD (T01–T07)

### ❌ Nu face
- Nu introduce CRM-isme (REVYX = AOS, nu CRM)
- Nu modifica formulele scoring fără aprobare PM (sunt validate)
- Nu folosi culori în afara paletei brand
- Nu scrie cod aplicație înainte de finalizarea Phase 0 Security
- Nu commita secrete, fișiere `.env`, sau date reale clienți
- Nu altera AUDIT_LOG (append-only la nivel BD)
- Nu seta `LS_initial = 0` sau `APS_default = 0` (penalizează nedrept)

---

## 12. Glosar minim (vezi BRD §15 pentru lista completă)

| Acronim | Sensul |
|---|---|
| **AOS** | Agent Operating System (ce este REVYX) |
| **LS** | Lead Score [0,1] |
| **PS** | Property Score [0,1] |
| **IS** | Interaction Strength [0,1] |
| **DP** | Deal Probability [0,1] |
| **NBA** | Next Best Action [0, 2.0] — singura excepție de scală |
| **TS** | Trust Score [0,1] |
| **APS** | Agent Performance Score [0,1] |
| **DHI** | Deal Health Index [0,1] |
| **LF** | Listing Freshness `1 − min(1, zile/90)` |
| **TF** | Time Factor (DHI) |
| **UF** | Urgency Factor (NBA) |
| **RF** | Risk Factor (DHI) |
| **SLA** | 15 min (HOT) / 2h (calificat) / 24h (warm) |

---

*CLAUDE.md · v1.2.6 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*

---

## Changelog CLAUDE.md

| Versiune | Data | Note |
|---|---|---|
| 1.0.0 | 2026-05 | Initial — identitate proiect, documente referință, BR critice, Phase 0 checklist, §10b Regulile 1-6 |
| 1.1.0 | 2026-05 | MINOR — adăugare Regula 7 (10 hats Claude) |
| 1.2.0 | 2026-06 | MINOR — adăugare §0a Status Execuție LIVE + Master Plan ca priority 0 în §1 + Regula 8 (Master Plan compliance) + footer changelog. Triggered de decizie strategică: Claude Code = singura forță execuție; necesită roadmap structurat M0/M1/M2 + HST mandatory pre-fiecare milestone. |
| 1.2.1 | 2026-06 | PATCH — sincronizare cu MASTER_PLAN v1.1.0 (dual-platform). Regula 7 actualizată: 10 → **11 hats** (IMPLEMENTER split în BACKEND DEV + FRONTEND WEB DEV ★ + MOBILE DEV); §0a Status Execuție adăugare row "Arhitectură platforme" (WEB primary ~80% + MOBILE companion ~20%); referințe `MASTER_PLAN_REVYX_execution-roadmap_v1.0.0` → `v1.1.0` actualizate global. |
| 1.2.2 | 2026-06 | PATCH — Trio canonical introduction. Adăugare priority 0.1 + 0.2 în §1: `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` (canonical feature×platform mapping, 15 module, 119 features) + `ROADMAP_REVYX_detailed-execution_v1.0.0.md` (atomic tasks T-XXX, ~308 total). Adăugare Regula 9 NEW (Platform Matrix compliance) — orice spec/workflow UI-touching trebuie tag-uit explicit Web/Mobile/Both + respectare DP-01..DP-07. Master Plan ref bump v1.1.0 → v1.1.1. Trigger: Audit S15-bis-3 finding 88% docs gap-uri Web/Mobile + cerere user "Senior Architect mandate" — definirea totală pre-development. |
| 1.2.3 | 2026-07 | PATCH — S20 HST #2 PASS clean sync (M0.S1 entry unblocked). |
| 1.2.4 | 2026-05 | PATCH — **M0.S1 ✅ CLOSED — Design System direct-to-code shift**. Schimbări: (1) §0a Status Execuție LIVE actualizat: sesiune curentă S20 ✅ → M0.S1 ✅ CLOSED; următoarea sesiune M0.S1 → M0.S2 (Clickable Prototype direct-to-code in `apps/web-preview/`); modul Claude activ adăugare FRONTEND WEB DEV early activation; (2) Roadmap ref bump v1.0.0 → v1.0.1 în §1 priority 0.2 (PATCH direct-to-code shift §3.1 + §3.3); (3) Findings lifecycle row ★ 2 CLOSED M0.S1 (F-S20-04 component half + F-S20-10 DP-06 brand parity); (4) NEW row "Open decisions (PM)" cu OD-01 font discrepancy (brand-config Bebas Neue+Montserrat+JetBrains Mono — shipped — vs AC-M0-02 "Inter") + OD-02 spacing grid (8px) + OD-03 dark mode stance (single dark M0-M1); (5) Roadmap macro diagram updated; (6) Gating row updated pentru M0.S2 entry. Trigger: T-M0.S1-01..10 atomic tasks output (direct-to-code path per Roadmap v1.0.1). Backwards compat full cu v1.2.3 (Regulile 1-9 neschimbate). |
| 1.2.5 | 2026-05 | PATCH — **M0.S2 ✅ CLOSED — Clickable Prototype direct-to-code**. Schimbări: (1) §0a Status Execuție LIVE actualizat — sesiune curentă M0.S1 → ★ M0.S2 ✅ CLOSED; următoarea M0.S2 → ★ M0.S3 (Web Static Demo); modul Claude activ shift de la DESIGNER-primary la FRONTEND WEB DEV-primary; (2) Roadmap ref bump v1.0.1 → v1.0.2 în §0a + §1 priority 0.2 (PATCH M0.S2 close, T-M0.S2-01..05 ☑); (3) Findings lifecycle row sync ★ zero NEW M0.S2 + zero CRIT/HIGH cumulative S10..M0.S2; (4) Open decisions row simplificat (OD-01..03 rămân non-blocant M0.S3); (5) Roadmap macro diagram updated (M0.S2 ✅ next M0.S3); (6) "Următoarele 3 sesiuni programate" shifted (M0.S3/M0.S4/M0.S5); (7) Gating row actualizat pentru M0.S3 entry. Trigger: T-M0.S2-01..05 atomic tasks output (4 user journeys end-to-end clickable per Roadmap v1.0.2 §3.2 ☑) + `next build` pass 13/13 routes. Backwards compat full cu v1.2.4 (Regulile 1-9 neschimbate). |
| **1.2.6** | **2026-05** | ★ PATCH — **Deploy pipeline online (bring-forward T-M0.S3-14 partial)**. Schimbări: (1) §0a Status Execuție LIVE — sesiunea curentă bump M0.S2 ✅ → Deploy pipeline (vercel.json + CI gate + runbook); modul Claude activ shift FRONTEND WEB DEV-primary → DEVOPS-primary; M0.S2 mutat în row "M0.S2 (predecesor)" pentru istoric. (2) INDEX ref bump v1.1.3 → v1.1.4 (1 runbook NEW + 1 workflow NEW + 1 config NEW). (3) M0.S3 entry rămâne deblocat (deploy pipeline e additive, zero modificări cod prototype). Trigger: PM cerere "trebuie de setat sistemul pentru test visual, trebuie de configurat CI/CD pentru deployment automat și eu să pot vedea rezultatul online" + Regulile 4 (cross-ref verify) + 6 (INDEX update) + 8 (Master Plan stage citation în runbook §0). Backwards compat full cu v1.2.5 (Regulile 1-9 neschimbate). |
