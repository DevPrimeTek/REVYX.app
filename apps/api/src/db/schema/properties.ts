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
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { tenants } from './tenants';
import { users } from './users';

export const properties = pgTable(
  'properties',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'restrict' }),

    externalRef: text('external_ref'),
    propertyType: text('property_type').notNull(),
    transactionType: text('transaction_type').notNull(),

    country: text('country').notNull().default('MD'),
    city: text('city').notNull(),
    district: text('district'),
    addressLine: text('address_line'),
    geoLat: numeric('geo_lat', { precision: 9, scale: 6 }),
    geoLng: numeric('geo_lng', { precision: 9, scale: 6 }),

    areaSqm: numeric('area_sqm', { precision: 8, scale: 2 }).notNull(),
    rooms: integer('rooms'),
    bathrooms: integer('bathrooms'),
    floor: integer('floor'),
    totalFloors: integer('total_floors'),
    yearBuilt: integer('year_built'),
    conditionGrade: text('condition_grade'),
    hasParking: boolean('has_parking').notNull().default(false),
    hasBalcony: boolean('has_balcony').notNull().default(false),
    energyClass: text('energy_class'),

    priceAmount: numeric('price_amount', { precision: 14, scale: 2 }).notNull(),
    priceCurrency: text('price_currency').notNull().default('EUR'),
    // pricePerSqmEur is GENERATED ALWAYS — readable via select but not insertable.
    pricePerSqmEur: numeric('price_per_sqm_eur', { precision: 10, scale: 2 }),

    propertyScore: numeric('property_score', { precision: 4, scale: 3 }).notNull().default('0.500'),
    listingFreshnessScore: numeric('listing_freshness_score', { precision: 4, scale: 3 }).notNull().default('1.000'),
    marketVelocityScore: numeric('market_velocity_score', { precision: 4, scale: 3 }),
    scoreComponents: jsonb('score_components'),
    scoreRecalculatedAt: timestamp('score_recalculated_at', { withTimezone: true }).notNull().defaultNow(),

    aiRecommendedPriceEur: numeric('ai_recommended_price_eur', { precision: 14, scale: 2 }),
    aiPriceProvider: text('ai_price_provider'),
    aiPriceConfidence: numeric('ai_price_confidence', { precision: 4, scale: 3 }),
    aiPriceCalculatedAt: timestamp('ai_price_calculated_at', { withTimezone: true }),

    status: text('status').notNull().default('DRAFT'),
    listedAt: timestamp('listed_at', { withTimezone: true }),
    withdrawnAt: timestamp('withdrawn_at', { withTimezone: true }),
    soldAt: timestamp('sold_at', { withTimezone: true }),

    showcaseToken: text('showcase_token').unique(),
    showcasePublishedAt: timestamp('showcase_published_at', { withTimezone: true }),
    showcaseExpiresAt: timestamp('showcase_expires_at', { withTimezone: true }),

    description: text('description'),
    features: jsonb('features'),

    sellerId: uuid('seller_id'),
    listingAgentId: uuid('listing_agent_id').notNull().references(() => users.id, { onDelete: 'restrict' }),

    version: bigint('version', { mode: 'number' }).notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    tenantStatusIdx: index('idx_properties_tenant_status').on(t.tenantId, t.status, t.propertyScore),
    geoIdx: index('idx_properties_geo').on(t.tenantId, t.city, t.district),
    priceEurIdx: index('idx_properties_price_eur').on(t.tenantId, t.pricePerSqmEur).where(sql`price_currency = 'EUR'`),
    listedAtIdx: index('idx_properties_listed_at').on(t.listedAt).where(sql`listed_at IS NOT NULL`),
    listingAgentIdx: index('idx_properties_listing_agent').on(t.tenantId, t.listingAgentId),
  })
);

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
