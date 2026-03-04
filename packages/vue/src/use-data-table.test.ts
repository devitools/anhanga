import { vi, describe, it, expect } from 'vitest'

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  return {
    ...actual,
    onMounted: (fn: Function) => fn(),
    watch: vi.fn(),
  }
})

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

function makeComponent (overrides: Partial<ComponentContract> = {}): ComponentContract {
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
    ...overrides,
  }
}

describe('useDataTable', () => {
  describe('initial state', () => {
    it('starts with empty rows', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(table.rows).toEqual([])
    })

    it('uses pageSize as limit', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent(), pageSize: 25 })
      expect(table.limit).toBe(25)
    })

    it('defaults to page 1', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(table.page).toBe(1)
    })

    it('empty is true when not loading and no rows', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(table.empty).toBe(true)
    })

    it('totalPages defaults to 1', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(table.totalPages).toBe(1)
    })
  })

  describe('getIdentity', () => {
    it('returns single field value as string', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(table.getIdentity({ id: 42 })).toBe('42')
    })

    it('joins array identity fields with colon', () => {
      const schema = makeSchema({ identity: ['org', 'id'] })
      const table = useDataTable({ schema, scope: Scope.index, component: makeComponent() })
      expect(table.getIdentity({ org: 'acme', id: 1 })).toBe('acme:1')
    })

    it('returns empty string for missing field', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(table.getIdentity({})).toBe('')
    })
  })

  describe('columns', () => {
    it('available columns include all scoped fields', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(table.availableColumns).toHaveLength(2)
    })

    it('visible columns default to fields with table.show=true', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(table.visibleColumns).toEqual(['name'])
    })

    it('columns filters by visibleColumns and sorts by table.order', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(table.columns).toHaveLength(1)
      expect(table.columns[0].name).toBe('name')
    })
  })

  describe('toggleColumn', () => {
    it('adds column to visible', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      table.toggleColumn('age')
      expect(table.visibleColumns).toContain('age')
    })

    it('removes column from visible', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      table.toggleColumn('name')
      expect(table.visibleColumns).not.toContain('name')
    })
  })

  describe('fetch / reload', () => {
    it('calls fetch hook with params', async () => {
      const fetchHook = vi.fn(async () => ({ data: [{ id: 1, name: 'Alice' }], total: 1, page: 1, limit: 10 }))
      const hooks = { fetch: { [Scope.index]: fetchHook } }
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent(), hooks })
      // onMounted calls reload() synchronously, which starts the async fetch
      await new Promise((r) => setTimeout(r, 0))
      expect(fetchHook).toHaveBeenCalledWith(
        expect.objectContaining({ params: expect.objectContaining({ page: 1, limit: 10 }) }),
      )
      expect(table.rows).toHaveLength(1)
    })

    it('sets rows and total from result', async () => {
      const fetchHook = vi.fn(async () => ({ data: [{ id: 1 }, { id: 2 }], total: 50, page: 1, limit: 10 }))
      const hooks = { fetch: { [Scope.index]: fetchHook } }
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent(), hooks })
      await new Promise((r) => setTimeout(r, 0))
      expect(table.rows).toHaveLength(2)
      expect(table.total).toBe(50)
      expect(table.totalPages).toBe(5)
    })

    it('does nothing when no fetch hook', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(table.rows).toEqual([])
    })
  })

  describe('setSort', () => {
    it('sets sort field to asc on first click', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      table.setSort('name')
      expect(table.sortField).toBe('name')
      expect(table.sortOrder).toBe('asc')
    })

    it('toggles to desc on second click', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      table.setSort('name')
      table.setSort('name')
      expect(table.sortField).toBe('name')
      expect(table.sortOrder).toBe('desc')
    })

    it('clears sort on third click', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      table.setSort('name')
      table.setSort('name')
      table.setSort('name')
      expect(table.sortField).toBeUndefined()
      expect(table.sortOrder).toBeUndefined()
    })

    it('resets to asc when clicking different field', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      table.setSort('name')
      table.setSort('name') // desc
      table.setSort('age')
      expect(table.sortField).toBe('age')
      expect(table.sortOrder).toBe('asc')
    })
  })

  describe('setFilter / clearFilters', () => {
    it('sets filter value', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      table.setFilter('name', 'Alice')
      expect(table.filters).toEqual({ name: 'Alice' })
    })

    it('removes filter for empty/null/undefined', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      table.setFilter('name', 'Alice')
      table.setFilter('name', '')
      expect(table.filters).toEqual({})
    })

    it('clearFilters resets all', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      table.setFilter('name', 'Alice')
      table.setFilter('age', 25)
      table.clearFilters()
      expect(table.filters).toEqual({})
    })

    it('resets page to 1 on filter', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      table.setPage(3)
      table.setFilter('name', 'Alice')
      expect(table.page).toBe(1)
    })
  })

  describe('setLimit', () => {
    it('updates limit and resets page', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      table.setPage(3)
      table.setLimit(25)
      expect(table.limit).toBe(25)
      expect(table.page).toBe(1)
    })
  })

  describe('selection', () => {
    it('toggleSelect adds and removes', async () => {
      const fetchHook = vi.fn(async () => ({ data: [{ id: 1 }, { id: 2 }], total: 2, page: 1, limit: 10 }))
      const hooks = { fetch: { [Scope.index]: fetchHook } }
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent(), hooks })
      await new Promise((r) => setTimeout(r, 0))
      expect(table.rows).toHaveLength(2)

      table.toggleSelect({ id: 1 })
      expect(table.isSelected({ id: 1 })).toBe(true)
      expect(table.selected).toHaveLength(1)

      table.toggleSelect({ id: 1 })
      expect(table.isSelected({ id: 1 })).toBe(false)
    })

    it('selectAll selects all rows', async () => {
      const fetchHook = vi.fn(async () => ({ data: [{ id: 1 }, { id: 2 }], total: 2, page: 1, limit: 10 }))
      const hooks = { fetch: { [Scope.index]: fetchHook } }
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent(), hooks })
      await new Promise((r) => setTimeout(r, 0))

      table.selectAll()
      expect(table.selected).toHaveLength(2)
    })

    it('clearSelection empties selection', async () => {
      const fetchHook = vi.fn(async () => ({ data: [{ id: 1 }], total: 1, page: 1, limit: 10 }))
      const hooks = { fetch: { [Scope.index]: fetchHook } }
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent(), hooks })
      await new Promise((r) => setTimeout(r, 0))

      table.toggleSelect({ id: 1 })
      table.clearSelection()
      expect(table.selected).toHaveLength(0)
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
      const table = useDataTable({ schema, scope: Scope.index, component: makeComponent() })
      expect(table.formatValue('name', 'Alice', { id: 1 })).toBe('formatted')
      expect(format).toHaveBeenCalledWith('Alice', { id: 1 })
    })

    it('falls back to String(value)', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(table.formatValue('name', 42, {})).toBe('42')
    })

    it('handles null/undefined', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(table.formatValue('name', null, {})).toBe('')
      expect(table.formatValue('name', undefined, {})).toBe('')
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
      const table = useDataTable({ schema, scope: Scope.index, component: makeComponent() })
      expect(table.actions).toHaveLength(1)
      expect(table.actions[0].name).toBe('add')
    })

    it('filters hidden actions', () => {
      const schema = makeSchema({
        actions: { add: makeActionConfig({ hidden: true }) },
      })
      const table = useDataTable({ schema, scope: Scope.index, component: makeComponent() })
      expect(table.actions).toHaveLength(0)
    })

    it('filters by permissions', () => {
      const schema = makeSchema({
        actions: { add: makeActionConfig({ open: false }) },
      })
      const table = useDataTable({ schema, scope: Scope.index, component: makeComponent(), permissions: ['other'] })
      expect(table.actions).toHaveLength(0)
    })

    it('sorts by order', () => {
      const schema = makeSchema({
        actions: {
          b: makeActionConfig({ order: 2 }),
          a: makeActionConfig({ order: 1 }),
        },
      })
      const table = useDataTable({ schema, scope: Scope.index, component: makeComponent() })
      expect(table.actions.map((a) => a.name)).toEqual(['a', 'b'])
    })

    it('execute calls handler', async () => {
      const handler = vi.fn()
      const schema = makeSchema({
        actions: { add: makeActionConfig() },
      })
      const handlers = { add: handler }
      const table = useDataTable({ schema, scope: Scope.index, component: makeComponent(), handlers })
      await table.actions[0].execute()
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
      const table = useDataTable({ schema, scope: Scope.index, component: makeComponent() })
      const rowActions = table.getRowActions({ id: 1 })
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
      const table = useDataTable({ schema, scope: Scope.index, component: makeComponent() })
      expect(table.getRowActions({ id: 1, status: 'active' })).toHaveLength(1)
      expect(table.getRowActions({ id: 2, status: 'inactive' })).toHaveLength(0)
    })

    it('execute calls handler with record as state', async () => {
      const handler = vi.fn()
      const schema = makeSchema({
        actions: { view: makeActionConfig({ positions: [Position.row] }) },
      })
      const handlers = { view: handler }
      const table = useDataTable({ schema, scope: Scope.index, component: makeComponent(), handlers })
      const rowActions = table.getRowActions({ id: 1, name: 'Alice' })
      await rowActions[0].execute()
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ state: { id: 1, name: 'Alice' } }),
      )
    })
  })

  describe('permitted', () => {
    it('is false when permissions undefined', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent() })
      expect(table.permitted).toBe(false)
    })

    it('is true when scope permission exists', () => {
      const table = useDataTable({ schema: makeSchema(), scope: Scope.index, component: makeComponent(), permissions: ['test.scope.index'] })
      expect(table.permitted).toBe(true)
    })
  })
})
