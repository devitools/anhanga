# Project Overview

## Purpose
Anhanga is a schema-driven UI framework for building data forms and tables across multiple frontend frameworks (React, React Native, Vue/Quasar, Svelte/SvelteKit).

## Tech Stack
- TypeScript, pnpm workspaces monorepo
- Bundler: tsup (ESM) for packages, Vite for vue-quasar/sveltekit packages and web playgrounds
- Testing: Vitest
- Frameworks: React, React Native (Expo), Vue 3 + Quasar, Svelte 5 + SvelteKit

## Key Packages
- `@anhanga/core` — Schema definition, field types, actions, groups, permissions, i18n locales
- `@anhanga/react`, `@anhanga/vue`, `@anhanga/svelte` — Framework hooks (useDataForm, useDataTable)
- `@anhanga/react-native`, `@anhanga/react-web`, `@anhanga/vue-quasar`, `@anhanga/sveltekit` — UI component packages
- `@anhanga/demo` — Shared demo code (person domain schema, services, i18n setup)
- `@anhanga/persistence` — Storage drivers

## Code Style
- No comments unless necessary
- No labels in code — i18n handles all labels
- Object literals for fields/groups/actions
- Direct factory imports: `text()`, `date()`, `toggle()`
- Conventional commits: `feat:`, `fix:`, `refactor:`, etc.
- No co-author footers in commits
