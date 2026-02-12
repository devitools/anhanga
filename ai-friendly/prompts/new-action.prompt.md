---
mode: 'agent'
description: 'Add a custom action to an existing Ybyra domain with handler, variant, positioning, and i18n'
---

# Add Action

Add a new action button to an existing entity in this Ybyra project.

## Instructions

1. Read `ai-friendly/rules/05-handlers.md` for handler patterns
2. Use the `add-action` skill for the step-by-step process

## Required Information

Ask the user for:
- **Entity name** (which schema to modify)
- **Action name** (camelCase)
- **Variant** (primary, destructive, warning, info, success)
- **Position** (header, footer, floating)
- **Scopes** (which views show this action)
- **Behavior** (what the action does)

## Checklist

- [ ] Add action definition to schema
- [ ] Add handler implementation
- [ ] Add i18n key (`@actionName`)
- [ ] Add service method if needed
