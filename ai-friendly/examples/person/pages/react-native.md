# Person Domain — React Native Screens

## Setup (demo.ts)

```ts-no-check
import { createLocalDriver } from "@ybyra/persistence";
import { createPersonService, createPersonHandlers, createPersonHooks } from "@/domain/person";

const driver = createLocalDriver();
export const personService = createPersonService(driver);
export const personHandlers = createPersonHandlers(personService);
export const personHooks = createPersonHooks(personService);
```

> Note: React Native uses `createLocalDriver()` (SQLite via expo-sqlite) instead of `createWebDriver()`.

## Key Differences from React Web

- Import from `@ybyra/react-native` instead of `@ybyra/react-web`
- Use `createLocalDriver()` from `@ybyra/persistence`
- Navigation uses expo-router instead of react-router-dom
- Same DataForm/DataTable/DataPage component pattern

The page structure and props are identical to React Web — only the imports and navigation system change.
