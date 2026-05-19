import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/integration/**/*.spec.ts'],
    testTimeout: 120_000, // testcontainers cold start
    hookTimeout: 120_000,
    pool: 'forks', // each file gets its own container set
    fileParallelism: false, // testcontainers per-file is heavy; serialize
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
