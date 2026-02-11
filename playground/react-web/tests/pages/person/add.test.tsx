import '../mocks'
import { describe, it, expect } from 'vitest'

describe('pages/person/PersonAdd', () => {
  it('exports PersonAdd function', async () => {
    const { PersonAdd } = await import('../../../src/pages/person/PersonAdd')
    expect(PersonAdd).toBeTypeOf('function')
  })

  it('renders with DataPage and DataForm', async () => {
    const { PersonAdd } = await import('../../../src/pages/person/PersonAdd')
    const element = PersonAdd()
    expect(element).toBeDefined()
  })
})
