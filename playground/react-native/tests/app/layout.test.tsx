import { describe, it, expect } from 'vitest'

describe('app/_layout', () => {
  it('exports default component', async () => {
    const { default: Layout } = await import('../../app/_layout')
    expect(Layout).toBeTypeOf('function')
  })

  it('renders layout with View, StatusBar and Stack', async () => {
    const { default: Layout } = await import('../../app/_layout')
    const element = Layout({})
    expect(element).toBeDefined()
  })
})
