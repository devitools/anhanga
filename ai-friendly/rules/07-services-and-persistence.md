# Services and Persistence

## ServiceContract

The `ServiceContract` interface defines standard CRUD operations:

```ts-no-check
interface ServiceContract<T = Record<string, unknown>> {
  paginate(params: PaginateParams): Promise<PaginatedResult<T>>;
  read(id: string): Promise<T>;
  create(data: T): Promise<T>;
  update(id: string, data: T): Promise<T>;
  destroy(id: string): Promise<void>;
}
```

## Creating a Service

Services are created using `createService()` from `@ybyra/core` combined with a persistence driver:

```ts-no-check
import { createService } from "@ybyra/core";
import type { PersistenceContract } from "@ybyra/core";
import { ProductSchema } from "@/domain/product";

export function createProductService(driver: PersistenceContract) {
  return {
    ...createService(ProductSchema, driver),
    // Add custom methods specific to this domain
    async export(format: "csv" | "pdf") {
      console.log("[productService.export]", format);
    },
  };
}
```

### Key Points:

1. **`createService()` generates standard CRUD** — paginate, read, create, update, destroy
2. **Spread `createService()` result** — then add custom methods
3. **Factory function pattern** — receives a `PersistenceContract` driver
4. **Schema is the first argument** — provides domain name and field definitions

## Persistence Drivers

`@ybyra/persistence` provides two built-in drivers:

### Local Driver (SQLite via expo-sqlite)

```ts-no-check
import { createLocalDriver } from "@ybyra/persistence";

const driver = createLocalDriver();
```

Used in React Native apps with Expo.

### Web Driver (localStorage)

```ts-no-check
import { createWebDriver } from "@ybyra/persistence/web";

const driver = createWebDriver();
```

Used in web apps (React Web, Vue, SvelteKit).

> Note the different import paths: `@ybyra/persistence` vs `@ybyra/persistence/web`.

## Wiring It Together

In the playground/app setup file:

```ts-no-check
// setup.ts or demo.ts
import { createWebDriver } from "@ybyra/persistence/web";
import { createProductService, createProductHandlers, createProductHooks } from "./domain/product";

const driver = createWebDriver();
export const productService = createProductService(driver);
export const productHandlers = createProductHandlers(productService);
export const productHooks = createProductHooks(productService);
```

## PaginateParams and PaginatedResult

```ts-no-check
interface PaginateParams {
  page: number;
  limit: number;
  sort?: { field: string; order: "asc" | "desc" };
  filter?: Record<string, unknown>;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
}
```

## Key Rules

1. **Service factory receives a driver** — `createProductService(driver)`
2. **Always use `createService()` as base** — provides standard CRUD operations
3. **Web apps use `createWebDriver()`** — import from `@ybyra/persistence/web`
4. **Mobile apps use `createLocalDriver()`** — import from `@ybyra/persistence`
5. **Custom methods are added via spread** — `{ ...createService(...), customMethod() {} }`
6. **Setup file wires the dependency chain** — driver → service → handlers/hooks
