# Suggested Commands

## Build
- `pnpm build` — Build all packages
- `pnpm --filter @anhanga/core build` — Build core only

## Test
- `pnpm --filter @anhanga/core test` — Run core tests (38 tests, reliable)
- `pnpm --filter @anhanga/playground-react-web test` — React web playground tests (reliable)
- `pnpm --filter @anhanga/playground-vue-quasar test` — Vue Quasar playground tests (reliable)
- Note: sveltekit and react-native playground route tests have pre-existing module resolution failures

## Dev
- `pnpm --filter @anhanga/playground-web dev` — React web playground dev server
- `pnpm --filter @anhanga/playground start` — React Native playground dev server
- `pnpm docs:dev` — Docs dev server
