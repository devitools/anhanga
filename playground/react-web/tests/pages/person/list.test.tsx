import '../mocks'
import { describe, it, expect } from 'vitest'

describe('pages/person/PersonList', () => {
  it('exports PersonList function', async () => {
    const { PersonList } = await import('../../../src/pages/person/PersonList')
    expect(PersonList).toBeTypeOf('function')
  })

  it('renders with DataPage and DataTable', async () => {
    const { PersonList } = await import('../../../src/pages/person/PersonList')
    const element = PersonList()
    expect(element).toBeDefined()
  })
})
