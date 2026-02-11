import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { createSetupFiles } from "@anhanga/vue-quasar/testing/vitest"

export default defineConfig({
  // @ts-ignore vitest 3.x types reference vite 6 while @vitejs/plugin-vue 6.x references vite 7
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx}'],
    setupFiles: createSetupFiles(),
    coverage: {
      provider: 'v8',
      reportsDirectory: 'tests/.coverage',
      include: ['src/**'],
      exclude: ['**/node_modules/**', '**/dist/**'],
    },
  },
})
