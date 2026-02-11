import { describe, it, expect } from 'vitest'

describe('routes/person/[id]/edit/+page', () => {
  it('exports default component', async () => {
    const { default: PersonEdit } = await import('../../../src/routes/person/[id]/edit/+page.svelte')
    expect(PersonEdit).toBeDefined()
  })
})
