# Svelte + SvelteKit

Ybyra works with Svelte through the `@ybyra/svelte` stores and the `@ybyra/sveltekit` UI components. This guide shows how to build a complete CRUD flow — **list, add, view, edit** — using SvelteKit file-based routing.

## Architecture

A typical Ybyra + SvelteKit app structure looks like this:

```
my-app/
├── src/
│   ├── lib/
│   │   ├── settings/
│   │   │   ├── locales/
│   │   │   ├── i18n.ts
│   │   │   ├── i18n-setup.ts
│   │   │   └── icons.ts
│   │   ├── routes/
│   │   │   └── person.ts
│   │   └── setup.ts
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +layout.ts
│   │   ├── +page.svelte
│   │   └── person/
│   │       ├── @routes.ts
│   │       ├── +page.svelte        (list)
│   │       ├── add/+page.svelte    (add)
│   │       ├── [id]/+page.svelte   (view)
│   │       └── [id]/edit/+page.svelte (edit)
│   ├── app.html
│   └── app.css
└── tests/
    ├── mocks/
    ├── src/
    └── routes/
```

The domain layer is **framework-agnostic** — the same schema and handlers work in React, React Native, or Vue. Only the routes and renderers are platform-specific.

## Important Concepts

### How Scopes Drive Everything

To represent the different screens and states of your app, you define **scopes** in your schema. Each scope corresponds to a screen (or a state of a screen) and determines actions, fields, bootstrap logic, etc. An example:

| Scope         | Screen    | Actions shown                        |
|---------------|-----------|--------------------------------------|
| `Scope.index` | List      | add (top), view, edit, destroy (row) |
| `Scope.add`   | Add form  | create, cancel (footer)              |
| `Scope.view`  | View form | cancel, destroy (footer)             |
| `Scope.edit`  | Edit form | update, cancel, destroy (footer)     |

### SvelteKit Specifics

- SvelteKit uses **file-based routing** — each `+page.svelte` maps to a URL
- Route params use bracket syntax: `[id]` in directory names
- Navigation uses `goto` from `$app/navigation` instead of a router hook
- `createComponent` (instead of `useComponent`) builds the `ComponentContract`
- The layout requires `export const ssr = false` in `+layout.ts` (localStorage is not available in SSR)

## Next Steps

- [Installation](/svelte/installation) — set up a new project from scratch
- [Domain Layer](/svelte/domain) — define schema, events, handlers, and hooks
- [i18n](/svelte/i18n) — add field labels and group titles
- [Screens](/svelte/screens) — build the 4 CRUD screens with SvelteKit routing
- [Testing](/svelte/testing) — test your app with Vitest
