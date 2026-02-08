import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/settings/i18n.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['@anhanga/core', '@faker-js/faker', 'react', 'i18next', 'react-i18next'],
})
