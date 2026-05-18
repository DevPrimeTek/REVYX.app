import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { DB_TOKEN } from '@/db/db.module';
import type { DrizzleDB } from '@/db/client';
import { users, type User } from '@/db/schema/users';
import { tenants } from '@/db/schema/tenants';
import { refreshTokens } from '@/db/schema/refresh-tokens';
import { JwtService } from './jwt.service';
import { PasswordService } from './password.service';
import { AuditService } from '@/audit/audit.service';
import { Role } from '@/rbac/role.enum';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoginContext {
  ip?: string;
  userAgent?: string;
  correlationId?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB_TOKEN) private readonly db: DrizzleDB,
    private readonly jwt: JwtService,
    private readonly pwd: PasswordService,
    private readonly audit: AuditService,
  ) {}

  async login(tenantSlug: string, email: string, password: string, ctx: LoginContext): Promise<{ tokens: TokenPair; user: User }> {
    const rows = await this.db
      .select({ user: users, tenant: tenants })
      .from(users)
      .innerJoin(tenants, eq(users.tenantId, tenants.id))
      .where(and(eq(users.email, email), eq(tenants.slug, tenantSlug)))
      .limit(1);

    const row = rows[0];
    const user = row?.user;
    const tenant = row?.tenant;
    if (!user || !tenant || !user.isActive) {
      await this.audit.write({
        actorType: 'SYSTEM',
        eventType: 'AUTH_LOGIN_FAILED',
        metadata: { reason: 'INVALID_CREDENTIALS', email, tenantSlug },
        severity: 'WARN',
        ipAddress: ctx.ip ?? null,
        userAgent: ctx.userAgent ?? null,
      });
      throw new UnauthorizedException({ code: 'AUTH_INVALID_CREDENTIALS' });
    }

    const ok = await this.pwd.verify(password, user.passwordHash);
    if (!ok) {
      await this.audit.write({
        tenantId: user.tenantId,
        actorId: user.id,
        actorType: 'USER',
        eventType: 'AUTH_LOGIN_FAILED',
        metadata: { reason: 'INVALID_PASSWORD' },
        severity: 'WARN',
        ipAddress: ctx.ip ?? null,
        userAgent: ctx.userAgent ?? null,
      });
      throw new UnauthorizedException({ code: 'AUTH_INVALID_CREDENTIALS' });
    }

    // BR-12 single session: revoke ALL active refresh tokens for this user.
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date(), revokeReason: 'NEW_SESSION' })
      .where(and(eq(refreshTokens.userId, user.id), isNull(refreshTokens.revokedAt), isNull(refreshTokens.rotatedAt)));

    const tokens = await this.issueTokens(user);

    await this.db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

    await this.audit.write({
      tenantId: user.tenantId,
      actorId: user.id,
      actorType: 'USER',
      eventType: 'AUTH_LOGIN_SUCCESS',
      metadata: { role: user.role },
      ipAddress: ctx.ip ?? null,
      userAgent: ctx.userAgent ?? null,
    });

    return { tokens, user };
  }

  async refresh(rawRefresh: string, ctx: LoginContext): Promise<TokenPair> {
    let claims;
    try {
      claims = await this.jwt.verifyRefresh(rawRefresh);
    } catch {
      throw new UnauthorizedException({ code: 'AUTH_REFRESH_INVALID' });
    }

    const tokenHash = this.jwt.hashToken(rawRefresh);
    const found = await this.db.select().from(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash)).limit(1);
    const stored = found[0];
    if (!stored || stored.revokedAt) {
      throw new UnauthorizedException({ code: 'AUTH_REFRESH_INVALID' });
    }

    if (stored.rotatedAt) {
      // Replay attack: a rotated token was presented again. Burn the whole family.
      await this.revokeFamily(stored.userId, 'TOKEN_REUSE_DETECTED');
      await this.audit.write({
        actorId: stored.userId,
        actorType: 'SYSTEM',
        eventType: 'AUTH_TOKEN_REUSE_DETECTED',
        metadata: { jti: claims.jti },
        severity: 'HIGH',
        ipAddress: ctx.ip ?? null,
        userAgent: ctx.userAgent ?? null,
      });
      throw new UnauthorizedException({ code: 'AUTH_TOKEN_REUSE_DETECTED' });
    }

    const userRows = await this.db.select().from(users).where(eq(users.id, stored.userId)).limit(1);
    const user = userRows[0];
    if (!user || !user.isActive) {
      throw new UnauthorizedException({ code: 'AUTH_REFRESH_INVALID' });
    }

    await this.db
      .update(refreshTokens)
      .set({ rotatedAt: new Date() })
      .where(eq(refreshTokens.id, stored.id));

    const tokens = await this.issueTokens(user, stored.id);

    await this.audit.write({
      tenantId: user.tenantId,
      actorId: user.id,
      actorType: 'USER',
      eventType: 'AUTH_TOKEN_REFRESHED',
      ipAddress: ctx.ip ?? null,
      userAgent: ctx.userAgent ?? null,
    });

    return tokens;
  }

  async logout(rawRefresh: string, userId: string, ctx: LoginContext): Promise<void> {
    const tokenHash = this.jwt.hashToken(rawRefresh);
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date(), revokeReason: 'LOGOUT' })
      .where(and(eq(refreshTokens.tokenHash, tokenHash), eq(refreshTokens.userId, userId)));

    await this.audit.write({
      actorId: userId,
      actorType: 'USER',
      eventType: 'AUTH_LOGOUT',
      ipAddress: ctx.ip ?? null,
      userAgent: ctx.userAgent ?? null,
    });
  }

  async changePassword(userId: string, current: string, next: string, ctx: LoginContext): Promise<void> {
    const rows = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    const user = rows[0];
    if (!user) throw new UnauthorizedException({ code: 'AUTH_USER_NOT_FOUND' });

    const ok = await this.pwd.verify(current, user.passwordHash);
    if (!ok) throw new UnauthorizedException({ code: 'AUTH_INVALID_CREDENTIALS' });

    const newHash = await this.pwd.hash(next);
    await this.db
      .update(users)
      .set({ passwordHash: newHash, passwordChangedAt: new Date() })
      .where(eq(users.id, userId));

    // BR-12 + BRD §9.1 — force logout on password change
    await this.revokeFamily(userId, 'PASSWORD_CHANGE');

    await this.audit.write({
      tenantId: user.tenantId,
      actorId: userId,
      actorType: 'USER',
      eventType: 'AUTH_PASSWORD_CHANGED',
      ipAddress: ctx.ip ?? null,
      userAgent: ctx.userAgent ?? null,
    });
  }

  private async revokeFamily(userId: string, reason: string): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date(), revokeReason: reason })
      .where(and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)));
  }

  private async issueTokens(user: User, parentTokenId?: string): Promise<TokenPair> {
    const access = await this.jwt.signAccess({
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role as Role,
    });
    const refresh = await this.jwt.signRefresh(user.id);
    await this.db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash: this.jwt.hashToken(refresh.token),
      issuedAt: new Date(),
      expiresAt: refresh.expiresAt,
      parentTokenId: parentTokenId ?? null,
    });
    return { accessToken: access.token, refreshToken: refresh.token };
  }
}
