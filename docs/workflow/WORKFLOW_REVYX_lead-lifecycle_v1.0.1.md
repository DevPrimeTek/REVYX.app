# WORKFLOW — REVYX Lead Lifecycle (Platform Clarification PATCH)
<!-- WORKFLOW_REVYX_lead-lifecycle_v1.0.1.md · v1.0.1 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** M1.S3 (Phase B Lead Intake+Scoring backend) + M1.S5 (Web Dashboard Agent) + M2.S3 (Mobile Companion lead screens)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md` §5.2 M1.S5 + §6.2 M2.S3
**Trigger:** Audit S15-bis-3 finding — workflow v1.0.0 menționează "agent dashboard" și "manager queue" ambiguu fără tag platform.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior PM + Solution Architect | Workflow inițial — INTAKE → FIREWALL → QUEUE → CONTACT → SHOWING → OFFER → DEAL/LOST |
| **1.0.1** | **2026-06** | ★ Senior Architect + Frontend Lead | ★ PATCH — platform clarification dual-platform (Web primary + Mobile companion). Acest doc NU înlocuiește v1.0.0; **v1.0.0 rămâne source of truth pentru flow logic + state transitions + scoring impacts + audit events**. v1.0.1 adaugă DOAR clarificări platform per Platform Matrix v1.0.0 §3 (Modul 2 — Lead Management). |

---

## 1. Platform Matrix cross-ref

**Source canonical:** `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §3 (Modul 2 — Lead Management) — toate features lead × platform.

## 2. Clarificări platform (anchor: termenii ambigui din v1.0.0)

| Termen v1.0.0 | Platformă efectivă | Justificare |
|---|---|---|
| "Agent dashboard" (lead queue) | 🌐 **WEB primary** + 📱 Mobile subset | Web: full features 10+ filtre, sort avansat (Modul 2.3). Mobile: 3 filtre simple, sortat LS+SLA (per DP-01 Web-first) |
| "Lead detail page" | 🔁 BOTH | Web: split-pane cu match suggestions side panel; Mobile: tabs Detail/Activity/Match (Modul 2.4) |
| "Manager escalation queue" | 🌐 **WEB ONLY** | Per **DP-05** — manager actions (override, reassign, bulk) sunt admin-level, niciodată Mobile (Modul 2.12) |
| "Lead reassignment manager_override" | 🌐 **WEB ONLY** | Per DP-05 + audit-logged manager action (Modul 2.8) |
| "SLA timer real-time" | 🔁 BOTH | Web: header sticky countdown; Mobile: notification banner + push când <5min (Modul 2.10) |
| "Lead bulk import CSV" | 🌐 **WEB ONLY** | File upload pattern impractical pe Mobile (Modul 2.15) |
| "Activity log timeline" | 🔁 BOTH | Web: vertical timeline; Mobile: scroll list (Modul 2.14) |

## 3. Implications pentru implementare M1.S5 / M1.S6 / M2.S3

| Implicație | Detaliu |
|---|---|
| M1.S5 Web Agent | Implementează ABSOLUT TOATE feature-urile lead 🔁 BOTH + 🌐 Web only (15 features Modul 2). Mobile primește subset doar la M2.S3 |
| M1.S6 Web Manager | Manager queue (Modul 2.12) + reassignment override (Modul 2.8) — Web only DP-05 |
| M2.S3 Mobile | Subset filtered: lead list (3 filtre) + lead detail + activity log + SLA banner. **NU**: bulk import, manager queue, reassignment override |

## 4. Implications pentru testing

- Playwright E2E (Web) trebuie să acopere TOATE 15 features Modul 2
- Detox E2E (Mobile) trebuie să acopere SUBSET filtered (5-7 features mobile-relevant)
- DP-05 enforcement test: Mobile RBAC client-side guard trebuie să BLOCHEZE access la `/manager/*` routes (chiar dacă API server-side oricum refuză)

## 5. Backwards compatibility

v1.0.0 flow diagram §4 + state transitions §5 + scoring impacts §8 + audit events §9 + AC §13 — **identice neschimbate**. Doar terminologia "dashboard" devine acum "Web dashboard" sau "Mobile dashboard" per context.

## 6. Cross-references

- `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §3 Modul 2 (canonical)
- `MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md` §5.2 M1.S5 + §5.2 M1.S6 + §6.2 M2.S3
- `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §4.5 T-M1.S5-* + §4.6 T-M1.S6-* + §5.3 T-M2.S3-*
- `WORKFLOW_REVYX_escalation_v1.0.0.md` (cross-ref BR-03)
- `TECH_SPEC_REVYX_lead-scoring_v1.0.0.md` (backend spec rămâne)

## 7. Approval

| Aprobator | Sign-off |
|---|---|
| Senior PM | ⬜ pending (S20) |
| Senior Architect | ⬜ pending (S20) |
| Frontend Lead | ⬜ pending (S20) |

---

*docs/workflow/WORKFLOW_REVYX_lead-lifecycle_v1.0.1.md · v1.0.1 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
