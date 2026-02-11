import { vi } from 'vitest'

interface PageMocksOptions {
  route?: {
    params?: Record<string, string>
    path?: string
  }
  te?: (key: string) => boolean
}

export function createPageMocks(options?: PageMocksOptions) {
  const params = options?.route?.params ?? {}
  const path = options?.route?.path ?? '/'
  const te = options?.te ?? (() => true)

  vi.mock('vue-router', () => ({
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      back: vi.fn(),
      replace: vi.fn(),
    })),
    useRoute: vi.fn(() => ({
      params,
      path,
    })),
    createRouter: vi.fn(() => ({
      push: vi.fn(),
      back: vi.fn(),
      replace: vi.fn(),
      install: vi.fn(),
    })),
    createWebHistory: vi.fn(),
  }))

  vi.mock('vue-i18n', () => ({
    useI18n: vi.fn(() => ({
      t: (key: string) => key,
      te,
    })),
    createI18n: vi.fn(() => ({
      global: { t: (key: string) => key, te: () => true },
      install: vi.fn(),
    })),
  }))

  vi.mock('quasar', () => ({
    Notify: { create: vi.fn() },
    Dialog: { create: vi.fn(() => ({ onOk: vi.fn(() => ({ onCancel: vi.fn(() => ({ onDismiss: vi.fn() })) })) })) },
    Loading: { show: vi.fn(), hide: vi.fn() },
    QCard: { name: 'QCard', template: '<div><slot /></div>' },
    QCardSection: { name: 'QCardSection', template: '<div><slot /></div>' },
    QLayout: { name: 'QLayout', template: '<div><slot /></div>' },
    QPageContainer: { name: 'QPageContainer', template: '<div><slot /></div>' },
  }))

  vi.mock('@anhanga/vue-quasar', () => ({
    DataForm: { name: 'DataForm', template: '<div><slot /></div>' },
    DataTable: { name: 'DataTable', template: '<div><slot /></div>' },
    DataPage: { name: 'DataPage', template: '<div><slot /></div>' },
    useComponent: vi.fn(() => ({
      scope: 'index',
      scopes: {},
      reload: vi.fn(),
      navigator: { push: vi.fn(), back: vi.fn(), replace: vi.fn() },
      dialog: { confirm: vi.fn(), alert: vi.fn() },
      toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
      loading: { show: vi.fn(), hide: vi.fn() },
    })),
    configureI18n: vi.fn(() => ({
      global: { t: (key: string) => key, te: () => true },
      install: vi.fn(),
    })),
    configureIcons: vi.fn(),
    resolveActionIcon: vi.fn(),
    resolveGroupIcon: vi.fn(),
  }))
}
