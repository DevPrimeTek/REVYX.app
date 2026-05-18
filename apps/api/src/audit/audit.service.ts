import { Inject, Injectable, Logger } from '@nestjs/common';
import { DB_TOKEN } from '@/db/db.module';
import type { DrizzleDB } from '@/db/client';
import { auditLog, type NewAuditLogRow } from '@/db/schema/audit-log';

@Injectable()
export class AuditService {
  private readonly log = new Logger(AuditService.name);

  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDB) {}

  async write(event: NewAuditLogRow): Promise<void> {
    try {
      await this.db.insert(auditLog).values(event);
    } catch (err) {
      // AUDIT_LOG failures are CRITICAL: log + alert hook, but do NOT throw — would
      // mask the upstream business outcome. M1.S2+ adds a fallback queue to BullMQ.
      this.log.error(`audit_log insert failed: ${(err as Error).message}`, (err as Error).stack);
    }
  }
}
