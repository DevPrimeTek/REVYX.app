-- 0006_webhook_signatures.sql · Phase 0 Security Foundation (M1.S1)
-- Refs: TECH_SPEC_REVYX_phase0-security_v1.0.0.md §4.1.6 + §9 webhook replay protection

CREATE TABLE IF NOT EXISTS webhook_signatures (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider     TEXT NOT NULL,
  signature    TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  received_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT webhook_provider_check CHECK (provider IN ('meta', 'google', 'olx'))
);

CREATE UNIQUE INDEX IF NOT EXISTS webhook_signatures_provider_sig_uq
  ON webhook_signatures (provider, signature);

CREATE INDEX IF NOT EXISTS idx_webhook_sig_received
  ON webhook_signatures (received_at);
