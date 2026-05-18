import { Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { AuditEvent } from '@/audit/audit-event.decorator';
import { GdprService } from './gdpr.service';

interface AuthedRequest extends FastifyRequest {
  user: { id: string; tenantId: string; role: string; jti: string };
}

@Controller('gdpr')
@UseGuards(JwtAuthGuard)
export class GdprController {
  constructor(private readonly gdpr: GdprService) {}

  @Get('access')
  @AuditEvent({ eventType: 'GDPR_ACCESS_REQUEST' })
  access(@Req() req: AuthedRequest) {
    return this.gdpr.access(req.user.id);
  }

  @Get('portability')
  @AuditEvent({ eventType: 'GDPR_PORTABILITY_REQUEST' })
  portability(@Req() req: AuthedRequest) {
    return this.gdpr.portability(req.user.id);
  }

  @Post('erase')
  @HttpCode(202)
  @AuditEvent({ eventType: 'GDPR_ERASURE_REQUESTED', severity: 'HIGH' })
  erase(@Req() req: AuthedRequest) {
    return this.gdpr.requestErasure(req.user.id);
  }

  @Post('restrict')
  @HttpCode(200)
  @AuditEvent({ eventType: 'GDPR_RESTRICTION_APPLIED' })
  restrict(@Req() req: AuthedRequest) {
    return this.gdpr.restrict(req.user.id);
  }
}
