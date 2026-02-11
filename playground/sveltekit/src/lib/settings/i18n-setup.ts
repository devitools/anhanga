import { configureI18n } from '@anhanga/sveltekit'
import { translate, hasTranslation } from './i18n'

configureI18n({ translate, hasTranslation })
