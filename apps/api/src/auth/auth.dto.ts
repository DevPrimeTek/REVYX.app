import { z } from 'zod';

export const loginSchema = z.object({
  tenantSlug: z.string().min(1).max(64),
  email: z.string().email().max(320),
  password: z.string().min(8).max(256),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const refreshSchema = z.object({
  refreshToken: z.string().min(20).max(4096),
});
export type RefreshInput = z.infer<typeof refreshSchema>;

export const logoutSchema = z.object({
  refreshToken: z.string().min(20).max(4096),
});
export type LogoutInput = z.infer<typeof logoutSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(256),
  newPassword: z.string().min(12).max(256),
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
