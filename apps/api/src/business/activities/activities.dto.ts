import { z } from 'zod';

const ENTITY_TYPE = ['lead', 'deal', 'property', 'agent'] as const;
const ACTIVITY_TYPE = [
  'call', 'message_sent', 'message_received', 'showing', 'offer_made',
  'note_added', 'score_updated', 'status_changed', 'showcase_viewed', 'document_downloaded',
] as const;
const CHANNEL = ['whatsapp', 'email', 'sms', 'platform', 'phone', 'in_app'] as const;

export const createActivitySchema = z.object({
  entityType: z.enum(ENTITY_TYPE),
  entityId: z.string().uuid(),
  activityType: z.enum(ACTIVITY_TYPE),
  channel: z.enum(CHANNEL).optional(),
  durationSeconds: z.number().int().nonnegative().optional(),
  metadata: z.record(z.unknown()).optional(),
  occurredAt: z.coerce.date().optional(),
});
export type CreateActivityInput = z.infer<typeof createActivitySchema>;

export const listActivitiesQuerySchema = z.object({
  entityType: z.enum(ENTITY_TYPE),
  entityId: z.string().uuid(),
  limit: z.coerce.number().int().min(1).max(500).default(100),
  offset: z.coerce.number().int().min(0).default(0),
});
export type ListActivitiesQuery = z.infer<typeof listActivitiesQuerySchema>;
