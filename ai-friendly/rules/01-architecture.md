# Architecture

Ybyra is a **schema-driven form and table system** for TypeScript applications. It uses a builder-pattern API to define forms declaratively, then renders them across multiple UI frameworks.

## Monorepo Structure

```
packages/
├── core/           ← Schema definition, field types, actions, groups, type system (framework-agnostic)
├── react/          ← useDataForm/useDataTable hooks, renderer registry, validation, proxy
├── vue/            ← Composables equivalent to React hooks
├── svelte/         ← Stores equivalent to React hooks
├── react-native/   ← React Native UI components (DataForm, DataTable, renderers)
├── react-web/      ← React Web UI components (DataForm, DataTable, renderers)
├── sveltekit/      ← SvelteKit UI components (DataForm, DataTable, renderers)
├── vue-quasar/     ← Vue + Quasar UI components (DataForm, DataTable, renderers)
├── persistence/    ← PersistenceContract, drivers (local SQLite, web localStorage)
└── demo/           ← Shared demo domain code (person schema, services, settings)

playground/
├── react-web/      ← Vite + React app consuming domain packages
├── react-native/   ← Expo app consuming domain packages
├── vue-quasar/     ← Vite + Vue + Quasar app consuming domain packages
└── sveltekit/      ← SvelteKit app consuming domain packages
```

## Layer Architecture

```
┌─────────────────────────────────────────────────────┐
│  Playground / Application                           │
│  (pages, routes, setup, i18n config, icons)         │
├─────────────────────────────────────────────────────┤
│  UI Components Package (@ybyra/react-web, etc.)   │
│  (DataForm, DataTable, DataPage, field renderers)   │
├─────────────────────────────────────────────────────┤
│  Framework Adapter (@ybyra/react, vue, svelte)    │
│  (useDataForm, useDataTable, registry, validation)  │
├─────────────────────────────────────────────────────┤
│  Core (@ybyra/core)                               │
│  (SchemaDefinition, FieldDefinition, ActionDef,     │
│   GroupDef, types, contracts, scopes, i18n keys)    │
├─────────────────────────────────────────────────────┤
│  Persistence (@ybyra/persistence)                 │
│  (ServiceContract, PersistenceContract, drivers)    │
└─────────────────────────────────────────────────────┘
```

## Domain Code Organization

When creating a new domain (e.g., "product"), the code is organized into these layers:

```
src/
├── domain/{name}/
│   ├── schema.ts        ← Field definitions, groups, actions (STRUCTURE)
│   ├── events.ts        ← Field event handlers: change, blur, focus (BEHAVIOR)
│   ├── handlers.ts      ← Action handlers: create, update, destroy, custom (ACTIONS)
│   ├── hooks.ts         ← Lifecycle hooks: bootstrap, fetch (DATA LOADING)
│   └── index.ts         ← Barrel exports
├── application/{name}/
│   └── {name}Service.ts ← ServiceContract implementation (DATA ACCESS)
└── settings/
    ├── schema.ts        ← Base schema config via configure() (SHARED DEFAULTS)
    ├── handlers.ts      ← Default CRUD handlers (SHARED BEHAVIOR)
    └── hooks.ts         ← Default lifecycle hooks (SHARED DATA LOADING)
```

## Key Concepts

### Schema Definition
Schemas are created using `configure()` for base settings and `schema.create()` for specific domains. Fields are defined as object literals using factory functions (`text()`, `date()`, `toggle()`, etc.).

### Scopes
Four built-in scopes control visibility: `index` (list), `add` (create form), `view` (read-only form), `edit` (edit form). Fields and actions can be scoped using `.scopes()` or `.excludeScopes()`.

### Builder Pattern
All definitions (fields, actions, groups) use a fluent builder pattern:
```ts-no-check
text().width(60).required().column().group("basic")
```

### Separation of Concerns
- `schema.ts` → WHAT (structure, layout)
- `events.ts` → WHEN (field reactions)
- `handlers.ts` → HOW (action execution)
- `hooks.ts` → LOAD (data lifecycle)

### Framework Agnostic Core
`@ybyra/core` has zero UI dependencies. Framework adapters (`@ybyra/react`, `@ybyra/vue`, `@ybyra/svelte`) bridge to their respective ecosystems. UI component packages provide the actual rendered components.
