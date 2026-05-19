import { z } from 'zod';

const SOURCE_ENTITY = ['lead', 'deal', 'property', 'showing', 'offer'] as const;
const TASK_TYPE = [
  'first_contact', 'follow_up', 'schedule_showing', 'send_property',
  'request_documents', 'draft_offer', 'close_deal', 'review_no_show', 'custom',
] as const;
const STATUS = ['PENDING', 'ACTIVE', 'COMPLETED', 'SNOOZED', 'CANCELLED', 'REASSIGNED'] as const;

export const createTaskSchema = z.object({
  agentId: z.string().uuid(),
  sourceEntityType: z.enum(SOURCE_ENTITY),
  sourceEntityId: z.string().uuid(),
  taskType: z.enum(TASK_TYPE),
  taskLabel: z.string().max(256).optional(),
  nbaScore: z.number().min(0).max(2.0).default(0),
  nbaComponents: z.record(z.unknown()).optional(),
  status: z.enum(STATUS).default('PENDING'),
  dueAt: z.coerce.date().optional(),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  status: z.enum(STATUS).optional(),
  taskLabel: z.string().max(256).nullable().optional(),
  nbaScore: z.number().min(0).max(2.0).optional(),
  snoozedUntil: z.coerce.date().nullable().optional(),
  cancellationReason: z.string().max(256).nullable().optional(),
  expectedVersion: z.number().int().positive(),
});
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const listTasksQuerySchema = z.object({
  agentId: z.string().uuid().optional(),
  status: z.enum(STATUS).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
