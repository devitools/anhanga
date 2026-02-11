import { createPageMocks } from '@anhanga/vue-quasar/testing/page-mocks'

createPageMocks({
  route: { params: { id: '1' }, path: '/person' },
  te: (key) => key.startsWith('person.') || key.startsWith('common.'),
})
import { describe, it, expect } from 'vitest'

describe('pages/PersonAdd', () => {
  it('exports default component', async () => {
    const { default: PersonAdd } = await import('../../../src/pages/PersonAdd.vue')
    expect(PersonAdd).toBeDefined()
  })

  it('has a setup function', async () => {
    const { default: PersonAdd } = await import('../../../src/pages/PersonAdd.vue')
    expect(PersonAdd.setup).toBeTypeOf('function')
  })
})
