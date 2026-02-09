import { createI18n } from 'vue-i18n'
import { ptBR } from '@anhanga/core'
import { ptBR as local } from './locales/pt-BR'

export const i18n = createI18n({
  legacy: false,
  locale: 'pt-BR',
  fallbackLocale: 'pt-BR',
  messages: {
    'pt-BR': { ...ptBR, ...local } as Record<string, unknown>,
  },
})
