import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { tenants } from './tenants';

export const gdprConsents = pgTable(
  'gdpr_consents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    subjectType: text('subject_type').notNull(),
    subjectId: uuid('subject_id').notNull(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
    consentChannel: text('consent_channel').notNull(),
    consentVersion: text('consent_version').notNull(),
    consentAt: timestamp('consent_at', { withTimezone: true }).notNull().defaultNow(),
    retentionUntil: timestamp('retention_until', { withTimezone: true }).notNull(),
    erasureRequested: timestamp('erasure_requested', { withTimezone: true }),
    erasureCompleted: timestamp('erasure_completed', { withTimezone: true }),
    restrictedAt: timestamp('restricted_at', { withTimezone: true }),
    rawConsentText: text('raw_consent_text').notNull(),
  },
  (t) => ({
    subjectIdx: index('idx_gdpr_consents_subject').on(t.subjectType, t.subjectId),
    retentionIdx: index('idx_gdpr_consents_retention')
      .on(t.retentionUntil)
      .where(sql`erasure_completed IS NULL`),
  })
);

export type GdprConsent = typeof gdprConsents.$inferSelect;
export type NewGdprConsent = typeof gdprConsents.$inferInsert;
