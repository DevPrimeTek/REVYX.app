import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Observable } from 'rxjs';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = ctx.switchToHttp().getRequest();
    const reply = ctx.switchToHttp().getResponse();
    const cid = (req.headers['x-correlation-id'] as string | undefined) ?? randomUUID();
    req.correlationId = cid;
    reply.header?.('x-correlation-id', cid);
    return next.handle();
  }
}
