import { describe, it, expect, beforeEach } from 'vitest'
import { createWebDriver } from './web-driver'
import type { PersistenceMeta } from '@ybyra/core'

const storage: Record<string, string> = {}

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string) => storage[key] ?? null,
    setItem: (key: string, value: string) => { storage[key] = value },
    removeItem: (key: string) => { delete storage[key] },
    clear: () => { for (const key of Object.keys(storage)) delete storage[key] },
  },
  writable: true,
})

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-1234',
  },
  writable: true,
})

const meta: PersistenceMeta = {
  resource: 'person',
  identity: 'id',
  fields: {
    id: { dataType: 'string' },
    name: { dataType: 'string' },
    age: { dataType: 'number' },
  },
}

describe('createWebDriver', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('initialize', () => {
    it('resolves without error', async () => {
      const driver = createWebDriver()
      await expect(driver.initialize(meta)).resolves.toBeUndefined()
    })
  })

  describe('create', () => {
    it('creates a record with provided id', async () => {
      const driver = createWebDriver()
      const result = await driver.create(meta, { id: 'abc', name: 'Alice', age: 30 })
      expect(result).toEqual({ id: 'abc', name: 'Alice', age: 30 })
    })

    it('generates an id when not provided', async () => {
      const driver = createWebDriver()
      const result = await driver.create(meta, { name: 'Alice', age: 30 })
      expect(result).toEqual({ id: 'test-uuid-1234', name: 'Alice', age: 30 })
    })

    it('persists to localStorage', async () => {
      const driver = createWebDriver()
      await driver.create(meta, { id: '1', name: 'Alice' })
      const raw = localStorage.getItem('ybyra:person')
      expect(raw).not.toBeNull()
      const data = JSON.parse(raw!)
      expect(data['1']).toEqual({ id: '1', name: 'Alice' })
    })
  })

  describe('read', () => {
    it('returns the record by id', async () => {
      const driver = createWebDriver()
      await driver.create(meta, { id: '1', name: 'Alice' })
      const result = await driver.read(meta, '1')
      expect(result).toEqual({ id: '1', name: 'Alice' })
    })

    it('returns null when record does not exist', async () => {
      const driver = createWebDriver()
      const result = await driver.read(meta, 'nonexistent')
      expect(result).toBeNull()
    })
  })

  describe('update', () => {
    it('updates an existing record', async () => {
      const driver = createWebDriver()
      await driver.create(meta, { id: '1', name: 'Alice', age: 30 })
      const result = await driver.update(meta, '1', { name: 'Bob' })
      expect(result).toEqual({ id: '1', name: 'Bob', age: 30 })
    })

    it('merges with existing data', async () => {
      const driver = createWebDriver()
      await driver.create(meta, { id: '1', name: 'Alice', age: 30 })
      await driver.update(meta, '1', { name: 'Bob' })
      const result = await driver.read(meta, '1')
      expect(result).toEqual({ id: '1', name: 'Bob', age: 30 })
    })
  })

  describe('destroy', () => {
    it('removes the record', async () => {
      const driver = createWebDriver()
      await driver.create(meta, { id: '1', name: 'Alice' })
      await driver.destroy(meta, '1')
      const result = await driver.read(meta, '1')
      expect(result).toBeNull()
    })
  })

  describe('search', () => {
    async function seed(driver: ReturnType<typeof createWebDriver>) {
      await driver.create(meta, { id: '1', name: 'Alice', age: 30 })
      await driver.create(meta, { id: '2', name: 'Bob', age: 25 })
      await driver.create(meta, { id: '3', name: 'Charlie', age: 35 })
    }

    it('returns paginated results', async () => {
      const driver = createWebDriver()
      await seed(driver)
      const result = await driver.search(meta, { page: 1, limit: 2, sort: '', order: 'asc' })
      expect(result.data).toHaveLength(2)
      expect(result.total).toBe(3)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(2)
    })

    it('returns second page', async () => {
      const driver = createWebDriver()
      await seed(driver)
      const result = await driver.search(meta, { page: 2, limit: 2, sort: '', order: 'asc' })
      expect(result.data).toHaveLength(1)
      expect(result.page).toBe(2)
    })

    it('sorts ascending', async () => {
      const driver = createWebDriver()
      await seed(driver)
      const result = await driver.search(meta, { page: 1, limit: 10, sort: 'name', order: 'asc' })
      expect(result.data[0].name).toBe('Alice')
      expect(result.data[2].name).toBe('Charlie')
    })

    it('sorts descending', async () => {
      const driver = createWebDriver()
      await seed(driver)
      const result = await driver.search(meta, { page: 1, limit: 10, sort: 'name', order: 'desc' })
      expect(result.data[0].name).toBe('Charlie')
      expect(result.data[2].name).toBe('Alice')
    })

    it('handles null values in sort', async () => {
      const driver = createWebDriver()
      await driver.create(meta, { id: '1', name: null })
      await driver.create(meta, { id: '2', name: 'Alice' })
      const result = await driver.search(meta, { page: 1, limit: 10, sort: 'name', order: 'asc' })
      expect(result.data).toHaveLength(2)
    })

    it('returns empty result for empty table', async () => {
      const driver = createWebDriver()
      const result = await driver.search(meta, { page: 1, limit: 10, sort: '', order: 'asc' })
      expect(result.data).toHaveLength(0)
      expect(result.total).toBe(0)
    })
  })
})
