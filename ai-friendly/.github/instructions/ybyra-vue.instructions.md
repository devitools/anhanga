---
applyTo: "**/{pages,presentation}/**/*.vue"
---

# Ybyra Vue/Quasar Page Conventions

When editing Vue pages for Ybyra:

## Page Pattern

```
<template>
  <DataPage :domain="domain" :scope="scope" :permissions="permissions">
    <DataForm :schema="schema" :scope="scope" ... />
  </DataPage>
</template>

<script setup lang="ts">
import { Scope } from "@ybyra/core";
import { allPermissions, {Domain}Schema } from "@ybyra/demo";
import { DataForm, DataPage, useComponent } from "@ybyra/vue-quasar";

const schema = {Domain}Schema.provide();
const component = useComponent(scope, scopes);
</script>
```

## Key Rules

- Use `<script setup lang="ts">` composition API
- List pages use `DataTable`, form pages use `DataForm`
- View/Edit pages use `useRoute().params.id` for context
- Routes file at `@routes.ts`

## Reference

See `ai-friendly/frameworks/vue-quasar.md` for complete guide.
