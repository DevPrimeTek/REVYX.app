import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { DB_TOKEN } from '@/db/db.module';
import type { DrizzleDB } from '@/db/client';
import { activities, type Activity, type NewActivity } from '@/db/schema/activities';
import type { CreateActivityInput, ListActivitiesQuery } from './activities.dto';

@Injectable()
export class ActivitiesService {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDB) {}

  async log(tenantId: string, performerId: string, input: CreateActivityInput): Promise<Activity> {
    const insert: NewActivity = {
      tenantId,
      entityType: input.entityType,
      entityId: input.entityId,
      activityType: input.activityType,
      performedBy: performerId,
      channel: input.channel ?? null,
      durationSeconds: input.durationSeconds ?? null,
      metadata: input.metadata ?? null,
      occurredAt: input.occurredAt ?? new Date(),
    };
    const [row] = await this.db.insert(activities).values(insert).returning();
    return row;
  }

  async list(tenantId: string, q: ListActivitiesQuery): Promise<Activity[]> {
    return this.db
      .select()
      .from(activities)
      .where(and(
        eq(activities.tenantId, tenantId),
        eq(activities.entityType, q.entityType),
        eq(activities.entityId, q.entityId),
      ))
      .orderBy(desc(activities.occurredAt))
      .limit(q.limit)
      .offset(q.offset);
  }
}
