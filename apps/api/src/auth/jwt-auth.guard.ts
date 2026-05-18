import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from './jwt.service';

export const PUBLIC_KEY = 'revyx:public';
import { SetMetadata } from '@nestjs/common';
export const Public = () => SetMetadata(PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers?.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException({ code: 'AUTH_TOKEN_MISSING' });
    }
    const token = auth.slice('Bearer '.length);
    try {
      const claims = await this.jwt.verifyAccess(token);
      req.user = {
        id: claims.sub,
        tenantId: claims.tid,
        role: claims.role,
        jti: claims.jti,
      };
      return true;
    } catch {
      throw new UnauthorizedException({ code: 'AUTH_TOKEN_INVALID' });
    }
  }
}
