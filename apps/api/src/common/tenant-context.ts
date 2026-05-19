import { ForbiddenException } from '@nestjs/common';

/**
 * Shape of `req.user` set by JwtAuthGuard (see auth/jwt-auth.guard.ts).
 * Re-declared here to avoid circular dep between common/ and auth/.
 */
export interface AuthedUser {
  id: string;
  tenantId: string;
  role: string;
  jti: string;
}

export interface RequestWithUser {
  user?: AuthedUser;
}

/**
 * Resolve the tenant context from the authenticated request. Throws 403 if absent —
 * controllers covered by JwtAuthGuard already throw 401 on missing tokens, so this is
 * a defense-in-depth check.
 */
export function requireTenant(req: RequestWithUser): AuthedUser {
  if (!req.user?.tenantId) {
    throw new ForbiddenException({ code: 'TENANT_CONTEXT_MISSING' });
  }
  return req.user;
}
