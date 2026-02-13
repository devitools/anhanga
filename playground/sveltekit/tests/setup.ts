import { vi } from 'vitest'

vi.mock('@ybyra/persistence/web', () => ({
  createWebDriver: vi.fn(() => ({
    initialize: vi.fn(),
    create: vi.fn(),
    read: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
    search: vi.fn(),
  })),
}))

vi.mock('lucide-svelte', () => ({
  Plus: 'Plus',
  Eye: 'Eye',
  Pencil: 'Pencil',
  Save: 'Save',
  Send: 'Send',
  X: 'X',
  Trash2: 'Trash2',
}))
