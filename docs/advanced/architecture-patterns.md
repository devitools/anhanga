# Architecture Patterns

Recommended project layout and patterns for Ybyra-based applications.

## Recommended File Layout

The domain and application layers are framework-agnostic — they can be shared between React, Vue, and Svelte apps. Only the presentation layer is framework-specific.

### Shared (framework-agnostic)

```
settings/
  schema.ts            ← configure() base schema
  handlers.ts          ← default action handlers
  hooks.ts             ← default lifecycle hooks
  i18n.ts              ← setupI18n() and translations

src/domain/{name}/
  schema.ts            ← schema.create() with fields, groups, actions
  events.ts            ← field event handlers (change, blur, focus)
  handlers.ts          ← action handlers (create, update, destroy, ...)
  hooks.ts             ← bootstrap & fetch hooks

src/application/{name}/
  service.ts           ← ServiceContract implementation
```

### React presentation

```
src/presentation/
  components/
    renderers/         ← field renderer components (.tsx)
    DataForm.tsx     ← form component using useDataForm
    DataTable.tsx    ← table component using useDataTable
  contracts/
    component.ts       ← ComponentContract (react-router-dom)
```

### Vue presentation

```
src/presentation/
  components/
    renderers/         ← field renderer components (.vue)
    DataForm.vue     ← form component using useDataForm
    DataTable.vue    ← table component using useDataTable
  contracts/
    component.ts       ← ComponentContract (vue-router)
```

### Svelte presentation

```
src/presentation/
  components/
    renderers/         ← field renderer components (.svelte)
    DataForm.svelte  ← form component using useDataForm
    DataTable.svelte ← table component using useDataTable
  contracts/
    component.ts       ← ComponentContract (SvelteKit goto)
```

See the `playground/vue-quasar` directory for a complete Vue + Quasar example.

## Separation of Concerns

Each file has a single responsibility:

| File | Responsibility |
|------|---------------|
| `schema.ts` | Structure — fields, groups, actions |
| `events.ts` | Reactivity — field change/blur/focus handlers |
| `handlers.ts` | Behavior — what happens when actions fire |
| `hooks.ts` | Lifecycle — data loading and initialization |
| `service.ts` | Data — CRUD operations |

This separation makes each concern independently testable and replaceable.

## Base Schema Pattern

Use `configure()` to define shared defaults. Every domain schema inherits from it:

```typescript
// settings/schema.ts
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
    cancel: action().start().order(1).positions(Position.footer).scopes(Scope.view, Scope.add, Scope.edit),
    destroy: action().destructive().start().order(2).positions(Position.footer, Position.row).excludeScopes(Scope.add, Scope.view),
  },
})
```

## Default Handlers Pattern

Create reusable default handlers that can be spread into domain handlers:

```typescript
// settings/handlers.ts
export function createDefault(service: ServiceContract) {
  return {
    create({ state, form, component }) {
      if (!form?.validate()) return
      service.create(state)
      component.toast.success('Created!')
      component.navigator.push(component.scopes[Scope.index].path)
    },
    update({ state, form, component }) {
      if (!form?.validate()) return
      service.update(state.id, state)
      component.toast.success('Updated!')
    },
    destroy({ state, component }) {
      service.destroy(state.id)
      component.toast.success('Deleted!')
      component.navigator.push(component.scopes[Scope.index].path)
    },
    cancel({ component }) {
      component.navigator.back()
    },
  }
}
```

Then spread into domain-specific handlers:

```typescript
// domain/person/handlers.ts
export const personHandlers = PersonSchema.handlers({
  ...createDefault(personService),
  custom({ state }) {
    personService.custom(state.name)
  },
})
```

## ComponentContract Implementation

The `ComponentContract` bridges the schema system to your UI framework:

```typescript
// presentation/contracts/component.ts
export function createComponentContract(navigation, scope): ComponentContract {
  return {
    scope,
    scopes: {
      [Scope.index]: { path: '/persons' },
      [Scope.add]: { path: '/persons/add' },
      [Scope.view]: { path: '/persons/:id' },
      [Scope.edit]: { path: '/persons/:id/edit' },
    },
    reload: () => navigation.reload(),
    navigator: {
      push: (path, params) => navigation.navigate(path, params),
      back: () => navigation.goBack(),
      replace: (path, params) => navigation.replace(path, params),
    },
    dialog: {
      confirm: (msg) => window.confirm(msg),
      alert: (msg) => window.alert(msg),
    },
    toast: {
      success: (msg) => showToast('success', msg),
      error: (msg) => showToast('error', msg),
      warning: (msg) => showToast('warning', msg),
      info: (msg) => showToast('info', msg),
    },
    loading: {
      show: () => setLoading(true),
      hide: () => setLoading(false),
    },
  }
}
```

## Schema Composition

Use `extend()`, `pick()`, and `omit()` to compose schemas:

```typescript
// Base person schema
const PersonSchema = schema.create('person', { /* ... */ })

// Employee extends person with extra fields
const EmployeeSchema = PersonSchema.extend('employee', {
  fields: {
    department: text().required(),
    salary: currency().precision(2),
  },
})

// Subset for a specific form
const PersonNameSchema = PersonSchema.pick('name', 'email')
```

## Removing Inherited Actions

Use `null` to remove inherited actions from a domain schema:

```typescript
const ReadOnlySchema = schema.create('readonly', {
  fields: { /* ... */ },
  actions: {
    create: null,
    update: null,
    destroy: null,
  },
})
```
