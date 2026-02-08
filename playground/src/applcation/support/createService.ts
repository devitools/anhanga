import type { PaginateParams, PaginatedResult, SchemaDefinition, FieldDefinition } from '@anhanga/core'
import type { SQLiteBindValue } from 'expo-sqlite'
import { ensureTable, getDatabase, type TableSchema } from './database'

const BOOLEAN_CAST = new Set(['boolean'])

function parseRow (row: Record<string, unknown>, dataTypes: Record<string, string>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    if (BOOLEAN_CAST.has(dataTypes[key]) && typeof value === 'number') {
      result[key] = value === 1
    } else {
      result[key] = value
    }
  }
  return result
}

function toBindValue (v: unknown): SQLiteBindValue {
  if (typeof v === 'boolean') return v ? 1 : 0
  if (typeof v === 'string' || typeof v === 'number') return v
  if (v === null || v === undefined) return null
  return String(v)
}

type AnySchema = SchemaDefinition<Record<string, FieldDefinition>>

export function schemaToTableSchema (schema: AnySchema): TableSchema {
  const provide = schema.provide()
  return {
    table: provide.domain,
    identity: Array.isArray(provide.identity) ? provide.identity[0] : provide.identity,
    fields: Object.fromEntries(
      Object.entries(provide.fields).map(([name, config]) => [name, { dataType: config.dataType }])
    ),
  }
}

export function createService (config: TableSchema) {
  const { table, identity } = config
  const dataTypes: Record<string, string> = {}
  for (const [name, field] of Object.entries(config.fields)) {
    dataTypes[name] = field.dataType
  }

  let tableReady = false

  async function init () {
    if (tableReady) return
    await ensureTable(config)
    tableReady = true
  }

  return {
    async create (data: Record<string, unknown>): Promise<Record<string, unknown>> {
      await init()
      const db = await getDatabase()
      const id = data[identity] ?? crypto.randomUUID()
      const record = { ...data, [identity]: id }

      const keys = Object.keys(record)
      const placeholders = keys.map(() => '?').join(', ')
      const values = keys.map((k) => toBindValue(record[k]))

      await db.runAsync(
        `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`,
        values
      )
      return record
    },

    async read (id: string | number | Record<string, unknown>): Promise<Record<string, unknown>> {
      await init()
      const db = await getDatabase()
      const idValue = typeof id === 'object' ? toBindValue(id[identity]) : toBindValue(id)
      const row = await db.getFirstAsync<Record<string, unknown>>(
        `SELECT * FROM ${table} WHERE ${identity} = ?`,
        [idValue]
      )
      return row ? parseRow(row, dataTypes) : {}
    },

    async update (id: string | number | Record<string, unknown>, data: Record<string, unknown>): Promise<Record<string, unknown>> {
      await init()
      const db = await getDatabase()
      const idValue = typeof id === 'object' ? toBindValue(id[identity]) : toBindValue(id)
      const entries = Object.entries(data).filter(([k]) => k !== identity)
      const sets = entries.map(([k]) => `${k} = ?`).join(', ')
      const values = entries.map(([, v]) => toBindValue(v))

      await db.runAsync(
        `UPDATE ${table} SET ${sets} WHERE ${identity} = ?`,
        [...values, idValue]
      )
      return { ...data, [identity]: idValue }
    },

    async destroy (id: string | number | Record<string, unknown>): Promise<void> {
      await init()
      const db = await getDatabase()
      const idValue = typeof id === 'object' ? toBindValue(id[identity]) : toBindValue(id)
      await db.runAsync(
        `DELETE FROM ${table} WHERE ${identity} = ?`,
        [idValue]
      )
    },

    async paginate (params: PaginateParams): Promise<PaginatedResult<Record<string, unknown>>> {
      await init()
      const db = await getDatabase()
      const { page, limit, sort, order } = params
      const offset = (page - 1) * limit

      let query = `SELECT * FROM ${table}`
      const countQuery = `SELECT COUNT(*) as total FROM ${table}`

      if (sort) {
        query += ` ORDER BY ${sort} ${order === 'desc' ? 'DESC' : 'ASC'}`
      }
      query += ` LIMIT ? OFFSET ?`

      const [rows, countResult] = await Promise.all([
        db.getAllAsync<Record<string, unknown>>(query, [limit, offset]),
        db.getFirstAsync<{ total: number }>(countQuery),
      ])

      return {
        data: rows.map((row) => parseRow(row, dataTypes)),
        total: countResult?.total ?? 0,
        page,
        limit,
      }
    },
  }
}
