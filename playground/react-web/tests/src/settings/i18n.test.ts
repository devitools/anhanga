import { describe, it, expect } from 'vitest'
import i18n from '../../../src/settings/i18n'

describe('i18n', () => {
  it('is initialized with pt-BR as default language', () => {
    expect(i18n.language).toBe('pt-BR')
  })

  it('has pt-BR resource bundle', () => {
    expect(i18n.hasResourceBundle('pt-BR', 'translation')).toBe(true)
  })

  it('resolves common translations', () => {
    expect(i18n.t('common.actions.add')).not.toBe('common.actions.add')
  })

  it('resolves person field translations', () => {
    expect(i18n.t('person.fields.name')).toBe('Nome')
  })
})
