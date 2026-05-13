# DETAILED ROADMAP — REVYX Execution Tasks Decomposition
<!-- ROADMAP_REVYX_detailed-execution_v1.0.0.md · v1.0.0 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** Pre-dev → M0 → M1 → M2 (toate sub-stages)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md` §4-§6
**Trigger:** PM cerere — vizibilitate granulară task-uri atomice cu dependențe pentru planning Claude Code execution sessions.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-06 | ★ Senior Architect + Senior PM + Senior PO | INITIAL — descompune Master Plan v1.1.0 sub-stages în atomic tasks (T-XXX) cu owner hat, effort estimate (XS/S/M/L/XL), dependencies (DEP), output deliverable, platform tag (🌐 Web / 📱 Mobile / 🔁 Both / N/A backend). Acoperă 5 stages Pre-dev (S16-S20) + 5 stages M0 + 8 stages M1 + 8 stages M2 = **26 sub-stages × ~10-20 atomic tasks each ≈ ~340 tasks total**. Cross-ref Platform Matrix v1.0.0 pentru feature × platform mapping. Critical Path Analysis §28 cu top dependencies blocking. |

---

## 1. Filozofie Detailed Roadmap

| Aspect | Definiție |
|---|---|
| **Atomic task (T-XXX)** | Unit minim de lucru autonom; produce un output verificabil |
| **Effort estimate** | XS (≤2h) · S (2-4h) · M (4-8h) · L (8-16h) · XL (16-32h) |
| **Owner hat** | Unul din 11 hats (vezi Master Plan §2.2); maximum 2 hats co-active |
| **Dependencies (DEP)** | Lista task-uri prerequisite (T-YYY); blocking dacă neînchise |
| **Platform tag** | 🌐 Web · 📱 Mobile · 🔁 Both · 🔧 Backend (no UI) · 📋 Doc/Plan |
| **Output deliverable** | Fișier(e) creat(e)/modificat(e) sau livrabil concret |
| **Sesiune Claude estimată** | Atomic task ≈ 1 sesiune productivă pe Pro plan (~3-4h efectiv) |

### 1.1 Reguli planning task

1. Niciun task NU începe înainte ca toate DEP să fie ☑.
2. Tasks XL trebuie split în sub-tasks dacă posibil (preferat L max).
3. Hats specificate per task = activate la inceput sesiune Claude Code.
4. Output deliverable verificat în PR review înainte de close task.
5. Critical Path tasks (§28) au prioritate absolută — orice slack acolo blochează totul.

---

## 2. Pre-development (S16-S20) — Documentation Closure

**Scope:** Închidere documentație Phase 5 + Hard Stress Test #2.
**Hats activate:** DOC, ARCHITECT, SECURITY, TESTER

### 2.1 S16 — Stage 3 audit + Stage 4 entry

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-S16-01 | Audit Stage 3 ML Pricing exit gates (6 metrici) | DOC | M | — | 📋 | `AUDIT_REVYX_s15-external-pass.md` |
| T-S16-02 | Bias monitoring report (28 zile) | DOC | S | — | 📋 | section în AUDIT |
| T-S16-03 | Stage 4 Churn entry gates check | DOC | S | T-S16-01 | 📋 | section în AUDIT |
| T-S16-04 | Runbook Stage 4 Churn pilot day-by-day | DOC | L | T-S16-03 | 📋 | `RUNBOOK_REVYX_stage4-churn-launch.md` |
| T-S16-05 | READINESS v1.0.4 PATCH | DOC | S | T-S16-01..04 | 📋 | `READINESS_REVYX_phase5_v1.0.4.md` |
| T-S16-06 | mobile-rn v1.0.1 PATCH (F-S13-01 deep-link) | DOC + ARCHITECT | M | — | 📱 | `TECH_SPEC_REVYX_mobile-rn_v1.0.1.md` |
| T-S16-07 | INDEX v1.0.7 update | DOC | S | T-S16-01..06 | 📋 | `INDEX_REVYX_documents_v1.0.7.md` |
| T-S16-08 | CLAUDE.md §0a status update | DOC | XS | T-S16-07 | 📋 | `CLAUDE.md` |

### 2.2 S17 — Stage 4 audit + Stage 5 entry

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-S17-01 | Audit Stage 4 Churn pilot exit (Prevention Rate) | DOC | M | T-S16-05 closed | 📋 | `AUDIT_REVYX_s16-external-pass.md` |
| T-S17-02 | Stage 5 White-Label entry gates | DOC | S | T-S17-01 | 📋 | section AUDIT |
| T-S17-03 | Runbook Stage 5 White-Label launch | DOC | L | T-S17-02 | 📋 | `RUNBOOK_REVYX_stage5-white-label-launch.md` |
| T-S17-04 | DKIM rotation runbook v1.0.1 PATCH | DOC | S | — | 🔧 | `RUNBOOK_REVYX_dkim-rotation_v1.0.1.md` |
| T-S17-05 | READINESS v1.0.5 PATCH | DOC | S | T-S17-01..04 | 📋 | `READINESS_REVYX_phase5_v1.0.5.md` |
| T-S17-06 | INDEX v1.0.8 update | DOC | S | T-S17-01..05 | 📋 | `INDEX_REVYX_documents_v1.0.8.md` |

### 2.3 S18 — Stage 5 audit + GA prep

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-S18-01 | Audit Stage 5 White-Label exit | DOC | M | T-S17-05 | 📋 | `AUDIT_REVYX_s17-external-pass.md` |
| T-S18-02 | BSI Group MD DPA status check | DOC | S | — | 📋 | section AUDIT |
| T-S18-03 | DPIA v1.0.1 PATCH (F-S14-04 verbiage) | DOC | S | — | 📋 | `DPIA_REVYX_phase5_v1.0.1.md` |
| T-S18-04 | SCC v1.0.2 PATCH (BSI signed if available) | DOC | S | T-S18-02 | 📋 | `SCC_VENDORS_phase5_v1.0.2.md` |
| T-S18-05 | READINESS v1.1.0 MINOR (GA close) | DOC | M | T-S18-01..04 | 📋 | `READINESS_REVYX_phase5_v1.1.0.md` |
| T-S18-06 | INDEX v1.0.9 update | DOC | S | T-S18-01..05 | 📋 | `INDEX_REVYX_documents_v1.0.9.md` |

### 2.4 S19 — Final doc closure

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-S19-01 | Raport final board Phase 5 GA decision | DOC + ARCHITECT | L | T-S18-05 | 📋 | `BOARD_REPORT_REVYX_phase5-ga-decision.md` |
| T-S19-02 | INDEX v1.1.0 MINOR (Phase 5 close) | DOC | M | T-S19-01 | 📋 | `INDEX_REVYX_documents_v1.1.0.md` |
| T-S19-03 | CLAUDE.md §0a transition Pre-dev → S20 ready | DOC | XS | T-S19-02 | 📋 | `CLAUDE.md` |
| T-S19-04 | Master Plan §0 status update | DOC | XS | T-S19-03 | 📋 | Master Plan |

### 2.5 S20 — Hard Stress Test #2 ⚠️ MANDATORY GATE

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-S20-01 | HST scope definition (full corpus 86+ docs) | ARCHITECT | M | T-S19-04 | 📋 | scope doc |
| T-S20-02 | Audit Lead role — orchestrare findings | DOC | L | T-S20-01 | 📋 | findings table draft |
| T-S20-03 | Solution Architect role — cross-spec consistency | ARCHITECT | XL | T-S20-01 | 📋 | findings |
| T-S20-04 | Security Auditor role — RBAC + GDPR + OWASP | SECURITY | L | T-S20-01 | 📋 | findings |
| T-S20-05 | DBA role — schema + FK + RLS + migrations | DBA | L | T-S20-01 | 📋 | findings |
| T-S20-06 | QA role — test coverage + edge cases + BR-XX | TESTER | L | T-S20-01 | 📋 | findings |
| T-S20-07 | Compliance role — GDPR + Legea 133/2011 + DPIA | DOC + SECURITY | M | T-S20-01 | 📋 | findings |
| T-S20-08 | Product Auditor — BRD ↔ specs ↔ workflows formula | ARCHITECT | M | T-S20-01 | 📋 | findings |
| T-S20-09 | HST report consolidate cu severity matrix | DOC + ARCHITECT | L | T-S20-02..08 | 📋 | `HST_REVYX_pre-dev_v1.0.0.md` |
| T-S20-10 | Gap closure backlog (PR-uri pentru CRIT/HIGH) | DOC | XL | T-S20-09 | 📋 | bugs/PR-uri închise |
| T-S20-11 | Re-audit pass post fix | ARCHITECT + SECURITY | M | T-S20-10 | 📋 | sign-off table |
| T-S20-12 | Master Plan §13 sign-off (board) | DOC | XS | T-S20-11 | 📋 | Master Plan |

**S20 EXIT GATE:** 0 findings CRIT; toate HIGH closed sau triage cu owner+ETA. Dacă FAIL → S21+ doc adjustment cycle.

---

## 3. M0 — MVP PREZENTARE Detailed

**Scope:** Demo web pentru pitching investitori/clienți; NU este produs funcțional.
**Hats activate:** DESIGNER, FRONTEND WEB DEV, ARCHITECT, DOC

### 3.1 M0.S1 — Wireframes & Design System

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M0.S1-01 | Audit brand-config revyx.md compliance | DESIGNER | XS | S20 close | 📋 | review notes |
| T-M0.S1-02 | Inventory ecranelor critice demo (15-20 screens) | ARCHITECT + DESIGNER | S | T-M0.S1-01 | 📋 | `design/screens-inventory.md` |
| T-M0.S1-03 | Wireframe: Login + Dashboard Agent | DESIGNER | M | T-M0.S1-02 | 🌐 | Figma/PNG |
| T-M0.S1-04 | Wireframe: Lead Queue + Lead Detail | DESIGNER | M | T-M0.S1-02 | 🌐 | Figma/PNG |
| T-M0.S1-05 | Wireframe: Property List + Property Detail | DESIGNER | M | T-M0.S1-02 | 🌐 | Figma/PNG |
| T-M0.S1-06 | Wireframe: Deal Pipeline kanban | DESIGNER | M | T-M0.S1-02 | 🌐 | Figma/PNG |
| T-M0.S1-07 | Wireframe: Manager Dashboard (escalations, APS) | DESIGNER | M | T-M0.S1-02 | 🌐 | Figma/PNG |
| T-M0.S1-08 | Wireframe: Admin panel (RBAC, audit log) | DESIGNER | M | T-M0.S1-02 | 🌐 | Figma/PNG |
| T-M0.S1-09 | Design System tokens (colors, spacing, typography) | DESIGNER | S | T-M0.S1-02 | 🌐 | `design/tokens.json` |
| T-M0.S1-10 | Component primitives (Button, Card, Modal, Input) | DESIGNER | L | T-M0.S1-09 | 🌐 | `design/components/*.fig` |

### 3.2 M0.S2 — Clickable Prototype

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M0.S2-01 | Click-through Lead intake → Score → Assign | DESIGNER | M | T-M0.S1-10 | 🌐 | Figma prototype |
| T-M0.S2-02 | Click-through Property creation → Match | DESIGNER | M | T-M0.S1-10 | 🌐 | Figma prototype |
| T-M0.S2-03 | Click-through Deal pipeline → close-won | DESIGNER | M | T-M0.S1-10 | 🌐 | Figma prototype |
| T-M0.S2-04 | Click-through Manager escalation queue | DESIGNER | M | T-M0.S1-10 | 🌐 | Figma prototype |
| T-M0.S2-05 | Internal review prototype + feedback loop | ARCHITECT + DESIGNER | S | T-M0.S2-01..04 | 📋 | review notes |

### 3.3 M0.S3 — Web Static Demo (Next.js)

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M0.S3-01 | Setup `apps/web/` Next.js 14 App Router | FRONTEND WEB DEV | S | T-M0.S2-05 | 🌐 | `apps/web/` skeleton |
| T-M0.S3-02 | TailwindCSS + shadcn/ui install + tokens | FRONTEND WEB DEV | S | T-M0.S3-01, T-M0.S1-09 | 🌐 | tailwind.config.ts |
| T-M0.S3-03 | Componente UI primitives din shadcn (Button, Card, Modal, Input, Table) | FRONTEND WEB DEV | M | T-M0.S3-02 | 🌐 | `apps/web/components/ui/*` |
| T-M0.S3-04 | Mock data JSON (100 leads, 50 properties, 20 deals) | FRONTEND WEB DEV | M | T-M0.S3-01 | 🌐 | `apps/web/lib/mock-data/*.json` |
| T-M0.S3-05 | Page: `/login` (mock auth) | FRONTEND WEB DEV | S | T-M0.S3-03 | 🌐 | `apps/web/app/login/page.tsx` |
| T-M0.S3-06 | Page: `/dashboard` (agent home) | FRONTEND WEB DEV | M | T-M0.S3-04 | 🌐 | `apps/web/app/dashboard/page.tsx` |
| T-M0.S3-07 | Page: `/leads` (queue + filter) | FRONTEND WEB DEV | M | T-M0.S3-04 | 🌐 | `apps/web/app/leads/page.tsx` |
| T-M0.S3-08 | Page: `/leads/[id]` (lead detail + activity) | FRONTEND WEB DEV | M | T-M0.S3-04 | 🌐 | `apps/web/app/leads/[id]/page.tsx` |
| T-M0.S3-09 | Page: `/properties` + `/properties/[id]` | FRONTEND WEB DEV | M | T-M0.S3-04 | 🌐 | property pages |
| T-M0.S3-10 | Page: `/deals` (kanban) | FRONTEND WEB DEV | L | T-M0.S3-04 | 🌐 | `apps/web/app/deals/page.tsx` cu drag-drop |
| T-M0.S3-11 | Page: `/manager/*` (escalations, team, audit log) | FRONTEND WEB DEV | M | T-M0.S3-04 | 🌐 | `apps/web/app/manager/*` |
| T-M0.S3-12 | Page: `/admin/*` (RBAC mock, white-label preview) | FRONTEND WEB DEV | M | T-M0.S3-04 | 🌐 | `apps/web/app/admin/*` |
| T-M0.S3-13 | i18n setup next-intl RO + RU + EN | FRONTEND WEB DEV | S | T-M0.S3-01 | 🌐 | `apps/web/messages/*.json` |
| T-M0.S3-14 | Deploy Vercel + custom domain demo.revyx.app | DEVOPS | S | T-M0.S3-12 | 🌐 | URL public |

### 3.4 M0.S4 — Pitch Deck + Video Walkthrough

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M0.S4-01 | Pitch deck structură 15-20 slide-uri | DOC + ARCHITECT | M | — | 📋 | `marketing/pitch/structure.md` |
| T-M0.S4-02 | Pitch deck content RO | DOC | L | T-M0.S4-01 | 📋 | `marketing/pitch/REVYX_pitch_v1_RO.md` |
| T-M0.S4-03 | Pitch deck content RU | DOC | M | T-M0.S4-02 | 📋 | RU version |
| T-M0.S4-04 | Pitch deck content EN | DOC | M | T-M0.S4-02 | 📋 | EN version |
| T-M0.S4-05 | Video walkthrough script RO + EN (5 min) | DOC | M | T-M0.S3-14 | 📋 | `marketing/video/script.md` |
| T-M0.S4-06 | Video recording + editing | DESIGNER | L | T-M0.S4-05 | 🌐 | 2 video files |

### 3.5 M0.S5 — HST M0 ⚠️ GATE

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M0.S5-01 | HST UX flow audit (toate user journeys) | ARCHITECT + TESTER | M | T-M0.S3-14 | 🌐 | findings |
| T-M0.S5-02 | HST brand compliance check (paletă, font) | DESIGNER | S | T-M0.S3-14 | 🌐 | findings |
| T-M0.S5-03 | HST presentation rehearsal (3 mock pitch sessions) | ARCHITECT + DOC | M | T-M0.S4-06 | 📋 | rehearsal notes |
| T-M0.S5-04 | HST report consolidate | DOC | M | T-M0.S5-01..03 | 📋 | `HST_REVYX_m0_v1.0.0.md` |
| T-M0.S5-05 | Fix sprint findings CRIT/HIGH | FRONTEND WEB DEV | M | T-M0.S5-04 | 🌐 | PR-uri |
| T-M0.S5-06 | M0 sign-off PM + PO | DOC | XS | T-M0.S5-05 | 📋 | sign-off |

**M0 EXIT GATE:** AC-M0-01..07 toate ☑; HST M0 0 findings CRIT/HIGH; demo URL live.

---

## 4. M1 — MVP FUNCȚIONAL Detailed

**Scope:** Pilot real cu 2-3 tenanți; backend Phase 0+A+B+C + Web platform Agent+Manager.
**Hats activate:** SECURITY, BACKEND DEV, DBA, FRONTEND WEB DEV, TESTER, DEVOPS

### 4.1 M1.S1 — Phase 0 Security Foundation

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M1.S1-01 | Repo bootstrap monorepo (turbo) | DEVOPS | M | M0 close | 🔧 | `package.json`, `turbo.json` |
| T-M1.S1-02 | TypeScript strict + tsconfig + ESLint + Prettier | DEVOPS | S | T-M1.S1-01 | 🔧 | configs |
| T-M1.S1-03 | CI/CD GitHub Actions (test + build + deploy) | DEVOPS | M | T-M1.S1-01 | 🔧 | `.github/workflows/*.yml` |
| T-M1.S1-04 | Supabase project setup + env vars | DEVOPS | S | — | 🔧 | `.env.example` |
| T-M1.S1-05 | Schema migration 0001 USERS + ROLES (RBAC 5) | DBA | M | T-M1.S1-04 | 🔧 | `supabase/migrations/0001_users_roles.sql` |
| T-M1.S1-06 | JWT RS256 keys generation + Supabase Auth config | SECURITY + DEVOPS | S | T-M1.S1-04 | 🔧 | keys + supabase config |
| T-M1.S1-07 | RBAC middleware (Fastify plugin) | SECURITY + BACKEND DEV | M | T-M1.S1-05, T-M1.S1-06 | 🔧 | `apps/api/src/plugins/rbac.ts` |
| T-M1.S1-08 | Single session per agent enforcement (BR-12) | SECURITY + BACKEND DEV | S | T-M1.S1-07 | 🔧 | session token revoke logic |
| T-M1.S1-09 | Schema migration 0002 AUDIT_LOG (partitioned monthly) | DBA + SECURITY | M | T-M1.S1-05 | 🔧 | `supabase/migrations/0002_audit_log.sql` |
| T-M1.S1-10 | AUDIT_LOG trigger (revoke UPDATE/DELETE BR-07) | DBA | S | T-M1.S1-09 | 🔧 | SQL trigger |
| T-M1.S1-11 | Audit middleware WRITE logging | SECURITY + BACKEND DEV | M | T-M1.S1-09 | 🔧 | Fastify hook |
| T-M1.S1-12 | Webhook HMAC-SHA256 verification middleware | SECURITY + BACKEND DEV | M | T-M1.S1-07 | 🔧 | webhook verifier |
| T-M1.S1-13 | Rate limiting (express-rate-limit Fastify equivalent) | SECURITY + BACKEND DEV | S | T-M1.S1-07 | 🔧 | rate limit plugin |
| T-M1.S1-14 | Schema migration 0003 LEAD GDPR fields | DBA | S | T-M1.S1-05 | 🔧 | migration |
| T-M1.S1-15 | Privacy Policy publication (Web public route) | FRONTEND WEB DEV | S | — | 🌐 | `/legal/privacy` |
| T-M1.S1-16 | Cookie Policy publication (Web public route) | FRONTEND WEB DEV | S | — | 🌐 | `/legal/cookies` |
| T-M1.S1-17 | Tests T01-T03 RBAC matrix (jest) | TESTER | M | T-M1.S1-07 | 🔧 | `apps/api/__tests__/rbac.test.ts` |
| T-M1.S1-18 | Tests AUDIT_LOG append-only enforcement | TESTER | S | T-M1.S1-10 | 🔧 | test |
| T-M1.S1-19 | Tests webhook HMAC reject malformed | TESTER | S | T-M1.S1-12 | 🔧 | test |
| T-M1.S1-20 | Phase 0 sign-off SECURITY + DPO | SECURITY + DOC | XS | T-M1.S1-17..19 | 📋 | sign-off |

### 4.2 M1.S2 — Phase A Backend Foundation

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M1.S2-01 | API Fastify server skeleton + plugins | BACKEND DEV | M | T-M1.S1-20 | 🔧 | `apps/api/src/server.ts` |
| T-M1.S2-02 | Routing structure + error handling + logger pino | BACKEND DEV | S | T-M1.S2-01 | 🔧 | structured |
| T-M1.S2-03 | Schema migration 0010 LEADS table | DBA | M | T-M1.S1-14 | 🔧 | migration |
| T-M1.S2-04 | Schema migration 0011 PROPERTIES table | DBA | M | — | 🔧 | migration |
| T-M1.S2-05 | Schema migration 0012 DEALS table | DBA | S | T-M1.S2-03..04 | 🔧 | migration |
| T-M1.S2-06 | Schema migration 0013 ACTIVITIES table | DBA | S | T-M1.S2-03..04 | 🔧 | migration |
| T-M1.S2-07 | Redis setup (Upstash sau self-hosted) | DEVOPS | S | — | 🔧 | env vars |
| T-M1.S2-08 | Redis cache layer pentru scoring (TTL + invalidation) | BACKEND DEV | M | T-M1.S2-07 | 🔧 | cache module |
| T-M1.S2-09 | Health check endpoint `/health` | BACKEND DEV | XS | T-M1.S2-01 | 🔧 | route |
| T-M1.S2-10 | API client SDK pentru Web (TanStack Query) | FRONTEND WEB DEV | M | T-M1.S2-02 | 🌐 | `packages/api-client/` |

### 4.3 M1.S3 — Phase B Lead Intake + Scoring

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M1.S3-01 | Webhook parser Meta Lead Ads | BACKEND DEV | M | T-M1.S1-12 | 🔧 | parser |
| T-M1.S3-02 | Webhook parser Google Lead Form Extensions | BACKEND DEV | M | T-M1.S1-12 | 🔧 | parser |
| T-M1.S3-03 | Webhook parser OLX (Moldova marketplace) | BACKEND DEV | M | T-M1.S1-12 | 🔧 | parser |
| T-M1.S3-04 | LS engine implementation (formula BRD §7.1) | BACKEND DEV + ARCHITECT | L | T-M1.S2-10 | 🔧 | `apps/api/src/scoring/ls.ts` |
| T-M1.S3-05 | LS_initial=0.30 (BR-02) seed la creare | BACKEND DEV | XS | T-M1.S3-04 | 🔧 | logic |
| T-M1.S3-06 | TESTER vectori T01-T07 (LS engine) **TDD-first** | TESTER | M | T-M1.S3-04 | 🔧 | `apps/api/__tests__/ls.test.ts` |
| T-M1.S3-07 | Lead Firewall middleware (BR-01: LS≥0.60+contact) | BACKEND DEV | M | T-M1.S3-04 | 🔧 | middleware |
| T-M1.S3-08 | SLA engine (15min HOT / 2h calificat / 24h warm) | BACKEND DEV | L | T-M1.S2-08 | 🔧 | `apps/api/src/sla/` |
| T-M1.S3-09 | Escalation Protocol BR-03 (3 niveluri) | BACKEND DEV | L | T-M1.S3-08 | 🔧 | escalation logic |
| T-M1.S3-10 | Task assignment max 3 active/agent (BR-04) | BACKEND DEV | M | T-M1.S3-04 | 🔧 | assignment service |
| T-M1.S3-11 | Nurturing leads <0.40 (cron job) | BACKEND DEV | M | T-M1.S3-04 | 🔧 | cron |
| T-M1.S3-12 | GDPR consent capture endpoint | BACKEND DEV | S | T-M1.S1-14 | 🔧 | endpoint |
| T-M1.S3-13 | Tests BR-01..07 integration | TESTER | M | T-M1.S3-07..12 | 🔧 | tests |

### 4.4 M1.S4 — Phase C Property + Matching

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M1.S4-01 | PROPERTY CRUD endpoints | BACKEND DEV | M | T-M1.S2-04 | 🔧 | routes |
| T-M1.S4-02 | PostGIS extension + GIS indexing | DBA | S | T-M1.S2-04 | 🔧 | migration |
| T-M1.S4-03 | PS scoring engine §7.2 | BACKEND DEV | L | T-M1.S4-01 | 🔧 | `apps/api/src/scoring/ps.ts` |
| T-M1.S4-04 | LF (Listing Freshness) decay cron | BACKEND DEV | S | T-M1.S4-01 | 🔧 | cron |
| T-M1.S4-05 | IS (Interaction Strength) engine | BACKEND DEV | M | T-M1.S2-06 | 🔧 | `apps/api/src/scoring/is.ts` |
| T-M1.S4-06 | Match v1 engine (PS+LS+IS combined) | BACKEND DEV + ARCHITECT | L | T-M1.S4-03, T-M1.S3-04 | 🔧 | `apps/api/src/match/` |
| T-M1.S4-07 | Re-matching trigger needs_review (BR-05) | BACKEND DEV | M | T-M1.S4-06 | 🔧 | trigger logic |
| T-M1.S4-08 | NU anulare automată deals la re-match (test) | TESTER | S | T-M1.S4-07 | 🔧 | test |
| T-M1.S4-09 | Tests matching pipeline | TESTER | M | T-M1.S4-06 | 🔧 | tests |

### 4.5 M1.S5 — Web Dashboard Agent ★

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M1.S5-01 | Reuse design system din M0.S1 + tokens | FRONTEND WEB DEV + DESIGNER | S | T-M1.S2-10 | 🌐 | shared package |
| T-M1.S5-02 | Auth Supabase integration Web (cookie session) | FRONTEND WEB DEV | M | T-M1.S2-10 | 🌐 | `apps/web/lib/auth.ts` |
| T-M1.S5-03 | Layout `/agent` cu sidebar + header SLA timer | FRONTEND WEB DEV | M | T-M1.S5-02 | 🌐 | layout |
| T-M1.S5-04 | Page `/agent/dashboard` (NBA widget + queue) | FRONTEND WEB DEV | M | T-M1.S5-03 | 🌐 | page |
| T-M1.S5-05 | Page `/agent/leads` (queue prioritized + filter) | FRONTEND WEB DEV | L | T-M1.S5-03 | 🌐 | page cu Server Components |
| T-M1.S5-06 | Page `/agent/leads/[id]` (detail + activity log) | FRONTEND WEB DEV | L | T-M1.S5-05 | 🌐 | page |
| T-M1.S5-07 | Page `/agent/properties` + `/[id]` | FRONTEND WEB DEV | M | T-M1.S5-03 | 🌐 | pages |
| T-M1.S5-08 | Page `/agent/tasks` (max 3 active enforcement UI) | FRONTEND WEB DEV | M | T-M1.S5-03 | 🌐 | page |
| T-M1.S5-09 | SLA timer countdown component (real-time WebSocket) | FRONTEND WEB DEV | L | T-M1.S5-03 | 🌐 | component |
| T-M1.S5-10 | Match suggestions side-panel (lead detail) | FRONTEND WEB DEV | M | T-M1.S5-06 | 🌐 | component |
| T-M1.S5-11 | Activity log timeline component | FRONTEND WEB DEV | M | T-M1.S5-06 | 🌐 | component |
| T-M1.S5-12 | i18n RO + RU complet pe ecrane critice | FRONTEND WEB DEV | M | T-M1.S5-04..11 | 🌐 | translations |
| T-M1.S5-13 | Playwright E2E suite Agent flows | TESTER | L | T-M1.S5-12 | 🌐 | `apps/web/e2e/agent/*` |
| T-M1.S5-14 | Lighthouse audit Performance ≥ 80 | TESTER | S | T-M1.S5-13 | 🌐 | report |

### 4.6 M1.S6 — Web Dashboard Manager ★

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M1.S6-01 | Layout `/manager` cu RBAC enforcement (team_lead+manager) | FRONTEND WEB DEV + SECURITY | M | T-M1.S5-02 | 🌐 | layout |
| T-M1.S6-02 | Page `/manager` (overview cards: APS leaderboard, conversion) | FRONTEND WEB DEV | L | T-M1.S6-01 | 🌐 | page |
| T-M1.S6-03 | Page `/manager/team` (agent list + APS) | FRONTEND WEB DEV | M | T-M1.S6-01 | 🌐 | page |
| T-M1.S6-04 | Page `/manager/escalations` (queue cu bulk actions) | FRONTEND WEB DEV | L | T-M1.S6-01 | 🌐 | page |
| T-M1.S6-05 | Manager escalation override action (audit-logged) | FRONTEND WEB DEV + SECURITY | M | T-M1.S6-04 | 🌐 | action handler |
| T-M1.S6-06 | Page `/manager/audit` (audit log viewer filterable) | FRONTEND WEB DEV | L | T-M1.S6-01 | 🌐 | page |
| T-M1.S6-07 | Audit log export CSV (admin/compliance) | FRONTEND WEB DEV | S | T-M1.S6-06 | 🌐 | export endpoint |
| T-M1.S6-08 | Page `/manager/settings` (RBAC matrix view + tenant config) | FRONTEND WEB DEV | M | T-M1.S6-01 | 🌐 | page |
| T-M1.S6-09 | RBAC client-side guard hooks `useRequireRole` | FRONTEND WEB DEV + SECURITY | S | T-M1.S6-01 | 🌐 | hook |
| T-M1.S6-10 | Tests E2E Manager RBAC enforcement | TESTER | M | T-M1.S6-09 | 🌐 | tests |

### 4.7 M1.S7 — Pilot Deploy + Monitoring

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M1.S7-01 | Deploy API production (Hetzner sau AWS eu-west-1) | DEVOPS | M | T-M1.S6-10 | 🔧 | infra |
| T-M1.S7-02 | Deploy Web production (Vercel sau self-hosted) | DEVOPS | S | T-M1.S6-10 | 🌐 | URL prod |
| T-M1.S7-03 | Sentry integration Web + API | DEVOPS + SECURITY | S | T-M1.S7-01..02 | 🔧 | Sentry config |
| T-M1.S7-04 | Better Uptime monitoring + alerting | DEVOPS | XS | T-M1.S7-01..02 | 🔧 | monitoring |
| T-M1.S7-05 | Runbook DR baseline | DOC + DEVOPS | M | T-M1.S7-01 | 📋 | `RUNBOOK_REVYX_dr-baseline-m1.md` |
| T-M1.S7-06 | Cohort selection 2-3 pilot tenants RM | DOC + ARCHITECT | S | — | 📋 | cohort doc |
| T-M1.S7-07 | Pilot onboarding sessions (training agenți) | DOC | M | T-M1.S7-06 | 📋 | training doc |
| T-M1.S7-08 | Pilot day-by-day monitoring (7 zile) | DEVOPS + TESTER | L | T-M1.S7-07 | 🔧 | daily reports |

### 4.8 M1.S8 — HST M1 + Bug Fix Sprint ⚠️ GATE

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M1.S8-01 | HST scope definition M1 | ARCHITECT | M | T-M1.S7-08 | 📋 | scope |
| T-M1.S8-02 | RBAC correctness audit (Web + API) | SECURITY | M | T-M1.S8-01 | 🔧 + 🌐 | findings |
| T-M1.S8-03 | T01-T07 regression run | TESTER | S | T-M1.S8-01 | 🔧 | report |
| T-M1.S8-04 | GDPR compliance audit | SECURITY + DOC | M | T-M1.S8-01 | 🔧 | findings |
| T-M1.S8-05 | SLA precision audit (timer accuracy) | TESTER | M | T-M1.S8-01 | 🌐 + 🔧 | findings |
| T-M1.S8-06 | Audit log completitudine cross-check | SECURITY + DBA | M | T-M1.S8-01 | 🔧 | findings |
| T-M1.S8-07 | OWASP top 10 baseline (OWASP ZAP) | SECURITY | L | T-M1.S8-01 | 🔧 + 🌐 | scan report |
| T-M1.S8-08 | Web Lighthouse Performance + A11y + Best Practices | TESTER | S | T-M1.S8-01 | 🌐 | report |
| T-M1.S8-09 | HST report consolidate | DOC | L | T-M1.S8-02..08 | 📋 | `HST_REVYX_m1_v1.0.0.md` |
| T-M1.S8-10 | Fix sprint findings CRIT/HIGH | BACKEND DEV + FRONTEND WEB DEV + DBA | XL | T-M1.S8-09 | toate | PR-uri |
| T-M1.S8-11 | Re-audit pass | ARCHITECT | M | T-M1.S8-10 | 📋 | sign-off |
| T-M1.S8-12 | M1 sign-off PM + PO + Security Lead | DOC | XS | T-M1.S8-11 | 📋 | sign-off |

**M1 EXIT GATE:** AC-M1-01..10 toate ☑; HST M1 0 findings CRIT/HIGH; pilot ≥ 7 zile uptime fără P1.

---

## 5. M2 — FULL RELEASE GA Detailed

**Scope:** Public Moldova GA — Phase D-G complete + Mobile Companion + ML + Marketplace + White-Label.
**Hats activate:** ALL (rotație per stage)

### 5.1 M2.S1 — Phase D Deals + DHI + NBA

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M2.S1-01 | DEAL pipeline state machine (6 stages) | BACKEND DEV + ARCHITECT | L | M1 close | 🔧 | state machine |
| T-M2.S1-02 | DP probability engine | BACKEND DEV | L | T-M2.S1-01 | 🔧 | scoring |
| T-M2.S1-03 | DHI engine — TF (BR-10 default 0.70) + RF | BACKEND DEV | L | T-M2.S1-01 | 🔧 | `apps/api/src/scoring/dhi.ts` |
| T-M2.S1-04 | APS engine — APS_default 0.65 (BR-11) | BACKEND DEV | M | T-M2.S1-01 | 🔧 | `apps/api/src/scoring/aps.ts` |
| T-M2.S1-05 | NBA engine [0, 2.0] singura excepție de scală | BACKEND DEV | L | T-M2.S1-04 | 🔧 | `apps/api/src/nba/` |
| T-M2.S1-06 | OFFER state machine + chain logic | BACKEND DEV | L | T-M2.S1-01 | 🔧 | offer module |
| T-M2.S1-07 | OFFER manager review queue (Web only DP-05) | BACKEND DEV + FRONTEND WEB DEV | M | T-M2.S1-06 | 🌐 | route + UI |
| T-M2.S1-08 | SHOWING entity + scheduling | BACKEND DEV | M | T-M2.S1-01 | 🔧 | module |
| T-M2.S1-09 | Commission split deal closure | BACKEND DEV | M | T-M2.S1-01 | 🔧 | logic |
| T-M2.S1-10 | Web UI deal pipeline kanban (drag-drop) | FRONTEND WEB DEV | L | T-M2.S1-01 | 🌐 | page |
| T-M2.S1-11 | Web UI DHI heatmap (Recharts) | FRONTEND WEB DEV | M | T-M2.S1-03 | 🌐 | component |
| T-M2.S1-12 | Web UI NBA recommendations widget | FRONTEND WEB DEV | M | T-M2.S1-05 | 🌐 | component |
| T-M2.S1-13 | Tests T (DHI + APS + NBA + OFFER state) | TESTER | L | T-M2.S1-01..06 | 🔧 | tests |

### 5.2 M2.S2 — Web Platform COMPLETE

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M2.S2-01 | Admin layout `/admin` cu RBAC strict | FRONTEND WEB DEV + SECURITY | M | M1.S6 | 🌐 | layout |
| T-M2.S2-02 | Page `/admin/users` (RBAC mgmt + invite + suspend) | FRONTEND WEB DEV | L | T-M2.S2-01 | 🌐 | page |
| T-M2.S2-03 | Page `/admin/rbac` (matrix view) | FRONTEND WEB DEV | M | T-M2.S2-01 | 🌐 | page |
| T-M2.S2-04 | Page `/reports` (lead conversion, APS leaderboard, deal closure) | FRONTEND WEB DEV | L | M2.S1 | 🌐 | page Recharts |
| T-M2.S2-05 | Page `/admin/ml-models` (4-eyes promote UI) | FRONTEND WEB DEV + SECURITY | XL | T-M2.S2-01 | 🌐 | 2-step REQUEST/APPROVE flow |
| T-M2.S2-06 | Page `/cs/churn-dashboard` (analytics) | FRONTEND WEB DEV | L | T-M2.S2-01 | 🌐 | page |
| T-M2.S2-07 | Page `/admin/audit` (filterable + export CSV) | FRONTEND WEB DEV | L | T-M2.S2-01 | 🌐 | page |
| T-M2.S2-08 | Page `/admin/branding` (white-label config + Enterprise gating) | FRONTEND WEB DEV | L | T-M2.S2-01 | 🌐 | page |
| T-M2.S2-09 | Page `/admin/health` (system status) | FRONTEND WEB DEV | M | T-M2.S2-01 | 🌐 | page |
| T-M2.S2-10 | Page `/admin/billing` (Stripe portal embed) | FRONTEND WEB DEV | M | T-M2.S2-01 | 🌐 | page |
| T-M2.S2-11 | Page `/admin/feature-flags` | FRONTEND WEB DEV | M | T-M2.S2-01 | 🌐 | page |
| T-M2.S2-12 | i18n RO+RU+EN admin extended | FRONTEND WEB DEV | M | T-M2.S2-02..11 | 🌐 | translations |
| T-M2.S2-13 | Playwright E2E suite Admin flows | TESTER | L | T-M2.S2-12 | 🌐 | tests |

### 5.3 M2.S3 — Mobile RN COMPANION

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M2.S3-01 | Setup `apps/mobile/` Expo SDK 51 + expo-router | MOBILE DEV | M | M1 close | 📱 | skeleton |
| T-M2.S3-02 | Auth Supabase Mobile (token + secure storage) | MOBILE DEV + SECURITY | M | T-M2.S3-01 | 📱 | auth module |
| T-M2.S3-03 | Single-session enforcement Mobile (BR-12) | MOBILE DEV | S | T-M2.S3-02 | 📱 | logic |
| T-M2.S3-04 | RBAC client-side guard Mobile | MOBILE DEV + SECURITY | S | T-M2.S3-02 | 📱 | hooks |
| T-M2.S3-05 | NativeWind + design system tokens shared cu Web | MOBILE DEV + DESIGNER | M | T-M2.S3-01 | 📱 | tokens |
| T-M2.S3-06 | Screen Lead List (sortabil LS+SLA) | MOBILE DEV | M | T-M2.S3-04 | 📱 | screen |
| T-M2.S3-07 | Screen Lead Detail (tabs Detail/Activity/Match) | MOBILE DEV | L | T-M2.S3-06 | 📱 | screen |
| T-M2.S3-08 | Screen Deal List + Detail (read-only kanban) | MOBILE DEV | L | T-M2.S3-04 | 📱 | screens |
| T-M2.S3-09 | Screen NBA recommendations (home) | MOBILE DEV | M | T-M2.S3-04 | 📱 | screen |
| T-M2.S3-10 | Screen Tasks (max 3 active) | MOBILE DEV | M | T-M2.S3-04 | 📱 | screen |
| T-M2.S3-11 | Push notifications APNS (iOS) | MOBILE DEV + DEVOPS | M | T-M2.S3-01 | 📱 | config + lib |
| T-M2.S3-12 | Push notifications FCM (Android) | MOBILE DEV + DEVOPS | M | T-M2.S3-01 | 📱 | config + lib |
| T-M2.S3-13 | Deep-link `revyx://leads/{id}` (F-S13-01 spec) | MOBILE DEV | S | T-M2.S3-01 | 📱 | linking config |
| T-M2.S3-14 | Offline sync optimistic locking (version field) | MOBILE DEV + ARCHITECT | XL | T-M2.S3-04 | 📱 | sync engine |
| T-M2.S3-15 | Photo upload (compress + S3 presigned) | MOBILE DEV | M | T-M2.S3-04 | 📱 | upload module |
| T-M2.S3-16 | Geo-tag showing check-in (GPS) | MOBILE DEV | M | T-M2.S3-04 | 📱 | feature |
| T-M2.S3-17 | Voice memo activity (native mic) | MOBILE DEV | M | T-M2.S3-04 | 📱 | feature |
| T-M2.S3-18 | TestFlight release (iOS) | DEVOPS + MOBILE DEV | M | T-M2.S3-01..17 | 📱 | TestFlight build |
| T-M2.S3-19 | Play Store internal release (Android) | DEVOPS + MOBILE DEV | M | T-M2.S3-01..17 | 📱 | Play internal |
| T-M2.S3-20 | Detox E2E tests Mobile | TESTER + MOBILE DEV | L | T-M2.S3-18..19 | 📱 | tests |
| T-M2.S3-21 | Public release App Store + Play Store | DEVOPS + MOBILE DEV | M | T-M2.S3-20 | 📱 | live apps |

### 5.4 M2.S4 — Phase F ML Pricing + Churn

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M2.S4-01 | Schema migration `ml_model_registry` (din 0600) | DBA | S | M2.S1 | 🔧 | migration |
| T-M2.S4-02 | Model `pricing-gbm v2.0.0` training script | ML ENGINEER | XL | T-M2.S4-01 | 🔧 | notebook |
| T-M2.S4-03 | Model registry seeding | ML ENGINEER + DBA | S | T-M2.S4-02 | 🔧 | seed |
| T-M2.S4-04 | SHADOW mode 28 zile (logging predictions fără routing) | BACKEND DEV + ML ENGINEER | M | T-M2.S4-03 | 🔧 | shadow logic |
| T-M2.S4-05 | Bias monitoring SQL job (daily 03:00 UTC) | DBA + ML ENGINEER | M | T-M2.S4-04 | 🔧 | cron + alert |
| T-M2.S4-06 | 4-eyes promote events (PRICING_MODEL_4EYES_REQUEST/APPROVED) | BACKEND DEV + SECURITY | M | T-M2.S4-04 | 🔧 | events |
| T-M2.S4-07 | Auto-rollback policy (3× CRIT sau 30% MAE) | BACKEND DEV + ML ENGINEER | M | T-M2.S4-04 | 🔧 | policy |
| T-M2.S4-08 | CANARY 5% routing | BACKEND DEV | M | T-M2.S4-06 | 🔧 | feature flag |
| T-M2.S4-09 | CANARY 25% promotion | BACKEND DEV | S | T-M2.S4-08 | 🔧 | flag |
| T-M2.S4-10 | GA 100% promotion | BACKEND DEV | S | T-M2.S4-09 | 🔧 | flag |
| T-M2.S4-11 | Churn scoring engine | BACKEND DEV + ML ENGINEER | L | T-M2.S4-01 | 🔧 | engine |
| T-M2.S4-12 | CS task generation (CHURN_CS_TASK_OPENED) | BACKEND DEV | M | T-M2.S4-11 | 🔧 | task gen |
| T-M2.S4-13 | Prevention Rate KPI ≥30% measurement | BACKEND DEV + DOC | S | T-M2.S4-12 | 🔧 | metric |
| T-M2.S4-14 | Tests ML pipeline + bias check vectors | TESTER + ML ENGINEER | L | T-M2.S4-04..07 | 🔧 | tests |

### 5.5 M2.S5 — Phase G Marketplace + White-Label

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M2.S5-01 | Schema migration BUYER_PROFILE | DBA | M | M2.S1 | 🔧 | migration |
| T-M2.S5-02 | BUYER_PROFILE CRUD endpoints | BACKEND DEV | M | T-M2.S5-01 | 🔧 | routes |
| T-M2.S5-03 | Contact-grant rate limiting + state machine | BACKEND DEV + SECURITY | M | T-M2.S5-02 | 🔧 | logic |
| T-M2.S5-04 | Stripe Connect integration | BACKEND DEV | L | — | 🔧 | module |
| T-M2.S5-05 | Stripe webhook idempotency (F-S14-02 fallback) | BACKEND DEV | M | T-M2.S5-04 | 🔧 | webhook handler |
| T-M2.S5-06 | pgvector extension + HNSW index | DBA | S | M2.S1 | 🔧 | migration |
| T-M2.S5-07 | Match v2 engine (semantic embeddings) | BACKEND DEV + ML ENGINEER | XL | T-M2.S5-06, T-M2.S4-04 | 🔧 | engine |
| T-M2.S5-08 | White-Label backend (per-tenant config) | BACKEND DEV + SECURITY | L | M2.S2 | 🔧 | module |
| T-M2.S5-09 | Cloudflare edge HMAC worker | DEVOPS + SECURITY | M | T-M2.S5-08 | 🔧 | worker |
| T-M2.S5-10 | Public marketplace landing `marketplace.revyx.app` | FRONTEND WEB DEV + DESIGNER | L | T-M2.S5-02 | 🌐 | site |
| T-M2.S5-11 | Buyer self-publish form + GDPR consent | FRONTEND WEB DEV + DESIGNER | L | T-M2.S5-10 | 🌐 | form |
| T-M2.S5-12 | Buyer profile browse + filter + map | FRONTEND WEB DEV | L | T-M2.S5-11 | 🌐 | UI |
| T-M2.S5-13 | Contact-grant request UI (buyer side) | FRONTEND WEB DEV | M | T-M2.S5-12 | 🌐 | UI |
| T-M2.S5-14 | Agent contact-grant inbox dashboard | FRONTEND WEB DEV | L | T-M2.S5-13 | 🌐 | UI |
| T-M2.S5-15 | Mobile push approve contact-grant deep-link | MOBILE DEV | M | T-M2.S3-13 | 📱 | feature |
| T-M2.S5-16 | White-Label admin config UI (custom domain + colors + logo) | FRONTEND WEB DEV + DESIGNER | L | T-M2.S2-08 | 🌐 | UI |
| T-M2.S5-17 | DKIM rotation runbook UI helper | FRONTEND WEB DEV | M | T-M2.S5-16 | 🌐 | UI |
| T-M2.S5-18 | Tests Marketplace + White-Label integration | TESTER | L | T-M2.S5-01..17 | 🔧 + 🌐 | tests |

### 5.6 M2.S6 — WhatsApp Business Integration

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M2.S6-01 | WhatsApp Business API account setup | DEVOPS + DOC | M | — | 🔧 | account + tokens |
| T-M2.S6-02 | 5 templates Meta-approved submission | DOC | L | T-M2.S6-01 | 📋 | templates |
| T-M2.S6-03 | Backend send endpoint + rate limiting | BACKEND DEV | M | T-M2.S6-01 | 🔧 | endpoint |
| T-M2.S6-04 | Web "Send WhatsApp" button în lead detail | FRONTEND WEB DEV | S | T-M2.S6-03 | 🌐 | component |
| T-M2.S6-05 | Mobile native deep-link `whatsapp://send` | MOBILE DEV | S | T-M2.S6-03 | 📱 | feature |
| T-M2.S6-06 | Audit log WHATSAPP_* events catalog | SECURITY + DBA | S | T-M2.S6-03 | 🔧 | events |
| T-M2.S6-07 | Delivery status webhook | BACKEND DEV | M | T-M2.S6-03 | 🔧 | webhook |
| T-M2.S6-08 | Tests WhatsApp send + delivery + audit | TESTER | M | T-M2.S6-03..07 | 🔧 | tests |

### 5.7 M2.S7 — Security + Performance Hardening

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M2.S7-01 | OWASP top 10 audit Web | SECURITY | L | M2.S5 | 🌐 | findings |
| T-M2.S7-02 | OWASP top 10 audit API | SECURITY | L | M2.S5 | 🔧 | findings |
| T-M2.S7-03 | OWASP top 10 audit Mobile (M-OWASP) | SECURITY + MOBILE DEV | L | M2.S3 | 📱 | findings |
| T-M2.S7-04 | Penetration test extern (sau OWASP ZAP self) | SECURITY | XL | T-M2.S7-01..03 | toate | report |
| T-M2.S7-05 | BSI Group MD DPA signing | DOC | XL | S18 | 📋 | DPA semnată |
| T-M2.S7-06 | ISO 27001 controls verification | SECURITY + DOC | XL | T-M2.S7-05 | 📋 | report |
| T-M2.S7-07 | DPIA refresh post-features | DOC + SECURITY | M | M2.S5 | 📋 | DPIA v1.1.0 |
| T-M2.S7-08 | Query optimization + index audit | DBA + BACKEND DEV | L | M2.S5 | 🔧 | optimization PR-uri |
| T-M2.S7-09 | N+1 query elimination | BACKEND DEV | M | T-M2.S7-08 | 🔧 | fixes |
| T-M2.S7-10 | Web Lighthouse final audit (≥90) | TESTER + FRONTEND WEB DEV | M | M2.S5 | 🌐 | report |
| T-M2.S7-11 | k6 load test backend | DEVOPS + TESTER | M | M2.S5 | 🔧 | report |
| T-M2.S7-12 | lighthouse-ci CI Web | DEVOPS | S | T-M2.S7-10 | 🌐 | CI config |

### 5.8 M2.S8 — GA Launch ⚠️ FINAL GATE

| ID | Task | Owner | Effort | DEP | Platform | Output |
|---|---|---|---|---|---|---|
| T-M2.S8-01 | HST M2 final cross-platform | ARCHITECT + SECURITY + TESTER | XL | T-M2.S7-04 | toate | `HST_REVYX_m2_v1.0.0.md` |
| T-M2.S8-02 | Fix sprint findings final | toate dev hats | XL | T-M2.S8-01 | toate | PR-uri |
| T-M2.S8-03 | Feature flag ramp-up plan | DEVOPS + DOC | M | T-M2.S8-02 | 🔧 | plan |
| T-M2.S8-04 | Public marketing site `revyx.app` | FRONTEND WEB DEV + DESIGNER | L | — | 🌐 | site |
| T-M2.S8-05 | Pricing page (GROWTH/BUSINESS/ENTERPRISE) | FRONTEND WEB DEV | M | T-M2.S8-04 | 🌐 | page |
| T-M2.S8-06 | Onboarding flow self-service | FRONTEND WEB DEV + BACKEND DEV | XL | M2.S2 | 🌐 + 🔧 | flow |
| T-M2.S8-07 | Support docs publice (Web) | DOC + FRONTEND WEB DEV | L | — | 🌐 | docs site |
| T-M2.S8-08 | Status page `status.revyx.app` | DEVOPS | S | — | 🌐 | page |
| T-M2.S8-09 | Mobile apps public live App Store + Play Store | DEVOPS + MOBILE DEV | M | T-M2.S3-21, T-M2.S8-02 | 📱 | live |
| T-M2.S8-10 | GA decision board sign-off (VP Product + CTO + CISO + DPO) | DOC | M | T-M2.S8-01..09 | 📋 | sign-off |
| T-M2.S8-11 | Public launch announcement | DOC | S | T-M2.S8-10 | 📋 | press release |

**M2 EXIT GATE / GA:** AC-M2-01..11 toate ☑; HST M2 + pen-test 0 findings CRIT/HIGH; Web feature-complete + Mobile companion live; board sign-off.

---

## 6. Critical Path Analysis (Top 20 dependencies blocking)

| Rank | Task | De ce e critic | Blochează |
|---|---|---|---|
| 1 | T-S20-12 Master Plan §13 sign-off | Pre-dev gate final | TOT M0+M1+M2 |
| 2 | T-M1.S1-07 RBAC middleware | Toate API routes depind | M1.S2..S8, M2 toate |
| 3 | T-M1.S1-09 AUDIT_LOG migration | Toate WRITE depinde | M1+M2 toate |
| 4 | T-M1.S3-04 LS engine | Lead Firewall + matching | M1.S3..S8, M2 toate |
| 5 | T-M1.S5-01 Web design system | Toate Web pages M1+M2 | M1.S5..S8, M2.S2/S5/S8 |
| 6 | T-M1.S2-10 API client SDK Web | Toate Web fetches | M1.S5..S6, M2.S2/S5 |
| 7 | T-M1.S8-09 HST M1 report | M1 exit gate | M2 toate |
| 8 | T-M2.S1-03 DHI engine | Deals UI + reports | M2.S2/S4/S7/S8 |
| 9 | T-M2.S1-05 NBA engine | Web NBA widget + Mobile NBA screen | M2.S2/S3/S5 |
| 10 | T-M2.S2-05 ML promote UI 4-eyes | ML GA gating | M2.S4/S7/S8 |
| 11 | T-M2.S3-14 Mobile offline sync | Mobile reliability | M2.S3 toate Mobile |
| 12 | T-M2.S4-04 SHADOW 28d | ML CANARY gating | M2.S4/S7/S8 |
| 13 | T-M2.S5-07 pgvector match v2 | Marketplace agent search | M2.S5/S7 |
| 14 | T-M2.S5-08 White-Label backend | M2.S5 admin config | M2.S5/S7/S8 |
| 15 | T-M2.S6-02 WhatsApp templates Meta | WhatsApp send | M2.S6/S8 |
| 16 | T-M2.S7-04 Pen-test extern | M2 GA gate | M2.S8 |
| 17 | T-M2.S7-05 BSI Group MD DPA | M2 compliance gate | M2.S8 |
| 18 | T-M2.S8-01 HST M2 final | M2 GA gate | M2.S8-11 |
| 19 | T-M2.S8-10 Board sign-off | GA launch | M2.S8-11 |
| 20 | T-M0.S1-09 Design System tokens | Reuse cross M0+M1+M2 | toate UI |

---

## 7. Effort Summary per Milestone

| Milestone | Tasks | XS | S | M | L | XL | Sesiuni Claude estimate |
|---|---|---|---|---|---|---|---|
| Pre-dev (S16-S20) | ~38 | 4 | 16 | 12 | 5 | 1 | 5 sesiuni |
| M0 | ~32 | 0 | 8 | 16 | 7 | 1 | 8-10 sesiuni |
| M1 (8 sub-stages) | ~98 | 6 | 22 | 38 | 28 | 4 | 40-55 sesiuni |
| M2 (8 sub-stages) | ~140 | 4 | 22 | 50 | 50 | 14 | 70-95 sesiuni |
| **TOTAL** | **~308** | **14** | **68** | **116** | **90** | **20** | **~125-165 sesiuni** |

---

## 8. Cross-references

| Document | Relație |
|---|---|
| `MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md` | Source — Detailed Roadmap descompune §4-§6 |
| `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` | Platform tags per task aliniate cu matricea |
| `CLAUDE.md` §10b Regula 7 | 11 hats activate per task conform §1.1 reguli |
| `CLAUDE.md` §10b Regula 8 | Fiecare task citează stage-ul din care face parte |
| `RUNBOOK_REVYX_phase5-rollout-sequence_v1.0.0.md` | Pre-dev S16-S19 alinier sequence |

---

## 9. Approval Gate

| Aprobator | Sign-off | Data |
|---|---|---|
| Senior Architect | ⬜ pending | — |
| Senior PM | ⬜ pending | — |
| Senior PO | ⬜ pending | — |
| CTO | ⬜ pending | — |
| Audit Lead | ⬜ pending | — |

**Notă:** Aprobare finală la S20 HST #2 close. Acest doc + Platform Matrix v1.0.0 + Master Plan v1.1.0 sunt **trio canonical** pentru orice execuție.

---

*docs/ROADMAP_REVYX_detailed-execution_v1.0.0.md · v1.0.0 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
