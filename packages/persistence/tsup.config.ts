import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/web-driver.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['@ybyra/core', 'expo-sqlite'],
})
