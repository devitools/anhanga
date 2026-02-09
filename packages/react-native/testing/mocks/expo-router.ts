import { vi } from 'vitest'

export const router = {
  push: vi.fn(),
  back: vi.fn(),
  replace: vi.fn(),
}
export const Stack = ({ children }: any) => children
export const Redirect = ({ href }: any) => href
export const useLocalSearchParams = vi.fn(() => ({ id: '1' }))
