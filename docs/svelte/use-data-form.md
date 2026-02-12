# useDataForm

The main Svelte store for schema-driven forms. It manages field state, applies events and handlers, resolves groups and scoped actions, and returns proxied fields for dynamic overrides.

## Basic Usage

```svelte
<script lang="ts">
import { useDataForm, getRenderer } from '@ybyra/svelte'
import { Scope } from '@ybyra/core'

const formStore = useDataForm({
  schema: PersonSchema.provide(),
  scope: Scope.add,
  events: personEvents,
  handlers: personHandlers,
  component: componentContract,
  translate: t,
})

let form = $derived($formStore)
</script>

<form>
  {#each form.fields as field (field.name)}
    {@const Renderer = getRenderer(field.config.component)}
    {@const props = formStore.getFieldProps(field.name)}
    <Renderer {...props} />
  {/each}

  {#each form.actions as action (action.name)}
    <button onclick={action.execute}>
      {action.label}
    </button>
  {/each}
</form>
```

## Store API

`useDataForm` returns a **Readable store** extended with mutation methods. Use `$formStore` to subscribe to the reactive snapshot and call methods on the store object itself.

```typescript
const formStore = useDataForm({ /* ... */ })

// reactive snapshot via auto-subscription
let form = $derived($formStore)

// mutation methods on the store
formStore.setValue('name', 'John')
formStore.reset()
```

## Options

```typescript
interface UseDataFormOptions {
  schema: SchemaProvide
  scope: ScopeValue
  events?: Record<string, Record<string, EventFn>>
  handlers?: Record<string, HandlerFn>
  hooks?: SchemaHooks
  context?: Record<string, unknown>
  component: ComponentContract
  initialValues?: Record<string, unknown>
  translate?: TranslateContract
}
```

| Option | Required | Description |
|--------|----------|-------------|
| `schema` | Yes | Output of `SchemaDefinition.provide()` |
| `scope` | Yes | Current scope (`Scope.add`, `Scope.edit`, etc.) |
| `events` | No | Field event handlers from `SchemaDefinition.events()` |
| `handlers` | No | Action handlers from `SchemaDefinition.handlers()` |
| `hooks` | No | Lifecycle hooks from `SchemaDefinition.hooks()` |
| `context` | No | Contextual data (e.g., route params with record ID) |
| `component` | Yes | `ComponentContract` implementation |
| `initialValues` | No | Initial field values |
| `translate` | No | Translation function |

## Snapshot Properties

The `$formStore` snapshot contains:

| Property | Type | Description |
|----------|------|-------------|
| `loading` | `boolean` | True while bootstrap hooks are running |
| `state` | `Record<string, unknown>` | Current form values |
| `fields` | `ResolvedField[]` | Fields filtered by current scope |
| `groups` | `FieldGroup[]` | Groups with their resolved fields |
| `ungrouped` | `ResolvedField[]` | Fields not assigned to any group |
| `sections` | `FormSection[]` | Interleaved groups and ungrouped fields |
| `actions` | `ResolvedAction[]` | Actions filtered by current scope |
| `errors` | `Record<string, string[]>` | Validation errors per field |
| `dirty` | `boolean` | True if any field has changed |
| `valid` | `boolean` | True if all validations pass |

## Store Methods

Methods are called on the store object, not the snapshot:

| Method | Description |
|--------|-------------|
| `setValue(field, value)` | Set a single field value |
| `setValues(values)` | Set multiple field values |
| `reset(values?)` | Reset form to initial or provided values |
| `validate()` | Run all validations, returns boolean |
| `getFieldProps(name)` | Get `FieldRendererProps` for a field |

## FieldRendererProps

`getFieldProps()` returns everything a field renderer needs:

```typescript
interface FieldRendererProps {
  domain: string
  name: string
  value: unknown
  config: FieldConfig
  proxy: FieldProxy
  errors: string[]
  scope: ScopeValue
  onChange(value: unknown): void
  onBlur(): void
  onFocus(): void
}
```

| Prop | Description |
|------|-------------|
| `domain` | Schema domain name |
| `name` | Field name |
| `value` | Current field value |
| `config` | Field configuration (component, kind, validations, etc.) |
| `proxy` | Dynamic overrides (hidden, disabled, width, height, state) |
| `errors` | Validation error messages |
| `scope` | Current scope |
| `onChange` | Value change callback (triggers change events) |
| `onBlur` | Blur callback (triggers blur events) |
| `onFocus` | Focus callback (triggers focus events) |

## Rendering with Sections

```svelte
<script lang="ts">
import { useDataForm, getRenderer } from '@ybyra/svelte'

const formStore = useDataForm({ /* ... */ })
let form = $derived($formStore)
</script>

<form>
  {#each form.sections as section, i}
    {#if section.kind === 'group'}
      <fieldset>
        <legend>{t(`person.groups.${section.name}`)}</legend>
        {#each section.fields as field (field.name)}
          {@const Renderer = getRenderer(field.config.component)}
          <Renderer {...formStore.getFieldProps(field.name)} />
        {/each}
      </fieldset>
    {:else}
      {#each section.fields as field (field.name)}
        {@const Renderer = getRenderer(field.config.component)}
        <Renderer {...formStore.getFieldProps(field.name)} />
      {/each}
    {/if}
  {/each}
</form>
```

## Related Types

### ResolvedField

```typescript
interface ResolvedField {
  name: string
  config: FieldConfig
  proxy: FieldProxy
}
```

### ResolvedAction

```typescript
interface ResolvedAction {
  name: string
  config: ActionConfig
  execute(): void | Promise<void>
}
```

### FieldGroup

```typescript
interface FieldGroup {
  name: string
  config: GroupConfig
  fields: ResolvedField[]
}
```

### FormSection

```typescript
type FormSection =
  | { kind: 'group'; name: string; config: GroupConfig; fields: ResolvedField[] }
  | { kind: 'ungrouped'; fields: ResolvedField[] }
```
