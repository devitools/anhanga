import { writable, derived, get } from 'svelte/store'
import type { Readable } from 'svelte/store'
import type { FieldConfig, ScopeValue, TableContract } from '@anhanga/core'
import { Position, isInScope, isScopePermitted } from '@anhanga/core'
import type {
  UseDataTableOptions,
  UseDataTableReturn,
  ResolvedColumn,
  ResolvedAction,
} from './types'

export type UseDataTableStore = Readable<UseDataTableReturn> & {
  toggleColumn (name: string): void
  setPage (page: number): void
  setLimit (limit: number): void
  setSort (field: string): void
  setFilter (field: string, value: unknown): void
  clearFilters (): void
  isSelected (record: Record<string, unknown>): boolean
  toggleSelect (record: Record<string, unknown>): void
  selectAll (): void
  clearSelection (): void
  getRowActions (record: Record<string, unknown>): ResolvedAction[]
  reload (): void
  formatValue (name: string, value: unknown, record: Record<string, unknown>): string
  getIdentity (record: Record<string, unknown>): string
}

export function useDataTable (options: UseDataTableOptions): UseDataTableStore {
  const { schema, scope, handlers, hooks, component, pageSize = 10, permissions } = options

  const rows = writable<Record<string, unknown>[]>([])
  const loading = writable(false)
  const total = writable(0)
  const page = writable(1)
  const limit = writable(pageSize)
  const sortField = writable<string | undefined>()
  const sortOrder = writable<'asc' | 'desc' | undefined>()
  const filters = writable<Record<string, unknown>>({})
  const selectedIds = writable<Set<string>>(new Set())
  let fetchId = 0

  function getIdentity (record: Record<string, unknown>): string {
    const identity = schema.identity
    if (Array.isArray(identity)) {
      return identity.map((k) => record[k]).join(':')
    }
    return String(record[identity] ?? '')
  }

  const scopedFields = derived(rows, () => {
    const result: Record<string, FieldConfig> = {}
    for (const [name, config] of Object.entries(schema.fields)) {
      if (isInScope(config, scope)) {
        result[name] = config
      }
    }
    return result
  })

  const availableColumns = derived(scopedFields, ($scopedFields): ResolvedColumn[] => {
    return Object.entries($scopedFields).map(([name, config]) => ({
      name,
      config,
      table: config.table,
    }))
  })

  const visibleColumns = writable<string[]>(
    Object.entries(schema.fields)
      .filter(([, config]) => isInScope(config, scope) && config.table.show)
      .map(([name]) => name),
  )

  const columns = derived([availableColumns, visibleColumns], ([$availableColumns, $visibleColumns]): ResolvedColumn[] => {
    return $availableColumns
      .filter((c) => $visibleColumns.includes(c.name))
      .sort((a, b) => a.table.order - b.table.order)
  })

  function toggleColumn (name: string) {
    const prev = get(visibleColumns)
    visibleColumns.set(prev.includes(name)
      ? prev.filter((n) => n !== name)
      : [...prev, name])
  }

  function reload () {
    const id = ++fetchId
    const fetchHook = hooks?.fetch?.[scope]
    if (!fetchHook) return

    loading.set(true)
    fetchHook({
      params: {
        page: get(page),
        limit: get(limit),
        sort: get(sortField),
        order: get(sortOrder),
        filters: get(filters),
      },
      component,
    })
      .then((result: { data: Record<string, unknown>[]; total: number }) => {
        if (fetchId !== id) return
        rows.set(result.data)
        total.set(result.total)
      })
      .finally(() => {
        if (fetchId !== id) return
        loading.set(false)
      })
  }

  reload()

  const empty = derived([loading, rows], ([$loading, $rows]) => !$loading && $rows.length === 0)
  const totalPages = derived([total, limit], ([$total, $limit]) => Math.max(1, Math.ceil($total / $limit)))

  function setPage (value: number) {
    page.set(value)
    reload()
  }

  function setLimit (value: number) {
    limit.set(value)
    page.set(1)
    reload()
  }

  function setSort (field: string) {
    const currentField = get(sortField)
    const currentOrder = get(sortOrder)
    if (currentField !== field) {
      sortField.set(field)
      sortOrder.set('asc')
      page.set(1)
    } else if (currentOrder === 'asc') {
      sortOrder.set('desc')
    } else {
      sortField.set(undefined)
      sortOrder.set(undefined)
      page.set(1)
    }
    reload()
  }

  function setFilter (field: string, value: unknown) {
    const next = { ...get(filters) }
    if (value === '' || value === undefined || value === null) {
      delete next[field]
    } else {
      next[field] = value
    }
    filters.set(next)
    page.set(1)
    reload()
  }

  function clearFilters () {
    filters.set({})
    page.set(1)
    reload()
  }

  const selected = derived([rows, selectedIds], ([$rows, $selectedIds]) =>
    $rows.filter((r) => $selectedIds.has(getIdentity(r))),
  )

  function isSelected (record: Record<string, unknown>) {
    return get(selectedIds).has(getIdentity(record))
  }

  function toggleSelect (record: Record<string, unknown>) {
    const id = getIdentity(record)
    const next = new Set(get(selectedIds))
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    selectedIds.set(next)
  }

  function selectAll () {
    selectedIds.set(new Set(get(rows).map(getIdentity)))
  }

  function clearSelection () {
    selectedIds.set(new Set())
  }

  function formatValue (name: string, value: unknown, record: Record<string, unknown>): string {
    const config = get(scopedFields)[name]
    if (config?.table.format) {
      return config.table.format(value, record)
    }
    return String(value ?? '')
  }

  function getTableContract (): TableContract {
    return {
      page: get(page),
      limit: get(limit),
      total: get(total),
      sort: get(sortField),
      order: get(sortOrder),
      filters: get(filters),
      selected: get(selected),
      reload,
      setPage,
      setFilters: (f: Record<string, unknown>) => { filters.set(f) },
      clearSelection,
    }
  }

  const actions = derived([selected], (): ResolvedAction[] => {
    return Object.entries(schema.actions)
      .filter(([, config]) => !config.hidden && isInScope(config, scope))
      .filter(() => isScopePermitted(schema.domain, scope, permissions))
      .filter(([, config]) => !config.positions.includes(Position.row))
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([name, config]) => ({
        name,
        config,
        execute: async () => {
          const handler = handlers?.[name]
          if (!handler) return
          await handler({
            state: {},
            component,
            table: getTableContract(),
          })
        },
      }))
  })

  function getRowActions (record: Record<string, unknown>): ResolvedAction[] {
    return Object.entries(schema.actions)
      .filter(([, config]) => !config.hidden && isInScope(config, scope))
      .filter(() => isScopePermitted(schema.domain, scope, permissions))
      .filter(([, config]) => config.positions.includes(Position.row))
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([name, config]) => ({
        name,
        config,
        execute: async () => {
          const handler = handlers?.[name]
          if (!handler) return
          await handler({
            state: { ...record },
            component,
            table: getTableContract(),
          })
        },
      }))
  }

  const store = derived(
    [rows, loading, empty, columns, availableColumns, visibleColumns, page, limit, total, totalPages, sortField, sortOrder, filters, selected, actions],
    ([$rows, $loading, $empty, $columns, $availableColumns, $visibleColumns, $page, $limit, $total, $totalPages, $sortField, $sortOrder, $filters, $selected, $actions]): UseDataTableReturn => ({
      rows: $rows,
      loading: $loading,
      empty: $empty,
      columns: $columns,
      availableColumns: $availableColumns,
      visibleColumns: $visibleColumns,
      toggleColumn,
      page: $page,
      limit: $limit,
      total: $total,
      totalPages: $totalPages,
      setPage,
      setLimit,
      sortField: $sortField,
      sortOrder: $sortOrder,
      setSort,
      filters: $filters,
      setFilter,
      clearFilters,
      selected: $selected,
      isSelected,
      toggleSelect,
      selectAll,
      clearSelection,
      actions: $actions,
      getRowActions,
      reload,
      formatValue,
      getIdentity,
    }),
  )

  return {
    subscribe: store.subscribe,
    toggleColumn,
    setPage,
    setLimit,
    setSort,
    setFilter,
    clearFilters,
    isSelected,
    toggleSelect,
    selectAll,
    clearSelection,
    getRowActions,
    reload,
    formatValue,
    getIdentity,
  }
}
