import { describe, it, expect } from 'vitest'
import { isScopePermitted, isActionPermitted } from './permission'

describe('isScopePermitted', () => {
  it('returns false when permissions is undefined', () => {
    expect(isScopePermitted('person', 'index', undefined)).toBe(false)
  })

  it('returns true when scope is in permissions', () => {
    expect(isScopePermitted('person', 'index', ['person.scope.index', 'person.scope.add'])).toBe(true)
  })

  it('returns false when scope is not in permissions', () => {
    expect(isScopePermitted('person', 'edit', ['person.scope.index', 'person.scope.add'])).toBe(false)
  })

  it('returns false when permissions is empty', () => {
    expect(isScopePermitted('person', 'index', [])).toBe(false)
  })
})

describe('isActionPermitted', () => {
  it('returns true when action is open regardless of permissions', () => {
    expect(isActionPermitted('person', 'add', { open: true }, undefined)).toBe(true)
    expect(isActionPermitted('person', 'add', { open: true }, [])).toBe(true)
  })

  it('returns false when not open and permissions is undefined', () => {
    expect(isActionPermitted('person', 'create', { open: false }, undefined)).toBe(false)
  })

  it('returns true when permission matches', () => {
    expect(isActionPermitted('person', 'custom', { open: false }, ['person.action.custom'])).toBe(true)
  })

  it('returns false when permission does not match', () => {
    expect(isActionPermitted('person', 'custom', { open: false }, ['person.action.create'])).toBe(false)
  })

  it('returns false when permissions is empty', () => {
    expect(isActionPermitted('person', 'create', { open: false }, [])).toBe(false)
  })

  it('works with complex domain names', () => {
    expect(isActionPermitted('registration.person', 'create', { open: false }, ['registration.person.action.create'])).toBe(true)
  })
})
