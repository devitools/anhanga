# Installation

This guide walks through setting up a new Vite + React project with Ybyra from scratch.

## Create the Vite project

```bash
pnpm create vite my-app --template react-ts
cd my-app
```

## Install dependencies

```bash
pnpm add @ybyra/core @ybyra/react @ybyra/react-web
pnpm add react-router-dom
```

## Configure i18n

Ybyra resolves all labels through i18next. The base translations (`common.*` and `validation.*`) ship with `@ybyra/core` — action labels, table UI, dialog buttons, scope names, and validation messages.

Start by initializing i18n with the base translations only:

```typescript
// src/settings/i18n.ts
import { ptBR } from '@ybyra/core'
import { configureI18n } from '@ybyra/react'

export default configureI18n({
  resources: {
    'pt-BR': { translation: ptBR },
  },
  default: 'pt-BR',
  fallback: 'pt-BR',
})
```

`configureI18n` initializes i18next with `react-i18next` and the correct defaults (key separator, interpolation) — you don't need to configure those manually.

After defining your schema and its fields, you'll add domain-specific translations (field labels, group titles). That's covered in the [i18n](/react/i18n) page.

## Next Steps

- [Domain Layer](/react/domain) — define your schema, events, handlers, and hooks
