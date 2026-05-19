import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import { DB_TOKEN } from '@/db/db.module';
import type { DrizzleDB } from '@/db/client';
import { leads, type Lead, type NewLead } from '@/db/schema/leads';
import type { CreateLeadInput, ListLeadsQuery, UpdateLeadInput } from './leads.dto';

@Injectable()
export class LeadsService {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDB) {}

  async create(tenantId: string, input: CreateLeadInput): Promise<Lead> {
    // BR-02 LS_initial = 0.30, TS_initial = 0.50 are enforced by DB defaults; we don't override.
    const insert: NewLead = {
      tenantId,
      source: input.source,
      sourceExternalId: input.sourceExternalId ?? null,
      fullName: input.fullName ?? null,
      phoneE164: input.phoneE164 ?? null,
      email: input.email ?? null,
      intentDeclared: input.intentDeclared !== undefined ? String(input.intentDeclared) : null,
      budgetMinEur: input.budgetMinEur !== undefined ? String(input.budgetMinEur) : null,
      budgetMaxEur: input.budgetMaxEur !== undefined ? String(input.budgetMaxEur) : null,
      timelineUrgencyLabel: input.timelineUrgencyLabel ?? null,
      preferredPropertyType: input.preferredPropertyType ?? null,
      preferredLocation: input.preferredLocation ?? null,
      gdprConsentAt: input.gdprConsentAt,
      gdprConsentChannel: input.gdprConsentChannel,
      gdprConsentVersion: input.gdprConsentVersion,
      dataRetentionExpiresAt: input.dataRetentionExpiresAt,
    };
    const [row] = await this.db.insert(leads).values(insert).returning();
    return row;
  }

  async findOne(tenantId: string, id: string): Promise<Lead> {
    const rows = await this.db
      .select()
      .from(leads)
      .where(and(eq(leads.id, id), eq(leads.tenantId, tenantId)))
      .limit(1);
    if (!rows[0]) throw new NotFoundException({ code: 'LEAD_NOT_FOUND' });
    return rows[0];
  }

  async list(tenantId: string, q: ListLeadsQuery): Promise<{ items: Lead[]; total: number }> {
    const filters = [eq(leads.tenantId, tenantId)];
    if (q.status) filters.push(eq(leads.status, q.status));
    if (q.assignedAgentId) filters.push(eq(leads.assignedAgentId, q.assignedAgentId));

    const where = and(...filters);
    const [items, totalRow] = await Promise.all([
      this.db.select().from(leads).where(where).orderBy(desc(leads.createdAt)).limit(q.limit).offset(q.offset),
      this.db.select({ count: sql<number>`count(*)::int` }).from(leads).where(where),
    ]);
    return { items, total: totalRow[0]?.count ?? 0 };
  }

  async update(tenantId: string, id: string, input: UpdateLeadInput): Promise<Lead> {
    const { expectedVersion, ...patch } = input;

    const updateValues: Partial<NewLead> & { version: number; updatedAt: Date } = {
      version: expectedVersion + 1,
      updatedAt: new Date(),
    };
    if (patch.fullName !== undefined) updateValues.fullName = patch.fullName;
    if (patch.phoneE164 !== undefined) updateValues.phoneE164 = patch.phoneE164;
    if (patch.email !== undefined) updateValues.email = patch.email;
    if (patch.intentDeclared !== undefined)
      updateValues.intentDeclared = patch.intentDeclared === null ? null : String(patch.intentDeclared);
    if (patch.budgetMinEur !== undefined)
      updateValues.budgetMinEur = patch.budgetMinEur === null ? null : String(patch.budgetMinEur);
    if (patch.budgetMaxEur !== undefined)
      updateValues.budgetMaxEur = patch.budgetMaxEur === null ? null : String(patch.budgetMaxEur);
    if (patch.timelineUrgencyLabel !== undefined) updateValues.timelineUrgencyLabel = patch.timelineUrgencyLabel;
    if (patch.preferredPropertyType !== undefined) updateValues.preferredPropertyType = patch.preferredPropertyType;
    if (patch.preferredLocation !== undefined) updateValues.preferredLocation = patch.preferredLocation;
    if (patch.status !== undefined) updateValues.status = patch.status;
    if (patch.assignedAgentId !== undefined) {
      updateValues.assignedAgentId = patch.assignedAgentId;
      updateValues.assignedAt = patch.assignedAgentId ? new Date() : null;
    }

    const rows = await this.db
      .update(leads)
      .set(updateValues)
      .where(and(eq(leads.id, id), eq(leads.tenantId, tenantId), eq(leads.version, expectedVersion)))
      .returning();

    if (!rows[0]) {
      // Either not found or version mismatch — distinguish for clearer 404 vs 409.
      const existing = await this.db
        .select({ version: leads.version })
        .from(leads)
        .where(and(eq(leads.id, id), eq(leads.tenantId, tenantId)))
        .limit(1);
      if (!existing[0]) throw new NotFoundException({ code: 'LEAD_NOT_FOUND' });
      throw new ConflictException({
        code: 'LEAD_VERSION_CONFLICT',
        expectedVersion,
        actualVersion: existing[0].version,
      });
    }
    return rows[0];
  }
}
