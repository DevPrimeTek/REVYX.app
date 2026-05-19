import { z } from 'zod';

const SOURCE = ['meta', 'google', 'olx', 'referral', 'manual', 'import'] as const;
const TIMELINE = ['immediate', '3m', '6m', '12m', 'exploratory'] as const;
const STATUS = ['NEW', 'QUALIFIED', 'CONTACTED', 'SHOWING', 'NEGOTIATION', 'WON', 'LOST', 'NURTURING'] as const;

export const createLeadSchema = z.object({
  source: z.enum(SOURCE),
  sourceExternalId: z.string().max(256).optional(),
  fullName: z.string().max(256).optional(),
  phoneE164: z.string().regex(/^\+?[1-9]\d{6,14}$/).optional(),
  email: z.string().email().max(320).optional(),
  intentDeclared: z.number().min(0).max(1).optional(),
  budgetMinEur: z.number().nonnegative().optional(),
  budgetMaxEur: z.number().nonnegative().optional(),
  timelineUrgencyLabel: z.enum(TIMELINE).optional(),
  preferredPropertyType: z.string().max(64).optional(),
  preferredLocation: z.string().max(256).optional(),
  // GDPR consent (BR-06)
  gdprConsentAt: z.coerce.date(),
  gdprConsentChannel: z.string().min(1).max(64),
  gdprConsentVersion: z.string().min(1).max(32),
  dataRetentionExpiresAt: z.coerce.date(),
});
export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export const updateLeadSchema = z.object({
  fullName: z.string().max(256).nullable().optional(),
  phoneE164: z.string().regex(/^\+?[1-9]\d{6,14}$/).nullable().optional(),
  email: z.string().email().max(320).nullable().optional(),
  intentDeclared: z.number().min(0).max(1).nullable().optional(),
  budgetMinEur: z.number().nonnegative().nullable().optional(),
  budgetMaxEur: z.number().nonnegative().nullable().optional(),
  timelineUrgencyLabel: z.enum(TIMELINE).nullable().optional(),
  preferredPropertyType: z.string().max(64).nullable().optional(),
  preferredLocation: z.string().max(256).nullable().optional(),
  status: z.enum(STATUS).optional(),
  assignedAgentId: z.string().uuid().nullable().optional(),
  expectedVersion: z.number().int().positive(),
});
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;

export const listLeadsQuerySchema = z.object({
  status: z.enum(STATUS).optional(),
  assignedAgentId: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export type ListLeadsQuery = z.infer<typeof listLeadsQuerySchema>;
