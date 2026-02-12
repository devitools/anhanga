# React Native Framework

## Package Dependencies

```
@ybyra/core
@ybyra/react
@ybyra/react-native      ← UI components (DataForm, DataTable, renderers)
@ybyra/persistence       ← persistence driver (local SQLite)
expo-router                ← routing
```

## Screen Structure

```
src/
├── demo.ts                      ← dependency wiring
├── settings/
│   ├── i18n.ts                  ← i18n configuration
│   └── icons.ts                 ← icon configuration
└── pages/ or app/               ← screens (depends on expo-router config)
    └── {domain}/
        ├── index.tsx            ← DataTable (Scope.index)
        ├── add.tsx              ← DataForm (Scope.add)
        ├── view/[id].tsx        ← DataForm (Scope.view)
        └── edit/[id].tsx        ← DataForm (Scope.edit)
```

## Setup File

```typescript
// src/demo.ts
import { createLocalDriver } from "@ybyra/persistence";
import { createPersonService, createPersonHandlers, createPersonHooks } from "@ybyra/demo";

const driver = createLocalDriver();
export const personService = createPersonService(driver);
export const personHandlers = createPersonHandlers(personService);
export const personHooks = createPersonHooks(personService);
```

> Note: React Native uses `createLocalDriver()` from `@ybyra/persistence` (SQLite via expo-sqlite), not `createWebDriver()`.

## Key Differences from React Web

1. **`createLocalDriver()`** — SQLite driver instead of web driver
2. **expo-router** — file-based routing instead of react-router-dom
3. **Native components** — React Native UI components (TextInput, Switch, etc.)
4. **Navigation** — uses expo-router's `router.push()` instead of `navigate()`
5. **Layout** — follows Expo's layout conventions
6. **Import from `@ybyra/react-native`** — instead of `@ybyra/react-web`

## Component Pattern

The overall pattern is the same as React Web — DataPage wraps DataTable or DataForm with the same props:

```typescript
import { DataForm, DataPage, useComponent } from "@ybyra/react-native";
// ... same pattern as React Web
```

The main differences are in:
- The persistence driver (local vs web)
- The navigation system (expo-router vs react-router-dom)
- The import package (`@ybyra/react-native` vs `@ybyra/react-web`)
