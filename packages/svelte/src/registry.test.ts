import { describe, it, expect } from 'vitest'
import { registerRenderers, getRenderer, createRegistry } from './registry'
import type { FieldRenderer } from './types'

const FakeTextRenderer = (() => null) as unknown as FieldRenderer
const FakeNumberRenderer = (() => null) as unknown as FieldRenderer
const FakeSelectRenderer = (() => null) as unknown as FieldRenderer

describe('global registry', () => {
  it('registers renderer by component name', () => {
    registerRenderers({ 'svelte-test-text': FakeTextRenderer })
    expect(getRenderer('svelte-test-text')).toBe(FakeTextRenderer)
  })

  it('returns undefined for unregistered component', () => {
    expect(getRenderer('svelte-nonexistent')).toBeUndefined()
  })

  it('overwrites existing renderer', () => {
    registerRenderers({ 'svelte-overwrite': FakeTextRenderer })
    registerRenderers({ 'svelte-overwrite': FakeNumberRenderer })
    expect(getRenderer('svelte-overwrite')).toBe(FakeNumberRenderer)
  })
})

describe('createRegistry', () => {
  it('creates an independent registry', () => {
    const registry = createRegistry()
    expect(registry).toHaveProperty('register')
    expect(registry).toHaveProperty('get')
  })

  it('register adds renderers to scoped registry', () => {
    const registry = createRegistry()
    registry.register({ 'svelte-scoped-text': FakeTextRenderer })
    expect(registry.get('svelte-scoped-text')).toBe(FakeTextRenderer)
  })

  it('returns undefined for unregistered component', () => {
    const registry = createRegistry()
    expect(registry.get('nonexistent')).toBeUndefined()
  })

  it('scoped registry is independent from global', () => {
    registerRenderers({ 'svelte-global-only': FakeSelectRenderer })
    const registry = createRegistry()
    expect(registry.get('svelte-global-only')).toBeUndefined()

    registry.register({ 'svelte-scoped-only': FakeTextRenderer })
    expect(getRenderer('svelte-scoped-only')).toBeUndefined()
    expect(registry.get('svelte-scoped-only')).toBe(FakeTextRenderer)
  })
})
