import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { and, eq, isNull } from 'drizzle-orm';
import { DB_TOKEN } from '@/db/db.module';
import type { DrizzleDB } from '@/db/client';
import { users, type User } from '@/db/schema/users';
import { gdprConsents, type GdprConsent } from '@/db/schema/gdpr-consents';

export interface AccessExport {
  user: Pick<User, 'id' | 'email' | 'fullName' | 'role' | 'tenantId' | 'createdAt' | 'lastLoginAt'>;
  consents: GdprConsent[];
  exportedAt: string;
  privacyPolicyVersion: string;
}

@Injectable()
export class GdprService {
  constructor(
    @Inject(DB_TOKEN) private readonly db: DrizzleDB,
    private readonly cfg: ConfigService,
  ) {}

  async access(userId: string): Promise<AccessExport> {
    const rows = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    const user = rows[0];
    if (!user) throw new NotFoundException({ code: 'USER_NOT_FOUND' });

    const consents = await this.db
      .select()
      .from(gdprConsents)
      .where(eq(gdprConsents.subjectId, userId));

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenantId: user.tenantId,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
      consents,
      exportedAt: new Date().toISOString(),
      privacyPolicyVersion: this.cfg.get<string>('PRIVACY_POLICY_VERSION', '1.0.0'),
    };
  }

  // Art. 20 — same payload as access for M1.S1; M1.S3+ adds LEAD + DEAL + ACTIVITY history.
  async portability(userId: string): Promise<AccessExport> {
    return this.access(userId);
  }

  async requestErasure(userId: string): Promise<{ queued: true; consentIds: string[] }> {
    const existing = await this.db
      .select()
      .from(gdprConsents)
      .where(and(eq(gdprConsents.subjectId, userId), isNull(gdprConsents.erasureCompleted)));

    if (existing.some((c) => c.erasureRequested)) {
      throw new ConflictException({ code: 'GDPR_ERASURE_ALREADY_QUEUED' });
    }

    const now = new Date();
    const updated = await this.db
      .update(gdprConsents)
      .set({ erasureRequested: now })
      .where(and(eq(gdprConsents.subjectId, userId), isNull(gdprConsents.erasureCompleted)))
      .returning({ id: gdprConsents.id });

    // M1.S3+: enqueue BullMQ job `gdpr-erasure-cascade` (LEAD → DEAL anonymize → ACTIVITY delete).
    return { queued: true, consentIds: updated.map((u) => u.id) };
  }

  async restrict(userId: string): Promise<{ restrictedAt: string }> {
    const now = new Date();
    await this.db
      .update(gdprConsents)
      .set({ restrictedAt: now })
      .where(eq(gdprConsents.subjectId, userId));
    return { restrictedAt: now.toISOString() };
  }
}
