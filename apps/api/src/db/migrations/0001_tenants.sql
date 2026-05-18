-- 0001_tenants.sql · Phase 0 Security Foundation (M1.S1)
-- Refs: TECH_SPEC_REVYX_phase0-security_v1.0.0.md §4.1.1

CREATE TABLE IF NOT EXISTS tenants (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       TEXT NOT NULL UNIQUE,
  name       TEXT NOT NULL,
  plan_tier  TEXT NOT NULL DEFAULT 'STARTER',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  version    INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT tenants_plan_tier_check CHECK (plan_tier IN ('STARTER', 'BUSINESS', 'ENTERPRISE'))
);
