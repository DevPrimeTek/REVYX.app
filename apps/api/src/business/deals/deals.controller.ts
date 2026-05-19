import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ZodBody, ZodValidationPipe } from '@/common/zod-pipe';
import { requireTenant, type RequestWithUser } from '@/common/tenant-context';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Roles } from '@/rbac/roles.decorator';
import { Role } from '@/rbac/role.enum';
import { AuditEvent } from '@/audit/audit-event.decorator';
import {
  createDealSchema,
  listDealsQuerySchema,
  updateDealSchema,
  type CreateDealInput,
  type ListDealsQuery,
  type UpdateDealInput,
} from './deals.dto';
import { DealsService } from './deals.service';

@Controller('deals')
@UseGuards(JwtAuthGuard)
export class DealsController {
  constructor(private readonly svc: DealsService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.AGENT)
  @AuditEvent({ eventType: 'DEAL_CREATED', entityType: 'deal' })
  async create(@Body(ZodBody(createDealSchema)) body: CreateDealInput, @Req() req: FastifyRequest) {
    const { tenantId } = requireTenant(req as unknown as RequestWithUser);
    const deal = await this.svc.create(tenantId, body);
    (req as unknown as { auditEntityId?: string }).auditEntityId = deal.id;
    return deal;
  }

  @Get()
  @Roles(Role.AGENT)
  async list(@Query(new ZodValidationPipe(listDealsQuerySchema)) q: ListDealsQuery, @Req() req: FastifyRequest) {
    const { tenantId } = requireTenant(req as unknown as RequestWithUser);
    return this.svc.list(tenantId, q);
  }

  @Get(':id')
  @Roles(Role.AGENT)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: FastifyRequest) {
    const { tenantId } = requireTenant(req as unknown as RequestWithUser);
    return this.svc.findOne(tenantId, id);
  }

  @Patch(':id')
  @Roles(Role.AGENT)
  @AuditEvent({ eventType: 'DEAL_UPDATED', entityType: 'deal' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ZodBody(updateDealSchema)) body: UpdateDealInput,
    @Req() req: FastifyRequest,
  ) {
    const { tenantId } = requireTenant(req as unknown as RequestWithUser);
    const deal = await this.svc.update(tenantId, id, body);
    (req as unknown as { auditEntityId?: string }).auditEntityId = deal.id;
    return deal;
  }
}
