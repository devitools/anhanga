import { createPageMocks } from '@ybyra/vue-quasar/testing/page-mocks'

createPageMocks({
  route: { params: { id: '1' }, path: '/person' },
  te: (key) => key.startsWith('person.') || key.startsWith('common.'),
})
import { describe, it, expect } from 'vitest'

describe('pages/PersonEdit', () => {
  it('exports default component', async () => {
    const { default: PersonEdit } = await import('../../../src/pages/PersonEdit.vue')
    expect(PersonEdit).toBeDefined()
  })

  it('has a setup function', async () => {
    const { default: PersonEdit } = await import('../../../src/pages/PersonEdit.vue')
    expect(PersonEdit.setup).toBeTypeOf('function')
  })
})
