# Scopes and Permissions

## Scopes

Scopes control **where fields and actions are visible**. Ybyra has four built-in scopes:

```ts-no-check
import { Scope } from "@ybyra/core";

Scope.index  // list/table view
Scope.add    // create form
Scope.view   // read-only form
Scope.edit   // edit form
```

## Field Scoping

### Whitelist — show only in specific scopes
```ts-no-check
fields: {
  password: text().scopes(Scope.add),              // only in add form
  createdAt: date().scopes(Scope.view, Scope.edit), // only in view and edit
}
```

### Blacklist — hide from specific scopes
```ts-no-check
fields: {
  id: text().excludeScopes(Scope.add),  // hidden in add form, visible everywhere else
}
```

## Action Scoping

### Whitelist
```ts-no-check
actions: {
  create: action().scopes(Scope.add),                    // only in add form
  update: action().scopes(Scope.edit),                    // only in edit form
  add: action().scopes(Scope.index),                      // only in table view
  cancel: action().scopes(Scope.view, Scope.add, Scope.edit), // all form scopes
}
```

### Blacklist
```ts-no-check
actions: {
  destroy: action().excludeScopes(Scope.add, Scope.view), // hidden in add and view
}
```

## Open Actions

Actions marked with `.open()` are **navigation actions** that don't require permission checks:

```ts-no-check
actions: {
  add: action().open(),    // anyone can navigate to add form
  view: action().open(),   // anyone can navigate to view
  edit: action().open(),   // anyone can navigate to edit
  cancel: action().open(), // anyone can cancel
}
```

Non-open actions require permission to be visible.

## Permissions

Permissions are string-based and follow the pattern `{domain}.scope.{scope}` and `{domain}.action.{action}`:

```ts-no-check
import type { SchemaProvide } from "@ybyra/core";

export function allPermissions(schema: SchemaProvide): string[] {
  const scopePermissions = schema.scopes.map(
    (scope) => `${schema.domain}.scope.${scope}`
  );
  const actionPermissions = Object.entries(schema.actions)
    .filter(([, config]) => !config.open)
    .map(([name]) => `${schema.domain}.action.${name}`);
  return [...scopePermissions, ...actionPermissions];
}
```

### Permission examples for "person" domain:
- `person.scope.index` — can see the list
- `person.scope.add` — can access add form
- `person.scope.view` — can access view form
- `person.scope.edit` — can access edit form
- `person.action.create` — can execute create
- `person.action.update` — can execute update
- `person.action.destroy` — can execute destroy
- `person.action.custom` — can execute custom action

### Using `allPermissions()` in development
During development, use `allPermissions()` to grant all permissions:

```ts-no-check
<DataForm
  permissions={allPermissions(person)}
  // ...
/>
```

In production, replace with actual user permissions from your auth system.

## Scope Routes

Each playground defines scope-to-route mappings:

```ts-no-check
import { Scope, type ScopeRoute, type ScopeValue } from "@ybyra/core";

export const scopes: Record<ScopeValue, ScopeRoute> = {
  [Scope.index]: { path: "/person" },
  [Scope.add]: { path: "/person/add" },
  [Scope.view]: { path: "/person/view/:id" },
  [Scope.edit]: { path: "/person/edit/:id" },
};
```

These routes are used by handlers for navigation: `component.navigator.push(component.scopes[Scope.add].path)`.

> Note: Route path format may vary by framework. SvelteKit uses `/person/:id/edit` instead of `/person/edit/:id`.
