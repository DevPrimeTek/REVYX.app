-- 0009_properties.sql · Phase A Foundation (M1.S2)
-- Refs: BRD §8 (PROPERTY) + TECH_SPEC_REVYX_property_v1.0.0.md §4.1
-- pgvector & embedding column deferred to Phase 3 (BRD §11 Phase 3) — kept out of M1.

CREATE TABLE IF NOT EXISTS properties (
  id                          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                   UUID            NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,

  external_ref                TEXT            NULL,
  property_type               TEXT            NOT NULL,
  transaction_type            TEXT            NOT NULL,

  country                     TEXT            NOT NULL DEFAULT 'MD',
  city                        TEXT            NOT NULL,
  district                    TEXT            NULL,
  address_line                TEXT            NULL,
  geo_lat                     NUMERIC(9,6)    NULL,
  geo_lng                     NUMERIC(9,6)    NULL,

  area_sqm                    NUMERIC(8,2)    NOT NULL,
  rooms                       SMALLINT        NULL,
  bathrooms                   SMALLINT        NULL,
  floor                       SMALLINT        NULL,
  total_floors                SMALLINT        NULL,
  year_built                  SMALLINT        NULL,
  condition_grade             TEXT            NULL,
  has_parking                 BOOLEAN         NOT NULL DEFAULT FALSE,
  has_balcony                 BOOLEAN         NOT NULL DEFAULT FALSE,
  energy_class                TEXT            NULL,

  price_amount                NUMERIC(14,2)   NOT NULL,
  price_currency              TEXT            NOT NULL DEFAULT 'EUR',
  price_per_sqm_eur           NUMERIC(10,2)   GENERATED ALWAYS AS (
    CASE WHEN price_currency = 'EUR' AND area_sqm > 0
         THEN ROUND(price_amount / area_sqm, 2)
         ELSE NULL END
  ) STORED,

  property_score              NUMERIC(4,3)    NOT NULL DEFAULT 0.500,
  listing_freshness_score     NUMERIC(4,3)    NOT NULL DEFAULT 1.000,
  market_velocity_score       NUMERIC(4,3)    NULL,
  score_components            JSONB           NULL,
  score_recalculated_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  ai_recommended_price_eur    NUMERIC(14,2)   NULL,
  ai_price_provider           TEXT            NULL,
  ai_price_confidence         NUMERIC(4,3)    NULL,
  ai_price_calculated_at      TIMESTAMPTZ     NULL,

  status                      TEXT            NOT NULL DEFAULT 'DRAFT',
  listed_at                   TIMESTAMPTZ     NULL,
  withdrawn_at                TIMESTAMPTZ     NULL,
  sold_at                     TIMESTAMPTZ     NULL,

  showcase_token              TEXT            NULL UNIQUE,
  showcase_published_at       TIMESTAMPTZ     NULL,
  showcase_expires_at         TIMESTAMPTZ     NULL,

  description                 TEXT            NULL,
  features                    JSONB           NULL,

  seller_id                   UUID            NULL,
  listing_agent_id            UUID            NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  version                     BIGINT          NOT NULL DEFAULT 1,
  created_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  CONSTRAINT properties_property_type_check  CHECK (property_type IN ('apartment','house','commercial','land','office')),
  CONSTRAINT properties_transaction_type_check CHECK (transaction_type IN ('sale','rent')),
  CONSTRAINT properties_condition_grade_check CHECK (condition_grade IS NULL OR condition_grade IN ('new','renovated','good','needs_repair','demolition')),
  CONSTRAINT properties_price_currency_check  CHECK (price_currency IN ('EUR','MDL','USD')),
  CONSTRAINT properties_area_positive_check   CHECK (area_sqm > 0),
  CONSTRAINT properties_price_nonneg_check    CHECK (price_amount >= 0),
  CONSTRAINT properties_ps_range_check        CHECK (property_score BETWEEN 0 AND 1),
  CONSTRAINT properties_lf_range_check        CHECK (listing_freshness_score BETWEEN 0 AND 1),
  CONSTRAINT properties_mv_range_check        CHECK (market_velocity_score IS NULL OR market_velocity_score BETWEEN 0 AND 1),
  CONSTRAINT properties_status_check          CHECK (status IN ('DRAFT','ACTIVE','RESERVED','SOLD','WITHDRAWN','EXPIRED'))
);

CREATE INDEX IF NOT EXISTS idx_properties_tenant_status  ON properties (tenant_id, status, property_score DESC);
CREATE INDEX IF NOT EXISTS idx_properties_geo            ON properties (tenant_id, city, district);
CREATE INDEX IF NOT EXISTS idx_properties_price_eur      ON properties (tenant_id, price_per_sqm_eur) WHERE price_currency = 'EUR';
CREATE INDEX IF NOT EXISTS idx_properties_listed_at      ON properties (listed_at) WHERE listed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_properties_listing_agent  ON properties (tenant_id, listing_agent_id);
