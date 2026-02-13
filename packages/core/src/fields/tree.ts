import { ListFieldDefinition } from './list'

export class TreeFieldDefinition extends ListFieldDefinition {
  constructor(attrs: Record<string, unknown> = {}) {
    super(attrs)
    this._config.component = 'tree'
  }

  childrenKey(k: string): this {
    this._config.attrs = { ...this._config.attrs, childrenKey: k }
    return this
  }

  maxDepth(n: number): this {
    this._config.attrs = { ...this._config.attrs, maxDepth: n }
    return this
  }
}

export function tree(attrs?: Record<string, unknown>): TreeFieldDefinition {
  return new TreeFieldDefinition(attrs)
}
