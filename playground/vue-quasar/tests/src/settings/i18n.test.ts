import { describe, it, expect } from 'vitest'
import { i18n } from '../../../src/settings/i18n'

describe('i18n', () => {
  it('is initialized with pt-BR as locale', () => {
    expect(i18n.global.locale.value).toBe('pt-BR')
  })

  it('resolves common translations', () => {
    expect(i18n.global.t('common.actions.add')).not.toBe('common.actions.add')
  })

  it('resolves person field translations', () => {
    expect(i18n.global.t('person.fields.name')).toBe('Nome')
  })
})
