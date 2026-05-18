import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import { importPKCS8, importSPKI, SignJWT, jwtVerify, type JWTPayload, type KeyLike } from 'jose';
import type { Role } from '@/rbac/role.enum';

export interface AccessClaims extends JWTPayload {
  sub: string;
  tid: string;
  role: Role;
  jti: string;
}

export interface RefreshClaims extends JWTPayload {
  sub: string;
  jti: string;
}

@Injectable()
export class JwtService implements OnModuleInit {
  private privateKey!: KeyLike;
  private publicKey!: KeyLike;
  private readonly alg = 'RS256';

  constructor(private readonly cfg: ConfigService) {}

  async onModuleInit() {
    const privPath = this.cfg.getOrThrow<string>('JWT_PRIVATE_KEY_PATH');
    const pubPath = this.cfg.getOrThrow<string>('JWT_PUBLIC_KEY_PATH');
    const [priv, pub] = await Promise.all([readFile(privPath, 'utf8'), readFile(pubPath, 'utf8')]);
    this.privateKey = await importPKCS8(priv, this.alg);
    this.publicKey = await importSPKI(pub, this.alg);
  }

  async signAccess(input: { userId: string; tenantId: string; role: Role }): Promise<{ token: string; jti: string }> {
    const jti = randomUUID();
    const ttl = this.cfg.get<number>('JWT_ACCESS_TTL_SECONDS', 900);
    const token = await new SignJWT({ tid: input.tenantId, role: input.role, jti })
      .setProtectedHeader({ alg: this.alg, kid: this.cfg.getOrThrow<string>('JWT_KEY_ID') })
      .setIssuer(this.cfg.getOrThrow<string>('JWT_ISSUER'))
      .setAudience(this.cfg.getOrThrow<string>('JWT_AUDIENCE'))
      .setSubject(input.userId)
      .setIssuedAt()
      .setExpirationTime(`${ttl}s`)
      .setJti(jti)
      .sign(this.privateKey);
    return { token, jti };
  }

  async signRefresh(userId: string): Promise<{ token: string; jti: string; expiresAt: Date }> {
    const jti = randomUUID();
    const ttl = this.cfg.get<number>('JWT_REFRESH_TTL_SECONDS', 604_800);
    const expiresAt = new Date(Date.now() + ttl * 1000);
    const token = await new SignJWT({ jti })
      .setProtectedHeader({ alg: this.alg, kid: this.cfg.getOrThrow<string>('JWT_KEY_ID') })
      .setIssuer(this.cfg.getOrThrow<string>('JWT_ISSUER'))
      .setAudience(this.cfg.getOrThrow<string>('JWT_AUDIENCE'))
      .setSubject(userId)
      .setIssuedAt()
      .setExpirationTime(`${ttl}s`)
      .setJti(jti)
      .sign(this.privateKey);
    return { token, jti, expiresAt };
  }

  async verifyAccess(token: string): Promise<AccessClaims> {
    const { payload } = await jwtVerify(token, this.publicKey, {
      issuer: this.cfg.getOrThrow<string>('JWT_ISSUER'),
      audience: this.cfg.getOrThrow<string>('JWT_AUDIENCE'),
    });
    return payload as AccessClaims;
  }

  async verifyRefresh(token: string): Promise<RefreshClaims> {
    const { payload } = await jwtVerify(token, this.publicKey, {
      issuer: this.cfg.getOrThrow<string>('JWT_ISSUER'),
      audience: this.cfg.getOrThrow<string>('JWT_AUDIENCE'),
    });
    return payload as RefreshClaims;
  }

  hashToken(plain: string): string {
    return createHash('sha256').update(plain).digest('hex');
  }
}
