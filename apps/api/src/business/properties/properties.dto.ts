import { z } from 'zod';

const PROPERTY_TYPE = ['apartment', 'house', 'commercial', 'land', 'office'] as const;
const TRANSACTION_TYPE = ['sale', 'rent'] as const;
const CONDITION = ['new', 'renovated', 'good', 'needs_repair', 'demolition'] as const;
const CURRENCY = ['EUR', 'MDL', 'USD'] as const;
const STATUS = ['DRAFT', 'ACTIVE', 'RESERVED', 'SOLD', 'WITHDRAWN', 'EXPIRED'] as const;

export const createPropertySchema = z.object({
  externalRef: z.string().max(128).optional(),
  propertyType: z.enum(PROPERTY_TYPE),
  transactionType: z.enum(TRANSACTION_TYPE),
  country: z.string().length(2).default('MD'),
  city: z.string().min(1).max(128),
  district: z.string().max(128).optional(),
  addressLine: z.string().max(512).optional(),
  geoLat: z.number().gte(-90).lte(90).optional(),
  geoLng: z.number().gte(-180).lte(180).optional(),
  areaSqm: z.number().positive(),
  rooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  floor: z.number().int().optional(),
  totalFloors: z.number().int().positive().optional(),
  yearBuilt: z.number().int().gte(1800).lte(new Date().getFullYear() + 5).optional(),
  conditionGrade: z.enum(CONDITION).optional(),
  hasParking: z.boolean().default(false),
  hasBalcony: z.boolean().default(false),
  energyClass: z.string().max(8).optional(),
  priceAmount: z.number().nonnegative(),
  priceCurrency: z.enum(CURRENCY).default('EUR'),
  description: z.string().max(8192).optional(),
  features: z.record(z.unknown()).optional(),
  listingAgentId: z.string().uuid(),
});
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;

export const updatePropertySchema = z.object({
  city: z.string().min(1).max(128).optional(),
  district: z.string().max(128).nullable().optional(),
  addressLine: z.string().max(512).nullable().optional(),
  priceAmount: z.number().nonnegative().optional(),
  priceCurrency: z.enum(CURRENCY).optional(),
  conditionGrade: z.enum(CONDITION).nullable().optional(),
  status: z.enum(STATUS).optional(),
  description: z.string().max(8192).nullable().optional(),
  features: z.record(z.unknown()).nullable().optional(),
  expectedVersion: z.number().int().positive(),
});
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;

export const listPropertiesQuerySchema = z.object({
  status: z.enum(STATUS).optional(),
  city: z.string().max(128).optional(),
  propertyType: z.enum(PROPERTY_TYPE).optional(),
  listingAgentId: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export type ListPropertiesQuery = z.infer<typeof listPropertiesQuerySchema>;
