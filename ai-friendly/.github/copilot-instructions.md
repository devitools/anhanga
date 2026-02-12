# Ybyra — Copilot Instructions

This project uses the **Ybyra** framework — a schema-driven form/table system for TypeScript.

## Documentation

Full documentation is available at [devitools.github.io/ybyra](https://devitools.github.io/ybyra/).

- [Core Concepts](https://devitools.github.io/ybyra/guide/schema-definition) — Architecture, conventions, and API
  reference
- [React Web](https://devitools.github.io/ybyra/react/overview) — React web-specific guide
- [Vue + Quasar](https://devitools.github.io/ybyra/vue/overview) — Vue/Quasar-specific guide
- [SvelteKit](https://devitools.github.io/ybyra/svelte/overview) — SvelteKit-specific guide
- [React Native](https://devitools.github.io/ybyra/react-native/overview) — React Native-specific guide

## Key Conventions

- **Field factories are direct imports**: `text()`, `date()`, `toggle()` — never `field.text()`
- **No labels in code** — i18n resolves via `{domain}.{field}` pattern
- **Object literals** for fields, groups, and actions
- **`configure()`** → `SchemaFactory` → `schema.create(domain, { fields, groups, actions })`
- **Separation of concerns**: `schema.ts` (structure), `events.ts` (reactions), `handlers.ts` (actions), `hooks.ts` (
  lifecycle)
- **Factory pattern**: `create{Domain}Handlers(service)`, `create{Domain}Hooks(service)`,
  `create{Domain}Service(driver)`
- **`null` removes** inherited actions, **`.hidden()` hides** them

## Before Working

1. Read the relevant [Core Concepts](https://devitools.github.io/ybyra/guide/schema-definition) documentation
2. Check the framework-specific guide for platform patterns
3. Follow the conventions and patterns described above
