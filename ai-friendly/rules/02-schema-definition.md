# Schema Definition

## Base Configuration with `configure()`

Every project starts with a base schema configuration using `configure()`. This defines shared defaults for all domains:

```ts-no-check
import { configure, action, text, Scope, Position } from "@ybyra/core";

export const schema = configure({
  identity: "id",        // field used as unique identifier
  display: "name",       // field used as display label
  scopes: [Scope.index, Scope.add, Scope.view, Scope.edit],
  fields: {
    id: text()
      .excludeScopes(Scope.add)
      .order(0)
      .disabled(),
  },
  actions: {
    add: action().open().primary().positions(Position.top).scopes(Scope.index),
    view: action().open().positions(Position.row).scopes(Scope.index),
    edit: action().open().positions(Position.row).scopes(Scope.index),
    create: action().primary().order(999).positions(Position.footer).scopes(Scope.add),
    update: action().primary().order(999).positions(Position.footer).scopes(Scope.edit),
    cancel: action().open().start().order(1).positions(Position.footer).scopes(Scope.view, Scope.add, Scope.edit),
    destroy: action().start().order(2).positions(Position.footer, Position.row).destructive().excludeScopes(Scope.add, Scope.view),
  },
});
```

### Key Points
- `identity` — the field that holds the unique ID (usually `"id"`)
- `display` — the field used as human-readable label
- `scopes` — the scopes this schema supports
- `fields` — base fields inherited by all domains (typically just `id`)
- `actions` — default CRUD actions inherited by all domains

## Creating a Domain Schema with `schema.create()`

Each domain extends the base configuration:

```ts-no-check
import { action, date, group, Position, Scope, text, Text, toggle } from "@ybyra/core";
import { schema } from "@/settings/schema";

export const PersonSchema = schema.create("person", {
  groups: {
    basic: group(),
    address: group(),
  },

  fields: {
    name: text().width(100).default("").required().column().filterable().group("basic"),
    email: text().kind(Text.Email).width(60).required().column().group("basic"),
    phone: text().kind(Text.Phone).width(40).group("basic"),
    birthDate: date().width(30).group("basic"),
    active: toggle().width(20).default(true).column().group("basic"),
    street: text().kind(Text.Street).width(60).group("address"),
    city: text().kind(Text.City).width(40).group("address"),
  },

  actions: {
    custom: action().order(-1).warning().positions(Position.footer).scopes(Scope.add),
    save: action().hidden(),
  },
});
```

### Key Rules

1. **First argument is the domain name** — used for i18n key resolution (`"person"` → `person.fields.name`)
2. **Fields are object literals** — TypeScript infers types, detects duplicates, supports spread
3. **Groups are declared first** — then referenced by fields via `.group("groupName")`
4. **Actions can override base** — `save: action().hidden()` hides an inherited action
5. **`null` removes** an inherited action — `save: null` removes it entirely
6. **Field factory functions are direct imports** — `text()`, `date()`, `toggle()`, never `field.text()`

## Schema Methods

The `SchemaDefinition` returned by `schema.create()` provides these methods:

| Method | Purpose |
|--------|---------|
| `Schema.events({...})` | Define field event handlers (change, blur, focus) |
| `Schema.handlers({...})` | Define action handlers (create, update, custom) |
| `Schema.hooks({...})` | Define lifecycle hooks (bootstrap, fetch) |
| `Schema.provide()` | Extract schema config for components |
| `Schema.extend({...})` | Create a new schema extending this one |
| `Schema.pick(...)` | Create schema with only specified fields |
| `Schema.omit(...)` | Create schema without specified fields |

## Field Width System

Field widths represent **percentage of the row**. They should add up to ~100 per visual row:

```ts-no-check
fields: {
  name: text().width(100),           // full row
  sku: text().width(40),             // 40% of row
  expirationDate: date().width(60),  // 60% of row (same visual row as SKU)
}
```

## Action Configuration

Actions use a builder pattern with these methods:

```ts-no-check
action()
  .primary()           // variant: primary, secondary, destructive, warning, success, info, accent, muted
  .positions(Position.footer, Position.row)  // where to render
  .scopes(Scope.add, Scope.edit)             // in which scopes to show
  .excludeScopes(Scope.view)                 // in which scopes to hide
  .order(1)            // sort order (lower = first)
  .hidden()            // hide the action (still exists, just not visible)
  .open()              // marks as navigation action (no permission check)
  .start()             // align to start of container
  .end()               // align to end of container
```

### Positions
- `Position.top` — above the form/table (typically "Add" button)
- `Position.footer` — below the form (typically "Save", "Cancel")
- `Position.row` — inline with each table row (typically "View", "Edit", "Delete")
- `Position.floating` — floating action button

## Groups

Groups organize fields visually into sections:

```ts-no-check
import { group } from "@ybyra/core";

groups: {
  basic: group(),
  address: group(),
}
```

Groups get their labels from i18n: `{domain}.groups.{groupName}` (e.g., `person.groups.basic` → "Informações Básicas").
