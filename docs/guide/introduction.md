# Introduction

Anhanga is a **schema-driven form and table system** for React. You define your domain schema once — fields, actions, groups, scopes — and the framework derives forms, tables, validation, events, and type-safe records from that single source of truth.

## Why Anhanga?

Traditional form libraries make you wire up fields, validation, visibility, and layout by hand — for every screen. Anhanga flips the approach: **describe your domain schema once**, and the framework derives everything else.

- **Type inference** — `InferRecord<typeof PersonSchema>` gives you a fully-typed record
- **Scoped visibility** — Fields and actions appear/hide based on scope (index, add, view, edit)
- **Reactive events** — Field changes can mutate other fields, toggle visibility, set states
- **i18n-native** — Labels resolved via `{domain}.{field}`, never hardcoded
- **Framework-agnostic core** — `@anhanga/core` has zero dependencies; bring your own UI

## Packages

| Package | Description |
|---------|-------------|
| `@anhanga/core` | Schema definition, field types, actions, groups, type system |
| `@anhanga/react` | `useSchemaForm` / `useSchemaTable` hooks, renderer registry, validation |

## How It Works

1. **Configure** a base schema with shared identity, display, scopes, and default actions
2. **Create** domain schemas with fields, groups, and actions
3. **Define events** that react to field changes
4. **Define handlers** for actions like create, update, destroy
5. **Render** using React hooks that resolve fields, validation, and actions automatically

```typescript
import { text, Text, date, toggle, group, action, Position, Scope } from '@anhanga/core'

const PersonSchema = schema.create('person', {
  groups: {
    basic: group(),
    address: group(),
  },
  fields: {
    name: text().width(100).required().column().group('basic'),
    email: text().kind(Text.Email).width(60).required().column().group('basic'),
    phone: text().kind(Text.Phone).width(40).group('basic'),
    birthDate: date().width(30).group('basic'),
    active: toggle().width(20).default(true).column().group('basic'),
    street: text().kind(Text.Street).width(60).group('address'),
    city: text().kind(Text.City).width(40).group('address'),
  },
  actions: {
    custom: action().icon(Icon.Send).warning().positions(Position.footer).scopes(Scope.add),
  },
})
```

No labels in code. No boilerplate. Full TypeScript inference.
