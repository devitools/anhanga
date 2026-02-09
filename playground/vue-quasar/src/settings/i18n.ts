import { createI18n } from 'vue-i18n'
import { ptBR } from '@anhanga/demo'

export const i18n = createI18n({
  legacy: false,
  locale: 'pt-BR',
  fallbackLocale: 'pt-BR',
  messages: {
    'pt-BR': ptBR as Record<string, unknown>,
  },
})
