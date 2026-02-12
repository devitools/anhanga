# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build all packages
pnpm build              # runs tsup in core, react, and demo

# Test all packages
pnpm test               # runs vitest in core and react

# Test a single package
pnpm --filter @ybyra/core test
pnpm --filter @ybyra/react test

# Run a single test file
pnpm --filter @ybyra/core exec vitest run src/some.test.ts

# Playground React Native (Expo)
pnpm --filter @ybyra/playground start       # dev server
pnpm --filter @ybyra/playground web         # web only
pnpm --filter @ybyra/playground start:clear  # clear cache

# Playground React Web (Vite)
pnpm --filter @ybyra/playground-web dev     # dev server
```

## Architecture

**Monorepo** — pnpm workspaces:

| Package | Purpose | Bundler |
|---------|---------|---------|
| `@ybyra/core` | Schema definition, field types, actions, groups, type system | tsup (ESM) |
| `@ybyra/react` | `useDataForm` hook, renderer registry, validation, proxy system | tsup (ESM) |
| `@ybyra/demo` | Shared demo domain (person schema, services, settings, i18n) | tsup (ESM) |
| `@ybyra/playground` | Expo app (`playground/react-native`) demonstrating the full stack | Expo/Metro |
| `@ybyra/playground-web` | Vite + React web app (`playground/react-web`) demonstrating reuse of `@ybyra/demo` | Vite |

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

### Demo (`packages/demo/src`)

Shared framework-agnostic demo code reused by both playgrounds:

```
settings/schema.ts        ← configure() base schema (identity, display, default actions/handlers)
settings/handlers.ts      ← createDefault handlers
settings/hooks.ts         ← createDefault hooks
settings/icon.ts          ← icon enum
settings/i18n.ts          ← setupI18n()
settings/locales/pt-BR.ts ← pt-BR translations (common + person)
domain/person/
  schema.ts               ← schema.create("person", { fields, groups, services, actions })
  events.ts               ← PersonSchema.events({ fieldName: { change/blur/focus } })
  handlers.ts             ← PersonSchema.handlers({ actionName })
  hooks.ts                ← PersonSchema.hooks(createDefault(personService))
application/person/
  personService.ts        ← ServiceContract implementation
application/support/
  local-driver.ts         ← createLocalDriver()
```

### Playground React Native (`playground/react-native`)

Expo app consuming `@ybyra/demo`. Contains only platform-specific presentation:

```
src/presentation/
  components/renderers/   ← field renderer components (React Native)
  contracts/component.ts  ← ComponentContract (expo-router)
  components/DataForm.tsx ← form component using useDataForm
```

### Playground React Web (`playground/react-web`)

Vite + React web app consuming `@ybyra/demo`. Demonstrates reuse of the same domain in a pure web context:

```
src/presentation/
  components/renderers/   ← field renderer components (HTML inputs)
  contracts/component.ts  ← ComponentContract (react-router-dom)
  components/DataForm.tsx ← form component using useDataForm
src/pages/
  PersonList.tsx           ← table listing
  PersonAdd.tsx            ← add form
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

## AI-Friendly Documentation

For detailed conventions, skills, and examples, see the `ai-friendly/` folder:

| Folder | Purpose |
|--------|---------|
| `ai-friendly/rules/` | 10 rule files covering architecture, schema, fields, events, handlers, hooks, services, i18n, scopes, conventions |
| `ai-friendly/skills/` | Task-oriented generation guides: `create-domain`, `create-service`, `create-pages`, `add-field`, `add-action`, `add-i18n` |
| `ai-friendly/frameworks/` | Framework-specific guides for React Web, React Native, Vue/Quasar, SvelteKit |
| `ai-friendly/examples/` | Complete person domain examples (domain, service, pages per framework, i18n) |
| `ai-friendly/prompts/` | Prompt templates: `new-crud`, `new-field`, `new-action` |

When generating new domains, services, or pages, **always read the relevant skill first** for step-by-step instructions and real code examples.
