import { z } from 'zod';

const STATUS = ['NEW', 'QUALIFIED', 'SHOWING', 'NEGOTIATION', 'WON_PENDING_NOTARY', 'WON', 'LOST', 'CANCELLED'] as const;
const URGENCY = ['normal', 'approaching', 'declared', 'critical'] as const;

export const createDealSchema = z.object({
  leadId: z.string().uuid(),
  propertyId: z.string().uuid(),
  agentId: z.string().uuid(),
  status: z.enum(STATUS).default('NEW'),
  urgencyLabel: z.enum(URGENCY).optional(),
  expectedCloseDate: z.coerce.date().optional(),
});
export type CreateDealInput = z.infer<typeof createDealSchema>;

export const updateDealSchema = z.object({
  status: z.enum(STATUS).optional(),
  urgencyLabel: z.enum(URGENCY).nullable().optional(),
  expectedCloseDate: z.coerce.date().nullable().optional(),
  needsReview: z.boolean().optional(),
  expectedVersion: z.number().int().positive(),
});
export type UpdateDealInput = z.infer<typeof updateDealSchema>;

export const listDealsQuerySchema = z.object({
  status: z.enum(STATUS).optional(),
  agentId: z.string().uuid().optional(),
  needsReview: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export type ListDealsQuery = z.infer<typeof listDealsQuerySchema>;
