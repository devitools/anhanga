# Installation

## Prerequisites

- Node.js 18+
- React 18+, Vue 3.4+, or Svelte 5+
- A package manager: pnpm (recommended), npm, or yarn

## Install Packages

### React

::: code-group

```bash [pnpm]
pnpm add @anhanga/core @anhanga/react
```

```bash [npm]
npm install @anhanga/core @anhanga/react
```

```bash [yarn]
yarn add @anhanga/core @anhanga/react
```

:::

### Vue

::: code-group

```bash [pnpm]
pnpm add @anhanga/core @anhanga/vue
```

```bash [npm]
npm install @anhanga/core @anhanga/vue
```

```bash [yarn]
yarn add @anhanga/core @anhanga/vue
```

:::

### Svelte

::: code-group

```bash [pnpm]
pnpm add @anhanga/core @anhanga/svelte
```

```bash [npm]
npm install @anhanga/core @anhanga/svelte
```

```bash [yarn]
yarn add @anhanga/core @anhanga/svelte
```

:::

`@anhanga/core` has **zero dependencies**. `@anhanga/react` requires React 18+, `@anhanga/vue` requires Vue 3.4+, and `@anhanga/svelte` requires Svelte 5+ as peer dependencies.

## Package Overview

| Package | What it provides |
|---------|-----------------|
| `@anhanga/core` | Schema definition, field types, actions, groups, scopes, type inference |
| `@anhanga/react` | `useSchemaForm`, `useSchemaTable`, renderer registry, validation (React hooks) |
| `@anhanga/vue` | `useSchemaForm`, `useSchemaTable`, renderer registry, validation (Vue composables) |
| `@anhanga/svelte` | `useSchemaForm`, `useSchemaTable`, renderer registry, validation (Svelte stores) |
| `@anhanga/demo` | Shared demo domain — person schema, services, settings, i18n |

You can use `@anhanga/core` standalone if you're building your own UI integration. `@anhanga/react`, `@anhanga/vue`, and `@anhanga/svelte` provide ready-to-use integrations for their respective frameworks.
