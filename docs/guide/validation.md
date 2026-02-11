# Validation

Validation rules are declared directly on field definitions and automatically enforced by the form hook.

## Declarative Validation

Add validation rules through field methods:

```typescript
text().required().minLength(3).maxLength(100)
number().min(0).max(999)
date().min('2020-01-01').max('2030-12-31')
text().pattern(/^\d{5}$/, 'Must be 5 digits')
```

Each method adds a `ValidationRule` to the field's configuration:

```typescript
interface ValidationRule {
  rule: string
  params?: Record<string, unknown>
  message?: string
}
```

## Built-in Validators

| Rule | Field Methods | Description |
|------|---------------|-------------|
| `required` | `.required()` | Value must be present and non-empty |
| `minLength` | `.minLength(n)` | String minimum length |
| `maxLength` | `.maxLength(n)` | String maximum length |
| `min` | `.min(n)` | Numeric minimum value |
| `max` | `.max(n)` | Numeric maximum value |
| `minDate` | `.min(date)` | Date minimum bound |
| `maxDate` | `.max(date)` | Date maximum bound |
| `pattern` | `.pattern(regex, msg?)` | Regex pattern match |

## Form Validation

The `useDataForm` hook provides validation methods:

```typescript
const form = useDataForm({ /* ... */ })

form.validate()  // validates all fields, returns boolean
form.errors      // Record<string, string[]> — field errors
form.valid       // boolean — all fields pass validation
form.dirty       // boolean — any field has changed
```

### Validate Before Submit

```typescript
const personHandlers = PersonSchema.handlers({
  create({ state, form, component }) {
    if (!form?.validate()) return
    // proceed with submit
  },
})
```

## Validation Functions

All framework packages export identical validation utilities:

::: code-group

```typescript [React]
import { validateField, validateAllFields } from '@anhanga/react'

// Validate a single field
const errors = validateField(value, field.validations, translate)

// Validate all fields
const allErrors = validateAllFields(state, schema.fields, translate)
```

```typescript [Vue]
import { validateField, validateAllFields } from '@anhanga/vue'

// Validate a single field
const errors = validateField(value, field.validations, translate)

// Validate all fields
const allErrors = validateAllFields(state, schema.fields, translate)
```

```typescript [Svelte]
import { validateField, validateAllFields } from '@anhanga/svelte'

// Validate a single field
const errors = validateField(value, field.validations, translate)

// Validate all fields
const allErrors = validateAllFields(state, schema.fields, translate)
```

:::

## Custom Validators

Register custom validators to extend the built-in set:

```typescript
import { registerValidator } from '@anhanga/react' // or '@anhanga/vue' or '@anhanga/svelte'

registerValidator('cpf', (value, params, translate) => {
  if (!value) return null
  return isValidCPF(value) ? null : translate('validation.cpf')
})
```

The validator function signature:

```typescript
type ValidatorFn = (
  value: unknown,
  params: Record<string, unknown> | undefined,
  translate?: TranslateContract,
) => string | null
```

Return `null` for valid, or a string error message for invalid.

See [Custom Validators](/advanced/custom-validators) for more details.

## Error Display

Field errors are available through `getFieldProps()`:

```typescript
const props = form.getFieldProps('email')
// props.errors: string[] — list of validation error messages
```

Your field renderer receives these errors and can display them:

```tsx
function TextField({ errors, ...props }: FieldRendererProps) {
  return (
    <div>
      <input {...props} />
      {errors.map((err) => (
        <span key={err} className="error">{err}</span>
      ))}
    </div>
  )
}
```
