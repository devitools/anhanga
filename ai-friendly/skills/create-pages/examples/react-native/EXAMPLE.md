# Person Domain — React Native Screens

## Key Differences from React Web

- Import from `@ybyra/react-native` instead of `@ybyra/react-web`
- Use `createLocalDriver()` from `@ybyra/persistence` (SQLite via expo-sqlite)
- Navigation uses `useRouter()` / `useLocalSearchParams()` from `expo-router`
- Same `DataForm` / `DataTable` / `DataPage` component pattern

The page structure and props are identical to React Web — only the imports and navigation system change.

## Setup (demo.ts)

```ts-no-check
import { createLocalDriver } from "@ybyra/persistence";
import { createPersonService, createPersonHandlers, createPersonHooks } from "@/domain/person";

const driver = createLocalDriver();
export const personService = createPersonService(driver);
export const personHandlers = createPersonHandlers(personService);
export const personHooks = createPersonHooks(personService);
```

## PersonList (screen)

```tsx-no-check
import { personHandlers, personHooks } from "@/demo";
import { scopes } from "@/routes/person/@routes";
import { Scope } from "@ybyra/core";
import { allPermissions, PersonSchema } from "@/domain/person";
import { DataPage, DataTable, useComponent } from "@ybyra/react-native";
import { useRouter } from "expo-router";

export default function PersonList () {
  const router = useRouter();
  const component = useComponent(Scope.index, scopes, router);
  const person = PersonSchema.provide();

  return (
    <DataPage
      domain={person.domain}
      scope={Scope.index}
      permissions={allPermissions(person)}
    >
      <DataTable
        schema={person}
        scope={Scope.index}
        handlers={personHandlers}
        hooks={personHooks}
        component={component}
        permissions={allPermissions(person)}
        pageSize={3}
      />
    </DataPage>
  );
}
```

## PersonView (screen with params)

```tsx-no-check
import { personHandlers, personHooks } from "@/demo";
import { scopes } from "@/routes/person/@routes";
import { Scope } from "@ybyra/core";
import { allPermissions, personEvents, PersonSchema } from "@/domain/person";
import { DataForm, DataPage, useComponent } from "@ybyra/react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function PersonView () {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const component = useComponent(Scope.view, scopes, router);
  const person = PersonSchema.provide();

  return (
    <DataPage
      domain={person.domain}
      scope={Scope.view}
      permissions={allPermissions(person)}
    >
      <DataForm
        schema={person}
        scope={Scope.view}
        events={personEvents}
        handlers={personHandlers}
        hooks={personHooks}
        context={{ id }}
        component={component}
        permissions={allPermissions(person)}
      />
    </DataPage>
  );
}
```
