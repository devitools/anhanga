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
            { text: 'Installation', link: '/react/installation' },
            { text: 'Domain Layer', link: '/react/domain' },
            { text: 'i18n', link: '/react/i18n' },
            { text: 'Screens', link: '/react/screens' },
            { text: 'Testing', link: '/react/testing' },
          ],
        },
        {
          text: 'Customization',
          items: [
            { text: 'Overview', link: '/react/customization' },
            { text: 'useDataForm', link: '/react/use-data-form' },
            { text: 'useDataTable', link: '/react/use-data-table' },
            { text: 'Renderer Registry', link: '/react/renderer-registry' },
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
        {
          text: 'Customization',
          items: [
            { text: 'Overview', link: '/react-native/customization' },
            { text: 'useDataForm', link: '/react-native/use-data-form' },
            { text: 'useDataTable', link: '/react-native/use-data-table' },
            { text: 'Renderer Registry', link: '/react-native/renderer-registry' },
          ],
        },
      ],
      '/vue/': [
        {
          text: 'Vue Integration',
          items: [
            { text: 'Overview', link: '/vue/overview' },
            { text: 'Installation', link: '/vue/installation' },
            { text: 'Domain Layer', link: '/vue/domain' },
            { text: 'i18n', link: '/vue/i18n' },
            { text: 'Screens', link: '/vue/screens' },
            { text: 'Testing', link: '/vue/testing' },
          ],
        },
        {
          text: 'Customization',
          items: [
            { text: 'Overview', link: '/vue/customization' },
            { text: 'useDataForm', link: '/vue/use-data-form' },
            { text: 'useDataTable', link: '/vue/use-data-table' },
            { text: 'Renderer Registry', link: '/vue/renderer-registry' },
          ],
        },
      ],
      '/svelte/': [
        {
          text: 'Svelte Integration',
          items: [
            { text: 'Overview', link: '/svelte/overview' },
            { text: 'Installation', link: '/svelte/installation' },
            { text: 'Domain Layer', link: '/svelte/domain' },
            { text: 'i18n', link: '/svelte/i18n' },
            { text: 'Screens', link: '/svelte/screens' },
            { text: 'Testing', link: '/svelte/testing' },
          ],
        },
        {
          text: 'Customization',
          items: [
            { text: 'Overview', link: '/svelte/customization' },
            { text: 'useDataForm', link: '/svelte/use-data-form' },
            { text: 'useDataTable', link: '/svelte/use-data-table' },
            { text: 'Renderer Registry', link: '/svelte/renderer-registry' },
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
