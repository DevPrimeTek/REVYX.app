# RUNBOOK — REVYX Partition Maintenance (mensuală)
<!-- RUNBOOK_REVYX_partition-maintenance_v1.0.0.md · v1.0.0 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior DBA + SRE Lead | ★ Initial — closes F-07 MED (AUDIT_REVYX_s8-external-pass v1.0.0) · procedură creare partiții lunare · retention enforcement · alerting "missing partition" · template pg_partman + plpgsql cron alternativ |

---

## 1. Scop

Definește procedura standard de **maintenance** pentru tabelele PostgreSQL partitioned by RANGE (lunar) introduse în S8:

| Tabel | Sursă spec | Retention hot | Notă |
|---|---|---|---|
| `mobile_push_log` | `mobile-rn` v1.0.0 §4.3 | **90 zile** | Log push notifications; high-volume |
| `churn_features_snapshot` | `churn-ga` v1.0.0+ §4.5 | **365 zile** | Reproducibilitate retraining |
| `pricing_prediction_audit` | `ml-pricing-ga` v1.0.0+ §4.2 | **365 zile** | Predictions audit, ML drift eval |
| `audit_log` | `audit-log` v1.1.0 §4.1 | 24 luni hot + 7 ani cold | Out of scope aici (procedură proprie §10 din audit-log) |

> **Fără partiție viitoare → INSERT eșuează cu `no partition of relation X found for row` → IMPACT critic** (push-uri pierdute, predictions ne-loggate). Acest runbook previne acest scenariu.

---

## 2. Strategie

Două opțiuni implementate **paralel** (defense-in-depth):

1. **Primary: pg_partman** (extensie PostgreSQL) — automated partition creation + retention.
2. **Fallback: plpgsql cron template** — în caz `pg_partman` nu este disponibil (managed PG fără extensie) sau pentru tabelele nepartman-izate.

Ambele rulează **independent**. Health check zilnic verifică rezultatul (§5).

---

## 3. Setup pg_partman (recomandat)

### 3.1 Instalare extensie (one-time)

```sql
CREATE EXTENSION IF NOT EXISTS pg_partman SCHEMA partman;
```

Pentru managed PostgreSQL care nu permite extensia, sari la §4.

### 3.2 Înregistrare tabel partman

```sql
-- mobile_push_log (retention 90d)
SELECT partman.create_parent(
  p_parent_table       => 'public.mobile_push_log',
  p_control            => 'created_at',          -- coloana de partitioning (vezi spec mobile-rn §4.3)
  p_type               => 'native',
  p_interval           => '1 month',
  p_premake            => 6,                      -- creează 6 partiții viitoare în avans
  p_start_partition    => to_char(date_trunc('month', NOW()), 'YYYY-MM-DD')
);

UPDATE partman.part_config SET
  retention             = '90 days',
  retention_keep_table  = false,                  -- DROP partition la expirare (no archival pentru push log)
  retention_keep_index  = false
WHERE parent_table = 'public.mobile_push_log';

-- churn_features_snapshot (retention 365d)
SELECT partman.create_parent(
  p_parent_table       => 'public.churn_features_snapshot',
  p_control            => 'computed_at',
  p_type               => 'native',
  p_interval           => '1 month',
  p_premake            => 6
);
UPDATE partman.part_config SET
  retention             = '365 days',
  retention_keep_table  = true,                    -- detach + archive în S3 înainte de drop
  retention_keep_index  = false
WHERE parent_table = 'public.churn_features_snapshot';

-- pricing_prediction_audit (retention 365d, archival activ)
SELECT partman.create_parent(
  p_parent_table       => 'public.pricing_prediction_audit',
  p_control            => 'predicted_at',
  p_type               => 'native',
  p_interval           => '1 month',
  p_premake            => 6
);
UPDATE partman.part_config SET
  retention             = '365 days',
  retention_keep_table  = true,
  retention_keep_index  = false
WHERE parent_table = 'public.pricing_prediction_audit';
```

### 3.3 Cron job partman maintenance

```
# crontab
# Rulează la 02:00 UTC zilnic; partman creează partiții noi când premake threshold atins
0 2 * * *  psql $DATABASE_URL -c "SELECT partman.run_maintenance(p_jobmon := false);"
```

Idempotent — rerunable safe.

---

## 4. Fallback: plpgsql cron template (fără pg_partman)

### 4.1 Function `revyx_create_partition_next_month`

```sql
CREATE OR REPLACE FUNCTION revyx_create_partition_next_month(
  p_parent      TEXT,
  p_control_col TEXT,
  p_target_month DATE DEFAULT (date_trunc('month', NOW()) + INTERVAL '1 month')::date
) RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  partition_name TEXT;
  start_dt DATE;
  end_dt DATE;
BEGIN
  start_dt := date_trunc('month', p_target_month)::date;
  end_dt   := (date_trunc('month', p_target_month) + INTERVAL '1 month')::date;
  partition_name := p_parent || '_' || to_char(start_dt, 'YYYY_MM');

  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF %I FOR VALUES FROM (%L) TO (%L);',
    partition_name, p_parent, start_dt, end_dt
  );

  -- Replicate standard indexes (per-table specific; extensible)
  IF p_parent = 'pricing_prediction_audit' THEN
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_model ON %I (model_id, predicted_at DESC);',
                   partition_name, partition_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_property ON %I (tenant_id, property_id, predicted_at DESC);',
                   partition_name, partition_name);
  ELSIF p_parent = 'churn_features_snapshot' THEN
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_subject ON %I (subject_type, subject_id, computed_at DESC);',
                   partition_name, partition_name);
  ELSIF p_parent = 'mobile_push_log' THEN
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_device ON %I (device_id, created_at DESC);',
                   partition_name, partition_name);
  END IF;

  RETURN partition_name;
END;
$$;
```

### 4.2 Function `revyx_drop_partition_older_than`

```sql
CREATE OR REPLACE FUNCTION revyx_drop_partition_older_than(
  p_parent      TEXT,
  p_retention_days INTEGER,
  p_archive_to_s3  BOOLEAN DEFAULT FALSE
) RETURNS INTEGER LANGUAGE plpgsql AS $$
DECLARE
  rec RECORD;
  cutoff DATE;
  dropped INTEGER := 0;
BEGIN
  cutoff := (NOW() - (p_retention_days || ' days')::interval)::date;

  FOR rec IN
    SELECT inhrelid::regclass::text AS partition_name,
           pg_get_expr(c.relpartbound, c.oid) AS bound
    FROM pg_inherits i
    JOIN pg_class c ON c.oid = i.inhrelid
    WHERE i.inhparent = p_parent::regclass
  LOOP
    -- Parse upper bound: 'FOR VALUES FROM (...) TO (''YYYY-MM-DD'')'
    IF substring(rec.bound from 'TO \(''(\d{4}-\d{2}-\d{2})''') < cutoff::text THEN
      IF p_archive_to_s3 THEN
        -- Detach + COPY to S3 (handled out-of-band by SRE script; here we emit advisory)
        EXECUTE format('ALTER TABLE %I DETACH PARTITION %I;', p_parent, rec.partition_name);
        RAISE NOTICE 'Detached % for archival; SRE script must COPY + DROP', rec.partition_name;
      ELSE
        EXECUTE format('DROP TABLE IF EXISTS %I;', rec.partition_name);
        dropped := dropped + 1;
      END IF;
    END IF;
  END LOOP;

  RETURN dropped;
END;
$$;
```

### 4.3 Cron schedule (fallback)

```
# crontab
# Daily 02:00 UTC: ensure next-month partition exists (premake +1)
0 2 * * *  psql $DATABASE_URL -c "SELECT revyx_create_partition_next_month('pricing_prediction_audit', 'predicted_at');"
0 2 * * *  psql $DATABASE_URL -c "SELECT revyx_create_partition_next_month('churn_features_snapshot', 'computed_at');"
0 2 * * *  psql $DATABASE_URL -c "SELECT revyx_create_partition_next_month('mobile_push_log', 'created_at');"

# Monthly 03:00 UTC pe 1: drop / detach partiții expirate
0 3 1 * *  psql $DATABASE_URL -c "SELECT revyx_drop_partition_older_than('mobile_push_log', 90, false);"
0 3 1 * *  psql $DATABASE_URL -c "SELECT revyx_drop_partition_older_than('churn_features_snapshot', 365, true);"
0 3 1 * *  psql $DATABASE_URL -c "SELECT revyx_drop_partition_older_than('pricing_prediction_audit', 365, true);"
```

---

## 5. Health check & alerting

### 5.1 Daily check (zilnic 04:00 UTC)

```sql
-- Function: missing partition detection
CREATE OR REPLACE FUNCTION revyx_partition_health_check()
RETURNS TABLE (parent TEXT, missing_for_month DATE, severity TEXT) LANGUAGE plpgsql AS $$
DECLARE
  parents TEXT[] := ARRAY['mobile_push_log','churn_features_snapshot','pricing_prediction_audit'];
  p TEXT;
  current_month DATE := date_trunc('month', NOW())::date;
  next_month    DATE := (date_trunc('month', NOW()) + INTERVAL '1 month')::date;
  has_current BOOLEAN;
  has_next    BOOLEAN;
BEGIN
  FOREACH p IN ARRAY parents LOOP
    SELECT EXISTS (
      SELECT 1 FROM pg_inherits i
      JOIN pg_class c ON c.oid = i.inhrelid
      WHERE i.inhparent = p::regclass
        AND pg_get_expr(c.relpartbound, c.oid) LIKE '%' || to_char(current_month, 'YYYY-MM-DD') || '%'
    ) INTO has_current;

    SELECT EXISTS (
      SELECT 1 FROM pg_inherits i
      JOIN pg_class c ON c.oid = i.inhrelid
      WHERE i.inhparent = p::regclass
        AND pg_get_expr(c.relpartbound, c.oid) LIKE '%' || to_char(next_month, 'YYYY-MM-DD') || '%'
    ) INTO has_next;

    IF NOT has_current THEN
      RETURN QUERY SELECT p, current_month, 'CRITICAL'::TEXT;
    ELSIF NOT has_next THEN
      RETURN QUERY SELECT p, next_month, 'WARNING'::TEXT;
    END IF;
  END LOOP;
END;
$$;
```

### 5.2 Cron + alert pipeline

```
# crontab
0 4 * * *  /opt/revyx/scripts/partition-health-check.sh
```

```bash
#!/bin/bash
# /opt/revyx/scripts/partition-health-check.sh
set -euo pipefail

RESULT=$(psql "$DATABASE_URL" -A -t -c "SELECT * FROM revyx_partition_health_check();")

if [ -z "$RESULT" ]; then
  exit 0   # No issues
fi

while IFS='|' read -r parent month severity; do
  if [ "$severity" = "CRITICAL" ]; then
    pagerduty-cli trigger \
      --service-id "$PD_SRE_SERVICE" \
      --severity critical \
      --summary "Missing partition (CURRENT month) for $parent: $month — INSERT will fail!"
  else
    slack-cli post --channel "#sre-alerts" \
      --text ":warning: Missing partition (next month) for $parent: $month. Auto-create will be attempted next 02:00 UTC."
  fi
done <<< "$RESULT"

exit 1   # Non-zero so monitoring catches the failure
```

### 5.3 Prometheus metrics

| Metric | Tip | Alert |
|---|---|---|
| `revyx_partition_missing_current_month_total` | gauge | >0 → PagerDuty SRE CRITICAL |
| `revyx_partition_missing_next_month_total` | gauge | >0 → Slack #sre-alerts WARNING |
| `revyx_partition_create_failed_total` | counter | >0 in 24h → Slack |
| `revyx_partition_drop_failed_total` | counter | >0 → Slack #dba-watch |
| `revyx_partition_count{parent}` | gauge | trend; alert >150 (>10 ani) → review retention |

---

## 6. Procedură incident: missing partition CURRENT month

### 6.1 Symptom

INSERTS pe `mobile_push_log` / `churn_features_snapshot` / `pricing_prediction_audit` eșuează cu:
```
ERROR: no partition of relation "X" found for row
DETAIL: Partition key of the failing row contains (col) = (timestamp).
```

### 6.2 Containment imediat (≤ 5 min)

```sql
-- 1) Creează partiția lipsă manual
SELECT revyx_create_partition_next_month('<parent>', '<control_col>', date_trunc('month', NOW())::date);

-- 2) Verifică
SELECT inhrelid::regclass FROM pg_inherits WHERE inhparent = '<parent>'::regclass;
```

### 6.3 Root cause analysis (≤ 30 min)

- A rulat cron-ul la 02:00 UTC azi? `grep partition /var/log/cron`
- pg_partman → `SELECT * FROM partman.part_config_sub WHERE parent_table='<parent>';`
- Eroare la create în pg_logs?
- DBA migration recentă a redenumit/șters ceva?

### 6.4 Postmortem

Open `INC_DECLARED` cu severity P3 (sau P2 dacă >5 min downtime); follow `RUNBOOK_REVYX_incident-response` v1.0.0.

---

## 7. Verificare integrare cu specs

| Spec | Tabel | Confirmare |
|---|---|---|
| `mobile-rn` v1.0.0 | `mobile_push_log` retention 90d | §3.2 / §4.3 acoperit |
| `churn-ga` v1.0.0+ | `churn_features_snapshot` retention 365d | §3.2 / §4.3 acoperit |
| `ml-pricing-ga` v1.0.0+ | `pricing_prediction_audit` retention 365d | §3.2 / §4.3 acoperit |
| `audit-log` v1.1.0 | `audit_log_YYYY_MM` 24 luni | NU este scope al acestui runbook (proceduri proprii §10 audit-log) |

---

## 8. RACI

| Rol | Responsabilitate |
|---|---|
| Senior DBA | Owner runbook · review trimestrial · update spec la migrare schema |
| SRE Lead | Cron jobs · alerting · health check pipeline |
| On-call SRE | Răspuns la PagerDuty CRITICAL (§6.2 containment) |
| Solution Architect | Aprobare schimbări retention sau strategie |
| Compliance Auditor | Verificare retention conformă cu DPIA + GDPR la audit (`ISO_INTERNAL_AUDIT_RUN`) |

---

## 9. Approval

| Aprobator | Sign-off |
|---|---|
| Senior DBA | ✅ |
| SRE Lead | ✅ |
| Solution Architect | ✅ |
| Compliance Auditor (review retention) | ✅ |

---

## 10. Cross-references

- `audit-log` v1.1.0 §4.4.6 — events `ISO_*` care includ `partition_health` în reportul anual ISO 27001
- `audit-log` v1.1.0 §10 — audit_log self retention
- `mobile-rn` v1.0.0 §4.3 — `mobile_push_log` schema
- `churn-ga` v1.0.0+ §4.5 — `churn_features_snapshot` schema
- `ml-pricing-ga` v1.0.0+ §4.2 — `pricing_prediction_audit` schema

---

*docs/runbook/RUNBOOK_REVYX_partition-maintenance_v1.0.0.md · v1.0.0 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
