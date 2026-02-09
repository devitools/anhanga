import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function createAliases() {
  return {
    'react-native': resolve(__dirname, 'mocks/react-native.ts'),
    'expo-router': resolve(__dirname, 'mocks/expo-router.ts'),
    'expo-status-bar': resolve(__dirname, 'mocks/expo-status-bar.ts'),
    'expo-sqlite': resolve(__dirname, 'mocks/expo-sqlite.ts'),
    '@expo/vector-icons': resolve(__dirname, 'mocks/expo-vector-icons.ts'),
    'react-i18next': resolve(__dirname, 'mocks/react-i18next.ts'),
  }
}

export function createSetupFiles() {
  return [resolve(__dirname, 'setup.ts')]
}
