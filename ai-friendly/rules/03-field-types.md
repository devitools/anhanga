# Field Types

## Factory Functions

All field types are imported directly from `@ybyra/core`:

```typescript
import { text, number, date, datetime, currency, file, select, toggle, checkbox } from "@ybyra/core";
```

## Common Methods (all field types)

Every `FieldDefinition` inherits these methods:

| Method | Description | Example |
|--------|-------------|---------|
| `.width(n)` | Width as percentage of row (0-100) | `.width(60)` |
| `.height(n)` | Height in pixels | `.height(200)` |
| `.hidden()` | Hide the field | `.hidden()` |
| `.disabled()` | Make read-only | `.disabled()` |
| `.order(n)` | Sort order (lower = first) | `.order(1)` |
| `.default(value)` | Default value | `.default("")` |
| `.group(name)` | Assign to a group | `.group("basic")` |
| `.scopes(...scopes)` | Whitelist scopes | `.scopes(Scope.add, Scope.edit)` |
| `.excludeScopes(...scopes)` | Blacklist scopes | `.excludeScopes(Scope.index)` |
| `.states(...states)` | Define visual states | `.states("new", "error")` |
| `.column()` | Show in table column | `.column()` |
| `.filterable()` | Enable table filtering | `.filterable()` |
| `.sortable()` | Enable table sorting | `.sortable()` |
| `.required()` | Mark as required | `.required()` |

## Text Field

```typescript
import { text, Text } from "@ybyra/core";

text()                           // basic text input
text().kind(Text.Email)          // email input
text().kind(Text.Phone)          // phone input
text().kind(Text.Street)         // street address
text().kind(Text.City)           // city
text().kind(Text.Password)       // password input
text().kind(Text.Textarea)       // multiline text
text().kind(Text.Url)            // URL input
text().kind(Text.Cpf)            // CPF (Brazilian ID)
text().kind(Text.Cnpj)           // CNPJ (Brazilian company ID)
```

### Text-specific methods:
| Method | Description |
|--------|-------------|
| `.kind(Text.X)` | Input specialization |
| `.minLength(n)` | Minimum character count |
| `.maxLength(n)` | Maximum character count |
| `.pattern(regex)` | Validation regex pattern |

## Number Field

```typescript
import { number } from "@ybyra/core";

number()                         // basic number input
number().min(0).max(100)         // with range
number().precision(2)            // decimal places
```

### Number-specific methods:
| Method | Description |
|--------|-------------|
| `.min(n)` | Minimum value |
| `.max(n)` | Maximum value |
| `.precision(n)` | Decimal precision |

## Date Field

```typescript
import { date } from "@ybyra/core";

date()                           // date picker (no time)
date().min("2020-01-01")         // minimum date
date().max("2030-12-31")         // maximum date
```

## Datetime Field

```typescript
import { datetime } from "@ybyra/core";

datetime()                       // date + time picker
datetime().min("2020-01-01T00:00")
datetime().max("2030-12-31T23:59")
```

### Date/Datetime-specific methods:
| Method | Description |
|--------|-------------|
| `.min(dateStr)` | Minimum date |
| `.max(dateStr)` | Maximum date |

## Currency Field

```typescript
import { currency } from "@ybyra/core";

currency()                       // currency input
currency().min(0)                // minimum value
currency().max(99999)            // maximum value
currency().precision(2)          // decimal places
currency().prefix("R$")         // currency prefix
```

### Currency-specific methods:
| Method | Description |
|--------|-------------|
| `.min(n)` | Minimum value |
| `.max(n)` | Maximum value |
| `.precision(n)` | Decimal precision |
| `.prefix(str)` | Currency symbol prefix |

## File Field

```typescript
import { file } from "@ybyra/core";

file()                           // file upload
file().accept("image/*")         // accepted MIME types
file().maxSize(5 * 1024 * 1024)  // max file size in bytes
```

### File-specific methods:
| Method | Description |
|--------|-------------|
| `.accept(mime)` | Accepted MIME types |
| `.maxSize(bytes)` | Maximum file size |

## Select Field

```typescript
import { select } from "@ybyra/core";

select<string>()                 // generic over value type
select<number>()                 // number values
```

> Note: Select options are typically loaded dynamically via events or provided by the component.

## Toggle Field

```typescript
import { toggle } from "@ybyra/core";

toggle()                         // boolean toggle/switch
toggle().default(true)           // default to on
```

## Checkbox Field

```typescript
import { checkbox } from "@ybyra/core";

checkbox()                       // boolean checkbox
checkbox().default(false)        // default to unchecked
```

## Complete Example

```typescript
import { text, Text, number, date, currency, toggle, select, group } from "@ybyra/core";

fields: {
  // Text fields with specializations
  name: text().width(100).default("").required().column().filterable().group("general"),
  email: text().kind(Text.Email).width(60).required().column().group("general"),
  phone: text().kind(Text.Phone).width(40).group("general"),
  description: text().kind(Text.Textarea).width(100).height(120).group("details"),

  // Numeric fields
  price: currency().width(40).min(0).precision(2).prefix("R$").required().group("pricing"),
  quantity: number().width(30).min(0).max(99999).group("pricing"),
  discount: number().width(30).min(0).max(100).precision(1).group("pricing"),

  // Date fields
  createdAt: date().width(50).disabled().group("metadata"),
  expirationDate: date().width(50).group("metadata"),

  // Boolean fields
  active: toggle().width(20).default(true).column().group("general"),
  featured: checkbox().width(20).group("general"),

  // Select field
  category: select<string>().width(50).required().column().group("general"),
}
```
