import { resolveActionIcon } from '@anhanga/sveltekit'
import { describe, it, expect, vi } from 'vitest'

vi.mock('lucide-svelte', () => ({
  Plus: 'Plus',
  Eye: 'Eye',
  Pencil: 'Pencil',
  Save: 'Save',
  X: 'X',
  Trash2: 'Trash2',
}))

import('../../../src/lib/settings/icons')

describe('icons', () => {
  it('configures common action icons', async () => {
    await import('../../../src/lib/settings/icons')

    const expectedActions = ['add', 'view', 'edit', 'create', 'update', 'cancel', 'destroy']
    for (const action of expectedActions) {
      expect(resolveActionIcon('person', action)).toBeDefined()
    }
  })
})
