# INDEX — REVYX Document Catalog
<!-- INDEX_REVYX_documents_v1.1.3.md · v1.1.3 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Audit Lead | Initial — retrospectiva tuturor documentelor existente la S12 close |
| 1.0.1 .. 1.0.9 | 2026-05/06/07 | Senior PM + Audit Lead | PATCH-uri Phase 5 (vezi v1.1.1 pentru istoric complet) |
| 1.1.0 | 2026-07 | Senior PM + VP Product + Audit Lead + Solution Architect + CTO + CISO + DPO + CFO | **MINOR — Phase 5 GA close consolidation** + §15 board reports. |
| 1.1.1 | 2026-07 | Audit Lead + Senior PM + 7-rol audit team | **PATCH — Post-S20 HST #2 PASS clean consolidation.** Adăugare HST raport + findings backlog. |
| 1.1.2 | 2026-05 | DESIGNER (Creative Director) + Senior Architect + Frontend Lead + Senior PM + DOC | **PATCH — M0.S1 Design System direct-to-code consolidation.** Adăugare 3 documente noi M0.S1: (★ `docs/tech-spec/TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` — spec design system canonical, închide F-S20-04 component half + F-S20-10 DP-06 brand parity · ★ `design/tokens.json` — single source of truth tokens (color, typography, spacing, radius, shadow, motion, breakpoints, z-index) consumat de tailwind.config + NativeWind future · ★ `design/screens-inventory.md` — 18 screens prioritized per role × module mapping) + adăugare 1 PATCH (★ `docs/ROADMAP_REVYX_detailed-execution_v1.0.1.md` — §3.1 + §3.3 direct-to-code shift; v1.0.0 retrogradat la [HISTORY] partial — în continuare valid pentru §2/§4/§5/§6/§7) + livrare `apps/web-preview/` skeleton (Next.js 14 + Tailwind + 7 page stubs + 6 UI primitives). Cross-ref Trio canonical (Master Plan v1.1.2 + Platform Matrix v1.0.0 + Roadmap v1.0.1 ACTIVE). Backwards compat full cu v1.1.1. Trigger: T-M0.S1-09 + T-M0.S1-10 outputs + Regula 6 INDEX update. |
| **1.1.3** | **2026-05** | ★ FRONTEND WEB DEV + DESIGNER (Creative Director) + ARCHITECT + Senior PM + DOC | ★ **PATCH — M0.S2 ✅ CLOSED Clickable Prototype.** Adăugare 1 PATCH document (★ `docs/ROADMAP_REVYX_detailed-execution_v1.0.2.md` — §3.2 M0.S2 T-M0.S2-01..05 marcate ☑ + status note adăugat în §0; v1.0.1 retrogradat la [HISTORY] — în continuare valid ca referință pentru §3.2 pre-close descriere) + extindere `apps/web-preview/` in-place (3 pages noi: `app/properties/new/`, `app/manager/escalations/`, `app/leads/[id]/` upgrade la client cu Assign modal + LS recompute; `app/deals/page.tsx` rewrite cu click-to-advance + Close-won confirm modal; `components/ui/toast.tsx` global queue + `components/providers.tsx` `<AppProviders/>` în `app/layout.tsx`; button focus ring + active translate). 13 routes prerendered cf. `next build`. Trio canonical actualizat (Master Plan v1.1.2 + Platform Matrix v1.0.0 + Roadmap **v1.0.2** ACTIVE). Backwards compat full cu v1.1.2. Trigger: T-M0.S2-01..05 ☑ + Regula 6 INDEX update + Regula 8 Master Plan §0a sync. |

---

## 1. Convenție

- Toate documentele REVYX sunt listate aici cu **descriere scurtă (≤10 rânduri, target ~5)**.
- La crearea oricărui document nou — **obligatoriu** să se adauge intrare în acest INDEX (CLAUDE.md §10b Regula 6).
- La bump versiune MAJOR/MINOR pentru un document existent — actualizare descrierii.
- Sortare per categorie → alfabetică/cronologică. `★` înaintea numelui = adăugat/actualizat la sesiunea curentă (M0.S2 acum).
- Stil descriere: 5 rânduri în română — (1) ce e · (2) findings/feature · (3) cross-ref · (4) gating · (5) versiune+owner.

---

## 2. Documente foundation (CLAUDE.md + brand)

| Document | Descriere |
|---|---|
| ★ `CLAUDE.md` v1.2.5 | Agent Operating System cheat-sheet pentru Claude Code la fiecare sesiune. §0a Status Execuție LIVE actualizat M0.S1 ✅ CLOSED → ★ **M0.S2 ✅ CLOSED (Clickable Prototype direct-to-code)** → M0.S3 next. Regulile 1-9 active (incl. Regula 9 Platform Matrix compliance). |
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

## 2b. Platform & Detailed Roadmap (Trio canonical, ★ M0.S2 sync)

| Document | Descriere |
|---|---|
| `docs/PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` | NEW S15-bis-3 — **Single source of truth feature × platform mapping**. 15 module + 119 features. §17 statistici (41% Web only, 4% Mobile only, 55% Both). §19 Cross-references **★ ui-design-system row CLOSED M0.S1**. Owner: Senior Architect + PM + PO + Frontend Lead + Mobile Lead + Audit Lead + CTO. |
| `docs/ROADMAP_REVYX_detailed-execution_v1.0.0.md` [HISTORY-partial] | NEW S15-bis-3 — Initial decomposition. Pre-dev + M1 + M2 + critical path rămân valide. M0.S1 + M0.S3 SUPERSEDED de v1.0.1; M0.S2 close-state SUPERSEDED de v1.0.2. |
| `docs/ROADMAP_REVYX_detailed-execution_v1.0.1.md` [HISTORY] | NEW M0.S1 — PATCH direct-to-code shift. §3.1 M0.S1 + §3.3 M0.S3 rebalance. SUPERSEDED de v1.0.2 post-M0.S2 close (M0.S2 marcaje ☑). |
| ★ `docs/ROADMAP_REVYX_detailed-execution_v1.0.2.md` | NEW M0.S2 — **PATCH M0.S2 ✅ CLOSED**. §3.2 T-M0.S2-01..05 marcaje ☑ + status note detaliat per task (livrabile concrete: 3 pages noi în `apps/web-preview/` + ToastProvider + drag-drop reținut M0.S3). §0 trigger note adăugat. Backwards compat full cu v1.0.1 (zero modificări §2/§3.1/§3.3/§4/§5/§6/§7). Versiunea **activă**. Owner: FRONTEND WEB DEV + DESIGNER (Creative Director) + ARCHITECT + Senior PM + DOC. |

---

## 2c. Design System (NEW v1.1.2, M0.S1; ★ v1.1.3 M0.S2 extension)

| Artefact | Descriere |
|---|---|
| ★ `design/tokens.json` v1.0.0 | NEW M0.S1 — **Single source of truth pentru toate tokens UI** (color: navy + gold paletă + status + actor + lead temperature; typography: families + scale; spacing 8px grid; radius; shadow; motion; breakpoints; z-index; component-level token bundles). Sursă: `docs/brand-configs/revyx.md` v1.0.0 canonical. Consumat de `apps/web-preview/tailwind.config.ts` + (future) `apps/mobile/` NativeWind M2.S3. Include `accessibility.verified` cu contrast ratios măsurate WCAG AA. Owner: DESIGNER (Creative Director). |
| ★ `design/screens-inventory.md` v1.0.0 | NEW M0.S1 — **18 screens prioritized per role × module**. AC-M0-01 target ≥12 ecrane satisfied at M0.S3. §3 BR-XX surfacing in UI. §4 user journeys J1-J4 (lead intake, property creation, deal pipeline, manager escalation) — input pentru M0.S2 click-flows. §5 open questions (font OD-01, i18n, mock data scope). Owner: DESIGNER + ARCHITECT. |
| ★ `apps/web-preview/` (skeleton + clickable v0.2) | NEW M0.S1 — Next.js 14 App Router preview app consumând `design/tokens.json`. **★ M0.S2 extension:** 13 routes prerendered (toate M0.S1 + `properties/new` + `manager/escalations`), 4 user journeys J1-J4 end-to-end (Assign modal pe `/leads/[id]`, intake form, click-to-advance + Close-won modal pe `/deals`, bulk reassign pe `/manager/escalations`). Toast queue global (`components/ui/toast.tsx` + `<AppProviders/>`). Button focus ring + active translate. Reusable 1:1 în M0.S3 (mock data 100/50/20 + i18n + drag-drop dnd-kit) + M1.S5 (real API wire-up) + M2.S2 (Web Complete). Owner: FRONTEND WEB DEV + DESIGNER. |

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

> Neschimbat față de v1.1.1. Vezi `INDEX_REVYX_documents_v1.1.1.md` §5-§11 + §15.

---

## 12. Document count summary (★ M0.S2 close, v1.1.3)

| Categorie | Count |
|---|---|
| Foundation (CLAUDE.md + brand) | 2 (CLAUDE.md ★ v1.2.5) |
| Strategic Planning | 4 (MASTER_PLAN v1.0.0 [history] + v1.1.0 [history] + v1.1.1 [history] + v1.1.2 active) |
| Platform & Detailed Roadmap | 4 (★ +1: Roadmap v1.0.2 ACTIVE; v1.0.1 [HISTORY], v1.0.0 [HISTORY-partial]) |
| Design System (§2c) | 3 (tokens.json + screens-inventory + apps/web-preview ★ extended M0.S2) |
| BRD | 2 |
| Tech Specs (Phase 0-4 + Phase 5 + Frontend/Design) | 36 |
| Workflows | 11 |
| Runbooks | 11 |
| Audit + Readiness | 19 |
| CS Playbooks + Checklists | 7 |
| Legal | 7 |
| Test fixtures + Templates | 3 |
| Skills | 5 |
| Board reports + Strategic post-GA §15 | 1 |
| **Total** | **115 documente** (★ +1 vs v1.1.2 = Roadmap v1.0.2 PATCH; CLAUDE.md bump v1.2.4 → v1.2.5 in-place; apps/web-preview extins in-place) |

> **Notă:** documente duplicate prin versiuni listate separat. **Active** post-M0.S2: **~93** (Roadmap v1.0.1 retrogradat la [HISTORY], v1.0.2 active; design system artifacts neschimbat count active).

---

## 13. Maintenance protocol

1. La creare document nou: update obligatoriu categoria corespunzătoare; bump PATCH (sau MINOR la ≥3 docs noi în sesiune SAU GA close consolidation).
2. La bump versiune existent: actualizare descriere; mențin entry vechi (istoric).
3. La deprecare: append `[DEPRECATED]` + cross-ref successor.
4. Refresh manual la fiecare audit checkpoint (S12..S20 = pre-dev; M0.S1 acum, M0.S2+ următoare).
5. Stil descriere: target 5 rânduri română.
6. Post-M0.S1: PATCH bump v1.1.2 a reflectat direct-to-code outputs (3 design artifacts + 1 spec NEW + 1 Roadmap PATCH).
7. ★ Post-M0.S2: PATCH bump v1.1.3 reflectă Clickable Prototype outputs (1 Roadmap PATCH v1.0.2 + CLAUDE.md bump v1.2.5 in-place + apps/web-preview in-place extension).

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

*docs/INDEX_REVYX_documents_v1.1.3.md · v1.1.3 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
