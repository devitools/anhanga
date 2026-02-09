import { describe, it, expect } from 'vitest'
import { defaultTheme } from '@anhanga/react-native'
import { theme } from '../../../src/settings/theme'

describe('src/settings/theme', () => {
  it('exports theme as spread of defaultTheme', () => {
    expect(theme).toEqual(defaultTheme)
  })

  it('is a new object, not a reference', () => {
    expect(theme).not.toBe(defaultTheme)
  })
})
