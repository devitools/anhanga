import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    paths: {
      base: process.env.SVELTE_BASE_URL || '',
    },
    adapter: adapter({
      fallback: 'index.html',
    }),
    alias: {
      '$lib': './src/lib',
    },
  },
}

export default config
