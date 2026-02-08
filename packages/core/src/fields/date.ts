import { FieldDefinition } from './base'

export class DateFieldDefinition extends FieldDefinition<string> {
  constructor(attrs: Record<string, unknown> = {}) {
    super('date', 'date', attrs)
  }

  min(d: string): this {
    this._config.validations = [...this._config.validations, { rule: 'minDate', params: { value: d } }]
    return this
  }

  max(d: string): this {
    this._config.validations = [...this._config.validations, { rule: 'maxDate', params: { value: d } }]
    return this
  }
}

export function date(attrs?: Record<string, unknown>): DateFieldDefinition {
  return new DateFieldDefinition(attrs)
}

export class DatetimeFieldDefinition extends FieldDefinition<string> {
  constructor(attrs: Record<string, unknown> = {}) {
    super('datetime', 'datetime', attrs)
  }

  min(d: string): this {
    this._config.validations = [...this._config.validations, { rule: 'minDate', params: { value: d } }]
    return this
  }

  max(d: string): this {
    this._config.validations = [...this._config.validations, { rule: 'maxDate', params: { value: d } }]
    return this
  }
}

export function datetime(attrs?: Record<string, unknown>): DatetimeFieldDefinition {
  return new DatetimeFieldDefinition(attrs)
}
