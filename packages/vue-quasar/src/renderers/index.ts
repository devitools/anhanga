import { registerRenderers } from '@anhanga/vue'
import TextField from './TextField.vue'
import NumberField from './NumberField.vue'
import ToggleField from './ToggleField.vue'
import DateField from './DateField.vue'

registerRenderers({
  text: TextField,
  number: NumberField,
  toggle: ToggleField,
  checkbox: ToggleField,
  date: DateField,
  datetime: DateField,
})
