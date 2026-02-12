# Vue + Quasar Framework

## Package Dependencies

```
@ybyra/core
@ybyra/vue
@ybyra/vue-quasar        ← UI components (DataForm, DataTable, DataPage)
@ybyra/persistence       ← persistence driver
vue-router                 ← routing
quasar                     ← Quasar UI framework
```

## Page Structure

```
src/pages/
├── {domain}/
│   └── @routes.ts           ← scope-to-route mapping
├── {Domain}List.vue         ← DataTable (Scope.index)
├── {Domain}Add.vue          ← DataForm (Scope.add)
├── {Domain}View.vue         ← DataForm (Scope.view)
└── {Domain}Edit.vue         ← DataForm (Scope.edit)
```

## Routes File

```typescript
// src/pages/person/@routes.ts
import { Scope, type ScopeRoute, type ScopeValue } from "@ybyra/core";

export const scopes: Record<ScopeValue, ScopeRoute> = {
  [Scope.index]: { path: "/person" },
  [Scope.add]: { path: "/person/add" },
  [Scope.view]: { path: "/person/view/:id" },
  [Scope.edit]: { path: "/person/edit/:id" },
};
```

## List Page (DataTable)

```vue
<template>
  <DataPage
    :domain="'person'"
    :scope="Scope.index"
    :permissions="allPermissions(person)"
  >
    <DataTable
      :schema="person"
      :scope="Scope.index"
      :handlers="personHandlers"
      :hooks="personHooks"
      :component="component"
      :permissions="allPermissions(person)"
      :page-size="10"
    />
  </DataPage>
</template>

<script setup lang="ts">
import { personHandlers, personHooks } from "@/setup";
import { Scope } from "@ybyra/core";
import { allPermissions, PersonSchema } from "@ybyra/demo";
import { DataPage, DataTable, useComponent } from "@ybyra/vue-quasar";
import { scopes } from "./person/@routes";

const person = PersonSchema.provide();
const component = useComponent(Scope.index, scopes);
</script>
```

## Add Page (DataForm)

```vue
<template>
  <DataPage
    :domain="'person'"
    :scope="Scope.add"
    :permissions="allPermissions(person)"
  >
    <DataForm
      :schema="person"
      :scope="Scope.add"
      :events="personEvents"
      :handlers="personHandlers"
      :hooks="personHooks"
      :component="component"
      :permissions="allPermissions(person)"
    />
  </DataPage>
</template>

<script setup lang="ts">
import { personHandlers, personHooks } from "@/setup";
import { Scope } from "@ybyra/core";
import { allPermissions, personEvents, PersonSchema } from "@ybyra/demo";
import { DataForm, DataPage, useComponent } from "@ybyra/vue-quasar";
import { scopes } from "./person/@routes";

const person = PersonSchema.provide();
const component = useComponent(Scope.add, scopes);
</script>
```

## View Page (DataForm with context)

```vue
<template>
  <DataPage
    :domain="'person'"
    :scope="Scope.view"
    :permissions="allPermissions(person)"
  >
    <DataForm
      :schema="person"
      :scope="Scope.view"
      :events="personEvents"
      :handlers="personHandlers"
      :hooks="personHooks"
      :context="{ id }"
      :component="component"
      :permissions="allPermissions(person)"
    />
  </DataPage>
</template>

<script setup lang="ts">
import { personHandlers, personHooks } from "@/setup";
import { Scope } from "@ybyra/core";
import { allPermissions, personEvents, PersonSchema } from "@ybyra/demo";
import { DataForm, DataPage, useComponent } from "@ybyra/vue-quasar";
import { useRoute } from "vue-router";
import { scopes } from "./person/@routes";

const route = useRoute();
const id = route.params.id as string;
const person = PersonSchema.provide();
const component = useComponent(Scope.view, scopes);
</script>
```

## Edit Page (DataForm with context)

Same as View but with `Scope.edit`:

```vue
<template>
  <DataPage :domain="'person'" :scope="Scope.edit" :permissions="allPermissions(person)">
    <DataForm
      :schema="person" :scope="Scope.edit" :events="personEvents"
      :handlers="personHandlers" :hooks="personHooks" :context="{ id }"
      :component="component" :permissions="allPermissions(person)"
    />
  </DataPage>
</template>

<script setup lang="ts">
import { personHandlers, personHooks } from "@/setup";
import { Scope } from "@ybyra/core";
import { allPermissions, personEvents, PersonSchema } from "@ybyra/demo";
import { DataForm, DataPage, useComponent } from "@ybyra/vue-quasar";
import { useRoute } from "vue-router";
import { scopes } from "./person/@routes";

const route = useRoute();
const id = route.params.id as string;
const person = PersonSchema.provide();
const component = useComponent(Scope.edit, scopes);
</script>
```

## Router Setup

```typescript
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", redirect: "/person" },
  { path: "/person", component: () => import("./pages/PersonList.vue") },
  { path: "/person/add", component: () => import("./pages/PersonAdd.vue") },
  { path: "/person/edit/:id", component: () => import("./pages/PersonEdit.vue") },
  { path: "/person/view/:id", component: () => import("./pages/PersonView.vue") },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
```

## Setup File

```typescript
// src/setup.ts
import { createWebDriver } from "@ybyra/persistence/web";
import { createPersonService, createPersonHandlers, createPersonHooks } from "@ybyra/demo";

const driver = createWebDriver();
export const personService = createPersonService(driver);
export const personHandlers = createPersonHandlers(personService);
export const personHooks = createPersonHooks(personService);
```

## Key Differences from React Web

1. **`useComponent(scope, scopes)`** — no `navigate` argument (uses vue-router internally)
2. **`useRoute().params.id`** — instead of `useParams()`
3. **Vue SFC format** — `<template>` + `<script setup lang="ts">`
4. **Props use `:prop` binding** — `:schema="person"` instead of `schema={person}`
5. **Domain string literal in template** — `:domain="'person'"` (note quotes)
