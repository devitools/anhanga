# Type Inference

Anhanga provides full TypeScript inference. `InferRecord` extracts a typed record directly from your schema definition.

## InferRecord

```typescript
import type { InferRecord } from '@ybyra/core'

type PersonRecord = InferRecord<typeof PersonSchema>
// {
//   id: string
//   name: string
//   email: string
//   phone: string
//   birthDate: string
//   active: boolean
//   street: string
//   city: string
// }
```

The inferred types match each field factory's data type:

| Factory | Inferred Type |
|---------|---------------|
| `text()` | `string` |
| `number()` | `number` |
| `currency()` | `number` |
| `date()` | `string` |
| `datetime()` | `string` |
| `toggle()` | `boolean` |
| `checkbox()` | `boolean` |
| `select<V>()` | `V` |
| `file()` | `File` |
| `image()` | `File` |

## Type-Safe Events and Handlers

`SchemaDefinition.events()` and `SchemaDefinition.handlers()` validate field names and handler names against the schema:

```typescript
// TypeScript will catch typos
const events = PersonSchema.events({
  naem: { /* ... */ },  // ❌ Error: 'naem' is not a field in PersonSchema
})
```

## Using with Services

The inferred type works with `ServiceContract`:

```typescript
type PersonRecord = InferRecord<typeof PersonSchema>

const personService: ServiceContract<PersonRecord> = {
  async create(data: Partial<PersonRecord>) { /* ... */ },
  async read(id: string) { /* ... */ },
  async update(id: string, data: Partial<PersonRecord>) { /* ... */ },
  async destroy(id: string) { /* ... */ },
  async paginate(params) { /* ... */ },
}
```

## extend, pick, omit

Type inference is preserved through schema transformations:

```typescript
const EmployeeSchema = PersonSchema.extend('employee', {
  fields: { department: text(), salary: currency() },
})

type EmployeeRecord = InferRecord<typeof EmployeeSchema>
// PersonRecord & { department: string; salary: number }

type NameOnly = InferRecord<ReturnType<typeof PersonSchema.pick<'name' | 'email'>>>
// { name: string; email: string }
```
