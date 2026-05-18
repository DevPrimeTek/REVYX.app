import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  DATABASE_URL: z.string().min(1),
  DATABASE_POOL_SIZE: z.coerce.number().int().positive().default(20),

  REDIS_URL: z.string().min(1).default('redis://localhost:6379'),

  JWT_PRIVATE_KEY_PATH: z.string().min(1),
  JWT_PUBLIC_KEY_PATH: z.string().min(1),
  JWT_KEY_ID: z.string().min(1).default('k1'),
  JWT_ISSUER: z.string().url(),
  JWT_AUDIENCE: z.string().min(1),
  JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().positive().default(604800),

  META_WEBHOOK_SECRET: z.string().optional(),
  GOOGLE_WEBHOOK_SECRET: z.string().optional(),
  OLX_WEBHOOK_SECRET: z.string().optional(),

  THROTTLE_PUBLIC_LIMIT: z.coerce.number().int().positive().default(20),
  THROTTLE_PUBLIC_TTL: z.coerce.number().int().positive().default(60_000),
  THROTTLE_INTERNAL_LIMIT: z.coerce.number().int().positive().default(1000),
  THROTTLE_INTERNAL_TTL: z.coerce.number().int().positive().default(60_000),

  GDPR_RETENTION_DAYS: z.coerce.number().int().positive().default(1095),
  PRIVACY_POLICY_VERSION: z.string().min(1).default('1.0.0'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(raw: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Invalid environment: ${parsed.error.toString()}`);
  }
  return parsed.data;
}
