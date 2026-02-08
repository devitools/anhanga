import type { SchemaProvide, ServiceContract, PaginateParams, PaginatedResult } from './types'

export interface PersistenceMeta {
  resource: string
  identity: string
  fields: Record<string, { dataType: string }>
}

export interface PersistenceContract {
  initialize(meta: PersistenceMeta): Promise<void>
  create(meta: PersistenceMeta, data: Record<string, unknown>): Promise<Record<string, unknown>>
  read(meta: PersistenceMeta, id: string | number): Promise<Record<string, unknown> | null>
  update(meta: PersistenceMeta, id: string | number, data: Record<string, unknown>): Promise<Record<string, unknown>>
  destroy(meta: PersistenceMeta, id: string | number): Promise<void>
  search(meta: PersistenceMeta, params: PaginateParams): Promise<PaginatedResult<Record<string, unknown>>>
}

interface SchemaLike {
  provide(): SchemaProvide
}

export function extractPersistenceMeta(schema: SchemaLike): PersistenceMeta {
  const provided = schema.provide()
  const identity = Array.isArray(provided.identity) ? provided.identity[0] : provided.identity
  const fields: Record<string, { dataType: string }> = {}
  for (const [name, config] of Object.entries(provided.fields)) {
    fields[name] = { dataType: config.dataType }
  }
  return { resource: provided.domain, identity, fields }
}

function resolveId(id: string | number | Record<string, unknown>, identity: string): string | number {
  if (typeof id === 'object') {
    return id[identity] as string | number
  }
  return id
}

export function createService(
  schema: SchemaLike,
  persistence: PersistenceContract,
): ServiceContract {
  const meta = extractPersistenceMeta(schema)
  let initPromise: Promise<void> | null = null

  function ensureInitialized(): Promise<void> {
    if (!initPromise) {
      initPromise = persistence.initialize(meta)
    }
    return initPromise
  }

  return {
    async create(data: Record<string, unknown>): Promise<Record<string, unknown>> {
      await ensureInitialized()
      return persistence.create(meta, data)
    },

    async read(id: string | number | Record<string, unknown>): Promise<Record<string, unknown>> {
      await ensureInitialized()
      const result = await persistence.read(meta, resolveId(id, meta.identity))
      return result ?? {}
    },

    async update(id: string | number | Record<string, unknown>, data: Record<string, unknown>): Promise<Record<string, unknown>> {
      await ensureInitialized()
      return persistence.update(meta, resolveId(id, meta.identity), data)
    },

    async destroy(id: string | number | Record<string, unknown>): Promise<void> {
      await ensureInitialized()
      return persistence.destroy(meta, resolveId(id, meta.identity))
    },

    async paginate(params: PaginateParams): Promise<PaginatedResult<Record<string, unknown>>> {
      await ensureInitialized()
      return persistence.search(meta, params)
    },
  }
}
