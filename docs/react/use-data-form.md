# useDataForm

The main React hook for schema-driven forms. It manages field state, applies events and handlers, resolves groups and scoped actions, and returns proxied fields for dynamic overrides.

## Basic Usage

```tsx
import { useDataForm, getRenderer } from '@ybyra/react'
import { Scope } from '@ybyra/core'

function PersonForm() {
  const form = useDataForm({
    schema: PersonSchema.provide(),
    scope: Scope.add,
    events: personEvents,
    handlers: personHandlers,
    component: componentContract,
    translate: t,
  })

  return (
    <form>
      {form.fields.map((field) => {
        const props = form.getFieldProps(field.name)
        const Renderer = getRenderer(field.config.component)
        return <Renderer key={field.name} {...props} />
      })}

      {form.actions.map((action) => (
        <button key={action.name} onClick={action.execute}>
          {action.label}
        </button>
      ))}
    </form>
  )
}
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

## Return Value

```typescript
interface UseDataFormReturn {
  loading: boolean
  state: Record<string, unknown>
  fields: ResolvedField[]
  groups: FieldGroup[]
  ungrouped: ResolvedField[]
  sections: FormSection[]
  actions: ResolvedAction[]
  errors: Record<string, string[]>
  dirty: boolean
  valid: boolean
  setValue(field: string, value: unknown): void
  setValues(values: Record<string, unknown>): void
  reset(values?: Record<string, unknown>): void
  validate(): boolean
  getFieldProps(name: string): FieldRendererProps
}
```

### Properties

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

### Methods

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

```tsx
function PersonForm() {
  const form = useDataForm({ /* ... */ })

  return (
    <form>
      {form.sections.map((section, i) => {
        if (section.kind === 'group') {
          return (
            <fieldset key={section.name}>
              <legend>{t(`person.groups.${section.name}`)}</legend>
              {section.fields.map((field) => {
                const Renderer = getRenderer(field.config.component)
                return <Renderer key={field.name} {...form.getFieldProps(field.name)} />
              })}
            </fieldset>
          )
        }
        return section.fields.map((field) => {
          const Renderer = getRenderer(field.config.component)
          return <Renderer key={field.name} {...form.getFieldProps(field.name)} />
        })
      })}
    </form>
  )
}
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
