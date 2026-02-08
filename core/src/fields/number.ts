import { FieldDefinition } from './base'

export class NumberFieldDefinition extends FieldDefinition<number> {
  constructor(attrs: Record<string, unknown> = {}) {
    super('number', 'number', attrs)
  }

  min(n: number): this {
    this._config.validations = [...this._config.validations, { rule: 'min', params: { value: n } }]
    return this
  }

  max(n: number): this {
    this._config.validations = [...this._config.validations, { rule: 'max', params: { value: n } }]
    return this
  }

  precision(p: number): this {
    this._config.attrs = { ...this._config.attrs, precision: p }
    return this
  }
}

export function number(attrs?: Record<string, unknown>): NumberFieldDefinition {
  return new NumberFieldDefinition(attrs)
}
