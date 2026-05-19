-- 0008_leads.sql · Phase A Foundation (M1.S2)
-- Refs: BRD §8 (LEAD entity, GDPR fields) + TECH_SPEC_REVYX_lead-scoring_v1.0.0.md §4.1
-- BR-02 LS_initial = 0.30 · TS_initial = 0.50 · BR-06 GDPR consent at intake

CREATE TABLE IF NOT EXISTS leads (
  id                          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                   UUID            NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  source                      TEXT            NOT NULL,
  source_external_id          TEXT            NULL,

  full_name                   TEXT            NULL,
  phone_e164                  TEXT            NULL,
  email                       TEXT            NULL,
  phone_verified              BOOLEAN         NOT NULL DEFAULT FALSE,
  email_verified              BOOLEAN         NOT NULL DEFAULT FALSE,

  intent_declared             NUMERIC(4,3)    NULL,
  budget_min_eur              NUMERIC(12,2)   NULL,
  budget_max_eur              NUMERIC(12,2)   NULL,
  budget_validated            BOOLEAN         NOT NULL DEFAULT FALSE,
  timeline_urgency_label      TEXT            NULL,
  preferred_property_type     TEXT            NULL,
  preferred_location          TEXT            NULL,

  lead_score                  NUMERIC(4,3)    NOT NULL DEFAULT 0.300,
  trust_score                 NUMERIC(4,3)    NOT NULL DEFAULT 0.500,
  interaction_strength        NUMERIC(4,3)    NOT NULL DEFAULT 0.000,
  score_components            JSONB           NULL,
  score_initialized_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  score_recalculated_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  firewall_state              TEXT            NOT NULL DEFAULT 'PENDING',
  firewall_reason             TEXT            NULL,
  override_by_user_id         UUID            NULL REFERENCES users(id) ON DELETE SET NULL,
  override_at                 TIMESTAMPTZ     NULL,
  override_reason             TEXT            NULL,
  assigned_agent_id           UUID            NULL REFERENCES users(id) ON DELETE SET NULL,
  assigned_at                 TIMESTAMPTZ     NULL,

  escalation_level            SMALLINT        NOT NULL DEFAULT 0,
  sla_due_at                  TIMESTAMPTZ     NULL,

  gdpr_consent_at             TIMESTAMPTZ     NOT NULL,
  gdpr_consent_channel        TEXT            NOT NULL,
  gdpr_consent_version        TEXT            NOT NULL,
  data_retention_expires_at   TIMESTAMPTZ     NOT NULL,
  erasure_requested_at        TIMESTAMPTZ     NULL,

  status                      TEXT            NOT NULL DEFAULT 'NEW',
  consecutive_no_show_count   SMALLINT        NOT NULL DEFAULT 0,
  last_showing_at             TIMESTAMPTZ     NULL,

  dedup_hash                  TEXT            NULL,
  duplicate_of_lead_id        UUID            NULL REFERENCES leads(id) ON DELETE SET NULL,

  version                     BIGINT          NOT NULL DEFAULT 1,
  created_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  CONSTRAINT leads_source_check               CHECK (source IN ('meta','google','olx','referral','manual','import')),
  CONSTRAINT leads_intent_range_check         CHECK (intent_declared IS NULL OR intent_declared BETWEEN 0 AND 1),
  CONSTRAINT leads_timeline_check             CHECK (timeline_urgency_label IS NULL OR timeline_urgency_label IN ('immediate','3m','6m','12m','exploratory')),
  CONSTRAINT leads_ls_range_check             CHECK (lead_score BETWEEN 0 AND 1),
  CONSTRAINT leads_ts_range_check             CHECK (trust_score BETWEEN 0 AND 1),
  CONSTRAINT leads_is_range_check             CHECK (interaction_strength BETWEEN 0 AND 1),
  CONSTRAINT leads_firewall_state_check       CHECK (firewall_state IN ('PENDING','BLOCKED','QUEUED','OVERRIDDEN','NURTURING')),
  CONSTRAINT leads_escalation_range_check     CHECK (escalation_level BETWEEN 0 AND 3),
  CONSTRAINT leads_status_check               CHECK (status IN ('NEW','QUALIFIED','CONTACTED','SHOWING','NEGOTIATION','WON','LOST','NURTURING'))
);

CREATE INDEX IF NOT EXISTS idx_leads_tenant_status        ON leads (tenant_id, status, lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_firewall             ON leads (tenant_id, firewall_state, lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_agent       ON leads (tenant_id, assigned_agent_id) WHERE assigned_agent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_sla_due              ON leads (sla_due_at) WHERE sla_due_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_dedup                ON leads (tenant_id, dedup_hash) WHERE dedup_hash IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_phone                ON leads (tenant_id, phone_e164) WHERE phone_e164 IS NOT NULL;
