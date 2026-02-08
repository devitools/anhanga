# Installation

## Prerequisites

- Node.js 18+
- React 18+
- A package manager: pnpm (recommended), npm, or yarn

## Install Packages

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

`@anhanga/core` has **zero dependencies**. `@anhanga/react` requires React 18+ as a peer dependency.

## Package Overview

| Package | What it provides |
|---------|-----------------|
| `@anhanga/core` | Schema definition, field types, actions, groups, scopes, type inference |
| `@anhanga/react` | `useSchemaForm`, `useSchemaTable`, renderer registry, validation |

You can use `@anhanga/core` standalone if you're building your own UI integration. `@anhanga/react` provides ready-to-use React hooks.
