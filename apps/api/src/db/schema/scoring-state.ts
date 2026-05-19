import { pgTable, uuid, text, timestamp, numeric, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const scoringState = pgTable(
  'scoring_state',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'restrict' }),

    entityType: text('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),

    scoreKind: text('score_kind').notNull(),
    scoreValue: numeric('score_value', { precision: 5, scale: 4 }).notNull(),
    components: jsonb('components').notNull().default({}),
    inputsHash: text('inputs_hash'),

    computedAt: timestamp('computed_at', { withTimezone: true }).notNull().defaultNow(),
    computedBy: text('computed_by').notNull().default('engine'),
    engineVersion: text('engine_version'),
  },
  (t) => ({
    entityKindUq: uniqueIndex('scoring_state_entity_kind_uq').on(t.tenantId, t.entityType, t.entityId, t.scoreKind),
    recentIdx: index('idx_scoring_state_recent').on(t.tenantId, t.entityType, t.scoreKind, t.computedAt),
  })
);

export type ScoringState = typeof scoringState.$inferSelect;
export type NewScoringState = typeof scoringState.$inferInsert;
