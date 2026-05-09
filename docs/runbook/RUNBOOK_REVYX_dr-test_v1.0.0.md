# RUNBOOK — DISASTER RECOVERY TEST
<!-- RUNBOOK_REVYX_dr-test_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | DevOps Lead + Security Lead + CTO | ★ Runbook inițial S9 — DR test bi-anual obligatoriu pentru ISO 27001 G-11 (CRIT gap din `iso27001-track` v1.0.0) · RTO 4h · RPO 1h · sign-off form |

---

## 1. Scope

Procedură obligatorie pentru testarea **disaster recovery** (restore din backup în staging environment), ca remediation la gap-ul **G-11 (CRIT)** din `iso27001-track` v1.0.0. Aliniat cu ISO 27001:2022 Annex A.8.13 (backup) + A.8.14 (redundancy).

| Atribut | Valoare |
|---|---|
| Frecvență | **Bi-anual** (Martie + Septembrie) + ad-hoc pre-major release |
| RTO target | 4 ore |
| RPO target | 1 oră |
| Owner program | DevOps Lead |
| Co-owner | Security Lead (audit) + CTO (sponsor) |
| Pass criteria | RTO ≤4h · RPO ≤1h · zero data corruption · sign-off form complet |

---

## 2. Pre-test (T-7 zile)

| Pas | Owner | Output |
|---|---|---|
| 1 | DevOps Lead | Schedule kickoff call (45 min) cu Eng Lead, Security, QA |
| 2 | DevOps Lead | Verifică backup integrity ultima săptămână (`pg_dump` + checksum match) |
| 3 | DevOps | Provision staging environment isolated (network sandbox) |
| 4 | Security Lead | Confirma RBAC: cine are acces la staging restored (audit-only mode) |
| 5 | CTO | Comunicare echipă: window de test (no production impact, dar staging unavailable 4-6h) |
| 6 | DevOps | Pregătește runbook printable + escalation tree on-call |

---

## 3. Test execution (T0)

### 3.1 T0 — Snapshot

```
00:00 — Start clock
00:00 — Identifică ultima copie validă backup în S3 (cross-region)
        Tag: `revyx-prod-backup-{YYYY-MM-DD}-{full|incremental}.dump`
00:05 — Verify SHA-256 checksum match cu manifest
00:10 — Provisioning staging RDS instance (m5.xlarge)
00:15 — Trigger restore: pg_restore --jobs=8 --verbose
```

### 3.2 T0+1h — Validare integritate

```
01:00 — Restore expected complete (1h RPO target)
01:00 — Run validation queries:
        SELECT COUNT(*) FROM lead;            -- expected: ±100k
        SELECT COUNT(*) FROM property;        -- expected: ±50k
        SELECT COUNT(*) FROM deal;            -- expected: ±5k
        SELECT MAX(created_at) FROM audit_log; -- ≤ T0-1h (RPO check)
01:05 — Checksum tabele cheie:
        SELECT md5(string_agg(row_text, '' ORDER BY id))
          FROM (SELECT row_to_json(l.*) AS row_text, l.lead_id AS id
                FROM lead l ORDER BY l.lead_id LIMIT 10000) sub;
01:10 — Compare cu checksum reference (production read-replica T0-1h)
        Match → ✅ data integrity confirmed
        Mismatch → ❌ STOP test, escalate la CTO + Security
```

### 3.3 T0+2h — Smoke test app

```
02:00 — Deploy app cluster (single instance) pointing la staging restored DB
02:05 — Health checks:
        GET /api/v1/health           → 200 OK
        GET /api/v1/leads (admin JWT) → 200 + list non-empty
        GET /api/v1/properties        → 200 + list non-empty
02:10 — Functional smoke (5 scenarios from QA suite):
        - Login admin
        - List leads filtered
        - View property detail
        - View deal status
        - Search marketplace (dacă feature flag-ed)
02:30 — Authentication chain (JWT issue + refresh)
02:45 — Audit log writes (verify append-only enforcement)
```

### 3.4 T0+3h → T0+4h — Bounded extended testing (optional)

- Performance smoke: p95 latency listing endpoints.
- Concurrent user simulation (10 users / 5 min).
- Backup taken from staging restored (chained backup test).

### 3.5 T0+4h — Hard stop & teardown

```
04:00 — Hard stop: dacă pași 3.1-3.3 nu sunt PASS → RTO violated
04:00 — Document timing real per fiecare pas
04:15 — Snapshot final staging pentru analiză
04:30 — Teardown staging (terminate RDS, cluster, networks)
04:45 — Audit log entries:
        DR_TEST_STARTED, DR_TEST_RESTORE_VALIDATED, DR_TEST_SMOKE_PASS,
        DR_TEST_COMPLETED (cu timing real)
```

---

## 4. Sign-off form

```
DR Test Sign-Off — {date}

Test ID:                    DR-{YYYY-MM-DD}-001
Backup source:              s3://revyx-backups/{file}
Backup taken at:            {timestamp UTC}
Restore start:              {timestamp UTC}
Restore complete:           {timestamp UTC}
Smoke test complete:        {timestamp UTC}
Total duration:             {hours}:{minutes}

RTO target:                 4h
RTO actual:                 _____  → PASS / FAIL
RPO target:                 1h
RPO actual:                 _____  → PASS / FAIL
Data integrity:             PASS / FAIL  (checksum match: yes/no)
Smoke tests:                _____ / 5 PASS
Findings:                   ________________________________
Issues filed (Jira):        ________________________________

Sign-offs:
  DevOps Lead:              {name} ✅
  Security Lead:            {name} ✅
  Eng Lead:                 {name} ✅
  CTO:                      {name} ✅

Next test scheduled:        {YYYY-MM-DD}
```

Sign-off form se anexează la `Risk Register` ISO 27001 ca evidence pentru control A.8.13.

---

## 5. Failure handling

### 5.1 If RPO violated (latest backup > 1h old)

→ Investigate backup pipeline (cron `pg_dump.daily.full`, `pg_dump.hourly.incremental`).
→ Filed P1 ticket DevOps.
→ Re-test în 30 zile post-fix obligatoriu.

### 5.2 If RTO violated (restore + smoke > 4h)

→ Investigate bottleneck (network throughput S3, instance size, parallel jobs).
→ Plan optimization (PITR, larger instance, multi-AZ replica activation).
→ Re-test în 60 zile post-fix.

### 5.3 If data corruption detected

→ **STOP test imediat.**
→ Escalate la CTO + Security într-o oră.
→ Investigate backup pipeline integrity (storage class S3, encryption at rest).
→ Production audit obligatoriu.
→ Sub status `CRITICAL incident` declarat per `RUNBOOK_REVYX_incident-response`.

---

## 6. Post-test (T+7 zile)

| Pas | Owner | Output |
|---|---|---|
| 1 | DevOps Lead | Post-mortem 30 min (lessons learned + action items) |
| 2 | Security | Update Risk Register cu evidence DR test |
| 3 | DevOps | Update runbook acest cu îmbunătățiri descoperite |
| 4 | Compliance | Push evidence în GRC tooling |

---

## 7. Schedule rolling

| An | Q1 (Mar) | Q3 (Sep) | Note |
|---|---|---|---|
| 2026 | DR-2026-Q1 | DR-2026-Q3 | First mandatory bi-anual cycle |
| 2027 | DR-2027-Q1 | DR-2027-Q3 | Pre ISO Stage 2 audit |
| 2028+ | continuous | continuous | Annual surveillance audit ISO |

---

## 8. Audit events

| Event | When |
|---|---|
| `DR_TEST_SCHEDULED` | T-7d kickoff |
| `DR_TEST_STARTED` | T0 |
| `DR_TEST_RESTORE_VALIDATED` | T+1h |
| `DR_TEST_SMOKE_PASS` | T+3h |
| `DR_TEST_COMPLETED` | T+4h |
| `DR_TEST_FAILED` | orice failure point |
| `DR_TEST_FINDING_FILED` | per Jira ticket |

---

*docs/runbook/RUNBOOK_REVYX_dr-test_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
