import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    env: {
      JWT_SECRET: 'test-jwt-secret-for-unit-tests',
    },
  },
});
