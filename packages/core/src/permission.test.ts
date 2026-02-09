import { describe, it, expect } from 'vitest'
import { isScopePermitted } from './permission'

describe('isScopePermitted', () => {
  it('returns false when permissions is undefined', () => {
    expect(isScopePermitted('person', 'index', undefined)).toBe(false)
  })

  it('returns true when scope is in permissions', () => {
    expect(isScopePermitted('person', 'index', ['person.index', 'person.add'])).toBe(true)
  })

  it('returns false when scope is not in permissions', () => {
    expect(isScopePermitted('person', 'edit', ['person.index', 'person.add'])).toBe(false)
  })

  it('returns false when permissions is empty', () => {
    expect(isScopePermitted('person', 'index', [])).toBe(false)
  })
})
