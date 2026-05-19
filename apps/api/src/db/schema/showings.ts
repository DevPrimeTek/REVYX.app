import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  bigint,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { tenants } from './tenants';
import { users } from './users';
import { leads } from './leads';
import { properties } from './properties';
import { deals } from './deals';

export const showings = pgTable(
  'showings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'restrict' }),

    dealId: uuid('deal_id').notNull().references(() => deals.id, { onDelete: 'restrict' }),
    propertyId: uuid('property_id').notNull().references(() => properties.id, { onDelete: 'restrict' }),
    leadId: uuid('lead_id').notNull().references(() => leads.id, { onDelete: 'restrict' }),
    agentId: uuid('agent_id').notNull().references(() => users.id, { onDelete: 'restrict' }),

    scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
    durationMinutes: integer('duration_minutes'),

    status: text('status').notNull().default('SCHEDULED'),

    attended: boolean('attended'),
    cancellationReason: text('cancellation_reason'),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    advanceNoticeHours: numeric('advance_notice_hours', { precision: 6, scale: 2 }),

    feedbackScore: integer('feedback_score'),
    feedbackNotes: text('feedback_notes'),
    feedbackAt: timestamp('feedback_at', { withTimezone: true }),
    feedbackByUserId: uuid('feedback_by_user_id').references(() => users.id, { onDelete: 'set null' }),

    reminderSentAt: timestamp('reminder_sent_at', { withTimezone: true }),
    reminderChannel: text('reminder_channel'),
    reminderDeliveryStatus: text('reminder_delivery_status'),

    version: bigint('version', { mode: 'number' }).notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    createdByUserId: uuid('created_by_user_id').notNull().references(() => users.id, { onDelete: 'restrict' }),
  },
  (t) => ({
    tenantStatusIdx: index('idx_showings_tenant_status').on(t.tenantId, t.status, t.scheduledAt),
    leadIdx: index('idx_showings_lead').on(t.tenantId, t.leadId, t.scheduledAt),
    propertyIdx: index('idx_showings_property').on(t.tenantId, t.propertyId, t.scheduledAt),
    agentCalendarIdx: index('idx_showings_agent_calendar')
      .on(t.tenantId, t.agentId, t.scheduledAt)
      .where(sql`status IN ('SCHEDULED','REMINDED')`),
    noshowScanIdx: index('idx_showings_noshow_scan')
      .on(t.scheduledAt)
      .where(sql`status IN ('SCHEDULED','REMINDED') AND attended IS NULL`),
  })
);

export type Showing = typeof showings.$inferSelect;
export type NewShowing = typeof showings.$inferInsert;
