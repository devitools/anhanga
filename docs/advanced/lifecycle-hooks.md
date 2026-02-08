# Lifecycle Hooks

Hooks run at specific points in the form and table lifecycle. Bootstrap hooks initialize data when entering a scope. Fetch hooks provide paginated data for tables.

## Defining Hooks

```typescript
const personHooks = PersonSchema.hooks({
  bootstrap: {
    [Scope.view]: async ({ context, hydrate, schema }) => {
      const data = await personService.read(context.id)
      hydrate(data)
      for (const field of Object.values(schema)) {
        field.disabled = true
      }
    },
    [Scope.edit]: async ({ context, hydrate }) => {
      const data = await personService.read(context.id)
      hydrate(data)
    },
  },
  fetch: {
    [Scope.index]: async ({ params }) => {
      return personService.paginate(params)
    },
  },
})
```

## Bootstrap Hooks

Bootstrap hooks run once when a scope is entered. They're used to load existing data and configure field states.

### Context

```typescript
interface HookBootstrapContext {
  context: Record<string, unknown>
  hydrate(data: Record<string, unknown>): void
  schema: Record<string, FieldProxy>
  component: ComponentContract
}
```

| Property | Description |
|----------|-------------|
| `context` | Route params or external context (e.g., `{ id: '123' }`) |
| `hydrate(data)` | Populate form fields with loaded data |
| `schema` | Schema proxy — mutate field UI properties |
| `component` | Navigator, toast, dialog, loading contracts |

### Common Patterns

**Load and display existing record:**

```typescript
[Scope.edit]: async ({ context, hydrate }) => {
  const data = await personService.read(context.id)
  hydrate(data)
}
```

**View mode — load and disable all fields:**

```typescript
[Scope.view]: async ({ context, hydrate, schema }) => {
  const data = await personService.read(context.id)
  hydrate(data)
  for (const field of Object.values(schema)) {
    field.disabled = true
  }
}
```

**Show loading indicator:**

```typescript
[Scope.edit]: async ({ context, hydrate, component }) => {
  component.loading.show()
  try {
    const data = await personService.read(context.id)
    hydrate(data)
  } finally {
    component.loading.hide()
  }
}
```

## Fetch Hooks

Fetch hooks provide data for `useSchemaTable`. They're called whenever pagination, sorting, or filtering changes.

### Context

```typescript
interface HookFetchContext {
  params: PaginateParams
  component: ComponentContract
}
```

| Property | Description |
|----------|-------------|
| `params` | Pagination, sorting, and filter state |
| `component` | Component contracts |

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

### Expected Return

```typescript
interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
```

### Example

```typescript
fetch: {
  [Scope.index]: async ({ params }) => {
    return personService.paginate(params)
  },
}
```

## Passing Hooks to React

```typescript
const form = useSchemaForm({
  schema: PersonSchema.provide(),
  scope: Scope.edit,
  hooks: personHooks,
  context: { id: routeParams.id },
  component: componentContract,
})
```

The `context` option is passed through to the bootstrap hook's `context` property.

## Per-Scope Hooks

Each scope can have its own bootstrap hook. Only the hook matching the current scope runs:

```typescript
bootstrap: {
  [Scope.view]: async (ctx) => { /* runs in view scope */ },
  [Scope.edit]: async (ctx) => { /* runs in edit scope */ },
  // Scope.add has no hook — form starts with defaults
}
```
