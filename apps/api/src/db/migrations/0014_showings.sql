-- 0014_showings.sql · Phase A Foundation (M1.S2)
-- Refs: BRD §8 (SHOWING) + TECH_SPEC_REVYX_showing_v1.0.0.md §4.1
-- Calendar conflict guard via btree_gist EXCLUDE — graceful fallback if extension missing.

DO $$ BEGIN
  CREATE EXTENSION IF NOT EXISTS btree_gist;
EXCEPTION WHEN insufficient_privilege OR undefined_file THEN
  RAISE NOTICE 'btree_gist extension not installed — showing_agent_no_overlap constraint will be skipped';
END $$;

CREATE TABLE IF NOT EXISTS showings (
  id                          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                   UUID            NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  deal_id                     UUID            NOT NULL REFERENCES deals(id) ON DELETE RESTRICT,
  property_id                 UUID            NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
  lead_id                     UUID            NOT NULL REFERENCES leads(id) ON DELETE RESTRICT,
  agent_id                    UUID            NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  scheduled_at                TIMESTAMPTZ     NOT NULL,
  duration_minutes            INTEGER         NULL,

  status                      TEXT            NOT NULL DEFAULT 'SCHEDULED',

  attended                    BOOLEAN         NULL,
  cancellation_reason         TEXT            NULL,
  cancelled_at                TIMESTAMPTZ     NULL,
  advance_notice_hours        NUMERIC(6,2)    NULL,

  feedback_score              SMALLINT        NULL,
  feedback_notes              TEXT            NULL,
  feedback_at                 TIMESTAMPTZ     NULL,
  feedback_by_user_id         UUID            NULL REFERENCES users(id) ON DELETE SET NULL,

  reminder_sent_at            TIMESTAMPTZ     NULL,
  reminder_channel            TEXT            NULL,
  reminder_delivery_status    TEXT            NULL,

  version                     BIGINT          NOT NULL DEFAULT 1,
  created_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  created_by_user_id          UUID            NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  CONSTRAINT showings_status_check       CHECK (status IN ('SCHEDULED','REMINDED','ATTENDED','NO_SHOW','CANCELLED')),
  CONSTRAINT showings_duration_check     CHECK (duration_minutes IS NULL OR duration_minutes BETWEEN 1 AND 480),
  CONSTRAINT showings_cancel_reason_check CHECK (cancellation_reason IS NULL OR cancellation_reason IN
    ('no_show','reschedule','lead_cancelled','agent_cancelled','seller_unavailable','other')),
  CONSTRAINT showings_feedback_range_check CHECK (feedback_score IS NULL OR feedback_score BETWEEN 1 AND 5),
  CONSTRAINT showings_reminder_channel_check CHECK (reminder_channel IS NULL OR reminder_channel IN ('whatsapp','email','both')),
  CONSTRAINT showings_reminder_delivery_check CHECK (reminder_delivery_status IS NULL OR reminder_delivery_status IN ('sent','delivered','read','failed'))
);

CREATE INDEX IF NOT EXISTS idx_showings_tenant_status
  ON showings (tenant_id, status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_showings_lead
  ON showings (tenant_id, lead_id, scheduled_at DESC);
CREATE INDEX IF NOT EXISTS idx_showings_property
  ON showings (tenant_id, property_id, scheduled_at DESC);
CREATE INDEX IF NOT EXISTS idx_showings_agent_calendar
  ON showings (tenant_id, agent_id, scheduled_at)
  WHERE status IN ('SCHEDULED','REMINDED');
CREATE INDEX IF NOT EXISTS idx_showings_noshow_scan
  ON showings (scheduled_at)
  WHERE status IN ('SCHEDULED','REMINDED') AND attended IS NULL;

-- Calendar conflict guard (only if btree_gist is available).
-- `timestamptz + interval` is only STABLE in PostgreSQL (day/month components are
-- timezone-dependent), so it cannot appear directly in an index expression. Adding a
-- pure minutes interval to an absolute instant IS timezone-independent, so this
-- wrapper is safe to declare IMMUTABLE.
CREATE OR REPLACE FUNCTION showing_slot_range(start_at TIMESTAMPTZ)
RETURNS tstzrange
LANGUAGE sql IMMUTABLE PARALLEL SAFE
AS $fn$ SELECT tstzrange(start_at, start_at + INTERVAL '60 minutes') $fn$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'btree_gist') THEN
    BEGIN
      ALTER TABLE showings ADD CONSTRAINT showings_agent_no_overlap
        EXCLUDE USING gist (
          agent_id WITH =,
          showing_slot_range(scheduled_at) WITH &&
        )
        WHERE (status IN ('SCHEDULED','REMINDED'));
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;
