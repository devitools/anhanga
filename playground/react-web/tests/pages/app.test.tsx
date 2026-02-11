import './mocks'
import { describe, it, expect } from 'vitest'

describe('App', () => {
  it('exports default component', async () => {
    const { default: App } = await import('../../src/App')
    expect(App).toBeTypeOf('function')
  })

  it('renders with router and routes', async () => {
    const { default: App } = await import('../../src/App')
    const element = App({})
    expect(element).toBeDefined()
  })
})
