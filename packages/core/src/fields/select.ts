import { FieldDefinition } from './base'

export class SelectFieldDefinition<V = string> extends FieldDefinition<V> {
  constructor(attrs: Record<string, unknown> = {}) {
    super('select', 'string', attrs)
  }
}

export function select<V = string>(options?: (string | number)[]): SelectFieldDefinition<V> {
  return new SelectFieldDefinition<V>(options ? { options } : {})
}
