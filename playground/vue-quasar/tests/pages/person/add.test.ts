import '../mocks'
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
