# Schema Definition

The schema is the central concept in Ybyra. It describes your domain's fields, groups, actions, and configuration in a single object.

## configure()

`configure()` creates a `SchemaFactory` with base configuration that all domain schemas inherit:

```typescript
import { configure, action, text, Scope, Position } from '@ybyra/core'

export const schema = configure({
  identity: 'id',
  display: 'name',
  scopes: [Scope.index, Scope.add, Scope.view, Scope.edit],
  fields: {
    id: text().excludeScopes(Scope.add).order(0).disabled(),
  },
  actions: {
    add: action().primary().positions(Position.top).scopes(Scope.index),
    create: action().primary().order(999).positions(Position.footer).scopes(Scope.add),
    cancel: action().start().order(1).positions(Position.footer).scopes(Scope.view, Scope.add, Scope.edit),
  },
})
```

### Options

| Property | Type | Description |
|----------|------|-------------|
| `identity` | `string \| string[]` | Primary key field name(s) |
| `display` | `string \| ((record) => string)` | Display field or function |
| `scopes` | `ScopeValue[]` | Available scopes for the schema |
| `fields` | `Record<string, FieldDefinition>` | Base fields inherited by all schemas |
| `groups` | `Record<string, GroupDefinition>` | Base groups |
| `actions` | `Record<string, ActionDefinition>` | Base actions |
| `handlers` | `Record<string, HandlerFn>` | Default action handlers |

## schema.create()

The factory's `create()` method produces a `SchemaDefinition`:

```typescript
const PersonSchema = schema.create('person', {
  groups: {
    basic: group(),
    address: group(),
  },
  fields: {
    name: text().width(100).required().column().group('basic'),
    email: text().kind(Text.Email).width(60).required().column().group('basic'),
  },
  actions: {
    custom: action().warning().positions(Position.footer).scopes(Scope.add),
  },
})
```

Fields and actions from `configure()` are merged with those in `create()`. Domain-specific definitions take precedence.

## extend()

Create a new schema by extending an existing one with additional fields:

```typescript
const EmployeeSchema = PersonSchema.extend('employee', {
  fields: {
    department: text().width(50).required(),
    salary: currency().min(0).precision(2),
  },
})
```

The new schema inherits all fields, groups, and actions from the parent, then merges the extra definitions.

## pick() and omit()

Create subsets of a schema by selecting or excluding fields:

```typescript
const PersonNameSchema = PersonSchema.pick('name', 'email')
const PersonWithoutAddress = PersonSchema.omit('street', 'city')
```

## provide()

`provide()` returns the serializable schema configuration for use with React hooks:

```typescript
const schemaConfig = PersonSchema.provide()
// { domain, identity, display, scopes, groups, fields, actions }
```

This is the object you pass to `useDataForm` and `useDataTable`.

## events(), handlers(), hooks()

These methods create type-safe bindings for your schema. They don't modify the schema — they return the bindings object with type checking:

```typescript
const events = PersonSchema.events({ /* ... */ })
const handlers = PersonSchema.handlers({ /* ... */ })
const hooks = PersonSchema.hooks({ /* ... */ })
```

See [Events & Proxy](/guide/events-and-proxy), [Quick Start](/guide/quick-start), and [Lifecycle Hooks](/advanced/lifecycle-hooks) for details.
