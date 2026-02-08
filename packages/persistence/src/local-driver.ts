import * as SQLite from 'expo-sqlite'
import type { PersistenceContract, PersistenceMeta } from '@anhanga/core'
import type { PaginateParams, PaginatedResult } from '@anhanga/core'
import type { SQLiteBindValue } from 'expo-sqlite'

const DATA_TYPE_MAP: Record<string, string> = {
  string: 'TEXT',
  number: 'REAL',
  boolean: 'INTEGER',
  date: 'TEXT',
  datetime: 'TEXT',
  file: 'TEXT',
}

const BOOLEAN_CAST = new Set(['boolean'])

function parseRow(row: Record<string, unknown>, fields: Record<string, { dataType: string }>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    if (BOOLEAN_CAST.has(fields[key]?.dataType) && typeof value === 'number') {
      result[key] = value === 1
    } else {
      result[key] = value
    }
  }
  return result
}

function toBindValue(v: unknown): SQLiteBindValue {
  if (typeof v === 'boolean') return v ? 1 : 0
  if (typeof v === 'string' || typeof v === 'number') return v
  if (v === null || v === undefined) return null
  return String(v)
}

async function ensureTable(db: SQLite.SQLiteDatabase, meta: PersistenceMeta): Promise<void> {
  const { resource, identity, fields } = meta

  const columns: string[] = []
  for (const [name, config] of Object.entries(fields)) {
    if (name === identity) continue
    const sqlType = DATA_TYPE_MAP[config.dataType] ?? 'TEXT'
    columns.push(`${name} ${sqlType}`)
  }

  const createSQL = `CREATE TABLE IF NOT EXISTS ${resource} (${identity} TEXT PRIMARY KEY, ${columns.join(', ')})`
  await db.execAsync(createSQL)

  const existingColumns = await db.getAllAsync<{ name: string }>(
    `PRAGMA table_info(${resource})`
  )
  const existingNames = new Set(existingColumns.map((col) => col.name))

  for (const [name, config] of Object.entries(fields)) {
    if (existingNames.has(name)) continue
    const sqlType = DATA_TYPE_MAP[config.dataType] ?? 'TEXT'
    await db.execAsync(`ALTER TABLE ${resource} ADD COLUMN ${name} ${sqlType}`)
  }
}

export function createLocalDriver(dbName = 'anhanga.db'): PersistenceContract {
  let dbInstance: SQLite.SQLiteDatabase | null = null

  async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (!dbInstance) {
      dbInstance = await SQLite.openDatabaseAsync(dbName)
    }
    return dbInstance
  }

  return {
    async initialize(meta: PersistenceMeta): Promise<void> {
      const db = await getDatabase()
      await ensureTable(db, meta)
    },

    async create(meta: PersistenceMeta, data: Record<string, unknown>): Promise<Record<string, unknown>> {
      const db = await getDatabase()
      const id = data[meta.identity] ?? crypto.randomUUID()
      const record = { ...data, [meta.identity]: id }

      const keys = Object.keys(record)
      const placeholders = keys.map(() => '?').join(', ')
      const values = keys.map((k) => toBindValue(record[k]))

      await db.runAsync(
        `INSERT INTO ${meta.resource} (${keys.join(', ')}) VALUES (${placeholders})`,
        values
      )
      return record
    },

    async read(meta: PersistenceMeta, id: string | number): Promise<Record<string, unknown> | null> {
      const db = await getDatabase()
      const row = await db.getFirstAsync<Record<string, unknown>>(
        `SELECT * FROM ${meta.resource} WHERE ${meta.identity} = ?`,
        [toBindValue(id)]
      )
      return row ? parseRow(row, meta.fields) : null
    },

    async update(meta: PersistenceMeta, id: string | number, data: Record<string, unknown>): Promise<Record<string, unknown>> {
      const db = await getDatabase()
      const entries = Object.entries(data).filter(([k]) => k !== meta.identity)
      const sets = entries.map(([k]) => `${k} = ?`).join(', ')
      const values = entries.map(([, v]) => toBindValue(v))

      await db.runAsync(
        `UPDATE ${meta.resource} SET ${sets} WHERE ${meta.identity} = ?`,
        [...values, toBindValue(id)]
      )
      return { ...data, [meta.identity]: id }
    },

    async destroy(meta: PersistenceMeta, id: string | number): Promise<void> {
      const db = await getDatabase()
      await db.runAsync(
        `DELETE FROM ${meta.resource} WHERE ${meta.identity} = ?`,
        [toBindValue(id)]
      )
    },

    async search(meta: PersistenceMeta, params: PaginateParams): Promise<PaginatedResult<Record<string, unknown>>> {
      const db = await getDatabase()
      const { page, limit, sort, order } = params
      const offset = (page - 1) * limit

      let query = `SELECT * FROM ${meta.resource}`
      const countQuery = `SELECT COUNT(*) as total FROM ${meta.resource}`

      if (sort) {
        query += ` ORDER BY ${sort} ${order === 'desc' ? 'DESC' : 'ASC'}`
      }
      query += ` LIMIT ? OFFSET ?`

      const [rows, countResult] = await Promise.all([
        db.getAllAsync<Record<string, unknown>>(query, [limit, offset]),
        db.getFirstAsync<{ total: number }>(countQuery),
      ])

      return {
        data: rows.map((row) => parseRow(row, meta.fields)),
        total: countResult?.total ?? 0,
        page,
        limit,
      }
    },
  }
}
