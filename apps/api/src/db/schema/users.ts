import { pgTable, uuid, text, timestamp, boolean, integer, pgEnum, uniqueIndex, index, date, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { tenants } from './tenants';

export const userRoleEnum = pgEnum('user_role', [
  'agent',
  'senior_agent',
  'team_lead',
  'manager',
  'admin',
]);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'restrict' }),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    role: userRoleEnum('role').notNull().default('agent'),
    fullName: text('full_name').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    passwordChangedAt: timestamp('password_changed_at', { withTimezone: true }).notNull().defaultNow(),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    version: integer('version').notNull().default(1),
    // ★ M1.S2 agent extension (BRD §8 AGENT entity + BR-11 APS_default gating)
    agentSinceDate: date('agent_since_date'),
    outOfOfficeUntil: timestamp('out_of_office_until', { withTimezone: true }),
    languageSkills: jsonb('language_skills').notNull().default([]),
    calendarSyncToken: text('calendar_sync_token'),
  },
  (t) => ({
    tenantEmailUq: uniqueIndex('users_tenant_email_uq').on(t.tenantId, t.email),
    tenantIdx: index('idx_users_tenant').on(t.tenantId),
    activeAgentsIdx: index('idx_users_active_agents')
      .on(t.tenantId, t.role)
      .where(sql`is_active = TRUE AND role IN ('agent', 'senior_agent', 'team_lead')`),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
