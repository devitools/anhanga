import type { PersistenceContract, PersistenceMeta } from '@anhanga/core'
import type { PaginateParams, PaginatedResult } from '@anhanga/core'

function getStorageKey(resource: string): string {
  return `anhanga:${resource}`
}

function readTable(resource: string): Record<string, Record<string, unknown>> {
  const raw = localStorage.getItem(getStorageKey(resource))
  return raw ? JSON.parse(raw) : {}
}

function writeTable(resource: string, table: Record<string, Record<string, unknown>>): void {
  localStorage.setItem(getStorageKey(resource), JSON.stringify(table))
}

export function createWebDriver(): PersistenceContract {
  return {
    async initialize(): Promise<void> {},

    async create(meta: PersistenceMeta, data: Record<string, unknown>): Promise<Record<string, unknown>> {
      const table = readTable(meta.resource)
      const id = (data[meta.identity] ?? crypto.randomUUID()) as string
      const record = { ...data, [meta.identity]: id }
      table[id] = record
      writeTable(meta.resource, table)
      return record
    },

    async read(meta: PersistenceMeta, id: string | number): Promise<Record<string, unknown> | null> {
      const table = readTable(meta.resource)
      return table[String(id)] ?? null
    },

    async update(meta: PersistenceMeta, id: string | number, data: Record<string, unknown>): Promise<Record<string, unknown>> {
      const table = readTable(meta.resource)
      const key = String(id)
      const record = { ...table[key], ...data, [meta.identity]: id }
      table[key] = record
      writeTable(meta.resource, table)
      return record
    },

    async destroy(meta: PersistenceMeta, id: string | number): Promise<void> {
      const table = readTable(meta.resource)
      delete table[String(id)]
      writeTable(meta.resource, table)
    },

    async search(meta: PersistenceMeta, params: PaginateParams): Promise<PaginatedResult<Record<string, unknown>>> {
      const table = readTable(meta.resource)
      let rows = Object.values(table)

      if (params.sort) {
        const field = params.sort
        const dir = params.order === 'desc' ? -1 : 1
        rows.sort((a, b) => {
          const av = a[field]
          const bv = b[field]
          if (av == null && bv == null) return 0
          if (av == null) return dir
          if (bv == null) return -dir
          return av < bv ? -dir : av > bv ? dir : 0
        })
      }

      const total = rows.length
      const offset = (params.page - 1) * params.limit
      const data = rows.slice(offset, offset + params.limit)

      return { data, total, page: params.page, limit: params.limit }
    },
  }
}
