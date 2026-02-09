import { describe, it, expect } from 'vitest'

describe('app/person/view/[id]', () => {
  it('exports default PersonViewPage', async () => {
    const { default: PersonViewPage } = await import('../../../app/person/view/[id]')
    expect(PersonViewPage).toBeTypeOf('function')
  })

  it('renders with Page and DataForm with context', async () => {
    const { default: PersonViewPage } = await import('../../../app/person/view/[id]')
    const element = PersonViewPage()
    expect(element).toBeDefined()
  })
})
