# Publishing Guide

This guide covers how to version, publish, and consume the `@ybyra/*` packages.

## Prerequisites

### 1. npm account and organization

- Create an account at [npmjs.com](https://www.npmjs.com/signup) if you don't have one
- You must be a member of the **[@ybyra](https://www.npmjs.com/org/ybyra)** organization
- Log in locally:

```bash
npm login
```

### 2. Install dependencies

```bash
pnpm install
```

---

## Published Packages

These are the packages that will be published to npm:

| Package | Description |
|---------|-------------|
| `@ybyra/core` | Schema definition, field types, actions, groups, type system |
| `@ybyra/react` | `useDataForm` / `useDataTable` hooks, validation, proxy |
| `@ybyra/vue` | `useDataForm` / `useDataTable` composables for Vue |
| `@ybyra/svelte` | `useDataForm` / `useDataTable` stores for Svelte |
| `@ybyra/react-web` | Field renderers for React web apps |
| `@ybyra/react-native` | Field renderers for React Native apps |
| `@ybyra/vue-quasar` | Field renderers for Vue + Quasar |
| `@ybyra/sveltekit` | Field renderers for SvelteKit |
| `@ybyra/persistence` | Local and web persistence drivers |

> `@ybyra/demo` and all `@ybyra/playground-*` packages are **private** and won't be published.

---

## How It Works

This project uses [changesets](https://github.com/changesets/changesets) to manage versioning and publishing across the monorepo.

The workflow is:

```
Make changes → Create changeset → Version packages → Publish to npm
```

### Step 1: Make your changes

Develop normally. Commit your code.

### Step 2: Create a changeset

After making changes that should be released, run:

```bash
pnpm changeset
```

You'll be prompted to:

1. **Select packages** — choose which packages were affected by your changes
2. **Choose bump type** — `patch`, `minor`, or `major` for each package
3. **Write a summary** — a short description of the change (this goes into the CHANGELOG)

This creates a markdown file in `.changeset/` describing the change. **Commit this file** along with your code.

#### Example

```
🦋  Which packages would you like to include? · @ybyra/core, @ybyra/react
🦋  Which packages should have a major bump? · No packages
🦋  Which packages should have a minor bump? · @ybyra/core
🦋  Summary · Added new CurrencyFieldDefinition with prefix and precision support
```

This means `@ybyra/core` will get a minor bump (0.0.1 → 0.1.0) and `@ybyra/react` will get a patch bump (because it depends on core).

#### Tips

- You can create **multiple changesets** before releasing — they'll all be applied together
- Each changeset is a small markdown file, easy to review in PRs
- Internal dependencies (`workspace:*`) are automatically updated by changesets

### Step 3: Version packages

When you're ready to release, apply all pending changesets:

```bash
pnpm version-packages
```

This will:
- Bump versions in all affected `package.json` files
- Update `CHANGELOG.md` for each package
- Remove the consumed changeset files from `.changeset/`

**Review the changes** and commit them:

```bash
git add .
git commit -m "chore: version packages"
```

### Step 4: Publish to npm

```bash
pnpm release
```

This runs `pnpm build && changeset publish`, which:
1. Builds all packages (generates `dist/`)
2. Publishes each changed package to npm
3. Creates git tags for each published version

After publishing, push the tags:

```bash
git push --follow-tags
```

---

## Consuming the Packages

### Installation

```bash
# React
pnpm add @ybyra/core @ybyra/react @ybyra/react-web

# Vue + Quasar
pnpm add @ybyra/core @ybyra/vue @ybyra/vue-quasar

# SvelteKit
pnpm add @ybyra/core @ybyra/svelte @ybyra/sveltekit

# React Native
pnpm add @ybyra/core @ybyra/react @ybyra/react-native

# Persistence (optional)
pnpm add @ybyra/persistence
```

### Basic usage

```typescript
import { schema, text, Text, date, toggle } from '@ybyra/core'
import { useDataForm } from '@ybyra/react' // or @ybyra/vue or @ybyra/svelte

const PersonSchema = schema.create('person', {
  fields: {
    name: text().required().column(),
    email: text().kind(Text.Email).required().column(),
    birthDate: date(),
    active: toggle().default(true).column(),
  },
})
```

---

## Versioning Strategy

- **patch** (0.0.x) — bug fixes, documentation, internal changes
- **minor** (0.x.0) — new features, new field types, new API additions
- **major** (x.0.0) — breaking changes to the public API

### Dependency propagation

When `@ybyra/core` is bumped, all packages that depend on it (react, vue, svelte, etc.) will automatically get their dependency version updated. The `updateInternalDependencies: "patch"` setting in `.changeset/config.json` means dependents get at least a patch bump.

---

## Troubleshooting

### "You must be logged in to publish"

```bash
npm login
npm whoami  # verify you're logged in
```

### "402 Payment Required"

Scoped packages (`@ybyra/*`) are private by default on npm. All packages in this repo have `publishConfig.access: "public"` set, but if you see this error, check the package's `package.json`.

### "Changeset validation error about ignored packages"

If a new playground or private package is added that depends on an ignored package, add it to the `ignore` list in `.changeset/config.json`.

### Dry run

To see what would be published without actually publishing:

```bash
pnpm build
npx changeset publish --no-git-tag
# Or check with npm directly:
cd packages/core && npm pack --dry-run
```
