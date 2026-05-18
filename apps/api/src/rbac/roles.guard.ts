import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { hasRole, Role } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role | undefined>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required) return true;

    const req = ctx.switchToHttp().getRequest();
    const userRole: Role | undefined = req.user?.role;
    if (!userRole) {
      throw new ForbiddenException({ code: 'AUTH_TOKEN_MISSING' });
    }
    if (!hasRole(userRole, required)) {
      // signal AuditInterceptor to log a denial
      req.auditEvent = 'RBAC_ACCESS_DENIED';
      req.auditMetadata = { required, actual: userRole };
      throw new ForbiddenException({ code: 'RBAC_ACCESS_DENIED' });
    }
    return true;
  }
}
