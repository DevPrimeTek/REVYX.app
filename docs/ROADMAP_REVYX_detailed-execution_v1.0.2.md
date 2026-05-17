# DETAILED ROADMAP — REVYX Execution Tasks Decomposition
<!-- ROADMAP_REVYX_detailed-execution_v1.0.2.md · v1.0.2 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** Pre-dev → M0 → M1 → M2 (toate sub-stages)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4-§6
**Trigger v1.0.2:** ★ M0.S2 ✅ CLOSED — Clickable Prototype direct-to-code livrat în `apps/web-preview/` (4 user journeys J1-J4 end-to-end: Assign modal pe `/leads/[id]`, intake form `/properties/new`, click-to-advance + Close-won modal pe `/deals`, bulk reassign pe `/manager/escalations`). `<ToastProvider/>` global + focus rings/active states pe butoane. Drag-drop @dnd-kit explicit reținut pentru M0.S3 (T-M0.S3-10) cu click-to-advance ca a11y fallback permanent.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-06 | Senior Architect + Senior PM + Senior PO | INITIAL — descompune Master Plan v1.1.0 sub-stages în atomic tasks (T-XXX). |
| 1.0.1 | 2026-05 | DESIGNER (Creative Director) + Senior Architect + Frontend Lead + Senior PM + DOC | PATCH — direct-to-code shift M0.S1 + M0.S3 scope rebalance. §3.1 reformulat din wireframe Figma → page stub React; §3.3 T-M0.S3-01..03 marked PARTIAL inherited. NU breaking pentru AC-M0-01..07. |
| **1.0.2** | **2026-05** | ★ FRONTEND WEB DEV + DESIGNER (Creative Director) + ARCHITECT + Senior PM + DOC | ★ **PATCH — M0.S2 ✅ CLOSED Clickable Prototype.** §3.2 M0.S2 T-M0.S2-01..05 marcaje ☑. Output: 3 pages noi în `apps/web-preview/app/` (`leads/[id]` upgraded la client + Assign modal + LS recompute animated, `properties/new` 8-field intake form, `manager/escalations` bulk select + reassign modal); `deals/page.tsx` rewrite cu click-to-advance + Close-won confirm modal; `components/ui/toast.tsx` global queue + `<AppProviders/>` în layout; button focus ring + active translate. AC-M0-01 ≥ 12 ecrane navigabile satisfied early (13 routes prerendered cf. `next build`). Backwards compat full cu v1.0.1 (zero modificări §2/§3.1/§3.3/§4/§5/§6/§7). |

> **Compat (v1.0.1 → v1.0.2):** Niciun task din Pre-dev, M1.S1..S8, M2.S1..S8 NU e modificat. M0.S1 + M0.S3 + M0.S4 + M0.S5 rămân neschimbate ca scope. Doar §3.2 M0.S2 marcată ☑ + trigger note adăugat în §0. AC-M0-01..07 **neschimbate**.

---

## 1. Filozofie Detailed Roadmap

| Aspect | Definiție |
|---|---|
| **Atomic task (T-XXX)** | Unit minim de lucru autonom; produce un output verificabil |
| **Effort estimate** | XS (≤2h) · S (2-4h) · M (4-8h) · L (8-16h) · XL (16-32h) |
| **Owner hat** | Unul din 11 hats (vezi Master Plan §2.2); maximum 2-3 hats co-active |
| **Dependencies (DEP)** | Lista task-uri prerequisite (T-YYY); blocking dacă neînchise |
| **Platform tag** | 🌐 Web · 📱 Mobile · 🔁 Both · 🔧 Backend (no UI) · 📋 Doc/Plan |
| **Output deliverable** | Fișier(e) creat(e)/modificat(e) sau livrabil concret |
| **Sesiune Claude estimată** | Atomic task ≈ 1 sesiune productivă pe Pro plan (~3-4h efectiv) |

### 1.1 Reguli planning task

1. Niciun task NU începe înainte ca toate DEP să fie ☑.
2. Tasks XL trebuie split în sub-tasks dacă posibil (preferat L max).
3. Hats specificate per task = activate la inceput sesiune Claude Code.
4. Output deliverable verificat în PR review înainte de close task.
5. Critical Path tasks (§6) au prioritate absolută — orice slack acolo blochează totul.

---

## 2. Pre-development (S16-S20)

> Neschimbat față de v1.0.0. Pre-dev a fost închis la S20 HST #2 PASS clean.
> Pentru detaliu vezi `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §2 (mențin compat).

**Summary:** S16..S19 documentation closure + S20 Hard Stress Test #2 ✅ PASS clean (per `HST_REVYX_pre-dev_v1.0.0.md`).

---

## 3. M0 — MVP PREZENTARE Detailed

**Scope:** Demo web pentru pitching investitori/clienți; NU este produs funcțional.
**Hats activate:** DESIGNER (Creative Director), FRONTEND WEB DEV (early activation per direct-to-code shift), ARCHITECT, DOC.

### 3.1 M0.S1 — Design System direct-to-code ★ REVISED v1.0.1

> **Re-orientare strategică (S20 close):** Figma traditional → direct-to-code. Tokens.json devine source of truth pentru `tailwind.config.ts`; page stubs React livrați direct (vs wireframe Figma), reusabili 1:1 în M0.S3, M1.S5+, M2.S2.

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M0.S1-01 | Audit brand-config revyx.md compliance | DESIGNER | XS | S20 close | 📋 | review notes (incl. font discrepancy flag) |
| T-M0.S1-02 | Inventory ecranelor critice demo (15-20 screens) | ARCHITECT + DESIGNER | S | T-M0.S1-01 | 📋 | `design/screens-inventory.md` |
| ★ T-M0.S1-03 | Page stub: Login (Auth Modul 1) | FRONTEND WEB DEV + DESIGNER | S | T-M0.S1-09 | 🌐 | `apps/web-preview/app/login/page.tsx` |
| ★ T-M0.S1-04 | Page stub: Dashboard Agent (NBA + queue) | FRONTEND WEB DEV + DESIGNER | M | T-M0.S1-09 | 🌐 | `apps/web-preview/app/dashboard/page.tsx` |
| ★ T-M0.S1-05 | Page stub: Lead Queue + Lead Detail | FRONTEND WEB DEV + DESIGNER | M | T-M0.S1-09 | 🌐 | `apps/web-preview/app/leads/page.tsx` + `[id]/page.tsx` |
| ★ T-M0.S1-06 | Page stubs: Property List + Deal Pipeline kanban (static) | FRONTEND WEB DEV + DESIGNER | M | T-M0.S1-09 | 🌐 | `apps/web-preview/app/properties/page.tsx` + `deals/page.tsx` |
| ★ T-M0.S1-07 | Page stub: Manager Dashboard (APS leaderboard, escalări) | FRONTEND WEB DEV + DESIGNER | M | T-M0.S1-09 | 🌐 | `apps/web-preview/app/manager/page.tsx` |
| ★ T-M0.S1-08 | Page stub: Admin panel (RBAC matrix, DP-05 enforcement) + PNG screenshots | FRONTEND WEB DEV + DESIGNER | M | T-M0.S1-09 | 🌐 | `apps/web-preview/app/admin/page.tsx` + `design/screenshots/*.png` (local capture step) |
| T-M0.S1-09 | Design System tokens (colors, spacing, typography, motion, breakpoints) | DESIGNER | S | T-M0.S1-02 | 🌐 | `design/tokens.json` |
| ★ T-M0.S1-10 | Component primitives in code (Button, Card, Input, Modal, Badge, Table) | FRONTEND WEB DEV + DESIGNER | L | T-M0.S1-09 | 🌐 | `apps/web-preview/components/ui/*.tsx` + `TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` |

**Hats activate M0.S1 (revised):** DESIGNER (P, Creative Director) + FRONTEND WEB DEV (P, ★ early activation) + ARCHITECT (S, responsive + a11y strategy) + DOC (S, spec + INDEX/Roadmap PATCH).

**Exit gate M0.S1:**
- `design/tokens.json` validat brand revyx.md (100% paletă + typography + spacing + WCAG AA contrast)
- `apps/web-preview/` rulează `npm install && npm run dev` fără erori (developer-local close step)
- 7+ page stubs accesibile cu navigație linkable; minim 3 cu RSC pattern
- `TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` publicat cu §approval matrix
- F-S20-04 component half + F-S20-10 brand parity CLOSED FULL
- AC-M0-01 (≥ 12 screens navigabile) începe acumularea; AC-M0-02 brand compliance 100% pe stub-uri

### 3.2 M0.S2 — Clickable Prototype (Direct-to-code flows) ★ CLOSED v1.0.2

> Pre-existent neschimbat — exceptând input source: în loc de Figma prototypes, M0.S2 leagă page stubs M0.S1 prin `<Link href>` + interactive client components (modale, formulare, click-to-advance). Tasks de mai jos sunt **☑ ALL CLOSED** cu output `apps/web-preview/app/**/page.tsx` (in-place enhancement + 3 pages noi).

| ID | Status | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|---|
| T-M0.S2-01 | ☑ | Click-through Lead intake → Score → Assign (J1) | DESIGNER + FRONTEND WEB DEV | M | T-M0.S1-10 | 🌐 | `app/leads/[id]/page.tsx` client component — LS recompute animat + `<Modal>` Asignează agent (4 agenți + APS + busy gate) + toast success + redirect `/dashboard` |
| T-M0.S2-02 | ☑ | Click-through Property creation → Match (J2) | DESIGNER + FRONTEND WEB DEV | M | T-M0.S1-10 | 🌐 | `app/properties/new/page.tsx` 8-field intake form (address, oraș, cartier, camere, area, preț, an, etaj) + toast match suggestions + redirect `/leads/L-0001`; entry-point Link pe `/properties` |
| T-M0.S2-03 | ☑ | Click-through Deal pipeline → close-won (J3) | DESIGNER + FRONTEND WEB DEV | M | T-M0.S1-10 | 🌐 | `app/deals/page.tsx` client rewrite — click-to-advance ← / Avansează butoane per card (keyboard-accessible) + "Close won" buton pe stage Notariat → `<Modal>` confirm → Won column + DEAL_WON toast. Drag-drop @dnd-kit reținut explicit M0.S3 (T-M0.S3-10); butoane rămân fallback a11y permanent. |
| T-M0.S2-04 | ☑ | Click-through Manager escalation queue (J4) | DESIGNER + FRONTEND WEB DEV | M | T-M0.S1-10 | 🌐 | `app/manager/escalations/page.tsx` (NEW) — 6 escalări queue, header + per-row checkbox bulk select (cu indeterminate state), "Bulk reassign (N)" button + `<Modal>` cu 4 agenți țintă + toast audit-logged stub; Link "Vezi toate" pe `/manager` |
| T-M0.S2-05 | ☑ | Internal review prototype + feedback loop | ARCHITECT + DESIGNER | S | T-M0.S2-01..04 | 📋 | DESIGNER visual review pe hover/active/focus states (Button + Card + row links cu ring `gold-light`); ARCHITECT a11y check pe modale (focus trap + ESC + return focus existent din M0.S1) + drag-drop alternative (click-to-advance + checkbox bulk = keyboard-only complete). `npm run build` pass (13/13 routes prerendered). |

### 3.3 M0.S3 — Web Static Demo (Next.js) ★ REVISED v1.0.1

> **Re-orientare:** Tasks T-M0.S3-01..03 marked PARTIAL inherited din M0.S1 (`apps/web-preview/` skeleton + tailwind + primitives livrate early). M0.S3 acum focusează exclusiv pe (a) rename/promote `apps/web-preview/` → `apps/web/` (sau menținere în paralel + DEVOPS choice), (b) mock data full 100/50/20, (c) page content complet (vs stub), (d) i18n RO+RU+EN, (e) Vercel deploy.

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| ★ T-M0.S3-01 | **PARTIAL inherited** — Promote `apps/web-preview/` → `apps/web/` OR fork pentru production deploy | FRONTEND WEB DEV + DEVOPS | XS | T-M0.S2-05 | 🌐 | rename/copy script |
| ★ T-M0.S3-02 | **PARTIAL inherited** — TailwindCSS + tokens consume contract validated (M0.S1 closed) | FRONTEND WEB DEV | — | M0.S1 | 🌐 | tailwind.config.ts (already live) |
| ★ T-M0.S3-03 | **PARTIAL inherited** — Componente UI primitives (M0.S1 closed); extend toast + tooltip + dropdown | FRONTEND WEB DEV | M | T-M0.S3-01 | 🌐 | extended `components/ui/` |
| T-M0.S3-04 | Mock data JSON (100 leads, 50 properties, 20 deals) | FRONTEND WEB DEV | M | T-M0.S3-01 | 🌐 | `apps/web/lib/mock-data/*.json` |
| T-M0.S3-05 | Page: `/login` full content (UI states + validation) | FRONTEND WEB DEV | S | T-M0.S3-03 | 🌐 | enhanced page |
| T-M0.S3-06 | Page: `/dashboard` full content (NBA + queue + APS + activity feed) | FRONTEND WEB DEV | M | T-M0.S3-04 | 🌐 | enhanced page |
| T-M0.S3-07 | Page: `/leads` full (queue + filter + sort + pagination) | FRONTEND WEB DEV | M | T-M0.S3-04 | 🌐 | enhanced page |
| T-M0.S3-08 | Page: `/leads/[id]` full (detail + activity + match suggestions side-panel) | FRONTEND WEB DEV | M | T-M0.S3-04 | 🌐 | enhanced page |
| T-M0.S3-09 | Page: `/properties` + `/properties/[id]` full (gallery, map placeholder, score breakdown) | FRONTEND WEB DEV | M | T-M0.S3-04 | 🌐 | property pages |
| T-M0.S3-10 | Page: `/deals` kanban cu drag-drop (react-dnd sau dnd-kit) | FRONTEND WEB DEV | L | T-M0.S3-04 | 🌐 | kanban interactive |
| T-M0.S3-11 | Page: `/manager/*` (escalations, team APS, audit log preview) | FRONTEND WEB DEV | M | T-M0.S3-04 | 🌐 | manager subroutes |
| T-M0.S3-12 | Page: `/admin/*` (RBAC mock, white-label preview, audit log) | FRONTEND WEB DEV | M | T-M0.S3-04 | 🌐 | admin subroutes |
| T-M0.S3-13 | i18n setup next-intl RO + RU + EN | FRONTEND WEB DEV | S | T-M0.S3-01 | 🌐 | `apps/web/messages/*.json` |
| T-M0.S3-14 | Deploy Vercel + custom domain `demo.revyx.app` | DEVOPS | S | T-M0.S3-12 | 🌐 | URL public |

**Net effort delta M0.S3:** −2 sesiuni vs v1.0.0 (skeleton + primitives ne-mai-livrabile în M0.S3); + nominal effort în M0.S1 +1 sesiune (early FE activation). Total M0 = ~−1 sesiune (~7-9 sesiuni vs original 8-10).

### 3.4 M0.S4 — Pitch Deck + Video Walkthrough

> Neschimbat. Vezi `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §3.4.

### 3.5 M0.S5 — HST M0 ⚠️ GATE

> Neschimbat. Vezi `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §3.5.

**M0 EXIT GATE:** AC-M0-01..07 toate ☑; HST M0 0 findings CRIT/HIGH; demo URL live.

---

## 4. M1 — MVP FUNCȚIONAL Detailed

> Neschimbat față de v1.0.0. Note: T-M1.S5-01 ("Reuse design system din M0.S1 + tokens") rămâne valid și beneficiază acum de `design/tokens.json` + `apps/web-preview/components/ui/` deja stabilizate.

---

## 5. M2 — FULL RELEASE GA Detailed

> Neschimbat față de v1.0.0. Note: T-M2.S3-05 (NativeWind + design system tokens shared cu Web) beneficiază de `design/tokens.json` ca single source of truth (DP-06 brand consistency).

---

## 6. Critical Path Analysis (Top 20 dependencies blocking)

> Neschimbat structural. Top entry T-M0.S1-09 (Design System tokens) **rank 20 promovat la rank 5** post-v1.0.1 — devine blocker pentru toate page stubs M0.S1 (T-M0.S1-03..08) **și** pentru tailwind.config în M0.S3 + M1.S5 + M2.S2/S5.

---

## 7. Effort Summary per Milestone

| Milestone | Tasks | XS | S | M | L | XL | Sesiuni Claude estimate |
|---|---|---|---|---|---|---|---|
| Pre-dev (S16-S20) | ~38 | 4 | 16 | 12 | 5 | 1 | 5 sesiuni (CLOSED ✅) |
| ★ M0 (revised v1.0.1) | ~32 | 2 | 9 | 15 | 6 | 0 | **7-9 sesiuni** (−1 vs v1.0.0 via direct-to-code shift) |
| M1 (8 sub-stages) | ~98 | 6 | 22 | 38 | 28 | 4 | 40-55 sesiuni |
| M2 (8 sub-stages) | ~140 | 4 | 22 | 50 | 50 | 14 | 70-95 sesiuni |
| **TOTAL** | **~308** | **16** | **69** | **115** | **89** | **19** | **~122-164 sesiuni** |

---

## 8. Cross-references

- `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` — §4-§6 source
- `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` — platform tags per task
- ★ `TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` — design system spec NEW M0.S1
- ★ `design/tokens.json` — single source of truth tokens NEW M0.S1
- ★ `apps/web-preview/` — preview Next.js 14 app NEW M0.S1
- `CLAUDE.md` §10b Regula 7 (11 hats) + Regula 8 (Master Plan compliance) + Regula 9 (Platform Matrix compliance)
- `HST_REVYX_pre-dev_findings-backlog_v1.0.0.md` F-S20-04 + F-S20-10 (closure path)

---

## 9. Approval Gate

| Aprobator | Sign-off | Data |
|---|---|---|
| Senior Architect | ✅ (v1.0.0 base) · ⬜ pending v1.0.1 ratify | 2026-06 / — |
| Senior PM | ✅ (v1.0.0 base) · ⬜ pending v1.0.1 ratify | 2026-06 / — |
| Frontend Lead | ⬜ pending v1.0.1 (direct-to-code shift) | — |
| DESIGNER (Creative Director) | ⬜ pending v1.0.1 (initiated shift) | — |
| Audit Lead | ⬜ pending v1.0.1 | — |
| CTO | ✅ (v1.0.0) | 2026-06 |

**Notă v1.0.1:** PATCH ratification cycle se închide la M0.S2 entry. Trio canonical **rămâne** Master Plan v1.1.2 + Platform Matrix v1.0.0 + Detailed Roadmap **v1.0.1** (acest doc).

---

*docs/ROADMAP_REVYX_detailed-execution_v1.0.1.md · v1.0.1 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
