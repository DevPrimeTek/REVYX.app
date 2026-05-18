import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { DB_TOKEN } from '@/db/db.module';
import type { DrizzleDB } from '@/db/client';
import { webhookSignatures } from '@/db/schema/webhook-signatures';

const SIGNATURE_HEADER: Record<string, string> = {
  meta: 'x-hub-signature-256',
  google: 'x-goog-signature',
  olx: 'x-olx-signature',
};

const SECRET_KEY: Record<string, string> = {
  meta: 'META_WEBHOOK_SECRET',
  google: 'GOOGLE_WEBHOOK_SECRET',
  olx: 'OLX_WEBHOOK_SECRET',
};

@Injectable()
export class WebhookHmacGuard implements CanActivate {
  constructor(
    private readonly cfg: ConfigService,
    @Inject(DB_TOKEN) private readonly db: DrizzleDB,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const provider = (req.params?.provider ?? '').toLowerCase();
    if (!['meta', 'google', 'olx'].includes(provider)) {
      throw new ForbiddenException({ code: 'WEBHOOK_PROVIDER_UNKNOWN' });
    }
    const secret = this.cfg.get<string>(SECRET_KEY[provider]);
    if (!secret) {
      throw new ForbiddenException({ code: 'WEBHOOK_SECRET_NOT_CONFIGURED' });
    }

    const headerValue = req.headers[SIGNATURE_HEADER[provider]] as string | undefined;
    if (!headerValue) {
      req.auditEvent = 'WEBHOOK_SIGNATURE_INVALID';
      req.auditMetadata = { provider, reason: 'MISSING' };
      throw new UnauthorizedException({ code: 'WEBHOOK_SIGNATURE_MISSING' });
    }

    // Meta sends "sha256=<hex>"; the other providers send raw hex.
    const presented = provider === 'meta' ? headerValue.replace(/^sha256=/, '') : headerValue;

    const raw: Buffer = req.rawBody ?? Buffer.from(JSON.stringify(req.body ?? {}), 'utf8');
    const expected = createHmac('sha256', secret).update(raw).digest('hex');

    if (
      presented.length !== expected.length ||
      !timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(presented, 'hex'))
    ) {
      req.auditEvent = 'WEBHOOK_SIGNATURE_INVALID';
      req.auditMetadata = { provider, reason: 'MISMATCH' };
      throw new UnauthorizedException({ code: 'WEBHOOK_SIGNATURE_INVALID' });
    }

    const payloadHash = createHash('sha256').update(raw).digest('hex');
    try {
      await this.db.insert(webhookSignatures).values({
        provider,
        signature: presented,
        payloadHash,
      });
    } catch (err) {
      if (isUniqueViolation(err)) {
        req.auditEvent = 'WEBHOOK_REPLAY_DETECTED';
        req.auditMetadata = { provider, payloadHash };
        throw new ConflictException({ code: 'WEBHOOK_REPLAY_DETECTED' });
      }
      throw err;
    }

    req.auditEvent = 'WEBHOOK_RECEIVED';
    req.auditMetadata = { provider };
    return true;
  }
}

function isUniqueViolation(err: unknown): boolean {
  // `postgres` driver surfaces { code: '23505' } for unique_violation.
  return typeof err === 'object' && err !== null && (err as { code?: string }).code === '23505';
}
