import { vi } from 'vitest'
import type { PersistenceContract } from '@anhanga/core'

export function mockDriver (overrides: Partial<PersistenceContract> = {}): PersistenceContract {
  return {
    initialize: vi.fn().mockResolvedValue(undefined),
    create: vi.fn().mockResolvedValue({}),
    read: vi.fn().mockResolvedValue(null),
    update: vi.fn().mockResolvedValue({}),
    destroy: vi.fn().mockResolvedValue(undefined),
    search: vi.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 }),
    ...overrides,
  }
}
