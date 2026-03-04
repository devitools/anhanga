import { describe, it, expect, vi } from 'vitest'
import { createPersonService } from './personService'
import type { PersistenceContract, PersistenceMeta } from '@ybyra/core'

function makeDriver(): PersistenceContract {
  return {
    initialize: vi.fn(),
    create: vi.fn().mockResolvedValue({ id: '1', name: 'Alice' }),
    read: vi.fn().mockResolvedValue({ id: '1', name: 'Alice' }),
    update: vi.fn().mockResolvedValue({ id: '1', name: 'Bob' }),
    destroy: vi.fn(),
    search: vi.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 }),
  }
}

describe('createPersonService', () => {
  it('creates a service with CRUD methods', () => {
    const driver = makeDriver()
    const service = createPersonService(driver)
    expect(service).toHaveProperty('paginate')
    expect(service).toHaveProperty('read')
    expect(service).toHaveProperty('create')
    expect(service).toHaveProperty('update')
    expect(service).toHaveProperty('destroy')
  })

  it('has a custom method', () => {
    const driver = makeDriver()
    const service = createPersonService(driver)
    expect(service).toHaveProperty('custom')
    expect(typeof service.custom).toBe('function')
  })

  it('custom method logs to console', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const driver = makeDriver()
    const service = createPersonService(driver)
    await service.custom('Alice')
    expect(spy).toHaveBeenCalledWith('[personService.custom]', 'Alice')
    spy.mockRestore()
  })

  it('delegates paginate to driver via createService', async () => {
    const driver = makeDriver()
    const service = createPersonService(driver)
    await service.paginate({ page: 1, limit: 10 })
    expect(driver.search).toHaveBeenCalled()
  })

  it('delegates read to driver via createService', async () => {
    const driver = makeDriver()
    const service = createPersonService(driver)
    await service.read('1')
    expect(driver.read).toHaveBeenCalled()
  })

  it('delegates create to driver via createService', async () => {
    const driver = makeDriver()
    const service = createPersonService(driver)
    await service.create({ name: 'Alice' })
    expect(driver.create).toHaveBeenCalled()
  })

  it('delegates update to driver via createService', async () => {
    const driver = makeDriver()
    const service = createPersonService(driver)
    await service.update('1', { name: 'Bob' })
    expect(driver.update).toHaveBeenCalled()
  })

  it('delegates destroy to driver via createService', async () => {
    const driver = makeDriver()
    const service = createPersonService(driver)
    await service.destroy('1')
    expect(driver.destroy).toHaveBeenCalled()
  })
})
