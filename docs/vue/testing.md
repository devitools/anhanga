# Testing

The Vue Quasar playground uses Vitest with the Vue Vite plugin so `.vue` SFC files are compiled at test time. Tests run in a plain Node environment — no browser required.

## Install dev dependencies

```bash
pnpm add -D vitest @vitest/coverage-v8 @vitejs/plugin-vue
```

## Configure Vitest

Create a `vitest.config.mts` with the Vue plugin, `@` alias, and a setup file:

```typescript
// vitest.config.mts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/setup.ts'],
    coverage: {
      reportsDirectory: 'tests/.coverage',
      include: ['src/**'],
    },
  },
})
```

`vue()` compiles `.vue` single-file components during test transforms. The `@` alias maps to `./src` for cleaner imports.

## Mock strategy

### Global setup

The setup file mocks `@ybyra/persistence/web` globally since `createWebDriver` uses `localStorage`:

```typescript
// tests/setup.ts
import { vi } from 'vitest'

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
```

### Page mocks

Page components depend on `vue-router`, `vue-i18n`, and `quasar`. A shared `tests/pages/mocks.ts` stubs them:

```typescript
// tests/pages/mocks.ts
import { vi } from 'vitest'

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
  })),
  useRoute: vi.fn(() => ({
    params: { id: '1' },
    path: '/person',
  })),
  createRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
    install: vi.fn(),
  })),
  createWebHistory: vi.fn(),
}))

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
    te: (key: string) => key.startsWith('person.') || key.startsWith('common.'),
  })),
  createI18n: vi.fn(() => ({
    global: { t: (key: string) => key, te: () => true },
    install: vi.fn(),
  })),
}))

vi.mock('quasar', () => ({
  Notify: { create: vi.fn() },
  Dialog: { create: vi.fn() },
  Loading: { show: vi.fn(), hide: vi.fn() },
  QCard: { name: 'QCard', template: '<div><slot /></div>' },
  QCardSection: { name: 'QCardSection', template: '<div><slot /></div>' },
  QLayout: { name: 'QLayout', template: '<div><slot /></div>' },
  QPageContainer: { name: 'QPageContainer', template: '<div><slot /></div>' },
}))
```

Each page test imports `'../mocks'` before any source imports.

## Testing pages

Vue SFC components export an object with a `setup` function. Page tests verify both:

```typescript
// tests/pages/person/add.test.ts
import '../mocks'
import { describe, it, expect } from 'vitest'

describe('pages/PersonAdd', () => {
  it('exports default component', async () => {
    const { default: PersonAdd } = await import('../../../src/pages/PersonAdd.vue')
    expect(PersonAdd).toBeDefined()
  })

  it('has a setup function', async () => {
    const { default: PersonAdd } = await import('../../../src/pages/PersonAdd.vue')
    expect(PersonAdd.setup).toBeTypeOf('function')
  })
})
```

The same pattern applies to list, view, and edit pages.

## Running tests

```bash
pnpm test                  # run all tests
pnpm test -- --coverage    # run with coverage report
```

## Test structure

```
tests/
  setup.ts
  src/
    settings/
      i18n.test.ts
      icons.test.ts
    application/service/
      personService.test.ts
    domain/person/
      schema.test.ts
      events.test.ts
      handlers.test.ts
      hooks.test.ts
    routes/
      router.test.ts
  pages/
    mocks.ts
    person/
      list.test.ts
      add.test.ts
      view.test.ts
      edit.test.ts
```
