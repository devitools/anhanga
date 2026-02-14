import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createLocalDriver } from './local-driver'
import type { PersistenceMeta } from '@ybyra/core'

const mockDb = {
  execAsync: vi.fn(),
  runAsync: vi.fn(),
  getFirstAsync: vi.fn(),
  getAllAsync: vi.fn(),
}

vi.mock('expo-sqlite', () => ({
  openDatabaseAsync: vi.fn(async () => mockDb),
}))

Object.defineProperty(globalThis, 'crypto', {
  value: { randomUUID: () => 'mock-uuid-1234' },
  writable: true,
})

const meta: PersistenceMeta = {
  resource: 'person',
  identity: 'id',
  fields: {
    id: { dataType: 'string' },
    name: { dataType: 'string' },
    age: { dataType: 'number' },
    active: { dataType: 'boolean' },
  },
}

describe('createLocalDriver', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.getAllAsync.mockResolvedValue([])
  })

  describe('initialize', () => {
    it('creates table with correct SQL types', async () => {
      const driver = createLocalDriver('test.db')
      await driver.initialize(meta)
      expect(mockDb.execAsync).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS person'),
      )
      expect(mockDb.execAsync).toHaveBeenCalledWith(
        expect.stringContaining('name TEXT'),
      )
      expect(mockDb.execAsync).toHaveBeenCalledWith(
        expect.stringContaining('age REAL'),
      )
      expect(mockDb.execAsync).toHaveBeenCalledWith(
        expect.stringContaining('active INTEGER'),
      )
    })

    it('adds missing columns via ALTER TABLE', async () => {
      mockDb.getAllAsync.mockResolvedValueOnce([{ name: 'id' }, { name: 'name' }])
      const driver = createLocalDriver()
      await driver.initialize(meta)
      expect(mockDb.execAsync).toHaveBeenCalledWith(
        expect.stringContaining('ALTER TABLE person ADD COLUMN age REAL'),
      )
      expect(mockDb.execAsync).toHaveBeenCalledWith(
        expect.stringContaining('ALTER TABLE person ADD COLUMN active INTEGER'),
      )
    })

    it('does not alter existing columns', async () => {
      mockDb.getAllAsync.mockResolvedValueOnce([
        { name: 'id' }, { name: 'name' }, { name: 'age' }, { name: 'active' },
      ])
      const driver = createLocalDriver()
      await driver.initialize(meta)
      const alterCalls = mockDb.execAsync.mock.calls.filter(
        (c: string[]) => c[0].includes('ALTER TABLE'),
      )
      expect(alterCalls).toHaveLength(0)
    })
  })

  describe('create', () => {
    it('inserts record with provided id', async () => {
      const driver = createLocalDriver()
      await driver.initialize(meta)
      const result = await driver.create(meta, { id: '1', name: 'Alice', age: 30 })
      expect(result).toEqual({ id: '1', name: 'Alice', age: 30 })
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO person'),
        expect.any(Array),
      )
    })

    it('generates UUID when id not provided', async () => {
      const driver = createLocalDriver()
      await driver.initialize(meta)
      const result = await driver.create(meta, { name: 'Alice' })
      expect(result.id).toBe('mock-uuid-1234')
    })

    it('converts boolean values to 0/1', async () => {
      const driver = createLocalDriver()
      await driver.initialize(meta)
      await driver.create(meta, { id: '1', active: true })
      const call = mockDb.runAsync.mock.calls[0]
      const values = call[1] as unknown[]
      expect(values).toContain(1)
    })

    it('converts null to null bind value', async () => {
      const driver = createLocalDriver()
      await driver.initialize(meta)
      await driver.create(meta, { id: '1', name: null })
      const call = mockDb.runAsync.mock.calls[0]
      const values = call[1] as unknown[]
      expect(values).toContain(null)
    })
  })

  describe('read', () => {
    it('returns parsed row', async () => {
      mockDb.getFirstAsync.mockResolvedValue({ id: '1', name: 'Alice', active: 1 })
      const driver = createLocalDriver()
      await driver.initialize(meta)
      const result = await driver.read(meta, '1')
      expect(result).toEqual({ id: '1', name: 'Alice', active: true })
    })

    it('returns null when not found', async () => {
      mockDb.getFirstAsync.mockResolvedValue(null)
      const driver = createLocalDriver()
      await driver.initialize(meta)
      const result = await driver.read(meta, 'nope')
      expect(result).toBeNull()
    })

    it('converts boolean 0 to false', async () => {
      mockDb.getFirstAsync.mockResolvedValue({ id: '1', active: 0 })
      const driver = createLocalDriver()
      await driver.initialize(meta)
      const result = await driver.read(meta, '1')
      expect(result!.active).toBe(false)
    })
  })

  describe('update', () => {
    it('builds UPDATE SQL excluding identity from SET clause', async () => {
      const driver = createLocalDriver()
      await driver.initialize(meta)
      await driver.update(meta, '1', { id: '1', name: 'Bob' })
      const call = mockDb.runAsync.mock.calls[0]
      expect(call[0]).toContain('UPDATE person SET')
      expect(call[0]).toContain('name = ?')
      // SET clause should only have 'name = ?', not 'id = ?'
      const setClause = (call[0] as string).split('SET')[1].split('WHERE')[0]
      expect(setClause).not.toContain('id')
    })

    it('returns merged data with id', async () => {
      const driver = createLocalDriver()
      await driver.initialize(meta)
      const result = await driver.update(meta, '1', { name: 'Bob' })
      expect(result).toEqual({ name: 'Bob', id: '1' })
    })
  })

  describe('destroy', () => {
    it('executes DELETE query', async () => {
      const driver = createLocalDriver()
      await driver.initialize(meta)
      await driver.destroy(meta, '1')
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'DELETE FROM person WHERE id = ?',
        ['1'],
      )
    })
  })

  describe('search', () => {
    it('returns paginated results', async () => {
      mockDb.getAllAsync.mockResolvedValueOnce([])
      mockDb.getAllAsync.mockResolvedValueOnce([{ id: '1', name: 'Alice', active: 1 }])
      mockDb.getFirstAsync.mockResolvedValue({ total: 1 })
      const driver = createLocalDriver()
      await driver.initialize(meta)
      const result = await driver.search(meta, { page: 1, limit: 10, sort: '', order: 'asc' })
      expect(result.data).toHaveLength(1)
      expect(result.data[0].active).toBe(true)
      expect(result.total).toBe(1)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(10)
    })

    it('applies sort when provided', async () => {
      mockDb.getAllAsync.mockResolvedValueOnce([])
      mockDb.getAllAsync.mockResolvedValueOnce([])
      mockDb.getFirstAsync.mockResolvedValue({ total: 0 })
      const driver = createLocalDriver()
      await driver.initialize(meta)
      await driver.search(meta, { page: 1, limit: 10, sort: 'name', order: 'desc' })
      const call = mockDb.getAllAsync.mock.calls[1]
      expect(call[0]).toContain('ORDER BY name DESC')
    })

    it('uses ASC when order is asc', async () => {
      mockDb.getAllAsync.mockResolvedValueOnce([])
      mockDb.getAllAsync.mockResolvedValueOnce([])
      mockDb.getFirstAsync.mockResolvedValue({ total: 0 })
      const driver = createLocalDriver()
      await driver.initialize(meta)
      await driver.search(meta, { page: 1, limit: 10, sort: 'name', order: 'asc' })
      const call = mockDb.getAllAsync.mock.calls[1]
      expect(call[0]).toContain('ORDER BY name ASC')
    })

    it('calculates correct offset', async () => {
      mockDb.getAllAsync.mockResolvedValueOnce([])
      mockDb.getAllAsync.mockResolvedValueOnce([])
      mockDb.getFirstAsync.mockResolvedValue({ total: 0 })
      const driver = createLocalDriver()
      await driver.initialize(meta)
      await driver.search(meta, { page: 3, limit: 10, sort: '', order: 'asc' })
      const call = mockDb.getAllAsync.mock.calls[1]
      expect(call[1]).toEqual([10, 20])
    })

    it('returns 0 total when count is null', async () => {
      mockDb.getAllAsync.mockResolvedValueOnce([])
      mockDb.getAllAsync.mockResolvedValueOnce([])
      mockDb.getFirstAsync.mockResolvedValue(null)
      const driver = createLocalDriver()
      await driver.initialize(meta)
      const result = await driver.search(meta, { page: 1, limit: 10, sort: '', order: 'asc' })
      expect(result.total).toBe(0)
    })
  })
})
