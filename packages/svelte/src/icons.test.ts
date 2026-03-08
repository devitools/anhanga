import { describe, it, expect, beforeEach } from 'vitest'
import { configureIcons, resolveActionIcon, resolveGroupIcon } from './icons'

beforeEach(() => {
  configureIcons({})
})

describe('configureIcons', () => {
  it('sets the icon map', () => {
    configureIcons({ person: { actions: { save: 'save-icon' } } })
    expect(resolveActionIcon('person', 'save')).toBe('save-icon')
  })

  it('replaces the entire map', () => {
    configureIcons({ person: { actions: { save: 'old' } } })
    configureIcons({ order: { actions: { submit: 'new' } } })
    expect(resolveActionIcon('person', 'save')).toBeUndefined()
    expect(resolveActionIcon('order', 'submit')).toBe('new')
  })
})

describe('resolveActionIcon', () => {
  it('returns domain-specific icon', () => {
    configureIcons({
      person: { actions: { save: 'person-save' } },
      common: { actions: { save: 'common-save' } },
    })
    expect(resolveActionIcon('person', 'save')).toBe('person-save')
  })

  it('falls back to common icon', () => {
    configureIcons({ common: { actions: { save: 'common-save' } } })
    expect(resolveActionIcon('person', 'save')).toBe('common-save')
  })

  it('returns undefined when no icon exists', () => {
    expect(resolveActionIcon('person', 'save')).toBeUndefined()
  })
})

describe('resolveGroupIcon', () => {
  it('returns domain-specific icon', () => {
    configureIcons({
      person: { groups: { personal: 'personal-icon' } },
      common: { groups: { personal: 'common-icon' } },
    })
    expect(resolveGroupIcon('person', 'personal')).toBe('personal-icon')
  })

  it('falls back to common icon', () => {
    configureIcons({ common: { groups: { personal: 'common-icon' } } })
    expect(resolveGroupIcon('person', 'personal')).toBe('common-icon')
  })

  it('returns undefined when no icon exists', () => {
    expect(resolveGroupIcon('person', 'personal')).toBeUndefined()
  })
})
