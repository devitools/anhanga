---
name: add-action
description: Adds a custom action to a Ybyra schema with handler, positioning, variant, and scope configuration.
---

# Skill: Add Action

Add a new action button to an existing Ybyra domain.

## Steps

### 1. Define Action in Schema (`schema.ts`)

```ts-no-check
import { action, Position, Scope } from "@ybyra/core";

actions: {
  // ... existing actions
  export: action()
    .order(2)                              // display order
    .primary()                             // variant: primary | destructive | warning | info | success
    .positions(Position.header)            // header | footer | floating
    .scopes(Scope.index),                  // which scopes show this action
}
```

### Action Configuration Methods

| Method                        | Description                                     |
|-------------------------------|-------------------------------------------------|
| `.order(n)`                   | Display order (lower = first, negative allowed) |
| `.primary()`                  | Blue/primary variant                            |
| `.destructive()`              | Red/danger variant                              |
| `.warning()`                  | Yellow/warning variant                          |
| `.info()`                     | Neutral/info variant                            |
| `.success()`                  | Green/success variant                           |
| `.positions(Position.header)` | Where to render                                 |
| `.scopes(Scope.index)`        | Whitelist scopes                                |
| `.excludeScopes(Scope.view)`  | Blacklist scopes                                |
| `.hidden()`                   | Hidden (override inherited)                     |
| `null`                        | Remove inherited action                         |

### 2. Implement Handler (`handlers.ts`)

```ts-no-check
export function create ExampleHandlers(service: ServiceContract) {
  return ExampleSchema.handlers({
    ...createDefault(service),
    // Handler name must match action name
    export ({ state, component, form, table }) {
      // state — current form/table record
      // component.navigator.push(path) — navigate
      // component.dialog.confirm(msg) — show dialog
      // component.toast.success(msg) — show toast
      // component.loading.show() / hide() — loading overlay
      // form.validate() — trigger validation
      // form.reset() — reset form
      // table.reload() — refresh table data
    },
  });
}
```

### 3. Add i18n Key

```ts-no-check
{domain}: {
  // ... existing keys
  actions: {
    export: "Export",
  },
}
```

### 4. Override or Remove Inherited Actions

```ts-no-check
actions: {
  save: action().hidden(),     // hide inherited save
  remove: null,                // completely remove inherited remove
  back: action().order(-100),  // reorder inherited back
}
```

## Example: Custom Action with Dialog

```ts-no-check
async export({ state, component }) {
  const confirmed = await component.dialog.confirm("person.export.confirm");
  if (confirmed) {
    component.loading.show();
    try {
      await service.exportAll();
      component.toast.success("person.export.success");
    } finally {
      component.loading.hide();
    }
  }
}
```
