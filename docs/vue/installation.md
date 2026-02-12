# Installation

This guide walks through setting up a new Vite + Vue + Quasar project with Ybyra from scratch.

## Create the Vite project

```bash
pnpm create vite my-app --template vue-ts
cd my-app
```

## Install dependencies

```bash
pnpm add @ybyra/core @ybyra/vue @ybyra/vue-quasar
pnpm add vue-router quasar @quasar/extras
pnpm add -D @quasar/vite-plugin
```

## Configure Quasar

Add the Quasar Vite plugin to your `vite.config.ts`:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar(),
  ],
})
```

## Configure i18n

Ybyra resolves all labels through vue-i18n. The base translations (`common.*` and `validation.*`) ship with `@ybyra/core` — action labels, table UI, dialog buttons, scope names, and validation messages.

Start by initializing i18n with the base translations only:

```typescript
// src/settings/i18n.ts
import { ptBR } from '@ybyra/core'
import { configureI18n } from '@ybyra/vue'

export default configureI18n({
  resources: {
    'pt-BR': { translation: ptBR },
  },
  default: 'pt-BR',
  fallback: 'pt-BR',
})
```

`configureI18n` initializes vue-i18n with the correct defaults (key separator, interpolation) — you don't need to configure those manually.

After defining your schema and its fields, you'll add domain-specific translations (field labels, group titles). That's covered in the [i18n](/vue/i18n) page.

## Next Steps

- [Domain Layer](/vue/domain) — define your schema, events, handlers, and hooks
