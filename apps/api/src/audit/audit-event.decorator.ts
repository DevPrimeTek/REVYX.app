import { SetMetadata } from '@nestjs/common';

export const AUDIT_EVENT_KEY = 'revyx:auditEvent';

export interface AuditEventOptions {
  eventType: string;
  entityType?: string;
  severity?: 'INFO' | 'WARN' | 'HIGH' | 'CRITICAL';
}

export const AuditEvent = (options: AuditEventOptions) => SetMetadata(AUDIT_EVENT_KEY, options);
