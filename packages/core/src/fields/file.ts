import { FieldDefinition } from './base'

export class FileFieldDefinition extends FieldDefinition<File> {
  constructor(component: string, attrs: Record<string, unknown> = {}) {
    super(component, 'file', attrs)
  }

  accept(types: string): this {
    this._config.attrs = { ...this._config.attrs, accept: types }
    return this
  }

  maxSize(bytes: number): this {
    this._config.validations = [...this._config.validations, { rule: 'maxSize', params: { value: bytes } }]
    return this
  }
}

export function file(attrs?: Record<string, unknown>): FileFieldDefinition {
  return new FileFieldDefinition('file', attrs)
}

export function image(attrs?: Record<string, unknown>): FileFieldDefinition {
  return new FileFieldDefinition('image', attrs)
}
