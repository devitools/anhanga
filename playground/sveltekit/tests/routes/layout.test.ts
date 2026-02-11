import { vi, describe, it, expect } from 'vitest'

vi.mock('lucide-svelte', () => ({
  Plus: 'Plus',
  Eye: 'Eye',
  Pencil: 'Pencil',
  Save: 'Save',
  X: 'X',
  Trash2: 'Trash2',
}))

describe('routes/+layout', () => {
  it('exports default component', async () => {
    const { default: Layout } = await import('../../src/routes/+layout.svelte')
    expect(Layout).toBeDefined()
  })
})
