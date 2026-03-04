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
    const { proxy } = createStateProxy({ name: 'Alice', age: 30 })
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

  it('does not mutate the original snapshot', () => {
    const snapshot = { name: 'Alice', age: 30 }
    const { proxy } = createStateProxy(snapshot)
    proxy.name = 'Bob'
    proxy.age = 99
    expect(snapshot.name).toBe('Alice')
    expect(snapshot.age).toBe(30)
  })

  it('multiple sets keeps latest value', () => {
    const { proxy, getChanges } = createStateProxy({ name: 'Alice' })
    proxy.name = 'Bob'
    proxy.name = 'Charlie'
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
    const { proxy } = createSchemaProxy(fields, { name: { hidden: true, width: 75 } })
    expect(proxy.name.hidden).toBe(true)
    expect(proxy.name.width).toBe(75)
    expect(proxy.name.height).toBe(2)
  })

  it('tracks field property mutations', () => {
    const fields = { name: makeFieldConfig() }
    const { proxy, getOverrides } = createSchemaProxy(fields, {})
    proxy.name.hidden = true
    expect(getOverrides()).toEqual({ name: { hidden: true } })
  })

  it('getOverrides returns only modified fields', () => {
    const fields = { name: makeFieldConfig(), age: makeFieldConfig() }
    const { proxy, getOverrides } = createSchemaProxy(fields, {})
    proxy.name.hidden = true
    expect(getOverrides()).toHaveProperty('name')
    expect(getOverrides()).not.toHaveProperty('age')
  })

  it('getOverrides returns empty when nothing changed', () => {
    const fields = { name: makeFieldConfig() }
    const { getOverrides } = createSchemaProxy(fields, {})
    expect(getOverrides()).toEqual({})
  })

  it('setting width appears in overrides', () => {
    const fields = { name: makeFieldConfig() }
    const { proxy, getOverrides } = createSchemaProxy(fields, {})
    proxy.name.width = 200
    expect(getOverrides().name?.width).toBe(200)
  })

  it('setting disabled appears in overrides', () => {
    const fields = { name: makeFieldConfig() }
    const { proxy, getOverrides } = createSchemaProxy(fields, {})
    proxy.name.disabled = true
    expect(getOverrides().name?.disabled).toBe(true)
  })

  it('setting state appears in overrides', () => {
    const fields = { name: makeFieldConfig() }
    const { proxy, getOverrides } = createSchemaProxy(fields, {})
    proxy.name.state = 'editing'
    expect(getOverrides().name?.state).toBe('editing')
  })

  it('multiple fields can be overridden independently', () => {
    const fields = { name: makeFieldConfig(), age: makeFieldConfig() }
    const { proxy, getOverrides } = createSchemaProxy(fields, {})
    proxy.name.hidden = true
    proxy.age.disabled = true
    expect(getOverrides().name).toEqual({ hidden: true })
    expect(getOverrides().age).toEqual({ disabled: true })
  })
})
