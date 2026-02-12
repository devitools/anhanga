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
VITE_BASE_URL=/ybyra/demo/react-web/ pnpm --filter @ybyra/playground-react-web build
VITE_BASE_URL=/ybyra/demo/vue-quasar/ pnpm --filter @ybyra/playground-vue-quasar build
SVELTE_BASE_URL=/ybyra/demo/sveltekit pnpm --filter @ybyra/playground-sveltekit build
EXPO_BASE_URL=/ybyra/demo/react-native pnpm --filter @ybyra/playground-react-native build:web

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
rm -rf "$SERVE_DIR/ybyra"
mkdir -p "$SERVE_DIR/ybyra"
cp -r "$DIST"/* "$SERVE_DIR/ybyra/"

echo ""
echo "Serving at http://localhost:$PORT/ybyra/"
echo ""
echo "  Docs:        http://localhost:$PORT/ybyra/"
echo "  React Web:   http://localhost:$PORT/ybyra/demo/react-web/"
echo "  Vue Quasar:  http://localhost:$PORT/ybyra/demo/vue-quasar/"
echo "  SvelteKit:   http://localhost:$PORT/ybyra/demo/sveltekit/"
echo "  React Native: http://localhost:$PORT/ybyra/demo/react-native/"
echo ""
echo "Press Ctrl+C to stop."
npx serve "$SERVE_DIR" -l "$PORT"
