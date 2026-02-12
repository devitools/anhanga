---
mode: 'agent'
description: 'Create a complete CRUD domain for a Ybyra entity — schema, events, handlers, hooks, service, pages, i18n, and routes'
---

# New CRUD Domain

Create a complete CRUD for a new entity in this Ybyra project.

## Instructions

1. Read the [Core Concepts](https://devitools.github.io/ybyra/guide/schema-definition) to understand conventions
2. Use the `create-domain` skill to generate schema, events, handlers, hooks
3. Use the `create-service` skill to generate the service layer
4. Use the `create-pages` skill to generate pages and routes for the target framework
5. Use the `add-i18n` skill to generate translation keys

## Required Information

Ask the user for:

- **Entity name** (e.g., "product", "order", "customer")
- **Fields** with types (e.g., "name: text, price: currency, active: toggle")
- **Target framework** (React Web, React Native, Vue/Quasar, SvelteKit)
- **Custom actions** beyond standard CRUD (optional)

## File Structure to Generate

```
src/domain/{entity}/
  schema.ts
  events.ts
  handlers.ts
  hooks.ts
  index.ts
src/application/{entity}/
  {entity}Service.ts
src/pages/{entity}/          (or src/routes/{entity}/ for SvelteKit)
  List page
  Add page
  View page
  Edit page
  @routes.ts
locales/
  pt-BR.ts (update)
```

## Checklist

- [ ] Schema with fields, groups, and actions
- [ ] Events for field interactions
- [ ] Handlers with createDefault + custom actions
- [ ] Hooks with createDefault
- [ ] Service with createService + custom methods
- [ ] Pages for all 4 scopes (index, add, view, edit)
- [ ] Routes file
- [ ] i18n translations
- [ ] Router registration (except SvelteKit)
- [ ] Setup file wiring (service → handlers → hooks)
