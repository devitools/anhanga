import { ref, computed, watch, onMounted } from 'vue'
import type { FieldConfig, ScopeValue, TableContract } from '@anhanga/core'
import { Position, isInScope, isScopePermitted } from '@anhanga/core'
import type {
  UseDataTableOptions,
  UseDataTableReturn,
  ResolvedColumn,
  ResolvedAction,
} from './types'

export function useDataTable (options: UseDataTableOptions): UseDataTableReturn {
  const { schema, scope, handlers, hooks, component, pageSize = 10, permissions } = options

  const rows = ref<Record<string, unknown>[]>([])
  const loading = ref(false)
  const total = ref(0)
  const page = ref(1)
  const limit = ref(pageSize)
  const sortField = ref<string | undefined>()
  const sortOrder = ref<'asc' | 'desc' | undefined>()
  const filters = ref<Record<string, unknown>>({})
  const selectedIds = ref<Set<string>>(new Set())
  let fetchId = 0

  function getIdentity (record: Record<string, unknown>): string {
    const identity = schema.identity
    if (Array.isArray(identity)) {
      return identity.map((k) => record[k]).join(':')
    }
    return String(record[identity] ?? '')
  }

  const scopedFields = computed(() => {
    const result: Record<string, FieldConfig> = {}
    for (const [name, config] of Object.entries(schema.fields)) {
      if (isInScope(config, scope)) {
        result[name] = config
      }
    }
    return result
  })

  const availableColumns = computed((): ResolvedColumn[] => {
    return Object.entries(scopedFields.value).map(([name, config]) => ({
      name,
      config,
      table: config.table,
    }))
  })

  const visibleColumns = ref<string[]>(
    Object.entries(schema.fields)
      .filter(([, config]) => isInScope(config, scope) && config.table.show)
      .map(([name]) => name),
  )

  const columns = computed((): ResolvedColumn[] => {
    return availableColumns.value
      .filter((c) => visibleColumns.value.includes(c.name))
      .sort((a, b) => a.table.order - b.table.order)
  })

  function toggleColumn (name: string) {
    const prev = visibleColumns.value
    visibleColumns.value = prev.includes(name)
      ? prev.filter((n) => n !== name)
      : [...prev, name]
  }

  function reload () {
    const id = ++fetchId
    const fetchHook = hooks?.fetch?.[scope]
    if (!fetchHook) return

    loading.value = true
    fetchHook({
      params: {
        page: page.value,
        limit: limit.value,
        sort: sortField.value,
        order: sortOrder.value,
        filters: filters.value,
      },
      component,
    })
      .then((result: { data: Record<string, unknown>[]; total: number }) => {
        if (fetchId !== id) return
        rows.value = result.data
        total.value = result.total
      })
      .finally(() => {
        if (fetchId !== id) return
        loading.value = false
      })
  }

  watch(
    [page, limit, sortField, sortOrder, filters],
    () => { reload() },
    { deep: true },
  )

  onMounted(() => {
    reload()
  })

  const empty = computed(() => !loading.value && rows.value.length === 0)
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

  function setPage (value: number) {
    page.value = value
  }

  function setLimit (value: number) {
    limit.value = value
    page.value = 1
  }

  function setSort (field: string) {
    if (sortField.value !== field) {
      sortField.value = field
      sortOrder.value = 'asc'
      page.value = 1
      return
    }
    if (sortOrder.value === 'asc') {
      sortOrder.value = 'desc'
    } else {
      sortField.value = undefined
      sortOrder.value = undefined
      page.value = 1
    }
  }

  function setFilter (field: string, value: unknown) {
    const next = { ...filters.value }
    if (value === '' || value === undefined || value === null) {
      delete next[field]
    } else {
      next[field] = value
    }
    filters.value = next
    page.value = 1
  }

  function clearFilters () {
    filters.value = {}
    page.value = 1
  }

  const selected = computed(() =>
    rows.value.filter((r) => selectedIds.value.has(getIdentity(r))),
  )

  function isSelected (record: Record<string, unknown>) {
    return selectedIds.value.has(getIdentity(record))
  }

  function toggleSelect (record: Record<string, unknown>) {
    const id = getIdentity(record)
    const next = new Set(selectedIds.value)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    selectedIds.value = next
  }

  function selectAll () {
    selectedIds.value = new Set(rows.value.map(getIdentity))
  }

  function clearSelection () {
    selectedIds.value = new Set()
  }

  function formatValue (name: string, value: unknown, record: Record<string, unknown>): string {
    const config = scopedFields.value[name]
    if (config?.table.format) {
      return config.table.format(value, record)
    }
    return String(value ?? '')
  }

  const tableContract = computed((): TableContract => ({
    page: page.value,
    limit: limit.value,
    total: total.value,
    sort: sortField.value,
    order: sortOrder.value,
    filters: filters.value,
    selected: selected.value,
    reload,
    setPage,
    setFilters: (f: Record<string, unknown>) => { filters.value = f },
    clearSelection,
  }))

  const actions = computed((): ResolvedAction[] => {
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
            table: tableContract.value,
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
            table: tableContract.value,
          })
        },
      }))
  }

  return {
    get rows () { return rows.value },
    get loading () { return loading.value },
    get empty () { return empty.value },
    get columns () { return columns.value },
    get availableColumns () { return availableColumns.value },
    get visibleColumns () { return visibleColumns.value },
    toggleColumn,
    get page () { return page.value },
    get limit () { return limit.value },
    get total () { return total.value },
    get totalPages () { return totalPages.value },
    setPage,
    setLimit,
    get sortField () { return sortField.value },
    get sortOrder () { return sortOrder.value },
    setSort,
    get filters () { return filters.value },
    setFilter,
    clearFilters,
    get selected () { return selected.value },
    isSelected,
    toggleSelect,
    selectAll,
    clearSelection,
    get actions () { return actions.value },
    getRowActions,
    reload,
    formatValue,
    getIdentity,
  }
}
