# Ybyra

**Schema-driven forms for React, Vue, and Svelte.** Define your fields once, get type-safe forms, tables, validation, events, and actions — all from a single source of truth.

```typescript
import { text, Text, date, toggle, group, action, Position, Scope } from '@ybyra/core'

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

## Documentation

Visit the [full documentation](https://devitools.github.io/ybyra/) for guides, API reference, and examples.

- [Getting Started](https://devitools.github.io/ybyra/guide/introduction)
- [Installation](https://devitools.github.io/ybyra/guide/installation)
- [Quick Start](https://devitools.github.io/ybyra/guide/quick-start)
- [API Reference](https://devitools.github.io/ybyra/api/core)

## Packages

| Package | Description |
|---------|-------------|
| `@ybyra/core` | Schema definition, field types, actions, groups, type system |
| `@ybyra/react` | `useDataForm` / `useDataTable` hooks, renderer registry, validation |
| `@ybyra/vue` | `useDataForm` / `useDataTable` composables for Vue |
| `@ybyra/svelte` | `useDataForm` / `useDataTable` stores for Svelte |
| `@ybyra/react-web` | Ready-made field renderers for React web |
| `@ybyra/react-native` | Ready-made field renderers for React Native |
| `@ybyra/vue-quasar` | Ready-made field renderers for Vue + Quasar |
| `@ybyra/sveltekit` | Ready-made field renderers for SvelteKit |
| `@ybyra/persistence` | Local and web persistence drivers |

## Installation

```bash
pnpm add @ybyra/core @ybyra/react
```

## Development

```bash
pnpm install
pnpm build          # build all packages
pnpm test           # run all tests
pnpm docs:dev       # documentation dev server
```

## Publishing

This project uses [changesets](https://github.com/changesets/changesets) for versioning and publishing.

### Creating a changeset

After making changes, run:

```bash
pnpm changeset
```

Follow the prompts to select which packages changed and the semver bump type (patch/minor/major).

### Versioning and releasing

```bash
# Apply version bumps and generate changelogs
pnpm version-packages

# Build and publish to npm
pnpm release
```

> **Note:** You must be logged in to npm (`npm login`) and be a member of the `@ybyra` organization.

## License

MIT
