# REVYX — M0 Demo Screens Inventory
<!-- design/screens-inventory.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX -->

## 0. Stage Master Plan

**Stage:** M0.S1 — Design System direct-to-code (T-M0.S1-02)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.1 (AC-M0-01 ≥12 screens navigable)
**Roadmap ref:** `ROADMAP_REVYX_detailed-execution_v1.0.1.md` §3.1 T-M0.S1-02
**Platform Matrix ref:** `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §2-§12 (Modules 1, 2, 3, 4, 5, 10, 11)

## 0.1 Platform Matrix

Entire M0 demo scope is 🌐 **WEB only** per DP-01 (Web-first) and AC-M0-01..02. Mobile companion N/A for M0 (deferred to M2.S3). Admin features 🌐 Web only enforced per DP-05.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | DESIGNER + ARCHITECT | ★ Initial — 18 screens prioritized per user role × module mapping. Closes T-M0.S1-02. |

---

## 1. Scope

Inventory of screens required for the M0 demo (clickable Next.js static demo). Target ≥ 12 screens navigable end-to-end (AC-M0-01); we plan **18 screens** with 7 implemented as page stubs in M0.S1 (this session) and the remaining 11 fleshed out in M0.S2 (clickable flows) / M0.S3 (mock data wired).

**Source roles** (per Platform Matrix §1.2 + BRD §10.1 RBAC):
- `agent` (primary demo persona)
- `senior_agent` (same surface; +1 capability)
- `team_lead` / `manager` (escalation + APS leaderboard)
- `admin` (RBAC mgmt, audit log, white-label preview)

---

## 2. Screens table

Legend: **Priority** P0 (M0.S1 stub) · P1 (M0.S3 full) · P2 (M0.S3 nice-to-have) · **Status** ⬜ planned · ✅ stub-ed M0.S1

| # | Route | Screen | Module (Platform Matrix) | Primary role(s) | Priority | M0.S1 status |
|---|---|---|---|---|---|---|
| S-01 | `/login` | Login — email + password | Modul 1 Auth (1.1) | all | P0 | ✅ stub |
| S-02 | `/dashboard` | Agent dashboard — NBA widget + own queue + SLA timers | Modul 4.7 NBA + 2.3 Queue | agent, senior_agent | P0 | ✅ stub |
| S-03 | `/leads` | Lead queue (prioritized list, filterable) | Modul 2.3 | agent → manager | P0 | ✅ stub |
| S-04 | `/leads/[id]` | Lead detail — LS badge, GDPR consent, activity, side-panel match suggestions | Modul 2.4 + 2.5 + 2.9 + 2.14 + 4.3 | agent → manager | P0 | ✅ stub |
| S-05 | `/properties` | Property list — PS + LF freshness, filter + map toggle | Modul 3.6 + 3.4 + 3.5 + 3.7 | all | P0 | ✅ stub |
| S-06 | `/properties/[id]` | Property detail — gallery, score, suggested leads | Modul 3.1 + 3.3 + 3.4 | all | P1 | ⬜ M0.S3 |
| S-07 | `/deals` | Deal pipeline — 6-stage kanban with drag-drop | Modul 5.2 + 5.3 + 5.4 | agent → manager | P0 | ✅ stub |
| S-08 | `/deals/[id]` | Deal detail — DHI heatmap, DP score, commission preview | Modul 5.3 + 5.5 + 5.7 | agent → manager | P1 | ⬜ M0.S3 |
| S-09 | `/manager` | Manager dashboard — APS leaderboard + escalations + conversion | Modul 10.2 + 10.3 + 2.12 | team_lead, manager | P0 | ✅ stub |
| S-10 | `/manager/escalations` | Escalation queue + bulk actions (BR-03 3 niveluri) | Modul 2.12 | team_lead, manager | P1 | ⬜ M0.S3 |
| S-11 | `/manager/audit` | Audit log viewer — filterable + CSV export | Modul 15.2 + 15.3 | compliance_auditor, admin | P1 | ⬜ M0.S3 |
| S-12 | `/admin` | Admin panel home — RBAC matrix + system health + feature flags | Modul 11 (entire) | admin | P0 | ✅ stub |
| S-13 | `/admin/users` | User invite + suspend + role assignment | Modul 11.2 + 11.3 | admin, tenant_admin | P1 | ⬜ M0.S3 |
| S-14 | `/admin/branding` | White-label preview — colors / logo / domain | Modul 13.1 + 13.2 | tenant_admin | P1 | ⬜ M0.S3 |
| S-15 | `/legal/privacy` | Privacy policy (RO/RU/EN) public | Modul 15.7 | public | P2 | ⬜ M0.S3 |
| S-16 | `/legal/cookies` | Cookie policy public | Modul 15.8 | public | P2 | ⬜ M0.S3 |
| S-17 | `/404` | Not-found state | shared | all | P1 | ⬜ M0.S3 |
| S-18 | `/` | Marketing landing (route → `/login` for demo) | shared | public | P0 | ✅ stub |

**Total:** 18 screens · **M0.S1 stubbed:** 8 (44%) · **M0.S3 to finish:** 10. Minimum AC-M0-01 ≥ 12 satisfied at M0.S3 close.

---

## 3. Brand business rules surfaced in UI (cross-ref BRD §6.1)

| BR-XX | Where shown | Visual treatment |
|---|---|---|
| BR-01 Lead firewall (LS ≥ 0.60 + contact valid) | `/leads` — leads below threshold shown in muted "Nurturing" group | Muted `--text-muted`, no action affordance |
| BR-02 `LS_initial = 0.30` | `/leads/[id]` — score badge with "initial" subscript when LS == 0.30 | Mono badge, blue (cold) |
| BR-03 Escalation Protocol 3 niveluri | `/manager/escalations` (S-10) — column tags T+SLA / T+SLA+30 / T+SLA+2h | Amber / red / pulsing red |
| BR-04 Max 3 active tasks/agent | `/dashboard` — task slot indicator "2 / 3" | Mono `score` token; red when 3/3 |
| BR-05 Re-matching `needs_review=true` | `/leads/[id]` — banner "Match needs review (deal not cancelled)" | Amber alert-box |
| BR-12 Single session per agent | `/login` — "Logged in elsewhere" copy | Red alert |
| SLA HOT/Calificat/Warm | `/leads` queue chips + countdown timers | Lead Temperature color code (tokens.json `leadTemperature`) |

---

## 4. User journeys (for M0.S2 clickable flows reference)

| Journey | Screens (in order) | Closes |
|---|---|---|
| J1 — Lead intake → score → assign | S-03 → S-04 (LS recomputes visual) → (mock: assign agent) → S-02 | Modul 2 demo |
| J2 — Property create → match | S-05 → S-06 (new) → S-04 (match suggestions side-panel populates) | Modul 3 + 4 |
| J3 — Deal pipeline close-won | S-07 (drag deal Stage 3 → Stage 6) → S-08 → confirm modal | Modul 5 |
| J4 — Manager escalation override | S-09 → S-10 → bulk reassign action (audit-logged stub) | Modul 2.12 + 15 |

---

## 5. Open questions (M0.S1 → M0.S2 hand-off)

1. **Font discrepancy** (flagged in `TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` §approval): brand-config.md (canonical, "law" per CLAUDE.md §1) specifies Bebas Neue + Montserrat + JetBrains Mono, while Master Plan AC-M0-02 mentions "font Inter". PM decision required before M0.S3 production demo deploy.
2. **i18n scope for stubs**: M0.S1 stubs are RO-only; RU + EN localization deferred to M0.S3 (T-M0.S3-13).
3. **Mock data shape**: full mock data JSON (100 leads, 50 properties, 20 deals) deferred to M0.S3 (T-M0.S3-04). M0.S1 stubs use 2-3 inline placeholder records per page.

---

## 6. Cross-references

- `docs/tech-spec/TECH_SPEC_REVYX_ui-design-system_v1.0.0.md` — design system canonical
- `design/tokens.json` — single source of truth tokens
- `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §2-§12 — feature × platform mapping
- `MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md` §4.1 AC-M0-01..07
- `ROADMAP_REVYX_detailed-execution_v1.0.1.md` §3.1 T-M0.S1-02

---

*design/screens-inventory.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
