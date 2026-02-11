import { createI18n, type LocaleMessages, type VueMessageType } from 'vue-i18n'

interface I18nOptions {
  locale: string
  fallback?: string
  messages: LocaleMessages<VueMessageType>
}

function resolveValue (obj: unknown, path: string): string | undefined {
  const parts = path.split('.')
  let current = obj
  for (let i = 0; i < parts.length; i++) {
    if (current == null || typeof current !== 'object') return undefined
    const record = current as Record<string, unknown>
    const remaining = parts.slice(i).join('.')
    if (remaining in record && typeof record[remaining] === 'string') {
      return record[remaining] as string
    }
    current = record[parts[i]]
  }
  return typeof current === 'string' ? current : undefined
}

export function configureI18n (options: I18nOptions) {
  return createI18n({
    legacy: false,
    locale: options.locale,
    fallbackLocale: options.fallback ?? options.locale,
    messages: options.messages as never,
    messageResolver: (obj, path) => resolveValue(obj, path) ?? null,
  })
}
