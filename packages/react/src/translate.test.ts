import { describe, it, expect } from 'vitest'
import { resolveFieldLabel, resolveGroupLabel, resolveActionLabel } from './translate'
import type { TranslateContract } from '@ybyra/core'

/**
 * Creates a mock translate function that returns translations from a map.
 * Returns the key itself when no translation exists — matching the i18n convention
 * that the resolve functions check against (`result !== key`).
 */
function createTranslate(translations: Record<string, string>): TranslateContract {
  return (key: string) => translations[key] ?? key
}

describe('resolveFieldLabel', () => {
  it('returns state-specific translation when available', () => {
    const t = createTranslate({
      'person.fields.name[editing]': 'Name (editing)',
    })
    const result = resolveFieldLabel(t, 'person', 'name', 'editing')
    expect(result).toBe('Name (editing)')
  })

  it('falls back to base field key when state translation equals key', () => {
    const t = createTranslate({
      'person.fields.name': 'Full Name',
      // No state-specific translation — key returns itself
    })
    const result = resolveFieldLabel(t, 'person', 'name', 'editing')
    expect(result).toBe('Full Name')
  })

  it('falls back to raw field name when base translation equals key', () => {
    const t = createTranslate({
      // No translations at all — both keys return themselves
    })
    const result = resolveFieldLabel(t, 'person', 'name', 'editing')
    expect(result).toBe('name')
  })

  it('resolves base key when no state is provided', () => {
    const t = createTranslate({
      'person.fields.name': 'Full Name',
    })
    // Empty string state skips state lookup
    const result = resolveFieldLabel(t, 'person', 'name', '')
    expect(result).toBe('Full Name')
  })

  it('uses empty string state to skip state lookup', () => {
    const t = createTranslate({
      'person.fields.name[]': 'Should not be found',
      'person.fields.name': 'Full Name',
    })
    const result = resolveFieldLabel(t, 'person', 'name', '')
    // Empty state is falsy, so state lookup is skipped entirely
    expect(result).toBe('Full Name')
  })
})

describe('resolveGroupLabel', () => {
  it('returns translation when key resolves', () => {
    const t = createTranslate({
      'person.groups.personal': 'Personal Info',
    })
    const result = resolveGroupLabel(t, 'person', 'personal')
    expect(result).toBe('Personal Info')
  })

  it('falls back to raw group name when translation equals key', () => {
    const t = createTranslate({})
    const result = resolveGroupLabel(t, 'person', 'personal')
    expect(result).toBe('personal')
  })
})

describe('resolveActionLabel', () => {
  it('returns domain-specific translation when available', () => {
    const t = createTranslate({
      'person.actions.save': 'Save Person',
    })
    const result = resolveActionLabel(t, 'person', 'save')
    expect(result).toBe('Save Person')
  })

  it('falls back to common.actions.{name} when domain key equals key', () => {
    const t = createTranslate({
      // No domain-specific translation
      'common.actions.save': 'Save',
    })
    const result = resolveActionLabel(t, 'person', 'save')
    expect(result).toBe('Save')
  })

  it('falls back to raw action name when both keys equal key', () => {
    const t = createTranslate({
      // No translations at all
    })
    const result = resolveActionLabel(t, 'person', 'save')
    expect(result).toBe('save')
  })
})
