import { describe, it, expect, beforeEach } from 'vitest'
import { configureIcons, resolveActionIcon, resolveGroupIcon } from './icons'

beforeEach(() => {
  // Reset global icon map before each test to avoid state bleed
  configureIcons({})
})

describe('configureIcons', () => {
  it('sets the icon map', () => {
    configureIcons({
      person: {
        actions: { save: 'save-icon' },
      },
    })
    expect(resolveActionIcon('person', 'save')).toBe('save-icon')
  })

  it('replaces the entire map on subsequent calls', () => {
    configureIcons({ person: { actions: { save: 'old-icon' } } })
    configureIcons({ order: { actions: { submit: 'new-icon' } } })
    expect(resolveActionIcon('person', 'save')).toBeUndefined()
    expect(resolveActionIcon('order', 'submit')).toBe('new-icon')
  })
})

describe('resolveActionIcon', () => {
  it('returns domain-specific action icon', () => {
    configureIcons({
      person: {
        actions: { save: 'person-save-icon' },
      },
      common: {
        actions: { save: 'common-save-icon' },
      },
    })
    expect(resolveActionIcon('person', 'save')).toBe('person-save-icon')
  })

  it('falls back to common action icon', () => {
    configureIcons({
      common: {
        actions: { save: 'common-save-icon' },
      },
    })
    expect(resolveActionIcon('person', 'save')).toBe('common-save-icon')
  })

  it('returns undefined when no icon exists', () => {
    configureIcons({})
    expect(resolveActionIcon('person', 'save')).toBeUndefined()
  })
})

describe('resolveGroupIcon', () => {
  it('returns domain-specific group icon', () => {
    configureIcons({
      person: {
        groups: { personal: 'personal-icon' },
      },
      common: {
        groups: { personal: 'common-personal-icon' },
      },
    })
    expect(resolveGroupIcon('person', 'personal')).toBe('personal-icon')
  })

  it('falls back to common group icon', () => {
    configureIcons({
      common: {
        groups: { personal: 'common-personal-icon' },
      },
    })
    expect(resolveGroupIcon('person', 'personal')).toBe('common-personal-icon')
  })

  it('returns undefined when no icon exists', () => {
    configureIcons({})
    expect(resolveGroupIcon('person', 'personal')).toBeUndefined()
  })
})

describe('icon resolution with multiple domains', () => {
  it('resolves icons from the correct domain', () => {
    configureIcons({
      person: {
        actions: { save: 'person-save' },
        groups: { info: 'person-info' },
      },
      order: {
        actions: { save: 'order-save' },
        groups: { info: 'order-info' },
      },
    })
    expect(resolveActionIcon('person', 'save')).toBe('person-save')
    expect(resolveActionIcon('order', 'save')).toBe('order-save')
    expect(resolveGroupIcon('person', 'info')).toBe('person-info')
    expect(resolveGroupIcon('order', 'info')).toBe('order-info')
  })
})
