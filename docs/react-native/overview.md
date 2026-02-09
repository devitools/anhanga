# React Native

Anhanga works with React Native through the `@anhanga/react` hooks and the `@anhanga/react-native` UI components. This guide shows how to build a complete CRUD flow — **list, add, view, edit** — using Expo Router.

## Architecture

A typical Anhanga + React Native app has 4 layers:

```
settings/          ← configure(), default handlers, hooks, i18n
domain/product/    ← schema, events, handlers, hooks
src/setup.ts       ← wire service + handlers + hooks
app/product/       ← Expo Router pages (4 screens)
```

The domain layer is **framework-agnostic** — the same schema and handlers work in React Web, Vue, or Svelte. Only the pages and renderers are platform-specific.

## How Scopes Drive Everything

The 4 screens share the **same schema, handlers, hooks, and events**. The only thing that changes is the `scope` prop:

| Scope | Screen | Actions shown | Fields shown | Bootstrap |
|-------|--------|---------------|--------------|-----------|
| `Scope.index` | List | add (top), view/edit/destroy (row) | `.column()` fields | `fetch` loads paginated list |
| `Scope.add` | Add form | create, cancel (footer) | All except `.excludeScopes(Scope.add)` | — |
| `Scope.view` | View form | cancel, destroy (footer) | All, disabled by hook | `bootstrap` loads by ID, disables fields |
| `Scope.edit` | Edit form | update, cancel, destroy (footer) | All | `bootstrap` loads by ID |

## Key Components

| Component | Purpose |
|-----------|---------|
| `Page` | Layout wrapper — renders title (`domain + scope`) and scroll container |
| `DataForm` | Schema-driven form — renders fields, groups, actions, validation |
| `DataTable` | Schema-driven table — renders columns, pagination, sorting, row actions |
| `DialogProvider` | Context provider for confirmation modals |
| `useComponent` | Hook that creates the `ComponentContract` (navigator, dialog, toast, loading) |

## Running the Playground

The repository includes a working React Native playground with all 4 screens:

```bash
pnpm --filter @anhanga/playground start       # Expo dev server
pnpm --filter @anhanga/playground web         # web only
pnpm --filter @anhanga/playground start:clear  # clear cache
```

## Next Steps

- [Installation](/react-native/installation) — set up a new project from scratch
- [Domain Layer](/react-native/domain) — define schema, events, handlers, and hooks
- [Screens](/react-native/screens) — build the 4 CRUD screens
