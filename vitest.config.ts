import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'html', 'json-summary'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 60,
        statements: 80,
      },
      exclude: [
        '**/.next/**',
        '**/eslint.config.mjs',
        '**/next.config.ts',
        '**/postcss.config.mjs',
        '**/src/app/**',
        '**/src/components/**',
        '**/src/lib/i18n/**',
        '**/src/lib/math/stubs.ts',
        '**/src/lib/math/types.ts',
        '**/*.d.ts',
        '**/vitest.config.*',
        '**/next-env.d.ts',
      ],
    },
  },
});
