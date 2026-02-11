import { describe, it, expect } from 'vitest'

describe('routes/person/add/+page', () => {
  it('exports default component', async () => {
    const { default: PersonAdd } = await import('../../../src/routes/person/add/+page.svelte')
    expect(PersonAdd).toBeDefined()
  })
})
