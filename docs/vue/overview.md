# Vue + Quasar

Anhanga works with Vue through the `@anhanga/vue` composables and the `@anhanga/vue-quasar` UI components. This guide shows how to build a complete CRUD flow — **list, add, view, edit** — using vue-router.

## Architecture

A typical Anhanga + Vue app structure looks like this:

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
│   │   └── schema.ts
│   ├── pages/
│   │   └── person/
│   │       ├── @routes.ts
│   │       ├── PersonList.vue
│   │       ├── PersonAdd.vue
│   │       ├── PersonView.vue
│   │       └── PersonEdit.vue
│   ├── App.vue
│   ├── router.ts
│   ├── main.ts
│   └── setup.ts
└── tests/
    ├── src/
    └── pages/
```

The domain layer is **framework-agnostic** — the same schema and handlers work in React, React Native, or Svelte. Only the pages and renderers are platform-specific.

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

- [Domain Layer](/react-native/domain) — define schema, events, handlers, and hooks (framework-agnostic)
- [i18n](/react-native/i18n) — add field labels and group titles (framework-agnostic)
- [Screens](/vue/screens) — build the 4 CRUD screens with vue-router
- [useDataForm](/vue/use-data-form) — full Vue composable API reference
- [useDataTable](/vue/use-data-table) — table composable API reference
- [Testing](/vue/testing) — test your app with Vitest
