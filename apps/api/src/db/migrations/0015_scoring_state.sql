-- 0015_scoring_state.sql · Phase A Foundation (M1.S2)
-- Refs: BRD §7 (scoring engines) — generic scoring snapshot for explainability + cache invalidation.
-- One row per (entity_type, entity_id, score_kind) holding the latest computed value + inputs.
-- Engines (M1.S3+) write here on every recalc; UI reads explanations from `components` JSONB.

CREATE TABLE IF NOT EXISTS scoring_state (
  id                   UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id            UUID            NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  entity_type          TEXT            NOT NULL,
  entity_id            UUID            NOT NULL,

  score_kind           TEXT            NOT NULL,
  score_value          NUMERIC(5,4)    NOT NULL,
  components           JSONB           NOT NULL DEFAULT '{}'::jsonb,
  inputs_hash          TEXT            NULL,

  computed_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  computed_by          TEXT            NOT NULL DEFAULT 'engine',
  engine_version       TEXT            NULL,

  CONSTRAINT scoring_state_entity_type_check CHECK (entity_type IN ('lead','property','deal','agent','task')),
  CONSTRAINT scoring_state_kind_check        CHECK (score_kind IN ('LS','PS','IS','DP','NBA','TS','APS','DHI','LF')),
  CONSTRAINT scoring_state_value_range_check CHECK (
    -- NBA is the only scale exception [0, 2.0]; all others [0, 1].
    (score_kind = 'NBA' AND score_value BETWEEN 0 AND 2.0) OR
    (score_kind <> 'NBA' AND score_value BETWEEN 0 AND 1)
  ),
  CONSTRAINT scoring_state_computed_by_check CHECK (computed_by IN ('engine','manual','migration','test'))
);

CREATE UNIQUE INDEX IF NOT EXISTS scoring_state_entity_kind_uq
  ON scoring_state (tenant_id, entity_type, entity_id, score_kind);
CREATE INDEX IF NOT EXISTS idx_scoring_state_recent
  ON scoring_state (tenant_id, entity_type, score_kind, computed_at DESC);
