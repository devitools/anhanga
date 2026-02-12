# Field Types

Anhanga provides factory functions for each field type. All fields use the builder pattern — chain methods to configure behavior.

## Field Factories

| Factory | Data Type | Component | Description |
|---------|-----------|-----------|-------------|
| `text()` | `string` | `text` | Text input with optional kind specialization |
| `number()` | `number` | `number` | Numeric input |
| `currency()` | `number` | `currency` | Currency input with prefix and precision |
| `date()` | `string` | `date` | Date picker |
| `datetime()` | `string` | `datetime` | Date and time picker |
| `toggle()` | `boolean` | `toggle` | Toggle switch |
| `checkbox()` | `boolean` | `checkbox` | Checkbox |
| `select()` | `V` (generic) | `select` | Dropdown selection |
| `file()` | `File` | `file` | File upload |
| `image()` | `File` | `image` | Image upload |

## Common Methods

Every field type inherits these methods from `FieldDefinition<T>`:

| Method | Description |
|--------|-------------|
| `.width(n)` | Form width (0–100) |
| `.height(n)` | Form height |
| `.hidden()` | Hide the field |
| `.disabled()` | Disable the field |
| `.required()` | Mark as required (adds validation) |
| `.order(n)` | Sort order in the form |
| `.default(value)` | Default value |
| `.group(name)` | Assign to a group |
| `.scopes(...scopes)` | Whitelist scopes |
| `.excludeScopes(...scopes)` | Blacklist scopes |
| `.states(...states)` | Allowed visual states |
| `.column(config?)` | Show as table column |
| `.filterable()` | Enable table filtering |
| `.sortable(sortable?)` | Enable table sorting |

## Type-Specific Methods

### text()

```typescript
import { text, Text } from '@ybyra/core'

text()
  .kind(Text.Email)   // specialize the text input
  .minLength(3)        // minimum character length
  .maxLength(100)      // maximum character length
  .pattern(/^\d{5}$/, 'Must be 5 digits')  // regex validation
```

### Text Kinds

Specialize text fields with `.kind()`:

| Kind | Description |
|------|-------------|
| `Text.Email` | Email input |
| `Text.Phone` | Phone mask |
| `Text.Url` | URL input |
| `Text.Cpf` | CPF mask (Brazilian ID) |
| `Text.Cnpj` | CNPJ mask (Brazilian company ID) |
| `Text.Cep` | CEP mask (Brazilian postal code) |
| `Text.Street` | Street input |
| `Text.City` | City input |

### number()

```typescript
import { number } from '@ybyra/core'

number()
  .min(0)          // minimum value
  .max(999)        // maximum value
  .precision(2)    // decimal places
```

### currency()

```typescript
import { currency } from '@ybyra/core'

currency()
  .min(0)
  .max(999999)
  .precision(2)     // decimal places
  .prefix('$')      // currency symbol prefix
```

### date() / datetime()

```typescript
import { date, datetime } from '@ybyra/core'

date()
  .min('2020-01-01')   // minimum date
  .max('2030-12-31')   // maximum date

datetime()
  .min('2020-01-01T00:00')
  .max('2030-12-31T23:59')
```

### file() / image()

```typescript
import { file, image } from '@ybyra/core'

file()
  .accept('.pdf,.doc,.docx')   // accepted file types
  .maxSize(5 * 1024 * 1024)    // max file size in bytes

image()
  .accept('.png,.jpg,.webp')
  .maxSize(2 * 1024 * 1024)
```

### select()

```typescript
import { select } from '@ybyra/core'

// Generic over the option value type
select<string>()
select<number>()
```

### toggle() / checkbox()

No type-specific methods. Use common methods only:

```typescript
import { toggle, checkbox } from '@ybyra/core'

toggle().default(true).width(20)
checkbox().default(false)
```

## Column Configuration

Mark fields as table columns with `.column()`:

```typescript
text().column()              // default column
text().column({ width: 200, align: 'center' })  // with options
text().column().sortable()   // sortable column
text().column().filterable() // filterable column
```
