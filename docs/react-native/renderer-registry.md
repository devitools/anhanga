# Renderer Registry

The renderer registry maps field component types to React Native components. When the form resolves a field, it looks up the renderer by the field's `component` property.

React Native uses the same registry API from `@ybyra/react`.

## Registering Renderers

```typescript
import { registerRenderers } from '@ybyra/react'
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
import { getRenderer } from '@ybyra/react'

const Renderer = getRenderer('text')
// Returns the TextField component, or undefined if not registered
```

## Isolated Registries

For multi-tenant apps or testing, create an isolated registry:

```typescript
import { createRegistry } from '@ybyra/react'

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
import type { FieldRendererProps } from '@ybyra/react'
import { View, TextInput, Text } from 'react-native'

function TextField({ name, value, config, proxy, errors, onChange, onBlur, onFocus }: FieldRendererProps) {
  if (proxy.hidden) return null

  return (
    <View style={{ width: `${proxy.width}%` }}>
      <TextInput
        value={String(value ?? '')}
        editable={!proxy.disabled}
        onChangeText={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      {errors.map((err) => (
        <Text key={err} style={{ color: 'red' }}>{err}</Text>
      ))}
    </View>
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
      return <TextInput keyboardType="email-address" {...inputProps} />
    case 'phone':
      return <TextInput keyboardType="phone-pad" {...inputProps} />
    default:
      return <TextInput keyboardType="default" {...inputProps} />
  }
}
```

### Using Field State

The `proxy.state` property provides the current visual state:

```typescript
function TextField({ proxy, ...props }: FieldRendererProps) {
  const borderColor = proxy.state === 'error' ? 'red' : 'gray'

  return <View style={{ borderColor }}>...</View>
}
```
