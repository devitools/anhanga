type TranslateFn = (key: string, params?: Record<string, unknown>) => string
type HasTranslationFn = (key: string) => boolean

let _translate: TranslateFn = (key) => key
let _hasTranslation: HasTranslationFn = () => false

export function configureI18n (options: { translate: TranslateFn; hasTranslation: HasTranslationFn }) {
  _translate = options.translate
  _hasTranslation = options.hasTranslation
}

export function translate (key: string, params?: Record<string, unknown>): string {
  return _translate(key, params)
}

export function hasTranslation (key: string): boolean {
  return _hasTranslation(key)
}
