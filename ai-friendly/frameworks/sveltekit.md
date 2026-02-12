# SvelteKit Framework

## Package Dependencies

```
@ybyra/core
@ybyra/svelte
@ybyra/sveltekit         ← UI components (DataForm, DataTable, DataPage)
@ybyra/persistence       ← persistence driver
@sveltejs/kit              ← SvelteKit framework
lucide-svelte              ← icons
```

## Route Structure (file-based routing)

```
src/routes/{domain}/
├── +page.svelte                ← DataTable (Scope.index)
├── @routes.ts                  ← scope-to-route mapping
├── add/
│   └── +page.svelte            ← DataForm (Scope.add)
└── [id]/
    ├── +page.svelte            ← DataForm (Scope.view)
    └── edit/
        └── +page.svelte        ← DataForm (Scope.edit)

src/lib/
├── setup.ts                    ← dependency wiring
├── routes/{domain}.ts          ← scope routes (referenced by lib)
└── settings/
    ├── icons.ts                ← icon configuration
    ├── i18n.ts                 ← translation functions
    ├── i18n-setup.ts           ← configureI18n()
    └── locales/pt-BR.ts        ← translations
```

## Routes File

```typescript
// src/lib/routes/person.ts
import { Scope } from "@ybyra/core";

export const scopes = {
  [Scope.index]: { path: "/person" },
  [Scope.add]: { path: "/person/add" },
  [Scope.view]: { path: "/person/:id" },
  [Scope.edit]: { path: "/person/:id/edit" },
};
```

> Note: SvelteKit uses `/person/:id/edit` (nested) instead of `/person/edit/:id`.

## List Page (DataTable)

```svelte
<!-- src/routes/person/+page.svelte -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { Scope } from "@ybyra/core";
  import { allPermissions, PersonSchema } from "@ybyra/demo";
  import { DataTable, DataPage, createComponent } from "@ybyra/sveltekit";
  import { personHandlers, personHooks } from "$lib/setup";
  import { scopes } from "$lib/routes/person";

  const person = PersonSchema.provide();
  const component = createComponent(Scope.index, scopes, goto, base);
</script>

<DataPage domain={person.domain} scope={Scope.index} permissions={allPermissions(person)}>
  <DataTable
    schema={person}
    scope={Scope.index}
    handlers={personHandlers}
    hooks={personHooks}
    {component}
    permissions={allPermissions(person)}
    pageSize={10}
  />
</DataPage>
```

## Add Page (DataForm)

```svelte
<!-- src/routes/person/add/+page.svelte -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { scopes } from "$lib/routes/person";
  import { personHandlers, personHooks } from "$lib/setup";
  import { Scope } from "@ybyra/core";
  import { allPermissions, personEvents, PersonSchema } from "@ybyra/demo";
  import { createComponent, DataForm, DataPage } from "@ybyra/sveltekit";

  const person = PersonSchema.provide();
  const component = createComponent(Scope.add, scopes, goto, base);
</script>

<DataPage domain={person.domain} scope={Scope.add} permissions={allPermissions(person)}>
  <DataForm
    schema={person}
    scope={Scope.add}
    events={personEvents}
    handlers={personHandlers}
    hooks={personHooks}
    {component}
    permissions={allPermissions(person)}
  />
</DataPage>
```

## View Page (DataForm with context)

```svelte
<!-- src/routes/person/[id]/+page.svelte -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/state";
  import { scopes } from "$lib/routes/person";
  import { personHandlers, personHooks } from "$lib/setup";
  import { Scope } from "@ybyra/core";
  import { allPermissions, personEvents, PersonSchema } from "@ybyra/demo";
  import { createComponent, DataForm, DataPage } from "@ybyra/sveltekit";

  const id = page.params.id;
  const person = PersonSchema.provide();
  const component = createComponent(Scope.view, scopes, goto, base);
</script>

<DataPage domain={person.domain} scope={Scope.view} permissions={allPermissions(person)}>
  <DataForm
    schema={person}
    scope={Scope.view}
    events={personEvents}
    handlers={personHandlers}
    hooks={personHooks}
    context={{ id }}
    {component}
    permissions={allPermissions(person)}
  />
</DataPage>
```

## Edit Page (DataForm with context)

```svelte
<!-- src/routes/person/[id]/edit/+page.svelte -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/state";
  import { scopes } from "$lib/routes/person";
  import { personHandlers, personHooks } from "$lib/setup";
  import { Scope } from "@ybyra/core";
  import { allPermissions, personEvents, PersonSchema } from "@ybyra/demo";
  import { createComponent, DataForm, DataPage } from "@ybyra/sveltekit";

  const id = page.params.id;
  const person = PersonSchema.provide();
  const component = createComponent(Scope.edit, scopes, goto, base);
</script>

<DataPage domain={person.domain} scope={Scope.edit} permissions={allPermissions(person)}>
  <DataForm
    schema={person}
    scope={Scope.edit}
    events={personEvents}
    handlers={personHandlers}
    hooks={personHooks}
    context={{ id }}
    {component}
    permissions={allPermissions(person)}
  />
</DataPage>
```

## Layout

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import "../app.css";
  import "@ybyra/sveltekit/styles.css";
  import "$lib/settings/icons";
  import "$lib/settings/i18n-setup";

  let { children } = $props();
</script>

<div style="max-width: 900px; margin: 0 auto; padding: 16px;">
  {@render children()}
</div>
```

```typescript
// src/routes/+layout.ts
export const ssr = false;
```

## Setup File

```typescript
// src/lib/setup.ts
import { createWebDriver } from "@ybyra/persistence/web";
import { createPersonService, createPersonHandlers, createPersonHooks } from "@ybyra/demo";

const driver = createWebDriver();
export const personService = createPersonService(driver);
export const personHandlers = createPersonHandlers(personService);
export const personHooks = createPersonHooks(personService);
```

## Key Differences from React/Vue

1. **`createComponent(scope, scopes, goto, base)`** — needs `goto` and `base` from SvelteKit
2. **File-based routing** — `/person/[id]/edit/+page.svelte` not `/person/edit/:id`
3. **`page.params.id`** — from `$app/state` (Svelte 5 runes)
4. **`{component}` shorthand** — Svelte shorthand for `component={component}`
5. **`$lib/` alias** — for `src/lib/` imports
6. **SSR disabled** — `export const ssr = false` in layout
7. **Icons use Svelte components** — e.g., `lucide-svelte` instead of string names
8. **Layout imports styles and settings** — `+layout.svelte` handles global setup
