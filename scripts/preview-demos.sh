#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/docs/.vitepress/dist"
SERVE_DIR="/tmp/gh-pages-test"
PORT="${1:-8080}"

echo "Building packages..."
pnpm -r --filter './packages/*' build

echo ""
echo "Building playgrounds..."
VITE_BASE_URL=/anhanga/demo/react-web/ pnpm --filter @anhanga/playground-react-web build
VITE_BASE_URL=/anhanga/demo/vue-quasar/ pnpm --filter @anhanga/playground-vue-quasar build
SVELTE_BASE_URL=/anhanga/demo/sveltekit pnpm --filter @anhanga/playground-sveltekit build
EXPO_BASE_URL=/anhanga/demo/react-native pnpm --filter @anhanga/playground-react-native build:web

echo ""
echo "Building docs..."
pnpm docs:build

echo ""
echo "Assembling..."
mkdir -p "$DIST/demo"
cp -r "$ROOT/playground/react-web/dist" "$DIST/demo/react-web"
cp -r "$ROOT/playground/vue-quasar/dist" "$DIST/demo/vue-quasar"
cp -r "$ROOT/playground/sveltekit/build" "$DIST/demo/sveltekit"
cp -r "$ROOT/playground/react-native/dist" "$DIST/demo/react-native"
cp "$ROOT/docs/spa-redirect.html" "$DIST/404.html"

echo ""
echo "Preparing server directory..."
rm -rf "$SERVE_DIR/anhanga"
mkdir -p "$SERVE_DIR/anhanga"
cp -r "$DIST"/* "$SERVE_DIR/anhanga/"

echo ""
echo "Serving at http://localhost:$PORT/anhanga/"
echo ""
echo "  Docs:        http://localhost:$PORT/anhanga/"
echo "  React Web:   http://localhost:$PORT/anhanga/demo/react-web/"
echo "  Vue Quasar:  http://localhost:$PORT/anhanga/demo/vue-quasar/"
echo "  SvelteKit:   http://localhost:$PORT/anhanga/demo/sveltekit/"
echo "  React Native: http://localhost:$PORT/anhanga/demo/react-native/"
echo ""
echo "Press Ctrl+C to stop."
npx serve "$SERVE_DIR" -l "$PORT"
