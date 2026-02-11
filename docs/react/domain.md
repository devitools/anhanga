# Domain Layer

::: tip Framework-Agnostic
This entire page is **framework-agnostic**. The domain layer code shown here works identically in React Web, React Native, Vue, and Svelte. Only the presentation layer (screens, renderers) differs between frameworks.
:::

The domain layer contains your schema definition, reactive events, action handlers, and lifecycle hooks. This layer is **framework-agnostic** — the same code works in React Web, React Native, Vue, or Svelte.

## Base Schema Configuration

Create a shared configuration that all domains inherit:

```typescript
// src/settings/schema.ts
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
    view: action().positions(Position.row).scopes(Scope.index),
    edit: action().positions(Position.row).scopes(Scope.index),
    create: action().primary().order(999).positions(Position.footer).scopes(Scope.add),
    update: action().primary().order(999).positions(Position.footer).scopes(Scope.edit),
    cancel: action().start().order(1).positions(Position.footer)
      .scopes(Scope.view, Scope.add, Scope.edit),
    destroy: action().start().order(2).positions(Position.footer, Position.row)
      .destructive().excludeScopes(Scope.add, Scope.view),
  },
})
```

Every domain created from this `schema` inherits the `id` field and all CRUD actions automatically.

## Domain Schema

```typescript
// src/domain/product/schema.ts
import { text, Text, number, currency, toggle, group } from '@anhanga/core'
import { schema } from '../../settings/schema'

export const ProductSchema = schema.create('product', {
  groups: {
    info: group(),
    pricing: group(),
  },
  fields: {
    name: text().width(100).required().minLength(3).column().filterable().group('info'),
    sku: text().width(40).required().column().group('info'),
    email: text().kind(Text.Email).width(60).group('info'),
    active: toggle().width(20).default(true).column().group('info'),
    quantity: number().min(0).max(10000).width(30).column().group('pricing'),
    price: currency().min(0).precision(2).prefix('$').width(30).column().group('pricing'),
  },
})
```

## Events

Events react to field changes — toggle visibility, disable fields, set visual states:

```typescript
// src/domain/product/events.ts
import { ProductSchema } from './schema'

export const productEvents = ProductSchema.events({
  active: {
    change({ state, schema }) {
      schema.price.disabled = !state.active
      schema.quantity.disabled = !state.active
    },
  },
  email: {
    blur({ state, schema }) {
      if (state.email && !state.email.includes('@')) {
        schema.email.state = 'error'
      }
    },
  },
})
```

## Handlers

Handlers define what happens when the user clicks an action:

```typescript
// src/domain/product/handlers.ts
import type { ServiceContract, HandlerContext } from '@anhanga/core'
import { Scope } from '@anhanga/core'
import { ProductSchema } from './schema'

export function createProductHandlers(service: ServiceContract) {
  return ProductSchema.handlers({
    add({ component }: HandlerContext) {
      component.navigator.push(component.scopes[Scope.add].path)
    },
    view({ state, component }: HandlerContext) {
      component.navigator.push(component.scopes[Scope.view].path, { id: state.id })
    },
    edit({ state, component }: HandlerContext) {
      component.navigator.push(component.scopes[Scope.edit].path, { id: state.id })
    },
    cancel({ component }: HandlerContext) {
      component.navigator.push(component.scopes[Scope.index].path)
    },
    create({ state, component, form }: HandlerContext) {
      if (!form?.validate()) {
        component.toast.error('common.actions.create.invalid')
        return
      }
      service.create(state)
      component.toast.success('common.actions.create.success')
      component.navigator.push(component.scopes[Scope.index].path)
    },
    update({ state, component, form }: HandlerContext) {
      if (!form?.validate()) {
        component.toast.error('common.actions.update.invalid')
        return
      }
      service.update(state?.id as string, state)
      component.toast.success('common.actions.update.success')
      component.navigator.push(component.scopes[Scope.index].path)
    },
    async destroy({ state, component, table }: HandlerContext) {
      const confirmed = await component.dialog.confirm('common.actions.destroy.confirm')
      if (!confirmed) return
      await service.destroy(state?.id as string)
      component.toast.success('common.actions.destroy.success')
      if (component.scope !== Scope.index) {
        component.navigator.push(component.scopes[Scope.index].path)
        return
      }
      table?.reload()
    },
  })
}
```

## Hooks

Hooks define lifecycle behavior per scope — loading data on mount and fetching paginated lists:

```typescript
// src/domain/product/hooks.ts
import type { ServiceContract, BootstrapHookContext, FetchHookContext } from '@anhanga/core'
import { Scope } from '@anhanga/core'
import { ProductSchema } from './schema'

export function createProductHooks(service: ServiceContract) {
  return ProductSchema.hooks({
    bootstrap: {
      async [Scope.view]({ context, schema, hydrate }: BootstrapHookContext) {
        if (!context.id) return
        const data = await service.read(context.id as string)
        hydrate(data)
        for (const field of Object.values(schema)) {
          field.disabled = true
        }
      },
      async [Scope.edit]({ context, hydrate }: BootstrapHookContext) {
        if (!context.id) return
        const data = await service.read(context.id as string)
        hydrate(data)
      },
    },
    fetch: {
      async [Scope.index]({ params }: FetchHookContext) {
        return service.paginate(params)
      },
    },
  })
}
```

Key points:

- **`bootstrap`** runs when the screen mounts — load data by ID for view/edit
- **`fetch`** runs for table pagination — returns paginated results for the list
- In `Scope.view`, the hook disables all fields after hydrating to make them read-only

## Service

The service lives in the `application/` layer — it depends on the domain schema but handles persistence concerns:

```typescript
// src/application/product/productService.ts
import { createService } from '@anhanga/core'
import type { PersistenceContract } from '@anhanga/core'
import { ProductSchema } from '../../domain/product/schema'

export function createProductService(driver: PersistenceContract) {
  return createService(ProductSchema, driver)
}
```

`createService` returns an object implementing `ServiceContract` — with `create`, `read`, `update`, `destroy`, and `paginate` methods. You can spread it and add custom methods specific to your domain.

## Wiring It Up

Create a setup file that connects the persistence driver to your domain:

```typescript
// src/setup.ts
import { createWebDriver } from '@anhanga/persistence/web'
import { createProductService } from './application/product/productService'
import { createProductHandlers } from './domain/product/handlers'
import { createProductHooks } from './domain/product/hooks'

const driver = createWebDriver()
export const productService = createProductService(driver)
export const productHandlers = createProductHandlers(productService)
export const productHooks = createProductHooks(productService)
```

## Next Steps

- [i18n](/react/i18n) — add field labels and group titles for your schema
