# Screens

This page shows how to build the 4 CRUD screens using react-router-dom and the `@ybyra/react-web` components.

## Route Map

First, map each scope to its router path:

```typescript
// src/pages/product/@routes.ts
import { Scope, type ScopeRoute, type ScopeValue } from '@ybyra/core'

export const scopes: Record<ScopeValue, ScopeRoute> = {
  [Scope.index]: { path: '/product' },
  [Scope.add]: { path: '/product/add' },
  [Scope.view]: { path: '/product/view/:id' },
  [Scope.edit]: { path: '/product/edit/:id' },
}
```

This map is used by `useComponent` to resolve navigation paths when handlers call `component.navigator.push(...)`.

## App Setup

The root `App` component sets up react-router-dom routes and wraps the app with `withProviders`:

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { withProviders } from '@ybyra/react-web'
import { ProductList } from './pages/product/ProductList'
import { ProductAdd } from './pages/product/ProductAdd'
import { ProductView } from './pages/product/ProductView'
import { ProductEdit } from './pages/product/ProductEdit'
import { theme } from './settings/theme'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/product" replace />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="/product/add" element={<ProductAdd />} />
        <Route path="/product/view/:id" element={<ProductView />} />
        <Route path="/product/edit/:id" element={<ProductEdit />} />
      </Routes>
    </BrowserRouter>
  )
}

export default withProviders(App, { theme })
```

## List Screen

The list screen uses `DataTable` with `Scope.index`. It renders columns marked with `.column()` in the schema and displays row actions (view, edit, destroy) and top actions (add):

```tsx
// src/pages/product/ProductList.tsx
import { Scope } from '@ybyra/core'
import { ProductSchema } from '../../domain/product/schema'
import { DataTable, DataPage, useComponent } from '@ybyra/react-web'
import { productHandlers, productHooks } from '../../setup'
import { scopes } from './@routes'
import { useNavigate } from 'react-router-dom'

export function ProductList() {
  const navigate = useNavigate()
  const component = useComponent(Scope.index, scopes, navigate)
  const product = ProductSchema.provide()

  return (
    <DataPage domain={product.domain} scope={Scope.index}>
      <DataTable
        schema={product}
        scope={Scope.index}
        handlers={productHandlers}
        hooks={productHooks}
        component={component}
        pageSize={10}
      />
    </DataPage>
  )
}
```

`DataTable` automatically:
- Calls the `fetch` hook (`Scope.index`) to load paginated data
- Renders columns for fields marked with `.column()`
- Renders row actions (view, edit, destroy) and top actions (add) based on scope
- Handles pagination, sorting, and selection

## Add Screen

The add screen uses `DataForm` with `Scope.add`. Fields marked with `.excludeScopes(Scope.add)` (like `id`) are hidden. Events wire up reactive behavior:

```tsx
// src/pages/product/ProductAdd.tsx
import { Scope } from '@ybyra/core'
import { ProductSchema } from '../../domain/product/schema'
import { productEvents } from '../../domain/product/events'
import { DataForm, DataPage, useComponent } from '@ybyra/react-web'
import { productHandlers, productHooks } from '../../setup'
import { scopes } from './@routes'
import { useNavigate } from 'react-router-dom'

export function ProductAdd() {
  const navigate = useNavigate()
  const component = useComponent(Scope.add, scopes, navigate)
  const product = ProductSchema.provide()

  return (
    <DataPage domain={product.domain} scope={Scope.add}>
      <DataForm
        schema={product}
        scope={Scope.add}
        events={productEvents}
        handlers={productHandlers}
        hooks={productHooks}
        component={component}
      />
    </DataPage>
  )
}
```

`DataForm` automatically:
- Renders fields organized by groups (`info`, `pricing`)
- Shows footer actions for `Scope.add` (create, cancel)
- Validates required fields, minLength, min/max before calling `create`
- Fires events when fields change (e.g., toggling `active` disables pricing fields)

## View Screen

The view screen loads an existing record by ID and renders it read-only. The `bootstrap` hook for `Scope.view` hydrates the form and disables all fields:

```tsx
// src/pages/product/ProductView.tsx
import { useParams } from 'react-router-dom'
import { Scope } from '@ybyra/core'
import { ProductSchema } from '../../domain/product/schema'
import { productEvents } from '../../domain/product/events'
import { DataForm, DataPage, useComponent } from '@ybyra/react-web'
import { productHandlers, productHooks } from '../../setup'
import { scopes } from './@routes'
import { useNavigate } from 'react-router-dom'

export function ProductView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const component = useComponent(Scope.view, scopes, navigate)
  const product = ProductSchema.provide()

  return (
    <DataPage domain={product.domain} scope={Scope.view}>
      <DataForm
        schema={product}
        scope={Scope.view}
        events={productEvents}
        handlers={productHandlers}
        hooks={productHooks}
        context={{ id }}
        component={component}
      />
    </DataPage>
  )
}
```

The `context={{ id }}` prop passes the route parameter to the `bootstrap` hook, which uses it to load the record via `service.read(id)`.

## Edit Screen

The edit screen is nearly identical to view, but uses `Scope.edit` — so the bootstrap hook hydrates the form **without** disabling fields, and the footer shows update/cancel/destroy actions:

```tsx
// src/pages/product/ProductEdit.tsx
import { useParams } from 'react-router-dom'
import { Scope } from '@ybyra/core'
import { ProductSchema } from '../../domain/product/schema'
import { productEvents } from '../../domain/product/events'
import { DataForm, DataPage, useComponent } from '@ybyra/react-web'
import { productHandlers, productHooks } from '../../setup'
import { scopes } from './@routes'
import { useNavigate } from 'react-router-dom'

export function ProductEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const component = useComponent(Scope.edit, scopes, navigate)
  const product = ProductSchema.provide()

  return (
    <DataPage domain={product.domain} scope={Scope.edit}>
      <DataForm
        schema={product}
        scope={Scope.edit}
        events={productEvents}
        handlers={productHandlers}
        hooks={productHooks}
        context={{ id }}
        component={component}
      />
    </DataPage>
  )
}
```

## Pattern Summary

All 4 screens follow the same pattern:

1. `useComponent(scope, scopes, navigate)` — creates the component contract for navigation, dialogs, toasts
2. `<DataPage>` — layout wrapper with title
3. `<DataForm>` or `<DataTable>` — the schema-driven component

The **scope** is the only thing that changes between screens. The schema, handlers, hooks, and events are shared — the framework resolves which fields, actions, and behaviors apply to each scope automatically.

## Next Steps

- [Testing](/react/testing) — test your app with Vitest
