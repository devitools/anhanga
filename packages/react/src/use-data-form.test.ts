// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useDataForm } from './use-data-form'
import type { SchemaProvide, FieldConfig, ComponentContract, ActionConfig } from '@ybyra/core'
import { Scope, Position } from '@ybyra/core'

function makeFieldConfig (overrides: Partial<FieldConfig> = {}): FieldConfig {
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

function makeActionConfig (overrides: Partial<ActionConfig> = {}): ActionConfig {
  return {
    variant: 'default',
    positions: [],
    align: 'end',
    hidden: false,
    open: true,
    scopes: null,
    order: 0,
    ...overrides,
  }
}

function makeSchema (overrides: Partial<SchemaProvide> = {}): SchemaProvide {
  return {
    domain: 'test',
    identity: 'id',
    scopes: Object.values(Scope),
    groups: {},
    fields: {
      name: makeFieldConfig(),
      age: makeFieldConfig({ component: 'number', dataType: 'number' }),
    },
    actions: {},
    ...overrides,
  }
}

function makeComponent (overrides: Partial<ComponentContract> = {}): ComponentContract {
  return {
    scope: Scope.add,
    scopes: {
      index: { path: '/test' },
      add: { path: '/test/add' },
      view: { path: '/test/:id' },
      edit: { path: '/test/:id/edit' },
    },
    reload: vi.fn(),
    navigator: { push: vi.fn(), back: vi.fn(), replace: vi.fn() },
    dialog: { confirm: vi.fn(), alert: vi.fn() },
    toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
    loading: { show: vi.fn(), hide: vi.fn() },
    ...overrides,
  }
}

describe('useDataForm', () => {
  describe('initial state', () => {
    it('initializes from field defaults', () => {
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ defaultValue: 'John' }) },
      })
      const { result } = renderHook(() => useDataForm({ schema, scope: Scope.add, component: makeComponent() }))
      expect(result.current.state.name).toBe('John')
    })

    it('initializes from initialValues over defaults', () => {
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ defaultValue: 'John' }) },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent(), initialValues: { name: 'Jane' } }),
      )
      expect(result.current.state.name).toBe('Jane')
    })

    it('loading is false when no bootstrap hook', () => {
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() }),
      )
      expect(result.current.loading).toBe(false)
    })

    it('loading is true when bootstrap hook exists for scope', () => {
      const hooks = { bootstrap: { [Scope.add]: vi.fn(async () => {}) } }
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), hooks }),
      )
      // Initially true, becomes false after effect runs
      expect(result.current.loading).toBe(true)
    })
  })

  describe('scoped fields', () => {
    it('returns only fields matching scope', () => {
      const schema = makeSchema({
        fields: {
          name: makeFieldConfig(),
          secret: makeFieldConfig({ scopes: [Scope.edit] }),
        },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent() }),
      )
      expect(result.current.fields.map((f) => f.name)).toEqual(['name'])
    })

    it('returns all fields when scopes is null', () => {
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() }),
      )
      expect(result.current.fields).toHaveLength(2)
    })

    it('sorts fields by form.order', () => {
      const schema = makeSchema({
        fields: {
          age: makeFieldConfig({ form: { width: 100, height: 1, hidden: false, disabled: false, order: 2 } }),
          name: makeFieldConfig({ form: { width: 100, height: 1, hidden: false, disabled: false, order: 1 } }),
        },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent() }),
      )
      expect(result.current.fields.map((f) => f.name)).toEqual(['name', 'age'])
    })
  })

  describe('getProxy', () => {
    it('returns field proxy with config defaults', () => {
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() }),
      )
      const props = result.current.getFieldProps('name')
      expect(props.proxy).toEqual({ width: 100, height: 1, hidden: false, disabled: false, state: '' })
    })

    it('returns default proxy for unknown field', () => {
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() }),
      )
      const props = result.current.getFieldProps('nonexistent')
      expect(props.proxy).toEqual({ width: 100, height: 1, hidden: false, disabled: false, state: '' })
    })
  })

  describe('groups', () => {
    it('groups fields by group property', () => {
      const schema = makeSchema({
        fields: {
          name: makeFieldConfig({ group: 'info' }),
          email: makeFieldConfig({ group: 'info' }),
          notes: makeFieldConfig(),
        },
        groups: { info: {} },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent() }),
      )
      expect(result.current.groups).toHaveLength(1)
      expect(result.current.groups[0].name).toBe('info')
      expect(result.current.groups[0].fields).toHaveLength(2)
    })

    it('ungrouped returns fields without group', () => {
      const schema = makeSchema({
        fields: {
          name: makeFieldConfig({ group: 'info' }),
          notes: makeFieldConfig(),
        },
        groups: { info: {} },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent() }),
      )
      expect(result.current.ungrouped.map((f) => f.name)).toEqual(['notes'])
    })
  })

  describe('sections', () => {
    it('produces ungrouped and group sections interleaved', () => {
      const schema = makeSchema({
        fields: {
          title: makeFieldConfig({ form: { width: 100, height: 1, hidden: false, disabled: false, order: 1 } }),
          name: makeFieldConfig({ group: 'info', form: { width: 100, height: 1, hidden: false, disabled: false, order: 2 } }),
          email: makeFieldConfig({ group: 'info', form: { width: 100, height: 1, hidden: false, disabled: false, order: 3 } }),
          notes: makeFieldConfig({ form: { width: 100, height: 1, hidden: false, disabled: false, order: 4 } }),
        },
        groups: { info: {} },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent() }),
      )
      expect(result.current.sections).toHaveLength(3)
      expect(result.current.sections[0].kind).toBe('ungrouped')
      expect(result.current.sections[1].kind).toBe('group')
      expect(result.current.sections[2].kind).toBe('ungrouped')
    })

    it('emits group only once for non-contiguous fields', () => {
      const schema = makeSchema({
        fields: {
          name: makeFieldConfig({ group: 'info', form: { width: 100, height: 1, hidden: false, disabled: false, order: 1 } }),
          notes: makeFieldConfig({ form: { width: 100, height: 1, hidden: false, disabled: false, order: 2 } }),
          email: makeFieldConfig({ group: 'info', form: { width: 100, height: 1, hidden: false, disabled: false, order: 3 } }),
        },
        groups: { info: {} },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent() }),
      )
      const groupSections = result.current.sections.filter((s) => s.kind === 'group')
      expect(groupSections).toHaveLength(1)
    })
  })

  describe('setValue and validation', () => {
    it('updates state for a field', () => {
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() }),
      )
      act(() => result.current.setValue('name', 'Alice'))
      expect(result.current.state.name).toBe('Alice')
    })

    it('validates on change and sets errors', () => {
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ validations: [{ rule: 'required' }] }) },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent() }),
      )
      act(() => result.current.setValue('name', ''))
      expect(result.current.errors.name).toHaveLength(1)
    })

    it('clears errors when field becomes valid', () => {
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ validations: [{ rule: 'required' }] }) },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent() }),
      )
      act(() => result.current.setValue('name', ''))
      expect(result.current.errors.name).toBeDefined()
      act(() => result.current.setValue('name', 'Alice'))
      expect(result.current.errors.name).toBeUndefined()
    })
  })

  describe('setValues', () => {
    it('merges multiple values', () => {
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() }),
      )
      act(() => result.current.setValues({ name: 'Alice', age: 30 }))
      expect(result.current.state.name).toBe('Alice')
      expect(result.current.state.age).toBe(30)
    })
  })

  describe('reset', () => {
    it('resets state to initial values', () => {
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ defaultValue: 'John' }) },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent() }),
      )
      act(() => result.current.setValue('name', 'Alice'))
      act(() => result.current.reset())
      expect(result.current.state.name).toBe('John')
    })

    it('resets to provided values', () => {
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() }),
      )
      act(() => result.current.reset({ name: 'Custom' }))
      expect(result.current.state.name).toBe('Custom')
    })

    it('clears errors', () => {
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ validations: [{ rule: 'required' }] }) },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent() }),
      )
      act(() => result.current.setValue('name', ''))
      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0)
      act(() => result.current.reset())
      expect(result.current.errors).toEqual({})
    })
  })

  describe('validate', () => {
    it('returns true when all fields pass', () => {
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ validations: [{ rule: 'required' }] }) },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent(), initialValues: { name: 'Alice' } }),
      )
      let valid: boolean
      act(() => { valid = result.current.validate() })
      expect(valid!).toBe(true)
      expect(result.current.errors).toEqual({})
    })

    it('returns false and sets errors when fields fail', () => {
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ validations: [{ rule: 'required' }] }) },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent() }),
      )
      let valid: boolean
      act(() => { valid = result.current.validate() })
      expect(valid!).toBe(false)
      expect(result.current.errors.name).toHaveLength(1)
    })
  })

  describe('dirty', () => {
    it('is false when state matches initial', () => {
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() }),
      )
      expect(result.current.dirty).toBe(false)
    })

    it('is true when state differs', () => {
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() }),
      )
      act(() => result.current.setValue('name', 'changed'))
      expect(result.current.dirty).toBe(true)
    })
  })

  describe('valid', () => {
    it('is true when no errors', () => {
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() }),
      )
      expect(result.current.valid).toBe(true)
    })

    it('is false when errors exist', () => {
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ validations: [{ rule: 'required' }] }) },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent() }),
      )
      act(() => result.current.setValue('name', ''))
      expect(result.current.valid).toBe(false)
    })
  })

  describe('actions', () => {
    it('resolves visible in-scope actions', () => {
      const schema = makeSchema({
        actions: { save: makeActionConfig({ variant: 'primary' }) },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent() }),
      )
      expect(result.current.actions).toHaveLength(1)
      expect(result.current.actions[0].name).toBe('save')
    })

    it('filters hidden actions', () => {
      const schema = makeSchema({
        actions: { save: makeActionConfig({ hidden: true }) },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent() }),
      )
      expect(result.current.actions).toHaveLength(0)
    })

    it('filters out-of-scope actions', () => {
      const schema = makeSchema({
        actions: { save: makeActionConfig({ scopes: [Scope.edit] }) },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent() }),
      )
      expect(result.current.actions).toHaveLength(0)
    })

    it('filters by permissions', () => {
      const schema = makeSchema({
        actions: { save: makeActionConfig({ open: false }) },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent(), permissions: ['test.action.other'] }),
      )
      expect(result.current.actions).toHaveLength(0)
    })

    it('sorts by order', () => {
      const schema = makeSchema({
        actions: {
          cancel: makeActionConfig({ order: 2 }),
          save: makeActionConfig({ order: 1 }),
        },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent() }),
      )
      expect(result.current.actions.map((a) => a.name)).toEqual(['save', 'cancel'])
    })

    it('execute calls handler', async () => {
      const handler = vi.fn()
      const schema = makeSchema({
        actions: { save: makeActionConfig() },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent(), handlers: { save: handler } }),
      )
      await act(async () => { await result.current.actions[0].execute() })
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('execute does nothing when no handler', async () => {
      const schema = makeSchema({
        actions: { save: makeActionConfig() },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent() }),
      )
      await act(async () => { await result.current.actions[0].execute() })
      // No error thrown
    })
  })

  describe('getFieldProps', () => {
    it('returns complete FieldRendererProps', () => {
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() }),
      )
      const props = result.current.getFieldProps('name')
      expect(props.domain).toBe('test')
      expect(props.name).toBe('name')
      expect(props.scope).toBe(Scope.add)
      expect(props.errors).toEqual([])
      expect(typeof props.onChange).toBe('function')
      expect(typeof props.onBlur).toBe('function')
      expect(typeof props.onFocus).toBe('function')
    })

    it('onChange calls setValue', () => {
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() }),
      )
      const props = result.current.getFieldProps('name')
      act(() => props.onChange('Alice'))
      expect(result.current.state.name).toBe('Alice')
    })
  })

  describe('fireEvent', () => {
    it('calls event handler and applies state changes', () => {
      const events = {
        name: {
          change: ({ state }: any) => { state.age = 25 },
        },
      }
      const schema = makeSchema()
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent(), events }),
      )
      act(() => result.current.setValue('name', 'Alice'))
      expect(result.current.state.age).toBe(25)
    })

    it('applies schema overrides from event handler', () => {
      const events = {
        name: {
          change: ({ schema }: any) => { schema.age.hidden = true },
        },
      }
      const schema = makeSchema()
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent(), events }),
      )
      act(() => result.current.setValue('name', 'Alice'))
      const ageProps = result.current.getFieldProps('age')
      expect(ageProps.proxy.hidden).toBe(true)
    })

    it('onBlur fires blur event', () => {
      const blurHandler = vi.fn()
      const events = { name: { blur: blurHandler } }
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), events }),
      )
      act(() => result.current.getFieldProps('name').onBlur())
      expect(blurHandler).toHaveBeenCalledTimes(1)
    })

    it('onFocus fires focus event', () => {
      const focusHandler = vi.fn()
      const events = { name: { focus: focusHandler } }
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), events }),
      )
      act(() => result.current.getFieldProps('name').onFocus())
      expect(focusHandler).toHaveBeenCalledTimes(1)
    })
  })

  describe('permitted', () => {
    it('is false when permissions undefined', () => {
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() }),
      )
      expect(result.current.permitted).toBe(false)
    })

    it('is true when scope permission exists', () => {
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), permissions: ['test.scope.add'] }),
      )
      expect(result.current.permitted).toBe(true)
    })

    it('is false when scope permission is missing', () => {
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), permissions: ['test.scope.edit'] }),
      )
      expect(result.current.permitted).toBe(false)
    })
  })

  describe('bootstrap', () => {
    it('calls hook and sets loading to false', async () => {
      const hook = vi.fn(async () => {})
      const hooks = { bootstrap: { [Scope.add]: hook } }
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), hooks }),
      )
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(hook).toHaveBeenCalledTimes(1)
    })

    it('hydrates state from hook', async () => {
      const hook = vi.fn(async ({ hydrate }: any) => {
        hydrate({ name: 'Hydrated' })
      })
      const hooks = { bootstrap: { [Scope.add]: hook } }
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), hooks }),
      )
      await waitFor(() => expect(result.current.state.name).toBe('Hydrated'))
    })

    it('applies schema overrides from bootstrap', async () => {
      const hook = vi.fn(async ({ schema }: any) => {
        schema.name.hidden = true
      })
      const hooks = { bootstrap: { [Scope.add]: hook } }
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), hooks }),
      )
      await waitFor(() => {
        const props = result.current.getFieldProps('name')
        expect(props.proxy.hidden).toBe(true)
      })
    })

    it('fires change events after hydration', async () => {
      const events = {
        name: {
          change: ({ state }: any) => { state.age = 99 },
        },
      }
      const hook = vi.fn(async ({ hydrate }: any) => {
        hydrate({ name: 'Test' })
      })
      const hooks = { bootstrap: { [Scope.add]: hook } }
      const { result } = renderHook(() =>
        useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), hooks, events }),
      )
      await waitFor(() => expect(result.current.state.age).toBe(99))
    })
  })

  describe('translate', () => {
    it('uses translate for validation messages', () => {
      const t = vi.fn((key: string) => `translated:${key}`)
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ validations: [{ rule: 'required' }] }) },
      })
      const { result } = renderHook(() =>
        useDataForm({ schema, scope: Scope.add, component: makeComponent(), translate: t }),
      )
      act(() => result.current.setValue('name', ''))
      expect(result.current.errors.name[0]).toBe('translated:validation.required')
    })
  })
})
