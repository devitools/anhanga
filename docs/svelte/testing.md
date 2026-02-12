# Testing

The SvelteKit playground uses Vitest with the Svelte Vite plugin so `.svelte` files are compiled at test time. Tests run in a plain Node environment — no browser required.

## Install dev dependencies

```bash
pnpm add -D vitest @vitest/coverage-v8 @sveltejs/vite-plugin-svelte
```

## Configure Vitest

Create a `vitest.config.mts` with the Svelte plugin, `$lib` alias, and `$app/*` mock aliases:

```typescript
// vitest.config.mts
import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

export default defineConfig({
  plugins: [svelte({ hot: false })],
  resolve: {
    alias: {
      '$lib': resolve(__dirname, './src/lib'),
      '$app/navigation': resolve(__dirname, './tests/mocks/$app/navigation.ts'),
      '$app/state': resolve(__dirname, './tests/mocks/$app/state.ts'),
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

`svelte({ hot: false })` compiles `.svelte` files without HMR. The `$lib` alias maps to `./src/lib` (matching SvelteKit conventions), while `$app/navigation` and `$app/state` point to mock files that replace SvelteKit runtime modules.

## Mock files

### `$app/navigation`

```typescript
// tests/mocks/$app/navigation.ts
import { vi } from 'vitest'

export const goto = vi.fn()
export const invalidate = vi.fn()
export const invalidateAll = vi.fn()
export const preloadData = vi.fn()
export const preloadCode = vi.fn()
export const beforeNavigate = vi.fn()
export const afterNavigate = vi.fn()
export const onNavigate = vi.fn()
```

### `$app/state`

```typescript
// tests/mocks/$app/state.ts
export const page = {
  params: { id: 'test-id-1' },
  url: new URL('http://localhost'),
  route: { id: '' },
  status: 200,
  error: null,
  data: {},
  form: null,
}
```

### Setup file

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

## Mocking `lucide-svelte`

The layout imports Lucide icons for action icons. Tests that import the layout (directly or transitively) need to mock `lucide-svelte`:

```typescript
vi.mock('lucide-svelte', () => ({
  Plus: 'Plus',
  Eye: 'Eye',
  Pencil: 'Pencil',
  Save: 'Save',
  X: 'X',
  Trash2: 'Trash2',
}))
```

## Testing routes

Svelte 5 components are objects (not functions), so route tests verify the default export is defined:

```typescript
// tests/routes/person/add.test.ts
import { describe, it, expect } from 'vitest'

describe('routes/person/add/+page', () => {
  it('exports default component', async () => {
    const { default: PersonAdd } = await import('../../../src/routes/person/add/+page.svelte')
    expect(PersonAdd).toBeDefined()
  })
})
```

The same pattern applies to all route pages — layout, index, list, view, and edit.

## Running tests

```bash
pnpm test                  # run all tests
pnpm test -- --coverage    # run with coverage report
```

## Test structure

```
tests/
  mocks/
    $app/
      navigation.ts
      state.ts
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
      routes.test.ts
  routes/
    layout.test.ts
    index.test.ts
    person/
      index.test.ts
      add.test.ts
      view.test.ts
      edit.test.ts
```
