import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ZodBody, ZodValidationPipe } from '@/common/zod-pipe';
import { requireTenant, type RequestWithUser } from '@/common/tenant-context';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Roles } from '@/rbac/roles.decorator';
import { Role } from '@/rbac/role.enum';
import { AuditEvent } from '@/audit/audit-event.decorator';
import {
  createOfferSchema,
  listOffersQuerySchema,
  respondOfferSchema,
  type CreateOfferInput,
  type ListOffersQuery,
  type RespondOfferInput,
} from './offers.dto';
import { OffersService } from './offers.service';

@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(private readonly svc: OffersService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.AGENT)
  @AuditEvent({ eventType: 'OFFER_CREATED', entityType: 'offer' })
  async create(@Body(ZodBody(createOfferSchema)) body: CreateOfferInput, @Req() req: FastifyRequest) {
    const u = requireTenant(req as unknown as RequestWithUser);
    const offer = await this.svc.create(u.tenantId, u.id, body);
    (req as unknown as { auditEntityId?: string }).auditEntityId = offer.id;
    return offer;
  }

  @Get()
  @Roles(Role.AGENT)
  async list(@Query(new ZodValidationPipe(listOffersQuerySchema)) q: ListOffersQuery, @Req() req: FastifyRequest) {
    const { tenantId } = requireTenant(req as unknown as RequestWithUser);
    return this.svc.listForDeal(tenantId, q);
  }

  @Patch(':id/respond')
  @Roles(Role.AGENT)
  @AuditEvent({ eventType: 'OFFER_RESPONDED', entityType: 'offer' })
  async respond(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ZodBody(respondOfferSchema)) body: RespondOfferInput,
    @Req() req: FastifyRequest,
  ) {
    const { tenantId } = requireTenant(req as unknown as RequestWithUser);
    const offer = await this.svc.respond(tenantId, id, body);
    (req as unknown as { auditEntityId?: string }).auditEntityId = offer.id;
    return offer;
  }
}
