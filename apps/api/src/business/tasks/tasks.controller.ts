import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ZodBody, ZodValidationPipe } from '@/common/zod-pipe';
import { requireTenant, type RequestWithUser } from '@/common/tenant-context';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Roles } from '@/rbac/roles.decorator';
import { Role } from '@/rbac/role.enum';
import { AuditEvent } from '@/audit/audit-event.decorator';
import {
  createTaskSchema,
  listTasksQuerySchema,
  updateTaskSchema,
  type CreateTaskInput,
  type ListTasksQuery,
  type UpdateTaskInput,
} from './tasks.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly svc: TasksService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.TEAM_LEAD)
  @AuditEvent({ eventType: 'TASK_CREATED', entityType: 'task' })
  async create(@Body(ZodBody(createTaskSchema)) body: CreateTaskInput, @Req() req: FastifyRequest) {
    const { tenantId } = requireTenant(req as unknown as RequestWithUser);
    const task = await this.svc.create(tenantId, body);
    (req as unknown as { auditEntityId?: string }).auditEntityId = task.id;
    return task;
  }

  @Get()
  @Roles(Role.AGENT)
  async list(@Query(new ZodValidationPipe(listTasksQuerySchema)) q: ListTasksQuery, @Req() req: FastifyRequest) {
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
  @AuditEvent({ eventType: 'TASK_UPDATED', entityType: 'task' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ZodBody(updateTaskSchema)) body: UpdateTaskInput,
    @Req() req: FastifyRequest,
  ) {
    const { tenantId } = requireTenant(req as unknown as RequestWithUser);
    const task = await this.svc.update(tenantId, id, body);
    (req as unknown as { auditEntityId?: string }).auditEntityId = task.id;
    return task;
  }
}
