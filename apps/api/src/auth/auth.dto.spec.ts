import { describe, it, expect } from 'vitest';
import { changePasswordSchema, loginSchema, refreshSchema } from './auth.dto';

describe('auth DTO validation (Zod)', () => {
  describe('loginSchema', () => {
    it('accepts valid payload', () => {
      expect(loginSchema.safeParse({ tenantSlug: 'acme', email: 'a@b.io', password: 'secret12' }).success).toBe(true);
    });
    it('rejects short password', () => {
      expect(loginSchema.safeParse({ tenantSlug: 'acme', email: 'a@b.io', password: '1234' }).success).toBe(false);
    });
    it('rejects bad email', () => {
      expect(loginSchema.safeParse({ tenantSlug: 'acme', email: 'not-an-email', password: 'secret12' }).success).toBe(false);
    });
  });

  describe('refreshSchema', () => {
    it('accepts long-enough token', () => {
      expect(refreshSchema.safeParse({ refreshToken: 'x'.repeat(40) }).success).toBe(true);
    });
    it('rejects empty', () => {
      expect(refreshSchema.safeParse({ refreshToken: '' }).success).toBe(false);
    });
  });

  describe('changePasswordSchema', () => {
    it('requires newPassword ≥ 12 chars', () => {
      expect(changePasswordSchema.safeParse({ currentPassword: 'oldsecret', newPassword: 'short' }).success).toBe(false);
      expect(changePasswordSchema.safeParse({ currentPassword: 'oldsecret', newPassword: 'long-enough-password' }).success).toBe(true);
    });
  });
});
