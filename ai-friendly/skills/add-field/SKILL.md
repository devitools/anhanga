---
name: add-field
description: Adds a new field to an existing Ybyra schema with proper type, configuration, i18n keys, and event wiring.
---

# Skill: Add Field

Add a new field to an existing Ybyra domain schema.

## Steps

### 1. Add Field to Schema (`schema.ts`)

Choose the right factory function and chain configuration methods:

```typescript
fields: {
  // ... existing fields
  newField: text().width(50).required().column().group("basic"),
}
```

### Field Type Reference

| Type | Factory | Specific Methods |
|------|---------|-----------------|
| Text | `text()` | `.kind(Text.Email\|Phone\|Url\|...)`, `.minLength(n)`, `.maxLength(n)`, `.pattern(regex)` |
| Number | `number()` | `.min(n)`, `.max(n)`, `.precision(n)` |
| Date | `date()` | `.min(date)`, `.max(date)` |
| Datetime | `datetime()` | `.min(date)`, `.max(date)` |
| Currency | `currency()` | `.min(n)`, `.max(n)`, `.precision(n)`, `.prefix(str)` |
| Toggle | `toggle()` | — |
| Checkbox | `checkbox()` | — |
| Select | `select<V>()` | generic over value type |
| File | `file()` | `.accept(types)`, `.maxSize(bytes)` |

### Common Methods (all fields)

```
.width(n)           — percentage width (100 = full row)
.height(n)          — height in units
.default(value)     — initial value
.required()         — required validation
.hidden()           — hidden by default
.disabled()         — read-only by default
.column()           — show in table
.filterable()       — searchable in table
.group("name")      — visual group
.scopes(Scope.add)  — only in these scopes
.excludeScopes()    — hidden in these scopes
```

### 2. Add i18n Key

In locale file (e.g., `locales/pt-BR.ts`):

```typescript
{domain}: {
  // ... existing keys
  newField: "Label do Campo",
  "newField[placeholder]": "Digite...",  // optional
}
```

### 3. Add Events (optional, in `events.ts`)

```typescript
export const {domain}Events = {Domain}Schema.events({
  // ... existing events
  newField: {
    change({ state, schema }) {
      // React to field changes
    },
  },
});
```

### 4. Add Group (if new group needed, in `schema.ts`)

```typescript
groups: {
  // ... existing groups
  newGroup: group(),
},
```

And add i18n key: `"{domain}#newGroup": "Group Label"`
