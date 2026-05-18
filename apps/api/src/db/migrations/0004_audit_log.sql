-- 0004_audit_log.sql · Phase 0 Security Foundation (M1.S1)
-- Refs: TECH_SPEC_REVYX_phase0-security_v1.0.0.md §4.1.4 + §4.2 append-only enforcement
-- Authoritative source: TECH_SPEC_REVYX_audit-log_v1.1.1.md §4.1 + §6

CREATE TABLE IF NOT EXISTS audit_log (
  id              BIGSERIAL PRIMARY KEY,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_id       UUID,
  actor_id        UUID,
  actor_type      TEXT NOT NULL,
  event_type      TEXT NOT NULL,
  entity_type     TEXT,
  entity_id       UUID,
  correlation_id  UUID,
  request_id      UUID,
  ip_address      INET,
  user_agent      TEXT,
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  severity        TEXT NOT NULL DEFAULT 'INFO',
  CONSTRAINT audit_log_severity_check CHECK (severity IN ('INFO', 'WARN', 'HIGH', 'CRITICAL')),
  CONSTRAINT audit_log_actor_type_check CHECK (actor_type IN ('USER', 'SYSTEM', 'WEBHOOK'))
);

CREATE INDEX IF NOT EXISTS idx_audit_log_tenant_time ON audit_log (tenant_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor_time  ON audit_log (actor_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_event       ON audit_log (event_type, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity      ON audit_log (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_metadata    ON audit_log USING GIN (metadata);

-- Append-only enforcement (BR-07): block UPDATE and DELETE at DB level
CREATE OR REPLACE FUNCTION audit_log_block_modify()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'AUDIT_LOG_APPEND_ONLY: % not allowed on audit_log', TG_OP
    USING ERRCODE = '42501';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_log_block_update ON audit_log;
CREATE TRIGGER trg_audit_log_block_update
  BEFORE UPDATE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION audit_log_block_modify();

DROP TRIGGER IF EXISTS trg_audit_log_block_delete ON audit_log;
CREATE TRIGGER trg_audit_log_block_delete
  BEFORE DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION audit_log_block_modify();

-- Defense-in-depth: revoke UPDATE/DELETE from the application role.
-- The deploy script provisions the `revyx_app` role beforehand; the DO block makes the
-- migration idempotent on greenfield environments where the role doesn't exist yet.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'revyx_app') THEN
    REVOKE UPDATE, DELETE ON audit_log FROM revyx_app;
    GRANT SELECT, INSERT ON audit_log TO revyx_app;
  END IF;
END $$;
