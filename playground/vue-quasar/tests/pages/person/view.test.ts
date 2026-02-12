import { createPageMocks } from '@ybyra/vue-quasar/testing/page-mocks'

createPageMocks({
  route: { params: { id: '1' }, path: '/person' },
  te: (key) => key.startsWith('person.') || key.startsWith('common.'),
})
import { describe, it, expect } from 'vitest'

describe('pages/PersonView', () => {
  it('exports default component', async () => {
    const { default: PersonView } = await import('../../../src/pages/PersonView.vue')
    expect(PersonView).toBeDefined()
  })

  it('has a setup function', async () => {
    const { default: PersonView } = await import('../../../src/pages/PersonView.vue')
    expect(PersonView.setup).toBeTypeOf('function')
  })
})
