import { vi } from 'vitest'
import { createElement } from 'react'

vi.mock('@anhanga/react-native', () => ({
  DataForm: (props: any) => createElement('div', { 'data-testid': 'DataForm', ...props }),
  DataTable: (props: any) => createElement('div', { 'data-testid': 'DataTable', ...props }),
  Page: ({ children }: any) => createElement('div', { 'data-testid': 'Page' }, children),
  useComponent: vi.fn(() => ({ scope: 'index', scopes: {}, navigator: {}, dialog: {}, toast: {}, loading: {}, reload: vi.fn() })),
  withProviders: (Component: any) => Component,
  ThemeProvider: ({ children }: any) => children,
  DialogProvider: ({ children }: any) => children,
  defaultTheme: {
    colors: { background: '#F3F4F6', foreground: '#1F2937', card: '#FFFFFF', cardForeground: '#1F2937', primary: '#3B82F6', primaryForeground: '#FFFFFF', secondary: '#E5E7EB', secondaryForeground: '#1F2937', muted: '#F9FAFB', mutedForeground: '#9CA3AF', accent: '#8B5CF6', accentForeground: '#FFFFFF', destructive: '#EF4444', destructiveForeground: '#FFFFFF', success: '#10B981', successForeground: '#FFFFFF', warning: '#F59E0B', warningForeground: '#FFFFFF', info: '#3B82F6', infoForeground: '#FFFFFF', border: '#E5E7EB', input: '#E5E7EB', ring: '#3B82F6' },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 },
    borderRadius: { sm: 6, md: 8, lg: 10, xl: 12 },
    fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24 },
    fontWeight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
  },
  configureI18n: vi.fn(() => ({ t: (k: string) => k, language: 'pt-BR' })),
  configureIcons: vi.fn(),
  resolveActionIcon: vi.fn(),
  resolveGroupIcon: vi.fn(),
}))

vi.mock('@anhanga/persistence', () => ({
  createLocalDriver: vi.fn(() => ({
    initialize: vi.fn(),
    create: vi.fn(),
    read: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
    search: vi.fn(),
  })),
}))
