# @anhanga/vue API

Complete API reference for the Vue integration package.

## Composables

### useDataForm()

```typescript
function useDataForm(options: UseDataFormOptions): UseDataFormReturn
```

Main composable for schema-driven forms.

**Options:**

```typescript
interface UseDataFormOptions {
  schema: SchemaProvide
  scope: ScopeValue
  events?: Record<string, Record<string, EventFn>>
  handlers?: Record<string, HandlerFn>
  hooks?: SchemaHooks
  context?: Record<string, unknown>
  component: ComponentContract
  initialValues?: Record<string, unknown>
  translate?: TranslateContract
}
```

**Returns:**

```typescript
interface UseDataFormReturn {
  loading: boolean
  state: Record<string, unknown>
  fields: ResolvedField[]
  groups: FieldGroup[]
  ungrouped: ResolvedField[]
  sections: FormSection[]
  actions: ResolvedAction[]
  errors: Record<string, string[]>
  dirty: boolean
  valid: boolean
  setValue(field: string, value: unknown): void
  setValues(values: Record<string, unknown>): void
  reset(values?: Record<string, unknown>): void
  validate(): boolean
  getFieldProps(name: string): FieldRendererProps
}
```

See [useDataForm](/vue/use-data-form) for detailed usage.

---

### useDataTable()

```typescript
function useDataTable(options: UseDataTableOptions): UseDataTableReturn
```

Composable for schema-driven data tables.

**Options:**

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

**Returns:**

```typescript
interface UseDataTableReturn {
  rows: Record<string, unknown>[]
  loading: boolean
  empty: boolean
  columns: ResolvedColumn[]
  availableColumns: ResolvedColumn[]
  visibleColumns: string[]
  toggleColumn(name: string): void
  page: number
  limit: number
  total: number
  totalPages: number
  setPage(page: number): void
  setLimit(limit: number): void
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  setSort(field: string): void
  filters: Record<string, unknown>
  setFilter(field: string, value: unknown): void
  clearFilters(): void
  selected: Record<string, unknown>[]
  isSelected(record: Record<string, unknown>): boolean
  toggleSelect(record: Record<string, unknown>): void
  selectAll(): void
  clearSelection(): void
  actions: ResolvedAction[]
  getRowActions(record: Record<string, unknown>): ResolvedAction[]
  reload(): void
  formatValue(name: string, value: unknown, record: Record<string, unknown>): string
  getIdentity(record: Record<string, unknown>): string
}
```

See [useDataTable](/vue/use-data-table) for detailed usage.

---

## Registry

### registerRenderers()

```typescript
function registerRenderers(renderers: Record<string, FieldRenderer>): void
```

Register field renderers in the global registry.

### getRenderer()

```typescript
function getRenderer(component: string): FieldRenderer | undefined
```

Get a registered renderer by component name.

### createRegistry()

```typescript
function createRegistry(): RendererRegistry
```

Create an isolated renderer registry.

```typescript
interface RendererRegistry {
  register(renderers: Record<string, FieldRenderer>): void
  get(component: string): FieldRenderer | undefined
}
```

### FieldRenderer

```typescript
import type { Component } from 'vue'

type FieldRenderer = Component<FieldRendererProps>
```

---

## Validation

### registerValidator()

```typescript
function registerValidator(name: string, fn: ValidatorFn): void
```

Register a custom validator.

### validateField()

```typescript
function validateField(
  value: unknown,
  rules: ValidationRule[],
  translate?: TranslateContract,
): string[]
```

Validate a single field value against its rules.

### validateAllFields()

```typescript
function validateAllFields(
  state: Record<string, unknown>,
  fields: Record<string, FieldConfig>,
  translate?: TranslateContract,
): Record<string, string[]>
```

Validate all fields in the form state.

### ValidatorFn

```typescript
type ValidatorFn = (
  value: unknown,
  params: Record<string, unknown> | undefined,
  translate?: TranslateContract,
) => string | null
```

---

## Proxy

### createStateProxy()

```typescript
function createStateProxy(snapshot: Record<string, unknown>): StateProxyResult
```

```typescript
interface StateProxyResult {
  proxy: Record<string, unknown>
  getChanges(): Record<string, unknown>
}
```

### createSchemaProxy()

```typescript
function createSchemaProxy(
  fields: Record<string, FieldConfig>,
  currentOverrides: Record<string, Partial<FieldProxy>>,
): SchemaProxyResult
```

```typescript
interface SchemaProxyResult {
  proxy: Record<string, FieldProxy>
  getOverrides(): Record<string, Partial<FieldProxy>>
}
```

---

## Translation

### resolveFieldLabel()

```typescript
function resolveFieldLabel(
  t: TranslateContract,
  domain: string,
  field: string,
  state: string,
): string
```

Resolves a field label. If `state` is non-empty, tries `{domain}.fields.{field}[{state}]`.

### resolveGroupLabel()

```typescript
function resolveGroupLabel(
  t: TranslateContract,
  domain: string,
  group: string,
): string
```

Resolves `{domain}.groups.{group}`.

### resolveActionLabel()

```typescript
function resolveActionLabel(
  t: TranslateContract,
  domain: string,
  action: string,
): string
```

Tries `{domain}.actions.{action}`, falls back to `common.actions.{action}`.

### TranslateContract

```typescript
type TranslateContract = (key: string) => string
```

---

## Types

### FieldRendererProps

```typescript
interface FieldRendererProps {
  domain: string
  name: string
  value: unknown
  config: FieldConfig
  proxy: FieldProxy
  errors: string[]
  scope: ScopeValue
  onChange(value: unknown): void
  onBlur(): void
  onFocus(): void
}
```

### ResolvedField

```typescript
interface ResolvedField {
  name: string
  config: FieldConfig
  proxy: FieldProxy
}
```

### ResolvedAction

```typescript
interface ResolvedAction {
  name: string
  config: ActionConfig
  execute(): void | Promise<void>
}
```

### ResolvedColumn

```typescript
interface ResolvedColumn {
  name: string
  config: FieldConfig
  table: TableConfig
}
```

### FieldGroup

```typescript
interface FieldGroup {
  name: string
  config: GroupConfig
  fields: ResolvedField[]
}
```

### FormSection

```typescript
type FormSection =
  | { kind: 'group'; name: string; config: GroupConfig; fields: ResolvedField[] }
  | { kind: 'ungrouped'; fields: ResolvedField[] }
```
