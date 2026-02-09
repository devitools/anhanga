# Quick Start

> **What you will build** — a complete schema-driven form in 5 steps. Here's the end result:

```typescript
import { text, number, toggle } from '@anhanga/core'

// schema definition
const TaskSchema = schema.create('task', {
  fields: {
    title: text().required().minLength(3).column(),
    priority: number().min(1).max(5).default(3).column(),
    done: toggle().default(false).column(),
  },
})

// reactive events
const taskEvents = TaskSchema.events({
  done: {
    change({ state, schema }) {
      schema.priority.disabled = state.done
    },
  },
})

// action handler
const taskHandlers = TaskSchema.handlers({
  create({ state, form, component }) {
    if (!form?.validate()) return
    service.create(state)
    component.toast.success('Task created!')
  },
})
```

This guide walks you through the 5 steps to set up a schema-driven form.

## 1. Configure a Base Schema

Create a shared configuration with identity, default actions, and common fields:

```typescript
// settings/schema.ts
import { configure, action, text, Scope, Position } from '@anhanga/core'

export const schema = configure({
  identity: 'id',
  display: 'name',
  scopes: [Scope.index, Scope.add, Scope.view, Scope.edit],
  fields: {
    id: text().excludeScopes(Scope.add).order(0).disabled(),
  },
  actions: {
    add: action().primary().positions(Position.top).scopes(Scope.index),
    create: action().primary().order(999).positions(Position.footer).scopes(Scope.add),
    update: action().primary().order(999).positions(Position.footer).scopes(Scope.edit),
    cancel: action()
      .start()
      .order(1)
      .positions(Position.footer)
      .scopes(Scope.view, Scope.add, Scope.edit),
    destroy: action()
      .start()
      .order(2)
      .positions(Position.footer, Position.row)
      .destructive()
      .excludeScopes(Scope.add, Scope.view),
  },
})
```

The `configure()` function returns a `SchemaFactory`. Every domain schema created from it inherits these base fields and actions.

## 2. Define Your Domain Schema

```typescript
// domain/person/schema.ts
import { text, Text, date, toggle, group } from '@anhanga/core'
import { schema } from '../../settings/schema'

export const PersonSchema = schema.create('person', {
  groups: {
    basic: group(),
    address: group(),
  },
  fields: {
    name: text().width(100).required().column().filterable().group('basic'),
    email: text().kind(Text.Email).width(60).required().column().group('basic'),
    phone: text().kind(Text.Phone).width(40).group('basic'),
    birthDate: date().width(30).group('basic'),
    active: toggle().width(20).default(true).column().group('basic'),
    street: text().kind(Text.Street).width(60).group('address'),
    city: text().kind(Text.City).width(40).group('address'),
  },
})
```

## 3. Add Reactive Events

Events let field changes trigger side effects — hide/show fields, modify values, set visual states:

```typescript
// domain/person/events.ts
import { PersonSchema } from './schema'

export const personEvents = PersonSchema.events({
  active: {
    change({ state, schema }) {
      schema.birthDate.hidden = !state.active
      schema.street.disabled = !state.active
      schema.city.disabled = !state.active
    },
  },
  email: {
    blur({ state, schema }) {
      if (!state.email.includes('@')) {
        schema.email.state = 'error'
      }
    },
  },
})
```

## 4. Define Action Handlers

```typescript
// domain/person/handlers.ts
import { PersonSchema } from './schema'

export const personHandlers = PersonSchema.handlers({
  create({ state, component, form }) {
    if (!form?.validate()) return
    service.create(state)
    component.toast.success('Created!')
    component.navigator.push(component.scopes[Scope.index].path)
  },
  cancel({ component }) {
    component.navigator.back()
  },
})
```

## 5. Render the Form

::: code-group

```tsx [React]
import { useDataForm, getRenderer } from '@anhanga/react'

function PersonForm({ scope }) {
  const form = useDataForm({
    schema: PersonSchema.provide(),
    scope,
    events: personEvents,
    handlers: personHandlers,
    component: componentContract,
    translate: t,
  })

  return (
    <form>
      {form.fields.map((field) => {
        const props = form.getFieldProps(field.name)
        const Renderer = getRenderer(field.config.component)
        return <Renderer key={field.name} {...props} />
      })}

      {form.actions.map((action) => (
        <button key={action.name} onClick={action.execute}>
          {action.label}
        </button>
      ))}
    </form>
  )
}
```

```vue [Vue]
<script setup lang="ts">
import { useDataForm, getRenderer } from '@anhanga/vue'
import { Scope } from '@anhanga/core'

const props = defineProps<{ scope: string }>()

const form = useDataForm({
  schema: PersonSchema.provide(),
  scope: props.scope,
  events: personEvents,
  handlers: personHandlers,
  component: componentContract,
  translate: t,
})
</script>

<template>
  <form>
    <template v-for="field in form.fields" :key="field.name">
      <component
        :is="getRenderer(field.config.component)"
        v-bind="form.getFieldProps(field.name)"
      />
    </template>

    <button
      v-for="action in form.actions"
      :key="action.name"
      @click="action.execute"
    >
      {{ action.label }}
    </button>
  </form>
</template>
```

:::

## Next Steps

- [Schema Definition](/guide/schema-definition) — learn about `configure()`, `extend()`, `pick()`, `omit()`
- [Field Types](/guide/field-types) — all field types and their methods
- [Events & Proxy](/guide/events-and-proxy) — reactive field events in depth
- [useDataForm (React)](/react/use-data-form) — full React hook API reference
- [useDataForm (Vue)](/vue/use-data-form) — full Vue composable API reference
- useDataForm (Svelte) — Svelte store API reference _(coming soon)_
