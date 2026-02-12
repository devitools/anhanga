# @ybyra/core API

Complete API reference for the core package.

## Schema

### configure()

```typescript
function configure<BF>(base: BaseSchemaConfig<BF>): SchemaFactory<BF>
```

Creates a `SchemaFactory` with base configuration inherited by all domain schemas.

### SchemaFactory

```typescript
interface SchemaFactory<BF> {
  create<F>(domain: string, options: SchemaOptions<F>): SchemaDefinition<BF & F>
}
```

### SchemaDefinition

```typescript
class SchemaDefinition<F> {
  readonly domain: string
  get identity(): string | string[]
  get display(): string | ((record: Record<string, unknown>) => string)
  get scopes(): ScopeValue[]

  getFields(): Record<string, FieldConfig>
  getGroups(): Record<string, GroupConfig>
  getActions(): Record<string, ActionConfig>

  extend<U>(domain: string, extra: Partial<SchemaOptions<U>>): SchemaDefinition<F & U>
  pick<K extends keyof F>(...keys: K[]): SchemaDefinition<Pick<F, K>>
  omit<K extends keyof F>(...keys: K[]): SchemaDefinition<Omit<F, K>>

  events(bindings: SchemaEvents<F>): SchemaEvents<F>
  handlers(bindings: SchemaHandlers<F>): SchemaHandlers<F>
  hooks(bindings: SchemaHooks<F>): SchemaHooks<F>

  provide(): SchemaProvide
}
```

### BaseSchemaConfig

```typescript
interface BaseSchemaConfig<BF> {
  identity: string | string[]
  display?: string | ((record: Record<string, unknown>) => string)
  scopes: ScopeValue[]
  fields?: Record<string, FieldDefinition<unknown>>
  groups?: Record<string, GroupDefinition>
  actions?: Record<string, ActionDefinition>
  handlers?: Record<string, HandlerFn>
}
```

### SchemaProvide

```typescript
interface SchemaProvide {
  domain: string
  identity: string | string[]
  display?: string | ((record: Record<string, unknown>) => string)
  scopes: ScopeValue[]
  groups: Record<string, GroupConfig>
  fields: Record<string, FieldConfig>
  actions: Record<string, ActionConfig>
}
```

### InferRecord

```typescript
type InferRecord<S> = { [K in keyof S['fields']]: /* inferred from field data type */ }
```

---

## Field Factories

### text()

```typescript
function text(attrs?: Record<string, unknown>): TextFieldDefinition
```

**Methods:** `kind(kind)`, `minLength(n)`, `maxLength(n)`, `pattern(regex, message?)`

### number()

```typescript
function number(attrs?: Record<string, unknown>): NumberFieldDefinition
```

**Methods:** `min(n)`, `max(n)`, `precision(p)`

### currency()

```typescript
function currency(attrs?: Record<string, unknown>): CurrencyFieldDefinition
```

**Methods:** `min(n)`, `max(n)`, `precision(p)`, `prefix(p)`

### date()

```typescript
function date(attrs?: Record<string, unknown>): DateFieldDefinition
```

**Methods:** `min(d)`, `max(d)`

### datetime()

```typescript
function datetime(attrs?: Record<string, unknown>): DatetimeFieldDefinition
```

**Methods:** `min(d)`, `max(d)`

### toggle()

```typescript
function toggle(attrs?: Record<string, unknown>): ToggleFieldDefinition
```

### checkbox()

```typescript
function checkbox(attrs?: Record<string, unknown>): CheckboxFieldDefinition
```

### select()

```typescript
function select<V>(attrs?: Record<string, unknown>): SelectFieldDefinition<V>
```

### file()

```typescript
function file(attrs?: Record<string, unknown>): FileFieldDefinition
```

**Methods:** `accept(types)`, `maxSize(bytes)`

### image()

```typescript
function image(attrs?: Record<string, unknown>): FileFieldDefinition
```

**Methods:** `accept(types)`, `maxSize(bytes)`

---

## Common Field Methods

All field types inherit from `FieldDefinition<T>`:

| Method | Signature | Description |
|--------|-----------|-------------|
| `width` | `(w: number) => this` | Form width (0–100) |
| `height` | `(h: number) => this` | Form height |
| `hidden` | `() => this` | Hide the field |
| `disabled` | `() => this` | Disable the field |
| `required` | `() => this` | Mark as required |
| `order` | `(o: number) => this` | Sort order |
| `default` | `(value: T) => this` | Default value |
| `group` | `(name: string) => this` | Assign to a group |
| `scopes` | `(...scopes: ScopeValue[]) => this` | Whitelist scopes |
| `excludeScopes` | `(...scopes: ScopeValue[]) => this` | Blacklist scopes |
| `states` | `(...states: string[]) => this` | Allowed visual states |
| `column` | `(config?: Partial<TableConfig>) => this` | Show as table column |
| `filterable` | `() => this` | Enable table filtering |
| `sortable` | `(sortable?: boolean) => this` | Enable table sorting |

---

## action()

```typescript
function action(): ActionDefinition
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `icon` | `(icon: IconValue) => this` | Set icon |
| `primary` | `() => this` | Primary variant |
| `secondary` | `() => this` | Secondary variant |
| `destructive` | `() => this` | Destructive variant |
| `warning` | `() => this` | Warning variant |
| `success` | `() => this` | Success variant |
| `info` | `() => this` | Info variant |
| `muted` | `() => this` | Muted variant |
| `accent` | `() => this` | Accent variant |
| `positions` | `(...p: PositionValue[]) => this` | Display positions |
| `start` | `() => this` | Align to start |
| `end` | `() => this` | Align to end |
| `order` | `(o: number) => this` | Sort order |
| `hidden` | `(h?: boolean) => this` | Hide action |
| `scopes` | `(...s: ScopeValue[]) => this` | Whitelist scopes |
| `excludeScopes` | `(...s: ScopeValue[]) => this` | Blacklist scopes |

---

## group()

```typescript
function group(): GroupDefinition
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `icon` | `(icon: IconValue) => this` | Set icon |

---

## Enums

### Scope

```typescript
const Scope = {
  index: 'index',
  add: 'add',
  view: 'view',
  edit: 'edit',
} as const
```

### Position

```typescript
const Position = {
  top: 'top',
  footer: 'footer',
  floating: 'floating',
  row: 'row',
} as const
```

### Text

```typescript
const Text = {
  Email: 'email',
  Phone: 'phone',
  Url: 'url',
  Cpf: 'cpf',
  Cnpj: 'cnpj',
  Cep: 'cep',
  Street: 'street',
  City: 'city',
} as const
```

### Icon

```typescript
const Icon = {
  Save: 'save',
  Close: 'close',
  Trash: 'trash',
  Send: 'send',
  Edit: 'edit',
  Add: 'add',
  Search: 'search',
  View: 'view',
  List: 'list',
  Person: 'person',
  Map: 'map',
} as const
```

---

## Contracts

### ServiceContract

```typescript
interface ServiceContract<T = Record<string, unknown>> {
  paginate(params: PaginateParams): Promise<PaginatedResult<T>>
  read(id: string | number | Record<string, unknown>): Promise<T>
  create(data: Partial<T>): Promise<T>
  update(id: string | number | Record<string, unknown>, data: Partial<T>): Promise<T>
  destroy(id: string | number | Record<string, unknown>): Promise<void>
}
```

### ComponentContract

```typescript
interface ComponentContract {
  scope: ScopeValue
  scopes: Record<ScopeValue, ScopeRoute>
  reload(): void
  navigator: NavigatorContract
  dialog: DialogContract
  toast: ToastContract
  loading: LoadingContract
}
```

### FormContract

```typescript
interface FormContract {
  errors: Record<string, string[]>
  dirty: boolean
  valid: boolean
  validate(): boolean
  reset(values?: Record<string, unknown>): void
}
```

### TableContract

```typescript
interface TableContract {
  page: number
  limit: number
  total: number
  sort?: string
  order?: 'asc' | 'desc'
  filters: Record<string, unknown>
  selected: Record<string, unknown>[]
  reload(): void
  setPage(page: number): void
  setFilters(filters: Record<string, unknown>): void
  clearSelection(): void
}
```

### NavigatorContract

```typescript
interface NavigatorContract {
  push(path: string, params?: Record<string, unknown>): void
  back(): void
  replace(path: string, params?: Record<string, unknown>): void
}
```

### DialogContract

```typescript
interface DialogContract {
  confirm(message: string): Promise<boolean>
  alert(message: string): Promise<void>
}
```

### ToastContract

```typescript
interface ToastContract {
  success(message: string): void
  error(message: string): void
  warning(message: string): void
  info(message: string): void
}
```

### LoadingContract

```typescript
interface LoadingContract {
  show(): void
  hide(): void
}
```

---

## Persistence

### createService()

```typescript
function createService(schema: SchemaLike, persistence: PersistenceContract): ServiceContract
```

### extractPersistenceMeta()

```typescript
function extractPersistenceMeta(schema: SchemaLike): PersistenceMeta
```

### PersistenceContract

```typescript
interface PersistenceContract {
  initialize(meta: PersistenceMeta): Promise<void>
  create(meta: PersistenceMeta, data: Record<string, unknown>): Promise<Record<string, unknown>>
  read(meta: PersistenceMeta, id: string | number): Promise<Record<string, unknown> | null>
  update(meta: PersistenceMeta, id: string | number, data: Record<string, unknown>): Promise<Record<string, unknown>>
  destroy(meta: PersistenceMeta, id: string | number): Promise<void>
  search(meta: PersistenceMeta, params: PaginateParams): Promise<PaginatedResult<Record<string, unknown>>>
}
```

### PersistenceMeta

```typescript
interface PersistenceMeta {
  resource: string
  identity: string
  fields: Record<string, { dataType: string }>
}
```

---

## Configuration Types

### FieldConfig

```typescript
interface FieldConfig {
  component: string
  dataType: string
  kind?: string
  attrs: Record<string, unknown>
  form: FormConfig
  table: TableConfig
  validations: ValidationRule[]
  scopes: ScopeValue[] | null
  group?: string
  states: string[]
  defaultValue: unknown
}
```

### FormConfig

```typescript
interface FormConfig {
  width: number
  height: number
  hidden: boolean
  disabled: boolean
  order: number
}
```

### TableConfig

```typescript
interface TableConfig {
  show: boolean
  width: string | number
  sortable: boolean
  filterable: boolean
  order: number
  format?: (value: unknown, record: Record<string, unknown>) => string
  align?: 'left' | 'center' | 'right'
}
```

### ValidationRule

```typescript
interface ValidationRule {
  rule: string
  params?: Record<string, unknown>
  message?: string
}
```

### FieldProxy

```typescript
interface FieldProxy {
  width: number
  height: number
  hidden: boolean
  disabled: boolean
  state: string
}
```

### PaginateParams

```typescript
interface PaginateParams {
  page: number
  limit: number
  sort?: string
  order?: 'asc' | 'desc'
  filters?: Record<string, unknown>
}
```

### PaginatedResult

```typescript
interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
```
