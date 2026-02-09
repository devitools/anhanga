# Anhanga

**Schema-driven forms for React.** Define your fields once, get type-safe forms, tables, validation, events, and actions — all from a single source of truth.

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

## Documentation

Visit the [full documentation](https://devitools.github.io/anhanga/) for guides, API reference, and examples.

- [Getting Started](https://devitools.github.io/anhanga/guide/introduction)
- [Installation](https://devitools.github.io/anhanga/guide/installation)
- [Quick Start](https://devitools.github.io/anhanga/guide/quick-start)
- [API Reference](https://devitools.github.io/anhanga/api/core)

## Packages

| Package | Description |
|---------|-------------|
| `@anhanga/core` | Schema definition, field types, actions, groups, type system |
| `@anhanga/react` | `useDataForm` / `useDataTable` hooks, renderer registry, validation |

## Installation

```bash
pnpm add @anhanga/core @anhanga/react
```

## Development

```bash
pnpm install
pnpm build          # build core and react
pnpm test           # run all tests
pnpm docs:dev       # documentation dev server
```

## License

MIT
