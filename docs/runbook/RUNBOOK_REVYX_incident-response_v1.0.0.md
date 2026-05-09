# RUNBOOK — INCIDENT RESPONSE
<!-- RUNBOOK_REVYX_incident-response_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Security Lead + CTO + DPO + DevOps Lead | ★ Runbook inițial S9 — Incident Response procedure formal · obligatoriu ISO 27001 G-03 (HIGH gap din `iso27001-track` v1.0.0) · Annex A 5.24-28 · severity matrix · GDPR Art.33 72h notification · tabletop annual |

---

## 1. Scope

Procedură formală de **Incident Response (IR)** pentru REVYX SaaS. Acoperă: detection, triage, containment, eradication, recovery, post-mortem. Aliniat cu ISO 27001:2022 Annex A.5.24-28 + GDPR Art. 33 (notificare 72h).

| Atribut | Valoare |
|---|---|
| Tipuri incident acoperite | Security · Privacy/breach · Outage · Data integrity · Compliance |
| Owner program | Security Lead (Incident Commander) |
| On-call rotation | DevOps + Security + Eng Lead (rotație săptămânală) |
| Tabletop frecvență | Annual (M+12 după fiecare runbook update) |
| Communication tool primar | Slack `#incidents` (audit) + PagerDuty |

---

## 2. Severity matrix

| Sev | Descriere | Exemplu | Response time | Escalare |
|---|---|---|---|---|
| **P1 — Critical** | Production down · breach activ · data loss confirmed | Lead PII exposed public · DB unreachable >5min · ransom note | **15 min ack · 1h IC mobilizat** | CTO + DPO + Legal imediat |
| **P2 — High** | Functionality majoră degradată · breach posibil | Match engine 50% slower · suspicious admin action | 30 min ack · 4h plan | Security Lead + Eng Lead |
| **P3 — Medium** | Functionality minor degradată · low-impact bug | Pricing alert flap · push notification delay | 4h ack · 24h plan | On-call team |
| **P4 — Low** | Cosmetic · single-user · workaround disponibil | UI label typo · single failed retry | 1 day ack · backlog | Standard ticket |

### 2.1 GDPR breach trigger

Orice incident care implică **PII expusă, alterată sau pierdută** = **P1 mandator** + DPO notificat în 1h. Clock GDPR Art. 33 (72h notify supervisory authority) **începe** la momentul detectării (NU la momentul triajului).

---

## 3. Phases (NIST-aligned)

### 3.1 Phase 1 — Detection

**Surse:**
- Prometheus alerts → PagerDuty
- Sentry crash spike
- AUDIT_LOG anomaly (ex: `AUTH_REFRESH_REUSE` repeat, mass `BUYER_PII_REVEALED`)
- Customer report (Slack, email)
- Internal staff observation
- 3rd party (security researcher, supplier)

**Action:** First responder declară incident în Slack `#incidents` cu severity tentative + IC stub.

### 3.2 Phase 2 — Triage (≤15 min P1, 30 min P2)

**Incident Commander (IC)** desemnat (rotație on-call sau senior care ack):
1. Confirmă severity (poate downgrade/upgrade).
2. Deschide canal dedicat `#inc-{YYYY-MM-DD}-{shortname}`.
3. Asignează roluri: IC, Tech Lead, Comms Lead, Scribe.
4. Trigger PagerDuty pentru P1/P2.

### 3.3 Phase 3 — Containment

**Short-term containment (minute):**
- Block IP/user if attack: WAF rule + revoke session
- Take down endpoint if breach: feature flag OFF
- Failover to read-replica if DB corrupted

**Long-term containment (ore):**
- Patch hotfix
- Rotate compromised secrets (KMS keys, API tokens)
- Quarantine affected systems

### 3.4 Phase 4 — Eradication

- Identifică root cause (cu Tech Lead).
- Remove malware / closed exploit / fix bug.
- Verify no persistence.

### 3.5 Phase 5 — Recovery

- Restore service incremental.
- Monitor 24-72h post-restore pentru recurență.
- Communicate "all clear" la stakeholders.

### 3.6 Phase 6 — Post-mortem (T+7d max)

- Blameless format.
- Output: timeline, root cause, contributing factors, action items cu owner + ETA.
- Publicat intern (`docs/post-mortems/{date}-{shortname}.md`).
- Feed înapoi în Risk Register + runbook updates.

---

## 4. Communication templates

### 4.1 Internal — initial declare

**Slack `#incidents`:**

```
🚨 INCIDENT DECLARED — Sev {P1/P2/P3/P4}
Title: {short description}
IC: @{ic_name}
Channel: #inc-{date}-{shortname}
PagerDuty: {link}
Status: Triage in progress
ETA next update: {15m / 30m / 4h}
```

### 4.2 GDPR Art. 33 — supervisory authority notification (≤72h)

**Recipient:** Centrul Național pentru Protecția Datelor cu Caracter Personal (CNPDCP) — Republica Moldova / autorități EU dacă afectați data subjects EU.

**Template (RO):**

```
Către: CNPDCP Moldova
Subiect: Notificare încălcare protecție date — REVYX (ITPRO SYSTEM SRL)

În conformitate cu Art. 33 GDPR și Legea 133/2011 art. 31, vă notificăm:

1. Natura încălcării: {breach type — confidentiality/integrity/availability}
2. Data/ora detectării: {ISO timestamp UTC}
3. Categorii date subjects afectați: {leads / agents / buyer profiles}
4. Categorii date afectate: {PII types — name/phone/email/transaction}
5. Număr aproximativ data subjects: {N}
6. Consecințe probabile: {analysis}
7. Măsuri implementate: {containment + remediation}
8. DPO contact: {dpo@revyx.app + phone}

Anexat: timeline preliminary, AUDIT_LOG export, plan remediation.

Semnatari: {Security Lead}, {DPO}, {CEO}
Data: {ISO timestamp}
```

### 4.3 Customer notification (data subject) — Art. 34

**Doar dacă risk ridicat pentru drepturi/libertăți.** Direct sau public communication.

```
Subiect: Notificare importantă despre datele tale REVYX

Pe data de {date}, am detectat un incident de securitate care a afectat
{descriere date}. Investigarea este în curs.

Ce s-a întâmplat: {factual brief}
Ce date sunt afectate: {types}
Ce am făcut: {containment + remediation summary}
Ce poți face: {recommended actions — change password, monitor accounts}

DPO contact: dpo@revyx.app
Mai multe info: revyx.app/security/incident-{ref}
```

### 4.4 Public statement (dacă media interest)

Coordonare obligatorie cu Legal + Marketing + CTO. Formal statement publicat la `revyx.app/security/incidents/`.

---

## 5. Tabletop scenarios library

Annual exercise — selectează 1 scenariu, joacă cu echipa 2-3h.

| Scenario | Phase tested |
|---|---|
| **A.** Lead PII bulk export by compromised admin account | Detection · Triage · Containment · GDPR |
| **B.** Production DB corruption — multi-AZ failover failed | Recovery · DR procedure integration |
| **C.** Ransomware on backup S3 bucket | Containment · Eradication · BCDR |
| **D.** ML pricing model serving data leak via prediction inversion | Privacy · ML governance |
| **E.** Supplier breach (Auth0/Supabase) — sub-processor incident | Communication · Coordination |
| **F.** WhatsApp template misuse causing PII broadcast | Compliance · Customer notify |
| **G.** Insider threat — agent farming PII via marketplace API | Detection · Containment · HR |
| **H.** White-label email DKIM key compromise → spam from tenant domain | Containment · Customer notify · Reputation |

Outcome tabletop: gaps în runbook descoperite → updates aplicate la v+1 înainte de exercise următor.

---

## 6. Roles & responsibilities

| Rol | Responsabilități during incident |
|---|---|
| **Incident Commander (IC)** | Decizii finale · severity · resource allocation · external comms approval |
| **Tech Lead** | Diagnose · containment · fix implementation |
| **Comms Lead** | Internal updates · customer notify draft · media liaison |
| **Scribe** | Document timeline live · evidence preservation · post-mortem prep |
| **DPO** | GDPR Art. 33/34 notification (P1 with PII) |
| **Legal** | Liability assessment · regulator coordination |
| **CTO** | Final approval external comms · executive sponsor |

**4-eyes:** Niciun "all clear" public fără IC + Security Lead + CTO sign-off.

---

## 7. Evidence preservation

**Pentru fiecare P1/P2:**
- Snapshot AUDIT_LOG range relevant
- Logs aggregator export (60 min pre-incident → 60 min post-resolve)
- Screenshots dashboards / alerts
- Slack channel transcript (auto-archive)
- Network capture dacă attack (DevOps trigger)

Stocare: bucket S3 `revyx-incidents-evidence` cu Object Lock 365d (immutable). Acces: Security + Legal + DPO. Audit fiecare access.

---

## 8. Post-mortem template

```
# Post-Mortem — Incident {ID}

## Summary
- Date: {start} - {end}
- Severity: {P1/P2/...}
- Impact: {users affected, services down, MRR at risk}
- Detection: {how + when}
- Resolution: {what fixed it + when}

## Timeline
| Time (UTC) | Event |
|---|---|
| ... | ... |

## Root Cause
{technical + process factors}

## What went well
- ...

## What didn't
- ...

## Action items
| Item | Owner | ETA | Jira |
|---|---|---|---|
| ... | ... | ... | ... |

## Sign-offs
- IC, Security, CTO, DPO (dacă PII)
```

Blameless: focus pe systems & process, NU pe individual blame.

---

## 9. Compliance hooks

| Compliance hook | Trigger |
|---|---|
| GDPR Art. 33 notify | P1/P2 cu PII compromise · 72h clock from detection |
| GDPR Art. 34 notify subjects | Risk ridicat pentru drepturi |
| ISO 27001 A.5.26 incident learning | Post-mortem în Risk Register |
| Legea 133/2011 RM (date personale) | Echivalent Art. 31 |
| Stripe / financial regulator | Dacă billing data afectat |
| Supplier contracts | Notify suppliers afectați (DPA terms) |

---

## 10. Audit events

| Event | When |
|---|---|
| `INC_DECLARED` | First responder declare |
| `INC_IC_ASSIGNED` | IC takes over |
| `INC_SEVERITY_CHANGED` | Re-triage |
| `INC_CONTAINMENT_APPLIED` | Action taken |
| `INC_GDPR_NOTIFIED_DPO` | DPO loop in (P1 PII) |
| `INC_GDPR_REGULATOR_NOTIFIED` | Art. 33 sent |
| `INC_RESOLVED` | All clear |
| `INC_POST_MORTEM_PUBLISHED` | Doc finalizat |

---

## 11. KPI

| Metric | Target |
|---|---|
| MTTD (detect) P1 | <15 min |
| MTTA (acknowledge) P1 | <15 min |
| MTTR (resolve) P1 | <4h |
| GDPR notification within 72h | 100% |
| Post-mortem published within 7d | 100% |
| Tabletop exercise annual | 1× minimum |

---

*docs/runbook/RUNBOOK_REVYX_incident-response_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
