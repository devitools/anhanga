import { describe, it, expect } from 'vitest'
import { personService, personHandlers, personHooks } from '../../src/demo'

describe('src/demo', () => {
  it('exports personService with CRUD methods', () => {
    expect(personService.create).toBeTypeOf('function')
    expect(personService.read).toBeTypeOf('function')
    expect(personService.update).toBeTypeOf('function')
    expect(personService.destroy).toBeTypeOf('function')
    expect(personService.paginate).toBeTypeOf('function')
  })

  it('exports personService with a custom method', () => {
    expect(personService.custom).toBeTypeOf('function')
  })

  it('exports personHandlers as an object of functions', () => {
    expect(personHandlers).toBeDefined()
    for (const handler of Object.values(personHandlers)) {
      expect(handler).toBeTypeOf('function')
    }
  })

  it('exports personHooks with bootstrap and fetch', () => {
    expect(personHooks).toHaveProperty('bootstrap')
    expect(personHooks).toHaveProperty('fetch')
  })
})
