import '../mocks'
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
