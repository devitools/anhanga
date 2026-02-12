---
applyTo: "**/{pages,presentation}/**/*.vue"
---

# Ybyra Vue/Quasar Page Conventions

When editing Vue pages for Ybyra:

## Page Pattern

```vue-no-check
<template>
  <DataPage :domain="domain" :scope="scope" :permissions="permissions">
    <DataForm :schema="schema" :scope="scope" ... />
  </DataPage>
</template>

<script setup lang="ts">
import { Scope } from "@ybyra/core";
import { permissions } from "@src/auth";
import { ExampleSchema } from "@/domain/example";
import { DataForm, DataPage, useComponent } from "@ybyra/vue-quasar";

const schema = ExampleSchema.provide();
const component = useComponent(scope, scopes);
</script>
```

## Key Rules

- Use `<script setup lang="ts">` composition API
- List pages use `DataTable`, form pages use `DataForm`
- View/Edit pages use `useRoute().params.id` for context
- Routes file at `@routes.ts`

## Reference

See the [Vue + Quasar guide](https://devitools.github.io/ybyra/vue/overview) for complete documentation.
