# Screens

This page shows how to build the 4 CRUD screens using Expo Router and the `@anhanga/react-native` components.

## Route Map

First, map each scope to its Expo Router path:

```typescript
// app/product/@routes.ts
import { Scope, ScopeRoute, ScopeValue } from '@anhanga/core'

export const scopes: Record<ScopeValue, ScopeRoute> = {
  [Scope.index]: { path: '/product' },
  [Scope.add]: { path: '/product/add' },
  [Scope.view]: { path: '/product/view/:id' },
  [Scope.edit]: { path: '/product/edit/:id' },
}
```

This map is used by `useComponent` to resolve navigation paths when handlers call `component.navigator.push(...)`.

## Layout

The root layout uses `withProviders` to wrap the app with `ThemeProvider` and `DialogProvider`, and imports the i18n settings as a side-effect:

```tsx
// app/_layout.tsx
import '../src/settings/i18n'
import { withProviders } from '@anhanga/react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import { theme } from '../src/settings/theme'

function RootLayout() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
    </View>
  )
}

export default withProviders(RootLayout, { theme })

const styles = StyleSheet.create({
  container: { flex: 1 },
})
```

## List Screen

The list screen uses `DataTable` with `Scope.index`. It renders columns marked with `.column()` in the schema and displays row actions (view, edit, destroy) and top actions (add):

```tsx
// app/product/index.tsx
import { Scope } from '@anhanga/core'
import { Page, DataTable, useComponent } from '@anhanga/react-native'
import { ProductSchema } from '../../src/domain/product/schema'
import { productHandlers, productHooks } from '../../src/setup'
import { scopes } from './@routes'

export default function ProductListPage() {
  const component = useComponent(Scope.index, scopes)

  return (
    <Page domain={ProductSchema.domain} scope={Scope.index}>
      <DataTable
        schema={ProductSchema.provide()}
        scope={Scope.index}
        handlers={productHandlers}
        hooks={productHooks}
        component={component}
        pageSize={10}
      />
    </Page>
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
// app/product/add.tsx
import { Scope } from '@anhanga/core'
import { Page, DataForm, useComponent } from '@anhanga/react-native'
import { ProductSchema } from '../../src/domain/product/schema'
import { productEvents } from '../../src/domain/product/events'
import { productHandlers, productHooks } from '../../src/setup'
import { scopes } from './@routes'

export default function ProductAddPage() {
  const component = useComponent(Scope.add, scopes)

  return (
    <Page domain={ProductSchema.domain} scope={Scope.add}>
      <DataForm
        schema={ProductSchema.provide()}
        scope={Scope.add}
        events={productEvents}
        handlers={productHandlers}
        hooks={productHooks}
        component={component}
      />
    </Page>
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
// app/product/view/[id].tsx
import { useLocalSearchParams } from 'expo-router'
import { Scope } from '@anhanga/core'
import { Page, DataForm, useComponent } from '@anhanga/react-native'
import { ProductSchema } from '../../../src/domain/product/schema'
import { productEvents } from '../../../src/domain/product/events'
import { productHandlers, productHooks } from '../../../src/setup'
import { scopes } from '../@routes'

export default function ProductViewPage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const component = useComponent(Scope.view, scopes)

  return (
    <Page domain={ProductSchema.domain} scope={Scope.view}>
      <DataForm
        schema={ProductSchema.provide()}
        scope={Scope.view}
        events={productEvents}
        handlers={productHandlers}
        hooks={productHooks}
        context={{ id }}
        component={component}
      />
    </Page>
  )
}
```

The `context={{ id }}` prop passes the route parameter to the `bootstrap` hook, which uses it to load the record via `service.read(id)`.

## Edit Screen

The edit screen is nearly identical to view, but uses `Scope.edit` — so the bootstrap hook hydrates the form **without** disabling fields, and the footer shows update/cancel/destroy actions:

```tsx
// app/product/edit/[id].tsx
import { useLocalSearchParams } from 'expo-router'
import { Scope } from '@anhanga/core'
import { Page, DataForm, useComponent } from '@anhanga/react-native'
import { ProductSchema } from '../../../src/domain/product/schema'
import { productEvents } from '../../../src/domain/product/events'
import { productHandlers, productHooks } from '../../../src/setup'
import { scopes } from '../@routes'

export default function ProductEditPage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const component = useComponent(Scope.edit, scopes)

  return (
    <Page domain={ProductSchema.domain} scope={Scope.edit}>
      <DataForm
        schema={ProductSchema.provide()}
        scope={Scope.edit}
        events={productEvents}
        handlers={productHandlers}
        hooks={productHooks}
        context={{ id }}
        component={component}
      />
    </Page>
  )
}
```

## Pattern Summary

All 4 screens follow the same pattern:

1. `useComponent(scope, scopes)` — creates the component contract for navigation, dialogs, toasts
2. `<Page>` — layout wrapper with title
3. `<DataForm>` or `<DataTable>` — the schema-driven component

The **scope** is the only thing that changes between screens. The schema, handlers, hooks, and events are shared — the framework resolves which fields, actions, and behaviors apply to each scope automatically.

## Next Steps

- [Testing](/react-native/testing) — test your app with Vitest
