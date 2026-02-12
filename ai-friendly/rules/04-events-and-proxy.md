# Events and Proxy

## Field Events

Events are reactive handlers that fire when fields change, blur, or focus. They are defined using `Schema.events()`:

```ts-no-check
import { PersonSchema } from "@/domain/person/schema";

export const personEvents = PersonSchema.events({
  active: {
    change({ state, schema }) {
      state.name = String(state.name).split("").reverse().join("");
      schema.name.state = "new";
      schema.name.width = 100;
      schema.birthDate.hidden = !state.active;
      schema.street.disabled = !state.active;
      schema.city.disabled = !state.active;
    },
  },
  email: {
    blur({ state, schema }) {
      if (!state.email.includes("@")) {
        schema.email.state = "error";
      }
    },
  },
});
```

## Event Types

| Event | When it fires |
|-------|--------------|
| `change` | When the field value changes |
| `blur` | When the field loses focus |
| `focus` | When the field gains focus |

## Event Context

Every event handler receives an `EventContext` with two proxied objects:

```ts-no-check
({ state, schema }) => {
  // state  — proxied record of all field values
  // schema — proxied record of all field property overrides
}
```

### State Proxy

The `state` object lets you **read and mutate** field values:

```ts-no-check
change({ state }) {
  // Read values
  const name = state.name;
  const isActive = state.active;

  // Mutate values (triggers re-render)
  state.name = name.toUpperCase();
  state.email = "";
}
```

### Schema Proxy

The `schema` object lets you **dynamically override** field properties:

```ts-no-check
change({ state, schema }) {
  // Hide/show fields
  schema.birthDate.hidden = !state.active;

  // Enable/disable fields
  schema.street.disabled = !state.active;

  // Change width
  schema.name.width = 100;

  // Change height
  schema.description.height = 200;

  // Set visual state
  schema.email.state = "error";      // visual state indicator
  schema.name.state = "new";         // custom state
}
```

### Available Schema Proxy Properties

| Property | Type | Description |
|----------|------|-------------|
| `hidden` | `boolean` | Show/hide the field |
| `disabled` | `boolean` | Enable/disable the field |
| `width` | `number` | Override width percentage |
| `height` | `number` | Override height in pixels |
| `state` | `string` | Set visual state (e.g., "error", "new") |

## Common Patterns

### Conditional visibility
```ts-no-check
active: {
  change({ state, schema }) {
    schema.expirationDate.hidden = !state.active;
    schema.discount.hidden = !state.active;
  },
}
```

### Field validation on blur
```ts-no-check
email: {
  blur({ state, schema }) {
    if (!state.email.includes("@")) {
      schema.email.state = "error";
    } else {
      schema.email.state = "";
    }
  },
}
```

### Dependent field updates
```ts-no-check
category: {
  change({ state, schema }) {
    // Show price fields only for physical products
    const isPhysical = state.category === "physical";
    schema.weight.hidden = !isPhysical;
    schema.dimensions.hidden = !isPhysical;
  },
}
```

### Computed values
```ts-no-check
quantity: {
  change({ state }) {
    state.total = (state.price || 0) * (state.quantity || 0);
  },
},
price: {
  change({ state }) {
    state.total = (state.price || 0) * (state.quantity || 0);
  },
}
```

## Key Rules

1. **Events file is separate from schema** — never define events inside the schema
2. **Export as `const`** — `export const personEvents = PersonSchema.events({...})`
3. **Use `Schema.events()`** — this ensures type safety for field names and context
4. **Mutations are tracked** — all changes to `state` and `schema` are captured by proxies
5. **Events are optional** — a domain can have no events if no reactive behavior is needed
