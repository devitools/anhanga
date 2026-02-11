import { createPageMocks } from '@anhanga/vue-quasar/testing/page-mocks'

createPageMocks({
  route: { params: { id: '1' }, path: '/person' },
  te: (key) => key.startsWith('person.') || key.startsWith('common.'),
})
import { describe, it, expect } from 'vitest'

describe('pages/PersonList', () => {
  it('exports default component', async () => {
    const { default: PersonList } = await import('../../../src/pages/PersonList.vue')
    expect(PersonList).toBeDefined()
  })

  it('has a setup function', async () => {
    const { default: PersonList } = await import('../../../src/pages/PersonList.vue')
    expect(PersonList.setup).toBeTypeOf('function')
  })
})
