# WORKFLOW — REVYX Offer Chain (Platform Clarification PATCH)
<!-- WORKFLOW_REVYX_offer-chain_v1.0.1.md · v1.0.1 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** M2.S1 (Phase D Deals — OFFER state machine + Web UI)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md` §6.2 M2.S1
**Trigger:** Audit S15-bis-3 finding — workflow v1.0.0 menționează "manager_review_required" queue fără să specifice unde se află acest UI.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Backend Lead + PM | Workflow OFFER → counter-offer → accept/reject + audit chain |
| **1.0.1** | **2026-06** | ★ Senior Architect + Frontend Lead | ★ PATCH — manager review queue clarification per **DP-05** (admin = Web only). |

---

## 1. Platform Matrix cross-ref

**Source canonical:** `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §8 (Modul 7 — OFFER Chain).

## 2. Clarificări platform

| Termen v1.0.0 | Platformă efectivă | Justificare |
|---|---|---|
| "Offer create" + "Counter-offer" | 🔁 BOTH | Web: form complet; Mobile: quick form 4 fields (Modul 7.1, 7.3) |
| "Offer accept/reject" | 🔁 BOTH | Confirm modal pe ambele (Modul 7.4) |
| "Offer chain visualization" | 🔁 BOTH | Web: split timeline buyer/seller; Mobile: linear list (Modul 7.2) |
| **"Manager review required" queue** ★ | 🌐 **WEB ONLY** | Per **DP-05** — manager actions (gating chain progression) niciodată pe Mobile (Modul 7.5) |
| "Offer state machine logging" | N/A backend | Server-side (Modul 7.6) |

## 3. Implementation note pentru M2.S1

T-M2.S1-07 (din Detailed Roadmap §5.1) implementează manager review queue — **EXPLICIT WEB ONLY**. Mobile primește notification push când offer e gating manager review, dar action-ul de approve/reject se face DOAR pe Web.

**Rationale DP-05:** Manager review queue afectează financial outcomes (commission split, deal closure); risk de greșeală pe Mobile (ecran mic, distractie in-field) e prea mare. Web cu confirm modal explicit reduce risk.

## 4. Backwards compatibility

State machine §5 (PENDING → COUNTER → ACCEPTED/REJECTED) + audit chain §audit + AC §13 din v1.0.0 — **identice neschimbate**.

## 5. Cross-references

- `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §8 (canonical)
- `MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md` §6.2 M2.S1 (T-M2.S1-06+07)
- `TECH_SPEC_REVYX_offer-engine_v1.0.0.md` (backend spec rămâne)

## 6. Approval

| Aprobator | Sign-off |
|---|---|
| Senior PM | ⬜ pending (S20) |
| Frontend Lead | ⬜ pending (S20) |

---

*docs/workflow/WORKFLOW_REVYX_offer-chain_v1.0.1.md · v1.0.1 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
