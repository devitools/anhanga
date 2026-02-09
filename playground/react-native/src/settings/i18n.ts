import { ptBR } from '@anhanga/demo'
import { createI18n } from '@anhanga/react-native'

export default createI18n({
  resources: {
    'pt-BR': { translation: ptBR },
  },
  default: 'pt-BR',
  fallback: 'pt-BR',
})
