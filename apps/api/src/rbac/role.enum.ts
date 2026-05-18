// System roles (BRD §10.1.1). Custom roles Phase 5 (BRD v1.1.0 §10.1.2) sunt out of scope M1.S1.

export enum Role {
  AGENT = 'agent',
  SENIOR_AGENT = 'senior_agent',
  TEAM_LEAD = 'team_lead',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

// Permisiuni aditive — fiecare rol include nivelele inferioare.
export const ROLE_LEVEL: Record<Role, number> = {
  [Role.AGENT]: 1,
  [Role.SENIOR_AGENT]: 2,
  [Role.TEAM_LEAD]: 3,
  [Role.MANAGER]: 4,
  [Role.ADMIN]: 5,
};

export function hasRole(actual: Role, required: Role): boolean {
  return ROLE_LEVEL[actual] >= ROLE_LEVEL[required];
}
