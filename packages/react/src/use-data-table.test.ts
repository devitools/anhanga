// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
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

// Stable reference to avoid infinite re-render loops in useEffect
let component: ComponentContract

beforeEach(() => {
  component = makeComponent()
})

describe('useDataTable', () => {
  describe('initial state', () => {
    it('starts with empty rows', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.rows).toEqual([])
    })

    it('uses pageSize as limit', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component, pageSize: 25 }))
      expect(result.current.limit).toBe(25)
    })

    it('defaults to page 1', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.page).toBe(1)
    })

    it('empty is true when not loading and no rows', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.empty).toBe(true)
    })

    it('totalPages defaults to 1', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.totalPages).toBe(1)
    })
  })

  describe('getIdentity', () => {
    it('returns single field value as string', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.getIdentity({ id: 42 })).toBe('42')
    })

    it('joins array identity fields with colon', () => {
      const schema = makeSchema({ identity: ['org', 'id'] })
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.getIdentity({ org: 'acme', id: 1 })).toBe('acme:1')
    })

    it('returns empty string for missing field', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.getIdentity({})).toBe('')
    })
  })

  describe('columns', () => {
    it('available columns include all scoped fields', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.availableColumns).toHaveLength(2)
    })

    it('visible columns default to fields with table.show=true', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.visibleColumns).toEqual(['name'])
    })

    it('columns filters by visibleColumns and sorts by table.order', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.columns).toHaveLength(1)
      expect(result.current.columns[0].name).toBe('name')
    })
  })

  describe('toggleColumn', () => {
    it('adds column to visible', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      act(() => result.current.toggleColumn('age'))
      expect(result.current.visibleColumns).toContain('age')
    })

    it('removes column from visible', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      act(() => result.current.toggleColumn('name'))
      expect(result.current.visibleColumns).not.toContain('name')
    })
  })

  describe('fetch / reload', () => {
    it('calls fetch hook with params', async () => {
      const fetchHook = vi.fn(async () => ({ data: [{ id: 1, name: 'Alice' }], total: 1, page: 1, limit: 10 }))
      const hooks = { fetch: { [Scope.index]: fetchHook } }
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component, hooks }))
      await waitFor(() => expect(result.current.rows).toHaveLength(1))
      expect(fetchHook).toHaveBeenCalledWith(
        expect.objectContaining({ params: expect.objectContaining({ page: 1, limit: 10 }) }),
      )
    })

    it('sets rows and total from result', async () => {
      const fetchHook = vi.fn(async () => ({ data: [{ id: 1 }, { id: 2 }], total: 50, page: 1, limit: 10 }))
      const hooks = { fetch: { [Scope.index]: fetchHook } }
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component, hooks }))
      await waitFor(() => {
        expect(result.current.rows).toHaveLength(2)
        expect(result.current.total).toBe(50)
        expect(result.current.totalPages).toBe(5)
      })
    })

    it('does nothing when no fetch hook', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.rows).toEqual([])
    })
  })

  describe('setSort', () => {
    it('sets sort field to asc on first click', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      act(() => result.current.setSort('name'))
      expect(result.current.sortField).toBe('name')
      expect(result.current.sortOrder).toBe('asc')
    })

    it('toggles to desc on second click', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      act(() => result.current.setSort('name'))
      act(() => result.current.setSort('name'))
      expect(result.current.sortField).toBe('name')
      expect(result.current.sortOrder).toBe('desc')
    })

    it('clears sort on third click', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      act(() => result.current.setSort('name'))
      act(() => result.current.setSort('name'))
      act(() => result.current.setSort('name'))
      expect(result.current.sortField).toBeUndefined()
      expect(result.current.sortOrder).toBeUndefined()
    })

    it('resets to asc when clicking different field', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      act(() => result.current.setSort('name'))
      act(() => result.current.setSort('name')) // desc
      act(() => result.current.setSort('age'))
      expect(result.current.sortField).toBe('age')
      expect(result.current.sortOrder).toBe('asc')
    })
  })

  describe('setFilter / clearFilters', () => {
    it('sets filter value', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      act(() => result.current.setFilter('name', 'Alice'))
      expect(result.current.filters).toEqual({ name: 'Alice' })
    })

    it('removes filter for empty/null/undefined', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      act(() => result.current.setFilter('name', 'Alice'))
      act(() => result.current.setFilter('name', ''))
      expect(result.current.filters).toEqual({})
    })

    it('clearFilters resets all', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      act(() => result.current.setFilter('name', 'Alice'))
      act(() => result.current.setFilter('age', 25))
      act(() => result.current.clearFilters())
      expect(result.current.filters).toEqual({})
    })

    it('resets page to 1 on filter', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      act(() => result.current.setPage(3))
      act(() => result.current.setFilter('name', 'Alice'))
      expect(result.current.page).toBe(1)
    })
  })

  describe('setLimit', () => {
    it('updates limit and resets page', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      act(() => result.current.setPage(3))
      act(() => result.current.setLimit(25))
      expect(result.current.limit).toBe(25)
      expect(result.current.page).toBe(1)
    })
  })

  describe('selection', () => {
    it('toggleSelect adds and removes', async () => {
      const fetchHook = vi.fn(async () => ({ data: [{ id: 1 }, { id: 2 }], total: 2, page: 1, limit: 10 }))
      const hooks = { fetch: { [Scope.index]: fetchHook } }
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component, hooks }))
      await waitFor(() => expect(result.current.rows).toHaveLength(2))

      act(() => result.current.toggleSelect({ id: 1 }))
      expect(result.current.isSelected({ id: 1 })).toBe(true)
      expect(result.current.selected).toHaveLength(1)

      act(() => result.current.toggleSelect({ id: 1 }))
      expect(result.current.isSelected({ id: 1 })).toBe(false)
    })

    it('selectAll selects all rows', async () => {
      const fetchHook = vi.fn(async () => ({ data: [{ id: 1 }, { id: 2 }], total: 2, page: 1, limit: 10 }))
      const hooks = { fetch: { [Scope.index]: fetchHook } }
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component, hooks }))
      await waitFor(() => expect(result.current.rows).toHaveLength(2))

      act(() => result.current.selectAll())
      expect(result.current.selected).toHaveLength(2)
    })

    it('clearSelection empties selection', async () => {
      const fetchHook = vi.fn(async () => ({ data: [{ id: 1 }], total: 1, page: 1, limit: 10 }))
      const hooks = { fetch: { [Scope.index]: fetchHook } }
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component, hooks }))
      await waitFor(() => expect(result.current.rows).toHaveLength(1))

      act(() => result.current.toggleSelect({ id: 1 }))
      act(() => result.current.clearSelection())
      expect(result.current.selected).toHaveLength(0)
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
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.formatValue('name', 'Alice', { id: 1 })).toBe('formatted')
      expect(format).toHaveBeenCalledWith('Alice', { id: 1 })
    })

    it('falls back to String(value)', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.formatValue('name', 42, {})).toBe('42')
    })

    it('handles null/undefined', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.formatValue('name', null, {})).toBe('')
      expect(result.current.formatValue('name', undefined, {})).toBe('')
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
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.actions).toHaveLength(1)
      expect(result.current.actions[0].name).toBe('add')
    })

    it('filters hidden actions', () => {
      const schema = makeSchema({
        actions: { add: makeActionConfig({ hidden: true }) },
      })
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.actions).toHaveLength(0)
    })

    it('filters by permissions', () => {
      const schema = makeSchema({
        actions: { add: makeActionConfig({ open: false }) },
      })
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component, permissions: ['other'] }))
      expect(result.current.actions).toHaveLength(0)
    })

    it('sorts by order', () => {
      const schema = makeSchema({
        actions: {
          b: makeActionConfig({ order: 2 }),
          a: makeActionConfig({ order: 1 }),
        },
      })
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.actions.map((a) => a.name)).toEqual(['a', 'b'])
    })

    it('execute calls handler', async () => {
      const handler = vi.fn()
      const schema = makeSchema({
        actions: { add: makeActionConfig() },
      })
      const handlers = { add: handler }
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component, handlers }))
      await act(async () => { await result.current.actions[0].execute() })
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
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      const rowActions = result.current.getRowActions({ id: 1 })
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
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.getRowActions({ id: 1, status: 'active' })).toHaveLength(1)
      expect(result.current.getRowActions({ id: 2, status: 'inactive' })).toHaveLength(0)
    })

    it('execute calls handler with record as state', async () => {
      const handler = vi.fn()
      const schema = makeSchema({
        actions: { view: makeActionConfig({ positions: [Position.row] }) },
      })
      const handlers = { view: handler }
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component, handlers }))
      const rowActions = result.current.getRowActions({ id: 1, name: 'Alice' })
      await act(async () => { await rowActions[0].execute() })
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ state: { id: 1, name: 'Alice' } }),
      )
    })
  })

  describe('permitted', () => {
    it('is false when permissions undefined', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component }))
      expect(result.current.permitted).toBe(false)
    })

    it('is true when scope permission exists', () => {
      const schema = makeSchema()
      const { result } = renderHook(() => useDataTable({ schema, scope: Scope.index, component, permissions: ['test.scope.index'] }))
      expect(result.current.permitted).toBe(true)
    })
  })
})
