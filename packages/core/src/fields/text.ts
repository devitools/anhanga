import { FieldDefinition } from './base'

export const Text = {
  Email: 'email',
  Phone: 'phone',
  Url: 'url',
  Cpf: 'cpf',
  Cnpj: 'cnpj',
  Cep: 'cep',
  Street: 'street',
  City: 'city',
  Password: 'password',
} as const

export type TextKind = typeof Text[keyof typeof Text]

export class TextFieldDefinition extends FieldDefinition<string> {
  constructor(component = 'text', attrs: Record<string, unknown> = {}) {
    super(component, 'string', attrs)
  }

  kind(k: TextKind): this {
    this._config.kind = k
    return this
  }

  minLength(n: number): this {
    this._config.validations = [...this._config.validations, { rule: 'minLength', params: { value: n } }]
    return this
  }

  maxLength(n: number): this {
    this._config.validations = [...this._config.validations, { rule: 'maxLength', params: { value: n } }]
    return this
  }

  pattern(regex: RegExp, message?: string): this {
    this._config.validations = [...this._config.validations, { rule: 'pattern', params: { regex, message } }]
    return this
  }
}

export function text(attrs?: Record<string, unknown>): TextFieldDefinition {
  return new TextFieldDefinition('text', attrs)
}

export function textarea(attrs?: Record<string, unknown>): TextFieldDefinition {
  return new TextFieldDefinition('textarea', attrs)
}
