# Conventions

## File Naming

| File               | Purpose                            | Naming                           |
|--------------------|------------------------------------|----------------------------------|
| `schema.ts`        | Field definitions, groups, actions | Always `schema.ts`               |
| `events.ts`        | Field event handlers               | Always `events.ts`               |
| `handlers.ts`      | Action handlers                    | Always `handlers.ts`             |
| `hooks.ts`         | Lifecycle hooks                    | Always `hooks.ts`                |
| `index.ts`         | Barrel exports                     | Always `index.ts`                |
| `{name}Service.ts` | Service factory                    | PascalCase domain + `Service.ts` |

## Directory Structure

```
src/
├── domain/{domainName}/     ← one folder per domain
│   ├── schema.ts
│   ├── events.ts
│   ├── handlers.ts
│   ├── hooks.ts
│   └── index.ts
├── application/{domainName}/
│   └── {domainName}Service.ts
└── settings/
    ├── schema.ts            ← configure() base
    ├── handlers.ts          ← createDefault() handlers
    └── hooks.ts             ← createDefault() hooks
```

## Naming Conventions

- **Schema constant**: `PascalCase` + `Schema` suffix → `PersonSchema`, `ProductSchema`
- **Events export**: `camelCase` + `Events` suffix → `personEvents`, `productEvents`
- **Handler factory**: `create` + `PascalCase` + `Handlers` → `createPersonHandlers`
- **Hook factory**: `create` + `PascalCase` + `Hooks` → `createPersonHooks`
- **Service factory**: `create` + `PascalCase` + `Service` → `createPersonService`
- **Domain name**: lowercase singular → `"person"`, `"product"`, `"order"`

## Import Patterns

### Field factory functions — always direct imports

```ts-no-check
// ✅ Correct
import { text, date, toggle, number, select } from "@ybyra/core";

// ❌ Wrong
import { field } from "@ybyra/core";
field.text(); // NOT supported
```

### Schema base — import from settings

```ts-no-check
import { schema } from "@/settings/schema";
// or from package if using demo
import { schema } from "@/settings/schema";
```

### Types — import from core

```ts-no-check
import { Scope, Position, Text, type ServiceContract, type HandlerContext } from "@ybyra/core";
```

## Code Patterns

### Factory pattern for handlers and hooks

Handlers and hooks are created via factory functions that receive the service:

```ts-no-check
// handlers.ts
export function createProductHandlers(service: ServiceContract) {
  return ProductSchema.handlers({
    ...createDefault(service),
    // custom handlers here
  });
}

// hooks.ts
export function createProductHooks(service: ServiceContract) {
  return ProductSchema.hooks(createDefault(service));
}
```

### Service factory pattern

Services are created via factory functions that receive a persistence driver:

```ts-no-check
export function createProductService(driver: PersistenceContract) {
  return {
    ...createService(ProductSchema, driver),
    // custom methods here
  };
}
```

### Barrel exports in index.ts

```ts-no-check
export { ProductSchema } from "@/domain/product/schema";
export { productEvents } from "./events";
export { createProductHandlers } from "./handlers";
export { createProductHooks } from "./hooks";
```

## Key Rules

1. **No labels in code** — all labels come from i18n
2. **Object literals for fields, groups, actions** — enables TypeScript inference and duplicate detection
3. **`null` removes** inherited entries (actions) — `save: null` removes the `save` action
4. **`.hidden()` hides** entries — `save: action().hidden()` keeps it but doesn't render it
5. **Separation of concerns** — never mix schema structure with event logic or handler implementation
6. **Factory functions** — handlers, hooks, and services are always created via factory functions that receive
   dependencies
7. **Base config in settings/** — shared defaults live in `settings/schema.ts`, `settings/handlers.ts`,
   `settings/hooks.ts`
8. **Domain-specific overrides** — each domain can override or extend defaults

## Playground Setup Pattern

Each playground has a setup file that wires dependencies:

```ts-no-check
// setup.ts or demo.ts
import { createWebDriver } from "@ybyra/persistence/web";
import { createProductService, createProductHandlers, createProductHooks } from "@/domain/product";

const driver = createWebDriver();
export const productService = createProductService(driver);
export const productHandlers = createProductHandlers(productService);
export const productHooks = createProductHooks(productService);
```
