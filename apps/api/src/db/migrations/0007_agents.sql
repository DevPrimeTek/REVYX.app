-- 0007_agents.sql · Phase A Foundation (M1.S2)
-- Refs: BRD §8 (AGENT entity) + BRD §7.7 (APS) + BR-11 (APS_default for <5 deals OR <30 days)
--
-- Decision: AGENT == USER with role IN (agent, senior_agent, team_lead) extended with
-- agent-specific operational fields. No separate `agent` table — avoids 1:1 join overhead
-- and keeps RBAC + auth columns in a single row. FK targets `users.id`.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS agent_since_date     DATE        NULL,
  ADD COLUMN IF NOT EXISTS out_of_office_until  TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS language_skills      JSONB       NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS calendar_sync_token  TEXT        NULL;

-- Partial index for active agents (used in assignment / queue routing M1.S4).
CREATE INDEX IF NOT EXISTS idx_users_active_agents
  ON users (tenant_id, role)
  WHERE is_active = TRUE AND role IN ('agent', 'senior_agent', 'team_lead');
