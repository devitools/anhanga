# Groups

Groups organize related fields into visual sections within a form.

## Defining Groups

```typescript
import { group, Icon } from '@ybyra/core'

const PersonSchema = schema.create('person', {
  groups: {
    basic: group().icon(Icon.Person),
    address: group().icon(Icon.Map),
  },
  fields: {
    name: text().group('basic'),
    email: text().group('basic'),
    street: text().group('address'),
    city: text().group('address'),
  },
})
```

## Methods

| Method | Description |
|--------|-------------|
| `.icon(icon)` | Set the group's icon |

## Assigning Fields to Groups

Use `.group(name)` on any field to assign it:

```typescript
text().group('basic')
number().group('financial')
date().group('dates')
```

The group name must match a key in the `groups` object of your schema.

## Ungrouped Fields

Fields without a `.group()` assignment are collected as "ungrouped". The `useDataForm` hook/composable provides both grouped and ungrouped fields:

```typescript
const form = useDataForm({ /* ... */ })

form.groups    // FieldGroup[] — groups with their fields
form.ungrouped // ResolvedField[] — fields without a group
form.sections  // FormSection[] — interleaved groups and ungrouped fields
```

## Sections

The `sections` array provides an ordered view that interleaves groups and ungrouped fields:

```typescript
form.sections.map((section) => {
  if (section.kind === 'group') {
    // section.name, section.config, section.fields
    return <FieldGroup key={section.name} {...section} />
  }
  // section.kind === 'ungrouped'
  // section.fields
  return <UngroupedFields key="ungrouped" fields={section.fields} />
})
```

## Group Labels

Group labels are resolved via i18n using the `{domain}.groups.{group}` convention:

```
person.groups.basic    → "Basic Information"
person.groups.address  → "Address"
```

See [i18n](/guide/i18n) for details.
