import { z } from 'zod';

const STATUS = ['SCHEDULED', 'REMINDED', 'ATTENDED', 'NO_SHOW', 'CANCELLED'] as const;
const CANCEL_REASON = ['no_show', 'reschedule', 'lead_cancelled', 'agent_cancelled', 'seller_unavailable', 'other'] as const;

export const createShowingSchema = z.object({
  dealId: z.string().uuid(),
  propertyId: z.string().uuid(),
  leadId: z.string().uuid(),
  agentId: z.string().uuid(),
  scheduledAt: z.coerce.date(),
  durationMinutes: z.number().int().min(1).max(480).optional(),
});
export type CreateShowingInput = z.infer<typeof createShowingSchema>;

export const updateShowingSchema = z.object({
  status: z.enum(STATUS).optional(),
  attended: z.boolean().nullable().optional(),
  cancellationReason: z.enum(CANCEL_REASON).nullable().optional(),
  feedbackScore: z.number().int().min(1).max(5).nullable().optional(),
  feedbackNotes: z.string().max(2048).nullable().optional(),
  expectedVersion: z.number().int().positive(),
});
export type UpdateShowingInput = z.infer<typeof updateShowingSchema>;

export const listShowingsQuerySchema = z.object({
  agentId: z.string().uuid().optional(),
  leadId: z.string().uuid().optional(),
  propertyId: z.string().uuid().optional(),
  status: z.enum(STATUS).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export type ListShowingsQuery = z.infer<typeof listShowingsQuerySchema>;
