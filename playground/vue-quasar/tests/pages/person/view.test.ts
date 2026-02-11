import '@anhanga/vue-quasar/testing/page-mocks'
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
