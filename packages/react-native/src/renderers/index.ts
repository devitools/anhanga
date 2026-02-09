import { registerRenderers } from "@anhanga/react";
import { TextField } from "./TextField";
import { NumberField } from "./NumberField";
import { ToggleField } from "./ToggleField";
import { DateField } from "./DateField";

registerRenderers({
  text: TextField,
  number: NumberField,
  toggle: ToggleField,
  checkbox: ToggleField,
  date: DateField,
  datetime: DateField,
});
