/** Public runtime config. DEMO_URL is read at build time from the env. */
export const DEMO_URL =
  process.env.NEXT_PUBLIC_DEMO_URL?.trim() || 'https://demo.revyx.app';
