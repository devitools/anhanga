# Form Hydration Flow Analysis

## Problem Summary
When form data is fetched from the backend and hydrated into the form, onChange events are NOT fired. This leaves the UI inconsistent - e.g., a field that should be hidden based on another field's value remains visible.

Example from `packages/demo/src/domain/person/events.ts`:
```typescript
active: {
  change ({ state, schema }) {
    schema.birthDate.hidden = !state.active;  // Hides birthDate when active is false
    schema.street.disabled = !state.active;   // Disables address fields
    schema.city.disabled = !state.active;
  },
}
```

When `active` is hydrated from backend (e.g., `active: false`), this event is never fired, so `birthDate` remains visible when it should be hidden.

## Complete Hydration Flow

### 1. Hooks Definition (in schema)
**File: `packages/core/src/schema.ts` (lines 46-66)**
- `BootstrapHookContext` provides a `hydrate(data)` callback
- `HookBootstrapFn` is called once per scope during component mount
- Bootstrap hooks run for view/edit/add scopes

### 2. Demo Bootstrap Hook
**File: `packages/demo/src/settings/hooks.ts`**
```typescript
bootstrap: {
  async [Scope.view] ({ context, schema, hydrate }: BootstrapHookContext) {
    if (!context.id) return;
    const data = await service.read(context.id as string);
    hydrate(data);  // ← Called here to set initial data
    for (const field of Object.values(schema)) {
      field.disabled = true;  // ← Can set field overrides here
    }
  },
  async [Scope.edit] ({ context, hydrate }: BootstrapHookContext) {
    if (!context.id) return;
    const data = await service.read(context.id as string);
    hydrate(data);  // ← Called here
  },
}
```

### 3. How Each Adapter Processes Hydration

#### React: `packages/react/src/use-data-form.ts` (lines 28-55)
```typescript
useEffect(() => {
  const hook = hooks?.bootstrap?.[scope];
  if (!hook) return;

  const run = async () => {
    let hydratedData: Record<string, unknown> | undefined;
    const schemaResult = createSchemaProxy(schema.fields, {});
    const hydrate = (data: Record<string, unknown>) => { hydratedData = data; };

    await hook({ context: context ?? {}, hydrate, schema: schemaResult.proxy, component });

    if (hydratedData) {
      const newState = buildInitialState(schema.fields, hydratedData);
      setState(newState);  // ← State set WITHOUT firing events
      initialStateRef.current = newState;
    }

    const overrides = schemaResult.getOverrides();
    if (Object.keys(overrides).length > 0) {
      setFieldOverrides(overrides);
    }

    setLoading(false);
  };

  run();
}, []);
```

**Problem**: `setState(newState)` directly sets state without calling `fireEvent()`.

#### Svelte: `packages/svelte/src/use-data-form.ts` (lines 35-59)
```typescript
const hook = hooks?.bootstrap?.[scope]
if (hook) {
  const run = async () => {
    let hydratedData: Record<string, unknown> | undefined
    const schemaResult = createSchemaProxy(schema.fields, {})
    const hydrate = (data: Record<string, unknown>) => { hydratedData = data }

    await hook({ context: context ?? {}, hydrate, schema: schemaResult.proxy, component })

    if (hydratedData) {
      const newState = buildInitialState(schema.fields, hydratedData)
      state.set(newState)  // ← State set WITHOUT firing events
      Object.assign(initialState, newState)
    }

    const overrides = schemaResult.getOverrides()
    if (Object.keys(overrides).length > 0) {
      fieldOverrides.set(overrides)
    }

    loading.set(false)
  }

  run()
}
```

**Problem**: `state.set(newState)` directly sets state without calling `fireEvent()`.

#### Vue: `packages/vue/src/use-data-form.ts` (lines 26-52)
```typescript
onMounted(() => {
  const hook = hooks?.bootstrap?.[scope]
  if (!hook) return

  const run = async () => {
    let hydratedData: Record<string, unknown> | undefined
    const schemaResult = createSchemaProxy(schema.fields, {})
    const hydrate = (data: Record<string, unknown>) => { hydratedData = data }

    await hook({ context: context ?? {}, hydrate, schema: schemaResult.proxy, component })

    if (hydratedData) {
      const newState = buildInitialState(schema.fields, hydratedData)
      state.value = newState  // ← State set WITHOUT firing events
      Object.assign(initialState, newState)
    }

    const overrides = schemaResult.getOverrides()
    if (Object.keys(overrides).length > 0) {
      fieldOverrides.value = overrides
    }

    loading.value = false
  }

  run()
})
```

**Problem**: `state.value = newState` directly sets state without calling `fireEvent()`.

### 4. Event System (setValue correctly fires events)

**React Example - setValue does fire events (line 182-204):**
```typescript
const setValue = useCallback(
  (field: string, value: unknown) => {
    const nextState = { ...state, [field]: value };
    setState(nextState);

    // Validation...
    fireEvent(field, "change", nextState);  // ← Events fired for user input
  },
  [state, schema.fields, fireEvent, t],
);
```

**The fireEvent function (lines 148-180):**
```typescript
const fireEvent = useCallback(
  (fieldName: string, eventName: string, nextState: Record<string, unknown>) => {
    const handler = events?.[fieldName]?.[eventName];
    if (!handler) return nextState;

    const stateResult = createStateProxy(nextState);
    const schemaResult = createSchemaProxy(schema.fields, fieldOverrides);

    handler({ state: stateResult.proxy, schema: schemaResult.proxy });

    const stateChanges = stateResult.getChanges();
    const schemaOverrides = schemaResult.getOverrides();

    const mergedState = { ...nextState, ...stateChanges };

    if (Object.keys(stateChanges).length > 0) {
      setState(mergedState);
    }

    if (Object.keys(schemaOverrides).length > 0) {
      setFieldOverrides((prev) => {
        const next = { ...prev };
        for (const [name, overrides] of Object.entries(schemaOverrides)) {
          next[name] = { ...next[name], ...overrides };
        }
        return next;
      });
    }

    return mergedState;
  },
  [events, schema.fields, fieldOverrides],
);
```

### 5. Sample Scenario (Person Schema)

**Schema with events that hide fields:**
- File: `packages/demo/src/domain/person/schema.ts`
- Field: `active` (toggle) with `birthDate` field

**Events:**
- File: `packages/demo/src/domain/person/events.ts`
- When `active` changes to false:
  - `birthDate` should be hidden
  - `street` and `city` should be disabled

**Hydration sequence for Scope.edit:**
1. User navigates to `/person/edit/123`
2. `useDataForm()` creates bootstrap hook
3. Hook calls `service.read('123')` → returns `{ id: '123', active: false, birthDate: '2000-01-01', ... }`
4. Hook calls `hydrate(data)` 
5. Data is processed by `buildInitialState()` to set form state
6. **BUG**: State is set directly WITHOUT firing `active` field's `change` event
7. Result: `birthDate` remains visible, `street`/`city` remain enabled (incorrect UI state)

## Root Cause

All three adapters (React, Svelte, Vue) call `hydrate()` and set state with the result, but **none of them fire the field change events afterward**.

The `fireEvent()` function exists and works correctly for user input (onChange, onBlur, onFocus), but it's never called during hydration.

## Files Involved

### Core Package
- **`packages/core/src/schema.ts`** - Defines hook types (BootstrapHookContext, HookBootstrapFn)
- **`packages/core/src/scope.ts`** - `buildInitialState()` function
- **`packages/core/src/types.ts`** - Type contracts (FormContract, etc.)

### React Package
- **`packages/react/src/use-data-form.ts`** - Main hook with fireEvent system (BUG location: lines 28-55)

### Svelte Package
- **`packages/svelte/src/use-data-form.ts`** - Svelte version (BUG location: lines 35-59)

### Vue Package
- **`packages/vue/src/use-data-form.ts`** - Vue version (BUG location: lines 26-52)

### Demo
- **`packages/demo/src/domain/person/events.ts`** - Example events that show the issue
- **`packages/demo/src/domain/person/schema.ts`** - Person schema definition
- **`packages/demo/src/settings/hooks.ts`** - Bootstrap hook implementation

### Playgrounds
- **`playground/react-web/src/pages/person/PersonEdit.tsx`** - Real usage example

## Key Insight

The hydration process needs to trigger field change events so that:
1. Field visibility/disabled state gets recalculated
2. Any derived field state (colors, messages, etc.) gets set
3. The UI reflects the correct state based on the data dependencies

Currently, only the raw field values are set, but the dependent field metadata (hidden, disabled, state, width, height) is not recalculated during hydration.
