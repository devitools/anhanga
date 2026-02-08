import { describe, it, expect, vi } from 'vitest'
import { extractPersistenceMeta, createService } from './persistence'
import type { PersistenceContract, PersistenceMeta } from './persistence'
import type { SchemaProvide } from './types'

function fakeSchema(overrides: Partial<SchemaProvide> = {}) {
  const provide: SchemaProvide = {
    domain: 'person',
    identity: 'id',
    scopes: [],
    groups: {},
    fields: {
      id: { component: 'text', dataType: 'string', attrs: {}, form: { width: 12, height: 1, hidden: false, disabled: false, order: 0 }, table: { show: true, width: 'auto', sortable: false, filterable: false, order: 0 }, validations: [], scopes: null, states: [], defaultValue: undefined },
      name: { component: 'text', dataType: 'string', attrs: {}, form: { width: 12, height: 1, hidden: false, disabled: false, order: 0 }, table: { show: true, width: 'auto', sortable: false, filterable: false, order: 0 }, validations: [], scopes: null, states: [], defaultValue: undefined },
      active: { component: 'toggle', dataType: 'boolean', attrs: {}, form: { width: 12, height: 1, hidden: false, disabled: false, order: 0 }, table: { show: true, width: 'auto', sortable: false, filterable: false, order: 0 }, validations: [], scopes: null, states: [], defaultValue: undefined },
    },
    actions: {},
    ...overrides,
  }
  return { provide: () => provide }
}

function mockDriver(overrides: Partial<PersistenceContract> = {}): PersistenceContract {
  return {
    initialize: vi.fn().mockResolvedValue(undefined),
    create: vi.fn().mockResolvedValue({}),
    read: vi.fn().mockResolvedValue(null),
    update: vi.fn().mockResolvedValue({}),
    destroy: vi.fn().mockResolvedValue(undefined),
    search: vi.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 }),
    ...overrides,
  }
}

describe('extractPersistenceMeta', () => {
  it('extracts resource, identity, and fields from schema', () => {
    const meta = extractPersistenceMeta(fakeSchema())
    expect(meta.resource).toBe('person')
    expect(meta.identity).toBe('id')
    expect(meta.fields).toEqual({
      id: { dataType: 'string' },
      name: { dataType: 'string' },
      active: { dataType: 'boolean' },
    })
  })

  it('uses first element when identity is an array', () => {
    const meta = extractPersistenceMeta(fakeSchema({ identity: ['uuid', 'slug'] }))
    expect(meta.identity).toBe('uuid')
  })
})

describe('createService', () => {
  it('calls initialize lazily on first operation', async () => {
    const driver = mockDriver()
    const service = createService(fakeSchema(), driver)

    expect(driver.initialize).not.toHaveBeenCalled()
    await service.read('1')
    expect(driver.initialize).toHaveBeenCalledTimes(1)
  })

  it('calls initialize only once across multiple operations', async () => {
    const driver = mockDriver()
    const service = createService(fakeSchema(), driver)

    await service.read('1')
    await service.read('2')
    await service.create({})
    expect(driver.initialize).toHaveBeenCalledTimes(1)
  })

  it('delegates create to persistence.create', async () => {
    const created = { id: '1', name: 'Alice' }
    const driver = mockDriver({ create: vi.fn().mockResolvedValue(created) })
    const service = createService(fakeSchema(), driver)

    const result = await service.create({ name: 'Alice' })
    expect(result).toEqual(created)
    expect(driver.create).toHaveBeenCalledWith(
      expect.objectContaining({ resource: 'person' }),
      { name: 'Alice' },
    )
  })

  it('delegates read and returns {} when persistence returns null', async () => {
    const driver = mockDriver({ read: vi.fn().mockResolvedValue(null) })
    const service = createService(fakeSchema(), driver)

    const result = await service.read('missing')
    expect(result).toEqual({})
    expect(driver.read).toHaveBeenCalledWith(
      expect.objectContaining({ resource: 'person' }),
      'missing',
    )
  })

  it('delegates read and returns data when found', async () => {
    const record = { id: '1', name: 'Alice' }
    const driver = mockDriver({ read: vi.fn().mockResolvedValue(record) })
    const service = createService(fakeSchema(), driver)

    const result = await service.read('1')
    expect(result).toEqual(record)
  })

  it('resolves id from Record on read', async () => {
    const driver = mockDriver({ read: vi.fn().mockResolvedValue({}) })
    const service = createService(fakeSchema(), driver)

    await service.read({ id: '42', name: 'test' })
    expect(driver.read).toHaveBeenCalledWith(
      expect.objectContaining({ identity: 'id' }),
      '42',
    )
  })

  it('delegates update with resolved id', async () => {
    const updated = { id: '1', name: 'Bob' }
    const driver = mockDriver({ update: vi.fn().mockResolvedValue(updated) })
    const service = createService(fakeSchema(), driver)

    const result = await service.update({ id: '1' }, { name: 'Bob' })
    expect(result).toEqual(updated)
    expect(driver.update).toHaveBeenCalledWith(
      expect.objectContaining({ resource: 'person' }),
      '1',
      { name: 'Bob' },
    )
  })

  it('delegates destroy with resolved id', async () => {
    const driver = mockDriver()
    const service = createService(fakeSchema(), driver)

    await service.destroy({ id: '99' })
    expect(driver.destroy).toHaveBeenCalledWith(
      expect.objectContaining({ resource: 'person' }),
      '99',
    )
  })

  it('delegates paginate to persistence.search', async () => {
    const page = { data: [{ id: '1' }], total: 1, page: 1, limit: 10 }
    const driver = mockDriver({ search: vi.fn().mockResolvedValue(page) })
    const service = createService(fakeSchema(), driver)

    const params = { page: 1, limit: 10 }
    const result = await service.paginate(params)
    expect(result).toEqual(page)
    expect(driver.search).toHaveBeenCalledWith(
      expect.objectContaining({ resource: 'person' }),
      params,
    )
  })
})
