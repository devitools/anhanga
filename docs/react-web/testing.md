# Testing

The React Web playground uses Vitest with a plain Node environment — no browser required. A shared mocks file stubs framework dependencies so page tests run instantly.

## Install dev dependencies

```bash
pnpm add -D vitest @vitest/coverage-v8
```

## Configure Vitest

Create a `vitest.config.mts` with JSX support and the `@` alias:

```typescript
// vitest.config.mts
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx}'],
    coverage: {
      reportsDirectory: 'tests/.coverage',
      include: ['src/**'],
    },
  },
})
```

`esbuild.jsx: 'automatic'` enables React JSX transform without explicit `React` imports. The `@` alias maps to `./src` so test imports mirror source paths.

## Mock strategy

Page components depend on `react-router-dom`, `@ybyra/react-web`, `@ybyra/persistence/web`, and `sonner`. A shared `tests/pages/mocks.ts` file stubs them all:

```typescript
// tests/pages/mocks.ts
import { vi } from 'vitest'
import { createElement } from 'react'

vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: any) => createElement('div', null, children),
  Routes: ({ children }: any) => createElement('div', null, children),
  Route: () => createElement('div'),
  Navigate: () => createElement('div'),
  useNavigate: vi.fn(() => vi.fn()),
  useParams: vi.fn(() => ({ id: '1' })),
}))

vi.mock('@ybyra/react-web', () => ({
  DataForm: () => createElement('div', { 'data-testid': 'DataForm' }),
  DataTable: () => createElement('div', { 'data-testid': 'DataTable' }),
  Page: ({ children }: any) => createElement('div', { 'data-testid': 'Page' }, children),
  useComponent: vi.fn(() => ({
    scope: 'index',
    scopes: {},
    navigator: {},
    dialog: {},
    toast: {},
    loading: {},
    reload: vi.fn(),
  })),
  withProviders: (Component: any) => Component,
  defaultTheme: {},
  configureI18n: vi.fn(() => ({ t: (k: string) => k, language: 'pt-BR' })),
  configureIcons: vi.fn(),
  resolveActionIcon: vi.fn(),
  resolveGroupIcon: vi.fn(),
}))

vi.mock('@ybyra/persistence/web', () => ({
  createWebDriver: vi.fn(() => ({
    initialize: vi.fn(),
    create: vi.fn(),
    read: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
    search: vi.fn(),
  })),
}))

vi.mock('sonner', () => ({
  Toaster: () => createElement('div'),
}))
```

Each page test imports `'../mocks'` (or `'./mocks'`) before any source imports to ensure mocks are registered.

## Testing pages

Page tests verify that each component exports correctly and renders without errors:

```typescript
// tests/pages/person/add.test.tsx
import '../mocks'
import { describe, it, expect } from 'vitest'

describe('pages/person/PersonAdd', () => {
  it('exports PersonAdd function', async () => {
    const { PersonAdd } = await import('../../../src/pages/person/PersonAdd')
    expect(PersonAdd).toBeTypeOf('function')
  })

  it('renders with Page and DataForm', async () => {
    const { PersonAdd } = await import('../../../src/pages/person/PersonAdd')
    const element = PersonAdd()
    expect(element).toBeDefined()
  })
})
```

The same pattern applies to list, view, and edit pages — swap the import path and component name.

## Running tests

```bash
pnpm test                  # run all tests
pnpm test -- --coverage    # run with coverage report
```

## Test structure

```
tests/
  src/
    settings/
      i18n.test.ts
      theme.test.ts
      icons.test.ts
    application/service/
      personService.test.ts
    domain/person/
      schema.test.ts
      events.test.ts
      handlers.test.ts
      hooks.test.ts
  pages/
    mocks.ts
    app.test.tsx
    person/
      list.test.tsx
      add.test.tsx
      view.test.tsx
      edit.test.tsx
```
