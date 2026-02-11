import { describe, it, expect } from 'vitest'

describe('routes/person/+page (list)', () => {
  it('exports default component', async () => {
    const { default: PersonList } = await import('../../../src/routes/person/+page.svelte')
    expect(PersonList).toBeDefined()
  })
})
