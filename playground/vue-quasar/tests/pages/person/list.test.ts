import '../mocks'
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
