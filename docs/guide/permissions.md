# Permissions

Anhanga provides a two-layer permission model that controls both **scope access** (can the user see this page?) and **action access** (can the user perform this operation?).

## Permission Format

Permissions use dot-separated strings with a type discriminator:

```
{domain}.scope.{scopeName}   # scope permission
{domain}.action.{actionName} # action permission
```

The `.scope.` and `.action.` segments make permissions extensible for future use (e.g. `{domain}.field.{x}`).

For complex domains the pattern works naturally:

```
registration.person.scope.add
registration.person.action.create
```

## Scope Permissions

Scope permissions gate the entire component. When you pass `permissions` to `useDataForm` or `useDataTable`, the hook returns a `permitted` boolean indicating whether the current scope is allowed:

::: code-group
```tsx [React]
const { fields, actions, permitted } = useDataForm({
  schema: person,
  scope: Scope.add,
  permissions: ['person.scope.add', 'person.action.create'],
  // ...
})

if (!permitted) {
  return <Forbidden />
}
```

```vue [Vue]
const form = useDataForm({
  schema: person,
  scope: Scope.add,
  permissions: ['person.scope.add', 'person.action.create'],
  // ...
})

<template>
  <Forbidden v-if="!form.permitted" />
  <DataForm v-else :form="form" />
</template>
```

```svelte [Svelte]
<script>
const formStore = useDataForm({
  schema: person,
  scope: Scope.add,
  permissions: ['person.scope.add', 'person.action.create'],
  // ...
})
let form = $derived($formStore)
</script>

{#if !form.permitted}
  <Forbidden />
{:else}
  <DataForm {form} />
{/if}
```
:::

If `permissions` is `undefined`, `permitted` is `false`.

| Permission | Meaning |
|------------|---------|
| `person.scope.index` | Allow access to the person list view |
| `person.scope.add` | Allow access to the person create form |
| `person.scope.edit` | Allow access to the person update form |
| `person.scope.view` | Allow access to the person detail view |

## Action Permissions

Action permissions gate individual actions. Each action that is **not** marked `.open()` requires a matching `{domain}.action.{actionName}` permission to be visible.

### The `.open()` Method

Actions marked with `.open()` skip the permission check entirely — they are always visible (as long as they match the current scope):

```typescript
actions: {
  // Navigation — open, no action permission needed
  add:     action().open().primary().positions(Position.top).scopes(Scope.index),
  view:    action().open().positions(Position.row).scopes(Scope.index),
  edit:    action().open().positions(Position.row).scopes(Scope.index),
  cancel:  action().open().start().positions(Position.footer).scopes(Scope.view, Scope.add, Scope.edit),

  // Mutations — require action permissions
  create:  action().primary().order(999).positions(Position.footer).scopes(Scope.add),
  update:  action().primary().order(999).positions(Position.footer).scopes(Scope.edit),
  destroy: action().start().destructive().excludeScopes(Scope.add, Scope.view),
}
```

Navigation actions (`add`, `view`, `edit`, `cancel`) are typically `.open()` since scope permissions already gate the target page. Mutation actions (`create`, `update`, `destroy`) require explicit action permissions.

## Permission Examples

### Full access

```typescript
permissions: [
  'person.scope.index', 'person.scope.add', 'person.scope.edit', 'person.scope.view',
  'person.action.create', 'person.action.update', 'person.action.destroy',
]
```

### Read-only (list + view, no mutations)

```typescript
permissions: ['person.scope.index', 'person.scope.view']
```

The user can see the index and view pages. Navigation actions appear (they are `.open()`), but `create`, `update`, and `destroy` are hidden.

### Can add but not edit or delete

```typescript
permissions: [
  'person.scope.index', 'person.scope.add',
  'person.action.create',
]
```

### Per-domain permissions

```typescript
permissions: [
  'person.scope.index', 'person.scope.view',
  'product.scope.index', 'product.scope.add', 'product.scope.edit', 'product.scope.view',
  'product.action.create', 'product.action.update', 'product.action.destroy',
]
```

Each domain is independently controlled — a user can be read-only for persons but have full access to products.

## Full Access for Development

During development, you can grant all permissions using the `allPermissions()` helper from `@anhanga/demo`:

```typescript
import { allPermissions } from '@anhanga/demo'
import { person } from './domain/person/schema'

const permissions = allPermissions(person)
// ['person.scope.index', 'person.scope.add', ..., 'person.action.create', 'person.action.update', ...]
```

This generates scope permissions for every scope and action permissions for every non-open action.

## Implementing in Production

In a real application, fetch permissions from your auth system and pass them to your components:

```typescript
const user = await authService.getCurrentUser()
const permissions = user.permissions
// ['person.scope.index', 'person.scope.edit', 'person.action.update', ...]
```

```tsx
<DataForm
  schema={person}
  scope={Scope.edit}
  permissions={permissions}
/>
```

The permission strings are opaque to Anhanga — your backend defines what they mean. Anhanga only checks if the string is present in the array.
