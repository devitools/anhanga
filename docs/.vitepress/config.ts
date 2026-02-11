import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Anhanga',
  description: 'Schema-driven UI for management systems — React, Vue & Svelte',
  base: '/anhanga/',

  appearance: 'dark',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  themeConfig: {
    search: {
      provider: 'local',
    },

    nav: [
      { text: 'Guide', link: '/guide/introduction', activeMatch: '/guide/' },
      {
        text: 'Frameworks',
        activeMatch: '/react/|/react-native/|/vue/|/svelte/',
        items: [
          { text: 'React + Shadcn', link: '/react/overview' },
          { text: 'React Native', link: '/react-native/overview' },
          { text: 'Vue + Quasar', link: '/vue/overview' },
          { text: 'Svelte + SvelteKit', link: '/svelte/overview' },
        ],
      },
      { text: 'Advanced', link: '/advanced/lifecycle-hooks', activeMatch: '/advanced/' },
      { text: 'API', link: '/api/core', activeMatch: '/api/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Schema Definition', link: '/guide/schema-definition' },
            { text: 'Field Types', link: '/guide/field-types' },
            { text: 'Actions', link: '/guide/actions' },
            { text: 'Groups', link: '/guide/groups' },
            { text: 'Scopes', link: '/guide/scopes' },
          ],
        },
        {
          text: 'Features',
          items: [
            { text: 'Events & Proxy', link: '/guide/events-and-proxy' },
            { text: 'Validation', link: '/guide/validation' },
            { text: 'Type Inference', link: '/guide/type-inference' },
            { text: 'i18n', link: '/guide/i18n' },
          ],
        },
      ],
      '/react/': [
        {
          text: 'React Integration',
          items: [
            { text: 'Overview', link: '/react/overview' },
            { text: 'Screens', link: '/react/screens' },
            { text: 'useDataForm', link: '/react/use-data-form' },
            { text: 'useDataTable', link: '/react/use-data-table' },
            { text: 'Renderer Registry', link: '/react/renderer-registry' },
            { text: 'Testing', link: '/react/testing' },
          ],
        },
      ],
      '/react-native/': [
        {
          text: 'React Native',
          items: [
            { text: 'Overview', link: '/react-native/overview' },
            { text: 'Installation', link: '/react-native/installation' },
            { text: 'Domain Layer', link: '/react-native/domain' },
            { text: 'i18n', link: '/react-native/i18n' },
            { text: 'Screens', link: '/react-native/screens' },
            { text: 'Testing', link: '/react-native/testing' },
          ],
        },
      ],
      '/vue/': [
        {
          text: 'Vue Integration',
          items: [
            { text: 'Overview', link: '/vue/overview' },
            { text: 'Screens', link: '/vue/screens' },
            { text: 'useDataForm', link: '/vue/use-data-form' },
            { text: 'useDataTable', link: '/vue/use-data-table' },
            { text: 'Renderer Registry', link: '/vue/renderer-registry' },
            { text: 'Testing', link: '/vue/testing' },
          ],
        },
      ],
      '/svelte/': [
        {
          text: 'Svelte Integration',
          items: [
            { text: 'Overview', link: '/svelte/overview' },
            { text: 'Screens', link: '/svelte/screens' },
            { text: 'Testing', link: '/svelte/testing' },
          ],
        },
      ],
      '/advanced/': [
        {
          text: 'Advanced',
          items: [
            { text: 'Lifecycle Hooks', link: '/advanced/lifecycle-hooks' },
            { text: 'Persistence', link: '/advanced/persistence' },
            { text: 'Custom Validators', link: '/advanced/custom-validators' },
            { text: 'Architecture Patterns', link: '/advanced/architecture-patterns' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: '@anhanga/core', link: '/api/core' },
            { text: '@anhanga/react', link: '/api/react' },
            { text: '@anhanga/vue', link: '/api/vue' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/devitools/anhanga' },
    ],

    editLink: {
      pattern: 'https://github.com/devitools/anhanga/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Devitools',
    },
  },
})
