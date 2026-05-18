# CLAUDE.md — REVYX Agent Operating System
<!-- CLAUDE.md · v1.2.11 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

> Acest fișier este citit de Claude Code la **fiecare sesiune** din acest repo.
> Conține contextul minim necesar pentru a lucra corect pe REVYX fără brief repetat.

---

## 0a. STATUS EXECUȚIE (LIVE) ★ v1.2.11

> Single source of truth pentru "unde suntem ACUM". Actualizat la fiecare sesiune `/sN`.
> Pentru detaliu complet → `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §0.

| Atribut | Valoare curentă |
|---|---|
| **Macro-milestone activ** | ★ **M0 — MVP Prezentare ✅ CLOSED** (M0.S1 ✅ + M0.S2 ✅ + M0.S3 ✅ + M0.S4 ✅ + ★ **M0.S5 ✅ CLOSED — EXIT GATE atins**). Următor: **M1 — MVP Funcțional** (M1.S1 Phase 0 Security Foundation UNBLOCKED). |
| **Sesiune curentă** | ★ **M0.S5 ✅ CLOSED — Hard Stress Test M0 EXIT GATE atins**. Livrate atomic: (1) **T-M0.S5-01** — `docs/audit/HST_REVYX_m0_v1.0.0.md` — raport HST principal cu 9 categorii audit (§2.1 UX flow J1-J4 + §2.2 brand compliance + §2.3 presentation rehearsal + §2.4 message clarity vs BRD §5 piloni + §2.5 demo robustness build/typecheck/lint/i18n/drag-drop + ★ **§2.6 Regula 11 puritate i18n** grep RO/RU + ★ **§2.7 Regula 12 disciplina interacțiuni** grep `hover:` per componentă + ★ **§2.8 Regula 13 in-app tutorial coverage gap analysis** (13/13 pagini gap, MED tracked forward) + ★ **§2.9 Regula 14 overlap audit** pe 3 viewport canonice 1920×1080/1440×900/1024×768 × 14 pagini). 17 findings F-M0S5-01..17 catalogate: **0 CRIT · 2 HIGH (★ ambele FIXED acest PR) · 6 MED · 9 LOW**. Sign-off **8/8** (Audit Lead + Senior Architect + Senior Security Auditor + Senior QA / Test Architect + Senior Compliance Auditor + Senior Product Auditor + DESIGNER Creative Director + Senior PM). (2) **T-M0.S5-02** — `docs/audit/HST_REVYX_m0_findings-backlog_v1.0.0.md` — detailed findings cu repro steps + cauză + fix code diff + verification + cross-ref per finding. (3) **T-M0.S5-03** — fix-uri imediate aplicate în acest PR: **F-M0S5-01 HIGH Regula 12** `apps/web-preview/components/ui/card.tsx` — introdus `interactive?: boolean` prop opt-in; hover translate și `cursor-pointer` aplicate DOAR când `interactive=true`; backward compatible (default false → toate Card existente devin static fără modificarea call-site-urilor M0). **F-M0S5-02 HIGH Regula 11** `apps/web-preview/messages/{ro,ru}.json` — 30 keys RO + 14 keys RU retraduse (Dashboard→Panou de bord/Панель управления; Sign out→Deconectare; Queue→Listă; Match needs review→Potrivire necesită revizuire; Won→Câștigat/Выигр.; Discovery→Descoperire/Поиск; healthy/review/risk→sănătos/de revizuit/risc и здоровая/проверка/риск; Fresh/Aging/Stale→Proaspăt/Învechire/Vechi и Новый/Стареет/Устарел; Match suggestions→Sugestii de potrivire; Top 3→Primele 3; Dashboard Manager→Panou Manager/Панель менеджера). Excepții acronime EN păstrate (LS/PS/IS/DP/NBA/DHI/APS/SLA/GDPR/RBAC/HOT/audit-log/lead-uri/WhatsApp). (4) **T-M0.S5-04** — sign-off matrix 7-rol + Senior PM = 8/8 documentat în HST §5. (5) **T-M0.S5-05** (TutorialOverlay POC) **decision deferred M1.S5** cu task explicit T-M1.S5-XX (cross-ref F-M0S5-14 MED forward-applying Regula 13). Argument: demo deck+video walkthrough M0.S4 acoperă tutorial scope pentru demo investor flow. **Tests primary post-fix:** `npm run typecheck` PASS, `npm run lint` PASS (1 pre-existing warning F-M0S5-10 LOW), `npm run build` PASS (15 routes static + 1 dynamic identic pre-fix). Regulile 1, 4, 6, 8, 9, 10, 11, 12, 13 (gap analysis only), 14 verificate ☑. **M0 EXIT GATE atins** → M1.S1 entry UNBLOCKED. |
| **M0.S4 (predecesor)** | ✅ CLOSED prin PR #29 merged. Pitch deck 16 slides × 3 limbi + video script 8 scene × 5:00 + screenshot checklist 18 screens. |
| **Următoarea sesiune** | **M1.S1** — Phase 0 Security Foundation ⛔ BLOCANT pentru M1.S2+ application code. Hats: BACKEND DEV (P) + SECURITY (P) + DBA (S) + ARCHITECT (S) + DOC. Output: JWT RS256 (access 15min / refresh 7d + rotație) + RBAC 5 roluri (agent → senior_agent → team_lead → manager → admin aditiv) + GDPR câmpuri pe LEAD entity (consent capture + retention + Art. 15-22 endpoints) + AUDIT_LOG append-only PostgreSQL (catalog evenimente + middleware logging WRITE) + HMAC-SHA256 webhook verify (Meta/Google/OLX inbound) + rate limiting endpoint-uri publice + Privacy Policy + Cookie Policy legal review. Acceptance: §6 Phase 0 checklist toate ☑. |
| **Documentație rămasă** | 0 sesiuni doc-only (M1+ development active post-Phase 0 Security) |
| **Hard Stress Test M0** | ✅ PASS conditional (0 CRIT + 0 HIGH post-fix; 6 MED + 9 LOW) per `docs/audit/HST_REVYX_m0_v1.0.0.md` §5 sign-off 8/8 |
| **Hard Stress Test #2 (pre-dev)** | ✅ PASS clean S20 per `docs/audit/HST_REVYX_pre-dev_v1.0.0.md` §10 sign-off 7-rol |
| **Modul Claude activ** | M0.S5 ☑: Audit Lead (P) + Senior Architect (S) + DESIGNER (S, Creative Director, mandatory Regulile 12+14) + QA / Test Architect (S, Regulile 11+12 grep) + Senior Product Auditor (S, message clarity) + Senior Compliance Auditor (S) + Senior Security Auditor (S, Phase 0 readiness) + DOC + Senior PM. **M1.S1 next:** BACKEND DEV (P) + SECURITY (P) + DBA (S) + ARCHITECT (S) + DOC. |
| **Plan tariff** | Claude.ai Pro $20/lună (sustained M0 ☑; ★ Max $100/lună anticipat M1.S3 entry per F-S20-09 tracking — CFO sign-off pending la M1.S2 close) |
| **Master Plan status** | v1.1.2 active (Trio canonical: Master Plan v1.1.2 + Platform Matrix v1.0.0 + ★ **Detailed Roadmap v1.0.5** post-M0.S5) · §13 approval ✅ SIGNED 6/6 + §0 LIVE TRACKER sync M0.S5 ☑ |
| **Arhitectură platforme** | Dual-channel: WEB primary (~80%, browser desktop) + MOBILE companion (~20% in-field, M2.S3) |
| **Phase 5 progress** S19→S20 | Stage 1-5 ✅ PASS · Master Phase 5 GA = GO unanimous T+91 · HST #2 PASS clean S20 |
| **Findings register lifecycle** ★ M0.S5 | **13 CLOSED FULL** Phase 5 + 2 CLOSED M0.S1 + ★ **2 CLOSED M0.S5** (F-M0S5-01 Regula 12 Card hover + F-M0S5-02 Regula 11 anglicisme RO/RU) · 2 TRACKED pre-GA · 1 TRACKED next cycle · 6 NEW S20 LOW/MED tracked · ★ **15 NEW M0.S5 catalogate** (0 CRIT + 2 HIGH ✅ FIXED + 6 MED + 9 LOW; F-M0S5-03..17 tracked M1.S2/M1.S5/M1.S5+ entry per HST §3) · zero CRIT cumulative S10..M0.S5 |
| **Open decisions (PM)** | OD-01 font · OD-02 spacing 8px · OD-03 dark mode (M0.S1 lineage) · OD-M0.S4-01 cifră invest · OD-M0.S4-02 URL demo final · OD-M0.S4-03 logo asset path · OD-M0.S4-04 echipa fondatori (non-blocking M1.S1, blocking T-M0.S4-08 PDF export) · ★ **OD-i18n-01** glosar scoring AOS RO/RU (LS=Scor Lead? PS=Scor Proprietate? sau păstrare EN abreviat?) — recomandare DESIGNER+DOC: Opțiune C hybrid (long-form RO/RU + acronim EN inline badge). Non-blocking M1.S1. |

### Roadmap macro

```
Pre-dev (S16-S20) ──→ M0 MVP Prezentare ✅ CLOSED ──→ M1 MVP Funcțional ──→ M2 FULL Release GA
   S20 ✅ CLOSED        M0.S1..M0.S5 toate ✅         (Pilot 2-3)            (Public)
                        ★ M0 EXIT GATE atins         M1.S1 Phase 0 next     Phase 5 GA-ready ✅
                        HST M0 PASS sign-off 8/8
```

### Următoarele 3 sesiuni programate

| Sesiune | Scop | Output |
|---|---|---|
| ★ **M1.S1** next ⛔ BLOCANT | Phase 0 Security Foundation | JWT RS256 + RBAC 5 roluri + GDPR câmpuri LEAD + AUDIT_LOG append-only + HMAC-SHA256 webhook verify + rate limiting + Privacy/Cookie Policy review |
| **M1.S2** | Phase A Foundation (DB schema + API skeleton) | Migrations 0001-0010 + REST API + auth middleware + RBAC middleware + test fixtures T01-T07 wired |
| **M1.S3** | Phase B Lead Intake + Scoring engines | Webhook intake Meta/Google/OLX + LS engine + LF engine + PS engine; token budget upgrade Pro→Max (F-S20-09) |

**Gating pentru a continua M1.S1:** ✅ TOATE atinse — M0.S5 closed cu HST M0 PASS conditional (0 CRIT + 0 HIGH post-fix F-M0S5-01 + F-M0S5-02 acest PR) + sign-off 8/8. M0 EXIT GATE atins. Pending PM OD-M0.S4-01..04 + OD-i18n-01 (non-blocking M1.S1 entry; blocking doar T-M0.S4-06 video recording + T-M0.S4-08 PDF export deck).

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
| **0.2** ★ v1.2.9 | `docs/ROADMAP_REVYX_detailed-execution_v1.0.4.md` | **Detailed roadmap** — descompunere Master Plan §4-§6 în atomic tasks (T-XXX) cu owner hat, effort estimate, dependencies, output, platform tag. ~308 tasks · ~122-164 sesiuni estimate. v1.0.4 PATCH M0.S4 ✅ CLOSED (T-M0.S4-01..05 + T-M0.S4-07 ☑; T-M0.S4-06 recording + T-M0.S4-08 PDF export ◐ deferred). |
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

### ★ Regula 10 — Deployment verification mandatory (NEW v1.2.8)

Orice modificare care atinge deploy pipeline (rename de path sub `apps/*`, modificare `vercel.json`, modificare CI workflow, adăugare dependency, schimbare framework) **trebuie**:

1. **Pre-commit verification:**
   - (a) Confirm Vercel project Root Directory current value (UI inspection sau Vercel API).
   - (b) Asigură că Root Directory match-uiește un path real în repo.
   - (c) `npm install` în pachetul afectat → commit lockfile sincronizat.
2. **Test plan executat în chat / PR body**, cu output exact al comenzilor (nu doar enumerare):
   - `npm run typecheck` (pass exit 0)
   - `npm run lint` (pass; warnings tracked ca OD-XX, nu ca errors)
   - `npm run build` (pass; număr de routes raportat)
   - `npm run dev` smoke test (HTTP status per route + content probe DOM pentru mock + i18n + interactive elements)
3. **Niciun rename de path deploy-critical** (orice path care apare în Vercel Settings → Root Directory) fără update sincron al UI Vercel **înainte** de merge. Dacă nu există acces UI Vercel, NU se face rename — se preferă semantic upgrade in-place prin `package.json`.
4. **Post-deploy verification mandatory:** după merge la `main`, Claude verifică status-ul deployment Vercel (via webhook PR activity sau Vercel API). La detecție eroare deploy: Claude inițiază remediation imediat în următorul commit pe branch separat, NU așteaptă cerere PM.
5. **Build verification status report obligatoriu în chat la finalul fiecărei sesiuni** cu modificări `apps/*` sau `.github/workflows/*` — secțiune dedicată "Tests primary + secondary" cu PASS/FAIL per item.
6. **Lecție învățată M0.S3 first attempt:** un `git mv apps/web-preview/ → apps/web/` a rupt deploy-ul Vercel când Root Directory rămas la path vechi. Revertit la in-place semantic upgrade. Aceasta este Regula 10 fundator-case.

Violarea Regulii 10 → rollback automat al modificării + raport în chat cu remedierea aplicată + sesiunea NU se închide până la deploy verificat green.

### ★ Regula 11 — Puritate i18n (NEW v1.2.10)

Toate texte UI (labels, headers, butoane, toast, modal, copy general) **trebuie traduse complet** în limba activă a utilizatorului (RO / RU / EN) **fără anglicisme** atunci când există echivalent autohton în limba respectivă.

**Aplicabilitate:**
1. **RO:** "dashboard" → **panou de bord** · "queue" → **listă de așteptare** · "deal" → **tranzacție** · "match" → **potrivire** · "filter" → **filtru** · "settings" → **setări** · "notifications" → **notificări** · "login" → **autentificare** · "logout" → **deconectare** · "manager" rămâne (împrumut consacrat în business RM) · termeni tehnici (NBA, LS, DP, APS, DHI, RBAC, JWT, HMAC, SLA) **rămân în EN** ca acronime standard industrie.
2. **RU:** "dashboard" → **панель управления** · "queue" → **очередь** · "deal" → **сделка** · "match" → **совпадение** · "filter" → **фильтр** · "settings" → **настройки** · "notifications" → **уведомления** · "login" → **вход** · "logout" → **выход**.
3. **EN:** baseline canonic — orice termen anglo-saxon nativ.

**Verificare obligatorie:**
- La fiecare commit care atinge `messages/*.json` sau hardcoded strings UI: grep pentru anglicisme în RO/RU și înlocuire.
- Lista exceptions (termeni EN păstrați): NBA · LS · LF · IS · PS · DP · DHI · APS · TS · TF · UF · RF · RBAC · JWT · HMAC · SLA · GDPR · API · UI · UX · CRM · AOS · M0..M2 · MVP · pgvector · HNSW · Redis · TLS · CNAME · DNS · CI/CD · MD · PR.
- Termeni de specificare a domeniului (lead/property/agent) care **se păstrează** în EN dacă sunt unitate semantică în spec (cross-doc consistency cu BRD); UI poate localiza la rendering layer.

Violarea Regulii 11 → finding **HIGH** în HST + rollback PR până la corectare. Open Decision OD-i18n-01 (pending PM resolution): glosar oficial RO/RU pentru termenii AOS de scoring (LS=Scor Lead? PS=Scor Proprietate? sau păstrare EN abreviat?).

### ★ Regula 12 — Disciplina interacțiunilor layout (NEW v1.2.10)

**Static stays static. Dynamic responds.**

1. **Elementele statice din layout NU trebuie să reacționeze la mișcarea cursorului** — header bar, footer, side-rail navigation (când nu sunt interactive), background, decorative graphics, text labels read-only, badge-uri pur informative.
2. **Elementele dinamice interactive REACȚIONEAZĂ la hover/focus/active** conform tokens.json `motion` + brand-config §5.1 (`translateY(-2px)` + border-color shift) — exclusiv: butoane, link-uri, carduri clickabile, input-uri, dropdown-uri, toggle-uri, drag handles, kanban cards mutabile.
3. **Excluzii explicite (NU au hover/scale/translate):**
   - Logo + cover hero (decorativ)
   - Stats panels / numere mari (read-only)
   - Page headers + breadcrumbs (orientare, NU navigare)
   - Score badges fără context interactive (ex: LS badge pur informativ pe lead-detail header)
   - Workflow timeline markers (statice, nu se selectează)
4. **Pattern auditing:**
   - `:hover` în CSS doar pe elemente cu `cursor: pointer | grab | text` sau `role="button"`/`role="link"`/`role="checkbox"` etc.
   - Folosirea `hover:translate-y-*` / `hover:scale-*` / `hover:shadow-*` în Tailwind doar pe componente interactive cu rol semantic.
   - Card-uri pur statice (read-only) folosesc varianta `Card` fără `hover:` modifiers; varianta interactivă (`InteractiveCard` sau Card cu prop `clickable`) primește hover styling.

Verificare obligatorie pre-commit pe orice modificare în `apps/web-preview/components/**` sau `apps/web/components/**`: grep `hover:` și validare semantică element-by-element. Violarea Regulii 12 → finding **MED** în HST + corectare în PR-ul care a introdus regresia.

### ★ Regula 13 — In-app tutorial / onboarding (NEW v1.2.10)

Fiecare pagină principală (login, dashboard, leads, properties, deals, manager, notifications, profile, settings, admin) **trebuie să aibă element tutorial vizibil** care explică:
1. Ce vede utilizatorul pe ecran (scopul paginii).
2. Care sunt elementele cheie interactive (max 3-5 hotspots) și ce fac.
3. Care este următoarea acțiune recomandată (cross-ref NBA layer când aplicabil).

**Implementare:**
- **Pattern:** `<TutorialOverlay screenId="dashboard">` componentă reutilizabilă; conținut localizat în `messages/{locale}.json` sub cheia `tutorial.{screenId}`.
- **Trigger UX:** auto-show la prima vizită per `screenId` (localStorage flag `revyx.tutorial.{screenId}.seen`) + buton "?" persistent în header pentru re-deschidere.
- **Conținut:** 1 paragraf intro + 3-5 hotspot-uri cu pointer la elemente reale (folosind data-attribute `data-tutorial-anchor="<id>"` pe target).
- **A11y:** keyboard navigable (Tab/Shift+Tab între hotspots, ESC close, Enter advance), focus trap când deschis, screen-reader announce.

**Update protocol:** la **fiecare adăugare de funcționalitate** pe o pagină existentă (nou widget, nou button, nou flow), Claude trebuie:
1. Update `messages/{ro,ru,en}.json` cu hotspot nou în `tutorial.{screenId}.steps[]`.
2. Adaugă `data-tutorial-anchor` pe noul element.
3. Update `tutorial-coverage.md` (tracker) — list per page steps active.

**Implementare M0.S5+ scope:** componenta `TutorialOverlay` + content RO/RU/EN pentru cele 9 pagini principale = task T-M0.S5-XX (sau split la M1.S5 dacă HST M0 ridică prioritate UX).

Violarea Regulii 13 (pagină nouă fără tutorial) → finding **MED** în HST + tracking item în backlog UX.

### ★ Regula 14 — Verificare overlap layout (NEW v1.2.10)

Layout-ul **NU trebuie să conțină elemente vizuale care se suprapun nedorit** (text peste text, butoane peste carduri, modal-uri parțial obscured, dropdown clipping).

**Verificare obligatorie:**
1. **Manual smoke test (pre-commit pe modificări UI):** la fiecare modificare în `app/**/page.tsx` sau `components/**`, navighează cele 3 viewport-uri canonice și verifică:
   - Desktop wide: 1920×1080
   - Desktop standard: 1440×900
   - Tablet landscape: 1024×768
   - (Mobile portrait M2.S3+: 375×667 — N/A pentru M0)
2. **Visual regression tooling sugerat (M1.S5+):** Playwright + `toHaveScreenshot()` baseline pentru pagini cheie cu threshold 0.5%.
3. **Pattern audit:**
   - `position: absolute` + `z-index` interacțiune verifică contra `Modal`, `Toast`, `Dropdown`, `Tooltip` z-stack (constant ordering în `tokens.json` motion/z-index).
   - Sticky header NU obscure content (folosește `scroll-padding-top` pe `<body>`).
   - Dropdown-uri ancorate (combobox, language switcher) clip vs viewport edge — folosește positioning library sau detecție manuală flip-up.
   - Long text content în badges/chips folosește `truncate` sau `line-clamp-N` cu tooltip.

**Findings curent (depistate, requires fix în M0.S5):**
- (TBD per HST M0 audit step — Claude va popula lista în raportul HST_REVYX_m0_v1.0.0.md §findings)

**Quick-check command (pre-commit):**
```bash
cd apps/web-preview && npm run dev &
# Open Chrome → navigate cele 9 pagini × 3 viewport-uri × 3 locale
# Capture screenshots → visual diff vs design/screenshots/baseline/
```

Violarea Regulii 14 (overlap depistat post-merge) → finding **HIGH** în HST + corectare prioritară în PR hotfix.

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

*CLAUDE.md · v1.2.11 · 2026-05 · CONFIDENȚIAL · Uz Intern*
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
| 1.2.6 | 2026-05 | PATCH — **Deploy pipeline online (bring-forward T-M0.S3-14 partial)**. vercel.json + CI gate + runbook v1.0.1. INDEX ref bump v1.1.3 → v1.1.4. Backwards compat full cu v1.2.5. |
| 1.2.7 | 2026-05 | PATCH — M0.S3 ✅ CLOSED Web Static Demo (first attempt — included git mv apps/web-preview → apps/web; ulterior rolled back când a rupt deploy Vercel Root Directory). |
| 1.2.8 | 2026-05 | PATCH — M0.S3 ✅ CLOSED corrected + Regula 10 introduction. Reverted git mv `apps/web-preview/` → `apps/web/` (physical path retained, semantic upgrade in-place la `@revyx/web-preview@0.2.0`). Regula 10 "Deployment verification mandatory" adăugată în §10b. |
| 1.2.9 | 2026-05 | PATCH — M0.S4 ✅ CLOSED Pitch Deck + Video Walkthrough. Roadmap v1.0.4 + INDEX v1.1.6. Output 6 documente `docs/marketing/`. Backwards compat full cu v1.2.8 (Regulile 1-10 neschimbate). |
| 1.2.10 | 2026-05 | PATCH — 4 reguli operaționale noi (Regulile 11-14) triggered de PM design+layout feedback post-M0.S4 merge. §10b extins cu Regula 11 (Puritate i18n) + Regula 12 (Disciplina interacțiuni) + Regula 13 (In-app tutorial) + Regula 14 (Verificare overlap). Backwards compat full cu v1.2.9. |
| **1.2.11** | **2026-05** | ★ PATCH — **M0.S5 ✅ CLOSED Hard Stress Test M0 EXIT GATE.** §0a Status Execuție LIVE actualizat — Macro-milestone "M0 ✅ CLOSED → M1 next"; sesiune curentă reflectă HST M0 outputs (raport principal + findings backlog + 2 fix-uri HIGH F-M0S5-01 + F-M0S5-02); roadmap macro diagram updated cu "M0 EXIT GATE atins"; "Următoarele 3 sesiuni" shifted (M1.S1/M1.S2/M1.S3); modul Claude activ tranziție de la audit team la BACKEND DEV + SECURITY hat (M1.S1 entry); Master Plan ref bump v1.0.4 → **v1.0.5** Roadmap; OD-i18n-01 NEW pending PM (glosar scoring AOS RO/RU); findings register lifecycle row +15 NEW M0.S5 (2 HIGH ✅ FIXED + 6 MED + 9 LOW); gating row updated "M1.S1 entry UNBLOCKED". **Reguli 11-14 prima ocurență audit** în acest HST M0 (Regula 11 i18n: F-M0S5-02 HIGH FIXED 44 keys retraduse; Regula 12 interaction: F-M0S5-01 HIGH FIXED Card interactive opt-in; Regula 13 tutorial: F-M0S5-14 MED tracked M1.S5; Regula 14 overlap: F-M0S5-15 MED + 2 LOW tracked M1.S5+). Backwards compat full cu v1.2.10 (Regulile 1-14 toate neschimbate; doar §0a sync). Trigger: M0.S5 sesiune output T-M0.S5-01..04 ☑ + Regula 4 self-review + Regula 6 INDEX update v1.1.7 → v1.1.8 + Regula 8 Master Plan §0 sync. |
