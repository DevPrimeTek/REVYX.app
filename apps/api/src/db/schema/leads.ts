import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  jsonb,
  bigint,
  index,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { tenants } from './tenants';
import { users } from './users';

export const leads = pgTable(
  'leads',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'restrict' }),

    source: text('source').notNull(),
    sourceExternalId: text('source_external_id'),

    fullName: text('full_name'),
    phoneE164: text('phone_e164'),
    email: text('email'),
    phoneVerified: boolean('phone_verified').notNull().default(false),
    emailVerified: boolean('email_verified').notNull().default(false),

    intentDeclared: numeric('intent_declared', { precision: 4, scale: 3 }),
    budgetMinEur: numeric('budget_min_eur', { precision: 12, scale: 2 }),
    budgetMaxEur: numeric('budget_max_eur', { precision: 12, scale: 2 }),
    budgetValidated: boolean('budget_validated').notNull().default(false),
    timelineUrgencyLabel: text('timeline_urgency_label'),
    preferredPropertyType: text('preferred_property_type'),
    preferredLocation: text('preferred_location'),

    leadScore: numeric('lead_score', { precision: 4, scale: 3 }).notNull().default('0.300'),
    trustScore: numeric('trust_score', { precision: 4, scale: 3 }).notNull().default('0.500'),
    interactionStrength: numeric('interaction_strength', { precision: 4, scale: 3 }).notNull().default('0.000'),
    scoreComponents: jsonb('score_components'),
    scoreInitializedAt: timestamp('score_initialized_at', { withTimezone: true }).notNull().defaultNow(),
    scoreRecalculatedAt: timestamp('score_recalculated_at', { withTimezone: true }).notNull().defaultNow(),

    firewallState: text('firewall_state').notNull().default('PENDING'),
    firewallReason: text('firewall_reason'),
    overrideByUserId: uuid('override_by_user_id').references(() => users.id, { onDelete: 'set null' }),
    overrideAt: timestamp('override_at', { withTimezone: true }),
    overrideReason: text('override_reason'),
    assignedAgentId: uuid('assigned_agent_id').references(() => users.id, { onDelete: 'set null' }),
    assignedAt: timestamp('assigned_at', { withTimezone: true }),

    escalationLevel: integer('escalation_level').notNull().default(0),
    slaDueAt: timestamp('sla_due_at', { withTimezone: true }),

    gdprConsentAt: timestamp('gdpr_consent_at', { withTimezone: true }).notNull(),
    gdprConsentChannel: text('gdpr_consent_channel').notNull(),
    gdprConsentVersion: text('gdpr_consent_version').notNull(),
    dataRetentionExpiresAt: timestamp('data_retention_expires_at', { withTimezone: true }).notNull(),
    erasureRequestedAt: timestamp('erasure_requested_at', { withTimezone: true }),

    status: text('status').notNull().default('NEW'),
    consecutiveNoShowCount: integer('consecutive_no_show_count').notNull().default(0),
    lastShowingAt: timestamp('last_showing_at', { withTimezone: true }),

    dedupHash: text('dedup_hash'),
    duplicateOfLeadId: uuid('duplicate_of_lead_id').references((): AnyPgColumn => leads.id, { onDelete: 'set null' }),

    version: bigint('version', { mode: 'number' }).notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    tenantStatusIdx: index('idx_leads_tenant_status').on(t.tenantId, t.status, t.leadScore),
    firewallIdx: index('idx_leads_firewall').on(t.tenantId, t.firewallState, t.leadScore),
    assignedAgentIdx: index('idx_leads_assigned_agent').on(t.tenantId, t.assignedAgentId).where(sql`assigned_agent_id IS NOT NULL`),
    slaDueIdx: index('idx_leads_sla_due').on(t.slaDueAt).where(sql`sla_due_at IS NOT NULL`),
    dedupIdx: index('idx_leads_dedup').on(t.tenantId, t.dedupHash).where(sql`dedup_hash IS NOT NULL`),
    phoneIdx: index('idx_leads_phone').on(t.tenantId, t.phoneE164).where(sql`phone_e164 IS NOT NULL`),
  })
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
