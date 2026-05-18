import { pgTable, uuid, text, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';

export const webhookSignatures = pgTable(
  'webhook_signatures',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    provider: text('provider').notNull(),
    signature: text('signature').notNull(),
    payloadHash: text('payload_hash').notNull(),
    receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    providerSigUq: uniqueIndex('webhook_signatures_provider_sig_uq').on(t.provider, t.signature),
    receivedIdx: index('idx_webhook_sig_received').on(t.receivedAt),
  })
);

export type WebhookSignature = typeof webhookSignatures.$inferSelect;
export type NewWebhookSignature = typeof webhookSignatures.$inferInsert;
