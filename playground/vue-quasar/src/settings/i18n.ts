import { configureI18n } from '@ybyra/vue-quasar'
import { ptBR } from '@ybyra/core'
import { ptBR as local } from './locales/pt-BR'

export const i18n = configureI18n({
  locale: 'pt-BR',
  messages: {
    'pt-BR': { ...ptBR, ...local } as Record<string, unknown>,
  },
})
