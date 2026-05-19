-- 0011_activities.sql · Phase A Foundation (M1.S2)
-- Refs: BRD §8 (ACTIVITY) + TECH_SPEC_REVYX_lead-scoring_v1.0.0.md §4.2
-- Source-of-truth for IS, TS, NBA Δt scoring (Phase B/M1.S3).

CREATE TABLE IF NOT EXISTS activities (
  id                UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID            NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  entity_type       TEXT            NOT NULL,
  entity_id         UUID            NOT NULL,

  activity_type     TEXT            NOT NULL,
  performed_by      UUID            NULL REFERENCES users(id) ON DELETE SET NULL,
  channel           TEXT            NULL,
  duration_seconds  INTEGER         NULL,
  metadata          JSONB           NULL,
  occurred_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  CONSTRAINT activities_entity_type_check CHECK (entity_type IN ('lead','deal','property','agent')),
  CONSTRAINT activities_activity_type_check CHECK (activity_type IN (
    'call','message_sent','message_received','showing','offer_made',
    'note_added','score_updated','status_changed','showcase_viewed','document_downloaded'
  )),
  CONSTRAINT activities_channel_check CHECK (channel IS NULL OR channel IN ('whatsapp','email','sms','platform','phone','in_app'))
);

CREATE INDEX IF NOT EXISTS idx_activities_entity_time
  ON activities (tenant_id, entity_type, entity_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_performer_time
  ON activities (tenant_id, performed_by, occurred_at DESC) WHERE performed_by IS NOT NULL;
