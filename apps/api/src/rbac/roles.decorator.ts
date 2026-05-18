import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

export const ROLES_KEY = 'revyx:requiredRole';

export const Roles = (required: Role) => SetMetadata(ROLES_KEY, required);
