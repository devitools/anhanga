# Installation

## Prerequisites

- Node.js 18+
- React 18+, Vue 3.4+, or Svelte 5+
- A package manager: pnpm (recommended), npm, or yarn

## Install Packages

### React

::: code-group

```bash [pnpm]
pnpm add @ybyra/core @ybyra/react
```

```bash [npm]
npm install @ybyra/core @ybyra/react
```

```bash [yarn]
yarn add @ybyra/core @ybyra/react
```

:::

### Vue

::: code-group

```bash [pnpm]
pnpm add @ybyra/core @ybyra/vue
```

```bash [npm]
npm install @ybyra/core @ybyra/vue
```

```bash [yarn]
yarn add @ybyra/core @ybyra/vue
```

:::

### Svelte

::: code-group

```bash [pnpm]
pnpm add @ybyra/core @ybyra/svelte
```

```bash [npm]
npm install @ybyra/core @ybyra/svelte
```

```bash [yarn]
yarn add @ybyra/core @ybyra/svelte
```

:::

`@ybyra/core` has **zero dependencies**. `@ybyra/react` requires React 18+, `@ybyra/vue` requires Vue 3.4+, and `@ybyra/svelte` requires Svelte 5+ as peer dependencies.

## Package Overview

| Package | What it provides |
|---------|-----------------|
| `@ybyra/core` | Schema definition, field types, actions, groups, scopes, type inference |
| `@ybyra/react` | `useDataForm`, `useDataTable`, renderer registry, validation (React hooks) |
| `@ybyra/react-web` | `DataForm`, `DataTable`, `DataPage`, `useComponent`, theme (React + Shadcn) |
| `@ybyra/react-native` | `DataForm`, `DataTable`, `DataPage`, `useComponent`, theme (React Native + Expo) |
| `@ybyra/vue` | `useDataForm`, `useDataTable`, renderer registry, validation (Vue composables) |
| `@ybyra/vue-quasar` | `DataForm`, `DataTable`, `DataPage`, `useComponent` (Vue + Quasar) |
| `@ybyra/svelte` | `useDataForm`, `useDataTable`, renderer registry, validation (Svelte stores) |
| `@ybyra/sveltekit` | `DataForm`, `DataTable`, `DataPage`, `createComponent` (SvelteKit) |
| `@ybyra/persistence` | `createLocalDriver`, `createWebDriver` — persistence drivers |
| `@ybyra/demo` | Shared demo domain — person schema, services, settings, i18n |

You can use `@ybyra/core` standalone if you're building your own UI integration. `@ybyra/react`, `@ybyra/vue`, and `@ybyra/svelte` provide ready-to-use integrations for their respective frameworks.
