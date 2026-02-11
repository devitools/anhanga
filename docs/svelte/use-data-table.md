# useDataTable

Store for schema-driven data tables with pagination, sorting, filtering, and selection.

## Basic Usage

```svelte
<script lang="ts">
import { useDataTable } from '@anhanga/svelte'
import { Scope } from '@anhanga/core'

const tableStore = useDataTable({
  schema: PersonSchema.provide(),
  scope: Scope.index,
  handlers: personHandlers,
  hooks: personHooks,
  component: componentContract,
  translate: t,
})

let table = $derived($tableStore)
</script>

{#if table.loading}
  <p>Loading...</p>
{:else if table.empty}
  <p>No records found</p>
{:else}
  <table>
    <thead>
      <tr>
        {#each table.columns as col (col.name)}
          <th onclick={() => tableStore.setSort(col.name)}>
            {t(`person.fields.${col.name}`)}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each table.rows as row (tableStore.getIdentity(row))}
        <tr>
          {#each table.columns as col (col.name)}
            <td>{tableStore.formatValue(col.name, row[col.name], row)}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>

  <div>
    <button disabled={table.page <= 1} onclick={() => tableStore.setPage(table.page - 1)}>Previous</button>
    <span>Page {table.page} of {table.totalPages}</span>
    <button disabled={table.page >= table.totalPages} onclick={() => tableStore.setPage(table.page + 1)}>Next</button>
  </div>
{/if}
```

## Store API

`useDataTable` returns a **Readable store** extended with mutation methods. Use `$tableStore` to subscribe to the reactive snapshot and call methods on the store object itself.

```typescript
const tableStore = useDataTable({ /* ... */ })

// reactive snapshot via auto-subscription
let table = $derived($tableStore)

// mutation methods on the store
tableStore.setPage(2)
tableStore.setSort('name')
```

## Options

```typescript
interface UseDataTableOptions {
  schema: SchemaProvide
  scope: ScopeValue
  handlers?: Record<string, HandlerFn>
  hooks?: SchemaHooks
  context?: Record<string, unknown>
  component: ComponentContract
  pageSize?: number
  translate?: TranslateContract
}
```

| Option | Required | Description |
|--------|----------|-------------|
| `schema` | Yes | Output of `SchemaDefinition.provide()` |
| `scope` | Yes | Current scope (typically `Scope.index`) |
| `handlers` | No | Action handlers |
| `hooks` | No | Lifecycle hooks (fetch hooks provide data) |
| `component` | Yes | `ComponentContract` implementation |
| `pageSize` | No | Items per page (default varies) |
| `translate` | No | Translation function |

## Snapshot Properties

### Data

| Property | Type | Description |
|----------|------|-------------|
| `rows` | `Record<string, unknown>[]` | Current page data |
| `loading` | `boolean` | True while fetching data |
| `empty` | `boolean` | True if no rows |

### Columns

| Property | Type | Description |
|----------|------|-------------|
| `columns` | `ResolvedColumn[]` | Visible columns |
| `availableColumns` | `ResolvedColumn[]` | All available columns |
| `visibleColumns` | `string[]` | Names of visible columns |

### Pagination

| Property | Type | Description |
|----------|------|-------------|
| `page` | `number` | Current page |
| `limit` | `number` | Items per page |
| `total` | `number` | Total record count |
| `totalPages` | `number` | Total page count |

### Sorting

| Property | Type | Description |
|----------|------|-------------|
| `sortField` | `string \| undefined` | Current sort field |
| `sortOrder` | `'asc' \| 'desc' \| undefined` | Sort direction |

### Filtering

| Property | Type | Description |
|----------|------|-------------|
| `filters` | `Record<string, unknown>` | Active filters |

### Selection

| Property | Type | Description |
|----------|------|-------------|
| `selected` | `Record<string, unknown>[]` | Selected rows |

### Actions

| Property | Type | Description |
|----------|------|-------------|
| `actions` | `ResolvedAction[]` | Top-level actions (e.g., "Add") |

## Store Methods

Methods are called on the store object, not the snapshot:

| Method | Description |
|--------|-------------|
| `setPage(page)` | Navigate to page |
| `setLimit(limit)` | Change page size |
| `setSort(field)` | Toggle sort on field |
| `setFilter(field, value)` | Set a filter value |
| `clearFilters()` | Clear all filters |
| `toggleColumn(name)` | Toggle column visibility |
| `isSelected(record)` | Check if row is selected |
| `toggleSelect(record)` | Toggle row selection |
| `selectAll()` | Select all rows |
| `clearSelection()` | Clear selection |
| `getRowActions(record)` | Get actions for a specific row |
| `reload()` | Re-fetch current page data |
| `formatValue(name, value, record)` | Format a cell value using column config |
| `getIdentity(record)` | Get the identity key for a record |

## Column Configuration

Fields become table columns when marked with `.column()`:

```typescript
text().column()               // basic column
text().column().sortable()    // sortable
text().column().filterable()  // filterable
```

## Fetch Hooks

Table data is loaded through fetch hooks:

```typescript
const personHooks = PersonSchema.hooks({
  fetch: {
    [Scope.index]: async ({ params }) => {
      return personService.paginate(params)
    },
  },
})
```

The `params` object contains pagination, sorting, and filter state:

```typescript
interface PaginateParams {
  page: number
  limit: number
  sort?: string
  order?: 'asc' | 'desc'
  filters?: Record<string, unknown>
}
```

The hook expects a `PaginatedResult`:

```typescript
interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
```

## ResolvedColumn

```typescript
interface ResolvedColumn {
  name: string
  config: FieldConfig
  table: TableConfig
}
```
