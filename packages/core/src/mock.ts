import type { FieldDefinition } from "./fields"
import type { ComponentContract, FieldProxy, FormContract, ScopeRoute, ScopeValue, TableContract } from './types'
import type { EventContext } from './schema'
import { SchemaDefinition } from './schema'

const defaultProxy: FieldProxy = {
  width: 0,
  height: 0,
  hidden: false,
  disabled: false,
  state: '',
}

type MockFnFactory = (implementation?: (...args: any[]) => any) => (...args: any[]) => any

interface MockContextBuilder<F extends Record<string, FieldDefinition>> {
  state: EventContext<F>['state']
  schema: EventContext<F>['schema']
  component: ComponentContract
  form: FormContract
  table: TableContract
  scopes (routes: Record<ScopeValue, ScopeRoute>): MockContextBuilder<F>
  scope (value: ScopeValue): MockContextBuilder<F>
  values (overrides: Partial<EventContext<F>['state']>): MockContextBuilder<F>
}

function buildBaseContext<F extends Record<string, FieldDefinition>> (
  schema: SchemaDefinition<F>,
  values?: Partial<EventContext<F>['state']>,
): EventContext<F> {
  const fields = schema.getFields()

  const state = {} as EventContext<F>['state']
  for (const [key, config] of Object.entries(fields)) {
    (state as Record<string, unknown>)[key] = (values as Record<string, unknown>)?.[key] ?? config.defaultValue ?? undefined
  }

  const schemaProxy = {} as EventContext<F>['schema']
  for (const key of Object.keys(fields)) {
    (schemaProxy as Record<string, FieldProxy>)[key] = { ...defaultProxy }
  }

  return { state, schema: schemaProxy }
}

export function createMockContext<F extends Record<string, FieldDefinition>> (
  schema: SchemaDefinition<F>,
): EventContext<F>
export function createMockContext<F extends Record<string, FieldDefinition>> (
  schema: SchemaDefinition<F>,
  values: Partial<EventContext<F>['state']>,
): EventContext<F>
export function createMockContext<F extends Record<string, FieldDefinition>> (
  schema: SchemaDefinition<F>,
  fn: MockFnFactory,
): MockContextBuilder<F>
export function createMockContext<F extends Record<string, FieldDefinition>> (
  schema: SchemaDefinition<F>,
  fnOrValues?: MockFnFactory | Partial<EventContext<F>['state']>,
): EventContext<F> | MockContextBuilder<F> {
  if (typeof fnOrValues !== 'function') {
    return buildBaseContext(schema, fnOrValues)
  }

  const fn = fnOrValues
  const { state, schema: schemaProxy } = buildBaseContext(schema)

  const component: ComponentContract = {
    scope: 'index',
    scopes: {} as Record<ScopeValue, ScopeRoute>,
    reload: fn(),
    navigator: {
      push: fn(),
      back: fn(),
      replace: fn(),
    },
    dialog: {
      confirm: fn(async () => true),
      alert: fn(async () => undefined),
    },
    toast: {
      success: fn(),
      error: fn(),
      warning: fn(),
      info: fn(),
    },
    loading: {
      show: fn(),
      hide: fn(),
    },
  }

  const form: FormContract = {
    errors: {},
    dirty: false,
    valid: true,
    validate: fn(() => true),
    reset: fn(),
  }

  const table: TableContract = {
    page: 1,
    limit: 10,
    total: 0,
    filters: {},
    selected: [],
    reload: fn(),
    setPage: fn(),
    setFilters: fn(),
    clearSelection: fn(),
  }

  const context: MockContextBuilder<F> = {
    state,
    schema: schemaProxy,
    component,
    form,
    table,
    scopes (routes: Record<ScopeValue, ScopeRoute>) {
      component.scopes = routes
      return context
    },
    scope (value: ScopeValue) {
      component.scope = value
      return context
    },
    values (overrides: Partial<EventContext<F>['state']>) {
      Object.assign(state as Record<string, unknown>, overrides as Record<string, unknown>)
      return context
    },
  }

  return context
}
