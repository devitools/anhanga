# Person Domain — Service

## Service (`application/person/personService.ts`)

```ts-no-check
import { createService } from "@ybyra/core";
import type { PersistenceContract } from "@ybyra/core";
import { PersonSchema } from "@/domain/person";

export function createPersonService(driver: PersistenceContract) {
  return {
    ...createService(PersonSchema, driver),
    async custom(name: string) {
      console.log("[personService.custom]", name);
    },
  };
}
```

## Setup Wiring

### React Web / Vue / SvelteKit (`setup.ts`)
```ts-no-check
import { createWebDriver } from "@ybyra/persistence/web";
import { createPersonService } from "./application/person/personService";
import { createPersonHandlers, createPersonHooks } from "./domain/person";

const driver = createWebDriver();
export const personService = createPersonService(driver);
export const personHandlers = createPersonHandlers(personService);
export const personHooks = createPersonHooks(personService);
```

### React Native (`setup.ts`)
```ts-no-check
import { createLocalDriver } from "@ybyra/persistence";
import { createPersonService } from "./application/person/personService";
import { createPersonHandlers, createPersonHooks } from "./domain/person";

const driver = createLocalDriver();
export const personService = createPersonService(driver);
export const personHandlers = createPersonHandlers(personService);
export const personHooks = createPersonHooks(personService);
```
