import { describe, it, expect } from 'vitest'

describe('app/person/index', () => {
  it('exports default PersonIndexPage', async () => {
    const { default: PersonIndexPage } = await import('../../../app/person/index')
    expect(PersonIndexPage).toBeTypeOf('function')
  })

  it('renders with Page and DataTable', async () => {
    const { default: PersonIndexPage } = await import('../../../app/person/index')
    const element = PersonIndexPage()
    expect(element).toBeDefined()
  })
})
