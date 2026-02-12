import { vi } from 'vitest'
import { createElement } from 'react'

vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: any) => createElement('div', null, children),
  Routes: ({ children }: any) => createElement('div', null, children),
  Route: () => createElement('div'),
  Navigate: () => createElement('div'),
  useNavigate: vi.fn(() => vi.fn()),
  useParams: vi.fn(() => ({ id: '1' })),
}))

vi.mock('@ybyra/react-web', () => ({
  DataForm: () => createElement('div', { 'data-testid': 'DataForm' }),
  DataTable: () => createElement('div', { 'data-testid': 'DataTable' }),
  DataPage: ({ children }: any) => createElement('div', { 'data-testid': 'DataPage' }, children),
  useComponent: vi.fn(() => ({
    scope: 'index',
    scopes: {},
    navigator: {},
    dialog: {},
    toast: {},
    loading: {},
    reload: vi.fn(),
  })),
  withProviders: (Component: any) => Component,
  defaultTheme: {},
  configureI18n: vi.fn(() => ({ t: (k: string) => k, language: 'pt-BR' })),
  configureIcons: vi.fn(),
  resolveActionIcon: vi.fn(),
  resolveGroupIcon: vi.fn(),
}))

vi.mock('@ybyra/persistence/web', () => ({
  createWebDriver: vi.fn(() => ({
    initialize: vi.fn(),
    create: vi.fn(),
    read: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
    search: vi.fn(),
  })),
}))

vi.mock('sonner', () => ({
  Toaster: () => createElement('div'),
}))
