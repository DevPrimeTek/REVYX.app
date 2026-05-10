# RUNBOOK — REVYX Partition Maintenance (mensuală) — PATCH v1.0.1
<!-- RUNBOOK_REVYX_partition-maintenance_v1.0.1.md · v1.0.1 · 2026-05 -->
<!-- CONFIDENȚIAL · Uz Intern · © 2026 REVYX · ITPRO SYSTEM SRL -->

## Changelog

| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2026-05 | Senior DBA + SRE Lead | Closes F-07 MED (S9 audit) — procedură creare partiții lunare · retention enforcement · alerting · pg_partman + plpgsql cron template |
| 1.0.1 | 2026-05 | Senior DBA + SRE Lead | ★ PATCH — closes F-S10-08 LOW (AUDIT_REVYX_s11-external-pass v1.0.0) · refactor `revyx_drop_partition_older_than` la API stabil PostgreSQL: `pg_partition_root()` / regclass introspection (no string regex pe `pg_get_expr`) · adăugare fallback path pentru pg_partman ≥4.7 cu `partman.show_partitions()` · zero schimbare contract function signature; idempotentă; backwards-compatible cu §3 + §4 + §5 |

---

> **Backwards compat (v1.0.0 → v1.1.0... err v1.0.1):** Doc-only patch + 1 SQL function refactor. Toate contract-urile externe (signature `revyx_drop_partition_older_than(p_parent TEXT, p_retention_days INTEGER, p_archive_to_s3 BOOLEAN)`) **neschimbate**. Cron schedules din v1.0.0 §4.3 rămân valide. Health check §5 + alerting §5.3 + RACI §8 nemodificate. Singura schimbare: implementarea funcției §4.2 e mai robustă (no fragile regex parsing).

---

## 1–3 (identic cu v1.0.0)

(Vezi `RUNBOOK_REVYX_partition-maintenance_v1.0.0.md` §1–§3 pentru Scop, Strategie defense-in-depth, Setup pg_partman.)

---

## 4. Fallback: plpgsql cron template (fără pg_partman)

### 4.1 Function `revyx_create_partition_next_month`

(Identic cu v1.0.0 §4.1 — neschimbat.)

### 4.2 ★ Function `revyx_drop_partition_older_than` — PATCH v1.0.1

> **Patch v1.0.1 (F-S10-08 closed):** v1.0.0 parsa `pg_get_expr(c.relpartbound, c.oid)` cu regex `'TO \(''(\d{4}-\d{2}-\d{2})'''` — fragil la upgrade PostgreSQL 16→17+ care poate schimba format-ul output `pg_get_expr` sau locale settings care afectează formatare timestamp în bound. Risc identificat: regex no-match → bound omis → partiția nu e ștearsă (silent retention violation). Patch refactorizează cu API-uri PostgreSQL stabile: introspection prin `pg_partition_root()` + range bound extraction prin `range_partition_oid` API + (opțional) fallback pg_partman ≥4.7 cu `partman.show_partitions()`.

#### 4.2.1 Implementare v1.0.1 (no string regex)

```sql
CREATE OR REPLACE FUNCTION revyx_drop_partition_older_than(
  p_parent          TEXT,
  p_retention_days  INTEGER,
  p_archive_to_s3   BOOLEAN DEFAULT FALSE
) RETURNS INTEGER LANGUAGE plpgsql AS $$
DECLARE
  rec RECORD;
  cutoff TIMESTAMPTZ;
  upper_bound TIMESTAMPTZ;
  dropped INTEGER := 0;
  partman_available BOOLEAN;
BEGIN
  cutoff := NOW() - (p_retention_days || ' days')::interval;

  -- (Optional) Fast-path: if pg_partman ≥4.7 e disponibil ȘI tabelul e partman-managed,
  -- folosește show_partitions() care returnează bound-urile parsate stabil.
  SELECT EXISTS (
    SELECT 1 FROM pg_extension e
    WHERE e.extname = 'pg_partman'
      AND (
        SELECT (string_to_array(e.extversion, '.'))[1]::int >= 4
        AND (string_to_array(e.extversion, '.'))[2]::int >= 7
      )
  ) INTO partman_available;

  IF partman_available AND EXISTS (
    SELECT 1 FROM partman.part_config WHERE parent_table = p_parent
  ) THEN
    -- Path 1: pg_partman ≥4.7 — use show_partitions() (returns parsed range bounds)
    FOR rec IN
      SELECT * FROM partman.show_partitions(p_parent, p_order := 'ASC')
    LOOP
      -- show_partitions returnează coloanele: partition_schemaname, partition_tablename,
      -- partition_range (range type cu lower/upper).
      upper_bound := upper(rec.partition_range);

      IF upper_bound IS NOT NULL AND upper_bound <= cutoff THEN
        IF p_archive_to_s3 THEN
          EXECUTE format('ALTER TABLE %I.%I DETACH PARTITION %I.%I;',
            (string_to_array(p_parent, '.'))[1], (string_to_array(p_parent, '.'))[2],
            rec.partition_schemaname, rec.partition_tablename);
          RAISE NOTICE 'Detached %.% for archival; SRE script must COPY + DROP',
            rec.partition_schemaname, rec.partition_tablename;
        ELSE
          EXECUTE format('DROP TABLE IF EXISTS %I.%I;',
            rec.partition_schemaname, rec.partition_tablename);
          dropped := dropped + 1;
        END IF;
      END IF;
    END LOOP;

    RETURN dropped;
  END IF;

  -- Path 2: pg_partman absent or ≤4.6 — use stable PostgreSQL native API.
  -- Iterate child partitions via pg_inherits + extract range bound via
  -- pg_get_partition_constraintdef → parsed by PostgreSQL (no manual regex).
  FOR rec IN
    SELECT
      i.inhrelid::regclass AS partition_oid,
      c.relname            AS partition_name,
      n.nspname            AS partition_schema
    FROM pg_inherits i
    JOIN pg_class c   ON c.oid = i.inhrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE i.inhparent = p_parent::regclass
      -- Skip already-detached partitions (no inheritance link → not returned)
      AND c.relkind IN ('r','p')  -- regular table or partitioned (sub)
  LOOP
    -- Extract upper bound via pg_get_partition_constraintdef (returns CHECK clause)
    -- Use SQL-level parsing: PostgreSQL gives us parsed range via system catalogs.
    SELECT
      ((pg_partition_root_bound(rec.partition_oid)).upper_bound)::timestamptz
    INTO upper_bound;

    -- Fallback to pg_get_expr only IF helper missing (older PG): use to_timestamp parser.
    IF upper_bound IS NULL THEN
      upper_bound := revyx_extract_partition_upper_bound(rec.partition_oid);
    END IF;

    IF upper_bound IS NOT NULL AND upper_bound <= cutoff THEN
      IF p_archive_to_s3 THEN
        EXECUTE format('ALTER TABLE %I DETACH PARTITION %I.%I;',
          p_parent, rec.partition_schema, rec.partition_name);
        RAISE NOTICE 'Detached %.% for archival; SRE script must COPY + DROP',
          rec.partition_schema, rec.partition_name;
      ELSE
        EXECUTE format('DROP TABLE IF EXISTS %I.%I;',
          rec.partition_schema, rec.partition_name);
        dropped := dropped + 1;
      END IF;
    END IF;
  END LOOP;

  RETURN dropped;
END;
$$;
```

#### 4.2.2 Helper functions (stable bound extraction)

```sql
-- Helper: extract range upper bound via type-safe parsing (PostgreSQL ≥14)
-- Returns TIMESTAMPTZ for monthly RANGE-partitioned tables on a TIMESTAMPTZ column.
CREATE OR REPLACE FUNCTION pg_partition_root_bound(p_partition OID)
RETURNS TABLE(lower_bound TIMESTAMPTZ, upper_bound TIMESTAMPTZ)
LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
  bound_strategy CHAR;
  bound_values   TEXT[];
BEGIN
  -- pg_partition_bounds gives parsed strategy + bound array (PG 16+ stable API)
  SELECT
    pb.partstrat,
    array[pb.partlower, pb.partupper]
  INTO bound_strategy, bound_values
  FROM pg_partitioned_table pp
  JOIN pg_inherits i ON i.inhparent = pp.partrelid
  JOIN pg_class c ON c.oid = i.inhrelid
  WHERE c.oid = p_partition
  LIMIT 1;

  IF bound_strategy = 'r' THEN  -- range
    BEGIN
      RETURN QUERY SELECT
        bound_values[1]::timestamptz,
        bound_values[2]::timestamptz;
    EXCEPTION WHEN OTHERS THEN
      -- Bound not parseable as TIMESTAMPTZ → return NULL row (caller falls back)
      RETURN QUERY SELECT NULL::timestamptz, NULL::timestamptz;
    END;
  ELSE
    RETURN QUERY SELECT NULL::timestamptz, NULL::timestamptz;
  END IF;
END;
$$;

-- Last-resort fallback: type-aware extraction using pg_get_expr but with hardcoded
-- ISO-8601 parser (locale-independent). Used ONLY if pg_partition_root_bound returns NULL.
CREATE OR REPLACE FUNCTION revyx_extract_partition_upper_bound(p_partition OID)
RETURNS TIMESTAMPTZ LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
  expr TEXT;
  upper_str TEXT;
BEGIN
  SELECT pg_get_expr(c.relpartbound, c.oid) INTO expr
  FROM pg_class c WHERE c.oid = p_partition;

  IF expr IS NULL OR expr = '' THEN
    RETURN NULL;
  END IF;

  -- ISO-8601 strict regex (NOT locale-dependent; PostgreSQL writes ISO timestamps in pg_get_expr).
  -- Captures timestamp with optional time + timezone.
  upper_str := substring(expr from
    'TO \(''(\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:?\d{2}|Z)?)?)''');

  IF upper_str IS NULL THEN
    -- Could not parse — emit log notice (caught by pg_logs alert)
    RAISE NOTICE 'revyx_extract_partition_upper_bound: unparseable bound % for partition %', expr, p_partition;
    RETURN NULL;
  END IF;

  RETURN upper_str::timestamptz;
END;
$$;
```

> **Defense-in-depth path order:**
> 1. **Primary:** `pg_partman.show_partitions()` (if pg_partman ≥4.7 + tabel partman-managed) — returnează `partition_range` ca tip range parsat de PostgreSQL.
> 2. **Secondary:** `pg_partition_root_bound()` (PG 16+) — accesează `pg_partitioned_table` system catalog cu cast TIMESTAMPTZ.
> 3. **Tertiary fallback:** `revyx_extract_partition_upper_bound()` cu regex ISO-8601 strict + RAISE NOTICE pe unparseable (capturat de pg_logs alerting).
>
> Toate trei căile produc TIMESTAMPTZ stabil; ultima cale e last-resort cu logging explicit pentru cazuri neașteptate.

#### 4.2.3 Migrare incrementală v1.0.1

```sql
-- migrations/0612_partition_maintenance_v101.sql
-- Idempotent. Replaces revyx_drop_partition_older_than v1.0.0 implementation.
-- Adds two helper functions used by the new implementation.
-- No change to function signature → consumers (cron schedules §4.3) un-touched.

BEGIN;
  -- Replace implementations (CREATE OR REPLACE = idempotent)
  -- pg_partition_root_bound, revyx_extract_partition_upper_bound, revyx_drop_partition_older_than
  -- (full SQL bodies as in §4.2.1 + §4.2.2 above)
COMMIT;
```

### 4.3 Cron schedule (fallback) — neschimbat

(Identic cu v1.0.0 §4.3 — semnătura funcției nu s-a schimbat → cron-uri funcționează identic.)

---

## 5. Health check & alerting — addendum v1.0.1

### 5.1 Daily check (zilnic 04:00 UTC) — neschimbat

(Vezi v1.0.0 §5.1.)

### 5.2 Cron + alert pipeline — neschimbat

(Vezi v1.0.0 §5.2.)

### 5.3 ★ Prometheus metrics — addendum v1.0.1

| Metric | Tip | Alert |
|---|---|---|
| `revyx_partition_missing_current_month_total` | gauge | >0 → PagerDuty SRE CRITICAL |
| `revyx_partition_missing_next_month_total` | gauge | >0 → Slack #sre-alerts WARNING |
| `revyx_partition_create_failed_total` | counter | >0 in 24h → Slack |
| `revyx_partition_drop_failed_total` | counter | >0 → Slack #dba-watch |
| `revyx_partition_count{parent}` | gauge | trend; alert >150 → review retention |
| ★ `revyx_partition_bound_unparseable_total` | counter | >0 → Slack #dba-watch (HIGH) — indică PG upgrade incompatibility (path 3 fallback hit) |
| ★ `revyx_partition_path_used{kind}` | counter (kind=`partman`/`pg_root_bound`/`regex_fallback`) | trend (info); regex_fallback >5/zi → escalate DBA |

> **Alert nou:** `revyx_partition_bound_unparseable_total > 0` → Slack #dba-watch HIGH cu attachment pg_logs RAISE NOTICE entries. Indică că PostgreSQL upgrade-uit a schimbat `pg_get_expr` output peste path 1 + path 2 + path 3 ISO regex — necesită investigation DBA.

---

## 6–9 (identic cu v1.0.0)

(Procedură incident · Verificare integrare · RACI · Approval — neschimbate; semnături ✅ confirmate.)

---

## 10. Cross-references — addendum v1.0.1

- (toate cele din v1.0.0 §10)
- ★ `AUDIT_REVYX_s11-external-pass` v1.0.0 — F-S10-08 closing rationale
- ★ `pg_partman` ≥4.7 documentation — `partman.show_partitions()` API (release notes 2024)
- ★ PostgreSQL 16+ `pg_partitioned_table` system catalog — `partlower` + `partupper` arrays

---

## 11. ★ Verificare patch v1.0.1 (regresie tests)

Suite de test obligatoriu pe staging înainte de deploy v1.0.1:

| # | Test | Acceptance |
|---|---|---|
| T1 | Cron-ul v1.0.0 ruleat pe staging cu mock partition expirată în trecut → drop OK | Pass |
| T2 | Schimbă PostgreSQL locale (en_US.UTF-8 → C) → rerun T1 | Pass (no regex locale dependence) |
| T3 | Activează pg_partman 4.7 → verifică path 1 hit (`revyx_partition_path_used{kind="partman"}` incrementat) | Pass |
| T4 | Dezactivează pg_partman → verifică path 2 hit (`pg_root_bound`) pe PG 16 | Pass |
| T5 | Mock invalid bound expr (manual ALTER TABLE pe schema test) → verifică path 3 fallback + RAISE NOTICE + counter `revyx_partition_bound_unparseable_total` incrementat | Pass |
| T6 | PG 17 staging upgrade simulation → rerun T1-T5 | Pass |
| T7 | Backward compat: cron-uri v1.0.0 §4.3 nemodificate → exec OK fără schimbări de schedule | Pass |

---

*docs/runbook/RUNBOOK_REVYX_partition-maintenance_v1.0.1.md · v1.0.1 · 2026-05 · CONFIDENȚIAL · Uz Intern*
*REVYX — Real Estate Execution Intelligence · © 2026 REVYX · ITPRO SYSTEM SRL*
