-- 0010_deals.sql · Phase A Foundation (M1.S2)
-- Refs: BRD §8 (DEAL: escalation_level + needs_review) + offer-engine §4.2 (manager_review)
--       + deal-closure §4.1 closure fields (subset M1.S2 — closure_phase/won_at; full closure M1.S6)
-- Phase B+ engines (NBA, DHI) will read/update urgency_label, expected_close_date, deal_health_index.

CREATE TABLE IF NOT EXISTS deals (
  id                            UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                     UUID            NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  lead_id                       UUID            NOT NULL REFERENCES leads(id) ON DELETE RESTRICT,
  property_id                   UUID            NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
  agent_id                      UUID            NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  status                        TEXT            NOT NULL DEFAULT 'NEW',
  needs_review                  BOOLEAN         NOT NULL DEFAULT FALSE,
  escalation_level              SMALLINT        NOT NULL DEFAULT 0,

  urgency_label                 TEXT            NULL,
  expected_close_date           DATE            NULL,

  deal_probability              NUMERIC(4,3)    NULL,
  deal_health_index             NUMERIC(4,3)    NULL,
  dp_components                 JSONB           NULL,
  dhi_components                JSONB           NULL,
  scoring_recalculated_at       TIMESTAMPTZ     NULL,

  manager_review_required       BOOLEAN         NOT NULL DEFAULT FALSE,
  manager_reviewed_at           TIMESTAMPTZ     NULL,
  manager_reviewed_by           UUID            NULL REFERENCES users(id) ON DELETE SET NULL,
  long_negotiation_flagged_at   TIMESTAMPTZ     NULL,

  -- Closure subset (M1.S6 expands to full deal-closure spec §4.1)
  closure_phase                 TEXT            NULL,
  won_at                        TIMESTAMPTZ     NULL,
  lost_reason                   TEXT            NULL,
  sold_price_eur                NUMERIC(14,2)   NULL,

  version                       BIGINT          NOT NULL DEFAULT 1,
  created_at                    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at                    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  CONSTRAINT deals_status_check         CHECK (status IN ('NEW','QUALIFIED','SHOWING','NEGOTIATION','WON_PENDING_NOTARY','WON','LOST','CANCELLED')),
  CONSTRAINT deals_escalation_range_check CHECK (escalation_level BETWEEN 0 AND 3),
  CONSTRAINT deals_urgency_check        CHECK (urgency_label IS NULL OR urgency_label IN ('normal','approaching','declared','critical')),
  CONSTRAINT deals_dp_range_check       CHECK (deal_probability IS NULL OR deal_probability BETWEEN 0 AND 1),
  CONSTRAINT deals_dhi_range_check      CHECK (deal_health_index IS NULL OR deal_health_index BETWEEN 0 AND 1),
  CONSTRAINT deals_closure_phase_check  CHECK (closure_phase IS NULL OR closure_phase IN (
    'STARTED','AVANS_PAID','FINANCING_PENDING','FINANCING_APPROVED','FINANCING_REJECTED',
    'NOTARY_SCHEDULED','NOTARIZED','CADASTRE_REGISTERED','WON'
  ))
);

CREATE INDEX IF NOT EXISTS idx_deals_tenant_status      ON deals (tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_deals_agent              ON deals (tenant_id, agent_id, status);
CREATE INDEX IF NOT EXISTS idx_deals_lead               ON deals (tenant_id, lead_id);
CREATE INDEX IF NOT EXISTS idx_deals_property           ON deals (tenant_id, property_id);
CREATE INDEX IF NOT EXISTS idx_deals_needs_review       ON deals (tenant_id) WHERE needs_review = TRUE;
CREATE INDEX IF NOT EXISTS idx_deals_dhi_unhealthy      ON deals (tenant_id, deal_health_index) WHERE deal_health_index < 0.40;
CREATE INDEX IF NOT EXISTS idx_deals_won_unarchived     ON deals (tenant_id, won_at) WHERE status = 'WON';
