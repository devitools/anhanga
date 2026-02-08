# Renderer Registry

The renderer registry maps field component types to Vue components. When the form resolves a field, it looks up the renderer by the field's `component` property.

## Registering Renderers

```typescript
import { registerRenderers } from '@anhanga/vue'
import TextField from './renderers/TextField.vue'
import NumberField from './renderers/NumberField.vue'
import DateField from './renderers/DateField.vue'
import ToggleField from './renderers/ToggleField.vue'
import SelectField from './renderers/SelectField.vue'
import CurrencyField from './renderers/CurrencyField.vue'
import FileField from './renderers/FileField.vue'

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
})
```

## Getting a Renderer

```typescript
import { getRenderer } from '@anhanga/vue'

const Renderer = getRenderer('text')
// Returns the Vue component, or undefined if not registered
```

## Isolated Registries

For multi-tenant apps or testing, create an isolated registry:

```typescript
import { createRegistry } from '@anhanga/vue'

const registry = createRegistry()

registry.register({
  text: CustomTextField,
  number: CustomNumberField,
})

const Renderer = registry.get('text')
```

## Writing a Field Renderer

Every renderer receives `FieldRendererProps` as props:

```vue
<script setup lang="ts">
import type { FieldRendererProps } from '@anhanga/vue'

const props = defineProps<FieldRendererProps>()
</script>

<template>
  <div v-if="!props.proxy.hidden" :style="{ width: `${props.proxy.width}%` }">
    <input
      :name="props.name"
      :value="String(props.value ?? '')"
      :disabled="props.proxy.disabled"
      @input="props.onChange(($event.target as HTMLInputElement).value)"
      @blur="props.onBlur()"
      @focus="props.onFocus()"
    />
    <span v-for="err in props.errors" :key="err" class="error">
      {{ err }}
    </span>
  </div>
</template>
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

```vue
<script setup lang="ts">
import type { FieldRendererProps } from '@anhanga/vue'

const props = defineProps<FieldRendererProps>()
</script>

<template>
  <input
    v-if="props.config.kind === 'email'"
    type="email"
    :value="props.value"
    @input="props.onChange(($event.target as HTMLInputElement).value)"
  />
  <input
    v-else
    type="text"
    :value="props.value"
    @input="props.onChange(($event.target as HTMLInputElement).value)"
  />
</template>
```

### Using Field State

The `proxy.state` property provides the current visual state:

```vue
<script setup lang="ts">
import type { FieldRendererProps } from '@anhanga/vue'

const props = defineProps<FieldRendererProps>()
</script>

<template>
  <div :class="['field', props.proxy.state ? `field--${props.proxy.state}` : '']">
    <!-- field content -->
  </div>
</template>
```
