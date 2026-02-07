import { Scope } from './types'
import type { FieldConfig, GroupConfig, ActionConfig, SchemaProvide, FieldProxy, ScopeValue, ComponentContract } from './types'
import type { FieldDefinition } from "./fields"
import type { GroupDefinition } from './group'
import type { ActionDefinition } from './action'

type InferState<F extends Record<string, FieldDefinition>> = {
  [K in keyof F]: F[K] extends FieldDefinition<infer T> ? T : unknown
}

type InferSchemaProxy<F extends Record<string, FieldDefinition>, S extends Record<string, object>> = {
  [K in keyof F]: FieldProxy
} & { services: S }

type EventContext<F extends Record<string, FieldDefinition>> = {
  state: InferState<F>
  schema: { [K in keyof F]: FieldProxy }
}

type EventHandler<F extends Record<string, FieldDefinition>> =
  (context: EventContext<F>) => void

type SchemaEvents<F extends Record<string, FieldDefinition>> = {
  [K in keyof F]?: Record<string, EventHandler<F>>
}

type BaseHandlerContext<BF extends Record<string, FieldDefinition>> = {
  state: InferState<BF> & Record<string, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: { services: Record<string, any> }
  component: ComponentContract
}

type BaseActionHandler<BF extends Record<string, FieldDefinition>> =
  (context: BaseHandlerContext<BF>) => void | Promise<void>

type ActionContext<F extends Record<string, FieldDefinition>, S extends Record<string, object>> = {
  state: InferState<F>
  schema: InferSchemaProxy<F, S>
  component: ComponentContract
}

type ActionHandler<F extends Record<string, FieldDefinition>, S extends Record<string, object>> =
  (context: ActionContext<F, S>) => void | Promise<void>

type SchemaHandlers<F extends Record<string, FieldDefinition>, S extends Record<string, object>> =
  Record<string, ActionHandler<F, S>>

export interface BaseSchemaConfig<BF extends Record<string, FieldDefinition> = Record<string, never>> {
  identity?: string | string[]
  display?: string | ((record: Record<string, unknown>) => string)
  scopes?: ScopeValue[]
  groups?: Record<string, GroupDefinition>
  fields?: BF
  actions?: Record<string, ActionDefinition>
  handlers?: Record<string, BaseActionHandler<BF>>
}

export type ActionEntry = ActionDefinition | null

export interface SchemaOptions<
  F extends Record<string, FieldDefinition>,
  S extends Record<string, object> = Record<string, object>,
> {
  identity?: string | string[]
  display?: string | ((record: Record<string, unknown>) => string)
  scopes?: ScopeValue[]
  groups?: Record<string, GroupDefinition>
  fields: F
  services?: S
  actions?: Record<string, ActionEntry>
}

export class SchemaDefinition<
  F extends Record<string, FieldDefinition>,
  S extends Record<string, object> = Record<string, object>,
> {
  constructor(
    public readonly domain: string,
    private options: SchemaOptions<F, S>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private baseHandlers: Record<string, (...args: any[]) => any> = {},
  ) {}

  get identity(): string | string[] {
    return this.options.identity!
  }

  get display() {
    return this.options.display
  }

  get scopes(): ScopeValue[] {
    return this.options.scopes ?? Object.values(Scope)
  }

  getFields(): Record<string, FieldConfig> {
    const result: Record<string, FieldConfig> = {}
    for (const [key, def] of Object.entries(this.options.fields)) {
      result[key] = def.toConfig()
    }
    return result
  }

  getGroups(): Record<string, GroupConfig> {
    if (!this.options.groups) return {}
    const result: Record<string, GroupConfig> = {}
    for (const [key, def] of Object.entries(this.options.groups)) {
      result[key] = def.toConfig()
    }
    return result
  }

  getActions(): Record<string, ActionConfig> {
    if (!this.options.actions) return {}
    const result: Record<string, ActionConfig> = {}
    for (const [key, def] of Object.entries(this.options.actions)) {
      if (def !== null) {
        result[key] = def.toConfig()
      }
    }
    return result
  }

  getServices(): S {
    return (this.options.services ?? {}) as S
  }

  extend<U extends Record<string, FieldDefinition>>(
    domain: string,
    extra: Partial<SchemaOptions<U>>,
  ): SchemaDefinition<F & U, S> {
    const merged: SchemaOptions<F & U, S> = {
      identity: extra.identity ?? this.options.identity,
      display: extra.display ?? this.options.display,
      groups: { ...this.options.groups, ...extra.groups },
      fields: { ...this.options.fields, ...extra.fields } as F & U,
      services: this.options.services,
      actions: { ...this.options.actions, ...extra.actions },
    }
    return new SchemaDefinition(domain, merged, this.baseHandlers)
  }

  pick<K extends keyof F>(...keys: K[]): SchemaDefinition<Pick<F, K>, S> {
    const fields = {} as Pick<F, K>
    for (const key of keys) {
      fields[key] = this.options.fields[key]
    }
    return new SchemaDefinition(this.domain, { ...this.options, fields }, this.baseHandlers)
  }

  omit<K extends keyof F>(...keys: K[]): SchemaDefinition<Omit<F, K>, S> {
    const fields = { ...this.options.fields }
    for (const key of keys) {
      delete fields[key]
    }
    return new SchemaDefinition(this.domain, { ...this.options, fields: fields as Omit<F, K> }, this.baseHandlers)
  }

  events(bindings: SchemaEvents<F>): SchemaEvents<F> {
    return bindings
  }

  handlers(bindings: SchemaHandlers<F, S>): SchemaHandlers<F, S> {
    return { ...this.baseHandlers, ...bindings } as SchemaHandlers<F, S>
  }

  provide(): SchemaProvide {
    return {
      domain: this.domain,
      identity: this.identity,
      display: this.display,
      scopes: this.scopes,
      groups: this.getGroups(),
      fields: this.getFields(),
      actions: this.getActions(),
    }
  }
}

export interface SchemaFactory<BF extends Record<string, FieldDefinition> = Record<string, never>> {
  create<
    F extends Record<string, FieldDefinition>,
    S extends Record<string, object> = Record<string, object>,
  >(
    domain: string,
    options: SchemaOptions<F, S>,
  ): SchemaDefinition<BF & F, S>
}

export function configure<BF extends Record<string, FieldDefinition>>(
  base: BaseSchemaConfig<BF>,
): SchemaFactory<BF> {
  return {
    create<
      F extends Record<string, FieldDefinition>,
      S extends Record<string, object>,
    >(
      domain: string,
      options: SchemaOptions<F, S>,
    ): SchemaDefinition<BF & F, S> {
      const mergedActions: Record<string, ActionEntry> = {
        ...base.actions,
        ...options.actions,
      }
      const merged: SchemaOptions<BF & F, S> = {
        identity: options.identity ?? base.identity,
        display: options.display ?? base.display,
        scopes: options.scopes ?? base.scopes,
        groups: { ...base.groups, ...options.groups },
        fields: { ...base.fields, ...options.fields } as BF & F,
        services: options.services,
        actions: mergedActions,
      }
      return new SchemaDefinition(domain, merged, base.handlers ?? {})
    },
  }
}
