import { describe, it, expect } from 'vitest'
import { translate, hasTranslation } from '../../../src/lib/settings/i18n'

describe('i18n', () => {
  it('resolves known common translations', () => {
    expect(translate('common.actions.add')).not.toBe('common.actions.add')
  })

  it('resolves person field translations', () => {
    expect(translate('person.fields.name')).toBe('Nome')
  })

  it('returns key for unknown translations', () => {
    expect(translate('unknown.key.here')).toBe('unknown.key.here')
  })

  it('hasTranslation returns true for known keys', () => {
    expect(hasTranslation('person.fields.name')).toBe(true)
  })

  it('hasTranslation returns false for unknown keys', () => {
    expect(hasTranslation('unknown.key.here')).toBe(false)
  })
})
