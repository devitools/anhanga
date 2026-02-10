import { Scope } from './types'
import type { FieldConfig, GroupConfig, ActionConfig, SchemaProvide, FieldProxy, ScopeValue, ComponentContract, FormContract, TableContract, PaginateParams, PaginatedResult } from './types'
import type { FieldDefinition } from "./fields"
import type { GroupDefinition } from './group'
import type { ActionDefinition } from './action'

type InferState<F extends Record<string, FieldDefinition>> = {
  [K in keyof F]: F[K] extends FieldDefinition<infer T> ? T : unknown
}

export type EventContext<F extends Record<string, FieldDefinition>> = {
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
  component: ComponentContract
  form?: FormContract
  table?: TableContract
}

type BaseActionHandler<BF extends Record<string, FieldDefinition>> =
  (context: BaseHandlerContext<BF>) => void | Promise<void>

type ActionContext<F extends Record<string, FieldDefinition>> = {
  state: InferState<F>
  component: ComponentContract
  form?: FormContract
  table?: TableContract
}

type ActionHandler<F extends Record<string, FieldDefinition>> =
  (context: ActionContext<F>) => void | Promise<void>

type SchemaHandlers<F extends Record<string, FieldDefinition>> =
  Record<string, ActionHandler<F>>

type HookBootstrapContext<F extends Record<string, FieldDefinition>> = {
  context: Record<string, unknown>
  hydrate(data: Record<string, unknown>): void
  schema: { [K in keyof F]: FieldProxy }
  component: ComponentContract
}

type HookBootstrapFn<F extends Record<string, FieldDefinition>> =
  (ctx: HookBootstrapContext<F>) => void | Promise<void>

type HookFetchContext = {
  params: PaginateParams
  component: ComponentContract
}

type HookFetchFn = (ctx: HookFetchContext) => Promise<PaginatedResult<Record<string, unknown>>>

type SchemaHooks<F extends Record<string, FieldDefinition>> = {
  bootstrap?: Partial<Record<ScopeValue, HookBootstrapFn<F>>>
  fetch?: Partial<Record<ScopeValue, HookFetchFn>>
}

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

export interface SchemaOptions<F extends Record<string, FieldDefinition>> {
  identity?: string | string[]
  display?: string | ((record: Record<string, unknown>) => string)
  scopes?: ScopeValue[]
  groups?: Record<string, GroupDefinition>
  fields: F
  actions?: Record<string, ActionEntry>
}

export class SchemaDefinition<F extends Record<string, FieldDefinition>> {
  constructor(
    public readonly domain: string,
    private options: SchemaOptions<F>,
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

  extend<U extends Record<string, FieldDefinition>>(
    domain: string,
    extra: Partial<SchemaOptions<U>>,
  ): SchemaDefinition<F & U> {
    const merged: SchemaOptions<F & U> = {
      identity: extra.identity ?? this.options.identity,
      display: extra.display ?? this.options.display,
      groups: { ...this.options.groups, ...extra.groups },
      fields: { ...this.options.fields, ...extra.fields } as F & U,
      actions: { ...this.options.actions, ...extra.actions },
    }
    return new SchemaDefinition(domain, merged, this.baseHandlers)
  }

  pick<K extends keyof F>(...keys: K[]): SchemaDefinition<Pick<F, K>> {
    const fields = {} as Pick<F, K>
    for (const key of keys) {
      fields[key] = this.options.fields[key]
    }
    return new SchemaDefinition(this.domain, { ...this.options, fields }, this.baseHandlers)
  }

  omit<K extends keyof F>(...keys: K[]): SchemaDefinition<Omit<F, K>> {
    const fields = { ...this.options.fields }
    for (const key of keys) {
      delete fields[key]
    }
    return new SchemaDefinition(this.domain, { ...this.options, fields: fields as Omit<F, K> }, this.baseHandlers)
  }

  events(bindings: SchemaEvents<F>): SchemaEvents<F> {
    return bindings
  }

  handlers(bindings: SchemaHandlers<F>): SchemaHandlers<F> {
    return { ...this.baseHandlers, ...bindings } as SchemaHandlers<F>
  }

  hooks(bindings: SchemaHooks<F>): SchemaHooks<F> {
    return bindings
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
  create<F extends Record<string, FieldDefinition>>(
    domain: string,
    options: SchemaOptions<F>,
  ): SchemaDefinition<BF & F>
}

export function configure<BF extends Record<string, FieldDefinition>>(
  base: BaseSchemaConfig<BF>,
): SchemaFactory<BF> {
  return {
    create<F extends Record<string, FieldDefinition>>(
      domain: string,
      options: SchemaOptions<F>,
    ): SchemaDefinition<BF & F> {
      const mergedActions: Record<string, ActionEntry> = {
        ...base.actions,
        ...options.actions,
      }
      const merged: SchemaOptions<BF & F> = {
        identity: options.identity ?? base.identity,
        display: options.display ?? base.display,
        scopes: options.scopes ?? base.scopes,
        groups: { ...base.groups, ...options.groups },
        fields: { ...base.fields, ...options.fields } as BF & F,
        actions: mergedActions,
      }
      return new SchemaDefinition(domain, merged, base.handlers ?? {})
    },
  }
}
