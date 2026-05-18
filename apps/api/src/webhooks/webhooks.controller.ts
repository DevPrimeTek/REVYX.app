import { Body, Controller, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { Public } from '@/auth/jwt-auth.guard';
import { AuditEvent } from '@/audit/audit-event.decorator';
import { WebhookHmacGuard } from './webhook-hmac.guard';

@Controller('webhooks')
export class WebhooksController {
  // The intake endpoint validates HMAC + dedupes the signature. Business processing
  // (lead intake → scoring → assignment) is M1.S3 scope and will enqueue from here.
  @Public()
  @Post(':provider')
  @HttpCode(200)
  @UseGuards(WebhookHmacGuard)
  @AuditEvent({ eventType: 'WEBHOOK_RECEIVED' })
  intake(@Param('provider') provider: string, @Body() body: unknown) {
    return { ok: true, provider, queuedAt: new Date().toISOString(), payloadKeys: typeof body === 'object' && body ? Object.keys(body) : [] };
  }
}
