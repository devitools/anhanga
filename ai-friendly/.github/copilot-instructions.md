# Ybyra — Copilot Instructions

This project uses the **Ybyra** framework — a schema-driven form/table system for TypeScript.

## AI-Friendly Documentation

All conventions, skills, and examples are in the `ai-friendly/` folder:

- `ai-friendly/rules/` — Architecture, conventions, and API reference
- `ai-friendly/skills/` — Task-oriented generation guides with real code examples
- `ai-friendly/frameworks/` — Framework-specific guides (React Web, React Native, Vue/Quasar, SvelteKit)
- `ai-friendly/examples/` — Complete person domain examples
- `ai-friendly/prompts/` — Prompt templates for common tasks

## Key Conventions

- **Field factories are direct imports**: `text()`, `date()`, `toggle()` — never `field.text()`
- **No labels in code** — i18n resolves via `{domain}.{field}` pattern
- **Object literals** for fields, groups, and actions
- **`configure()`** → `SchemaFactory` → `schema.create(domain, { fields, groups, actions })`
- **Separation of concerns**: `schema.ts` (structure), `events.ts` (reactions), `handlers.ts` (actions), `hooks.ts` (lifecycle)
- **Factory pattern**: `create{Domain}Handlers(service)`, `create{Domain}Hooks(service)`, `create{Domain}Service(driver)`
- **`null` removes** inherited actions, **`.hidden()` hides** them

## Before Working

1. Read the relevant rules in `ai-friendly/rules/`
2. Check the framework guide in `ai-friendly/frameworks/` for platform-specific patterns
3. Use skills in `ai-friendly/skills/` for step-by-step generation
