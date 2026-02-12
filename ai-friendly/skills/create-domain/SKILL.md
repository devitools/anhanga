---
name: create-domain
description: Creates a complete domain structure for Ybyra — schema, events, handlers, and hooks — from a natural language description of the entity.
---

# Skill: Create Domain

Generate the full domain layer for a new entity in a Ybyra project.

## What This Skill Creates

```
src/domain/{domain}/
  schema.ts       ← Schema definition with fields, groups, actions
  events.ts       ← Field-level reactive events
  handlers.ts     ← Action handlers (CRUD + custom)
  hooks.ts        ← Bootstrap and fetch lifecycle hooks
  index.ts        ← Barrel export
```

## Step-by-Step Process

### 1. Define the Schema (`schema.ts`)

```ts-no-check
import { action, date, group, text, Text, toggle, number, select, Position, Scope } from "@ybyra/core";
import { schema } from "@/settings/schema";

export const {Domain}Schema = schema.create("{domain}", {
  groups: {
    // Visual groupings — one per logical section
    basic: group(),
  },
  fields: {
    // Each field: type().width(N).required().column().group("groupName")
    name: text().width(100).default("").required().column().filterable().group("basic"),
  },
  actions: {
    // null removes inherited actions, .hidden() hides them
    // Custom actions use action().order(N).variant().positions().scopes()
  },
});
```

**Rules:**

- `schema.create(domain, ...)` — domain is the i18n key prefix
- Fields are factory functions: `text()`, `date()`, `number()`, `toggle()`, `select()`, `currency()`, `file()`,
  `checkbox()`, `datetime()`
- `.width(N)` — percentage of row (100 = full width)
- `.column()` — visible in table view
- `.filterable()` — searchable in table
- `.required()` — validates presence
- `.group("name")` — assigns to visual group
- `.default(value)` — initial value
- `.scopes(Scope.add, Scope.edit)` — whitelist scopes
- `.excludeScopes(Scope.view)` — blacklist scopes
- `.kind(Text.Email)` — specialization for text fields

### 2. Define Events (`events.ts`)

```ts-no-check
import { {Domain}Schema } from "@/domain/{domain}/schema";

export const {domain}Events = {Domain}Schema.events({
  fieldName: {
    change({ state, schema }) {
      // state.fieldName — read/write field values
      // schema.fieldName.hidden = true — toggle visibility
      // schema.fieldName.disabled = true — toggle editability
      // schema.fieldName.state = "error" — set visual state
      // schema.fieldName.width = 50 — change layout
    },
    blur({ state, schema }) { },
    focus({ state, schema }) { },
  },
});
```

**Rules:**

- `state` is a proxy — mutations are tracked automatically
- `schema` proxy allows dynamic overrides of field properties
- Event names match field names from the schema
- Available events: `change`, `blur`, `focus`

### 3. Define Handlers (`handlers.ts`)

```ts-no-check
import type { ServiceContract } from "@ybyra/core";
import { {Domain}Schema } from "@/domain/{domain}/schema";
import { createDefault } from "@/settings/handlers";

export function create{Domain}Handlers(service: ServiceContract) {
  return {Domain}Schema.handlers({
    ...createDefault(service),
    // Custom action handlers:
    // customAction({ state, component, form }) { ... }
  });
}
```

**Rules:**

- Always spread `createDefault(service)` for CRUD handlers (save, remove, back)
- Custom handlers receive `HandlerContext` with: `state`, `component` (navigator, dialog, toast, loading), `form` (
  validate, reset), `table` (reload)
- Handler names match action names from the schema

### 4. Define Hooks (`hooks.ts`)

```ts-no-check
import type { ServiceContract } from "@ybyra/core";
import { {Domain}Schema } from "@/domain/{domain}/schema";
import { createDefault } from "@/settings/hooks";

export function create{Domain}Hooks(service: ServiceContract) {
  return {Domain}Schema.hooks(createDefault(service));
}
```

**Rules:**

- `createDefault(service)` provides `bootstrap` and `fetch` hooks
- `bootstrap` runs on form mount (load initial data, set defaults)
- `fetch` runs for table pagination (search, sort, paginate)

### 5. Barrel Export (`index.ts`)

```ts-no-check
export { {Domain}Schema } from "@/domain/{domain}/schema";
export { {domain}Events } from "./events";
export { create{Domain}Handlers } from "./handlers";
export { create{Domain}Hooks } from "./hooks";
```

## Naming Conventions

| Item             | Pattern                  | Example                 |
|------------------|--------------------------|-------------------------|
| Schema           | `{Domain}Schema`         | `ProductSchema`         |
| Events           | `{domain}Events`         | `productEvents`         |
| Handlers factory | `create{Domain}Handlers` | `createProductHandlers` |
| Hooks factory    | `create{Domain}Hooks`    | `createProductHooks`    |
| Service factory  | `create{Domain}Service`  | `createProductService`  |
| Directory        | `src/domain/{domain}/`   | `src/domain/product/`   |
