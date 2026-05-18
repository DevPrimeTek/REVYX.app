# INDEX — REVYX Document Catalog
<!-- INDEX_REVYX_documents_v1.1.5.md · v1.1.5 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Audit Lead | Initial — retrospectiva tuturor documentelor existente la S12 close |
| 1.0.1 .. 1.0.9 | 2026-05/06/07 | Senior PM + Audit Lead | PATCH-uri Phase 5 (vezi v1.1.1 pentru istoric complet) |
| 1.1.0 | 2026-07 | Senior PM + VP Product + Audit Lead + Solution Architect + CTO + CISO + DPO + CFO | **MINOR — Phase 5 GA close consolidation** + §15 board reports. |
| 1.1.1 | 2026-07 | Audit Lead + Senior PM + 7-rol audit team | **PATCH — Post-S20 HST #2 PASS clean consolidation.** Adăugare HST raport + findings backlog. |
| 1.1.2 | 2026-05 | DESIGNER (Creative Director) + Senior Architect + Frontend Lead + Senior PM + DOC | **PATCH — M0.S1 Design System direct-to-code consolidation.** Adăugare 3 documente noi M0.S1: (★ `docs/tech-spec/TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` — spec design system canonical, închide F-S20-04 component half + F-S20-10 DP-06 brand parity · ★ `design/tokens.json` — single source of truth tokens (color, typography, spacing, radius, shadow, motion, breakpoints, z-index) consumat de tailwind.config + NativeWind future · ★ `design/screens-inventory.md` — 18 screens prioritized per role × module mapping) + adăugare 1 PATCH (★ `docs/ROADMAP_REVYX_detailed-execution_v1.0.1.md` — §3.1 + §3.3 direct-to-code shift; v1.0.0 retrogradat la [HISTORY] partial — în continuare valid pentru §2/§4/§5/§6/§7) + livrare `apps/web-preview/` skeleton (Next.js 14 + Tailwind + 7 page stubs + 6 UI primitives). Cross-ref Trio canonical (Master Plan v1.1.2 + Platform Matrix v1.0.0 + Roadmap v1.0.1 ACTIVE). Backwards compat full cu v1.1.1. Trigger: T-M0.S1-09 + T-M0.S1-10 outputs + Regula 6 INDEX update. |
| 1.1.3 | 2026-05 | FRONTEND WEB DEV + DESIGNER (Creative Director) + ARCHITECT + Senior PM + DOC | **PATCH — M0.S2 ✅ CLOSED Clickable Prototype.** Adăugare 1 PATCH document (★ `docs/ROADMAP_REVYX_detailed-execution_v1.0.2.md` — §3.2 M0.S2 T-M0.S2-01..05 marcate ☑ + status note adăugat în §0; v1.0.1 retrogradat la [HISTORY] — în continuare valid ca referință pentru §3.2 pre-close descriere) + extindere `apps/web-preview/` in-place (3 pages noi: `app/properties/new/`, `app/manager/escalations/`, `app/leads/[id]/` upgrade la client cu Assign modal + LS recompute; `app/deals/page.tsx` rewrite cu click-to-advance + Close-won confirm modal; `components/ui/toast.tsx` global queue + `components/providers.tsx` `<AppProviders/>` în `app/layout.tsx`; button focus ring + active translate). 13 routes prerendered cf. `next build`. Trio canonical actualizat (Master Plan v1.1.2 + Platform Matrix v1.0.0 + Roadmap **v1.0.2** ACTIVE). Backwards compat full cu v1.1.2. Trigger: T-M0.S2-01..05 ☑ + Regula 6 INDEX update + Regula 8 Master Plan §0a sync. |
| 1.1.4 | 2026-05 | DEVOPS + FRONTEND WEB DEV + Senior PM + DOC | **PATCH — M0 deploy pipeline online (Vercel GitHub App + CI build gate).** Bring-forward T-M0.S3-14 partial — Vercel setup runbook + CI workflow + vercel.json. Custom domain `demo.revyx.app` tracked M0.S3. Backwards compat full cu v1.1.3. |
| **1.1.5** | **2026-05** | ★ FRONTEND WEB DEV + DEVOPS + DESIGNER + DOC | ★ **PATCH — M0.S3 ✅ CLOSED Web Static Demo.** Adăugare/promovare: (a) `apps/web-preview/` → `apps/web/` git mv (33 fișiere) + `package.json` rename `@revyx/web@0.2.0` (b) NEW PATCH document `docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md` — §3.3 T-M0.S3-01..13 marcate ☑ + status note în §0 (v1.0.2 retrogradat la [HISTORY] valid pentru §3.3 pre-close descriere) (c) NEW Runbook PATCH `docs/runbook/RUNBOOK_REVYX_demo-deploy_v1.0.2.md` — Root Directory bump `apps/web-preview` → `apps/web` + DNS step `demo.revyx.app` (CNAME → cname.vercel-dns.com) + workflow rename `web-preview-ci.yml` → `web-ci.yml` (d) NEW workflow `.github/workflows/web-ci.yml` (rename + paths bump) (e) NEW directory `apps/web/lib/mock/` (5 files: types, rng deterministic xmur3+sfc32, agents.ts 8 records, leads.ts 100 records, properties.ts 50, deals.ts 20) (f) NEW directory `apps/web/messages/` (ro.json + ru.json + en.json ~120 keys/limbă) (g) NEW `apps/web/components/i18n/provider.tsx` (`useT()` hook custom context + localStorage) (h) NEW `apps/web/components/deals/kanban-board.tsx` (@dnd-kit draggable + droppable + DragOverlay) (i) NEW 3 pages `apps/web/app/{settings,profile,notifications}/page.tsx`. `next build` PASS 16 routes. Trio canonical actualizat (Master Plan v1.1.2 + Platform Matrix v1.0.0 + Roadmap **v1.0.3** ACTIVE). Backwards compat full cu v1.1.4. Trigger: T-M0.S3-01..13 ☑ + Regulile 6 + 8. |

---

## 1. Convenție

- Toate documentele REVYX sunt listate aici cu **descriere scurtă (≤10 rânduri, target ~5)**.
- La crearea oricărui document nou — **obligatoriu** să se adauge intrare în acest INDEX (CLAUDE.md §10b Regula 6).
- La bump versiune MAJOR/MINOR pentru un document existent — actualizare descrierii.
- Sortare per categorie → alfabetică/cronologică. `★` înaintea numelui = adăugat/actualizat la sesiunea curentă (★ deploy-pipeline M0 acum).
- Stil descriere: 5 rânduri în română — (1) ce e · (2) findings/feature · (3) cross-ref · (4) gating · (5) versiune+owner.

---

## 2. Documente foundation (CLAUDE.md + brand)

| Document | Descriere |
|---|---|
| ★ `CLAUDE.md` v1.2.6 | Agent Operating System cheat-sheet pentru Claude Code la fiecare sesiune. §0a Status Execuție LIVE actualizat M0.S2 ✅ CLOSED → ★ **deploy pipeline online (Vercel app + CI gate)** → M0.S3 next. Regulile 1-9 active (incl. Regula 9 Platform Matrix compliance). |
| `docs/brand-configs/revyx.md` v1.0.0 | Brand system canonical: paletă (navy + gold), font (Bebas Neue + Montserrat + JetBrains Mono), componente UI, ton voce. Citit de toate skill-urile la generare document. **Lege pentru orice UI** (CLAUDE.md §1). Open question OD-01 ridicat M0.S1: AC-M0-02 menționează "Inter" — în spec ui-design-system §10 listed as pending PM resolution. Owner: Senior Designer + PM. |

---

## 2a. Strategic Planning

| Document | Descriere |
|---|---|
| `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.0.0.md` [HISTORY] | INITIAL S15-bis. SUPERSEDED de v1.1.0+v1.1.1+v1.1.2. |
| `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md` [HISTORY] | MINOR S15-bis-2 — Dual-platform restructure. SUPERSEDED. |
| `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.1.md` [HISTORY] | PATCH S15-bis-3 — Trio canonical introduction. SUPERSEDED. |
| `docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` | PATCH S20 — §13 sign-off 6/6 post HST #2 PASS clean. §0 Status Tracker M0.S1 ✅ CLOSED post-M0.S1 sync. §11 NFR clarification per F-S20-08. Versiunea **activă**. |

---

## 2b. Platform & Detailed Roadmap (Trio canonical, ★ M0.S3 sync)

| Document | Descriere |
|---|---|
| `docs/PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` | NEW S15-bis-3 — **Single source of truth feature × platform mapping**. 15 module + 119 features. §17 statistici (41% Web only, 4% Mobile only, 55% Both). §19 Cross-references **★ ui-design-system row CLOSED M0.S1**. Owner: Senior Architect + PM + PO + Frontend Lead + Mobile Lead + Audit Lead + CTO. |
| `docs/ROADMAP_REVYX_detailed-execution_v1.0.0.md` [HISTORY-partial] | NEW S15-bis-3 — Initial decomposition. Pre-dev + M1 + M2 + critical path rămân valide. M0.S1 + M0.S3 SUPERSEDED de v1.0.1; M0.S2 close-state SUPERSEDED de v1.0.2. |
| `docs/ROADMAP_REVYX_detailed-execution_v1.0.1.md` [HISTORY] | NEW M0.S1 — PATCH direct-to-code shift. §3.1 M0.S1 + §3.3 M0.S3 rebalance. SUPERSEDED de v1.0.2. |
| `docs/ROADMAP_REVYX_detailed-execution_v1.0.2.md` [HISTORY] | NEW M0.S2 — PATCH M0.S2 ✅ CLOSED. §3.2 T-M0.S2-01..05 marcaje ☑. SUPERSEDED de v1.0.3 post-M0.S3 close. |
| ★ `docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md` | NEW M0.S3 — **PATCH M0.S3 ✅ CLOSED**. §3.3 T-M0.S3-01..13 marcaje ☑ + T-M0.S3-14 ◐ (DNS step PARTIAL). Status note detaliat per task: rename `apps/web-preview/` → `apps/web/`, mock data 100/50/20, i18n RO/RU/EN custom provider, drag-drop @dnd-kit, 3 pagini noi. §0 trigger note + build evidence 16 routes. Backwards compat full cu v1.0.2. Versiunea **activă**. Owner: FRONTEND WEB DEV + DEVOPS + DESIGNER (Creative Director) + ARCHITECT + Senior PM + DOC. |

---

## 2c. Design System (NEW v1.1.2, M0.S1; ★ v1.1.5 M0.S3 promote)

| Artefact | Descriere |
|---|---|
| `design/tokens.json` v1.0.0 | NEW M0.S1 — **Single source of truth pentru toate tokens UI** (color: navy + gold paletă + status + actor + lead temperature; typography: families + scale; spacing 8px grid; radius; shadow; motion; breakpoints; z-index; component-level token bundles). Sursă: `docs/brand-configs/revyx.md` v1.0.0 canonical. Consumat de `apps/web/tailwind.config.ts` + (future) `apps/mobile/` NativeWind M2.S3. Include `accessibility.verified` cu contrast ratios măsurate WCAG AA. Owner: DESIGNER (Creative Director). |
| `design/screens-inventory.md` v1.0.0 | NEW M0.S1 — **18 screens prioritized per role × module**. AC-M0-01 target ≥12 ecrane satisfied at M0.S3 (15 routes static + 1 dynamic). §3 BR-XX surfacing in UI. §4 user journeys J1-J4. §5 open questions. Owner: DESIGNER + ARCHITECT. |
| ★ `apps/web/` (M0.S3 demo, promoted from `apps/web-preview/`) | ★ M0.S3 PROMOTE — Next.js 14 App Router demo app consumând `design/tokens.json`. **Status M0.S3:** 16 routes (`/`, `/login`, `/dashboard`, `/leads`, `/leads/[id]`, `/properties`, `/properties/new`, `/deals`, `/manager`, `/manager/escalations`, `/admin`, `/settings` ★, `/profile` ★, `/notifications` ★, `_not-found`). Mock data deterministic (100 leads + 50 properties + 20 deals + 8 agents). i18n custom React context cu `useT()` hook + RO/RU/EN catalogs (`messages/{ro,ru,en}.json` ~120 keys each) + localStorage persistence (`revyx.locale`). Drag-drop @dnd-kit pe `/deals` cu click-to-advance a11y fallback permanent. `next build` PASS 16 routes (15 static + 1 dynamic). Reusable 1:1 în M1.S5 (real API wire-up) + M2.S2 (Web Complete). Owner: FRONTEND WEB DEV + DESIGNER + DEVOPS. |
| ★ `apps/web/lib/mock/` | NEW M0.S3 — Mock data factories deterministe. `rng.ts` xmur3 hash seeder + sfc32 PRNG (~0.5KB, public-domain). `types.ts` TypeScript schemas (Lead, Property, Deal, Agent). `agents.ts` 8 records. `leads.ts` factory cu LS distribution HOT 12% / qualified 22% / warm 36% / nurturing 30% + BR-01 firewall enforcement (agent assignment doar peste 0.60). `properties.ts` factory 50 records mixed apartament/casă/teren/comercial cu PS+LF derivat din `daysOnMarket`. `deals.ts` 20 records distribuiți peste 6 stages cu BR-10 TF_default applied. Owner: FRONTEND WEB DEV. |
| ★ `apps/web/messages/` | NEW M0.S3 — i18n catalogs RO + RU + EN (~120 keys/limbă). Secțiuni: nav, common, lead, leadDetail, property, deal, dashboard, manager, admin, login, settings, profile, notifications. `{var}` interpolation support. Owner: FRONTEND WEB DEV + DOC. |
| ★ `apps/web/components/i18n/provider.tsx` | NEW M0.S3 — i18n React context provider. `useT()` hook returnează `{locale, setLocale, messages, t(key, vars?)}`. Dot-path key resolution. RO fallback automat la missing key. Persistare localStorage. SSR-safe (default RO la initial render, hydrates stored locale). Owner: FRONTEND WEB DEV. |
| ★ `apps/web/components/deals/kanban-board.tsx` | NEW M0.S3 — @dnd-kit drag-drop kanban. DealCard cu draggable handle `⋮⋮` (separat de click-to-advance). StageColumn droppable cu visual feedback `isOver`. DragOverlay cu rotire +1° + ring gold. PointerSensor activation distance 6 (anti-tap). KeyboardSensor enabled. Owner: FRONTEND WEB DEV. |

---

## 3. Business / Product Requirements

| Document | Descriere |
|---|---|
| `docs/BRD_REVYX_v1.0.0.md` | Business Requirements Document v1.0 — piloni, formule scoring, RBAC 5 roluri, T01-T07. Owner: PM Lead. |
| `docs/BRD_REVYX_v1.1.0.md` | BRD bump MINOR — Pilon Retention §6.4 + entity BUYER_PROFILE §8.3 + White-Label/Mobile §10.2-10.3. Owner: PM Lead + VP Product. |

---

## 4. Tech Specs (engines + platform)

### 4.1 Phase 0-4 (lead/property/deal core)

> Neschimbat față de v1.1.1. Vezi `INDEX_REVYX_documents_v1.1.1.md` §4.1 pentru lista completă (17 specs).

### 4.2 Phase 5 (S8/S9/S10/S11/S12/...)

> Neschimbat față de v1.1.1. Vezi `INDEX_REVYX_documents_v1.1.1.md` §4.2 (18 specs).

### 4.3 ★ Frontend / Design System (NEW v1.1.2)

| Document | Descriere |
|---|---|
| ★ `TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` | NEW M0.S1 — **Design system canonical spec**. §1 scope + §2 tokens schema (consum tailwind/NativeWind) + §3 component primitives API contract (Button, Card, Input, Badge, Modal, Table, Toast cu accessibility contract WCAG AA) + §4 responsive breakpoints (Tailwind defaults) + §5 a11y contrast ratios verified + §6 dark mode stance (M0 = single dark, theme switch M2+) + §7 implementation contract apps/web-preview + §8 DoD + §9 findings closure (F-S20-04 component half + F-S20-10 DP-06 brand parity ambele CLOSED FULL) + §10 OD-01..OD-03 (font/grid/theme pending PM resolution). Cross-ref Trio canonical + brand-configs/revyx.md. Owner: DESIGNER (Creative Director) + ARCHITECT + FRONTEND WEB DEV + DOC. |

---

## 5-11. Workflows, Runbooks, Audit + Readiness, CS Playbooks, Legal, Test fixtures, Skills

> Neschimbat față de v1.1.1, cu excepția §6 Runbooks (★ +1 v1.1.4 — vezi mai jos). Vezi `INDEX_REVYX_documents_v1.1.1.md` §5-§11 + §15.

### 6.x Deploy & CI/CD (★ UPDATED v1.1.5 — M0.S3 promote)

| Artefact | Descriere |
|---|---|
| `docs/runbook/RUNBOOK_REVYX_demo-deploy_v1.0.0.md` [HISTORY] | Initial M0 deploy procedure pentru `apps/web-preview/`. SUPERSEDED de v1.0.2 post-M0.S3 promote. |
| `docs/runbook/RUNBOOK_REVYX_demo-deploy_v1.0.1.md` [HISTORY] | PATCH cu fix `outputDirectory` removed. SUPERSEDED de v1.0.2. |
| ★ `docs/runbook/RUNBOOK_REVYX_demo-deploy_v1.0.2.md` | NEW M0.S3 — **PATCH Vercel Root Directory bump `apps/web-preview` → `apps/web`** + §2.3 DNS step custom domain `demo.revyx.app` (CNAME → `cname.vercel-dns.com`, TLS auto-issue Let's Encrypt). §1 `apps/web-preview→apps/web` rename context. §4 troubleshooting actualizat cu "Root Directory not found" simptom. Owner: DEVOPS + FRONTEND WEB DEV + Senior PM. |
| ★ `.github/workflows/web-ci.yml` (rename from `web-preview-ci.yml`) | NEW M0.S3 — CI build gate paralel; rulează `npm ci → typecheck → next build` la fiecare PR cu modificări în `apps/web/**` sau `design/tokens.json`. Node 22 + npm cache pe `apps/web/package-lock.json`. Owner: DEVOPS + FRONTEND WEB DEV. |
| ★ `apps/web/vercel.json` (moved from `apps/web-preview/vercel.json`) | M0.S3 — Vercel project config: framework Next.js, region `fra1`, 4 security headers default (X-Frame-Options DENY + nosniff + Referrer-Policy + Permissions-Policy). Owner: DEVOPS. |

---

## 12. Document count summary (★ M0.S3 close, v1.1.5)

| Categorie | Count |
|---|---|
| Foundation (CLAUDE.md + brand) | 2 (CLAUDE.md ★ v1.2.7) |
| Strategic Planning | 4 (MASTER_PLAN v1.0.0 [history] + v1.1.0 [history] + v1.1.1 [history] + v1.1.2 active) |
| Platform & Detailed Roadmap | 5 (Roadmap ★ v1.0.3 ACTIVE; v1.0.2/v1.0.1 [HISTORY], v1.0.0 [HISTORY-partial]) |
| Design System (§2c) | 7 (tokens.json + screens-inventory + ★ apps/web/ promoted + ★ apps/web/lib/mock/ + ★ apps/web/messages/ + ★ apps/web/components/i18n/ + ★ apps/web/components/deals/) |
| BRD | 2 |
| Tech Specs (Phase 0-4 + Phase 5 + Frontend/Design) | 36 |
| Workflows | 11 |
| Runbooks | 13 (★ demo-deploy v1.0.2 PATCH adds; v1.0.0/v1.0.1 retained as [HISTORY]) |
| Audit + Readiness | 19 |
| CS Playbooks + Checklists | 7 |
| Legal | 7 |
| Test fixtures + Templates | 3 |
| Skills | 5 |
| Board reports + Strategic post-GA §15 | 1 |
| **Total** | **120 documente** (★ +4 vs v1.1.4 = Roadmap v1.0.3 PATCH + Runbook demo-deploy v1.0.2 PATCH + INDEX v1.1.5 + 5 design-system §2c artefacte M0.S3 noi rolled into a single category bump; CLAUDE.md bump v1.2.6 → v1.2.7 in-place; `.github/workflows/web-ci.yml` rename + `apps/web/vercel.json` move = additive infra). |

> **Notă:** documente duplicate prin versiuni listate separat. **Active** post-M0.S3: **~98** (+1 Roadmap +1 Runbook +5 §2c artefacte vs M0.S2).

---

## 13. Maintenance protocol

1. La creare document nou: update obligatoriu categoria corespunzătoare; bump PATCH (sau MINOR la ≥3 docs noi în sesiune SAU GA close consolidation).
2. La bump versiune existent: actualizare descriere; mențin entry vechi (istoric).
3. La deprecare: append `[DEPRECATED]` + cross-ref successor.
4. Refresh manual la fiecare audit checkpoint (S12..S20 = pre-dev; M0.S1 acum, M0.S2+ următoare).
5. Stil descriere: target 5 rânduri română.
6. Post-M0.S1: PATCH bump v1.1.2 a reflectat direct-to-code outputs (3 design artifacts + 1 spec NEW + 1 Roadmap PATCH).
7. Post-M0.S2: PATCH bump v1.1.3 reflectă Clickable Prototype outputs (1 Roadmap PATCH v1.0.2 + CLAUDE.md bump v1.2.5 in-place + apps/web-preview in-place extension).
8. Post-deploy-pipeline-M0: PATCH bump v1.1.4 reflectă bring-forward T-M0.S3-14 partial (Vercel setup runbook + CI workflow + vercel.json).
9. ★ Post-M0.S3 close: PATCH bump v1.1.5 reflectă Web Static Demo livrat (Roadmap v1.0.3 + Runbook v1.0.2 + apps/web/ promote din apps/web-preview/ + 5 §2c artefacte mock/i18n/dnd-kit + CLAUDE.md bump v1.2.7).

---

## 14. Approval

| Aprobator | Sign-off | Data |
|---|---|---|
| Senior PM | ✅ | 2026-05 |
| Senior PO | ⬜ pending v1.1.3 ratify | — |
| Audit Lead | ⬜ pending v1.1.3 ratify | — |
| Solution Architect | ✅ (★ v1.1.3 a11y review pe modale + click-to-advance fallback) | 2026-05 |
| DESIGNER (Creative Director) | ✅ (★ v1.1.3 visual review hover/active/focus) | 2026-05 |
| Frontend Lead | ✅ (★ v1.1.3 build pass 13/13 routes) | 2026-05 |
| VP Product | ✅ (v1.1.0 GA close consolidation) | 2026-07 |
| CTO | ✅ (v1.1.0) | 2026-07 |
| CISO | ✅ (v1.1.0) | 2026-07 |
| DPO | ✅ (v1.1.0) | 2026-07 |
| CFO | ✅ (v1.1.0) | 2026-07 |

---

## 15. Board reports + Strategic post-GA

> Neschimbat față de v1.1.0. Vezi `INDEX_REVYX_documents_v1.1.0.md` §15.

---

*docs/INDEX_REVYX_documents_v1.1.4.md · v1.1.4 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
