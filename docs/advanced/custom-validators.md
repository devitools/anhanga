# Custom Validators

Extend the built-in validation with custom rules using `registerValidator()`.

## Registering a Validator

```typescript
import { registerValidator } from '@anhanga/react'

registerValidator('cpf', (value, params, translate) => {
  if (!value) return null
  return isValidCPF(String(value)) ? null : translate?.('validation.cpf') ?? 'Invalid CPF'
})
```

## Validator Signature

```typescript
type ValidatorFn = (
  value: unknown,
  params: Record<string, unknown> | undefined,
  translate?: TranslateContract,
) => string | null
```

| Parameter | Description |
|-----------|-------------|
| `value` | The field's current value |
| `params` | Optional parameters from the validation rule |
| `translate` | Translation function for error messages |

Return `null` if valid, or a string error message if invalid.

## Examples

### Email Domain Validator

```typescript
registerValidator('emailDomain', (value, params, translate) => {
  if (!value) return null
  const domain = params?.domain as string
  if (!String(value).endsWith(`@${domain}`)) {
    return translate?.('validation.emailDomain') ?? `Must be a @${domain} email`
  }
  return null
})
```

### Async-Compatible Validator

Validators are synchronous. For async validation, handle it in event handlers or action handlers instead:

```typescript
const events = PersonSchema.events({
  email: {
    async blur({ state, schema }) {
      const exists = await checkEmailExists(state.email)
      if (exists) {
        schema.email.state = 'error'
      }
    },
  },
})
```

## Built-in Validators

These validators are available out of the box:

| Name | Description | Params |
|------|-------------|--------|
| `required` | Non-empty value | — |
| `minLength` | Minimum string length | `{ min: number }` |
| `maxLength` | Maximum string length | `{ max: number }` |
| `min` | Minimum numeric value | `{ min: number }` |
| `max` | Maximum numeric value | `{ max: number }` |
| `minDate` | Minimum date bound | `{ min: string }` |
| `maxDate` | Maximum date bound | `{ max: string }` |
| `pattern` | Regex match | `{ pattern: string, message?: string }` |
