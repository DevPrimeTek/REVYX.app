# TECH SPEC — REVYX ML Pricing GA (Platform Clarification PATCH)
<!-- TECH_SPEC_REVYX_ml-pricing-ga_v1.0.3.md · v1.0.3 · 2026-06 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** M2.S2 (Web Platform Complete — ML promote UI 4-eyes) + M2.S4 (Phase F ML Pricing backend)
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md` §6.2 M2.S2 + §6.2 M2.S4
**Trigger:** Audit S15-bis-3 finding — spec v1.0.0/v1.0.2 menționează "pricing dashboard" și "4-eyes promote" fără să specifice că UI e Web only.

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-04 | DS Lead + Solution Architect | ML Pricing GA initial spec — model registry + SHADOW/CANARY/GA gates + 4-eyes |
| 1.0.2 | 2026-05 | DS Lead + Senior DBA | PATCH F-03 HIGH — `pricing_model_registry` rename → `ml_model_registry` (migrare 0600) |
| **1.0.3** | **2026-06** | ★ Senior Architect + Frontend Lead + SECURITY | ★ PATCH — **DP-05 enforcement clarification**: ML promote 4-eyes UI = WEB ONLY (admin role); Pricing prediction display per property = BOTH; Bias monitoring dashboard = WEB ONLY (admin + DS Lead). |

---

## 1. Platform Matrix cross-ref

**Source canonical:** `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §15 (Modul 14 — ML Pricing & Churn).

## 2. Clarificări platform

| Termen v1.0.0/v1.0.2 | Platformă efectivă | Justificare |
|---|---|---|
| "Pricing prediction display" (per property) | 🔁 BOTH | Same widget Web + Mobile (Modul 14.1) |
| "Pricing override agent" | 🔁 BOTH | Form + audit pe ambele platforme (Modul 14.2) |
| **"4-eyes promote UI" (ML Model promote CANARY/GA)** ★ | 🌐 **WEB ONLY** | Per **DP-05** — admin action critical (financial impact tenant-wide); 2-step REQUEST/APPROVE flow pe Web cu confirm modal explicit (Modul 14.3) |
| "Bias monitoring dashboard" | 🌐 **WEB ONLY** | Per DP-05 — admin + DS Lead role; Recharts heatmap pe ecran mare (Modul 14.4) |
| "Auto-rollback alert" | N/A backend trigger | Server-side; UI doar afișează rezultat |

## 3. Implementation note pentru M2.S2 (T-M2.S2-05) + M2.S4

### 3.1 Web ML Promote UI (M2.S2 T-M2.S2-05)
- Route: `/admin/ml-models`
- RBAC: admin + data_science_lead only
- Flow: 2-step
  - **Step 1 REQUEST**: admin_a (e.g., DS Lead) creează `PRICING_MODEL_4EYES_REQUEST` event cu model_id + target_cohort + justification (text 200-1000 chars)
  - **Step 2 APPROVE**: admin_b (e.g., Security Lead, DIFERIT user) primește notification în-app + email; deschide request, validează, approve cu `PRICING_MODEL_4EYES_APPROVED` event
  - Expire: 24h post-REQUEST dacă neaprobată
- UI components: shadcn/ui Form + Confirm Modal + Diff View (model card vs current production)
- Audit log: ambele events catalogați în `audit-log` v1.1.1 §4.4.1

### 3.2 Mobile (NU în scope per DP-05)
- Mobile vede Pricing prediction (read-only) pe property detail
- Mobile NU are acces la `/admin/*` routes (DP-05 client-side guard + server-side RBAC enforce)
- Dacă admin încearcă să acceseze ML promote din Mobile → redirect la Web URL `https://app.revyx.app/admin/ml-models` cu mesaj "Această acțiune se face doar pe Web"

### 3.3 Bias monitoring dashboard (M2.S4 T-M2.S4-05 + M2.S2)
- SQL job daily 03:00 UTC rămâne backend (T-M2.S4-05)
- Web UI vizualizare daily report → Web only (T-M2.S2-... — adaug T-M2.S2-14 în Detailed Roadmap viitor)

## 4. Backwards compatibility

Migrare 0600 (`ml_model_registry` rename) + audit events PRICING_MODEL_* + auto-rollback policy + bias check formulas — **identice neschimbate**.

## 5. Security implications

DP-05 violation pe Mobile pentru ML promote = **CRITICAL**. SECURITY hat la M2.S3 trebuie să verifice că Mobile RBAC client-side guard blochează DEFINITIV `/admin/*` deep-links. Server-side RBAC va refuza oricum, dar UX trebuie să fie clear.

## 6. Cross-references

- `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §15 (canonical)
- `MASTER_PLAN_REVYX_execution-roadmap_v1.1.0.md` §6.2 M2.S2 + M2.S4
- `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §5.2 T-M2.S2-05 + §5.4 T-M2.S4-06
- `TECH_SPEC_REVYX_ml-pricing-ga_v1.0.0.md` + `_v1.0.2.md` (backend spec rămâne)
- `RUNBOOK_REVYX_stage3-ml-pricing-launch_v1.0.0.md` (operational runbook)
- `audit-log_v1.1.1` §4.4.1 PRICING_MODEL_* events

## 7. Approval

| Aprobator | Sign-off |
|---|---|
| Senior Architect | ⬜ pending (S20) |
| DS Lead | ⬜ pending (S20) |
| SECURITY Lead | ⬜ pending (S20) |
| Frontend Lead | ⬜ pending (S20) |

---

*docs/tech-spec/TECH_SPEC_REVYX_ml-pricing-ga_v1.0.3.md · v1.0.3 · 2026-06 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
