import { configureI18n } from '@ybyra/sveltekit'
import { translate, hasTranslation } from './i18n'

configureI18n({ translate, hasTranslation })
