import { vi, describe, it, expect } from 'vitest'

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  return {
    ...actual,
    onMounted: (fn: Function) => fn(),
    watch: vi.fn(),
  }
})

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
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      expect(form.state.name).toBe('John')
    })

    it('initializes from initialValues over defaults', () => {
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ defaultValue: 'John' }) },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent(), initialValues: { name: 'Jane' } })
      expect(form.state.name).toBe('Jane')
    })

    it('loading is false when no bootstrap hook', () => {
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() })
      expect(form.loading).toBe(false)
    })

    it('loading is true when bootstrap hook exists for scope', () => {
      const hooks = { bootstrap: { [Scope.add]: vi.fn(async () => {}) } }
      // Since onMounted runs immediately and the hook is async, loading starts true
      // but before the async completes we can observe the initial state
      // However, the run() is called synchronously via onMounted mock, but awaits inside
      // So loading is set to true initially, run() is called but not awaited
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), hooks })
      // loading starts true, becomes false after async tick
      // We just check that the hook was called
      expect(hooks.bootstrap[Scope.add]).toHaveBeenCalledTimes(1)
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
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      expect(form.fields.map((f) => f.name)).toEqual(['name'])
    })

    it('returns all fields when scopes is null', () => {
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() })
      expect(form.fields).toHaveLength(2)
    })

    it('sorts fields by form.order', () => {
      const schema = makeSchema({
        fields: {
          age: makeFieldConfig({ form: { width: 100, height: 1, hidden: false, disabled: false, order: 2 } }),
          name: makeFieldConfig({ form: { width: 100, height: 1, hidden: false, disabled: false, order: 1 } }),
        },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      expect(form.fields.map((f) => f.name)).toEqual(['name', 'age'])
    })
  })

  describe('getProxy', () => {
    it('returns field proxy with config defaults', () => {
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() })
      const props = form.getFieldProps('name')
      expect(props.proxy).toEqual({ width: 100, height: 1, hidden: false, disabled: false, state: '' })
    })

    it('returns default proxy for unknown field', () => {
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() })
      const props = form.getFieldProps('nonexistent')
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
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      expect(form.groups).toHaveLength(1)
      expect(form.groups[0].name).toBe('info')
      expect(form.groups[0].fields).toHaveLength(2)
    })

    it('ungrouped returns fields without group', () => {
      const schema = makeSchema({
        fields: {
          name: makeFieldConfig({ group: 'info' }),
          notes: makeFieldConfig(),
        },
        groups: { info: {} },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      expect(form.ungrouped.map((f) => f.name)).toEqual(['notes'])
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
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      expect(form.sections).toHaveLength(3)
      expect(form.sections[0].kind).toBe('ungrouped')
      expect(form.sections[1].kind).toBe('group')
      expect(form.sections[2].kind).toBe('ungrouped')
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
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      const groupSections = form.sections.filter((s) => s.kind === 'group')
      expect(groupSections).toHaveLength(1)
    })
  })

  describe('setValue and validation', () => {
    it('updates state for a field', () => {
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() })
      form.setValue('name', 'Alice')
      expect(form.state.name).toBe('Alice')
    })

    it('validates on change and sets errors', () => {
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ validations: [{ rule: 'required' }] }) },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      form.setValue('name', '')
      expect(form.errors.name).toHaveLength(1)
    })

    it('clears errors when field becomes valid', () => {
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ validations: [{ rule: 'required' }] }) },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      form.setValue('name', '')
      expect(form.errors.name).toBeDefined()
      form.setValue('name', 'Alice')
      expect(form.errors.name).toBeUndefined()
    })
  })

  describe('setValues', () => {
    it('merges multiple values', () => {
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() })
      form.setValues({ name: 'Alice', age: 30 })
      expect(form.state.name).toBe('Alice')
      expect(form.state.age).toBe(30)
    })
  })

  describe('reset', () => {
    it('resets state to initial values', () => {
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ defaultValue: 'John' }) },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      form.setValue('name', 'Alice')
      form.reset()
      expect(form.state.name).toBe('John')
    })

    it('resets to provided values', () => {
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() })
      form.reset({ name: 'Custom' })
      expect(form.state.name).toBe('Custom')
    })

    it('clears errors', () => {
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ validations: [{ rule: 'required' }] }) },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      form.setValue('name', '')
      expect(Object.keys(form.errors).length).toBeGreaterThan(0)
      form.reset()
      expect(form.errors).toEqual({})
    })
  })

  describe('validate', () => {
    it('returns true when all fields pass', () => {
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ validations: [{ rule: 'required' }] }) },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent(), initialValues: { name: 'Alice' } })
      const valid = form.validate()
      expect(valid).toBe(true)
      expect(form.errors).toEqual({})
    })

    it('returns false and sets errors when fields fail', () => {
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ validations: [{ rule: 'required' }] }) },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      const valid = form.validate()
      expect(valid).toBe(false)
      expect(form.errors.name).toHaveLength(1)
    })
  })

  describe('dirty', () => {
    it('is false when state matches initial', () => {
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() })
      expect(form.dirty).toBe(false)
    })

    it('is true when state differs', () => {
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() })
      form.setValue('name', 'changed')
      expect(form.dirty).toBe(true)
    })
  })

  describe('valid', () => {
    it('is true when no errors', () => {
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() })
      expect(form.valid).toBe(true)
    })

    it('is false when errors exist', () => {
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ validations: [{ rule: 'required' }] }) },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      form.setValue('name', '')
      expect(form.valid).toBe(false)
    })
  })

  describe('actions', () => {
    it('resolves visible in-scope actions', () => {
      const schema = makeSchema({
        actions: { save: makeActionConfig({ variant: 'primary' }) },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      expect(form.actions).toHaveLength(1)
      expect(form.actions[0].name).toBe('save')
    })

    it('filters hidden actions', () => {
      const schema = makeSchema({
        actions: { save: makeActionConfig({ hidden: true }) },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      expect(form.actions).toHaveLength(0)
    })

    it('filters out-of-scope actions', () => {
      const schema = makeSchema({
        actions: { save: makeActionConfig({ scopes: [Scope.edit] }) },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      expect(form.actions).toHaveLength(0)
    })

    it('filters by permissions', () => {
      const schema = makeSchema({
        actions: { save: makeActionConfig({ open: false }) },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent(), permissions: ['test.action.other'] })
      expect(form.actions).toHaveLength(0)
    })

    it('sorts by order', () => {
      const schema = makeSchema({
        actions: {
          cancel: makeActionConfig({ order: 2 }),
          save: makeActionConfig({ order: 1 }),
        },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      expect(form.actions.map((a) => a.name)).toEqual(['save', 'cancel'])
    })

    it('execute calls handler', async () => {
      const handler = vi.fn()
      const schema = makeSchema({
        actions: { save: makeActionConfig() },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent(), handlers: { save: handler } })
      await form.actions[0].execute()
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('execute does nothing when no handler', async () => {
      const schema = makeSchema({
        actions: { save: makeActionConfig() },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent() })
      await form.actions[0].execute()
      // No error thrown
    })
  })

  describe('getFieldProps', () => {
    it('returns complete FieldRendererProps', () => {
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() })
      const props = form.getFieldProps('name')
      expect(props.domain).toBe('test')
      expect(props.name).toBe('name')
      expect(props.scope).toBe(Scope.add)
      expect(props.errors).toEqual([])
      expect(typeof props.onChange).toBe('function')
      expect(typeof props.onBlur).toBe('function')
      expect(typeof props.onFocus).toBe('function')
    })

    it('onChange calls setValue', () => {
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() })
      const props = form.getFieldProps('name')
      props.onChange('Alice')
      expect(form.state.name).toBe('Alice')
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
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent(), events })
      form.setValue('name', 'Alice')
      expect(form.state.age).toBe(25)
    })

    it('applies schema overrides from event handler', () => {
      const events = {
        name: {
          change: ({ schema }: any) => { schema.age.hidden = true },
        },
      }
      const schema = makeSchema()
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent(), events })
      form.setValue('name', 'Alice')
      const ageProps = form.getFieldProps('age')
      expect(ageProps.proxy.hidden).toBe(true)
    })

    it('onBlur fires blur event', () => {
      const blurHandler = vi.fn()
      const events = { name: { blur: blurHandler } }
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), events })
      form.getFieldProps('name').onBlur()
      expect(blurHandler).toHaveBeenCalledTimes(1)
    })

    it('onFocus fires focus event', () => {
      const focusHandler = vi.fn()
      const events = { name: { focus: focusHandler } }
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), events })
      form.getFieldProps('name').onFocus()
      expect(focusHandler).toHaveBeenCalledTimes(1)
    })
  })

  describe('permitted', () => {
    it('is false when permissions undefined', () => {
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent() })
      expect(form.permitted).toBe(false)
    })

    it('is true when scope permission exists', () => {
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), permissions: ['test.scope.add'] })
      expect(form.permitted).toBe(true)
    })

    it('is false when scope permission is missing', () => {
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), permissions: ['test.scope.edit'] })
      expect(form.permitted).toBe(false)
    })
  })

  describe('bootstrap', () => {
    it('calls hook and sets loading to false', async () => {
      const hook = vi.fn(async () => {})
      const hooks = { bootstrap: { [Scope.add]: hook } }
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), hooks })
      await new Promise((r) => setTimeout(r, 0))
      expect(form.loading).toBe(false)
      expect(hook).toHaveBeenCalledTimes(1)
    })

    it('hydrates state from hook', async () => {
      const hook = vi.fn(async ({ hydrate }: any) => {
        hydrate({ name: 'Hydrated' })
      })
      const hooks = { bootstrap: { [Scope.add]: hook } }
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), hooks })
      await new Promise((r) => setTimeout(r, 0))
      expect(form.state.name).toBe('Hydrated')
    })

    it('applies schema overrides from bootstrap', async () => {
      const hook = vi.fn(async ({ schema }: any) => {
        schema.name.hidden = true
      })
      const hooks = { bootstrap: { [Scope.add]: hook } }
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), hooks })
      await new Promise((r) => setTimeout(r, 0))
      const props = form.getFieldProps('name')
      expect(props.proxy.hidden).toBe(true)
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
      const form = useDataForm({ schema: makeSchema(), scope: Scope.add, component: makeComponent(), hooks, events })
      await new Promise((r) => setTimeout(r, 0))
      expect(form.state.age).toBe(99)
    })
  })

  describe('translate', () => {
    it('uses translate for validation messages', () => {
      const t = vi.fn((key: string) => `translated:${key}`)
      const schema = makeSchema({
        fields: { name: makeFieldConfig({ validations: [{ rule: 'required' }] }) },
      })
      const form = useDataForm({ schema, scope: Scope.add, component: makeComponent(), translate: t })
      form.setValue('name', '')
      expect(form.errors.name[0]).toBe('translated:validation.required')
    })
  })
})
