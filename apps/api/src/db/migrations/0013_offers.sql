-- 0013_offers.sql · Phase A Foundation (M1.S2)
-- Refs: BRD §8 (OFFER) + TECH_SPEC_REVYX_offer-engine_v1.0.0.md §4.1
-- T07 fixture: OFFER chain A → B → C → D via counter_to_offer_id with same deal_id.

CREATE TABLE IF NOT EXISTS offers (
  id                          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                   UUID            NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  deal_id                     UUID            NOT NULL REFERENCES deals(id) ON DELETE RESTRICT,

  offered_by                  TEXT            NOT NULL,
  offered_by_user_id          UUID            NULL REFERENCES users(id) ON DELETE SET NULL,
  amount                      NUMERIC(14,2)   NOT NULL,
  currency                    TEXT            NOT NULL,
  amount_eur_snapshot         NUMERIC(14,2)   NOT NULL,
  fx_rate_to_eur              NUMERIC(12,6)   NOT NULL,
  fx_rate_source              TEXT            NOT NULL,

  status                      TEXT            NOT NULL DEFAULT 'pending',
  valid_until                 TIMESTAMPTZ     NULL,
  counter_to_offer_id         UUID            NULL REFERENCES offers(id) ON DELETE SET NULL,
  chain_round                 INTEGER         NOT NULL DEFAULT 1,

  manager_review_required     BOOLEAN         NOT NULL DEFAULT FALSE,
  manager_reviewed_at         TIMESTAMPTZ     NULL,
  manager_reviewed_by         UUID            NULL REFERENCES users(id) ON DELETE SET NULL,

  notes                       TEXT            NULL,
  metadata                    JSONB           NULL,

  created_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  responded_at                TIMESTAMPTZ     NULL,
  responded_fx_rate_to_eur    NUMERIC(12,6)   NULL,
  withdraw_reason             TEXT            NULL,

  version                     BIGINT          NOT NULL DEFAULT 1,

  CONSTRAINT offers_offered_by_check  CHECK (offered_by IN ('buyer','agent_on_behalf_buyer','seller','agent_on_behalf_seller')),
  CONSTRAINT offers_amount_pos_check  CHECK (amount > 0),
  CONSTRAINT offers_currency_check    CHECK (currency IN ('EUR','MDL','USD')),
  CONSTRAINT offers_fx_source_check   CHECK (fx_rate_source IN ('BNM','ECB','MANUAL')),
  CONSTRAINT offers_status_check      CHECK (status IN ('pending','accepted','rejected','countered','withdrawn','expired')),
  CONSTRAINT offers_chain_round_check CHECK (chain_round >= 1)
);

CREATE INDEX IF NOT EXISTS idx_offers_deal_chain
  ON offers (tenant_id, deal_id, chain_round DESC);
CREATE INDEX IF NOT EXISTS idx_offers_status_pending
  ON offers (tenant_id, status, valid_until)
  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_offers_counter_to
  ON offers (counter_to_offer_id) WHERE counter_to_offer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_offers_manager_review
  ON offers (tenant_id, manager_review_required)
  WHERE manager_review_required = TRUE AND manager_reviewed_at IS NULL;

-- Counter-chain integrity: counter_to_offer_id must reference an offer in the same deal.
CREATE OR REPLACE FUNCTION offer_validate_counter_parent() RETURNS TRIGGER AS $$
DECLARE
  parent_deal_id UUID;
BEGIN
  IF NEW.counter_to_offer_id IS NOT NULL THEN
    SELECT deal_id INTO parent_deal_id FROM offers WHERE id = NEW.counter_to_offer_id;
    IF parent_deal_id IS NULL THEN
      RAISE EXCEPTION 'OFFER_INVALID_COUNTER_PARENT: parent offer % does not exist', NEW.counter_to_offer_id
        USING ERRCODE = '23503';
    END IF;
    IF parent_deal_id <> NEW.deal_id THEN
      RAISE EXCEPTION 'OFFER_INVALID_COUNTER_PARENT: deal mismatch (parent=%, new=%)', parent_deal_id, NEW.deal_id
        USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_offers_validate_counter ON offers;
CREATE TRIGGER trg_offers_validate_counter
  BEFORE INSERT OR UPDATE OF counter_to_offer_id ON offers
  FOR EACH ROW EXECUTE FUNCTION offer_validate_counter_parent();
