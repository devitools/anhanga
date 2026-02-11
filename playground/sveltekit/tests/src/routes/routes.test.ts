import { Scope } from '@anhanga/core'
import { describe, it, expect } from 'vitest'

describe('person routes', () => {
  it('defines scope paths for all person routes', async () => {
    const { scopes } = await import('../../../src/routes/person/@routes')

    expect(scopes[Scope.index]).toEqual({ path: '/person' })
    expect(scopes[Scope.add]).toEqual({ path: '/person/add' })
    expect(scopes[Scope.view]).toEqual({ path: '/person/:id' })
    expect(scopes[Scope.edit]).toEqual({ path: '/person/:id/edit' })
  })
})
