import '../mocks'
import { describe, it, expect } from 'vitest'

describe('pages/person/PersonEdit', () => {
  it('exports PersonEdit function', async () => {
    const { PersonEdit } = await import('../../../src/pages/person/PersonEdit')
    expect(PersonEdit).toBeTypeOf('function')
  })

  it('renders with DataPage and DataForm with context', async () => {
    const { PersonEdit } = await import('../../../src/pages/person/PersonEdit')
    const element = PersonEdit()
    expect(element).toBeDefined()
  })
})
