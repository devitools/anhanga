# Renderer Registry

The renderer registry maps field component types to Svelte components. When the form resolves a field, it looks up the renderer by the field's `component` property.

## Registering Renderers

```typescript
import { registerRenderers } from '@ybyra/svelte'
import TextField from './renderers/TextField.svelte'
import NumberField from './renderers/NumberField.svelte'
import DateField from './renderers/DateField.svelte'
import ToggleField from './renderers/ToggleField.svelte'
import SelectField from './renderers/SelectField.svelte'
import CurrencyField from './renderers/CurrencyField.svelte'
import FileField from './renderers/FileField.svelte'

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
import { getRenderer } from '@ybyra/svelte'

const Renderer = getRenderer('text')
// Returns the Svelte component, or undefined if not registered
```

## Isolated Registries

For multi-tenant apps or testing, create an isolated registry:

```typescript
import { createRegistry } from '@ybyra/svelte'

const registry = createRegistry()

registry.register({
  text: CustomTextField,
  number: CustomNumberField,
})

const Renderer = registry.get('text')
```

## Writing a Field Renderer

Every renderer receives `FieldRendererProps` as props:

```svelte
<script lang="ts">
import type { FieldRendererProps } from '@ybyra/svelte'

let props = $props<FieldRendererProps>()
</script>

{#if !props.proxy.hidden}
  <div style:width="{props.proxy.width}%">
    <input
      name={props.name}
      value={String(props.value ?? '')}
      disabled={props.proxy.disabled}
      oninput={(e) => props.onChange(e.currentTarget.value)}
      onblur={props.onBlur}
      onfocus={props.onFocus}
    />
    {#each props.errors as err}
      <span class="error">{err}</span>
    {/each}
  </div>
{/if}
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

```svelte
<script lang="ts">
import type { FieldRendererProps } from '@ybyra/svelte'

let props = $props<FieldRendererProps>()
</script>

{#if props.config.kind === 'email'}
  <input
    type="email"
    value={props.value}
    oninput={(e) => props.onChange(e.currentTarget.value)}
  />
{:else}
  <input
    type="text"
    value={props.value}
    oninput={(e) => props.onChange(e.currentTarget.value)}
  />
{/if}
```

### Using Field State

The `proxy.state` property provides the current visual state:

```svelte
<script lang="ts">
import type { FieldRendererProps } from '@ybyra/svelte'

let props = $props<FieldRendererProps>()
</script>

<div class="field" class:field--error={props.proxy.state === 'error'}>
  <!-- field content -->
</div>
```
