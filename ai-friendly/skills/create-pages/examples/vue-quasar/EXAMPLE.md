# Person Domain — Vue + Quasar Pages

## PersonList.vue

```vue-no-check
<template>
  <DataPage :domain="'person'" :scope="Scope.index" :permissions="allPermissions(person)">
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
import { allPermissions, PersonSchema } from "@/domain/person";
import { DataPage, DataTable, useComponent } from "@ybyra/vue-quasar";
import { scopes } from "./person/@routes";

const person = PersonSchema.provide();
const component = useComponent(Scope.index, scopes);
</script>
```

## PersonAdd.vue

```vue-no-check
<template>
  <DataPage :domain="'person'" :scope="Scope.add" :permissions="allPermissions(person)">
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
import { allPermissions, personEvents, PersonSchema } from "@/domain/person";
import { DataForm, DataPage, useComponent } from "@ybyra/vue-quasar";
import { scopes } from "./person/@routes";

const person = PersonSchema.provide();
const component = useComponent(Scope.add, scopes);
</script>
```

## PersonView.vue

```vue-no-check
<template>
  <DataPage :domain="'person'" :scope="Scope.view" :permissions="allPermissions(person)">
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
import { allPermissions, personEvents, PersonSchema } from "@/domain/person";
import { DataForm, DataPage, useComponent } from "@ybyra/vue-quasar";
import { useRoute } from "vue-router";
import { scopes } from "./person/@routes";

const route = useRoute();
const id = route.params.id as string;
const person = PersonSchema.provide();
const component = useComponent(Scope.view, scopes);
</script>
```

## PersonEdit.vue

```vue-no-check
<template>
  <DataPage :domain="'person'" :scope="Scope.edit" :permissions="allPermissions(person)">
    <DataForm
      :schema="person"
      :scope="Scope.edit"
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
import { allPermissions, personEvents, PersonSchema } from "@/domain/person";
import { DataForm, DataPage, useComponent } from "@ybyra/vue-quasar";
import { useRoute } from "vue-router";
import { scopes } from "./person/@routes";

const route = useRoute();
const id = route.params.id as string;
const person = PersonSchema.provide();
const component = useComponent(Scope.edit, scopes);
</script>
```

## @routes.ts

```ts-no-check
import { Scope, type ScopeRoute, type ScopeValue } from "@ybyra/core";

export const scopes: Record<ScopeValue, ScopeRoute> = {
  [Scope.index]: { path: "/person" },
  [Scope.add]: { path: "/person/add" },
  [Scope.view]: { path: "/person/view/:id" },
  [Scope.edit]: { path: "/person/edit/:id" },
};
```

## router.ts

```ts-no-check
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
