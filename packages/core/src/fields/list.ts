import { FieldDefinition } from './base'
import type { SchemaDefinition } from '../schema'

export class ListFieldDefinition extends FieldDefinition<Record<string, unknown>[]> {
  constructor(attrs: Record<string, unknown> = {}) {
    super('list', 'array', attrs)
  }

  itemSchema(schema: SchemaDefinition<any>): this {
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
}

export function list(attrs?: Record<string, unknown>): ListFieldDefinition {
  return new ListFieldDefinition(attrs)
}
