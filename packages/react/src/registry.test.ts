import { describe, it, expect } from 'vitest'
import { registerRenderers, getRenderer, createRegistry } from './registry'
import type { FieldRenderer } from './types'

// Simple mock renderers — FieldRenderer is React.ComponentType<FieldRendererProps>,
// so we cast arrow functions returning null.
const FakeTextRenderer = (() => null) as unknown as FieldRenderer
const FakeNumberRenderer = (() => null) as unknown as FieldRenderer
const FakeSelectRenderer = (() => null) as unknown as FieldRenderer

describe('global registry', () => {
  describe('registerRenderers', () => {
    it('registers renderer by component name', () => {
      // Using unique names to avoid polluting other tests (global mutable state,
      // no unregister API available)
      registerRenderers({ 'test-text-global': FakeTextRenderer })
      expect(getRenderer('test-text-global')).toBe(FakeTextRenderer)
    })
  })

  describe('getRenderer', () => {
    it('returns registered renderer', () => {
      registerRenderers({ 'test-number-global': FakeNumberRenderer })
      expect(getRenderer('test-number-global')).toBe(FakeNumberRenderer)
    })

    it('returns undefined for unregistered component', () => {
      expect(getRenderer('nonexistent-component')).toBeUndefined()
    })

    it('overwrites existing renderer when re-registered', () => {
      registerRenderers({ 'test-overwrite': FakeTextRenderer })
      registerRenderers({ 'test-overwrite': FakeNumberRenderer })
      expect(getRenderer('test-overwrite')).toBe(FakeNumberRenderer)
    })
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
    registry.register({ 'scoped-text': FakeTextRenderer })
    expect(registry.get('scoped-text')).toBe(FakeTextRenderer)
  })

  it('get returns registered renderer from scoped registry', () => {
    const registry = createRegistry()
    registry.register({ 'scoped-number': FakeNumberRenderer })
    expect(registry.get('scoped-number')).toBe(FakeNumberRenderer)
  })

  it('get returns undefined for unregistered component', () => {
    const registry = createRegistry()
    expect(registry.get('nonexistent')).toBeUndefined()
  })

  it('scoped registry is independent from global registry', () => {
    // Register in global
    registerRenderers({ 'global-only-renderer': FakeSelectRenderer })

    // Create scoped — should not see global renderers
    const registry = createRegistry()
    expect(registry.get('global-only-renderer')).toBeUndefined()

    // Register in scoped — should not appear in global
    registry.register({ 'scoped-only-renderer': FakeTextRenderer })
    expect(getRenderer('scoped-only-renderer')).toBeUndefined()
    expect(registry.get('scoped-only-renderer')).toBe(FakeTextRenderer)
  })
})
