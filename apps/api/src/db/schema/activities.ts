import { pgTable, uuid, text, timestamp, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { tenants } from './tenants';
import { users } from './users';

export const activities = pgTable(
  'activities',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'restrict' }),

    entityType: text('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),

    activityType: text('activity_type').notNull(),
    performedBy: uuid('performed_by').references(() => users.id, { onDelete: 'set null' }),
    channel: text('channel'),
    durationSeconds: integer('duration_seconds'),
    metadata: jsonb('metadata'),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    entityTimeIdx: index('idx_activities_entity_time').on(t.tenantId, t.entityType, t.entityId, t.occurredAt),
    performerTimeIdx: index('idx_activities_performer_time')
      .on(t.tenantId, t.performedBy, t.occurredAt)
      .where(sql`performed_by IS NOT NULL`),
  })
);

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;
