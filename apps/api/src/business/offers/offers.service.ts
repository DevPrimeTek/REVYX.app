import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import { DB_TOKEN } from '@/db/db.module';
import type { DrizzleDB } from '@/db/client';
import { offers, type NewOffer, type Offer } from '@/db/schema/offers';
import type { CreateOfferInput, ListOffersQuery, RespondOfferInput } from './offers.dto';

@Injectable()
export class OffersService {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDB) {}

  async create(tenantId: string, performerId: string, input: CreateOfferInput): Promise<Offer> {
    const insert: NewOffer = {
      tenantId,
      dealId: input.dealId,
      offeredBy: input.offeredBy,
      offeredByUserId: performerId,
      amount: String(input.amount),
      currency: input.currency,
      amountEurSnapshot: String(input.amountEurSnapshot),
      fxRateToEur: String(input.fxRateToEur),
      fxRateSource: input.fxRateSource,
      validUntil: input.validUntil ?? null,
      counterToOfferId: input.counterToOfferId ?? null,
      chainRound: input.chainRound,
      notes: input.notes ?? null,
    };
    try {
      const [row] = await this.db.insert(offers).values(insert).returning();
      return row;
    } catch (err) {
      if ((err as { message?: string }).message?.includes('OFFER_INVALID_COUNTER_PARENT')) {
        throw new ConflictException({ code: 'OFFER_INVALID_COUNTER_PARENT' });
      }
      throw err;
    }
  }

  async listForDeal(tenantId: string, q: ListOffersQuery): Promise<Offer[]> {
    return this.db
      .select()
      .from(offers)
      .where(and(eq(offers.tenantId, tenantId), eq(offers.dealId, q.dealId)))
      .orderBy(asc(offers.chainRound), asc(offers.createdAt))
      .limit(q.limit)
      .offset(q.offset);
  }

  async respond(tenantId: string, id: string, input: RespondOfferInput): Promise<Offer> {
    const { expectedVersion, ...patch } = input;
    const rows = await this.db
      .update(offers)
      .set({
        status: patch.status,
        respondedAt: new Date(),
        respondedFxRateToEur: patch.respondedFxRateToEur !== undefined ? String(patch.respondedFxRateToEur) : null,
        withdrawReason: patch.withdrawReason ?? null,
        version: expectedVersion + 1,
      })
      .where(and(eq(offers.id, id), eq(offers.tenantId, tenantId), eq(offers.version, expectedVersion)))
      .returning();

    if (!rows[0]) {
      const existing = await this.db
        .select({ version: offers.version })
        .from(offers)
        .where(and(eq(offers.id, id), eq(offers.tenantId, tenantId)))
        .limit(1);
      if (!existing[0]) throw new NotFoundException({ code: 'OFFER_NOT_FOUND' });
      throw new ConflictException({
        code: 'OFFER_VERSION_CONFLICT',
        expectedVersion,
        actualVersion: existing[0].version,
      });
    }
    return rows[0];
  }
}
