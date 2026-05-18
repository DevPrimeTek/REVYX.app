import { describe, it, expect } from 'vitest';
import { Role, hasRole } from './role.enum';

describe('RBAC role hierarchy', () => {
  it('admin satisfies every required role', () => {
    expect(hasRole(Role.ADMIN, Role.AGENT)).toBe(true);
    expect(hasRole(Role.ADMIN, Role.SENIOR_AGENT)).toBe(true);
    expect(hasRole(Role.ADMIN, Role.TEAM_LEAD)).toBe(true);
    expect(hasRole(Role.ADMIN, Role.MANAGER)).toBe(true);
    expect(hasRole(Role.ADMIN, Role.ADMIN)).toBe(true);
  });

  it('agent satisfies only AGENT', () => {
    expect(hasRole(Role.AGENT, Role.AGENT)).toBe(true);
    expect(hasRole(Role.AGENT, Role.SENIOR_AGENT)).toBe(false);
    expect(hasRole(Role.AGENT, Role.TEAM_LEAD)).toBe(false);
    expect(hasRole(Role.AGENT, Role.MANAGER)).toBe(false);
    expect(hasRole(Role.AGENT, Role.ADMIN)).toBe(false);
  });

  it('manager satisfies AGENT/SENIOR_AGENT/TEAM_LEAD/MANAGER but not ADMIN', () => {
    expect(hasRole(Role.MANAGER, Role.AGENT)).toBe(true);
    expect(hasRole(Role.MANAGER, Role.SENIOR_AGENT)).toBe(true);
    expect(hasRole(Role.MANAGER, Role.TEAM_LEAD)).toBe(true);
    expect(hasRole(Role.MANAGER, Role.MANAGER)).toBe(true);
    expect(hasRole(Role.MANAGER, Role.ADMIN)).toBe(false);
  });
});
