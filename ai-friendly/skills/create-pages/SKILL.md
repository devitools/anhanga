---
name: create-pages
description: Creates all CRUD pages (list, add, view, edit) with routing for a Ybyra domain in any supported framework — React Web, React Native, Vue/Quasar, or SvelteKit.
---

# Skill: Create Pages

Generate the presentation layer (pages + routes) for a Ybyra domain.

## What This Skill Creates

### React Web / React Native
```
src/pages/{domain}/
  {Domain}List.tsx
  {Domain}Add.tsx
  {Domain}View.tsx
  {Domain}Edit.tsx
  @routes.ts
```

### Vue + Quasar
```
src/pages/{domain}/
  {Domain}List.vue
  {Domain}Add.vue
  {Domain}View.vue
  {Domain}Edit.vue
  @routes.ts
```

### SvelteKit
```
src/routes/{domain}/
  +page.svelte          ← list
  add/+page.svelte      ← add
  [id]/+page.svelte     ← view
  [id]/edit/+page.svelte ← edit
src/lib/routes/{domain}.ts
```

## Page Pattern (All Frameworks)

Every page follows the same structure:

1. **Import** schema, events, handlers, hooks, component helper, permissions
2. **Create** component via framework helper (`useComponent` / `createComponent`)
3. **Provide** schema instance via `Schema.provide()`
4. **Render** `DataPage` wrapper with `DataForm` or `DataTable` inside

### Key Props

| Prop | List | Add | View | Edit |
|------|------|-----|------|------|
| `schema` | ✅ | ✅ | ✅ | ✅ |
| `scope` | `Scope.index` | `Scope.add` | `Scope.view` | `Scope.edit` |
| `events` | ❌ | ✅ | ✅ | ✅ |
| `handlers` | ✅ | ✅ | ✅ | ✅ |
| `hooks` | ✅ | ✅ | ✅ | ✅ |
| `component` | ✅ | ✅ | ✅ | ✅ |
| `permissions` | ✅ | ✅ | ✅ | ✅ |
| `context` | ❌ | ❌ | `{ id }` | `{ id }` |

### Routes File (`@routes.ts`)

```ts-no-check
import { Scope, type ScopeRoute, type ScopeValue } from "@ybyra/core";

export const scopes: Record<ScopeValue, ScopeRoute> = {
  [Scope.index]: { path: "/{domain}" },
  [Scope.add]: { path: "/{domain}/add" },
  [Scope.view]: { path: "/{domain}/view/:id" },  // SvelteKit: "/{domain}/:id"
  [Scope.edit]: { path: "/{domain}/edit/:id" },  // SvelteKit: "/{domain}/:id/edit"
};
```

## Framework-Specific Patterns

### React Web
- `useComponent(scope, scopes, navigate)` from `@ybyra/react-web`
- `useNavigate()` from `react-router-dom`
- `useParams<{ id: string }>()` for view/edit

### Vue + Quasar
- `useComponent(scope, scopes)` from `@ybyra/vue-quasar`
- `useRoute().params.id` for view/edit
- SFC `<script setup lang="ts">` pattern

### SvelteKit
- `createComponent(scope, scopes, goto, base)` from `@ybyra/sveltekit`
- `goto` from `$app/navigation`, `base` from `$app/paths`
- `page.params.id` from `$app/state`
- File-based routing: `[id]` for params, nested `edit/` for edit scope

### React Native
- `useComponent(scope, scopes, router)` from `@ybyra/react-native`
- `useRouter()` / `useLocalSearchParams()` from `expo-router`
- Same DataForm/DataTable API as React Web

## Router Registration

### React Web (react-router-dom)
```tsx-no-check
<Route path="/{domain}" element={<{Domain}List />} />
<Route path="/{domain}/add" element={<{Domain}Add />} />
<Route path="/{domain}/view/:id" element={<{Domain}View />} />
<Route path="/{domain}/edit/:id" element={<{Domain}Edit />} />
```

### Vue (vue-router)
```ts-no-check
{ path: "/{domain}", component: () => import("./pages/{Domain}List.vue") },
{ path: "/{domain}/add", component: () => import("./pages/{Domain}Add.vue") },
{ path: "/{domain}/view/:id", component: () => import("./pages/{Domain}View.vue") },
{ path: "/{domain}/edit/:id", component: () => import("./pages/{Domain}Edit.vue") },
```

### SvelteKit — file-based routing (no manual registration)
