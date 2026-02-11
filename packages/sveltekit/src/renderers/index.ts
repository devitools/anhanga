import { registerRenderers } from '@anhanga/svelte'
import TextField from './TextField.svelte'
import NumberField from './NumberField.svelte'
import ToggleField from './ToggleField.svelte'
import DateField from './DateField.svelte'

registerRenderers({
  text: TextField,
  number: NumberField,
  toggle: ToggleField,
  checkbox: ToggleField,
  date: DateField,
  datetime: DateField,
})
