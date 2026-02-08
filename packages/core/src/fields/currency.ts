import { FieldDefinition } from './base'

export class CurrencyFieldDefinition extends FieldDefinition<number> {
  constructor(attrs: Record<string, unknown> = {}) {
    super('currency', 'number', attrs)
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

  prefix(p: string): this {
    this._config.attrs = { ...this._config.attrs, prefix: p }
    return this
  }
}

export function currency(attrs?: Record<string, unknown>): CurrencyFieldDefinition {
  return new CurrencyFieldDefinition(attrs)
}
