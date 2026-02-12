# Person Domain — Schema & Events

## Schema Definition (`domain/person/schema.ts`)

```typescript
import { action, date, group, text, Text, toggle, Position, Scope } from "@ybyra/core";
import { schema } from "../../settings/schema";

export const PersonSchema = schema.create("person", {
  groups: {
    basic: group(),
    address: group(),
  },
  fields: {
    name: text().width(100).default("").required().column().filterable().group("basic"),
    email: text().kind(Text.Email).width(60).required().column().group("basic"),
    phone: text().kind(Text.Phone).width(40).group("basic"),
    birthDate: date().width(30).group("basic"),
    active: toggle().width(20).default(true).column().group("basic"),
    street: text().kind(Text.Street).width(60).group("address"),
    city: text().kind(Text.City).width(40).group("address"),
  },
  actions: {
    custom: action().order(-1).warning().positions(Position.footer).scopes(Scope.add),
    save: action().hidden(),
  },
});
```

## Events (`domain/person/events.ts`)

```typescript
import { PersonSchema } from "./schema";

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

## Handlers (`domain/person/handlers.ts`)

```typescript
import type { ServiceContract } from "@ybyra/core";
import { PersonSchema } from "./schema";
import { createDefault } from "../../settings/handlers";

export function createPersonHandlers(service: ServiceContract) {
  return PersonSchema.handlers({
    ...createDefault(service),
    custom({ state }) {
      (service as any).custom(state.name);
    },
  });
}
```

## Hooks (`domain/person/hooks.ts`)

```typescript
import type { ServiceContract } from "@ybyra/core";
import { PersonSchema } from "./schema";
import { createDefault } from "../../settings/hooks";

export function createPersonHooks(service: ServiceContract) {
  return PersonSchema.hooks(createDefault(service));
}
```

## Barrel Export (`domain/person/index.ts`)

```typescript
export { PersonSchema } from "./schema";
export { personEvents } from "./events";
export { createPersonHandlers } from "./handlers";
export { createPersonHooks } from "./hooks";
```
