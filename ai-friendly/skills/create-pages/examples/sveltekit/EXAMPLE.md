# Person Domain — SvelteKit Routes

## List — src/routes/person/+page.svelte

```svelte-no-check
<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { Scope } from "@ybyra/core";
  import { allPermissions, PersonSchema } from "@/domain/person";
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
    pageSize={3}
  />
</DataPage>
```

## Add — src/routes/person/add/+page.svelte

```svelte-no-check
<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { scopes } from "$lib/routes/person";
  import { personHandlers, personHooks } from "$lib/setup";
  import { Scope } from "@ybyra/core";
  import { allPermissions, personEvents, PersonSchema } from "@/domain/person";
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

## View — src/routes/person/[id]/+page.svelte

```svelte-no-check
<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/state";
  import { scopes } from "$lib/routes/person";
  import { personHandlers, personHooks } from "$lib/setup";
  import { Scope } from "@ybyra/core";
  import { allPermissions, personEvents, PersonSchema } from "@/domain/person";
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

## Edit — src/routes/person/[id]/edit/+page.svelte

```svelte-no-check
<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/state";
  import { scopes } from "$lib/routes/person";
  import { personHandlers, personHooks } from "$lib/setup";
  import { Scope } from "@ybyra/core";
  import { allPermissions, personEvents, PersonSchema } from "@/domain/person";
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

## Routes — src/lib/routes/person.ts

```ts-no-check
import { Scope } from "@ybyra/core";

export const scopes = {
  [Scope.index]: { path: "/person" },
  [Scope.add]: { path: "/person/add" },
  [Scope.view]: { path: "/person/:id" },
  [Scope.edit]: { path: "/person/:id/edit" },
};
```
