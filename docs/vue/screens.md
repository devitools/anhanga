# Screens

This page shows how to build the 4 CRUD screens using vue-router and the `@anhanga/vue-quasar` components.

## Route Map

First, map each scope to its router path:

```typescript
// src/pages/product/@routes.ts
import { Scope, type ScopeRoute, type ScopeValue } from '@anhanga/core'

export const scopes: Record<ScopeValue, ScopeRoute> = {
  [Scope.index]: { path: '/product' },
  [Scope.add]: { path: '/product/add' },
  [Scope.view]: { path: '/product/view/:id' },
  [Scope.edit]: { path: '/product/edit/:id' },
}
```

This map is used by `useComponent` to resolve navigation paths when handlers call `component.navigator.push(...)`.

## Router Setup

Define the routes matching the scope map:

```typescript
// src/router.ts
import { createRouter, createWebHistory } from 'vue-router'
import ProductList from './pages/ProductList.vue'
import ProductAdd from './pages/ProductAdd.vue'
import ProductView from './pages/ProductView.vue'
import ProductEdit from './pages/ProductEdit.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/product' },
    { path: '/product', component: ProductList },
    { path: '/product/add', component: ProductAdd },
    { path: '/product/view/:id', component: ProductView },
    { path: '/product/edit/:id', component: ProductEdit },
  ],
})
```

## List Screen

The list screen uses `DataTable` with `Scope.index`. It renders columns marked with `.column()` in the schema and displays row actions (view, edit, destroy) and top actions (add):

```vue
<!-- src/pages/ProductList.vue -->
<template>
  <DataPage :domain="'product'" :scope="Scope.index">
    <DataTable
      :schema="product"
      :scope="Scope.index"
      :handlers="productHandlers"
      :hooks="productHooks"
      :component="component"
      :page-size="10"
    />
  </DataPage>
</template>

<script setup lang="ts">
import { productHandlers, productHooks } from '@/setup'
import { Scope } from '@anhanga/core'
import { ProductSchema } from '@/domain/product/schema'
import { DataPage, DataTable, useComponent } from '@anhanga/vue-quasar'
import { scopes } from './product/@routes'

const product = ProductSchema.provide()
const component = useComponent(Scope.index, scopes)
</script>
```

`DataTable` automatically:
- Calls the `fetch` hook (`Scope.index`) to load paginated data
- Renders columns for fields marked with `.column()`
- Renders row actions (view, edit, destroy) and top actions (add) based on scope
- Handles pagination, sorting, and selection

## Add Screen

The add screen uses `DataForm` with `Scope.add`. Fields marked with `.excludeScopes(Scope.add)` (like `id`) are hidden. Events wire up reactive behavior:

```vue
<!-- src/pages/ProductAdd.vue -->
<template>
  <DataPage :domain="'product'" :scope="Scope.add">
    <DataForm
      :schema="product"
      :scope="Scope.add"
      :events="productEvents"
      :handlers="productHandlers"
      :hooks="productHooks"
      :component="component"
    />
  </DataPage>
</template>

<script setup lang="ts">
import { productHandlers, productHooks } from '@/setup'
import { Scope } from '@anhanga/core'
import { productEvents, ProductSchema } from '@/domain/product/schema'
import { DataForm, DataPage, useComponent } from '@anhanga/vue-quasar'
import { scopes } from './product/@routes'

const product = ProductSchema.provide()
const component = useComponent(Scope.add, scopes)
</script>
```

`DataForm` automatically:
- Renders fields organized by groups (`info`, `pricing`)
- Shows footer actions for `Scope.add` (create, cancel)
- Validates required fields, minLength, min/max before calling `create`
- Fires events when fields change (e.g., toggling `active` disables pricing fields)

## View Screen

The view screen loads an existing record by ID and renders it read-only. The `bootstrap` hook for `Scope.view` hydrates the form and disables all fields:

```vue
<!-- src/pages/ProductView.vue -->
<template>
  <DataPage :domain="'product'" :scope="Scope.view">
    <DataForm
      :schema="product"
      :scope="Scope.view"
      :events="productEvents"
      :handlers="productHandlers"
      :hooks="productHooks"
      :context="{ id }"
      :component="component"
    />
  </DataPage>
</template>

<script setup lang="ts">
import { productHandlers, productHooks } from '@/setup'
import { Scope } from '@anhanga/core'
import { productEvents, ProductSchema } from '@/domain/product/schema'
import { DataForm, DataPage, useComponent } from '@anhanga/vue-quasar'
import { useRoute } from 'vue-router'
import { scopes } from './product/@routes'

const route = useRoute()
const id = route.params.id as string
const product = ProductSchema.provide()
const component = useComponent(Scope.view, scopes)
</script>
```

The `:context="{ id }"` prop passes the route parameter to the `bootstrap` hook, which uses it to load the record via `service.read(id)`.

## Edit Screen

The edit screen is nearly identical to view, but uses `Scope.edit` — so the bootstrap hook hydrates the form **without** disabling fields, and the footer shows update/cancel/destroy actions:

```vue
<!-- src/pages/ProductEdit.vue -->
<template>
  <DataPage :domain="'product'" :scope="Scope.edit">
    <DataForm
      :schema="product"
      :scope="Scope.edit"
      :events="productEvents"
      :handlers="productHandlers"
      :hooks="productHooks"
      :context="{ id }"
      :component="component"
    />
  </DataPage>
</template>

<script setup lang="ts">
import { productHandlers, productHooks } from '@/setup'
import { Scope } from '@anhanga/core'
import { productEvents, ProductSchema } from '@/domain/product/schema'
import { DataForm, DataPage, useComponent } from '@anhanga/vue-quasar'
import { useRoute } from 'vue-router'
import { scopes } from './product/@routes'

const route = useRoute()
const id = route.params.id as string
const product = ProductSchema.provide()
const component = useComponent(Scope.edit, scopes)
</script>
```

## Pattern Summary

All 4 screens follow the same pattern:

1. `useComponent(scope, scopes)` — creates the component contract for navigation, dialogs, toasts
2. `<DataPage>` — layout wrapper with title
3. `<DataForm>` or `<DataTable>` — the schema-driven component

The **scope** is the only thing that changes between screens. The schema, handlers, hooks, and events are shared — the framework resolves which fields, actions, and behaviors apply to each scope automatically.

## Next Steps

- [Testing](/vue/testing) — test your app with Vitest
