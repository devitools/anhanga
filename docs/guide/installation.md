# Installation

## Prerequisites

- Node.js 18+
- React 18+ or Vue 3.4+
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

`@anhanga/core` has **zero dependencies**. `@anhanga/react` requires React 18+ and `@anhanga/vue` requires Vue 3.4+ as peer dependencies.

## Package Overview

| Package | What it provides |
|---------|-----------------|
| `@anhanga/core` | Schema definition, field types, actions, groups, scopes, type inference |
| `@anhanga/react` | `useSchemaForm`, `useSchemaTable`, renderer registry, validation (React hooks) |
| `@anhanga/vue` | `useSchemaForm`, `useSchemaTable`, renderer registry, validation (Vue composables) |
| `@anhanga/demo` | Shared demo domain — person schema, services, settings, i18n |

You can use `@anhanga/core` standalone if you're building your own UI integration. `@anhanga/react` and `@anhanga/vue` provide ready-to-use hooks/composables for their respective frameworks.
