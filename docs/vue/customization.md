# Customization

Anhanga's Vue integration ships with ready-to-use components via `@anhanga/vue-quasar`. Forms, tables, field renderers, and action buttons all work out of the box — **no customization required** to get a fully functional CRUD.

## When to Customize

You might want to customize when:

- **Branding** — your design system has specific input styles, spacing, or color tokens
- **Specialized inputs** — a rich text editor, color picker, or map widget that isn't built in
- **Different UI library** — you prefer Vuetify, Element Plus, or PrimeVue over Quasar
- **Custom layout** — you need a multi-step wizard, tabs, or a non-standard form layout
- **Business logic in the UI** — conditional rendering that goes beyond `hidden()` and `disabled()`

## Extension Points

Anhanga provides three main extension points, each covered in its own page:

| Extension | Purpose |
|-----------|---------|
| [useDataForm](./use-data-form) | Access the full form state — fields, values, errors, actions, groups, and sections — to build your own form component from scratch |
| [useDataTable](./use-data-table) | Access table state — columns, rows, pagination, and actions — to build a custom table component |
| [Renderer Registry](./renderer-registry) | Replace or add field renderers so each field type maps to your own component |

All three compose with the built-in behavior. You can override a single field renderer while keeping the rest, or build an entirely custom form layout while still using the same schema, events, and validation.

## Next Steps

If you're just getting started, the built-in components are the fastest path. Come back here when you need to go beyond what they offer.
