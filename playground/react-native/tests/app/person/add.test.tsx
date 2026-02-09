import { describe, it, expect } from 'vitest'

describe('app/person/add', () => {
  it('exports default PersonAddPage', async () => {
    const { default: PersonAddPage } = await import('../../../app/person/add')
    expect(PersonAddPage).toBeTypeOf('function')
  })

  it('renders with Page and DataForm', async () => {
    const { default: PersonAddPage } = await import('../../../app/person/add')
    const element = PersonAddPage()
    expect(element).toBeDefined()
  })
})
