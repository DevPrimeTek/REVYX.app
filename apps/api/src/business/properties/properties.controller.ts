import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ZodBody, ZodValidationPipe } from '@/common/zod-pipe';
import { requireTenant, type RequestWithUser } from '@/common/tenant-context';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Roles } from '@/rbac/roles.decorator';
import { Role } from '@/rbac/role.enum';
import { AuditEvent } from '@/audit/audit-event.decorator';
import {
  createPropertySchema,
  listPropertiesQuerySchema,
  updatePropertySchema,
  type CreatePropertyInput,
  type ListPropertiesQuery,
  type UpdatePropertyInput,
} from './properties.dto';
import { PropertiesService } from './properties.service';

@Controller('properties')
@UseGuards(JwtAuthGuard)
export class PropertiesController {
  constructor(private readonly svc: PropertiesService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.AGENT)
  @AuditEvent({ eventType: 'PROPERTY_CREATED', entityType: 'property' })
  async create(@Body(ZodBody(createPropertySchema)) body: CreatePropertyInput, @Req() req: FastifyRequest) {
    const { tenantId } = requireTenant(req as unknown as RequestWithUser);
    const prop = await this.svc.create(tenantId, body);
    (req as unknown as { auditEntityId?: string }).auditEntityId = prop.id;
    return prop;
  }

  @Get()
  @Roles(Role.AGENT)
  async list(@Query(new ZodValidationPipe(listPropertiesQuerySchema)) q: ListPropertiesQuery, @Req() req: FastifyRequest) {
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
  @AuditEvent({ eventType: 'PROPERTY_UPDATED', entityType: 'property' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ZodBody(updatePropertySchema)) body: UpdatePropertyInput,
    @Req() req: FastifyRequest,
  ) {
    const { tenantId } = requireTenant(req as unknown as RequestWithUser);
    const prop = await this.svc.update(tenantId, id, body);
    (req as unknown as { auditEntityId?: string }).auditEntityId = prop.id;
    return prop;
  }
}
