import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq, sql } from 'drizzle-orm';
import { DB_TOKEN } from '@/db/db.module';
import type { DrizzleDB } from '@/db/client';
import { showings, type NewShowing, type Showing } from '@/db/schema/showings';
import type { CreateShowingInput, ListShowingsQuery, UpdateShowingInput } from './showings.dto';

@Injectable()
export class ShowingsService {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDB) {}

  async create(tenantId: string, performerId: string, input: CreateShowingInput): Promise<Showing> {
    const insert: NewShowing = {
      tenantId,
      dealId: input.dealId,
      propertyId: input.propertyId,
      leadId: input.leadId,
      agentId: input.agentId,
      scheduledAt: input.scheduledAt,
      durationMinutes: input.durationMinutes ?? null,
      createdByUserId: performerId,
    };
    try {
      const [row] = await this.db.insert(showings).values(insert).returning();
      return row;
    } catch (err) {
      const msg = (err as { message?: string }).message ?? '';
      if (msg.includes('showings_agent_no_overlap')) {
        throw new ConflictException({ code: 'SHOWING_AGENT_CALENDAR_CONFLICT' });
      }
      throw err;
    }
  }

  async findOne(tenantId: string, id: string): Promise<Showing> {
    const rows = await this.db
      .select()
      .from(showings)
      .where(and(eq(showings.id, id), eq(showings.tenantId, tenantId)))
      .limit(1);
    if (!rows[0]) throw new NotFoundException({ code: 'SHOWING_NOT_FOUND' });
    return rows[0];
  }

  async list(tenantId: string, q: ListShowingsQuery): Promise<{ items: Showing[]; total: number }> {
    const filters = [eq(showings.tenantId, tenantId)];
    if (q.agentId) filters.push(eq(showings.agentId, q.agentId));
    if (q.leadId) filters.push(eq(showings.leadId, q.leadId));
    if (q.propertyId) filters.push(eq(showings.propertyId, q.propertyId));
    if (q.status) filters.push(eq(showings.status, q.status));

    const where = and(...filters);
    const [items, totalRow] = await Promise.all([
      this.db.select().from(showings).where(where).orderBy(asc(showings.scheduledAt)).limit(q.limit).offset(q.offset),
      this.db.select({ count: sql<number>`count(*)::int` }).from(showings).where(where),
    ]);
    return { items, total: totalRow[0]?.count ?? 0 };
  }

  async update(tenantId: string, id: string, performerId: string, input: UpdateShowingInput): Promise<Showing> {
    const { expectedVersion, ...patch } = input;
    const updateValues: Partial<NewShowing> & { version: number; updatedAt: Date } = {
      version: expectedVersion + 1,
      updatedAt: new Date(),
    };
    if (patch.status !== undefined) {
      updateValues.status = patch.status;
      if (patch.status === 'CANCELLED') updateValues.cancelledAt = new Date();
    }
    if (patch.attended !== undefined) updateValues.attended = patch.attended;
    if (patch.cancellationReason !== undefined) updateValues.cancellationReason = patch.cancellationReason;
    if (patch.feedbackScore !== undefined) {
      updateValues.feedbackScore = patch.feedbackScore;
      updateValues.feedbackAt = patch.feedbackScore !== null ? new Date() : null;
      updateValues.feedbackByUserId = patch.feedbackScore !== null ? performerId : null;
    }
    if (patch.feedbackNotes !== undefined) updateValues.feedbackNotes = patch.feedbackNotes;

    const rows = await this.db
      .update(showings)
      .set(updateValues)
      .where(and(eq(showings.id, id), eq(showings.tenantId, tenantId), eq(showings.version, expectedVersion)))
      .returning();

    if (!rows[0]) {
      const existing = await this.db
        .select({ version: showings.version })
        .from(showings)
        .where(and(eq(showings.id, id), eq(showings.tenantId, tenantId)))
        .limit(1);
      if (!existing[0]) throw new NotFoundException({ code: 'SHOWING_NOT_FOUND' });
      throw new ConflictException({
        code: 'SHOWING_VERSION_CONFLICT',
        expectedVersion,
        actualVersion: existing[0].version,
      });
    }
    return rows[0];
  }
}
