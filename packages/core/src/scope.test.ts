import { describe, it, expect } from 'vitest'
import { buildInitialState, isInScope } from './scope'
import { Scope } from './types'
import type { FieldConfig } from './types'

function stubField(overrides: Partial<FieldConfig> = {}): FieldConfig {
  return {
    component: 'text',
    dataType: 'string',
    attrs: {},
    form: { width: 100, height: 1, hidden: false, disabled: false, order: 1 },
    table: { show: false, width: 'auto', sortable: true, filterable: false, order: 1 },
    validations: [],
    scopes: null,
    states: [],
    defaultValue: undefined,
    ...overrides,
  }
}

describe('buildInitialState()', () => {
  it('uses defaultValue when no initialValues', () => {
    const fields = { name: stubField({ defaultValue: 'John' }) }
    const state = buildInitialState(fields)
    expect(state.name).toBe('John')
  })

  it('prefers initialValues over defaultValue', () => {
    const fields = { name: stubField({ defaultValue: 'John' }) }
    const state = buildInitialState(fields, { name: 'Jane' })
    expect(state.name).toBe('Jane')
  })

  it('falls back to undefined when neither exists', () => {
    const fields = { name: stubField() }
    const state = buildInitialState(fields)
    expect(state.name).toBeUndefined()
  })

  it('ignores initialValues keys that do not match fields', () => {
    const fields = { name: stubField() }
    const state = buildInitialState(fields, { name: 'Jane', extra: 'ignored' })
    expect(state).not.toHaveProperty('extra')
    expect(state.name).toBe('Jane')
  })
})

describe('isInScope()', () => {
  it('returns true when scopes is null', () => {
    expect(isInScope({ scopes: null }, Scope.add)).toBe(true)
  })

  it('returns true when scope is included', () => {
    expect(isInScope({ scopes: [Scope.add, Scope.edit] }, Scope.add)).toBe(true)
  })

  it('returns false when scope is not included', () => {
    expect(isInScope({ scopes: [Scope.add] }, Scope.edit)).toBe(false)
  })

  it('returns false for empty scopes array', () => {
    expect(isInScope({ scopes: [] }, Scope.add)).toBe(false)
  })
})
