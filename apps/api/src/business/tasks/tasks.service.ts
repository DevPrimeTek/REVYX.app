import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import { DB_TOKEN } from '@/db/db.module';
import type { DrizzleDB } from '@/db/client';
import { tasks, type NewTask, type Task } from '@/db/schema/tasks';
import type { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from './tasks.dto';

@Injectable()
export class TasksService {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDB) {}

  async create(tenantId: string, input: CreateTaskInput): Promise<Task> {
    const insert: NewTask = {
      tenantId,
      agentId: input.agentId,
      sourceEntityType: input.sourceEntityType,
      sourceEntityId: input.sourceEntityId,
      taskType: input.taskType,
      taskLabel: input.taskLabel ?? null,
      nbaScore: String(input.nbaScore),
      nbaComponents: input.nbaComponents ?? null,
      status: input.status,
      activatedAt: input.status === 'ACTIVE' ? new Date() : null,
      dueAt: input.dueAt ?? null,
    };
    try {
      const [row] = await this.db.insert(tasks).values(insert).returning();
      return row;
    } catch (err) {
      // BR-04: max 3 active per agent (trigger throws SQLSTATE 23514 + custom message)
      if ((err as { message?: string }).message?.includes('BR_04_MAX_3_ACTIVE_TASKS')) {
        throw new ConflictException({ code: 'BR_04_MAX_3_ACTIVE_TASKS' });
      }
      throw err;
    }
  }

  async findOne(tenantId: string, id: string): Promise<Task> {
    const rows = await this.db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.tenantId, tenantId)))
      .limit(1);
    if (!rows[0]) throw new NotFoundException({ code: 'TASK_NOT_FOUND' });
    return rows[0];
  }

  async list(tenantId: string, q: ListTasksQuery): Promise<{ items: Task[]; total: number }> {
    const filters = [eq(tasks.tenantId, tenantId)];
    if (q.agentId) filters.push(eq(tasks.agentId, q.agentId));
    if (q.status) filters.push(eq(tasks.status, q.status));

    const where = and(...filters);
    const [items, totalRow] = await Promise.all([
      this.db.select().from(tasks).where(where).orderBy(desc(tasks.nbaScore)).limit(q.limit).offset(q.offset),
      this.db.select({ count: sql<number>`count(*)::int` }).from(tasks).where(where),
    ]);
    return { items, total: totalRow[0]?.count ?? 0 };
  }

  async update(tenantId: string, id: string, input: UpdateTaskInput): Promise<Task> {
    const { expectedVersion, ...patch } = input;
    const updateValues: Partial<NewTask> & { version: number; updatedAt: Date } = {
      version: expectedVersion + 1,
      updatedAt: new Date(),
    };
    if (patch.status !== undefined) {
      updateValues.status = patch.status;
      if (patch.status === 'ACTIVE') updateValues.activatedAt = new Date();
      if (patch.status === 'COMPLETED') updateValues.completedAt = new Date();
    }
    if (patch.taskLabel !== undefined) updateValues.taskLabel = patch.taskLabel;
    if (patch.nbaScore !== undefined) updateValues.nbaScore = String(patch.nbaScore);
    if (patch.snoozedUntil !== undefined) updateValues.snoozedUntil = patch.snoozedUntil;
    if (patch.cancellationReason !== undefined) updateValues.cancellationReason = patch.cancellationReason;

    try {
      const rows = await this.db
        .update(tasks)
        .set(updateValues)
        .where(and(eq(tasks.id, id), eq(tasks.tenantId, tenantId), eq(tasks.version, expectedVersion)))
        .returning();

      if (!rows[0]) {
        const existing = await this.db
          .select({ version: tasks.version })
          .from(tasks)
          .where(and(eq(tasks.id, id), eq(tasks.tenantId, tenantId)))
          .limit(1);
        if (!existing[0]) throw new NotFoundException({ code: 'TASK_NOT_FOUND' });
        throw new ConflictException({
          code: 'TASK_VERSION_CONFLICT',
          expectedVersion,
          actualVersion: existing[0].version,
        });
      }
      return rows[0];
    } catch (err) {
      if ((err as { message?: string }).message?.includes('BR_04_MAX_3_ACTIVE_TASKS')) {
        throw new ConflictException({ code: 'BR_04_MAX_3_ACTIVE_TASKS' });
      }
      throw err;
    }
  }
}
