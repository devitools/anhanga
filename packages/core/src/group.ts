import type { GroupConfig } from './types'

export class GroupDefinition {
  private _config: GroupConfig

  constructor() {
    this._config = {}
  }

  icon(i: string): this {
    this._config.icon = i
    return this
  }

  toConfig(): GroupConfig {
    return { ...this._config }
  }
}

export function group(): GroupDefinition {
  return new GroupDefinition()
}
