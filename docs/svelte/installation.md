# Installation

This guide walks through setting up a new SvelteKit project with Ybyra from scratch.

## Create the SvelteKit project

```bash
npx sv create my-app
cd my-app
```

## Install dependencies

```bash
pnpm add @ybyra/core @ybyra/svelte @ybyra/sveltekit
```

## Configure SSR

Ybyra uses localStorage internally, which is not available during server-side rendering. Disable SSR in your root layout:

```typescript
// src/routes/+layout.ts
export const ssr = false
```

## Configure i18n

Ybyra resolves all labels through i18next. The base translations (`common.*` and `validation.*`) ship with `@ybyra/core` — action labels, table UI, dialog buttons, scope names, and validation messages.

Start by initializing i18n with the base translations only:

```typescript
// src/lib/settings/i18n.ts
import { ptBR } from '@ybyra/core'
import { configureI18n } from '@ybyra/svelte'

export default configureI18n({
  resources: {
    'pt-BR': { translation: ptBR },
  },
  default: 'pt-BR',
  fallback: 'pt-BR',
})
```

`configureI18n` initializes i18next with the correct defaults (key separator, interpolation) — you don't need to configure those manually.

After defining your schema and its fields, you'll add domain-specific translations (field labels, group titles). That's covered in the [i18n](/svelte/i18n) page.

## Next Steps

- [Domain Layer](/svelte/domain) — define your schema, events, handlers, and hooks
