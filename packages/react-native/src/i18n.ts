import i18n, { type Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'

interface I18nOptions {
  resources: Resource
  default: string
  fallback: string
}

export function configureI18n(options: I18nOptions) {
  i18n.use(initReactI18next).init({
    resources: options.resources,
    lng: options.default,
    fallbackLng: options.fallback,
    interpolation: { escapeValue: false },
    keySeparator: '.',
  })
  return i18n
}
