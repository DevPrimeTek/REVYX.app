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
import { deals } from './deals';

export const offers = pgTable(
  'offers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'restrict' }),
    dealId: uuid('deal_id').notNull().references(() => deals.id, { onDelete: 'restrict' }),

    offeredBy: text('offered_by').notNull(),
    offeredByUserId: uuid('offered_by_user_id').references(() => users.id, { onDelete: 'set null' }),
    amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
    currency: text('currency').notNull(),
    amountEurSnapshot: numeric('amount_eur_snapshot', { precision: 14, scale: 2 }).notNull(),
    fxRateToEur: numeric('fx_rate_to_eur', { precision: 12, scale: 6 }).notNull(),
    fxRateSource: text('fx_rate_source').notNull(),

    status: text('status').notNull().default('pending'),
    validUntil: timestamp('valid_until', { withTimezone: true }),
    counterToOfferId: uuid('counter_to_offer_id').references((): AnyPgColumn => offers.id, { onDelete: 'set null' }),
    chainRound: integer('chain_round').notNull().default(1),

    managerReviewRequired: boolean('manager_review_required').notNull().default(false),
    managerReviewedAt: timestamp('manager_reviewed_at', { withTimezone: true }),
    managerReviewedBy: uuid('manager_reviewed_by').references(() => users.id, { onDelete: 'set null' }),

    notes: text('notes'),
    metadata: jsonb('metadata'),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    respondedAt: timestamp('responded_at', { withTimezone: true }),
    respondedFxRateToEur: numeric('responded_fx_rate_to_eur', { precision: 12, scale: 6 }),
    withdrawReason: text('withdraw_reason'),

    version: bigint('version', { mode: 'number' }).notNull().default(1),
  },
  (t) => ({
    dealChainIdx: index('idx_offers_deal_chain').on(t.tenantId, t.dealId, t.chainRound),
    statusPendingIdx: index('idx_offers_status_pending').on(t.tenantId, t.status, t.validUntil).where(sql`status = 'pending'`),
    counterToIdx: index('idx_offers_counter_to').on(t.counterToOfferId).where(sql`counter_to_offer_id IS NOT NULL`),
    managerReviewIdx: index('idx_offers_manager_review')
      .on(t.tenantId, t.managerReviewRequired)
      .where(sql`manager_review_required = TRUE AND manager_reviewed_at IS NULL`),
  })
);

export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;
