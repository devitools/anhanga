# Installation

This guide walks through setting up a new Expo project with Anhanga from scratch.

## Create the Expo project

```bash
npx create-expo-app my-app
cd my-app
```

## Install dependencies

```bash
pnpm add @anhanga/core @anhanga/react @anhanga/react-native @anhanga/persistence
pnpm add expo-router expo-status-bar expo-sqlite react-native-safe-area-context react-native-screens
pnpm add i18next react-i18next @expo/vector-icons
```

## Configure `app.json`

Enable Expo Router, SQLite (used by `@anhanga/persistence`), and typed routes:

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

Anhanga resolves all labels through i18next. Create a translations file and initialize it:

```typescript
// settings/locales/en.ts
export const en = {
  common: {
    actions: {
      add: 'Add',
      view: 'View',
      edit: 'Edit',
      create: 'Create',
      update: 'Update',
      cancel: 'Cancel',
      destroy: 'Delete',
      'create.invalid': 'Fix the errors before submitting',
      'create.success': 'Record created successfully',
      'update.invalid': 'Fix the errors before submitting',
      'update.success': 'Record updated successfully',
      'destroy.confirm': 'Are you sure you want to delete this record?',
      'destroy.success': 'Record deleted successfully',
    },
    table: {
      columns: 'Columns',
      previous: 'Previous',
      next: 'Next',
      page: 'Page {{page}} of {{total}}',
      empty: 'No records found',
      selected: '{{count}} selected',
      actions: 'Actions',
      recordsPerPage: 'Records per page',
    },
    dialog: { confirm: 'Confirm', cancel: 'Cancel', ok: 'OK', alert: 'Alert' },
    scopes: { index: 'List', add: 'Add', view: 'View', edit: 'Edit' },
  },
  validation: {
    required: 'Required field',
    minLength: 'Minimum {{value}} characters',
    maxLength: 'Maximum {{value}} characters',
    min: 'Minimum value is {{value}}',
    max: 'Maximum value is {{value}}',
    minDate: 'Date must be after {{value}}',
    maxDate: 'Date must be before {{value}}',
    pattern: 'Invalid format',
  },
  // domain-specific labels (add one block per domain)
  product: {
    title: 'Product',
    fields: {
      id: 'ID',
      name: 'Name',
      sku: 'SKU',
      email: 'Email',
      active: 'Active',
      quantity: 'Quantity',
      price: 'Price',
    },
    groups: {
      info: 'Information',
      pricing: 'Pricing',
    },
  },
}
```

```typescript
// settings/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './locales/en'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  keySeparator: '.',
})

export default i18n
```

The key convention is `{domain}.fields.{fieldName}` for field labels, `{domain}.groups.{groupName}` for group titles, and `common.actions.{actionName}` for action buttons. Anhanga resolves these automatically — you never hardcode labels in your schema.

## Set up the persistence service

`@anhanga/persistence` ships with a SQLite driver that auto-creates tables from your schema. Create a service for your domain:

```typescript
// domain/product/service.ts
import { createService } from '@anhanga/core'
import type { PersistenceContract } from '@anhanga/core'
import { ProductSchema } from './schema'

export function createProductService(driver: PersistenceContract) {
  return createService(ProductSchema, driver)
}
```

`createService` returns an object implementing `ServiceContract` — with `create`, `read`, `update`, `destroy`, and `paginate` methods. The driver handles the actual database operations; the service maps between your schema and the persistence layer.

## Project structure

After setup, your project should look like this:

```
my-app/
  app/
    _layout.tsx              ← root layout (DialogProvider + Stack)
    index.tsx                ← redirect to /product
    product/
      @routes.ts             ← scope → path mapping
      index.tsx              ← list screen
      add.tsx                ← add screen
      view/[id].tsx          ← view screen
      edit/[id].tsx          ← edit screen
  settings/
    schema.ts                ← configure() base schema
    handlers.ts              ← default CRUD handlers
    hooks.ts                 ← default bootstrap/fetch hooks
    i18n.ts                  ← i18next initialization
    locales/en.ts            ← translations
  domain/product/
    schema.ts                ← ProductSchema
    events.ts                ← field events
    handlers.ts              ← action handlers factory
    hooks.ts                 ← lifecycle hooks factory
    service.ts               ← persistence service
  src/
    setup.ts                 ← wire driver + service + handlers + hooks
  app.json
  package.json
```

## Next Steps

- [Domain Layer](/react-native/domain) — define your schema, events, handlers, and hooks
- [Screens](/react-native/screens) — build the 4 CRUD screens
