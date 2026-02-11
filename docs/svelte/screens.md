# Screens

This page shows how to build the 4 CRUD screens using SvelteKit file-based routing and the `@anhanga/sveltekit` components.

## Route Map

First, map each scope to its SvelteKit route path:

```typescript
// src/lib/routes/product.ts
import { Scope, type ScopeRoute, type ScopeValue } from '@anhanga/core'

export const scopes: Record<ScopeValue, ScopeRoute> = {
  [Scope.index]: { path: '/product' },
  [Scope.add]: { path: '/product/add' },
  [Scope.view]: { path: '/product/:id' },
  [Scope.edit]: { path: '/product/:id/edit' },
}
```

This map is used by `createComponent` to resolve navigation paths when handlers call `component.navigator.push(...)`.

## Layout

The root layout imports global styles and settings as side-effects:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
import '../app.css'
import '@anhanga/sveltekit/styles.css'
import '$lib/settings/icons'
import '$lib/settings/i18n-setup'

let { children } = $props()
</script>

<div style="max-width: 900px; margin: 0 auto; padding: 16px;">
  {@render children()}
</div>
```

SvelteKit requires disabling SSR because `localStorage` is not available server-side:

```typescript
// src/routes/+layout.ts
export const ssr = false
```

## List Screen

The list screen uses `DataTable` with `Scope.index`. It renders columns marked with `.column()` in the schema and displays row actions (view, edit, destroy) and top actions (add):

```svelte
<!-- src/routes/product/+page.svelte -->
<script lang="ts">
import { goto } from '$app/navigation'
import { Scope } from '@anhanga/core'
import { ProductSchema } from '@anhanga/demo'
import { DataTable, DataPage, createComponent } from '@anhanga/sveltekit'
import { productHandlers, productHooks } from '$lib/setup'
import { scopes } from '$lib/routes/product'

const product = ProductSchema.provide()
const component = createComponent(Scope.index, scopes, goto)
</script>

<DataPage domain={product.domain} scope={Scope.index}>
  <DataTable
    schema={product}
    scope={Scope.index}
    handlers={productHandlers}
    hooks={productHooks}
    {component}
    pageSize={10}
  />
</DataPage>
```

`DataTable` automatically:
- Calls the `fetch` hook (`Scope.index`) to load paginated data
- Renders columns for fields marked with `.column()`
- Renders row actions (view, edit, destroy) and top actions (add) based on scope
- Handles pagination, sorting, and selection

## Add Screen

The add screen uses `DataForm` with `Scope.add`. Fields marked with `.excludeScopes(Scope.add)` (like `id`) are hidden. Events wire up reactive behavior:

```svelte
<!-- src/routes/product/add/+page.svelte -->
<script lang="ts">
import { goto } from '$app/navigation'
import { Scope } from '@anhanga/core'
import { productEvents, ProductSchema } from '@anhanga/demo'
import { createComponent, DataForm, DataPage } from '@anhanga/sveltekit'
import { productHandlers, productHooks } from '$lib/setup'
import { scopes } from '$lib/routes/product'

const product = ProductSchema.provide()
const component = createComponent(Scope.add, scopes, goto)
</script>

<DataPage domain={product.domain} scope={Scope.add}>
  <DataForm
    schema={product}
    scope={Scope.add}
    events={productEvents}
    handlers={productHandlers}
    hooks={productHooks}
    {component}
  />
</DataPage>
```

`DataForm` automatically:
- Renders fields organized by groups (`info`, `pricing`)
- Shows footer actions for `Scope.add` (create, cancel)
- Validates required fields, minLength, min/max before calling `create`
- Fires events when fields change (e.g., toggling `active` disables pricing fields)

## View Screen

The view screen loads an existing record by ID and renders it read-only. The `bootstrap` hook for `Scope.view` hydrates the form and disables all fields:

```svelte
<!-- src/routes/product/[id]/+page.svelte -->
<script lang="ts">
import { goto } from '$app/navigation'
import { page } from '$app/state'
import { Scope } from '@anhanga/core'
import { productEvents, ProductSchema } from '@anhanga/demo'
import { createComponent, DataForm, DataPage } from '@anhanga/sveltekit'
import { productHandlers, productHooks } from '$lib/setup'
import { scopes } from '$lib/routes/product'

const id = page.params.id
const product = ProductSchema.provide()
const component = createComponent(Scope.view, scopes, goto)
</script>

<DataPage domain={product.domain} scope={Scope.view}>
  <DataForm
    schema={product}
    scope={Scope.view}
    events={productEvents}
    handlers={productHandlers}
    hooks={productHooks}
    context={{ id }}
    {component}
  />
</DataPage>
```

The `context={{ id }}` prop passes the route parameter to the `bootstrap` hook, which uses it to load the record via `service.read(id)`.

## Edit Screen

The edit screen is nearly identical to view, but uses `Scope.edit` — so the bootstrap hook hydrates the form **without** disabling fields, and the footer shows update/cancel/destroy actions:

```svelte
<!-- src/routes/product/[id]/edit/+page.svelte -->
<script lang="ts">
import { goto } from '$app/navigation'
import { page } from '$app/state'
import { Scope } from '@anhanga/core'
import { productEvents, ProductSchema } from '@anhanga/demo'
import { createComponent, DataForm, DataPage } from '@anhanga/sveltekit'
import { productHandlers, productHooks } from '$lib/setup'
import { scopes } from '$lib/routes/product'

const id = page.params.id
const product = ProductSchema.provide()
const component = createComponent(Scope.edit, scopes, goto)
</script>

<DataPage domain={product.domain} scope={Scope.edit}>
  <DataForm
    schema={product}
    scope={Scope.edit}
    events={productEvents}
    handlers={productHandlers}
    hooks={productHooks}
    context={{ id }}
    {component}
  />
</DataPage>
```

## Pattern Summary

All 4 screens follow the same pattern:

1. `createComponent(scope, scopes, goto)` — creates the component contract for navigation, dialogs, toasts
2. `<DataPage>` — layout wrapper with title
3. `<DataForm>` or `<DataTable>` — the schema-driven component

The **scope** is the only thing that changes between screens. The schema, handlers, hooks, and events are shared — the framework resolves which fields, actions, and behaviors apply to each scope automatically.

## Next Steps

- [Testing](/svelte/testing) — test your app with Vitest
