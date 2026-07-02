# ARCHITECTURE REVIEW — REVYX Full-Stack (M0 → M1.S2 + M0.S6-S9 demo)
<!-- ARCH_REVIEW_REVYX_full-stack_v1.0.0.md · v1.0.0 · 2026-07 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX -->

## Changelog
| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-07 | Software Architect (Claude) + Senior PM | Initial — review arhitectural complet la cerere PM: analiza a tot ce s-a livrat până acum (apps/api + apps/web-preview + docs + CI) + plan de îmbunătățire fazat P0-P3. |

## 0. Stage Master Plan
Checkpoint audit ad-hoc la cerere PM (Regula 3, trigger 5) — poziționat între **M0.S9 ✅** (AGI Layer Val 1-4 schelet vizual) și **M1.S3** (Phase B Lead Intake + Scoring engines). Cross-ref: `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4, `CLAUDE.md` §0a.

## 0.1 Platform Matrix
Review 🔧 Backend (`apps/api/`) + 🌐 WEB (`apps/web-preview/` demo). 📱 MOBILE nu există încă (M2.S3) — conform DP-01 Web-first.

---

## 1. Scop și metodă

Analiză statică a întregului repo la 2026-07: structură monorepo, backend NestJS (79 fișiere TS + 15 migrations), demo Next.js (26 rute, ~120 fișiere TS/TSX), corpus documentație (97 docs MD), CI (3 workflows). Focus: sustenabilitatea arhitecturii la intrarea în M1.S3 — punctul în care demo-ul și backend-ul trebuie să înceapă să conveargă.

---

## 2. Starea actuală (inventar sintetic)

| Componentă | Stare | Observație |
|---|---|---|
| `apps/api/` | ✅ solid | NestJS 10 + Fastify + Drizzle + PostgreSQL. Phase 0 Security (JWT RS256, RBAC 5 roluri, AUDIT_LOG append-only cu trigger BD + REVOKE, HMAC webhook, GDPR Art. 15/17/18/20) + Phase A (9 entități, 7 module REST CRUD, tenant isolation în fiecare query, optimistic locking cu distincție 404/409, fixtures T01-T07 ca teste merge-blocking, infra testcontainers). |
| `apps/web-preview/` | ✅ funcțional, ⚠ datorie | 26 rute, 18 store-uri localStorage, mock data deterministă, i18n RO complet. Zero conexiune la `apps/api/`. Logica de business (BR-04, FRS, match reasoning, sugestii NBA-style) re-implementată în frontend. |
| `docs/` | ✅ matur | 97 documente guvernate (Regulile 1-21, semantic versioning, INDEX self-contained, Regula 18 anti-proliferare aplicată — 60 fișiere legacy șterse). |
| CI | ✅ prezent, ⚠ gap-uri | `api-ci` (typecheck/lint/test/build + job integration testcontainers) + `web-preview-ci` + `audit-catalog-lint`. Lipsesc: verificare paritate i18n, teste E2E demo. |
| Monorepo tooling | ❌ absent | Fără root `package.json`/workspaces; `package-lock.json` orfan (gol) la root; cele 2 apps sunt proiecte npm complet independente. |

---

## 3. Puncte forte (de păstrat, nu de atins)

1. **Backend disciplinat pe invariante:** tenant isolation enforced în WHERE la fiecare query, BR-02/BR-04/T07 enforced la nivel BD (defaults + triggere PL/pgSQL), audit log imposibil de alterat de rolul aplicației. Acesta e nivelul corect de defense-in-depth pentru un AOS multi-tenant.
2. **Fixtures T01-T07 ca contract executabil** — formulele BRD §7 au o singură expresie testată; orice engine M1.S3 va fi blocat la merge dacă diverge.
3. **Demo cu pattern uniform de state** (`useSyncExternalStore` + localStorage + seed determinist) — face swap-ul spre API real *posibil fără a rescrie componentele*, doar implementarea store-ului.
4. **Separarea sale/rent prin calibration profiles** (Regula 20) — decizie arhitecturală corectă: zero duplicare formule, extensibilă la profile noi.
5. **Guvernanța documentației** — trasabilitate BR-XX ↔ cod ↔ teste rară la proiecte de această dimensiune; Regula 21 previne deriva doc↔cod.

---

## 4. Findings register

**0 CRIT · 2 HIGH · 5 MED · 3 LOW.** Niciun finding nu blochează M1.S3, dar F-ARCH-01/02 cresc în cost cu fiecare sesiune de demo suplimentară.

| ID | Sev | Finding | Impact | Remediere (fază) |
|---|---|---|---|---|
| F-ARCH-01 | HIGH | **Demo și backend sunt două lumi paralele fără niciun artefact partajat.** 18 store-uri localStorage + tipuri mock (`lib/mock/types.ts`) codifică entități și reguli (BR-04, FRS, match, sugestii) care există/vor exista și în `apps/api/`. Fiecare sesiune de demo nouă (M0.S6→S9 au adăugat ~15 store-uri) mărește factura de re-implementare la wire-up M1.S5 și riscul de divergență semantică (ex. enum-uri LeadType/TaskStatus definite de 2 ori). | Cost wire-up crescător; regula de business poate diverge tăcut între UI și API. | P0: `packages/shared` (tipuri + enums + helpers intent + reguli pure); îngheț feature-growth demo până la M1.S3 close. Aliniat cu datoria D-1..D-7 deja urmărită în `ARCH_REVYX_agent-routine-capability-map_v1.0.0.md` §6. |
| F-ARCH-02 | HIGH | **Lipsă tooling monorepo.** Fără root workspaces nu se poate crea un pachet partajat; deps duplicate (typescript, eslint), versiuni divergente posibile; `package-lock.json` orfan la root (packages: {} gol) induce în eroare tooling-ul. | Blochează structural remedierea F-ARCH-01; fricțiune CI. | P0: npm workspaces minimal (root `package.json` cu `workspaces: ["apps/*", "packages/*"]`) + ștergere lockfile orfan. Fără turborepo/nx — Simplicity First. |
| F-ARCH-03 | MED | **`scoring/fixtures.ts` este simultan fixture și implementare.** Helpers `computeLeadScore/...` trăiesc în fișierul de fixtures; la M1.S3 există riscul ca engine-urile de producție să importe „fixture-ul" sau să re-implementeze formulele separat de acesta. | Testul care validează engine-ul ar valida propria copie, nu producția. | P0/P1: extrage `scoring/engine.ts` (producție, pur, fără I/O); `fixtures.spec.ts` asertează engine-ul contra tabelelor T01-T07. |
| F-ARCH-04 | MED | **Boilerplate ×18 în store-urile demo** — fiecare store repetă ~50 linii identice (load/save/cache/subscribe/notify/hydration). ~600+ linii duplicate; hydration tratată ușor diferit între store-uri (risc de bug SSR subtil). | Cost întreținere + drift între store-uri. | P2 (sau oportunist): factory generic `createLocalStore<T>(key, seed)`; migrare incrementală, nu big-bang (Surgical Changes). |
| F-ARCH-05 | MED | **Reguli de business re-implementate în componente:** BR-04 în `task-store`, FRS derivat în componentă (D-2), budget/zone/rooms fit în `match-reasoning.tsx`. | La M1.S3 backend-ul va calcula altfel decât arată demo-ul. | P1: mutare în funcții pure sub `packages/shared/domain/`; backend-ul M1.S3 importă aceleași funcții sau le portează 1:1 cu aceleași fixtures. |
| F-ARCH-06 | MED | **Paritate i18n necontrolată de CI:** RO 1426 chei vs RU 870 vs EN 820 (D-6, deferred M1.S5 — OK ca decizie), dar bug-ul deja întâlnit (blocuri JSON duplicate `"lead"` în en/ru → last-wins ascundea chei) poate reapărea nedetectat. | Regresii i18n silențioase. | P0 (ieftin): step CI în `web-preview-ci` — lint JSON duplicate-keys + raport diff chei RO↔RU/EN (warning, nu fail, până la M1.S5). |
| F-ARCH-07 | MED | **Zero teste automate pe demo** (26 rute, iterație PM intensă); smoke-ul manual din Regula 10 (HTTP 200 + content probe) se execută de mână la fiecare sesiune. | Timp de sesiune consumat repetitiv; regresii posibile între sesiuni. | P2: Playwright minimal care automatizează exact probe-urile deja folosite manual (rute 200 + markeri de conținut per pagină); rulat în `web-preview-ci`. Aduce în față jumătatea utilă a T-M1.S5-XX visual regression. |
| F-ARCH-08 | LOW | **Contract API nedocumentat mașină-lizibil.** DTO-urile sunt Zod (bine), dar nu se generează OpenAPI; wire-up-ul M1.S5 și mobile M2 vor avea nevoie de contract stabil. | Integrare FE↔BE pe bază de citit cod. | P2: generare OpenAPI din Zod (ex. `zod-openapi`) + publicare în `docs/tech-spec/` sau endpoint `/openapi.json`. |
| F-ARCH-09 | LOW | **CLAUDE.md §0a a devenit jurnal istoric** (rezumate complete M0.S5→S9 inline) — taxă de context la fiecare sesiune, contrar spiritului Regulii 17. | Cost token per sesiune; semnal/zgomot scăzut. | P0 (opțional, doc-only): păstrează în §0a doar ultimele 2 sesiuni + pointer la Roadmap §0 pentru istoric. |
| F-ARCH-10 | LOW | **CRUD backend hand-rolled ×7** cu mapare câmp-cu-câmp în `update()` (ex. `leads.service.ts:66-82`). Acceptabil acum; devine anevoios când entitățile primesc câmpurile Moldova (T-MD-01..05) + AGI. | Boilerplate crescător. | P1, doar dacă doare: helper comun de patch-mapping tenant-scoped; NU un framework generic (Simplicity First). |

---

## 5. Plan de îmbunătățire (fazat, aliniat Roadmap)

### P0 — „Fundația de convergență" (1 sesiune dedicată, ÎNAINTE de M1.S3 · Model: sonnet)
| # | Acțiune | Finding | Efort |
|---|---|---|---|
| P0-1 | Root `package.json` cu npm workspaces + ștergere `package-lock.json` orfan + lockfile-uri regenerate; CI neschimbat funcțional | F-ARCH-02 | 0.25 sesiune |
| P0-2 | `packages/shared` schelet: enums (LeadType, TransactionIntent, ListingType, TaskStatus, statusuri) + `transaction-intent` helpers (mutate din demo) + tipuri entități demo aliniate la coloanele Drizzle | F-ARCH-01 | 0.5 sesiune |
| P0-3 | Split `apps/api/src/scoring/engine.ts` (producție) vs `fixtures.ts` (doar tabele T01-T07); spec-ul asertează engine-ul | F-ARCH-03 | 0.25 sesiune |
| P0-4 | CI: lint duplicate-keys JSON + raport paritate chei i18n (warning) | F-ARCH-06 | 0.25 sesiune |

**Gate:** typecheck/lint/test/build PASS pe ambele apps; zero schimbare de comportament UI sau API (refactor pur).

### P1 — M1.S3 Phase B (deja planificat; adaosuri arhitecturale)
- Engine-urile LS/IS/PS/LF consumă `scoring/engine.ts` + fixtures T01-T07 (+T08-T10 rent) — nu copii noi.
- Regulile pure din demo (BR-04 check, FRS, match fit) se mută în `packages/shared/domain/` și devin sursa unică pentru ambele apps (F-ARCH-05).
- **Demo freeze:** din M1.S3, sesiunile de demo se limitează la bugfix; orice feature nou intră direct pe traiectoria backend + wire-up (oprește creșterea D-1..D-7).

### P2 — M1.S4/M1.S5 (wire-up + calitate)
- Strategia de wire-up: fiecare store localStorage își păstrează interfața hook (`useTasks()` etc.) și primește implementare API-backed — componentele nu se ating. Factory `createLocalStore` introdus la migrare (F-ARCH-04).
- OpenAPI generat din Zod → client typesafe pentru web (și, ulterior, mobile M2) (F-ARCH-08).
- Playwright smoke automatizat = probe-urile manuale Regula 10 (F-ARCH-07). RU/EN completare (D-6) + gate-ul de paritate i18n trecut din warning în fail.

### P3 — M2 (mobile + GA)
- Mobile RN consumă `packages/shared` + client OpenAPI — zero re-implementare de domeniu.
- Visual regression Playwright `toHaveScreenshot()` per Regula 14.

**Efort total P0 ≈ 1 sesiune; P1/P2 nu adaugă sesiuni noi — redistribuie conținut în sesiunile M1.S3-S5 deja planificate.**

---

## 6. Sign-off

| Rol | Verdict |
|---|---|
| Software Architect (review lead) | ✅ APPROVED — 0 CRIT; P0 recomandat înainte de M1.S3 |
| Senior Solution Architect | ✅ APPROVED |
| Senior QA / Test Architect | ✅ APPROVED cu note (F-ARCH-06/07) |
| Senior PM | ⏳ pending — decizie P0 ca sesiune dedicată vs. absorbit în M1.S3 entry |

**Cross-refs:** `CLAUDE.md` §0a + Regulile 8/17/18/20/21 · `ARCH_REVYX_agent-routine-capability-map_v1.0.0.md` §6 (D-1..D-7) · `ROADMAP_REVYX_detailed-execution_v1.0.16.md` §4 · `BRD_REVYX_v1.5.0.md` §7/§12.

---

*ARCH_REVIEW_REVYX_full-stack_v1.0.0.md · v1.0.0 · 2026-07 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
