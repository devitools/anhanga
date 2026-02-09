import { vi } from 'vitest'

export const useTranslation = vi.fn(() => ({
  t: (key: string) => key,
  i18n: { language: 'pt-BR' },
}))

export const initReactI18next = {
  type: 'i18nextModule' as const,
  init: vi.fn(),
}
