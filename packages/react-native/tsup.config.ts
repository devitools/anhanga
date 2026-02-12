import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: [
    'react',
    'react-native',
    '@ybyra/core',
    '@ybyra/react',
    '@expo/vector-icons',
    'expo-router',
    'i18next',
    'react-i18next',
  ],
})
