import { describe, it, expect, vi } from 'vitest'
import { get } from 'svelte/store'
import { useDataTable } from './use-data-table'
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
      name: makeFieldConfig({ table: { show: true, width: 'auto', sortable: true, filterable: false, order: 1 } }),
      age: makeFieldConfig({ component: 'number', dataType: 'number', table: { show: false, width: 'auto', sortable: true, filterable: false, order: 2 } }),
    },
    actions: {},
    ...overrides,
  }
}

function makeComponent (): ComponentContract {
  return {
    scope: Scope.index,
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
  }
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('useDataTable', () => {
  describe('initial state', () => {
    it('starts with empty rows', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(get(store).rows).toEqual([])
    })

    it('uses pageSize as limit', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent(), pageSize: 25 })
      expect(get(store).limit).toBe(25)
    })

    it('defaults to page 1', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(get(store).page).toBe(1)
    })

    it('empty is true when not loading and no rows', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(get(store).empty).toBe(true)
    })

    it('totalPages defaults to 1', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(get(store).totalPages).toBe(1)
    })
  })

  describe('getIdentity', () => {
    it('returns single field value as string', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(store.getIdentity({ id: 42 })).toBe('42')
    })

    it('joins array identity fields with colon', () => {
      const schema = makeSchema({ identity: ['org', 'id'] })
      const store = useDataTable({ schema, scope: Scope.index, component: makeComponent() })
      expect(store.getIdentity({ org: 'acme', id: 1 })).toBe('acme:1')
    })

    it('returns empty string for missing field', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(store.getIdentity({})).toBe('')
    })
  })

  describe('columns', () => {
    it('available columns include all scoped fields', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(get(store).availableColumns).toHaveLength(2)
    })

    it('visible columns default to fields with table.show=true', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(get(store).visibleColumns).toEqual(['name'])
    })

    it('columns filters by visibleColumns and sorts by table.order', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      const current = get(store)
      expect(current.columns).toHaveLength(1)
      expect(current.columns[0].name).toBe('name')
    })
  })

  describe('toggleColumn', () => {
    it('adds column to visible', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      store.toggleColumn('age')
      expect(get(store).visibleColumns).toContain('age')
    })

    it('removes column from visible', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      store.toggleColumn('name')
      expect(get(store).visibleColumns).not.toContain('name')
    })
  })

  describe('fetch / reload', () => {
    it('calls fetch hook with params', async () => {
      const fetchHook = vi.fn(async () => ({ data: [{ id: 1, name: 'Alice' }], total: 1, page: 1, limit: 10 }))
      const hooks = { fetch: { [Scope.index]: fetchHook } }
      const component = makeComponent()
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component, hooks })
      await tick()
      expect(get(store).rows).toHaveLength(1)
      expect(fetchHook).toHaveBeenCalledWith(
        expect.objectContaining({ params: expect.objectContaining({ page: 1, limit: 10 }) }),
      )
    })

    it('sets rows and total from result', async () => {
      const fetchHook = vi.fn(async () => ({ data: [{ id: 1 }, { id: 2 }], total: 50, page: 1, limit: 10 }))
      const hooks = { fetch: { [Scope.index]: fetchHook } }
      const component = makeComponent()
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component, hooks })
      await tick()
      const current = get(store)
      expect(current.rows).toHaveLength(2)
      expect(current.total).toBe(50)
      expect(current.totalPages).toBe(5)
    })

    it('does nothing when no fetch hook', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(get(store).rows).toEqual([])
    })
  })

  describe('setSort', () => {
    it('sets sort field to asc on first click', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      store.setSort('name')
      expect(get(store).sortField).toBe('name')
      expect(get(store).sortOrder).toBe('asc')
    })

    it('toggles to desc on second click', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      store.setSort('name')
      store.setSort('name')
      expect(get(store).sortField).toBe('name')
      expect(get(store).sortOrder).toBe('desc')
    })

    it('clears sort on third click', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      store.setSort('name')
      store.setSort('name')
      store.setSort('name')
      expect(get(store).sortField).toBeUndefined()
      expect(get(store).sortOrder).toBeUndefined()
    })

    it('resets to asc when clicking different field', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      store.setSort('name')
      store.setSort('name') // desc
      store.setSort('age')
      expect(get(store).sortField).toBe('age')
      expect(get(store).sortOrder).toBe('asc')
    })
  })

  describe('setFilter / clearFilters', () => {
    it('sets filter value', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      store.setFilter('name', 'Alice')
      expect(get(store).filters).toEqual({ name: 'Alice' })
    })

    it('removes filter for empty/null/undefined', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      store.setFilter('name', 'Alice')
      store.setFilter('name', '')
      expect(get(store).filters).toEqual({})
    })

    it('clearFilters resets all', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      store.setFilter('name', 'Alice')
      store.setFilter('age', 25)
      store.clearFilters()
      expect(get(store).filters).toEqual({})
    })

    it('resets page to 1 on filter', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      store.setPage(3)
      store.setFilter('name', 'Alice')
      expect(get(store).page).toBe(1)
    })
  })

  describe('setLimit', () => {
    it('updates limit and resets page', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      store.setPage(3)
      store.setLimit(25)
      expect(get(store).limit).toBe(25)
      expect(get(store).page).toBe(1)
    })
  })

  describe('selection', () => {
    it('toggleSelect adds and removes', async () => {
      const fetchHook = vi.fn(async () => ({ data: [{ id: 1 }, { id: 2 }], total: 2, page: 1, limit: 10 }))
      const hooks = { fetch: { [Scope.index]: fetchHook } }
      const component = makeComponent()
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component, hooks })
      await tick()
      expect(get(store).rows).toHaveLength(2)

      store.toggleSelect({ id: 1 })
      expect(store.isSelected({ id: 1 })).toBe(true)
      expect(get(store).selected).toHaveLength(1)

      store.toggleSelect({ id: 1 })
      expect(store.isSelected({ id: 1 })).toBe(false)
    })

    it('selectAll selects all rows', async () => {
      const fetchHook = vi.fn(async () => ({ data: [{ id: 1 }, { id: 2 }], total: 2, page: 1, limit: 10 }))
      const hooks = { fetch: { [Scope.index]: fetchHook } }
      const component = makeComponent()
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component, hooks })
      await tick()
      expect(get(store).rows).toHaveLength(2)

      store.selectAll()
      expect(get(store).selected).toHaveLength(2)
    })

    it('clearSelection empties selection', async () => {
      const fetchHook = vi.fn(async () => ({ data: [{ id: 1 }], total: 1, page: 1, limit: 10 }))
      const hooks = { fetch: { [Scope.index]: fetchHook } }
      const component = makeComponent()
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component, hooks })
      await tick()
      expect(get(store).rows).toHaveLength(1)

      store.toggleSelect({ id: 1 })
      store.clearSelection()
      expect(get(store).selected).toHaveLength(0)
    })
  })

  describe('formatValue', () => {
    it('uses custom format function', () => {
      const format = vi.fn(() => 'formatted')
      const schema = makeSchema({
        fields: {
          name: makeFieldConfig({ table: { show: true, width: 'auto', sortable: true, filterable: false, order: 1, format } }),
        },
      })
      const store = useDataTable({ schema, scope: Scope.index, component: makeComponent() })
      expect(store.formatValue('name', 'Alice', { id: 1 })).toBe('formatted')
      expect(format).toHaveBeenCalledWith('Alice', { id: 1 })
    })

    it('falls back to String(value)', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(store.formatValue('name', 42, {})).toBe('42')
    })

    it('handles null/undefined', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(store.formatValue('name', null, {})).toBe('')
      expect(store.formatValue('name', undefined, {})).toBe('')
    })
  })

  describe('actions', () => {
    it('resolves visible in-scope non-row actions', () => {
      const schema = makeSchema({
        actions: {
          add: makeActionConfig({ positions: [Position.top] }),
          edit: makeActionConfig({ positions: [Position.row] }),
        },
      })
      const store = useDataTable({ schema, scope: Scope.index, component: makeComponent() })
      const current = get(store)
      expect(current.actions).toHaveLength(1)
      expect(current.actions[0].name).toBe('add')
    })

    it('filters hidden actions', () => {
      const schema = makeSchema({
        actions: { add: makeActionConfig({ hidden: true }) },
      })
      const store = useDataTable({ schema, scope: Scope.index, component: makeComponent() })
      expect(get(store).actions).toHaveLength(0)
    })

    it('filters by permissions', () => {
      const schema = makeSchema({
        actions: { add: makeActionConfig({ open: false }) },
      })
      const store = useDataTable({ schema, scope: Scope.index, component: makeComponent(), permissions: ['other'] })
      expect(get(store).actions).toHaveLength(0)
    })

    it('sorts by order', () => {
      const schema = makeSchema({
        actions: {
          b: makeActionConfig({ order: 2 }),
          a: makeActionConfig({ order: 1 }),
        },
      })
      const store = useDataTable({ schema, scope: Scope.index, component: makeComponent() })
      expect(get(store).actions.map((a) => a.name)).toEqual(['a', 'b'])
    })

    it('execute calls handler', async () => {
      const handler = vi.fn()
      const schema = makeSchema({
        actions: { add: makeActionConfig() },
      })
      const handlers = { add: handler }
      const store = useDataTable({ schema, scope: Scope.index, component: makeComponent(), handlers })
      await get(store).actions[0].execute()
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('getRowActions', () => {
    it('returns only row-position actions', () => {
      const schema = makeSchema({
        actions: {
          view: makeActionConfig({ positions: [Position.row] }),
          add: makeActionConfig({ positions: [Position.top] }),
        },
      })
      const store = useDataTable({ schema, scope: Scope.index, component: makeComponent() })
      const rowActions = store.getRowActions({ id: 1 })
      expect(rowActions).toHaveLength(1)
      expect(rowActions[0].name).toBe('view')
    })

    it('evaluates condition per record', () => {
      const schema = makeSchema({
        actions: {
          edit: makeActionConfig({
            positions: [Position.row],
            condition: (r) => r.status === 'active',
          }),
        },
      })
      const store = useDataTable({ schema, scope: Scope.index, component: makeComponent() })
      expect(store.getRowActions({ id: 1, status: 'active' })).toHaveLength(1)
      expect(store.getRowActions({ id: 2, status: 'inactive' })).toHaveLength(0)
    })

    it('execute calls handler with record as state', async () => {
      const handler = vi.fn()
      const schema = makeSchema({
        actions: { view: makeActionConfig({ positions: [Position.row] }) },
      })
      const handlers = { view: handler }
      const store = useDataTable({ schema, scope: Scope.index, component: makeComponent(), handlers })
      const rowActions = store.getRowActions({ id: 1, name: 'Alice' })
      await rowActions[0].execute()
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ state: { id: 1, name: 'Alice' } }),
      )
    })
  })

  describe('permitted', () => {
    it('is false when permissions undefined', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(get(store).permitted).toBe(false)
    })

    it('is true when scope permission exists', () => {
      const store = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent(), permissions: ['test.scope.index'] })
      expect(get(store).permitted).toBe(true)
    })
  })
})
