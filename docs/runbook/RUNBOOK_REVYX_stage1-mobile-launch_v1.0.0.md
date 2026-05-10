# RUNBOOK — REVYX Phase 5 Stage 1 Mobile TestFlight launch (T+0 → T+14)
<!-- RUNBOOK_REVYX_stage1-mobile-launch_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Mobile Lead + Senior QA + CS Lead + Solution Architect + Audit Lead | ★ Initial — operational runbook day-by-day Stage 1 (Mobile TestFlight) per `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §4 + `TECH_SPEC_REVYX_mobile-rn` v1.0.0 §16 · cohort selection 25 interni + 25 externi · App Store submit · TestFlight invite cadence · daily health check criteria · exit gate verification protocol · rollback decision tree expandat |

---

## 1. Scop

Acest runbook este **operational day-by-day** pentru Stage 1 Phase 5 (Mobile TestFlight closed beta). Master gate `phase5-rollout-sequence` v1.0.0 §4 definește entry/exit gates; acest doc descrie **execuția** zilnică cu owners, comenzi, audit events așteptate.

| Atribut | Valoare |
|---|---|
| Stage | 1 — Mobile TestFlight (closed beta) |
| Durată | T+0 → T+14 zile (cu opțiune extension +7 zile dacă health gate indică defer) |
| Cohort target | 25 agenți interni REVYX + 25 early-adopters tenant pilot = **50 utilizatori** |
| Distribuție | TestFlight (iOS) + Play Internal Track (Android) |
| Owner | Mobile Lead (execuție) · CS Lead (cohort) · Senior QA (health) · Audit Lead (gating) |
| Timezone | UTC+2 (Chișinău) — toate timestamp-urile interne |
| Cross-spec | `mobile-rn` v1.0.0 · `audit-log` v1.1.1 §4.4.4 (`MOBILE_*` + `AUTH_MOBILE_*`) + §4.4.9 (`PHASE5_*`) · `DPIA_REVYX_phase5` v1.0.0 §5.4 · `SCC_VENDORS_phase5` v1.0.0 §3.1 + §3.2 |

---

## 2. Pre-flight T-7 (verificare entry gates)

| # | Gate (din `phase5-rollout-sequence` §4.1 + `READINESS_REVYX_phase5` §3.1) | Owner | Verificare |
|---|---|---|---|
| 2.1 | App Store Connect: build TestFlight uploaded + privacy questionnaire submitted | Mobile Lead | Screenshot ASC "Waiting for Review" |
| 2.2 | FCM (Android) credentials provisioned + Play Internal Track build uploaded | Mobile Lead | Play Console Internal Track listed |
| 2.3 | E2E `assertNoPII(push_payload)` snapshot tests verde 100% | Senior QA | CI run link + test report PII coverage =100% |
| 2.4 | Min supported app version pinned (`MOBILE_VERSION_UNSUPPORTED` test pass) | Solution Architect | E2E test PASS |
| 2.5 | Backend support `MOBILE_DEVICE_*` + `AUTH_MOBILE_OT_*` events live (audit-log v1.1.1 §4.4.4) | Backend Lead | Smoke test cu staging tenant — 8 events emit |
| 2.6 | OT flow rate-limited (per `iso27001-track`) | Security Lead | Rate-limit test 6 OT/min/IP failed cu 429 |
| 2.7 | Cohort selectat (25 interni REVYX + 25 externi — 5 tenants pilot × 5 agenți) | CS Lead | List Excel cu signed acord beta |
| 2.8 | ★ SCC Apple FCM + Google Push semnați | DPO + Legal | `SCC_VENDORS_phase5` §3.1 + §3.2 status 🟢 |
| 2.9 | Sentry mobile project + dashboards online | Senior QA | Project URL + alert rule deployed |
| 2.10 | Slack #mobile-pilot + #mobile-incidents canale create + on-call rotation Mobile Lead | CS + Mobile | Slack channel pinned |

**Decizie pre-flight:** dacă **toate** ☑ → emit `PHASE5_STAGE_ENTRY` event (manual, owner: Mobile Lead via admin tool); altfel defer +1 săpt.

---

## 3. Sequence day-by-day

### 3.1 T+0 (Luni) — Build submit + Internal QA

| Ora (UTC+2) | Acțiune | Owner | Output / Audit event |
|---|---|---|---|
| 09:00 | Pre-flight 3-eyes sync (VP Product + CTO + Audit Lead) confirmare GO | Audit Lead | `READINESS_REVYX_phase5` §2.1 ☑ |
| 10:00 | Submit build TestFlight (iOS) + Play Internal Track (Android) | Mobile Lead | ASC "Waiting for Review" + Play Console "Available on Internal" |
| 10:30 | Emit `PHASE5_STAGE_ENTRY` event (manual via admin tool) cu metadata `{stage:1, stage_name:'mobile_testflight', entry_gates_status:'PASS', approver_ids:[...], dpia_version:'1.0.0', readiness_doc_uri}` | Mobile Lead | AUDIT_LOG event verified |
| 11:00 | Invite 5 internal QA (REVYX team) la TestFlight | Mobile Lead | TestFlight `invitation` audit + `MOBILE_DEVICE_REGISTERED` × 5 |
| 14:00 | Smoke test flow login OT → push permission → first push | QA Lead + 5 testers | `AUTH_MOBILE_OT_ISSUED` + `AUTH_MOBILE_OT_EXCHANGED` + `MOBILE_PUSH_SENT` × 5 |
| 17:00 | Daily standup #mobile-pilot — green/red status | Mobile Lead | Slack thread |

**Health threshold T+0:** crash-free sessions ≥99% pe 5 testeri (zero crashes preferabil).

### 3.2 T+1 → T+2 (Marți–Miercuri) — Apple review wait

Apple review típic 1–3 zile. Activități paralele:

- Senior QA monitorizează zilnic Sentry mobile project pentru zero erori on internal cohort.
- Backend Lead monitorizează AUDIT_LOG `MOBILE_PUSH_RECEIPT_FAILED` rate (target <1%).
- CS Lead pregătește email-template invite cohort 25 interni REVYX (RO + RU) + 25 externi tenants pilot.

**Audit events așteptate:** doar internal cohort (5 testeri).

**Trigger rollback intermediate:** dacă Apple review respinge → patch + re-submit; dacă crash-free <97% pe 5 testeri → defer review + investigate.

### 3.3 T+3 (Joi) — Apple review pass + invite cohort 25 interni

| Ora (UTC+2) | Acțiune | Owner | Output |
|---|---|---|---|
| 09:00 | Verificare ASC review: status `Approved` (assume; altfel defer day) | Mobile Lead | ASC notification |
| 10:00 | Send TestFlight invite link cohort 25 interni (email + Slack DM) cu instrucțiuni install (RO+EN) | CS Lead | Email tracking link |
| 10:00–18:00 | Accept invite + install + first login (target: 20/25 = 80% by EOD) | Cohort | `MOBILE_DEVICE_REGISTERED` × ~20 + `AUTH_MOBILE_OT_EXCHANGED` × ~20 |
| 16:00 | Health check intermediar | Senior QA | `MOBILE_PUSH_SENT` rate, `MOBILE_PUSH_RECEIPT_FAILED` rate, Sentry crash-free |
| 17:00 | Standup mobile-pilot | Mobile Lead | Slack thread |

**Health threshold T+3:** install rate ≥80% (20/25), crash-free ≥99%, OT success ≥98%.

### 3.4 T+4 → T+6 (Vineri–Duminică) — Internal cohort live use

- Cohort folosește app în lucru zilnic (lead lookup, scoring, NBA, push notif HOT lead).
- Telemetria zilnică (Sentry + AUDIT_LOG):
  - `MOBILE_PUSH_SENT` count expected: ~5–10/agent/zi (push HOT leads + reminders).
  - Push delivery rate (= 1 − `MOBILE_PUSH_RECEIPT_FAILED` / `MOBILE_PUSH_SENT`) target ≥95%.
  - `assertNoPII` snapshot CI: zero failures (verificare la fiecare PR de hotfix mobile).
- Senior QA emite raport zilnic pe Slack #mobile-pilot la 17:00 cu metrici.
- CS Lead colectează feedback ad-hoc (Slack DM + Form NPS).

**Trigger rollback intermediate:**
- Crash rate >2% sustained 24h → revoke TestFlight build + force `MOBILE_DEVICE_REVOKED reason='ADMIN'` (no security flag).
- `assertNoPII` regression detectat → STOP TestFlight expansion + patch + re-submit.

### 3.5 T+7 (Luni) — Day 7 health check + cohort expansion 25 externi

| Ora | Acțiune | Owner | Output |
|---|---|---|---|
| 09:00 | Day 7 health review meeting (Mobile Lead + Senior QA + Audit Lead) | Mobile Lead | Decision sheet GO/NO-GO expansion |
| 09:30 | Verificare gate criteria T+7: crash-free ≥99% · push delivery ≥95% · OT success ≥98% · 0 `assertNoPII` regress · 0 bug critic | Senior QA | Health report |
| 10:00 | Dacă GO → invite 25 externi (5 tenants × 5 agenți). Email-template tradus RO + RU + EN | CS Lead | TestFlight invites + Slack #mobile-pilot |
| 10:00–18:00 | Cohort externi accept + install (target ≥18/25 by EOD = 72%) | Cohort | `MOBILE_DEVICE_REGISTERED` × ~18 + `AUTH_MOBILE_OT_EXCHANGED` × ~18 |
| 17:00 | Standup | Mobile Lead | Slack thread |

**Decizie GO/NO-GO expansion:** dacă oricare gate <target → defer expansion +3 zile + remediere.

### 3.6 T+8 → T+13 (Marți–Duminică) — Full cohort 50 utilizatori

- Telemetria continuă (vezi §3.4) cu cohort scaled.
- CS Lead colectează NPS zi 10 (Form): target ≥+30.
- Senior QA monitorizează `MOBILE_PUSH_RECEIPT_FAILED` rate alert (audit-log §4.4.4 — alert fired = blocker).
- Mobile Lead triajează bug reports din Slack #mobile-pilot — orice bug critic deschis blochează exit gate.

**Trigger rollback (full cohort):**
- Crash rate >2% sustained 24h pe full cohort → revoke build + email cohort + investigate.
- NPS <0 sau panică cohort → PAUSE expansion 7 zile + CS Lead 1:1 cohort.
- Push delivery <90% sustained 1h → emit `MOBILE_PUSH_RECEIPT_FAILED` analysis + investigate FCM/APNS quotas + downgrade cohort 50%.

### 3.7 T+14 (Luni) — Exit gate review + Stage 2 readiness

| Ora | Acțiune | Owner | Output |
|---|---|---|---|
| 09:00 | Compile metrici exit gate (`READINESS_REVYX_phase5` §3.2) | Senior QA | Metrics CSV + dashboard screenshot |
| 10:00 | Exit gate review meeting (VP Product + CTO + Audit Lead) | Audit Lead | Sign-off ☑ sau hold |
| 10:30 | Dacă PASS → emit `PHASE5_STAGE_EXIT_PASS` event manual cu `{stage:1, stage_name:'mobile_testflight', exit_metrics:{...}, ready_for_next_stage:true, signed_off_by:[vp_product,cto,audit_lead]}` | Mobile Lead | AUDIT_LOG |
| 11:00 | Update `READINESS_REVYX_phase5` §3.2 cu valori măsurate + ☑ sign-off | Audit Lead | Doc commit |
| 11:30 | Pre-flight sync Stage 2 (Marketplace pilot) — entry gates §4.1 din phase5-rollout-sequence | Audit Lead + CS Lead | Slack #phase5-rollout |
| 14:00 | Retrospective Stage 1 — Slack #mobile-pilot — lessons learned + `RETROSPECTIVE_STAGE1.md` notes | Mobile Lead | Notes |

---

## 4. Daily health check protocol

Senior QA rulează **zilnic la 17:00 UTC+2** următorul protocol și postează în Slack #mobile-pilot:

```
T+<N> Health Report — Stage 1 Mobile TestFlight

1. Sentry crash-free sessions: __% (target ≥99%)
2. Push delivery rate: __% (target ≥95%)
3. MOBILE_PUSH_RECEIPT_FAILED count (24h): __
4. AUTH_MOBILE_OT_EXCHANGED success rate: __%
5. AUTH_MOBILE_OT_INVALID_ATTEMPT count (24h): __ (alert >50/h)
6. assertNoPII snapshot CI: PASS/FAIL
7. Open bug critic: __ (target 0)
8. Cohort install rate: __/__ (target ≥80%)
9. NPS in-progress: __ (final at T+10)
10. Verdict: 🟢 / 🟡 / 🔴
```

**Threshold escalation:**
- 🟡 → email Mobile Lead + Senior QA + Audit Lead.
- 🔴 → page Mobile Lead via PagerDuty + emergency standup în 2h + invocă §5 rollback decision tree.

---

## 5. Rollback decision tree (expandat din `phase5-rollout-sequence` §4.4)

```
[Crash rate >2% sustained 24h?]
   ├─ YES (full cohort):
   │     ├─ ROLLBACK A: revoke TestFlight build (ASC → expire build)
   │     ├─ Force `MOBILE_DEVICE_REVOKED reason='ADMIN'` pentru toate dispozitive cohort
   │     │     (NO security flag — `reason='COMPROMISED'` ar trigger DPA breach notification)
   │     ├─ Email cohort RO+RU+EN cu apologize + ETA fix
   │     └─ Open `INC_DECLARED severity:P2` (per `incident-response`)
   ├─ YES (numai internal cohort 5 testeri):
   │     ├─ Patch + re-submit fără rollback PR de cohort
   │     └─ Defer T+3 invite externi cu N zile = ETA fix
   └─ NO → next branch

[Push delivery <90% sustained 1h?]
   ├─ INVESTIGATE:
   │     ├─ FCM quota status (Google Cloud Console)
   │     ├─ APNS feedback service (Apple)
   │     └─ Backend rate limiter `mobile-rn` §6.3
   ├─ Mitigation: downgrade cohort 50% + retry pattern
   └─ Resume after 30 min stable >95%

[assertNoPII regression CI?]
   ├─ STOP TestFlight expansion (no new invites)
   ├─ Hotfix branch + re-test snapshot
   ├─ DPO notification (per DPIA §5.4)
   └─ INC_DECLARED severity:P3 (PII risk; not breach yet)

[NPS <0 sau panic cohort?]
   ├─ PAUSE expansion 7 zile
   ├─ CS Lead 1:1 cu fiecare agent panic
   └─ Re-evaluate UX

[AUTH_MOBILE_OT_INVALID_ATTEMPT >50/h sustained 1h?]
   ├─ Possible OT brute force attack
   ├─ Security Lead invocă rate limiter aggressive (1/min/IP)
   ├─ INC_DECLARED severity:P2 (security)
   └─ Forensic analysis pe IP-uri suspecte
```

**Rollback execution audit:** orice rollback emite `PHASE5_STAGE_ROLLBACK` event manual cu metadata `{stage:1, rollback_reason, decision_tree_branch, rollback_executed_by, rollback_at, follow_up_inc_id?}`.

---

## 6. Audit events expected (Stage 1 cumulative)

| Event | Source | Expected count T+14 | Threshold |
|---|---|---|---|
| `PHASE5_STAGE_ENTRY` (stage=1) | Manual T+0 | 1 | exact 1 |
| `MOBILE_DEVICE_REGISTERED` | Per cohort install | ~50 | ≥45 (90% cohort) |
| `MOBILE_DEVICE_REVOKED` | reason='ADMIN' (logout) | <5 | <10% cohort |
| `AUTH_MOBILE_OT_ISSUED` | Per login attempt | ~150 | ~3/agent |
| `AUTH_MOBILE_OT_EXCHANGED` | Per successful exchange | ~140 | ≥98% of issued |
| `AUTH_MOBILE_OT_INVALID_ATTEMPT` | Brute force/typo | <20 | alert >50/h |
| `MOBILE_PUSH_SENT` | Per HOT lead + reminder | ~3500 | ~5–10/agent/zi × 14 zile × 50 agenți |
| `MOBILE_PUSH_RECEIPT_FAILED` | Delivery failure | <175 | <5% |
| `MOBILE_VERSION_UNSUPPORTED` | Forced upgrade | 0 | exact 0 (build new) |
| `PHASE5_STAGE_EXIT_PASS` (stage=1) | Manual T+14 | 1 | exact 1 dacă PASS |

---

## 7. Cohort selection criteria

### 7.1 Cohort intern REVYX (25 utilizatori)

- Toți agenți REVYX/ITPRO senior + middle (vechime ≥6 luni).
- Mix dispozitive: ≥10 iOS + ≥10 Android + 5 cu device split (work + personal).
- Mix limbi: ≥15 RO + ≥10 RU.
- Acord scris beta (1-pager: feedback rapid + bug reporting + confidențialitate Phase 5 specs).

### 7.2 Cohort extern tenants pilot (25 utilizatori)

- 5 tenants pilot (din lista Stage 2 marketplace candidates) × 5 agenți tenant fiecare.
- Selecție tenant: GROWTH tier+ + acord NDA semnat + DPA semnat.
- Selecție agent: top performer per tenant (high APS) + middle performer (median APS) — bias mitigation.
- Mix limbi: tenant-specific (RO/RU primarily).
- Acord beta scris (template `CHURN_*` retention + feedback obligation).

### 7.3 Exclusion criteria

- Agenți cu <30 zile vechime (APS_default 0.65 nu valid).
- Tenants cu istoric incident P1/P2 ultimele 90 zile.
- Dispozitive jailbroken/rooted (per `mobile-rn` §12.6 risk warning).

---

## 8. Cross-references

- `RUNBOOK_REVYX_phase5-rollout-sequence` v1.0.0 §4 — master gate Stage 1
- `READINESS_REVYX_phase5` v1.0.x §3 — sign-off matrix Stage 1
- `TECH_SPEC_REVYX_mobile-rn` v1.0.0 §16 — rollout plan + §13 observability + §15 testing
- `TECH_SPEC_REVYX_audit-log` v1.1.1 §4.4.4 — `MOBILE_*` + `AUTH_MOBILE_*` events + §4.4.9 — `PHASE5_*` events
- `SCC_VENDORS_phase5` v1.0.0 §3.1 + §3.2 — SCC Apple/Google blocker
- `DPIA_REVYX_phase5` v1.0.0 §5.4 — mobile DPIA per-feature analysis
- `RUNBOOK_REVYX_incident-response` v1.0.0 — INC declaration protocol
- `AUDIT_REVYX_s12-external-pass` v1.0.0 — gating findings closed pre-T0

---

## 9. Approval

| Aprobator | Sign-off |
|---|---|
| Mobile Lead | ✅ |
| Senior QA / Test Architect | ✅ |
| CS Lead | ✅ |
| Solution Architect | ✅ |
| Audit Lead | ✅ |
| CTO | ✅ |
| VP Product | ✅ |

---

*docs/runbook/RUNBOOK_REVYX_stage1-mobile-launch_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
