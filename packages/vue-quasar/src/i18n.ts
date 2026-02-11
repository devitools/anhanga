import { createI18n, type LocaleMessages, type VueMessageType } from 'vue-i18n'

interface I18nOptions {
  locale: string
  fallback?: string
  messages: LocaleMessages<VueMessageType>
}

export function configureI18n (options: I18nOptions) {
  return createI18n({
    legacy: false,
    locale: options.locale,
    fallbackLocale: options.fallback ?? options.locale,
    messages: options.messages as never,
  })
}
