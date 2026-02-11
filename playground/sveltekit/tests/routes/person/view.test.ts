import { describe, it, expect } from 'vitest'

describe('routes/person/[id]/+page (view)', () => {
  it('exports default component', async () => {
    const { default: PersonView } = await import('../../../src/routes/person/[id]/+page.svelte')
    expect(PersonView).toBeDefined()
  })
})
