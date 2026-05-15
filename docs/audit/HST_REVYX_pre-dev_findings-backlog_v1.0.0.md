# HST #2 PRE-DEVELOPMENT — Findings Backlog
<!-- HST_REVYX_pre-dev_findings-backlog_v1.0.0.md · v1.0.0 · 2026-07 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## 0. Stage Master Plan

**Acoperă:** Pre-development / **S20 — HST #2 ⚠️ MANDATORY GATE — output secundar**. Gap closure tracking backlog pentru cele 8 findings NEW S20 (4 MED + 4 LOW) + 3 findings pre-existente reconfirmate TRACKED. Niciun finding CRIT/HIGH → backlog non-blocking M0.S1 entry. Tracking forward pentru reconciliere la M0.S5 HST M0 + M1.S2 + cycle post-GA.
**Master Plan ref:** `MASTER_PLAN_REVYX_execution-roadmap_v1.1.1.md` §7.2 + §8.3 severity matrix + §10 risk register R-11/R-14.
**Roadmap ref:** `ROADMAP_REVYX_detailed-execution_v1.0.0.md` §2.5 T-S20-10 (gap closure backlog output).
**Trio canonical citat:** Master Plan v1.1.1 + Platform Matrix v1.0.0 + Detailed Roadmap v1.0.0.

## 0.1 Platform Matrix

Findings affect cross-platform corpus: backend (NFR API p95), Web (UI design system + Web platform spec + Lighthouse), Mobile (NFR JS bundle), Backend (NTP cron, Stripe webhook). Per `PLATFORM_MATRIX_REVYX_web-mobile_v1.0.0.md` §19 (Cross-references către spec-uri sursă).

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| **1.0.0** | **2026-07** | Audit Lead + Senior PM + DOC | ★ Initial — gap closure backlog S20. **8 findings NEW (4 MED + 4 LOW)** + **3 findings pre-existente reconfirmate TRACKED**. Toate cu owner + ETA explicit; toate non-blocking M0.S1 entry (HST #2 PASS clean per main raport `HST_REVYX_pre-dev_v1.0.0.md` §9.1). Cross-ref HST raport principal + AUDIT_s13..s17 (sursă findings pre-existente). |

---

## 1. Scope backlog

**Trigger:** HST #2 raport principal `HST_REVYX_pre-dev_v1.0.0.md` §9 — triage table consolidate.

**Boundary:**
- **Cuprinde:** 8 findings NEW S20 + 3 findings pre-existente reconfirmate (F-S11-07, F-S14-02, F-S16-01)
- **Exclude:** Cele 13 findings F-S10..F-S15 CLOSED FULL (terminate, fără tracking forward)

**Status overall:** Toate findings sunt **MED** sau **LOW** — 0 CRIT, 0 HIGH. Non-blocking M0.S1 entry. M0.S1 unblock confirmat per `HST_REVYX_pre-dev_v1.0.0.md` §12.

---

## 2. NEW S20 findings (8 items)

### 2.1 MED findings (4 items)

| ID | Categorie | Descriere completă | Owner | ETA target | Trigger close | Cross-ref |
|---|---|---|---|---|---|---|
| **F-S20-04** | Spec Coverage (Cat 1) | Platform Matrix v1.0.0 §19 flag-uiește 2 specs LIPSEȘTE pre-gating viitor: `TECH_SPEC_REVYX_web-platform_vX.X.X` (gating M1.S5 Web Agent + M1.S6 Web Manager + M2.S2 Web Complete) + `TECH_SPEC_REVYX_ui-design-system_vX.X.X` (gating M0.S1 design tokens livrare). Confirmare: NU blockers HST #2 (sunt deliverables M0/M1 intrinsec, NU pre-condiție). | Senior Architect + DOC | ui-design-system: **M0.S1 close** · web-platform: **M1.S5 entry** | Documentul publicat în repo + INDEX entry | Master Plan §4.1 (M0.S1) + §5.5 (M1.S5) |
| **F-S20-08** | Ops Readiness (Cat 4) | NFR baseline metrics pentru API p95 latency (<200ms target), Web FCP (<1.5s AC-M1-09), Mobile JS bundle (<5MB DP-07) sunt **TBD M1/M2.S3**. Clarificare necesară în Master Plan §11 Definition of Done că NFR-uri sunt **deliverables M1/M2.S3** explicit, NU pre-condiții HST #2. | Senior Architect | Master Plan **v1.1.2 PATCH §11** clarification (acest sesiune S20) | Master Plan v1.1.2 publicat cu §11 updated | Master Plan §11 + AC-M1-09 + DP-07 |
| **F-S20-10** | Cross-cutting | DP-06 Brand consistency components (Card, Button, Modal, Input) Web + Mobile = deliverables M0.S1 design tokens (DESIGNER hat). Confirmare: NU blocker HST #2 (e gate intrinsec M0.S1, NU pre-condiție). | DESIGNER + Senior Architect | **M0.S1 close** (`design/tokens.json` + components Figma per T-M0.S1-09 + T-M0.S1-10) | M0.S1 exit gate passed | Master Plan §4.1 + Roadmap §3.1 |
| **F-S20-11** | Cross-cutting | Pilot WL EXTERN (post-Master GA cycle, 2-3 tenanți reali) per R-14 NEW post-GA. Findings noi pot apărea în M0+ scope dacă pilot scope se extinde pre-M0.S1 sau în paralel. Confirmare: pilot WL extern e activitate **post-S20**, NU pre-condiție HST #2. | Senior PM + Senior PO | **M0.S5 HST M0 re-evaluation** (cu data pilot extern dacă materializat până atunci) | HST M0 raport include section "pilot WL extern findings tracking" | Master Plan §10 R-14 + Raport Final Board §4.2 |

### 2.2 LOW findings (4 items)

| ID | Categorie | Descriere completă | Owner | ETA target | Trigger close | Cross-ref |
|---|---|---|---|---|---|---|
| **F-S20-05** | Spec Coverage (Cat 1) | INDEX v1.1.0 §12 count summary nota subțirimii listează "104 documente" în comentariu ("+2 vs v1.0.9 = 1 RAPORT_FINAL_BOARD + 1 CHECKLIST_pre-hst2"), dar header total + body §3-§11 reflectă 106. Discrepanță cosmetică. | DOC | **Acest sesiune S20** (inline correction la INDEX v1.1.1 PATCH bump) | INDEX v1.1.1 publicat cu nota subțirimii corectată | INDEX v1.1.0 §12 |
| **F-S20-06** | Cross-Spec (Cat 2) | Câteva cross-ref-uri legacy la BRD v1.0.0 [HISTORY] în spec-uri pre-Phase 5 (lead-scoring v1.0.0, property v1.0.0). Backwards compat full per BRD §changelog v1.1.0 ("BR-01..BR-12 neschimbate"), dar PATCH update recomandat pentru claritate post-dev. | Senior Architect + DOC | **M0.S2 close** (consolidate cu first PATCH bump pe spec-uri afectate când acestea sunt revizitate pentru wireframes context) | Spec-urile afectate au cross-ref-uri actualizate la BRD v1.1.0 | BRD v1.1.0 §changelog |
| **F-S20-07** | Ops Readiness (Cat 4) | CHECKLIST_pre-hst2 v1.0.0 §5.2 row 13.2 referențiază "BR-01..BR-18 mappable la spec-uri și teste". BRD v1.1.0 actual conține BR-01..BR-24 (BR-13..BR-18 churn + BR-19..BR-21 white-label + BR-22..BR-24 mobile). Discrepanță cosmetică — referința "BR-01..BR-18" e subset realist (BR-01..BR-12 baseline + BR-13..BR-18 churn = 18 cele mai relevante pentru pilot M1). | DOC | **Acest sesiune S20** (inline correction în HST raport §6.2 row 13.2 corectat la "BR-01..BR-24") | HST_REVYX_pre-dev v1.0.0 §6.2 row 13.2 corectat | CHECKLIST_pre-hst2 §5.2 + BRD §6.1 |
| **F-S20-09** | Approval (Cat 5) | Token budget upgrade Pro $20/lună → Max $100/lună anticipat M1.S3 (Lead Scoring engine complexitate ridicată). CFO sign-off post-S20 pending. Non-blocking M0 (M0 sustained Pro plan adequate $20-40/lună per Master Plan §9.3). | Senior PM + CFO | **Pre-M1.S3 entry** (cca M1.S2 close — anticipat post-M0 close cca 2-3 luni post-S20) | CFO sign-off ratified + Max plan activat | Master Plan §9.3 + R-01 + R-07 |

---

## 3. Reconfirmed TRACKED findings (3 items — pre-S20)

Per HST #2 raport principal §9.3, aceste findings rămân **TRACKED unchanged** post-S20 verify.

| ID | Sursă audit | Sev | Descriere completă | Status @ S20 | Owner | Cycle target | Cross-ref |
|---|---|---|---|---|---|---|---|
| **F-S11-07** | S12 (audit BRD v1.1 + churn-ga v1.0.0 + DPIA v1.0.0) | LOW | DPIA Art. 35 §8 "less-intrusive-alternative" review programat T+91+90d (cca 2026-10-25). Justificare actuală în DPIA v1.0.1 §8 explică rationale "minim necesar" (churn flag CS-only, no agent share BR-18). Re-review periodic mandatory per Art. 35(11) GDPR. | 📋 TRACKED next cycle (post-GA review) | DPO + Senior Compliance | **2026-10-25** (T+91+90d post-Master GA decision) | DPIA v1.0.1 §8 + Master Plan §0.4 + AUDIT_s12 §7 |
| **F-S14-02** | S15 (post-Stage 2 marketplace audit) | LOW | Stripe webhook idempotency fallback code change PR. Currently: Stripe primary signature verification activă + audit-log `BUYER_PAYMENT_*` events emise; idempotency cache TTL 24h funcțional. Fallback secondary path (dacă Stripe key rotation glitch) = backlog feature non-critical. | 📋 TRACKED pre-GA backlog (unchanged S20) | Backend Lead | **Post-GA cycle (S22+)** — non-blocking M0/M1 entry; pickup când Phase D backend dev active | AUDIT_s15 §7.5 + Raport Final Board v1.0.0 §5 R-15 |
| **F-S16-01** | S17 (post-Stage 4 churn audit) | LOW | NTP skew cron observability — watchdog + `CRON_SKEW_DETECTED` audit-log event v1.2.0 future. Currently: timezone normalization UTC+2 forțat în toate calculele scoring; NTP sync via system level. Observability gap (lipsește alert pe drift NTP >5min) = backlog feature non-critical pentru pilot pre-GA. | 📋 TRACKED pre-GA backlog (unchanged S20) | Backend Lead + Senior DBA | **Post-GA cycle (S22+)** — non-blocking; audit-log v1.2.0 bump când implementat | AUDIT_s17 §7.5 + Raport Final Board v1.0.0 §5 R-16 |

---

## 4. Triage methodology

Per `MASTER_PLAN_REVYX_execution-roadmap_v1.1.1.md` §8.3 severity matrix:

| Severitate | Acțiune | S20 application |
|---|---|---|
| **CRIT** | FIX IMMEDIATE pre-merge | n/a — 0 CRIT |
| **HIGH** | FIX în fix sprint pre-milestone exit | n/a — 0 HIGH |
| **MED** | Triage → backlog cu owner | ✅ 4 MED — toate cu owner+ETA (non-blocking M0.S1) |
| **LOW** | Backlog general | ✅ 4 LOW NEW + 3 LOW reconfirmed TRACKED (non-blocking M0.S1) |

**Justificare 0 CRIT/HIGH:** Stabilitate audit Phase 5 sustained (zero new finding S17+S18+S19); Phase 5 GA decision GO unanimous T+91 ratified board S19. HST #2 verify-cycle confirmă continuarea pattern-ului — toate findings NEW S20 sunt observation-level (spec gap M0/M1 deliverable intrinsec + cosmetic doc + NFR clarification + token budget + DP-06 deliverable + R-14 forward tracking + 2 cosmetic doc fixes).

---

## 5. Forward tracking schedule

| Milestone | Findings tracked verify | Trigger event |
|---|---|---|
| **Acest sesiune S20** | F-S20-05 inline fix INDEX v1.1.1 PATCH · F-S20-07 inline fix HST §6.2 · F-S20-08 inline fix Master Plan v1.1.2 §11 | HST PASS + commits acest sesiune |
| **M0.S1 close** | F-S20-04 (ui-design-system) closed · F-S20-10 (DP-06 brand components) closed | M0.S1 exit gate passed (`design/tokens.json` + components Figma livrate) |
| **M0.S2 close** | F-S20-06 (BRD cross-ref legacy) closed | Spec-uri afectate revizitate cu wireframes context — PATCH bump cu cross-ref updated |
| **M0.S5 HST M0** | F-S20-11 (R-14 pilot WL extern) re-evaluation | HST M0 raport include section "pilot WL extern findings" |
| **M1.S2 close** | F-S20-09 (token budget Pro→Max) closed | CFO sign-off ratified + Max plan activat pre-M1.S3 |
| **M1.S5 entry** | F-S20-04 (web-platform spec) closed | Spec publicat în repo + INDEX entry |
| **Post-GA cycle S22+** | F-S14-02 (Stripe idempotency) + F-S16-01 (NTP cron) closed | Backend Lead PR-uri Phase D backend dev cycle |
| **2026-10-25 (T+91+90d)** | F-S11-07 (DPIA less-intrusive review) closed | DPO + Senior Compliance review session |

---

## 6. Cross-references

- `docs/audit/HST_REVYX_pre-dev_v1.0.0.md` v1.0.0 — raport principal HST #2 (acest backlog = output secundar T-S20-10)
- `MASTER_PLAN_REVYX_execution-roadmap` v1.1.1 §8.3 (severity matrix) + §10 (risk register R-11/R-14) → v1.1.2 PATCH §11 NFR clarification per F-S20-08
- `ROADMAP_REVYX_detailed-execution` v1.0.0 §2.5 T-S20-10 (gap closure backlog)
- `PLATFORM_MATRIX_REVYX_web-mobile` v1.0.0 §19 (lipsuri spec semnalate F-S20-04)
- `BRD_REVYX_v1.1.0.md` §6.1 BR-01..BR-24 (referință F-S20-07)
- `INDEX_REVYX_documents` v1.1.0 §12 (referință F-S20-05) → v1.1.1 PATCH acest sesiune
- `CHECKLIST_pre-hst2` v1.0.0 §5.2 (referință F-S20-07)
- `AUDIT_REVYX_s12-external-pass` (F-S11-07 sursă) + `AUDIT_REVYX_s15` (F-S14-02 sursă) + `AUDIT_REVYX_s17` (F-S16-01 sursă)
- `RAPORT_FINAL_BOARD_phase5-ga` v1.0.0 §5 R-14/R-15/R-16 (post-GA forward risks tracking)
- `DPIA_REVYX_phase5` v1.0.1 §8 (F-S11-07 baseline)
- `CLAUDE.md` v1.2.2 §10b Regula 3 (audit checkpoint trigger 1) + Regula 8 (Master Plan compliance) + Regula 9 (Platform Matrix compliance)

---

## 7. Approval

| Aprobator | Rol | Sign-off | Data |
|---|---|---|---|
| Audit Lead | Backlog orchestrare + triage table | ✅ | 2026-07 |
| Senior PM | Owner+ETA assignments + forward tracking schedule | ✅ | 2026-07 |
| Senior Solution Architect | F-S20-04 + F-S20-06 + F-S20-08 + F-S20-10 + F-S20-11 acknowledged | ✅ | 2026-07 |
| Senior Security Auditor | F-S11-07 reconfirmed TRACKED next cycle | ✅ | 2026-07 |
| DPO | F-S11-07 next cycle owner | ✅ | 2026-07 |
| Senior Compliance Auditor | F-S11-07 + reconfirmed TRACKED items | ✅ | 2026-07 |
| CFO | F-S20-09 token budget tracking | ⬜ pending (post-S20) | — |

---

*docs/audit/HST_REVYX_pre-dev_findings-backlog_v1.0.0.md · v1.0.0 · 2026-07 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
