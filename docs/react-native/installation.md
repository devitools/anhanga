# Installation

This guide walks through setting up a new Expo project with Anhanga from scratch.

## Create the Expo project

```bash
npx create-expo-app my-app
cd my-app
```

## Install dependencies

```bash
pnpm add @ybyra/core @ybyra/react-native @ybyra/persistence
pnpm add expo-router @expo/vector-icons
```

## Configure `app.json`

Enable Expo Router, SQLite (used by `@ybyra/persistence`), and typed routes:

```json
{
  "expo": {
    "name": "My App",
    "slug": "my-app",
    "scheme": "my-app",
    "newArchEnabled": true,
    "web": {
      "bundler": "metro",
      "output": "static"
    },
    "plugins": [
      "expo-router",
      "expo-sqlite"
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

## Configure `package.json`

Set the entry point to Expo Router:

```json
{
  "main": "expo-router/entry"
}
```

## Configure i18n

Anhanga resolves all labels through i18next. The base translations (`common.*` and `validation.*`) ship with `@ybyra/core` — action labels, table UI, dialog buttons, scope names, and validation messages.

Start by initializing i18n with the base translations only:

```typescript
// src/settings/i18n.ts
import { ptBR } from '@ybyra/core'
import { configureI18n } from '@ybyra/react-native'

export default configureI18n({
  resources: {
    'pt-BR': { translation: ptBR },
  },
  default: 'pt-BR',
  fallback: 'pt-BR',
})
```

`configureI18n` initializes i18next with `react-i18next` and the correct defaults (key separator, interpolation) — you don't need to configure those manually.

After defining your schema and its fields, you'll add domain-specific translations (field labels, group titles). That's covered in the [i18n](/react-native/i18n) page.

## Configure the theme

Create a theme file that extends the default theme. This allows customization of colors, spacing, and typography:

```typescript
// src/settings/theme.ts
import { defaultTheme } from '@ybyra/react-native'

export const theme = { ...defaultTheme }
```

You can override any property from `defaultTheme` (colors, spacing, borderRadius, fontSize, fontWeight).

## Next Steps

- [Domain Layer](/react-native/domain) — define your schema, events, handlers, and hooks
