---
applyTo: "**/routes/**/*.svelte"
---

# Ybyra SvelteKit Page Conventions

When editing SvelteKit pages for Ybyra:

## Page Pattern

```svelte-no-check
<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { Scope } from "@ybyra/core";
  import { permissions } from "@src/auth";
  import { ExampleSchema } from "@/domain/example";
  import { createComponent, DataForm, DataPage } from "@ybyra/sveltekit";

  const schema = ExampleSchema.provide();
  const component = createComponent(scope, scopes, goto, base);
</script>

<DataPage domain={schema.domain} scope={scope} permissions={permissions}>
  <DataForm schema={schema} scope={scope} ... />
</DataPage>
```

## Key Rules

- File-based routing: `[id]` for params, nested `edit/` for edit scope
- Use `createComponent(scope, scopes, goto, base)` — not `useComponent`
- View/Edit use `page.params.id` from `$app/state`
- Routes at `src/lib/routes/{domain}.ts`
- Route pattern differs: `/{domain}/:id/edit` (not `/{domain}/edit/:id`)

## Reference

See the [SvelteKit guide](https://devitools.github.io/ybyra/svelte/overview) for complete documentation.
