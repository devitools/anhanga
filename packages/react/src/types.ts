import type {
  FieldConfig,
  FieldProxy,
  SchemaProvide,
  ScopeValue,
  GroupConfig,
  ActionConfig,
  ComponentContract,
  FormContract,
} from '@anhanga/core'

export interface FieldRendererProps {
  name: string
  value: unknown
  config: FieldConfig
  proxy: FieldProxy
  errors: string[]
  scope: ScopeValue
  onChange(value: unknown): void
  onBlur(): void
  onFocus(): void
}

export interface ResolvedField {
  name: string
  config: FieldConfig
  proxy: FieldProxy
}

export interface FieldGroup {
  name: string
  config: GroupConfig
  fields: ResolvedField[]
}

export interface ResolvedAction {
  name: string
  config: ActionConfig
  execute(): void | Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventFn = (context: any) => void

export interface HandlerContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any
  component: ComponentContract
  form: FormContract
}

type HandlerFn = (context: HandlerContext) => void | Promise<void>

export interface UseSchemaFormOptions {
  schema: SchemaProvide
  scope: ScopeValue
  services?: Record<string, object>
  events?: Record<string, Record<string, EventFn>>
  handlers?: Record<string, HandlerFn>
  component: ComponentContract
  initialValues?: Record<string, unknown>
}

export interface UseSchemaFormReturn {
  state: Record<string, unknown>
  fields: ResolvedField[]
  groups: FieldGroup[]
  ungrouped: ResolvedField[]
  actions: ResolvedAction[]
  errors: Record<string, string[]>
  dirty: boolean
  valid: boolean
  setValue(field: string, value: unknown): void
  setValues(values: Record<string, unknown>): void
  reset(values?: Record<string, unknown>): void
  validate(): boolean
  getFieldProps(name: string): FieldRendererProps
}

export type FieldRenderer = React.ComponentType<FieldRendererProps>
