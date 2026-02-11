import { describe, it, expect } from 'vitest'

describe('routes/+page (root)', () => {
  it('exports default component', async () => {
    const { default: Page } = await import('../../src/routes/+page.svelte')
    expect(Page).toBeDefined()
  })
})
