import { vi } from 'vitest'

vi.mock('@anhanga/persistence/web', () => ({
  createWebDriver: vi.fn(() => ({
    initialize: vi.fn(),
    create: vi.fn(),
    read: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
    search: vi.fn(),
  })),
}))
