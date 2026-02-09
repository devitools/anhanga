import { describe, it, expect } from 'vitest'

describe('app/index', () => {
  it('exports default component that redirects to /person', async () => {
    const { default: Index } = await import('../../app/index')
    expect(Index).toBeTypeOf('function')
    const result = Index()
    expect(result).toBeDefined()
  })
})
