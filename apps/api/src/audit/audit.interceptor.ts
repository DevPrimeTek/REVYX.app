import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AuditService } from './audit.service';
import { AUDIT_EVENT_KEY, type AuditEventOptions } from './audit-event.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly audit: AuditService,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const decoratorOpts = this.reflector.getAllAndOverride<AuditEventOptions | undefined>(
      AUDIT_EVENT_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    const req = ctx.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        // Resolve the event from (a) decorator on the handler, or (b) ad-hoc value
        // attached at runtime via req.auditEvent (used by Guards that need to log
        // before throwing — e.g. RolesGuard, WebhookHmacGuard).
        const eventType: string | undefined = req.auditEvent ?? decoratorOpts?.eventType;
        if (!eventType) return;
        void this.audit.write({
          tenantId: req.user?.tenantId ?? null,
          actorId: req.user?.id ?? null,
          actorType: req.user ? 'USER' : 'WEBHOOK',
          eventType,
          entityType: req.auditEntityType ?? decoratorOpts?.entityType ?? null,
          entityId: req.auditEntityId ?? null,
          correlationId: req.correlationId ?? null,
          requestId: req.id ?? null,
          ipAddress: req.ip ?? null,
          userAgent: req.headers?.['user-agent'] ?? null,
          metadata: req.auditMetadata ?? {},
          severity: decoratorOpts?.severity ?? 'INFO',
        });
      }),
      catchError((err) => {
        // Failures: still emit audit when set by a guard pre-throw
        const eventType: string | undefined = req.auditEvent;
        if (eventType) {
          void this.audit.write({
            tenantId: req.user?.tenantId ?? null,
            actorId: req.user?.id ?? null,
            actorType: req.user ? 'USER' : 'WEBHOOK',
            eventType,
            entityType: req.auditEntityType ?? null,
            entityId: req.auditEntityId ?? null,
            correlationId: req.correlationId ?? null,
            requestId: req.id ?? null,
            ipAddress: req.ip ?? null,
            userAgent: req.headers?.['user-agent'] ?? null,
            metadata: { ...(req.auditMetadata ?? {}), error: (err as Error).message },
            severity: 'WARN',
          });
        }
        return throwError(() => err);
      }),
    );
  }
}
