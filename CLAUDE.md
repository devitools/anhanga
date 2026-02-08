# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build all packages
pnpm build              # runs tsup in core and react

# Test all packages
pnpm test               # runs vitest in core and react

# Test a single package
pnpm --filter @anhanga/core test
pnpm --filter @anhanga/react test

# Run a single test file
pnpm --filter @anhanga/core exec vitest run src/some.test.ts

# Playground (Expo)
pnpm --filter @anhanga/playground start       # dev server
pnpm --filter @anhanga/playground web         # web only
pnpm --filter @anhanga/playground start:clear  # clear cache
```

## Architecture

**Monorepo** — pnpm workspaces with three packages:

| Package | Purpose | Bundler |
|---------|---------|---------|
| `@anhanga/core` | Schema definition, field types, actions, groups, type system | tsup (ESM) |
| `@anhanga/react` | `useSchemaForm` hook, renderer registry, validation, proxy system | tsup (ESM) |
| `@anhanga/playground` | Expo app demonstrating the full stack | Expo/Metro |

### Core (`packages/core/src`)

Schema-driven form system built on builder-pattern field definitions.

- **`schema.ts`** — `SchemaDefinition<F, S>` (generic over fields and services), `SchemaFactory`, `configure()` higher-order factory
- **`fields/base.ts`** — `FieldDefinition<T>` base class with common methods (width, height, hidden, disabled, required, group, scopes, column, etc.)
- **`fields/*.ts`** — Type-specific field classes with scoped methods:
  - `TextFieldDefinition` → `kind()`, `minLength()`, `maxLength()`, `pattern()`
  - `NumberFieldDefinition` → `min()`, `max()`, `precision()`
  - `DateFieldDefinition` / `DatetimeFieldDefinition` → `min()`, `max()`
  - `CurrencyFieldDefinition` → `min()`, `max()`, `precision()`, `prefix()`
  - `FileFieldDefinition` → `accept()`, `maxSize()`
  - `SelectFieldDefinition<V>` — generic over option value type
  - `ToggleFieldDefinition`, `CheckboxFieldDefinition` — no extra methods
- **`action.ts`** — `ActionDefinition` with variant methods (primary, destructive, warning, etc.), positioning, ordering, and scoping
- **`group.ts`** — `GroupDefinition` for visual grouping of fields
- **`types.ts`** — Contracts: `ServiceContract<T>`, `ComponentContract` (navigator, dialog, toast, loading), `FormContract`, scopes and positions

`InferRecord<S>` extracts a typed record from a schema's field definitions.

### React (`packages/react/src`)

- **`use-schema-form.ts`** — Main hook: manages field state, applies events/handlers, resolves groups and scoped actions, returns proxied fields for dynamic overrides
- **`proxy.ts`** — `createStateProxy()` (tracks mutations in event handlers), `createSchemaProxy()` (dynamic field property override: hidden, disabled, width, height, state)
- **`validation.ts`** — Registry-based validators (required, minLength, maxLength, min, max, pattern, date bounds); extensible via `registerValidator()`
- **`registry.ts`** — Global and scoped field renderer registry; `registerRenderers()` / `getRenderer()`

### Playground (`packages/playground`)

Demonstrates a "person" domain following the canonical file layout:

```
settings/schema.ts        ← configure() base schema (identity, display, default actions/handlers)
settings/icon.ts          ← icon enum
src/domain/person/
  schema.ts               ← schema.create("person", { fields, groups, services, actions })
  events.ts               ← PersonSchema.events({ fieldName: { change/blur/focus } })
  handlers.ts             ← PersonSchema.handlers({ actionName })
src/applcation/person/
  personService.ts        ← ServiceContract implementation
src/presentation/
  components/renderers/   ← field renderer components (TextField, NumberField, etc.)
  contracts/component.ts  ← ComponentContract implementation
  components/SchemaForm.tsx ← form component using useSchemaForm
```

## Key Design Rules

- **Field factory functions are direct imports**: `text()`, `date()`, `toggle()` — never `field.text()`
- **No labels in code** — i18n resolves labels via `{domain}.{field}` / `{domain}.{field}[{state}]`
- **Object literals** for fields, groups, and actions (TypeScript inference, spread composition, duplicate detection)
- **`configure()`** returns a `SchemaFactory` — base config (identity, display, default actions/handlers) lives in `settings/schema.ts`
- **Separation of concerns**: `schema.ts` (structure), `events.ts` (field events), `handlers.ts` (action handlers)
- **`null` removes** inherited entries (actions), **`.hidden()` hides** them
- **Scopes on fields and actions**: `.scopes()` whitelist, `.excludeScopes()` blacklist
- **`.kind(Text.Email)`** scoped to field type for specialization
