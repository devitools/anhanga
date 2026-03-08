import { FieldDefinition } from './base'
import type { SchemaProvide } from '../types'
import type { SchemaDefinition } from '../schema'

export class ListFieldDefinition extends FieldDefinition<Record<string, unknown>[]> {
  constructor(attrs: Record<string, unknown> = {}) {
    super('list', 'array', attrs)
  }

  itemSchema(schema: SchemaProvide): this {
    this._config.attrs = { ...this._config.attrs, itemSchema: schema }
    return this
  }

  reorderable(r = true): this {
    this._config.attrs = { ...this._config.attrs, reorderable: r }
    return this
  }

  minItems(n: number): this {
    this._config.validations = [...this._config.validations, { rule: 'minItems', params: { value: n } }]
    return this
  }

  maxItems(n: number): this {
    this._config.validations = [...this._config.validations, { rule: 'maxItems', params: { value: n } }]
    return this
  }

  events(events: Record<string, unknown>): this {
    this._config.attrs = { ...this._config.attrs, events }
    return this
  }

  hooks(hooks: Record<string, unknown>): this {
    this._config.attrs = { ...this._config.attrs, hooks }
    return this
  }

  handlers(handlers: Record<string, unknown>): this {
    this._config.attrs = { ...this._config.attrs, handlers }
    return this
  }
}

export function list(schema?: SchemaDefinition<any> | Record<string, unknown>): ListFieldDefinition {
  if (schema && 'provide' in schema && typeof (schema as SchemaDefinition<any>).provide === 'function') {
    const field = new ListFieldDefinition()
    // call provide() so the stored value is plain data that survives deep cloning in toConfig()
    field.itemSchema((schema as SchemaDefinition<any>).provide())
    return field
  }
  return new ListFieldDefinition(schema as Record<string, unknown> | undefined)
}
