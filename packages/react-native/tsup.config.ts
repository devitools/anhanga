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
    '@anhanga/core',
    '@anhanga/react',
    '@expo/vector-icons',
    'expo-router',
    'i18next',
    'react-i18next',
  ],
})
