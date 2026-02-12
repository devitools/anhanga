---
mode: 'agent'
description: 'Add a new field to an existing Ybyra domain schema with type, validation, i18n, and optional events'
---

# Add Field

Add a new field to an existing entity in this Ybyra project.

## Instructions

1. Read `ai-friendly/rules/03-field-types.md` for available types and methods
2. Use the `add-field` skill for the step-by-step process

## Required Information

Ask the user for:
- **Entity name** (which schema to modify)
- **Field name** (camelCase)
- **Field type** (text, number, date, toggle, select, currency, file, checkbox, datetime)
- **Configuration** (width, required, column, group, kind, etc.)

## Checklist

- [ ] Add field to schema fields object
- [ ] Add i18n key in locale file(s)
- [ ] Add group if needed
- [ ] Add events if the field needs reactive behavior
