import { Body, Controller, Get, HttpCode, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ZodBody, ZodValidationPipe } from '@/common/zod-pipe';
import { requireTenant, type RequestWithUser } from '@/common/tenant-context';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Roles } from '@/rbac/roles.decorator';
import { Role } from '@/rbac/role.enum';
import { AuditEvent } from '@/audit/audit-event.decorator';
import {
  createActivitySchema,
  listActivitiesQuerySchema,
  type CreateActivityInput,
  type ListActivitiesQuery,
} from './activities.dto';
import { ActivitiesService } from './activities.service';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly svc: ActivitiesService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.AGENT)
  @AuditEvent({ eventType: 'ACTIVITY_LOGGED', entityType: 'activity' })
  async log(@Body(ZodBody(createActivitySchema)) body: CreateActivityInput, @Req() req: FastifyRequest) {
    const u = requireTenant(req as unknown as RequestWithUser);
    const act = await this.svc.log(u.tenantId, u.id, body);
    (req as unknown as { auditEntityId?: string }).auditEntityId = act.id;
    return act;
  }

  @Get()
  @Roles(Role.AGENT)
  async list(@Query(new ZodValidationPipe(listActivitiesQuerySchema)) q: ListActivitiesQuery, @Req() req: FastifyRequest) {
    const { tenantId } = requireTenant(req as unknown as RequestWithUser);
    return this.svc.list(tenantId, q);
  }
}
