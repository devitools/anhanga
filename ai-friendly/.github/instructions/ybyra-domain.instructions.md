---
applyTo: "**/domain/**/*.ts"
---

# Ybyra Domain Layer Conventions

When editing files in `domain/` directories, follow these rules:

## Schema (`schema.ts`)

- Use `schema.create(domain, { groups, fields, actions })` from settings
- Fields are factory imports: `text()`, `date()`, `number()`, `toggle()`, `select()`, `currency()`, `file()`
- Chain: `.width()`, `.required()`, `.column()`, `.filterable()`, `.group()`, `.default()`, `.scopes()`, `.kind()`
- Groups use `group()` factory
- Actions use `action()` factory with `.order()`, `.variant()`, `.positions()`, `.scopes()`

## Events (`events.ts`)

- Export as `{domain}Events = {Domain}Schema.events({ ... })`
- `state` proxy tracks mutations; `schema` proxy overrides field properties
- Available: `change`, `blur`, `focus`

## Handlers (`handlers.ts`)

- Export factory: `create{Domain}Handlers(service: ServiceContract)`
- Always spread `createDefault(service)` for CRUD
- Handler names must match action names

## Hooks (`hooks.ts`)

- Export factory: `create{Domain}Hooks(service: ServiceContract)`
- Use `createDefault(service)` for bootstrap/fetch

## Reference

See the [Core Concepts](https://devitools.github.io/ybyra/guide/schema-definition)
