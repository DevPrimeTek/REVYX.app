import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ZodBody, ZodValidationPipe } from '@/common/zod-pipe';
import { requireTenant, type RequestWithUser } from '@/common/tenant-context';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Roles } from '@/rbac/roles.decorator';
import { Role } from '@/rbac/role.enum';
import { AuditEvent } from '@/audit/audit-event.decorator';
import {
  createShowingSchema,
  listShowingsQuerySchema,
  updateShowingSchema,
  type CreateShowingInput,
  type ListShowingsQuery,
  type UpdateShowingInput,
} from './showings.dto';
import { ShowingsService } from './showings.service';

@Controller('showings')
@UseGuards(JwtAuthGuard)
export class ShowingsController {
  constructor(private readonly svc: ShowingsService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.AGENT)
  @AuditEvent({ eventType: 'SHOWING_SCHEDULED', entityType: 'showing' })
  async create(@Body(ZodBody(createShowingSchema)) body: CreateShowingInput, @Req() req: FastifyRequest) {
    const u = requireTenant(req as unknown as RequestWithUser);
    const showing = await this.svc.create(u.tenantId, u.id, body);
    (req as unknown as { auditEntityId?: string }).auditEntityId = showing.id;
    return showing;
  }

  @Get()
  @Roles(Role.AGENT)
  async list(@Query(new ZodValidationPipe(listShowingsQuerySchema)) q: ListShowingsQuery, @Req() req: FastifyRequest) {
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
  @AuditEvent({ eventType: 'SHOWING_UPDATED', entityType: 'showing' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ZodBody(updateShowingSchema)) body: UpdateShowingInput,
    @Req() req: FastifyRequest,
  ) {
    const u = requireTenant(req as unknown as RequestWithUser);
    const showing = await this.svc.update(u.tenantId, id, u.id, body);
    (req as unknown as { auditEntityId?: string }).auditEntityId = showing.id;
    return showing;
  }
}
