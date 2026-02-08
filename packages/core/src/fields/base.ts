import { Scope } from '../types'
import type { FieldConfig, ScopeValue, TableConfig } from '../types'

export class FieldDefinition<T = unknown> {
  protected _config: FieldConfig

  constructor(component: string, dataType: string, attrs: Record<string, unknown> = {}) {
    this._config = {
      component,
      dataType,
      attrs,
      form: { width: 100, height: 1, hidden: false, disabled: false, order: 1 },
      table: { show: false, width: 'auto', sortable: true, filterable: false, order: 1 },
      validations: [],
      scopes: null,
      group: undefined,
      states: [],
      defaultValue: undefined,
    }
  }

  width(w: number): this {
    this._config.form.width = w
    return this
  }

  height(h: number): this {
    this._config.form.height = h
    return this
  }

  hidden(h = true): this {
    this._config.form.hidden = h
    return this
  }

  disabled(d = true): this {
    this._config.form.disabled = d
    return this
  }

  order(o: number): this {
    this._config.form.order = o
    return this
  }

  default(v: T): this {
    this._config.defaultValue = v
    return this
  }

  group(g: string): this {
    this._config.group = g
    return this
  }

  scopes(...s: ScopeValue[]): this {
    this._config.scopes = s
    return this
  }

  excludeScopes(...s: ScopeValue[]): this {
    const all = Object.values(Scope)
    this._config.scopes = all.filter((scope) => !s.includes(scope))
    return this
  }

  states(...s: string[]): this {
    this._config.states = s
    return this
  }

  column(config?: Partial<TableConfig>): this {
    this._config.table.show = true
    if (config) {
      this._config.table = { ...this._config.table, ...config }
    }
    return this
  }

  filterable(): this {
    this._config.table.filterable = true
    return this
  }

  sortable(s = true): this {
    this._config.table.sortable = s
    return this
  }

  required(): this {
    this._config.validations = [...this._config.validations, { rule: 'required' }]
    return this
  }

  toConfig(): FieldConfig {
    return structuredClone(this._config)
  }
}
