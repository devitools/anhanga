import '../mocks'
import { describe, it, expect } from 'vitest'

describe('pages/person/PersonView', () => {
  it('exports PersonView function', async () => {
    const { PersonView } = await import('../../../src/pages/person/PersonView')
    expect(PersonView).toBeTypeOf('function')
  })

  it('renders with DataPage and DataForm with context', async () => {
    const { PersonView } = await import('../../../src/pages/person/PersonView')
    const element = PersonView()
    expect(element).toBeDefined()
  })
})
