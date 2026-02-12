---
applyTo: "**/routes/**/*.svelte"
---

# Ybyra SvelteKit Page Conventions

When editing SvelteKit pages for Ybyra:

## Page Pattern

```
<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { Scope } from "@ybyra/core";
  import { allPermissions, {Domain}Schema } from "@ybyra/demo";
  import { createComponent, DataForm, DataPage } from "@ybyra/sveltekit";

  const schema = {Domain}Schema.provide();
  const component = createComponent(scope, scopes, goto, base);
</script>

<DataPage domain={schema.domain} scope={scope} permissions={allPermissions(schema)}>
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

See `ai-friendly/frameworks/sveltekit.md` for complete guide.
