# Introduction

Anhanga is a **schema-driven UI system for management applications**. You define your domain schema once — fields, actions, groups, scopes — and the framework derives forms, tables, validation, events, i18n, and type-safe records from that single source of truth.

The core is framework-agnostic. Official adapters are provided for **React**, **Vue**, and **Svelte**.

## Why Anhanga?

Traditional CRUD screens require wiring up fields, validation, visibility, layout, tables, filters, and actions **by hand — for every screen**. Anhanga flips the approach: **describe your domain schema once**, and the framework derives everything else.

- **Less code per feature** — a single schema definition generates forms, tables, validation, and i18n for any scope (add, edit, view, index)
- **LLM-friendly** — declarative, consistent patterns make it easy for AI tools to generate and maintain schema code
- **Testability & governance** — separation of concerns (schema, events, handlers, services) makes each layer independently testable and auditable
- **Type inference** — `InferRecord<typeof PersonSchema>` gives you a fully-typed record
- **Scoped visibility** — fields and actions appear/hide based on scope (index, add, view, edit)
- **Reactive events** — field changes can mutate other fields, toggle visibility, set states
- **i18n-native** — labels resolved via `{domain}.{field}`, never hardcoded
- **Framework-agnostic core** — `@anhanga/core` has zero dependencies; bring your own UI

## Packages

| Package | Description |
|---------|-------------|
| `@anhanga/core` | Schema definition, field types, actions, groups, type system |
| `@anhanga/react` | `useDataForm` / `useDataTable` hooks, renderer registry, validation |
| `@anhanga/vue` | `useDataForm` / `useDataTable` composables, renderer registry, validation |
| `@anhanga/svelte` | `useDataForm` / `useDataTable` stores, renderer registry, validation |
| `@anhanga/demo` | Shared demo domain (person schema, services, settings, i18n) |

## How It Works

1. **Configure** a base schema with shared identity, display, scopes, and default actions
2. **Create** domain schemas with fields, groups, and actions
3. **Define events** that react to field changes
4. **Define handlers** for actions like create, update, destroy
5. **Render** using framework hooks/composables that resolve fields, validation, and actions automatically

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
