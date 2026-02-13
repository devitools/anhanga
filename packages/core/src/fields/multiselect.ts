import { FieldDefinition } from './base'

export class MultiSelectFieldDefinition<V = string> extends FieldDefinition<V[]> {
  constructor(attrs: Record<string, unknown> = {}) {
    super('multiselect', 'array', attrs)
  }
}

export function multiselect<V = string>(options?: (string | number)[]): MultiSelectFieldDefinition<V> {
  return new MultiSelectFieldDefinition<V>(options ? { options } : {})
}
