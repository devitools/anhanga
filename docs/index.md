---
layout: home

hero:
  name: Anhanga
  text: Schema-driven forms for React
  tagline: Define your fields once, get type-safe forms, tables, validation, events, and actions — all from a single source of truth.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/introduction
    - theme: alt
      text: View on GitHub
      link: https://github.com/devitools/anhanga

features:
  - title: Type-Safe
    details: Full TypeScript inference — InferRecord extracts typed records directly from your schema definition.
  - title: Scoped Visibility
    details: Fields and actions appear or hide based on scope (index, add, view, edit) with whitelist and blacklist support.
  - title: Reactive Events
    details: Field changes can mutate other fields, toggle visibility, and set visual states through a proxy system.
  - title: i18n-Native
    details: Labels are never hardcoded. The translate function resolves keys following the {domain}.{field} convention.
  - title: Framework-Agnostic Core
    details: "@anhanga/core has zero dependencies. Define schemas once, bring your own UI framework."
  - title: Table Support
    details: useSchemaTable provides pagination, sorting, filtering, selection, and row actions out of the box.
---
