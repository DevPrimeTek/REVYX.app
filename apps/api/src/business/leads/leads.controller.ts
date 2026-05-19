import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ZodBody, ZodValidationPipe } from '@/common/zod-pipe';
import { requireTenant } from '@/common/tenant-context';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Roles } from '@/rbac/roles.decorator';
import { Role } from '@/rbac/role.enum';
import { AuditEvent } from '@/audit/audit-event.decorator';
import {
  createLeadSchema,
  listLeadsQuerySchema,
  updateLeadSchema,
  type CreateLeadInput,
  type ListLeadsQuery,
  type UpdateLeadInput,
} from './leads.dto';
import { LeadsService } from './leads.service';

@Controller('leads')
@UseGuards(JwtAuthGuard)
export class LeadsController {
  constructor(private readonly svc: LeadsService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.AGENT)
  @AuditEvent({ eventType: 'LEAD_CREATED', entityType: 'lead' })
  async create(@Body(ZodBody(createLeadSchema)) body: CreateLeadInput, @Req() req: FastifyRequest) {
    const { tenantId } = requireTenant(req as unknown as { user?: { id: string; tenantId: string; role: string; jti: string } });
    const lead = await this.svc.create(tenantId, body);
    (req as unknown as { auditEntityId?: string }).auditEntityId = lead.id;
    return lead;
  }

  @Get()
  @Roles(Role.AGENT)
  async list(@Query(new ZodValidationPipe(listLeadsQuerySchema)) q: ListLeadsQuery, @Req() req: FastifyRequest) {
    const { tenantId } = requireTenant(req as unknown as { user?: { id: string; tenantId: string; role: string; jti: string } });
    return this.svc.list(tenantId, q);
  }

  @Get(':id')
  @Roles(Role.AGENT)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: FastifyRequest) {
    const { tenantId } = requireTenant(req as unknown as { user?: { id: string; tenantId: string; role: string; jti: string } });
    return this.svc.findOne(tenantId, id);
  }

  @Patch(':id')
  @Roles(Role.AGENT)
  @AuditEvent({ eventType: 'LEAD_UPDATED', entityType: 'lead' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ZodBody(updateLeadSchema)) body: UpdateLeadInput,
    @Req() req: FastifyRequest,
  ) {
    const { tenantId } = requireTenant(req as unknown as { user?: { id: string; tenantId: string; role: string; jti: string } });
    const lead = await this.svc.update(tenantId, id, body);
    (req as unknown as { auditEntityId?: string }).auditEntityId = lead.id;
    return lead;
  }
}
