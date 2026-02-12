# React Web Framework

## Package Dependencies

```
@ybyra/core
@ybyra/react
@ybyra/react-web        ← UI components (DataForm, DataTable, DataPage)
@ybyra/persistence      ← persistence driver
react-router-dom          ← routing
```

## Page Structure

Each domain has 4 pages + a routes file:

```
src/pages/{domain}/
├── @routes.ts           ← scope-to-route mapping
├── {Domain}List.tsx     ← DataTable (Scope.index)
├── {Domain}Add.tsx      ← DataForm (Scope.add)
├── {Domain}View.tsx     ← DataForm (Scope.view)
└── {Domain}Edit.tsx     ← DataForm (Scope.edit)
```

## Routes File

```typescript
// src/pages/person/@routes.ts
import { Scope, type ScopeRoute, type ScopeValue } from "@ybyra/core";

export const scopes: Record<ScopeValue, ScopeRoute> = {
  [Scope.index]: { path: "/person" },
  [Scope.add]: { path: "/person/add" },
  [Scope.view]: { path: "/person/view/:id" },
  [Scope.edit]: { path: "/person/edit/:id" },
};
```

## List Page (DataTable)

```typescript
import { personHandlers, personHooks } from "@/demo";
import { scopes } from "@/pages/person/@routes";
import { Scope } from "@ybyra/core";
import { allPermissions, PersonSchema } from "@ybyra/demo";
import { DataTable, DataPage, useComponent } from "@ybyra/react-web";
import { useNavigate } from "react-router-dom";

export function PersonList() {
  const navigate = useNavigate();
  const component = useComponent(Scope.index, scopes, navigate);
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
        pageSize={10}
      />
    </DataPage>
  );
}
```

## Add Page (DataForm)

```typescript
import { personHandlers, personHooks } from "@/demo";
import { scopes } from "@/pages/person/@routes";
import { Scope } from "@ybyra/core";
import { allPermissions, personEvents, PersonSchema } from "@ybyra/demo";
import { DataForm, DataPage, useComponent } from "@ybyra/react-web";
import { useNavigate } from "react-router-dom";

export function PersonAdd() {
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
      />
    </DataPage>
  );
}
```

## View Page (DataForm with context)

```typescript
import { personHandlers, personHooks } from "@/demo";
import { scopes } from "@/pages/person/@routes";
import { Scope } from "@ybyra/core";
import { allPermissions, personEvents, PersonSchema } from "@ybyra/demo";
import { DataForm, DataPage, useComponent } from "@ybyra/react-web";
import { useNavigate, useParams } from "react-router-dom";

export function PersonView() {
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
      />
    </DataPage>
  );
}
```

## Edit Page (DataForm with context)

Same as View but with `Scope.edit`:

```typescript
export function PersonEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const component = useComponent(Scope.edit, scopes, navigate);
  const person = PersonSchema.provide();

  return (
    <DataPage domain={person.domain} scope={Scope.edit} permissions={allPermissions(person)}>
      <DataForm
        schema={person}
        scope={Scope.edit}
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

## App Router Setup

```typescript
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { withProviders } from "@ybyra/react-web";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Navigate to="/person" replace />} />
        <Route path="/person" element={<PersonList />} />
        <Route path="/person/add" element={<PersonAdd />} />
        <Route path="/person/view/:id" element={<PersonView />} />
        <Route path="/person/edit/:id" element={<PersonEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default withProviders(App, { theme });
```

## Setup File

```typescript
// src/demo.ts
import { createWebDriver } from "@ybyra/persistence/web";
import { createPersonService, createPersonHandlers, createPersonHooks } from "@ybyra/demo";

const driver = createWebDriver();
export const personService = createPersonService(driver);
export const personHandlers = createPersonHandlers(personService);
export const personHooks = createPersonHooks(personService);
```

## Key Patterns

1. **`useComponent(scope, scopes, navigate)`** — creates the ComponentContract from react-router
2. **`Schema.provide()`** — extracts schema config for components
3. **`allPermissions(schema)`** — grants all permissions (dev mode)
4. **`context={{ id }}`** — passes route params to view/edit forms
5. **Events are only passed to DataForm** — not to DataTable
6. **DataPage wraps everything** — provides domain context and scope header
