# Renderer Registry

The renderer registry maps field component types to React components. When the form resolves a field, it looks up the renderer by the field's `component` property.

## Registering Renderers

```typescript
import { registerRenderers } from '@anhanga/react'
import { TextField, NumberField, DateField, ToggleField, SelectField } from './renderers'

registerRenderers({
  text: TextField,
  number: NumberField,
  date: DateField,
  datetime: DateField,
  toggle: ToggleField,
  checkbox: ToggleField,
  select: SelectField,
  currency: CurrencyField,
  file: FileField,
  image: ImageField,
})
```

## Getting a Renderer

```typescript
import { getRenderer } from '@anhanga/react'

const Renderer = getRenderer('text')
// Returns the TextField component, or undefined if not registered
```

## Isolated Registries

For multi-tenant apps or testing, create an isolated registry:

```typescript
import { createRegistry } from '@anhanga/react'

const registry = createRegistry()

registry.register({
  text: CustomTextField,
  number: CustomNumberField,
})

const Renderer = registry.get('text')
```

## Writing a Field Renderer

Every renderer receives `FieldRendererProps`:

```typescript
import type { FieldRendererProps } from '@anhanga/react'

function TextField({ name, value, config, proxy, errors, onChange, onBlur, onFocus }: FieldRendererProps) {
  if (proxy.hidden) return null

  return (
    <div style={{ width: `${proxy.width}%` }}>
      <input
        name={name}
        value={String(value ?? '')}
        disabled={proxy.disabled}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      {errors.map((err) => (
        <span key={err} className="error">{err}</span>
      ))}
    </div>
  )
}
```

### FieldRendererProps

| Prop | Type | Description |
|------|------|-------------|
| `domain` | `string` | Schema domain name |
| `name` | `string` | Field name |
| `value` | `unknown` | Current value |
| `config` | `FieldConfig` | Static field configuration |
| `proxy` | `FieldProxy` | Dynamic overrides (hidden, disabled, width, height, state) |
| `errors` | `string[]` | Validation error messages |
| `scope` | `ScopeValue` | Current scope |
| `onChange(value)` | `function` | Value change callback |
| `onBlur()` | `function` | Blur callback |
| `onFocus()` | `function` | Focus callback |

### Using Field Kind

Text fields have a `kind` property for specialization:

```typescript
function TextField({ config, ...props }: FieldRendererProps) {
  const kind = config.kind // 'email', 'phone', 'url', etc.

  switch (kind) {
    case 'email':
      return <input type="email" {...inputProps} />
    case 'phone':
      return <PhoneMaskInput {...inputProps} />
    default:
      return <input type="text" {...inputProps} />
  }
}
```

### Using Field State

The `proxy.state` property provides the current visual state:

```typescript
function TextField({ proxy, ...props }: FieldRendererProps) {
  const stateClass = proxy.state ? `field--${proxy.state}` : ''

  return <div className={`field ${stateClass}`}>...</div>
}
```
