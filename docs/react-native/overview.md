# React Native

Anhanga works with React Native through the `@ybyra/react` hooks and the `@ybyra/react-native` UI components. This
guide shows how to build a complete CRUD flow — **list, add, view, edit** — using Expo Router.

## Architecture

A typical Anhanga + React Native app structure to handle looks like this:

```
my-app/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── // app pages
├── src/
│   ├── application/
│   │   └── // persistences and business logic
│   ├── domain/
│   │   └── // schemas, events, handlers, hooks
│   ├── settings/
│   │   ├── locales/
│   │   ├── handlers.ts
│   │   ├── i18n.ts
│   │   ├── icon.ts
│   │   ├── schema.ts
│   │   └── theme.ts
│   ├── index.ts
│   └─ setup.ts 
└── tests/
    ├── app/
    └── src/
```

The domain layer is **framework-agnostic** — the same schema and handlers work in React Web, Vue, or Svelte. Only the
pages and renderers are platform-specific.

## Important Concepts

The domain layer is **framework-agnostic** — the same schema and handlers work in React Web, Vue, or Svelte. Only the
pages and renderers are platform-specific.

### How Scopes Drive Everything

To represent the different screens and states of your app, you define **scopes** in your schema. Each scope corresponds
to a screen (or a state of a screen) and determines actions, fields, bootstrap logic, etc. An example:

| Scope         | Screen    | Actions shown                        |
|---------------|-----------|--------------------------------------|
| `Scope.index` | List      | add (top), view, edit, destroy (row) |
| `Scope.add`   | Add form  | create, cancel (footer)              |
| `Scope.view`  | View form | cancel, destroy (footer)             |
| `Scope.edit`  | Edit form | update, cancel, destroy (footer)     |


## Next Steps

- [Installation](/react-native/installation) — set up a new project from scratch
- [Domain Layer](/react-native/domain) — define schema, events, handlers, and hooks
- [i18n](/react-native/i18n) — add field labels and group titles
- [Screens](/react-native/screens) — build the 4 CRUD screens
- [Testing](/react-native/testing) — test your app with Vitest
