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
  date,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { tenants } from './tenants';
import { users } from './users';
import { leads } from './leads';
import { properties } from './properties';

export const deals = pgTable(
  'deals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'restrict' }),

    leadId: uuid('lead_id').notNull().references(() => leads.id, { onDelete: 'restrict' }),
    propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'restrict' }),
    agentId: uuid('agent_id').notNull().references(() => users.id, { onDelete: 'restrict' }),

    status: text('status').notNull().default('NEW'),
    needsReview: boolean('needs_review').notNull().default(false),
    escalationLevel: integer('escalation_level').notNull().default(0),

    urgencyLabel: text('urgency_label'),
    expectedCloseDate: date('expected_close_date'),

    dealProbability: numeric('deal_probability', { precision: 4, scale: 3 }),
    dealHealthIndex: numeric('deal_health_index', { precision: 4, scale: 3 }),
    dpComponents: jsonb('dp_components'),
    dhiComponents: jsonb('dhi_components'),
    scoringRecalculatedAt: timestamp('scoring_recalculated_at', { withTimezone: true }),

    managerReviewRequired: boolean('manager_review_required').notNull().default(false),
    managerReviewedAt: timestamp('manager_reviewed_at', { withTimezone: true }),
    managerReviewedBy: uuid('manager_reviewed_by').references(() => users.id, { onDelete: 'set null' }),
    longNegotiationFlaggedAt: timestamp('long_negotiation_flagged_at', { withTimezone: true }),

    closurePhase: text('closure_phase'),
    wonAt: timestamp('won_at', { withTimezone: true }),
    lostReason: text('lost_reason'),
    soldPriceEur: numeric('sold_price_eur', { precision: 14, scale: 2 }),

    version: bigint('version', { mode: 'number' }).notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    tenantStatusIdx: index('idx_deals_tenant_status').on(t.tenantId, t.status),
    agentIdx: index('idx_deals_agent').on(t.tenantId, t.agentId, t.status),
    leadIdx: index('idx_deals_lead').on(t.tenantId, t.leadId),
    propertyIdx: index('idx_deals_property').on(t.tenantId, t.propertyId),
    needsReviewIdx: index('idx_deals_needs_review').on(t.tenantId).where(sql`needs_review = TRUE`),
    dhiUnhealthyIdx: index('idx_deals_dhi_unhealthy').on(t.tenantId, t.dealHealthIndex).where(sql`deal_health_index < 0.40`),
    wonUnarchivedIdx: index('idx_deals_won_unarchived').on(t.tenantId, t.wonAt).where(sql`status = 'WON'`),
  })
);

export type Deal = typeof deals.$inferSelect;
export type NewDeal = typeof deals.$inferInsert;
