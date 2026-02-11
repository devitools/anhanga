import { resolve } from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    svelte(),
    dts({ rollupTypes: true }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'svelte',
        /^svelte\//,
        '@anhanga/core',
        '@anhanga/svelte',
      ],
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
})
