import { registerRenderers } from '@ybyra/vue'
import TextField from './TextField.vue'
import TextareaField from './TextareaField.vue'
import NumberField from './NumberField.vue'
import ToggleField from './ToggleField.vue'
import DateField from './DateField.vue'
import TimeField from './TimeField.vue'
import SelectField from './SelectField.vue'
import MultiSelectField from './MultiSelectField.vue'
import ListField from './ListField.vue'
import TreeField from './TreeField.vue'

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
