---
name: add-i18n
description: Generate or update internationalization (i18n) locale files for an Ybyra domain. Use when the user asks to add translations, create locale files, or update labels for a domain's fields, groups, and actions.
---

# Add i18n Translations

## When to Use
- User asks to create translations for a new domain
- User asks to add or update labels for fields, groups, or actions
- User asks to create a locale file

## Steps

1. **Identify the domain and fields** from the schema definition
2. **Create the locale file** at `settings/locales/pt-BR.ts` (or the target locale)
3. **Add entries** for every field, group, and custom action in the schema
4. **Register** the locale in the i18n setup file

## Locale Structure

Every domain locale must include:

```ts-no-check
export const ptBR = {
  {domain}: {
    title: "{Domain Title}",
    fields: {
      // One entry per field in the schema
      {fieldName}: "{Label}",
      "{fieldName}.placeholder": "{Placeholder text}",  // optional
    },
    groups: {
      // One entry per group in the schema
      {groupName}: "{Group Label}",
    },
    actions: {
      // Only custom actions (not standard CRUD)
      {actionName}: "{Action Label}",
    },
  },
};
```

## Rules
- Every field in the schema MUST have a label entry
- Placeholders are optional but recommended for text inputs
- Standard actions (add, view, edit, create, update, cancel, destroy) use `common.*` keys from `@ybyra/core`
- Only custom actions need domain-specific labels

## Reference
See `examples/pt-BR.ts` for a complete locale file.
