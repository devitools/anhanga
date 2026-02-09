# useDataTable

Hook for schema-driven data tables with pagination, sorting, filtering, and selection.

## Basic Usage

```tsx
import { useDataTable } from '@anhanga/react'
import { Scope } from '@anhanga/core'

function PersonTable() {
  const table = useDataTable({
    schema: PersonSchema.provide(),
    scope: Scope.index,
    handlers: personHandlers,
    hooks: personHooks,
    component: componentContract,
    translate: t,
  })

  if (table.loading) return <Loading />
  if (table.empty) return <Empty />

  return (
    <div>
      <table>
        <thead>
          <tr>
            {table.columns.map((col) => (
              <th key={col.name} onClick={() => table.setSort(col.name)}>
                {t(`person.fields.${col.name}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={table.getIdentity(row)}>
              {table.columns.map((col) => (
                <td key={col.name}>{table.formatValue(col.name, row[col.name], row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        page={table.page}
        total={table.totalPages}
        onChange={table.setPage}
      />
    </div>
  )
}
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

## Return Value

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
| `toggleColumn(name)` | `function` | Toggle column visibility |

### Pagination

| Property | Type | Description |
|----------|------|-------------|
| `page` | `number` | Current page |
| `limit` | `number` | Items per page |
| `total` | `number` | Total record count |
| `totalPages` | `number` | Total page count |
| `setPage(page)` | `function` | Navigate to page |
| `setLimit(limit)` | `function` | Change page size |

### Sorting

| Property | Type | Description |
|----------|------|-------------|
| `sortField` | `string \| undefined` | Current sort field |
| `sortOrder` | `'asc' \| 'desc' \| undefined` | Sort direction |
| `setSort(field)` | `function` | Toggle sort on field |

### Filtering

| Property | Type | Description |
|----------|------|-------------|
| `filters` | `Record<string, unknown>` | Active filters |
| `setFilter(field, value)` | `function` | Set a filter value |
| `clearFilters()` | `function` | Clear all filters |

### Selection

| Property | Type | Description |
|----------|------|-------------|
| `selected` | `Record<string, unknown>[]` | Selected rows |
| `isSelected(record)` | `function` | Check if row is selected |
| `toggleSelect(record)` | `function` | Toggle row selection |
| `selectAll()` | `function` | Select all rows |
| `clearSelection()` | `function` | Clear selection |

### Actions

| Property | Type | Description |
|----------|------|-------------|
| `actions` | `ResolvedAction[]` | Top-level actions (e.g., "Add") |
| `getRowActions(record)` | `function` | Get actions for a specific row |

### Utilities

| Method | Description |
|--------|-------------|
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
