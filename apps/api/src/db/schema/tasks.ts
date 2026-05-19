import {
  pgTable,
  uuid,
  text,
  timestamp,
  numeric,
  jsonb,
  bigint,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { tenants } from './tenants';
import { users } from './users';

export const tasks = pgTable(
  'tasks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'restrict' }),
    agentId: uuid('agent_id').notNull().references(() => users.id, { onDelete: 'restrict' }),

    sourceEntityType: text('source_entity_type').notNull(),
    sourceEntityId: uuid('source_entity_id').notNull(),

    taskType: text('task_type').notNull(),
    taskLabel: text('task_label'),

    nbaScore: numeric('nba_score', { precision: 5, scale: 4 }).notNull().default('0.0000'),
    nbaComponents: jsonb('nba_components'),
    nbaCalculatedAt: timestamp('nba_calculated_at', { withTimezone: true }).notNull().defaultNow(),

    status: text('status').notNull().default('PENDING'),
    activatedAt: timestamp('activated_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    snoozedUntil: timestamp('snoozed_until', { withTimezone: true }),
    cancellationReason: text('cancellation_reason'),

    dueAt: timestamp('due_at', { withTimezone: true }),

    version: bigint('version', { mode: 'number' }).notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    agentActiveIdx: index('idx_tasks_agent_active').on(t.tenantId, t.agentId, t.nbaScore).where(sql`status = 'ACTIVE'`),
    agentPendingIdx: index('idx_tasks_agent_pending').on(t.tenantId, t.agentId, t.nbaScore).where(sql`status = 'PENDING'`),
    sourceIdx: index('idx_tasks_source').on(t.tenantId, t.sourceEntityType, t.sourceEntityId),
    dueIdx: index('idx_tasks_due').on(t.dueAt).where(sql`due_at IS NOT NULL AND status IN ('PENDING','ACTIVE')`),
  })
);

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
