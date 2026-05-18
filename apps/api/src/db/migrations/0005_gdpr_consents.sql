-- 0005_gdpr_consents.sql · Phase 0 Security Foundation (M1.S1)
-- Refs: TECH_SPEC_REVYX_phase0-security_v1.0.0.md §4.1.5 + BRD §9.4

CREATE TABLE IF NOT EXISTS gdpr_consents (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_type       TEXT NOT NULL,
  subject_id         UUID NOT NULL,
  tenant_id          UUID NOT NULL REFERENCES tenants(id),
  consent_channel    TEXT NOT NULL,
  consent_version    TEXT NOT NULL,
  consent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  retention_until    TIMESTAMPTZ NOT NULL,
  erasure_requested  TIMESTAMPTZ,
  erasure_completed  TIMESTAMPTZ,
  restricted_at      TIMESTAMPTZ,
  raw_consent_text   TEXT NOT NULL,
  CONSTRAINT gdpr_consents_retention_after_consent CHECK (retention_until > consent_at),
  CONSTRAINT gdpr_consents_subject_type_check CHECK (subject_type IN ('LEAD', 'USER', 'BUYER'))
);

CREATE INDEX IF NOT EXISTS idx_gdpr_consents_subject
  ON gdpr_consents (subject_type, subject_id);

CREATE INDEX IF NOT EXISTS idx_gdpr_consents_retention
  ON gdpr_consents (retention_until)
  WHERE erasure_completed IS NULL;
