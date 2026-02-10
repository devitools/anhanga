import { resolveActionIcon } from '@anhanga/vue'
import { describe, it, expect } from 'vitest'
import '../../../src/settings/icons'

describe('icons', () => {
  it('configures common action icons', () => {
    expect(resolveActionIcon('person', 'add')).toBe('add')
    expect(resolveActionIcon('person', 'view')).toBe('visibility')
    expect(resolveActionIcon('person', 'edit')).toBe('edit')
    expect(resolveActionIcon('person', 'create')).toBe('save')
    expect(resolveActionIcon('person', 'update')).toBe('save')
    expect(resolveActionIcon('person', 'cancel')).toBe('close')
    expect(resolveActionIcon('person', 'destroy')).toBe('delete')
  })
})
