import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
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
