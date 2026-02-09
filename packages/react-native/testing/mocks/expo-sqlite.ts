import { vi } from 'vitest'

export function openDatabaseSync() {
  return {
    execSync: vi.fn(),
    runSync: vi.fn(),
    getFirstSync: vi.fn(),
    getAllSync: vi.fn(() => []),
  }
}
