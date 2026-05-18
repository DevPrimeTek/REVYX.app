# INDEX — REVYX Document Catalog
<!-- INDEX_REVYX_documents_v1.1.9.md · v1.1.9 · 2026-05 -->
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
| 1.1.5 | 2026-05 | FRONTEND WEB DEV + DEVOPS + DESIGNER + ARCHITECT + DOC | PATCH — M0.S3 ✅ CLOSED Web Static Demo (in-place semantic upgrade + Regula 10 introdusă). Adăugare Roadmap v1.0.3 + Runbook v1.0.2 + mock data 100/50/20 + i18n RO/RU/EN + drag-drop @dnd-kit + 3 pages noi. 16 routes build PASS. SUPERSEDED de v1.1.6. |
| 1.1.7 | 2026-05 | Senior PM + Senior Architect + DESIGNER (Creative Director) + DOC | PATCH — 4 reguli operaționale noi (Regulile 11-14) introduse în CLAUDE.md §10b post-PM feedback design+layout. Schimbări: (a) CLAUDE.md bump v1.2.9 → v1.2.10 cu ★ Regula 11 (Puritate i18n RO/RU/EN fără anglicisme când există echivalent autohton; lista exception acronime tehnice; OD-i18n-01 pending PM scoring glossary) + ★ Regula 12 (Disciplina interacțiunilor layout — static stays static, dynamic responds; pattern audit `:hover` pe `cursor: pointer/grab`; finding MED la violare) + ★ Regula 13 (In-app tutorial / onboarding — `<TutorialOverlay screenId="...">` componentă reutilizabilă, conținut localizat per pagină, update protocol obligatoriu, implementare task M0.S5+/M1.S5) + ★ Regula 14 (Verificare overlap layout — manual smoke test 3 viewport-uri 1920×1080/1440×900/1024×768, visual regression Playwright sugerat M1.S5+, finding HIGH la overlap depistat post-merge). (b) §0a Status Execuție LIVE actualizat — M0.S5 next va include audit checkpoints pe Regulile 11-14; DESIGNER (Creative Director) adăugat la hats activi M0.S5 ca mandatory pentru Regulile 12+14. (c) NU schimbări pe documente design system / marketing existente — Reguli 11-14 sunt forward-applying. Backwards compat full cu v1.1.6. Trigger: PM message "Inca reguli importante legata de design si layout" post-M0.S4 merge PR #29. |
| **1.1.9** | **2026-05** | ★ BACKEND DEV (P) + Senior Security Auditor (P) + Senior DBA (S) + Senior Solution Architect (S) + DOC + Senior PM | ★ **PATCH — M1.S1 ✅ CLOSED Phase 0 Security Foundation livrată.** Adăugări: (a) NEW `docs/tech-spec/TECH_SPEC_REVYX_phase0-security_v1.0.0.md` — spec arhitectural 20 secțiuni cu stack NestJS+Drizzle+PostgreSQL+Redis + data model 6 entități + API contracts + JWT RS256 + RBAC + AUDIT_LOG append-only enforcement + HMAC + rate limit + OWASP Top 10 + sign-off 5-rol. (b) NEW DIR `apps/api/` — NestJS 10 scaffold cu 22 source TS files (auth/rbac/audit/webhooks/gdpr/health/common/config/db modules + main.ts + app.module.ts) + 6 migrations SQL idempotente (0001-0006: tenants/users-enum-role/refresh_tokens/audit_log+trigger/gdpr_consents/webhook_signatures) + Drizzle schema TS + Vitest config + ESLint config + drizzle-kit config + .env.example + README. (c) NEW `docs/legal/PRIVACY_POLICY_REVYX_v0.1.0.md` + `docs/legal/COOKIE_POLICY_REVYX_v0.1.0.md` — DRAFTS legal review pending (8 OD-legal/cookie-XX tracked). (d) NEW `.github/workflows/api-ci.yml` — typecheck+lint+test+build paralel pe `apps/api/**`. (e) NEW PATCH `docs/ROADMAP_REVYX_detailed-execution_v1.0.6.md` — §4.1 M1.S1 expandat cu T-M1.S1-01..09 marcaje ☑. v1.0.5 retrogradat la [HISTORY]. CLAUDE.md bump v1.2.11 → **v1.2.12**. Master Plan §0 sync M1.S1 ☑. **Phase 0 BLOCANT lifted → M1.S2 entry UNBLOCKED**. Tests primary: typecheck PASS + lint PASS + test 12/12 PASS + build PASS. Trio canonical: Master Plan v1.1.2 + Platform Matrix v1.0.0 + Roadmap **v1.0.6** ACTIVE. Backwards compat full cu v1.1.8. Trigger: M1.S1 sesiune output T-M1.S1-01..09 ☑ + Regula 6 INDEX update + Regula 8 Master Plan §0 sync. |
| 1.1.8 | 2026-05 | Audit Lead (P) + Senior Architect (S) + DESIGNER (S, Creative Director) + QA / Test Architect (S) + Senior Product/Compliance/Security Auditor (S) + DOC + Senior PM | PATCH — M0.S5 ✅ CLOSED Hard Stress Test M0 EXIT GATE atins. Adăugări (2 documente noi în `docs/audit/`): (a) NEW `docs/audit/HST_REVYX_m0_v1.0.0.md` — raport HST principal cu 9 categorii audit (§2.1 UX flow J1-J4 + §2.2 brand compliance + §2.3 presentation rehearsal + §2.4 message clarity + §2.5 demo robustness + §2.6 Regula 11 i18n + §2.7 Regula 12 interactions + §2.8 Regula 13 tutorial coverage gap + §2.9 Regula 14 overlap viewport audit) + §3 findings register consolidat 17 findings (0 CRIT + 2 HIGH ✅ FIXED acest PR + 6 MED + 9 LOW) + §4 closure plan + §5 sign-off 8/8 (Audit Lead + 7-rol auditors + Senior PM + DESIGNER Creative Director mandatory) + §6 next steps M1.S1 entry + §7 cross-refs. T-M0.S5-01 ☑. (b) NEW `docs/audit/HST_REVYX_m0_findings-backlog_v1.0.0.md` — detailed findings F-M0S5-01..17 cu repro steps + cauză + fix code diff + verification + cross-ref per finding. T-M0.S5-02 ☑. (c) NEW PATCH `docs/ROADMAP_REVYX_detailed-execution_v1.0.5.md` — §3.5 M0.S5 T-M0.S5-01..04 ☑ + T-M0.S5-05 ◐ deferred M1.S5 (TutorialOverlay POC). v1.0.4 retrogradat la [HISTORY]. (d) FIX-uri immediate aplicate în acest PR: `apps/web-preview/components/ui/card.tsx` — F-M0S5-01 HIGH Regula 12 `interactive` prop opt-in (backward compatible); `apps/web-preview/messages/{ro,ru}.json` — F-M0S5-02 HIGH Regula 11 (30 keys RO + 14 keys RU retraduse: Dashboard→Panou de bord; Sign out→Deconectare; Queue→Listă; Match needs review→Potrivire necesită revizuire; Won→Câștigat/Выигр.; Discovery→Descoperire/Поиск; healthy/review/risk → sănătos/de revizuit/risc; Fresh/Aging/Stale→Proaspăt/Învechire/Vechi; etc — excepții acronime EN păstrate LS/PS/IS/DP/NBA/DHI/APS/SLA/GDPR/RBAC/HOT/audit-log/lead-uri/WhatsApp). Tests primary post-fix: typecheck PASS + lint PASS (1 warning pre-existing F-M0S5-10) + build PASS 15+1 routes. Trio canonical: Master Plan v1.1.2 + Platform Matrix v1.0.0 + Roadmap **v1.0.5** ACTIVE. CLAUDE.md bump v1.2.10 → **v1.2.11**. Backwards compat full cu v1.1.7. Trigger: M0.S5 sesiune output T-M0.S5-01..04 ☑ + Regula 6 INDEX update + Regula 8 Master Plan §0 sync. **M0 EXIT GATE ATINS → M1.S1 Phase 0 Security Foundation entry UNBLOCKED**. |
| 1.1.6 | 2026-05 | DOC (P) + DESIGNER (S, Creative Director) + ARCHITECT (S, a11y captions) + Senior PM | PATCH — M0.S4 ✅ CLOSED Pitch Deck + Video Walkthrough. Adăugări (6 documente noi în `docs/marketing/`): (a) NEW DIR `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/` cu 5 fișiere — `README.md` (index + structură 16 slides + visual specs export aspect 16:9), `deck-ro.md` (canonical RO cu speaker notes inline per slide), `deck-ru.md` (translation RU), `deck-en.md` (translation EN), `assets/SCREENSHOT_REFS.md` (mapping slide → screenshot). T-M0.S4-01..05 ☑. (b) NEW `docs/marketing/VIDEO_SCRIPT_REVYX_M0_v1.0.0.md` — 8 scene storyboard cu durată 5:00 (Intro 25s · Login+Dashboard 35s · Lead queue 45s · Lead detail 45s · Property+match 35s · Deal pipeline 45s · Manager command 35s · i18n+closing 35s) + VO RO/RU/EN sincronizat + production checklist (mic specs + tempo) + SRT generation. T-M0.S4-05 ☑. (c) NEW `docs/marketing/SCREENSHOT_CHECKLIST_REVYX_M0_v1.0.0.md` — 18 screens × 3 locale capture procedura (7 mandatory × 2 locale = 14 PNG mandatory pentru deck export), manual + Playwright script propus reproducible, cookie locale via `localStorage.setItem('revyx.locale', ...)`. T-M0.S4-07 ☑. (d) NEW PATCH `docs/ROADMAP_REVYX_detailed-execution_v1.0.4.md` — §3.4 T-M0.S4-01..05 + T-M0.S4-07 marcate ☑ (T-M0.S4-06 recording + T-M0.S4-08 PDF export rămân ◐ tracked separat). 4 OD-M0.S4-XX tracked (cifră invest · URL demo · logo asset · echipa fondatori). Trio canonical: Master Plan v1.1.2 + Platform Matrix v1.0.0 + Roadmap **v1.0.4** ACTIVE. Backwards compat full cu v1.1.5 (zero modificări pe documente foundation/strategic/platform-matrix). Trigger: T-M0.S4-01..05 + T-M0.S4-07 outputs + Regula 6 INDEX update + Regula 8 Master Plan §0a sync + Regula 9 Platform Matrix tag (WEB only deck). |

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

## 2b. Platform & Detailed Roadmap (Trio canonical, ★ M0.S4 sync)

| Document | Descriere |
|---|---|
| `docs/PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` | NEW S15-bis-3 — **Single source of truth feature × platform mapping**. 15 module + 119 features. §17 statistici (41% Web only, 4% Mobile only, 55% Both). §19 Cross-references **★ ui-design-system row CLOSED M0.S1**. Owner: Senior Architect + PM + PO + Frontend Lead + Mobile Lead + Audit Lead + CTO. |
| `docs/ROADMAP_REVYX_detailed-execution_v1.0.0.md` [HISTORY-partial] | NEW S15-bis-3 — Initial decomposition. Pre-dev + M1 + M2 + critical path rămân valide. M0.S1 + M0.S3 SUPERSEDED de v1.0.1; M0.S2 close-state SUPERSEDED de v1.0.2. |
| `docs/ROADMAP_REVYX_detailed-execution_v1.0.1.md` [HISTORY] | NEW M0.S1 — PATCH direct-to-code shift. §3.1 M0.S1 + §3.3 M0.S3 rebalance. SUPERSEDED de v1.0.2. |
| `docs/ROADMAP_REVYX_detailed-execution_v1.0.2.md` [HISTORY] | NEW M0.S2 — PATCH M0.S2 ✅ CLOSED. §3.2 T-M0.S2-01..05 marcaje ☑. SUPERSEDED de v1.0.3 post-M0.S3 close. |
| `docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md` [HISTORY] | NEW M0.S3 — PATCH M0.S3 ✅ CLOSED. §3.3 T-M0.S3-01..13 ☑ + Regula 10 contextualizat. SUPERSEDED de v1.0.4 post-M0.S4 close. |
| ★ `docs/ROADMAP_REVYX_detailed-execution_v1.0.4.md` | NEW M0.S4 — **PATCH M0.S4 ✅ CLOSED**. §3.4 T-M0.S4-01..05 + T-M0.S4-07 marcaje ☑ (T-M0.S4-06 recording fizic + T-M0.S4-08 PDF export rămân ◐ deferred — depind de DNS T-M0.S3-14 + OD-M0.S4-01..04 PM input). Output 6 documente noi în `docs/marketing/` (pitch deck × 3 limbi + video script + screenshot checklist + screenshot refs mapping). 4 OD-M0.S4-XX tracked. Backwards compat full cu v1.0.3. Versiunea **activă**. Owner: DOC (P) + DESIGNER (Creative Director, S) + ARCHITECT (a11y captions, S) + Senior PM. |

---

## 2c. Design System (NEW v1.1.2, M0.S1; ★ v1.1.5 M0.S3 promote)

| Artefact | Descriere |
|---|---|
| `design/tokens.json` v1.0.0 | NEW M0.S1 — **Single source of truth pentru toate tokens UI** (color: navy + gold paletă + status + actor + lead temperature; typography: families + scale; spacing 8px grid; radius; shadow; motion; breakpoints; z-index; component-level token bundles). Sursă: `docs/brand-configs/revyx.md` v1.0.0 canonical. Consumat de `apps/web-preview/tailwind.config.ts` + (future) `apps/mobile/` NativeWind M2.S3. Include `accessibility.verified` cu contrast ratios măsurate WCAG AA. Owner: DESIGNER (Creative Director). |
| `design/screens-inventory.md` v1.0.0 | NEW M0.S1 — **18 screens prioritized per role × module**. AC-M0-01 target ≥12 ecrane satisfied at M0.S3 (15 routes static + 1 dynamic). §3 BR-XX surfacing in UI. §4 user journeys J1-J4. §5 open questions. Owner: DESIGNER + ARCHITECT. |
| ★ `apps/web-preview/` (M0.S3 demo, promoted from `apps/web-preview/`) | ★ M0.S3 PROMOTE — Next.js 14 App Router demo app consumând `design/tokens.json`. **Status M0.S3:** 16 routes (`/`, `/login`, `/dashboard`, `/leads`, `/leads/[id]`, `/properties`, `/properties/new`, `/deals`, `/manager`, `/manager/escalations`, `/admin`, `/settings` ★, `/profile` ★, `/notifications` ★, `_not-found`). Mock data deterministic (100 leads + 50 properties + 20 deals + 8 agents). i18n custom React context cu `useT()` hook + RO/RU/EN catalogs (`messages/{ro,ru,en}.json` ~120 keys each) + localStorage persistence (`revyx.locale`). Drag-drop @dnd-kit pe `/deals` cu click-to-advance a11y fallback permanent. `next build` PASS 16 routes (15 static + 1 dynamic). Reusable 1:1 în M1.S5 (real API wire-up) + M2.S2 (Web Complete). Owner: FRONTEND WEB DEV + DESIGNER + DEVOPS. |
| ★ `apps/web-preview/lib/mock/` | NEW M0.S3 — Mock data factories deterministe. `rng.ts` xmur3 hash seeder + sfc32 PRNG (~0.5KB, public-domain). `types.ts` TypeScript schemas (Lead, Property, Deal, Agent). `agents.ts` 8 records. `leads.ts` factory cu LS distribution HOT 12% / qualified 22% / warm 36% / nurturing 30% + BR-01 firewall enforcement (agent assignment doar peste 0.60). `properties.ts` factory 50 records mixed apartament/casă/teren/comercial cu PS+LF derivat din `daysOnMarket`. `deals.ts` 20 records distribuiți peste 6 stages cu BR-10 TF_default applied. Owner: FRONTEND WEB DEV. |
| ★ `apps/web-preview/messages/` | NEW M0.S3 — i18n catalogs RO + RU + EN (~120 keys/limbă). Secțiuni: nav, common, lead, leadDetail, property, deal, dashboard, manager, admin, login, settings, profile, notifications. `{var}` interpolation support. Owner: FRONTEND WEB DEV + DOC. |
| ★ `apps/web-preview/components/i18n/provider.tsx` | NEW M0.S3 — i18n React context provider. `useT()` hook returnează `{locale, setLocale, messages, t(key, vars?)}`. Dot-path key resolution. RO fallback automat la missing key. Persistare localStorage. SSR-safe (default RO la initial render, hydrates stored locale). Owner: FRONTEND WEB DEV. |
| ★ `apps/web-preview/components/deals/kanban-board.tsx` | NEW M0.S3 — @dnd-kit drag-drop kanban. DealCard cu draggable handle `⋮⋮` (separat de click-to-advance). StageColumn droppable cu visual feedback `isOver`. DragOverlay cu rotire +1° + ring gold. PointerSensor activation distance 6 (anti-tap). KeyboardSensor enabled. Owner: FRONTEND WEB DEV. |

---

## 2f. Backend API + Phase 0 Security (★ NEW v1.1.9, M1.S1)

| Artefact | Descriere |
|---|---|
| ★ `docs/tech-spec/TECH_SPEC_REVYX_phase0-security_v1.0.0.md` | NEW M1.S1 — **Spec arhitectural Phase 0 Security Foundation, blocant pre-M1.S2.** 20 secțiuni: §0 Stage M1.S1 + §0.1 Platform Matrix backend-only + §1 exec summary 7 items checklist + §2 architecture overview NestJS+Fastify+Drizzle+PostgreSQL+Redis + §3 stack & deps + §4 data model (6 entități: tenants, users cu enum 5 roles, refresh_tokens, audit_log, gdpr_consents, webhook_signatures) + §4.2 append-only enforcement BR-07 + §5 API contracts (auth + GDPR + webhooks + admin + health) + §6 JWT RS256 cu refresh rotation + §7 RBAC implementation + §8 AUDIT_LOG middleware + §9 webhook HMAC + §10 rate limit NFR-05/06/07 + §11 error catalog + §12 OWASP Top 10 coverage + §13 observability + §14 perf budgets + §15 testing + §16 deployment + §17 migration strategy 0001-0006 + §18 risks + §19 impact assessment + sign-off 5-rol. Owner: BACKEND DEV + SECURITY + DBA + ARCHITECT + DOC. |
| ★ `apps/api/` (M1.S1 backend scaffold) | NEW M1.S1 — **NestJS 10 + Fastify adapter + Drizzle ORM + TypeScript strict.** 22 source files (`src/{auth,rbac,audit,webhooks,gdpr,health,common,config,db}/`). Migrations SQL 0001-0006 cu trigger BD `audit_log_block_modify` (BR-07 append-only enforce defense-in-depth + REVOKE rol app). Modules: AuthModule (JWT RS256 via `jose` + Argon2id `@node-rs/argon2` + refresh rotation cu replay detection prin `rotated_at` + `parent_token_id` chain + BR-12 single session revoke); RBAC (Role enum aditiv + decorator `@Roles` + RolesGuard global APP_GUARD); AuditModule (Service insert audit_log + Interceptor global APP_INTERCEPTOR cu decorator `@AuditEvent` + ad-hoc `req.auditEvent` pattern); Webhooks (HmacGuard timing-safe SHA-256 + UNIQUE replay dedup); GDPR (4 endpoints Art. 15/17/18/20 + audit decorator); ThrottlerModule NFR-05/06; ConfigModule cu Zod env validation. Tests 12/12 PASS (RBAC + HMAC + Auth DTO Zod). CI: `.github/workflows/api-ci.yml`. Owner: BACKEND DEV + SECURITY + DBA. |

---

## 2e. Audit M0.S5 (★ NEW v1.1.8, M0.S5)

| Document | Descriere |
|---|---|
| ★ `docs/audit/HST_REVYX_m0_v1.0.0.md` | NEW M0.S5 — **HST M0 EXIT GATE raport principal cu 9 categorii audit.** §0 Stage + §0.1 Platform Matrix WEB only + §1 scope + §2.1 UX flow J1-J4 (14 routes navigable end-to-end) + §2.2 brand compliance (paletă + typography aliniat brand-config) + §2.3 presentation rehearsal (deck 14:30 fit target) + §2.4 message clarity (slide ↔ BRD §5 piloni 100%) + §2.5 demo robustness (typecheck/lint/build PASS) + §2.6 Regula 11 i18n (30 RO + 14 RU keys retraduse) + §2.7 Regula 12 interactions (Card hover global FIXED) + §2.8 Regula 13 tutorial gap analysis (13/13 pagini deferred M1.S5) + §2.9 Regula 14 overlap viewport (3 viewport × 14 pagini PASS) + §3 findings register 17 (0 CRIT + 2 HIGH ✅ FIXED + 6 MED + 9 LOW) + §4 closure plan AC-M0-01..07 toate ☑ + §5 sign-off 8/8 + §6 next steps M1.S1 entry + §7 cross-refs. **M0 EXIT GATE atins.** Owner: Audit Lead + 7-rol auditori + DESIGNER (Creative Director) + Senior PM. |
| ★ `docs/audit/HST_REVYX_m0_findings-backlog_v1.0.0.md` | NEW M0.S5 — **Detailed findings F-M0S5-01..17** cu repro steps + cauză + fix code diff + verification + cross-ref per finding. 2 HIGH FIXED acest PR cu detail diff (F-M0S5-01 Card interactive prop + F-M0S5-02 i18n RO/RU 44 keys table before/after). 6 MED + 9 LOW backlog cu owner+ETA M1.S2/M1.S5/M1.S5+ entry. §2 closure summary tabel + §3 cross-references. Owner: Audit Lead + DOC. |

---

## 2d. Marketing & Pitch (★ NEW v1.1.6, M0.S4)

| Document | Descriere |
|---|---|
| ★ `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/README.md` | NEW M0.S4 — **Index pitch deck + structură 16 slides**. §1 scop (investitori seed/pre-seed + pilot clients RM + parteneri tech). §2 tabel structură slide-by-slide (Hook 1 · Problem 2 · Solution 3 · Market 4 · Product overview 5 · 4 demo slides 6-9 · Tech 10 · Trust 11 · Business 12 · Roadmap 13 · Team 14 · Ask 15 · Close 16) cu speaker time alocat (total ~14:30 + 5 min Q&A). §3 fișiere RO/RU/EN livrate. §4 visual specs aspect 16:9 1920×1080 + paletă brand. §5 4 OD-M0.S4-XX (cifră invest · URL demo · logo asset · echipa). Owner: DOC + DESIGNER + ARCHITECT + Senior PM. |
| ★ `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/deck-ro.md` | NEW M0.S4 — **Pitch deck canonical RO + speaker notes inline per slide**. 16 slides cu durată target (Cover 30s · Problem 60s · Solution 60s · Market 45s · 5 Piloni 60s · J1 75s · J2 60s · J3 75s · J4 60s · Arhitectură 45s · Securitate 45s · Business 60s · Roadmap 60s · Tracțiune 45s · Ask 45s · Close 30s). Pillar content sourced din BRD §5 + §6 BR-XX; brand applied via revyx.md (navy + gold + Bebas Neue + Montserrat). Anexă A visual specs export. Closes T-M0.S4-02 + T-M0.S4-05. Owner: DOC + Senior PM. |
| ★ `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/deck-ru.md` | NEW M0.S4 — **Pitch deck translation RU**. 16 slides RU echivalente canonicului RO (același visual + structură + cifre); speaker notes RO sunt singura asimetrie — RU/EN au doar slide content. Closes T-M0.S4-03. Owner: DOC. |
| ★ `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/deck-en.md` | NEW M0.S4 — **Pitch deck translation EN**. 16 slides EN echivalente. Variabile localizate (€ instead of EUR Romanian style; date format ISO; SaaS pricing direct €). Closes T-M0.S4-04. Owner: DOC. |
| ★ `docs/marketing/PITCH_DECK_REVYX_M0_v1.0.0/assets/SCREENSHOT_REFS.md` | NEW M0.S4 — Mapping slide → screen capture (slide 06 J1 = `/leads` + `/leads/L-0012` × 2 locale; slide 07 J2 = `/properties` + `/properties/new`; slide 08 J3 = `/deals` kanban; slide 09 J4 = `/manager` + `/manager/escalations`). 7 mandatory screens identificate. Cross-ref SCREENSHOT_CHECKLIST_REVYX_M0_v1.0.0.md. Owner: DESIGNER + DOC. |
| ★ `docs/marketing/VIDEO_SCRIPT_REVYX_M0_v1.0.0.md` | NEW M0.S4 — **Video walkthrough script + storyboard 8 scene × 5:00 durată**. §2 fiecare scenă cu (a) visual timing ± 5s · (b) on-screen actions URL exact · (c) VO RO/RU/EN sincronizat. §3 timing summary table. §4 production checklist (mic specs + tempo RO 150wpm / RU 140wpm / EN 160wpm). §5 SRT generation prin Whisper + manual review. §6 self-check AC-M0-03 (≤5min + 2 versiuni VO). T-M0.S4-05 ☑ (script). T-M0.S4-06 (recording fizic) deferred post-DNS demo.revyx.app. Cross-ref VIDEO_SCRIPT ↔ deck-ro.md slides 6-9 = scenes 3-7. Owner: DOC + ARCHITECT + DESIGNER. |
| ★ `docs/marketing/SCREENSHOT_CHECKLIST_REVYX_M0_v1.0.0.md` | NEW M0.S4 — **Screenshot capture checklist 18 screens × 3 locale**. §1 pre-flight (npm run dev local + locale via `localStorage.setItem('revyx.locale', ...)`). §2.2 7 mandatory captures pentru deck (× 2 locale RO+EN = 14 PNG mandatory). §2.3 15 optional pentru extensii. §3 Playwright automation script propus reproducible (cu `scripts/capture-screenshots.ts` example code). §5 gating check pentru deck render (brand compliance + i18n verify + no debug overlay). T-M0.S4-07 ☑. Cross-ref `design/screens-inventory.md` + `apps/web-preview/app/`. Owner: DESIGNER + FRONTEND WEB DEV + DOC. |

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
| `.github/workflows/web-preview-ci.yml` | M0 — CI build gate paralel; rulează `npm ci → typecheck → next build` la fiecare PR cu modificări în `apps/web-preview/**` sau `design/tokens.json`. Node 22 + npm cache pe `apps/web-preview/package-lock.json`. Path NESCHIMBAT M0.S3 (Regula 10 deploy-stability). Owner: DEVOPS + FRONTEND WEB DEV. |
| ★ `apps/web-preview/.eslintrc.json` | NEW M0.S3 — ESLint config non-interactive (`extends: next/core-web-vitals`) pentru `npm run lint` în CI fără TTY prompt. Owner: FRONTEND WEB DEV. |
| ★ `apps/web-preview/vercel.json` (moved from `apps/web-preview/vercel.json`) | M0.S3 — Vercel project config: framework Next.js, region `fra1`, 4 security headers default (X-Frame-Options DENY + nosniff + Referrer-Policy + Permissions-Policy). Owner: DEVOPS. |

---

## 12. Document count summary (★ M1.S1 close, v1.1.9)

| Categorie | Count |
|---|---|
| Foundation (CLAUDE.md + brand) | 2 (CLAUDE.md ★ v1.2.12) |
| Strategic Planning | 4 (MASTER_PLAN v1.0.0 [history] + v1.1.0 [history] + v1.1.1 [history] + v1.1.2 active) |
| Platform & Detailed Roadmap | 8 (Roadmap ★ v1.0.6 ACTIVE; v1.0.5/v1.0.4/v1.0.3/v1.0.2/v1.0.1 [HISTORY], v1.0.0 [HISTORY-partial]) |
| Design System (§2c) | 7 (tokens.json + screens-inventory + apps/web-preview/ + apps/web-preview/lib/mock/ + apps/web-preview/messages/ + apps/web-preview/components/i18n/ + apps/web-preview/components/deals/) |
| Marketing & Pitch (§2d) | 7 (deck README + deck-ro + deck-ru + deck-en + assets/SCREENSHOT_REFS + VIDEO_SCRIPT + SCREENSHOT_CHECKLIST) |
| Audit M0.S5 (§2e) | 2 (HST_REVYX_m0 + HST_REVYX_m0_findings-backlog) |
| ★ Backend API + Phase 0 (§2f) | 2 (★ TECH_SPEC_REVYX_phase0-security + ★ apps/api/) |
| BRD | 2 |
| Tech Specs (Phase 0-4 + Phase 5 + Frontend/Design + ★ Phase 0 Security) | 37 |
| Workflows | 11 |
| Runbooks | 13 |
| Audit + Readiness | 21 |
| CS Playbooks + Checklists | 7 |
| Legal | 9 (★ +2 Privacy Policy v0.1.0 DRAFT + Cookie Policy v0.1.0 DRAFT) |
| Test fixtures + Templates | 3 |
| Skills | 5 |
| Board reports + Strategic post-GA §15 | 1 |
| **Total** | **136 documente** (★ +5 vs v1.1.8 = Roadmap v1.0.6 PATCH + TECH_SPEC phase0-security + apps/api/ + Privacy Policy v0.1.0 DRAFT + Cookie Policy v0.1.0 DRAFT; CLAUDE.md bump v1.2.11 → v1.2.12 in-place). |

> **Notă:** documente duplicate prin versiuni listate separat. **Active** post-M1.S1: **~114** (+1 Roadmap +1 TECH_SPEC +1 apps/api/ +2 legal drafts vs M0.S5).

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
9. Post-M0.S3 close: PATCH bump v1.1.5 reflectă Web Static Demo livrat (Roadmap v1.0.3 + Runbook v1.0.2 + apps/web-preview/ in-place + 5 §2c artefacte mock/i18n/dnd-kit + CLAUDE.md bump v1.2.8).
10. Post-M0.S4 close: PATCH bump v1.1.6 reflectă Pitch Deck + Video Script livrate (Roadmap v1.0.4 + 6 §2d artefacte marketing + CLAUDE.md bump v1.2.9).
11. Post-PM design+layout feedback: PATCH bump v1.1.7 reflectă 4 reguli operaționale noi (Regulile 11-14) introduse în CLAUDE.md §10b — i18n puritate + disciplina interacțiuni + in-app tutorial + verificare overlap layout. CLAUDE.md bump v1.2.10. NU schimbări pe documentele existente — reguli forward-applying la HST M0 + M1.S5+.
12. Post-M0.S5 close: PATCH bump v1.1.8 reflectă Hard Stress Test M0 EXIT GATE atins (Roadmap v1.0.5 + 2 §2e artefacte audit + CLAUDE.md bump v1.2.11). Fix-uri imediate aplicate `apps/web-preview/` pentru F-M0S5-01 (Card interactive prop) + F-M0S5-02 (i18n RO/RU 44 keys). Master Plan §0 sync. M1.S1 entry UNBLOCKED.
13. ★ Post-M1.S1 close: PATCH bump v1.1.9 reflectă Phase 0 Security Foundation livrată (Roadmap v1.0.6 + NEW §2f Backend API cu TECH_SPEC phase0-security v1.0.0 + apps/api/ NestJS scaffold cu 6 migrations + JWT RS256 + RBAC + AUDIT_LOG append-only + HMAC + GDPR + Throttler + 12/12 tests PASS + CI workflow api-ci.yml + Privacy/Cookie Policy DRAFTS v0.1.0). CLAUDE.md bump v1.2.12. Master Plan §0 sync. **Phase 0 BLOCANT lifted → M1.S2 entry UNBLOCKED**.

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

*docs/INDEX_REVYX_documents_v1.1.7.md · v1.1.7 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
