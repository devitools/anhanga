import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import { createAliases, createSetupFiles } from '../../packages/react-native/testing/vitest'

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      '@ybyra/core': resolve(__dirname, '../../packages/core/src'),
      '@ybyra/demo': resolve(__dirname, '../../packages/demo/src'),
      '@ybyra/react-native': resolve(__dirname, '../../packages/react-native/src'),
      '@ybyra/react': resolve(__dirname, '../../packages/react/src'),
      '@ybyra/persistence/web': resolve(__dirname, '../../packages/persistence/src/web-driver.ts'),
      '@ybyra/persistence': resolve(__dirname, '../../packages/persistence/src'),
      ...createAliases(),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx}'],
    setupFiles: createSetupFiles(),
    coverage: {
      reportsDirectory: 'tests/.coverage',
      include: ['src/**', 'app/**'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/.expo/**'],
    },
  },
})
