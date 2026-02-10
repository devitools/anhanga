import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx}'],
    coverage: {
      reportsDirectory: 'tests/.coverage',
      include: ['src/**'],
      exclude: ['**/node_modules/**', '**/dist/**'],
    },
  },
})
