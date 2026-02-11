import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

export default defineConfig({
  plugins: [svelte({ hot: false })],
  resolve: {
    alias: {
      '$lib': resolve(__dirname, './src/lib'),
      '$app/navigation': resolve(__dirname, './tests/mocks/$app/navigation.ts'),
      '$app/state': resolve(__dirname, './tests/mocks/$app/state.ts'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/setup.ts'],
    coverage: {
      reportsDirectory: 'tests/.coverage',
      include: ['src/**'],
      exclude: ['**/node_modules/**', '**/dist/**'],
    },
  },
})
