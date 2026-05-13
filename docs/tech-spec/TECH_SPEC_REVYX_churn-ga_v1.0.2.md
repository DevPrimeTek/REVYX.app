# TECH SPEC — REVYX Churn GA (Platform Clarification PATCH)
<!-- TECH_SPEC_REVYX_churn-ga_v1.0.2.md · v1.0.2 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** M2.S2 (Web Platform Complete — Churn analytics dashboard) + M2.S4 (Phase F Churn backend)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md` §6.2 M2.S2 + §6.2 M2.S4

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-04 | DS Lead + CS Lead | Churn GA initial spec — scoring + CS task generation + Prevention Rate ≥30% |
| 1.0.1 | 2026-05 | DS Lead + Senior DBA | PATCH F-03 follow-up — FK `model_id REFERENCES ml_model_registry` aliniat post-rename |
| **1.0.2** | **2026-06** | ★ Senior Architect + Frontend Lead | ★ PATCH — Churn analytics dashboard = WEB ONLY (cs_lead + manager DP-05); Churn score per agent (own) = BOTH; CS task list — Web full, Mobile limited cs_user. |

---

## 1. Platform Matrix cross-ref

**Source canonical:** `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §15 (Modul 14 — ML Pricing & Churn).

## 2. Clarificări platform

| Termen v1.0.0/v1.0.1 | Platformă efectivă | Justificare |
|---|---|---|
| "Churn score per agent (own)" | 🔁 BOTH | Display read-only own score (BR-18 — nu partajat cu alți agenți) (Modul 14.5) |
| **"Churn analytics dashboard"** ★ | 🌐 **WEB ONLY** | Per **DP-05** — cs_lead + manager view; charts Recharts ecran mare; tenant-wide aggregations (Modul 14.6) |
| "CS task list (intervention)" | 🌐 cs_lead + manager (full + bulk) / 📱 cs_user (limited) | Web: inbox + bulk actions; Mobile: cs_user "call list" simplu (Modul 14.7) |
| "Churn intervention playbook execute" | 🔁 BOTH | Same checklist (CHURN_MEDIUM/HIGH/CRITICAL playbooks) (Modul 14.8) |
| "CHURN_* events" | N/A backend | 14 events catalog audit-log §4.4.5 |

## 3. Implementation note pentru M2.S2 + M2.S4

### 3.1 Churn analytics dashboard (M2.S2 T-M2.S2-06)
- Route: `/cs/churn-dashboard`
- RBAC: cs_lead + manager + admin
- Components: Recharts (churn rate trend, segment breakdown, prevention success rate)
- Filters: timeframe, segment (HIGH/MED/LOW), status (open/intervened/closed)
- Export CSV: admin only (per DP-05)

### 3.2 CS task list — divergență platform
- **Web (cs_lead inbox)**: bulk actions (assign, snooze, close), filters avansate, sortable
- **Mobile (cs_user call list)**: simple list cu nume + tel + score; tap → call native intent. NU bulk actions, NU filters avansate
- DP-01 Web-first: feature complete pe Web înainte de Mobile subset

### 3.3 Backend (M2.S4 T-M2.S4-11..13)
- Churn scoring engine + CS task gen + Prevention Rate KPI — neschimbate

## 4. Backwards compatibility

CHURN_* events (14 events §4.4.5 audit-log) + KPI Prevention Rate ≥30% + scoring formula — **identice neschimbate**.

## 5. RBAC enforcement DP-05

| Role | Web `/cs/churn-dashboard` | Mobile churn UI |
|---|---|---|
| `agent` | ❌ (own score widget only) | own score widget |
| `senior_agent` | ❌ | own score |
| `team_lead` | ⚠️ team aggregate read-only | ❌ |
| `manager` | ✅ full | ❌ DP-05 |
| `admin` | ✅ full + export | ❌ DP-05 |
| `cs_user` | ⚠️ task list assigned | ✅ call list assigned |
| `cs_lead` | ✅ full + assign | ❌ DP-05 (admin features) |

## 6. Cross-references

- `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §15 (canonical)
- `MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md` §6.2 M2.S2 + M2.S4
- `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §5.2 T-M2.S2-06 + §5.4 T-M2.S4-11..13
- `TECH_SPEC_REVYX_churn-ga_v1.0.0.md` + `_v1.0.1.md` (backend specs rămân)
- `cs-playbooks/CHURN_*.md` (playbooks tri-lingual)
- `audit-log_v1.1.1` §4.4.5 CHURN_* events

## 7. Approval

| Aprobator | Sign-off |
|---|---|
| Senior Architect | ⬜ pending (S20) |
| CS Lead | ⬜ pending (S20) |
| Frontend Lead | ⬜ pending (S20) |

---

*docs/tech-spec/TECH_SPEC_REVYX_churn-ga_v1.0.2.md · v1.0.2 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
