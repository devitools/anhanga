import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPersonService } from '@anhanga/demo'
import { mockDriver } from '../../../support/mocks'

describe('createPersonService', () => {
  const driver = mockDriver()
  let service: ReturnType<typeof createPersonService>

  beforeEach(() => {
    vi.clearAllMocks()
    service = createPersonService(driver)
  })

  it('has CRUD methods', () => {
    expect(service.create).toBeTypeOf('function')
    expect(service.read).toBeTypeOf('function')
    expect(service.update).toBeTypeOf('function')
    expect(service.destroy).toBeTypeOf('function')
    expect(service.paginate).toBeTypeOf('function')
  })

  it('has a custom method', () => {
    expect(service.custom).toBeTypeOf('function')
  })

  it('custom calls console.log', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await service.custom('Alice')
    expect(spy).toHaveBeenCalledWith('[personService.custom]', 'Alice')
    spy.mockRestore()
  })
})
