import { FieldDefinition } from './base'

export class TimeFieldDefinition extends FieldDefinition<string> {
  constructor(attrs: Record<string, unknown> = {}) {
    super('time', 'time', attrs)
  }

  min(t: string): this {
    this._config.validations = [...this._config.validations, { rule: 'minTime', params: { value: t } }]
    return this
  }

  max(t: string): this {
    this._config.validations = [...this._config.validations, { rule: 'maxTime', params: { value: t } }]
    return this
  }
}

export function time(attrs?: Record<string, unknown>): TimeFieldDefinition {
  return new TimeFieldDefinition(attrs)
}
