import type { FieldDefinition } from './fields/base'
import type { FieldProxy } from './types'
import type { EventContext } from './schema'
import { SchemaDefinition } from './schema'

const defaultProxy: FieldProxy = {
  width: 0,
  height: 0,
  hidden: false,
  disabled: false,
  state: '',
}

export function createMockContext<F extends Record<string, FieldDefinition>> (
  schema: SchemaDefinition<F>,
  values?: Partial<EventContext<F>['state']>,
): EventContext<F> {
  const fields = schema.getFields()

  const state = {} as EventContext<F>['state']
  for (const [key, config] of Object.entries(fields)) {
    (state as Record<string, unknown>)[key] = (values as Record<string, unknown>)?.[key] ?? config.defaultValue ?? undefined
  }

  const schemaProxy = {} as EventContext<F>['schema']
  for (const key of Object.keys(fields)) {
    (schemaProxy as Record<string, FieldProxy>)[key] = { ...defaultProxy }
  }

  return { state, schema: schemaProxy }
}
