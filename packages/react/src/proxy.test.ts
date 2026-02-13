import { describe, it, expect } from 'vitest'
import { createStateProxy, createSchemaProxy } from './proxy'
import type { FieldConfig } from '@ybyra/core'

function makeFieldConfig(overrides: Partial<FieldConfig> = {}): FieldConfig {
  return {
    component: 'text',
    dataType: 'string',
    attrs: {},
    form: { width: 100, height: 1, hidden: false, disabled: false, order: 0 },
    table: { show: false, width: 'auto', sortable: false, filterable: false, order: 0 },
    validations: [],
    scopes: null,
    states: [],
    defaultValue: undefined,
    ...overrides,
  }
}

describe('createStateProxy', () => {
  it('reads existing values from snapshot', () => {
    const snapshot = { name: 'Alice', age: 30 }
    const { proxy } = createStateProxy(snapshot)
    expect(proxy.name).toBe('Alice')
    expect(proxy.age).toBe(30)
  })

  it('tracks mutations via set', () => {
    const { proxy, getChanges } = createStateProxy({ name: 'Alice' })
    proxy.name = 'Bob'
    expect(proxy.name).toBe('Bob')
    expect(getChanges()).toEqual({ name: 'Bob' })
  })

  it('getChanges returns only modified fields', () => {
    const { proxy, getChanges } = createStateProxy({ name: 'Alice', age: 30 })
    proxy.name = 'Bob'
    const changes = getChanges()
    expect(changes).toEqual({ name: 'Bob' })
    expect(changes).not.toHaveProperty('age')
  })

  it('getChanges returns empty object when nothing changed', () => {
    const { getChanges } = createStateProxy({ name: 'Alice' })
    expect(getChanges()).toEqual({})
  })

  it('does not mutate the original snapshot object', () => {
    const snapshot = { name: 'Alice', age: 30 }
    const { proxy } = createStateProxy(snapshot)
    proxy.name = 'Bob'
    proxy.age = 99
    expect(snapshot.name).toBe('Alice')
    expect(snapshot.age).toBe(30)
  })

  it('multiple sets to same key keeps latest value', () => {
    const { proxy, getChanges } = createStateProxy({ name: 'Alice' })
    proxy.name = 'Bob'
    proxy.name = 'Charlie'
    expect(proxy.name).toBe('Charlie')
    expect(getChanges()).toEqual({ name: 'Charlie' })
  })

  it('handles setting value to undefined', () => {
    const { proxy, getChanges } = createStateProxy({ name: 'Alice' })
    proxy.name = undefined
    expect(proxy.name).toBeUndefined()
    expect(getChanges()).toEqual({ name: undefined })
  })

  it('handles setting value to null', () => {
    const { proxy, getChanges } = createStateProxy({ name: 'Alice' })
    proxy.name = null
    expect(proxy.name).toBeNull()
    expect(getChanges()).toEqual({ name: null })
  })
})

// Known issue: structuredClone does not reliably clone RegExp objects inside
// ValidationRule params. If createSchemaProxy is used with structuredClone
// upstream (e.g., via toConfig()), RegExp-based pattern validations may throw.
// This is an upstream concern in @ybyra/core, not a proxy behavior issue — see
// TextFieldDefinition.pattern() which stores a raw RegExp in validation params.

describe('createSchemaProxy', () => {
  it('provides field proxies with defaults from config', () => {
    const fields = {
      name: makeFieldConfig({
        form: { width: 50, height: 2, hidden: false, disabled: false, order: 0 },
      }),
    }
    const { proxy } = createSchemaProxy(fields, {})
    expect(proxy.name.width).toBe(50)
    expect(proxy.name.height).toBe(2)
    expect(proxy.name.hidden).toBe(false)
    expect(proxy.name.disabled).toBe(false)
    expect(proxy.name.state).toBe('')
  })

  it('merges currentOverrides into field defaults', () => {
    const fields = {
      name: makeFieldConfig({
        form: { width: 50, height: 2, hidden: false, disabled: false, order: 0 },
      }),
    }
    const overrides = { name: { hidden: true, width: 75 } }
    const { proxy } = createSchemaProxy(fields, overrides)
    expect(proxy.name.hidden).toBe(true)
    expect(proxy.name.width).toBe(75)
    // Non-overridden properties keep config defaults
    expect(proxy.name.height).toBe(2)
    expect(proxy.name.disabled).toBe(false)
  })

  it('tracks field property mutations', () => {
    const fields = { name: makeFieldConfig() }
    const { proxy, getOverrides } = createSchemaProxy(fields, {})
    proxy.name.hidden = true
    expect(getOverrides()).toEqual({ name: { hidden: true } })
  })

  it('getOverrides returns only modified fields', () => {
    const fields = {
      name: makeFieldConfig(),
      age: makeFieldConfig(),
    }
    const { proxy, getOverrides } = createSchemaProxy(fields, {})
    proxy.name.hidden = true
    const overrides = getOverrides()
    expect(overrides).toHaveProperty('name')
    expect(overrides).not.toHaveProperty('age')
  })

  it('getOverrides returns empty object when nothing changed', () => {
    const fields = { name: makeFieldConfig() }
    const { getOverrides } = createSchemaProxy(fields, {})
    expect(getOverrides()).toEqual({})
  })

  it('setting hidden on a field appears in overrides', () => {
    const fields = { name: makeFieldConfig() }
    const { proxy, getOverrides } = createSchemaProxy(fields, {})
    proxy.name.hidden = true
    expect(getOverrides().name?.hidden).toBe(true)
  })

  it('setting width on a field appears in overrides', () => {
    const fields = { name: makeFieldConfig() }
    const { proxy, getOverrides } = createSchemaProxy(fields, {})
    proxy.name.width = 200
    expect(getOverrides().name?.width).toBe(200)
  })

  it('setting disabled on a field appears in overrides', () => {
    const fields = { name: makeFieldConfig() }
    const { proxy, getOverrides } = createSchemaProxy(fields, {})
    proxy.name.disabled = true
    expect(getOverrides().name?.disabled).toBe(true)
  })

  it('setting state on a field appears in overrides', () => {
    const fields = { name: makeFieldConfig() }
    const { proxy, getOverrides } = createSchemaProxy(fields, {})
    proxy.name.state = 'editing'
    expect(getOverrides().name?.state).toBe('editing')
  })

  it('multiple fields can be overridden independently', () => {
    const fields = {
      name: makeFieldConfig(),
      age: makeFieldConfig(),
    }
    const { proxy, getOverrides } = createSchemaProxy(fields, {})
    proxy.name.hidden = true
    proxy.age.disabled = true
    const overrides = getOverrides()
    expect(overrides.name).toEqual({ hidden: true })
    expect(overrides.age).toEqual({ disabled: true })
  })
})
