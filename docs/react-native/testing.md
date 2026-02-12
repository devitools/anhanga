# Testing

Ybyra provides testing helpers that mock React Native, Expo, and `@ybyra/react-native` internals so you can run tests with Vitest in a plain Node environment — no emulator needed.

## Install dev dependencies

```bash
pnpm add -D vitest @vitest/coverage-v8
```

## Configure Vitest

Create a `vitest.config.mts` that uses the helpers from `@ybyra/react-native/testing/vitest`:

```typescript
// vitest.config.mts
import { defineConfig } from 'vitest/config'
import { createAliases, createSetupFiles } from '@ybyra/react-native/testing/vitest'

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: createAliases(),
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx}'],
    setupFiles: createSetupFiles(),
    coverage: {
      reportsDirectory: 'tests/.coverage',
      include: ['src/**', 'app/**'],
    },
  },
})
```

`createAliases()` maps `react-native`, `expo-router`, `expo-status-bar`, `expo-sqlite`, `@expo/vector-icons`, and `react-i18next` to lightweight mocks. `createSetupFiles()` registers global mocks for `@ybyra/react-native` components (`DataForm`, `DataTable`, `Page`, `useComponent`, `withProviders`) and `@ybyra/persistence`.

## Testing settings

Verify that i18n initializes correctly and the theme is properly configured:

```typescript
// tests/src/settings/i18n.test.ts
import { describe, it, expect } from 'vitest'

describe('src/settings/i18n', () => {
  it('exports initialized i18n instance', async () => {
    const i18n = (await import('../../../src/settings/i18n')).default
    expect(i18n).toBeDefined()
    expect(i18n.t).toBeTypeOf('function')
    expect(i18n.language).toBe('pt-BR')
  })
})
```

```typescript
// tests/src/settings/theme.test.ts
import { describe, it, expect } from 'vitest'
import { defaultTheme } from '@ybyra/react-native'
import { theme } from '../../../src/settings/theme'

describe('src/settings/theme', () => {
  it('exports theme as spread of defaultTheme', () => {
    expect(theme).toEqual(defaultTheme)
  })

  it('is a new object, not a reference', () => {
    expect(theme).not.toBe(defaultTheme)
  })
})
```

## Testing the setup

Verify that the service, handlers, and hooks are correctly wired:

```typescript
// tests/src/setup.test.ts
import { describe, it, expect } from 'vitest'
import { productService, productHandlers, productHooks } from '../../src/setup'

describe('src/setup', () => {
  it('exports service with CRUD methods', () => {
    expect(productService.create).toBeTypeOf('function')
    expect(productService.read).toBeTypeOf('function')
    expect(productService.update).toBeTypeOf('function')
    expect(productService.destroy).toBeTypeOf('function')
    expect(productService.paginate).toBeTypeOf('function')
  })

  it('exports handlers as an object of functions', () => {
    for (const handler of Object.values(productHandlers)) {
      expect(handler).toBeTypeOf('function')
    }
  })

  it('exports hooks with bootstrap and fetch', () => {
    expect(productHooks).toHaveProperty('bootstrap')
    expect(productHooks).toHaveProperty('fetch')
  })
})
```

## Testing screens

Screen tests verify that each page exports a valid component and renders without errors. The mocks provided by `createSetupFiles()` replace `DataForm`, `DataTable`, `Page`, and other components with simple stubs, so these tests run instantly without mounting a real React Native tree:

```typescript
// tests/app/product/add.test.tsx
import { describe, it, expect } from 'vitest'

describe('app/product/add', () => {
  it('exports default page component', async () => {
    const { default: ProductAddPage } = await import('../../../app/product/add')
    expect(ProductAddPage).toBeTypeOf('function')
  })

  it('renders with Page and DataForm', async () => {
    const { default: ProductAddPage } = await import('../../../app/product/add')
    const element = ProductAddPage()
    expect(element).toBeDefined()
  })
})
```

The same pattern applies to the list, view, and edit screens — just swap the import path and component name.

## Running tests

```bash
pnpm test                  # run all tests
pnpm test -- --coverage    # run with coverage report
```

## Test structure

After adding all tests, your `tests/` directory mirrors the source:

```
tests/
  src/
    settings/
      i18n.test.ts
      theme.test.ts
    setup.test.ts
  app/
    index.test.tsx
    layout.test.tsx
    product/
      index.test.tsx
      add.test.tsx
      view.test.tsx
      edit.test.tsx
```
