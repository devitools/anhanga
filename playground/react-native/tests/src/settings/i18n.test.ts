import { describe, it, expect } from 'vitest'

describe('src/settings/i18n', () => {
  it('exports initialized i18n instance', async () => {
    const i18n = (await import('../../../src/settings/i18n')).default
    expect(i18n).toBeDefined()
    expect(i18n.t).toBeTypeOf('function')
    expect(i18n.language).toBe('pt-BR')
  })
})
