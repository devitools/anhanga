import { describe, it, expect } from 'vitest'
import { resolveFieldLabel, resolveGroupLabel, resolveActionLabel } from './translate'
import type { TranslateContract } from '@ybyra/core'

function createTranslate(translations: Record<string, string>): TranslateContract {
  return (key: string) => translations[key] ?? key
}

describe('resolveFieldLabel', () => {
  it('returns state-specific translation when available', () => {
    const t = createTranslate({ 'person.fields.name[editing]': 'Name (editing)' })
    expect(resolveFieldLabel(t, 'person', 'name', 'editing')).toBe('Name (editing)')
  })

  it('falls back to base field key', () => {
    const t = createTranslate({ 'person.fields.name': 'Full Name' })
    expect(resolveFieldLabel(t, 'person', 'name', 'editing')).toBe('Full Name')
  })

  it('falls back to raw field name', () => {
    const t = createTranslate({})
    expect(resolveFieldLabel(t, 'person', 'name', 'editing')).toBe('name')
  })

  it('resolves base key when no state', () => {
    const t = createTranslate({ 'person.fields.name': 'Full Name' })
    expect(resolveFieldLabel(t, 'person', 'name', '')).toBe('Full Name')
  })
})

describe('resolveGroupLabel', () => {
  it('returns translation when key resolves', () => {
    const t = createTranslate({ 'person.groups.personal': 'Personal Info' })
    expect(resolveGroupLabel(t, 'person', 'personal')).toBe('Personal Info')
  })

  it('falls back to raw group name', () => {
    const t = createTranslate({})
    expect(resolveGroupLabel(t, 'person', 'personal')).toBe('personal')
  })
})

describe('resolveActionLabel', () => {
  it('returns domain-specific translation', () => {
    const t = createTranslate({ 'person.actions.save': 'Save Person' })
    expect(resolveActionLabel(t, 'person', 'save')).toBe('Save Person')
  })

  it('falls back to common action', () => {
    const t = createTranslate({ 'common.actions.save': 'Save' })
    expect(resolveActionLabel(t, 'person', 'save')).toBe('Save')
  })

  it('falls back to raw action name', () => {
    const t = createTranslate({})
    expect(resolveActionLabel(t, 'person', 'save')).toBe('save')
  })
})
