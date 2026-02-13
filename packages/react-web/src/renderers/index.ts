import { registerRenderers } from "@ybyra/react";
import { TextField } from "./TextField";
import { TextareaField } from "./TextareaField";
import { NumberField } from "./NumberField";
import { ToggleField } from "./ToggleField";
import { DateField } from "./DateField";
import { TimeField } from "./TimeField";
import { SelectField } from "./SelectField";
import { MultiSelectField } from "./MultiSelectField";
import { ListField } from "./ListField";
import { TreeField } from "./TreeField";

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
});
