import * as SQLite from 'expo-sqlite'

export interface TableSchema {
  table: string
  identity: string
  fields: Record<string, { dataType: string }>
}

const DATA_TYPE_MAP: Record<string, string> = {
  string: 'TEXT',
  number: 'REAL',
  boolean: 'INTEGER',
  date: 'TEXT',
  datetime: 'TEXT',
  file: 'TEXT',
}

let dbInstance: SQLite.SQLiteDatabase | null = null

export async function getDatabase (): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('anhanga.db')
  }
  return dbInstance
}

export async function ensureTable (schema: TableSchema): Promise<void> {
  const db = await getDatabase()
  const { table, identity, fields } = schema

  const columns: string[] = []
  for (const [name, config] of Object.entries(fields)) {
    if (name === identity) continue
    const sqlType = DATA_TYPE_MAP[config.dataType] ?? 'TEXT'
    columns.push(`${name} ${sqlType}`)
  }

  const createSQL = `CREATE TABLE IF NOT EXISTS ${table} (${identity} TEXT PRIMARY KEY, ${columns.join(', ')})`
  await db.execAsync(createSQL)

  const existingColumns = await db.getAllAsync<{ name: string }>(
    `PRAGMA table_info(${table})`
  )
  const existingNames = new Set(existingColumns.map((col) => col.name))

  for (const [name, config] of Object.entries(fields)) {
    if (existingNames.has(name)) continue
    const sqlType = DATA_TYPE_MAP[config.dataType] ?? 'TEXT'
    await db.execAsync(`ALTER TABLE ${table} ADD COLUMN ${name} ${sqlType}`)
  }
}
