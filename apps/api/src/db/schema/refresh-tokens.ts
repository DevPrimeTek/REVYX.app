import { pgTable, uuid, text, timestamp, index, type AnyPgColumn } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';
import { inet } from './types';

export const refreshTokens = pgTable(
  'refresh_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull().unique(),
    issuedAt: timestamp('issued_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    rotatedAt: timestamp('rotated_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    revokeReason: text('revoke_reason'),
    ipAddress: inet('ip_address'),
    userAgent: text('user_agent'),
    parentTokenId: uuid('parent_token_id').references((): AnyPgColumn => refreshTokens.id),
  },
  (t) => ({
    userActiveIdx: index('idx_refresh_tokens_user_active')
      .on(t.userId)
      .where(sql`revoked_at IS NULL AND rotated_at IS NULL`),
  })
);

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
