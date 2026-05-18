import { pgTable, bigserial, uuid, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { inet } from './types';

export const auditLog = pgTable(
  'audit_log',
  {
    id: bigserial('id', { mode: 'bigint' }).primaryKey(),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull().defaultNow(),
    tenantId: uuid('tenant_id'),
    actorId: uuid('actor_id'),
    actorType: text('actor_type').notNull(),
    eventType: text('event_type').notNull(),
    entityType: text('entity_type'),
    entityId: uuid('entity_id'),
    correlationId: uuid('correlation_id'),
    requestId: uuid('request_id'),
    ipAddress: inet('ip_address'),
    userAgent: text('user_agent'),
    metadata: jsonb('metadata').notNull().default({}),
    severity: text('severity').notNull().default('INFO'),
  },
  (t) => ({
    tenantTimeIdx: index('idx_audit_log_tenant_time').on(t.tenantId, t.occurredAt),
    actorTimeIdx: index('idx_audit_log_actor_time').on(t.actorId, t.occurredAt),
    eventIdx: index('idx_audit_log_event').on(t.eventType, t.occurredAt),
    entityIdx: index('idx_audit_log_entity').on(t.entityType, t.entityId),
  })
);

export type AuditLogRow = typeof auditLog.$inferSelect;
export type NewAuditLogRow = typeof auditLog.$inferInsert;
