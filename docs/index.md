---
layout: home

hero:
  name: Anhanga
  text: Schema-driven UI for management systems
  tagline: Define your domain once — get forms, tables, validation, i18n, and actions for React, Vue, and Svelte from a single source of truth.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/introduction
    - theme: alt
      text: View on GitHub
      link: https://github.com/devitools/anhanga

features:
  - title: Type-Safe
    details: Full TypeScript inference — InferRecord extracts typed records directly from your schema definition.
  - title: Scoped Visibility
    details: Fields and actions appear or hide based on scope (index, add, view, edit) with whitelist and blacklist support.
  - title: Reactive Events
    details: Field changes can mutate other fields, toggle visibility, and set visual states through a proxy system.
  - title: i18n-Native
    details: Labels are never hardcoded. The translate function resolves keys following the {domain}.{field} convention.
  - title: Framework-Agnostic Core
    details: "@anhanga/core has zero dependencies. Define schemas once, bring your own UI framework."
  - title: Table Support
    details: useDataTable provides pagination, sorting, filtering, selection, and row actions out of the box.
---

<div class="vp-doc" style="max-width: 800px; margin: 0 auto; padding: 0 24px;">

## Define Once, Render Everywhere

Anhanga uses a **builder-pattern API** — not plain objects or JSON Schema. Each field type exposes only the methods that apply to it, giving you full TypeScript inference and compile-time safety.

### 1. Configure a base schema

```typescript
import { configure, action, text, Scope, Position } from '@anhanga/core'

export const schema = configure({
  identity: 'id',
  display: 'name',
  fields: {
    id: text().excludeScopes(Scope.add).disabled(),
  },
  actions: {
    create: action().primary().positions(Position.footer).scopes(Scope.add),
    cancel: action().start().positions(Position.footer).scopes(Scope.add, Scope.edit),
  },
})
```

### 2. Create a domain schema

```typescript
import { text, Text, number, currency, toggle, group } from '@anhanga/core'

const ProductSchema = schema.create('product', {
  groups: {
    info: group(),
    pricing: group(),
  },
  fields: {
    name: text().width(60).required().minLength(3).column().group('info'),
    sku: text().width(40).required().column().group('info'),
    email: text().kind(Text.Email).width(50).group('info'),
    quantity: number().min(0).max(10000).width(30).column().group('pricing'),
    price: currency().min(0).precision(2).prefix('$').width(30).column().group('pricing'),
    active: toggle().default(true).column().group('info'),
  },
})
```

### 3. Use it in any framework

::: code-group

```tsx [React]
import { useDataForm } from '@anhanga/react'

const form = useDataForm({ schema: ProductSchema.provide(), scope: 'add' })
```

```vue [Vue]
<script setup>
import { useDataForm } from '@anhanga/vue'

const form = useDataForm({ schema: ProductSchema.provide(), scope: 'add' })
</script>
```

```svelte [Svelte]
<script>
import { useDataForm } from '@anhanga/svelte'

const form = useDataForm({ schema: ProductSchema.provide(), scope: 'add' })
</script>
```

:::

**No labels in code** — i18n resolves `product.name`, `product.price` automatically.
**No boilerplate** — validation, visibility, and layout derived from the schema.
**Full TypeScript inference** — `InferRecord<typeof ProductSchema>` gives you a typed record.

</div>
