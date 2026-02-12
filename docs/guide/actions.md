# Actions

Actions represent operations that users can trigger — create, update, delete, or custom domain-specific actions.

## Defining Actions

```typescript
import { action, Position, Scope, Icon } from '@ybyra/core'

const PersonSchema = schema.create('person', {
  fields: { /* ... */ },
  actions: {
    create: action().primary().order(999).positions(Position.footer).scopes(Scope.add),
    cancel: action().start().order(1).positions(Position.footer).scopes(Scope.add, Scope.edit),
    destroy: action().destructive().positions(Position.footer, Position.row).excludeScopes(Scope.add),
    custom: action().icon(Icon.Send).warning().positions(Position.footer).scopes(Scope.add),
  },
})
```

## Variants

Actions have visual variants that determine their appearance:

| Method | Description |
|--------|-------------|
| `.primary()` | Primary action (submit, save) |
| `.secondary()` | Secondary action |
| `.destructive()` | Destructive action (delete) |
| `.warning()` | Warning action |
| `.success()` | Success variant |
| `.info()` | Informational variant |
| `.muted()` | Muted/subtle variant |
| `.accent()` | Accent variant |

## Positioning

Control where actions appear with `.positions()`:

```typescript
action().positions(Position.top)       // top of the page (e.g., "Add" button)
action().positions(Position.footer)    // form footer
action().positions(Position.floating)  // floating action button
action().positions(Position.row)       // table row action
action().positions(Position.footer, Position.row)  // multiple positions
```

| Position | Description |
|----------|-------------|
| `Position.top` | Page/section header |
| `Position.footer` | Form footer |
| `Position.floating` | Floating button |
| `Position.row` | Table row action |

## Alignment

By default, actions align to the end. Use `.start()` to align left:

```typescript
action().start()   // align to start
action().end()     // align to end (default)
```

## Ordering

Control the display order of actions:

```typescript
action().order(1)     // lower numbers appear first
action().order(999)   // higher numbers appear later
action().order(-1)    // negative numbers appear before 0
```

## Icons

Attach an icon to an action:

```typescript
import { Icon } from '@ybyra/core'

action().icon(Icon.Save)
action().icon(Icon.Trash)
action().icon(Icon.Send)
```

## Scoping

Control which scopes display an action:

```typescript
action().scopes(Scope.add)                       // only in add scope
action().scopes(Scope.add, Scope.edit)            // add and edit
action().excludeScopes(Scope.add, Scope.view)     // everywhere except add and view
```

See [Scopes](/guide/scopes) for details.

## Hiding Actions

Use `.hidden()` to keep an action in the configuration but hide it from the UI:

```typescript
action().hidden()  // hidden but still inheritable
```

## Removing Inherited Actions

Set an action to `null` to remove it from the inherited base schema:

```typescript
const PersonSchema = schema.create('person', {
  actions: {
    destroy: null,  // removes the inherited destroy action
  },
})
```

## Action Handlers

Handlers define what happens when an action is triggered:

```typescript
const personHandlers = PersonSchema.handlers({
  create({ state, component, form }) {
    if (!form?.validate()) return
    service.create(state)
    component.toast.success('common.actions.create.success')
    component.navigator.push(component.scopes[Scope.index].path)
  },
  cancel({ component }) {
    component.navigator.back()
  },
  destroy({ state, component }) {
    service.destroy(state.id)
    component.toast.success('common.actions.destroy.success')
    component.navigator.push(component.scopes[Scope.index].path)
  },
})
```

The handler context provides:

| Property | Type | Description |
|----------|------|-------------|
| `state` | `Record<string, unknown>` | Current form state |
| `component` | `ComponentContract` | Navigator, toast, dialog, loading |
| `form` | `FormContract` | Validate, reset, errors, dirty |
| `table` | `TableContract` | Table state (when in index scope) |
