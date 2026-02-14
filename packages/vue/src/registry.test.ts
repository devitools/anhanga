import { describe, it, expect } from 'vitest'
import { registerRenderers, getRenderer, createRegistry } from './registry'
import type { FieldRenderer } from './types'

const FakeTextRenderer = (() => null) as unknown as FieldRenderer
const FakeNumberRenderer = (() => null) as unknown as FieldRenderer
const FakeSelectRenderer = (() => null) as unknown as FieldRenderer

describe('global registry', () => {
  it('registers renderer by component name', () => {
    registerRenderers({ 'vue-test-text': FakeTextRenderer })
    expect(getRenderer('vue-test-text')).toBe(FakeTextRenderer)
  })

  it('returns undefined for unregistered component', () => {
    expect(getRenderer('vue-nonexistent')).toBeUndefined()
  })

  it('overwrites existing renderer', () => {
    registerRenderers({ 'vue-overwrite': FakeTextRenderer })
    registerRenderers({ 'vue-overwrite': FakeNumberRenderer })
    expect(getRenderer('vue-overwrite')).toBe(FakeNumberRenderer)
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
    registry.register({ 'vue-scoped-text': FakeTextRenderer })
    expect(registry.get('vue-scoped-text')).toBe(FakeTextRenderer)
  })

  it('returns undefined for unregistered component', () => {
    const registry = createRegistry()
    expect(registry.get('nonexistent')).toBeUndefined()
  })

  it('scoped registry is independent from global', () => {
    registerRenderers({ 'vue-global-only': FakeSelectRenderer })
    const registry = createRegistry()
    expect(registry.get('vue-global-only')).toBeUndefined()

    registry.register({ 'vue-scoped-only': FakeTextRenderer })
    expect(getRenderer('vue-scoped-only')).toBeUndefined()
    expect(registry.get('vue-scoped-only')).toBe(FakeTextRenderer)
  })
})
