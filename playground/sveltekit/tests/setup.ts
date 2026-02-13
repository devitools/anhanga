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
  Eye: 'Eye',
  Pencil: 'Pencil',
  Plus: 'Plus',
  Save: 'Save',
  Send: 'Send',
  Trash2: 'Trash2',
  X: 'X',
}))
