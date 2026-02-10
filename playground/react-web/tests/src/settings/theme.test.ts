import { describe, it, expect } from 'vitest'
import { defaultTheme } from '@anhanga/react-web'
import { theme } from '../../../src/settings/theme'

describe('theme', () => {
  it('equals defaultTheme', () => {
    expect(theme).toEqual(defaultTheme)
  })

  it('has expected top-level keys', () => {
    expect(theme).toHaveProperty('colors')
    expect(theme).toHaveProperty('spacing')
    expect(theme).toHaveProperty('borderRadius')
    expect(theme).toHaveProperty('fontSize')
    expect(theme).toHaveProperty('fontWeight')
  })
})
