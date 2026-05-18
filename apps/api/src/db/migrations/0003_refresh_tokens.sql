-- 0003_refresh_tokens.sql · Phase 0 Security Foundation (M1.S1)
-- Refs: TECH_SPEC_REVYX_phase0-security_v1.0.0.md §4.1.3 + §6.3 rotation

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash      TEXT NOT NULL UNIQUE,
  issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMPTZ NOT NULL,
  rotated_at      TIMESTAMPTZ,
  revoked_at      TIMESTAMPTZ,
  revoke_reason   TEXT,
  ip_address      INET,
  user_agent      TEXT,
  parent_token_id UUID REFERENCES refresh_tokens(id),
  CONSTRAINT refresh_tokens_exp_gt_issue CHECK (expires_at > issued_at)
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_active
  ON refresh_tokens (user_id)
  WHERE revoked_at IS NULL AND rotated_at IS NULL;
