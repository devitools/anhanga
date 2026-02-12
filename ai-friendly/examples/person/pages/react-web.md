# Person Domain — React Web Pages

## PersonList.tsx

```tsx-no-check
import { personHandlers, personHooks } from '@/demo'
import { scopes } from '@/pages/person/@routes'
import { Scope } from '@ybyra/core'
import { allPermissions, PersonSchema } from '@/domain/person'
import { DataPage, DataTable, useComponent } from '@ybyra/react-web'
import { useNavigate } from 'react-router-dom'

export function PersonList () {
  const navigate = useNavigate()
  const component = useComponent(Scope.index, scopes, navigate)
  const person = PersonSchema.provide()

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
        debug={true}
      />
    </DataPage>
  )
}
```

## PersonAdd.tsx

```tsx-no-check
import { personHandlers, personHooks } from "@/demo";
import { scopes } from "@/pages/person/@routes";
import { Scope } from "@ybyra/core";
import { allPermissions, personEvents, PersonSchema } from "@/domain/person";
import { DataForm, DataPage, useComponent } from "@ybyra/react-web";
import { useNavigate } from "react-router-dom";

export function PersonAdd () {
  const navigate = useNavigate();
  const component = useComponent(Scope.add, scopes, navigate);
  const person = PersonSchema.provide();

  return (
    <DataPage
      domain={person.domain}
      scope={Scope.add}
      permissions={allPermissions(person)}
    >
      <DataForm
        schema={person}
        scope={Scope.add}
        events={personEvents}
        handlers={personHandlers}
        hooks={personHooks}
        component={component}
        permissions={allPermissions(person)}
        debug={true}
      />
    </DataPage>
  );
}
```

## PersonView.tsx

```tsx-no-check
import { personHandlers, personHooks } from "@/demo";
import { scopes } from "@/pages/person/@routes";
import { Scope } from "@ybyra/core";
import { allPermissions, personEvents, PersonSchema } from "@/domain/person";
import { DataForm, DataPage, useComponent } from "@ybyra/react-web";
import { useNavigate, useParams } from "react-router-dom";

export function PersonView () {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const component = useComponent(Scope.view, scopes, navigate);
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
        debug={true}
      />
    </DataPage>
  );
}
```

## PersonEdit.tsx

```tsx-no-check
import { personHandlers, personHooks } from "@/demo";
import { scopes } from "@/pages/person/@routes";
import { Scope } from "@ybyra/core";
import { allPermissions, personEvents, PersonSchema } from "@/domain/person";
import { DataForm, DataPage, useComponent } from "@ybyra/react-web";
import { useNavigate, useParams } from "react-router-dom";

export function PersonEdit () {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const component = useComponent(Scope.edit, scopes, navigate);
  const person = PersonSchema.provide();

  return (
    <DataPage
      domain={person.domain}
      scope={Scope.edit}
      permissions={allPermissions(person)}
    >
      <DataForm
        schema={person}
        scope={Scope.edit}
        events={personEvents}
        handlers={personHandlers}
        hooks={personHooks}
        context={{ id }}
        component={component}
        permissions={allPermissions(person)}
        debug={true}
      />
    </DataPage>
  );
}
```

## @routes.ts

```ts
import { Scope, type ScopeRoute, type ScopeValue } from "@ybyra/core";

export const scopes: Record<ScopeValue, ScopeRoute> = {
  [Scope.index]: { path: "/person" },
  [Scope.add]: { path: "/person/add" },
  [Scope.view]: { path: "/person/view/:id" },
  [Scope.edit]: { path: "/person/edit/:id" },
};
```

## demo.ts (setup)

```ts
import { createWebDriver } from "@ybyra/persistence/web";
import { createPersonService, createPersonHandlers, createPersonHooks } from "@/domain/person";

const driver = createWebDriver();
export const personService = createPersonService(driver);
export const personHandlers = createPersonHandlers(personService);
export const personHooks = createPersonHooks(personService);
```

## App.tsx (router)

```tsx-no-check
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { withProviders } from "@ybyra/react-web";
import { PersonList } from "./pages/person/PersonList";
import { PersonAdd } from "./pages/person/PersonAdd";
import { PersonView } from "./pages/person/PersonView";
import { PersonEdit } from "./pages/person/PersonEdit";
import { Toaster } from "sonner";
import { theme } from "./settings/theme";

function App () {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route
          path="/"
          element={<Navigate
            to="/person"
            replace
          />}
        />
        <Route
          path="/person"
          element={<PersonList />}
        />
        <Route
          path="/person/add"
          element={<PersonAdd />}
        />
        <Route
          path="/person/view/:id"
          element={<PersonView />}
        />
        <Route
          path="/person/edit/:id"
          element={<PersonEdit />}
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default withProviders(App, { theme });
```
