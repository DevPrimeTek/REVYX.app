-- 0012_tasks.sql · Phase A Foundation (M1.S2)
-- Refs: TECH_SPEC_REVYX_nba-engine_v1.0.0.md §4.1 + §4.2
-- BR-04: max 3 ACTIVE tasks per agent enforced via trigger.

CREATE TABLE IF NOT EXISTS tasks (
  id                       UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                UUID            NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  agent_id                 UUID            NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  source_entity_type       TEXT            NOT NULL,
  source_entity_id         UUID            NOT NULL,

  task_type                TEXT            NOT NULL,
  task_label               TEXT            NULL,

  nba_score                NUMERIC(5,4)    NOT NULL DEFAULT 0,
  nba_components           JSONB           NULL,
  nba_calculated_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  status                   TEXT            NOT NULL DEFAULT 'PENDING',
  activated_at             TIMESTAMPTZ     NULL,
  completed_at             TIMESTAMPTZ     NULL,
  snoozed_until            TIMESTAMPTZ     NULL,
  cancellation_reason      TEXT            NULL,

  due_at                   TIMESTAMPTZ     NULL,

  version                  BIGINT          NOT NULL DEFAULT 1,
  created_at               TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  CONSTRAINT tasks_source_entity_type_check CHECK (source_entity_type IN ('lead','deal','property','showing','offer')),
  CONSTRAINT tasks_task_type_check CHECK (task_type IN (
    'first_contact','follow_up','schedule_showing','send_property',
    'request_documents','draft_offer','close_deal','review_no_show','custom'
  )),
  CONSTRAINT tasks_nba_range_check  CHECK (nba_score BETWEEN 0 AND 2.0),
  CONSTRAINT tasks_status_check     CHECK (status IN ('PENDING','ACTIVE','COMPLETED','SNOOZED','CANCELLED','REASSIGNED'))
);

CREATE INDEX IF NOT EXISTS idx_tasks_agent_active
  ON tasks (tenant_id, agent_id, nba_score DESC)
  WHERE status = 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_tasks_agent_pending
  ON tasks (tenant_id, agent_id, nba_score DESC)
  WHERE status = 'PENDING';
CREATE INDEX IF NOT EXISTS idx_tasks_source
  ON tasks (tenant_id, source_entity_type, source_entity_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due
  ON tasks (due_at) WHERE due_at IS NOT NULL AND status IN ('PENDING','ACTIVE');

-- BR-04: max 3 ACTIVE per agent (trigger)
CREATE OR REPLACE FUNCTION task_enforce_max_3_active() RETURNS TRIGGER AS $$
DECLARE
  active_count INTEGER;
BEGIN
  IF NEW.status = 'ACTIVE' AND (TG_OP = 'INSERT' OR OLD.status <> 'ACTIVE') THEN
    SELECT COUNT(*) INTO active_count
      FROM tasks
      WHERE tenant_id = NEW.tenant_id
        AND agent_id = NEW.agent_id
        AND status = 'ACTIVE'
        AND id <> NEW.id;
    IF active_count >= 3 THEN
      RAISE EXCEPTION 'BR_04_MAX_3_ACTIVE_TASKS' USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_tasks_max_3_active ON tasks;
CREATE TRIGGER trg_tasks_max_3_active
  BEFORE INSERT OR UPDATE OF status ON tasks
  FOR EACH ROW EXECUTE FUNCTION task_enforce_max_3_active();
