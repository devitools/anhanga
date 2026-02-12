# Hooks

## What are Hooks

Hooks define **data lifecycle** operations — how data is loaded and fetched. They are defined using `Schema.hooks()`.

## Hook Types

| Hook               | When it fires           | Purpose                                              |
|--------------------|-------------------------|------------------------------------------------------|
| `bootstrap[scope]` | When a form mounts      | Load initial data (e.g., fetch record for edit/view) |
| `fetch[scope]`     | When a table needs data | Paginate/load data for listings                      |

## Default Hook Pattern

Most projects define a `createDefault()` factory in `settings/hooks.ts`:

```ts-no-check
import type { ServiceContract, BootstrapHookContext, FetchHookContext } from "@ybyra/core";
import { Scope } from "@ybyra/core";

export function createDefault(service: ServiceContract) {
  return {
    bootstrap: {
      async [Scope.view]({ context, schema, hydrate }: BootstrapHookContext) {
        if (!context.id) return;
        const data = await service.read(context.id as string);
        hydrate(data);
        for (const field of Object.values(schema)) {
          field.disabled = true;
        }
      },
      async [Scope.edit]({ context, hydrate }: BootstrapHookContext) {
        if (!context.id) return;
        const data = await service.read(context.id as string);
        hydrate(data);
      },
    },
    fetch: {
      async [Scope.index]({ params }: FetchHookContext) {
        return service.paginate(params);
      },
    },
  };
}
```

## Domain-Specific Hooks

Each domain extends the defaults:

```ts-no-check
import type { ServiceContract } from "@ybyra/core";
import { ProductSchema } from "@/domain/product/schema";
import { createDefault } from "@/settings/hooks";

export function createProductHooks(service: ServiceContract) {
  return ProductSchema.hooks(createDefault(service));
}
```

## Bootstrap Hook Context

| Property  | Type                         | Description                                   |
|-----------|------------------------------|-----------------------------------------------|
| `context` | `Record<string, unknown>`    | Route params (e.g., `{ id: "123" }`)          |
| `schema`  | `Record<string, FieldProxy>` | Schema proxy (can set disabled, hidden, etc.) |
| `hydrate` | `(data: Record) => void`     | Function to populate form state with data     |

### Bootstrap patterns:

```ts-no-check
// View scope — load data and disable all fields
async [Scope.view]({ context, schema, hydrate }: BootstrapHookContext) {
  const data = await service.read(context.id as string);
  hydrate(data);
  for (const field of Object.values(schema)) {
    field.disabled = true;
  }
},

// Edit scope — load data only
async [Scope.edit]({ context, hydrate }: BootstrapHookContext) {
  const data = await service.read(context.id as string);
  hydrate(data);
},
```

## Fetch Hook Context

| Property | Type             | Description                                       |
|----------|------------------|---------------------------------------------------|
| `params` | `PaginateParams` | Pagination parameters (page, limit, sort, filter) |

### Fetch pattern:

```ts-no-check
// Index scope — paginate data
async [Scope.index]({ params }: FetchHookContext) {
  return service.paginate(params);
  // Returns: { data: T[], total: number }
},
```

## Key Rules

1. **Hooks are created via factory functions** — `createProductHooks(service)`
2. **Use `Schema.hooks()`** — ensures type safety
3. **Bootstrap hooks are keyed by scope** — `bootstrap: { [Scope.view]: ... }`
4. **Fetch hooks are keyed by scope** — `fetch: { [Scope.index]: ... }`
5. **View scope should disable all fields** — iterate `schema` and set `disabled = true`
6. **Use `hydrate()`** to populate form state — don't assign fields manually
7. **Context contains route params** — typically `{ id: "..." }` for view/edit
