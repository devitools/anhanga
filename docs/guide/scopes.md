# Scopes

Scopes control the visibility of fields and actions based on the current context. A scope represents a user-facing view of your domain.

## The Four Scopes

| Scope | Description |
|-------|-------------|
| `Scope.index` | List/table view |
| `Scope.add` | Create form |
| `Scope.view` | Read-only detail |
| `Scope.edit` | Update form |

```typescript
import { Scope } from '@ybyra/core'
```

## Configuring Available Scopes

Define the scopes your schema supports in `configure()`:

```typescript
const schema = configure({
  scopes: [Scope.index, Scope.add, Scope.view, Scope.edit],
  // ...
})
```

## Whitelist with .scopes()

Show a field or action **only** in specific scopes:

```typescript
text().scopes(Scope.add, Scope.edit)       // only in add and edit forms
action().scopes(Scope.index)               // only in the list view
```

## Blacklist with .excludeScopes()

Show a field or action **everywhere except** specific scopes:

```typescript
text().excludeScopes(Scope.add)            // hidden in add, visible everywhere else
action().excludeScopes(Scope.add, Scope.view)  // hidden in add and view
```

## How Scopes Work

When you pass a `scope` to `useDataForm` or `useDataTable`, the hook filters fields and actions:

1. If a field/action has `.scopes()` — it's shown **only** if the current scope is in the list
2. If a field/action has `.excludeScopes()` — it's shown **unless** the current scope is in the list
3. If neither is set — it's shown in all scopes

## Examples

### ID field hidden in create form

```typescript
fields: {
  id: text().excludeScopes(Scope.add).disabled(),
}
```

### Add button only in index view

```typescript
actions: {
  add: action().primary().positions(Position.top).scopes(Scope.index),
}
```

### Submit actions per scope

```typescript
actions: {
  create: action().primary().positions(Position.footer).scopes(Scope.add),
  update: action().primary().positions(Position.footer).scopes(Scope.edit),
}
```

### View-only fields

```typescript
// In bootstrap hooks, disable all fields for view scope
bootstrap: {
  [Scope.view]: async ({ schema }) => {
    for (const field of Object.values(schema)) {
      field.disabled = true
    }
  },
}
```
