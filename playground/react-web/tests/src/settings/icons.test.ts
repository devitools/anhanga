import { resolveActionIcon } from '@ybyra/react-web'
import { describe, it, expect } from 'vitest'
import '../../../src/settings/icons'

describe('icons', () => {
  it('configures common action icons', () => {
    expect(resolveActionIcon('person', 'add')).toBe('plus')
    expect(resolveActionIcon('person', 'view')).toBe('eye')
    expect(resolveActionIcon('person', 'edit')).toBe('edit-2')
    expect(resolveActionIcon('person', 'create')).toBe('save')
    expect(resolveActionIcon('person', 'update')).toBe('save')
    expect(resolveActionIcon('person', 'cancel')).toBe('x')
    expect(resolveActionIcon('person', 'destroy')).toBe('trash-2')
  })
})
