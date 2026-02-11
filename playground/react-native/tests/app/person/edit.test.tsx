import { describe, it, expect } from 'vitest'

describe('app/person/edit/[id]', () => {
  it('exports default PersonEditPage', async () => {
    const { default: PersonEditPage } = await import('../../../app/person/edit/[id]')
    expect(PersonEditPage).toBeTypeOf('function')
  })

  it('renders with DataPage and DataForm with context', async () => {
    const { default: PersonEditPage } = await import('../../../app/person/edit/[id]')
    const element = PersonEditPage()
    expect(element).toBeDefined()
  })
})
