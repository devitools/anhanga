# Handlers

## What are Handlers

Handlers define **what happens when an action is triggered** (button click). They are defined using `Schema.handlers()`.

## Default Handler Pattern

Most projects define a `createDefault()` factory in `settings/handlers.ts` that provides standard CRUD behavior:

```ts-no-check
import type { ServiceContract, HandlerContext } from "@ybyra/core";
import { Scope } from "@ybyra/core";

export function createDefault(service: ServiceContract) {
  return {
    add({ component }: HandlerContext) {
      component.navigator.push(component.scopes[Scope.add].path);
    },
    view({ state, component }: HandlerContext) {
      component.navigator.push(component.scopes[Scope.view].path, { id: state.id });
    },
    edit({ state, component }: HandlerContext) {
      component.navigator.push(component.scopes[Scope.edit].path, { id: state.id });
    },
    cancel({ component }: HandlerContext) {
      component.navigator.push(component.scopes[Scope.index].path);
    },
    create({ state, component, form }: HandlerContext) {
      if (!form?.validate()) {
        component.toast.error("common.actions.create.invalid");
        return;
      }
      service.create(state);
      component.toast.success("common.actions.create.success");
      component.navigator.push(component.scopes[Scope.index].path);
    },
    update({ state, component, form }: HandlerContext) {
      if (!form?.validate()) {
        component.toast.error("common.actions.update.invalid");
        return;
      }
      service.update(state?.id as string, state);
      component.toast.success("common.actions.update.success");
      component.navigator.push(component.scopes[Scope.index].path);
    },
    async destroy({ state, component, table }: HandlerContext) {
      const confirmed = await component.dialog.confirm("common.actions.destroy.confirm");
      if (!confirmed) return;
      await service.destroy(state?.id as string);
      component.toast.success("common.actions.destroy.success");
      if (component.scope !== Scope.index) {
        component.navigator.push(component.scopes[Scope.index].path);
        return;
      }
      table?.reload();
    },
  };
}
```

## Domain-Specific Handlers

Each domain extends the defaults with custom handlers:

```ts-no-check
import type { ServiceContract } from "@ybyra/core";
import { ProductSchema } from "@/domain/product/schema";
import { createDefault } from "@/settings/handlers";

export function createProductHandlers(service: ServiceContract) {
  return ProductSchema.handlers({
    ...createDefault(service),
    custom({ state }) {
      // custom action logic
      console.log("Custom action for:", state.name);
    },
  });
}
```

## Handler Context

Every handler receives a `HandlerContext`:

| Property | Type | Description |
|----------|------|-------------|
| `state` | `Record` | Current form/row state values |
| `component` | `ComponentContract` | Navigator, dialog, toast, loading, scope |
| `form` | `FormContract \| undefined` | Form API (validate, reset) — only in form scopes |
| `table` | `TableContract \| undefined` | Table API (reload) — only in index scope |

### ComponentContract

```ts-no-check
component.navigator.push(path, params?)   // navigate to route
component.dialog.confirm(messageKey)       // show confirmation dialog (returns Promise<boolean>)
component.toast.success(messageKey)        // show success toast
component.toast.error(messageKey)          // show error toast
component.loading.show()                   // show loading indicator
component.loading.hide()                   // hide loading indicator
component.scope                            // current scope (Scope.add, Scope.edit, etc.)
component.scopes                           // scope routes map
```

## Key Rules

1. **Handlers are created via factory functions** — `createProductHandlers(service)`
2. **Always spread `createDefault(service)`** — then override or add custom handlers
3. **Use `Schema.handlers()`** — ensures type safety
4. **Handler names match action names** — `create` handler handles the `create` action
5. **Navigation uses `component.navigator.push()`** — with scope routes from `component.scopes`
6. **Validation uses `form?.validate()`** — returns boolean, shows field errors
7. **Toast messages use i18n keys** — `"common.actions.create.success"`
8. **Destroy always confirms** — use `component.dialog.confirm()`
9. **Table reload after destroy in index** — use `table?.reload()`
