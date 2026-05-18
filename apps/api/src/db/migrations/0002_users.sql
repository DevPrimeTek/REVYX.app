-- 0002_users.sql · Phase 0 Security Foundation (M1.S1)
-- Refs: TECH_SPEC_REVYX_phase0-security_v1.0.0.md §4.1.2 + BRD §10.1.1

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('agent', 'senior_agent', 'team_lead', 'manager', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  email               TEXT NOT NULL,
  password_hash       TEXT NOT NULL,
  role                user_role NOT NULL DEFAULT 'agent',
  full_name           TEXT NOT NULL,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  password_changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at       TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  version             INTEGER NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX IF NOT EXISTS users_tenant_email_uq ON users (tenant_id, email);
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users (tenant_id);
