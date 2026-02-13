import { registerRenderers } from '@ybyra/svelte'
import TextField from './TextField.svelte'
import TextareaField from './TextareaField.svelte'
import NumberField from './NumberField.svelte'
import ToggleField from './ToggleField.svelte'
import DateField from './DateField.svelte'
import TimeField from './TimeField.svelte'
import SelectField from './SelectField.svelte'
import MultiSelectField from './MultiSelectField.svelte'
import ListField from './ListField.svelte'
import TreeField from './TreeField.svelte'

registerRenderers({
  text: TextField,
  textarea: TextareaField,
  number: NumberField,
  toggle: ToggleField,
  checkbox: ToggleField,
  date: DateField,
  datetime: DateField,
  time: TimeField,
  select: SelectField,
  multiselect: MultiSelectField,
  list: ListField,
  tree: TreeField,
})
