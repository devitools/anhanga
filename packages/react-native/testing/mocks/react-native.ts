import { vi } from 'vitest'

export const StyleSheet = {
  create: <T extends Record<string, unknown>>(styles: T): T => styles,
}
export const View = ({ children }: any) => children
export const Text = ({ children }: any) => children
export const TextInput = 'TextInput'
export const Pressable = 'Pressable'
export const ScrollView = ({ children }: any) => children
export const ActivityIndicator = 'ActivityIndicator'
export const Modal = 'Modal'
export const Platform = { OS: 'ios' }
export const Animated = {
  View: ({ children }: any) => children,
  Value: class { constructor(_v: number) {} },
  spring: vi.fn(() => ({ start: vi.fn() })),
}
