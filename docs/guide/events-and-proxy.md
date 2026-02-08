# Events & Proxy

Events allow fields to react to user interactions. When a field changes, blurs, or receives focus, event handlers can mutate other fields' values and UI properties through a proxy system.

## Defining Events

Use `SchemaDefinition.events()` to define field event handlers:

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
  name: {
    focus({ schema }) {
      schema.name.state = 'active'
    },
  },
})
```

## Event Types

| Event | Trigger |
|-------|---------|
| `change` | Field value changes |
| `blur` | Field loses focus |
| `focus` | Field receives focus |

## Event Context

Each event handler receives a context object:

| Property | Type | Description |
|----------|------|-------------|
| `state` | `Record<string, unknown>` | Proxied form state — mutations are tracked |
| `schema` | `Record<string, FieldProxy>` | Proxied field overrides — mutations are tracked |

## State Proxy

The `state` proxy wraps the current form values. Any mutations you make are tracked and applied after the handler returns:

```typescript
change({ state }) {
  // Read current values
  const name = state.name

  // Mutate other fields
  state.fullName = `${state.firstName} ${state.lastName}`
  state.active = true
}
```

Under the hood, `createStateProxy()` creates a snapshot and tracks changes:

```typescript
const { proxy, getChanges } = createStateProxy(currentState)
// After handler runs:
const changes = getChanges() // only the mutated keys
```

## Schema Proxy

The `schema` proxy lets you dynamically override field UI properties:

```typescript
change({ state, schema }) {
  schema.birthDate.hidden = !state.active    // show/hide
  schema.email.disabled = true               // enable/disable
  schema.name.width = 100                    // change width
  schema.name.state = 'error'                // set visual state
}
```

### Available Proxy Properties

| Property | Type | Description |
|----------|------|-------------|
| `hidden` | `boolean` | Show or hide the field |
| `disabled` | `boolean` | Enable or disable the field |
| `width` | `number` | Override field width |
| `height` | `number` | Override field height |
| `state` | `string` | Set visual state (e.g., `'error'`, `'warning'`) |

## Using Events with useSchemaForm

Pass events to the hook:

```typescript
const form = useSchemaForm({
  schema: PersonSchema.provide(),
  scope: Scope.add,
  events: personEvents,
  // ...
})
```

The hook automatically wires up events to `onChange`, `onBlur`, and `onFocus` callbacks on each field.

## Best Practices

- Keep events in a separate file (`events.ts`) from the schema definition
- Use the state proxy for value mutations and the schema proxy for UI changes
- Avoid async operations in events — use [lifecycle hooks](/advanced/lifecycle-hooks) for async work
