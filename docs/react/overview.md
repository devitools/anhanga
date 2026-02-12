# React + Shadcn

Ybyra works with React Web through the `@ybyra/react` hooks and the `@ybyra/react-web` UI components. This guide shows how to build a complete CRUD flow — **list, add, view, edit** — using react-router-dom.

## Architecture

A typical Ybyra + React Web app structure looks like this:

```
my-app/
├── src/
│   ├── application/
│   │   └── // persistences and business logic
│   ├── domain/
│   │   └── // schemas, events, handlers, hooks
│   ├── settings/
│   │   ├── locales/
│   │   ├── i18n.ts
│   │   ├── icons.ts
│   │   ├── schema.ts
│   │   └── theme.ts
│   ├── pages/
│   │   └── person/
│   │       ├── @routes.ts
│   │       ├── PersonList.tsx
│   │       ├── PersonAdd.tsx
│   │       ├── PersonView.tsx
│   │       └── PersonEdit.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── setup.ts
└── tests/
    ├── src/
    └── pages/
```

The domain layer is **framework-agnostic** — the same schema and handlers work in React Native, Vue, or Svelte. Only the pages and renderers are platform-specific.

## Important Concepts

### How Scopes Drive Everything

To represent the different screens and states of your app, you define **scopes** in your schema. Each scope corresponds to a screen (or a state of a screen) and determines actions, fields, bootstrap logic, etc. An example:

| Scope         | Screen    | Actions shown                        |
|---------------|-----------|--------------------------------------|
| `Scope.index` | List      | add (top), view, edit, destroy (row) |
| `Scope.add`   | Add form  | create, cancel (footer)              |
| `Scope.view`  | View form | cancel, destroy (footer)             |
| `Scope.edit`  | Edit form | update, cancel, destroy (footer)     |

## Next Steps

- [Installation](/react/installation) — set up a new project from scratch
- [Domain Layer](/react/domain) — define schema, events, handlers, and hooks
- [i18n](/react/i18n) — add field labels and group titles
- [Screens](/react/screens) — build the 4 CRUD screens with react-router-dom
- [Testing](/react/testing) — test your app with Vitest
