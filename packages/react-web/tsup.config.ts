import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: [
    'react',
    'react-dom',
    '@ybyra/core',
    '@ybyra/react',
    'i18next',
    'react-i18next',
  ],
})
