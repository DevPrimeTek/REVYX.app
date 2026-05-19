import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import { DB_TOKEN } from '@/db/db.module';
import type { DrizzleDB } from '@/db/client';
import { properties, type NewProperty, type Property } from '@/db/schema/properties';
import type { CreatePropertyInput, ListPropertiesQuery, UpdatePropertyInput } from './properties.dto';

@Injectable()
export class PropertiesService {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDB) {}

  async create(tenantId: string, input: CreatePropertyInput): Promise<Property> {
    const insert: NewProperty = {
      tenantId,
      externalRef: input.externalRef ?? null,
      propertyType: input.propertyType,
      transactionType: input.transactionType,
      country: input.country,
      city: input.city,
      district: input.district ?? null,
      addressLine: input.addressLine ?? null,
      geoLat: input.geoLat !== undefined ? String(input.geoLat) : null,
      geoLng: input.geoLng !== undefined ? String(input.geoLng) : null,
      areaSqm: String(input.areaSqm),
      rooms: input.rooms ?? null,
      bathrooms: input.bathrooms ?? null,
      floor: input.floor ?? null,
      totalFloors: input.totalFloors ?? null,
      yearBuilt: input.yearBuilt ?? null,
      conditionGrade: input.conditionGrade ?? null,
      hasParking: input.hasParking,
      hasBalcony: input.hasBalcony,
      energyClass: input.energyClass ?? null,
      priceAmount: String(input.priceAmount),
      priceCurrency: input.priceCurrency,
      description: input.description ?? null,
      features: input.features ?? null,
      listingAgentId: input.listingAgentId,
    };
    const [row] = await this.db.insert(properties).values(insert).returning();
    return row;
  }

  async findOne(tenantId: string, id: string): Promise<Property> {
    const rows = await this.db
      .select()
      .from(properties)
      .where(and(eq(properties.id, id), eq(properties.tenantId, tenantId)))
      .limit(1);
    if (!rows[0]) throw new NotFoundException({ code: 'PROPERTY_NOT_FOUND' });
    return rows[0];
  }

  async list(tenantId: string, q: ListPropertiesQuery): Promise<{ items: Property[]; total: number }> {
    const filters = [eq(properties.tenantId, tenantId)];
    if (q.status) filters.push(eq(properties.status, q.status));
    if (q.city) filters.push(eq(properties.city, q.city));
    if (q.propertyType) filters.push(eq(properties.propertyType, q.propertyType));
    if (q.listingAgentId) filters.push(eq(properties.listingAgentId, q.listingAgentId));

    const where = and(...filters);
    const [items, totalRow] = await Promise.all([
      this.db.select().from(properties).where(where).orderBy(desc(properties.createdAt)).limit(q.limit).offset(q.offset),
      this.db.select({ count: sql<number>`count(*)::int` }).from(properties).where(where),
    ]);
    return { items, total: totalRow[0]?.count ?? 0 };
  }

  async update(tenantId: string, id: string, input: UpdatePropertyInput): Promise<Property> {
    const { expectedVersion, ...patch } = input;
    const updateValues: Partial<NewProperty> & { version: number; updatedAt: Date } = {
      version: expectedVersion + 1,
      updatedAt: new Date(),
    };
    if (patch.city !== undefined) updateValues.city = patch.city;
    if (patch.district !== undefined) updateValues.district = patch.district;
    if (patch.addressLine !== undefined) updateValues.addressLine = patch.addressLine;
    if (patch.priceAmount !== undefined) updateValues.priceAmount = String(patch.priceAmount);
    if (patch.priceCurrency !== undefined) updateValues.priceCurrency = patch.priceCurrency;
    if (patch.conditionGrade !== undefined) updateValues.conditionGrade = patch.conditionGrade;
    if (patch.status !== undefined) updateValues.status = patch.status;
    if (patch.description !== undefined) updateValues.description = patch.description;
    if (patch.features !== undefined) updateValues.features = patch.features;

    const rows = await this.db
      .update(properties)
      .set(updateValues)
      .where(and(eq(properties.id, id), eq(properties.tenantId, tenantId), eq(properties.version, expectedVersion)))
      .returning();

    if (!rows[0]) {
      const existing = await this.db
        .select({ version: properties.version })
        .from(properties)
        .where(and(eq(properties.id, id), eq(properties.tenantId, tenantId)))
        .limit(1);
      if (!existing[0]) throw new NotFoundException({ code: 'PROPERTY_NOT_FOUND' });
      throw new ConflictException({
        code: 'PROPERTY_VERSION_CONFLICT',
        expectedVersion,
        actualVersion: existing[0].version,
      });
    }
    return rows[0];
  }
}
