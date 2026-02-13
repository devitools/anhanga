import { resolveActionIcon } from '@ybyra/sveltekit'
import { describe, it, expect } from 'vitest'

describe('icons', () => {
  it('configures common action icons', async () => {
    await import('../../../src/lib/settings/icons')

    const expectedActions = ['add', 'view', 'edit', 'create', 'update', 'cancel', 'destroy', 'custom']
    for (const action of expectedActions) {
      expect(resolveActionIcon('person', action)).toBeDefined()
    }
  })
})
