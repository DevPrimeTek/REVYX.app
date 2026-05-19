import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import { DB_TOKEN } from '@/db/db.module';
import type { DrizzleDB } from '@/db/client';
import { deals, type Deal, type NewDeal } from '@/db/schema/deals';
import type { CreateDealInput, ListDealsQuery, UpdateDealInput } from './deals.dto';

@Injectable()
export class DealsService {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDB) {}

  async create(tenantId: string, input: CreateDealInput): Promise<Deal> {
    const insert: NewDeal = {
      tenantId,
      leadId: input.leadId,
      propertyId: input.propertyId,
      agentId: input.agentId,
      status: input.status,
      urgencyLabel: input.urgencyLabel ?? null,
      expectedCloseDate: input.expectedCloseDate
        ? input.expectedCloseDate.toISOString().slice(0, 10)
        : null,
    };
    const [row] = await this.db.insert(deals).values(insert).returning();
    return row;
  }

  async findOne(tenantId: string, id: string): Promise<Deal> {
    const rows = await this.db
      .select()
      .from(deals)
      .where(and(eq(deals.id, id), eq(deals.tenantId, tenantId)))
      .limit(1);
    if (!rows[0]) throw new NotFoundException({ code: 'DEAL_NOT_FOUND' });
    return rows[0];
  }

  async list(tenantId: string, q: ListDealsQuery): Promise<{ items: Deal[]; total: number }> {
    const filters = [eq(deals.tenantId, tenantId)];
    if (q.status) filters.push(eq(deals.status, q.status));
    if (q.agentId) filters.push(eq(deals.agentId, q.agentId));
    if (q.needsReview !== undefined) filters.push(eq(deals.needsReview, q.needsReview));

    const where = and(...filters);
    const [items, totalRow] = await Promise.all([
      this.db.select().from(deals).where(where).orderBy(desc(deals.createdAt)).limit(q.limit).offset(q.offset),
      this.db.select({ count: sql<number>`count(*)::int` }).from(deals).where(where),
    ]);
    return { items, total: totalRow[0]?.count ?? 0 };
  }

  async update(tenantId: string, id: string, input: UpdateDealInput): Promise<Deal> {
    const { expectedVersion, ...patch } = input;
    const updateValues: Partial<NewDeal> & { version: number; updatedAt: Date } = {
      version: expectedVersion + 1,
      updatedAt: new Date(),
    };
    if (patch.status !== undefined) updateValues.status = patch.status;
    if (patch.urgencyLabel !== undefined) updateValues.urgencyLabel = patch.urgencyLabel;
    if (patch.expectedCloseDate !== undefined) {
      updateValues.expectedCloseDate = patch.expectedCloseDate
        ? patch.expectedCloseDate.toISOString().slice(0, 10)
        : null;
    }
    if (patch.needsReview !== undefined) updateValues.needsReview = patch.needsReview;

    const rows = await this.db
      .update(deals)
      .set(updateValues)
      .where(and(eq(deals.id, id), eq(deals.tenantId, tenantId), eq(deals.version, expectedVersion)))
      .returning();

    if (!rows[0]) {
      const existing = await this.db
        .select({ version: deals.version })
        .from(deals)
        .where(and(eq(deals.id, id), eq(deals.tenantId, tenantId)))
        .limit(1);
      if (!existing[0]) throw new NotFoundException({ code: 'DEAL_NOT_FOUND' });
      throw new ConflictException({
        code: 'DEAL_VERSION_CONFLICT',
        expectedVersion,
        actualVersion: existing[0].version,
      });
    }
    return rows[0];
  }
}
