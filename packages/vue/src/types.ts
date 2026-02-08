import type { Component } from 'vue'
import type {
  FieldConfig,
  FieldProxy,
  SchemaProvide,
  ScopeValue,
  GroupConfig,
  ActionConfig,
  TableConfig,
  ComponentContract,
  FormContract,
  TableContract,
  TranslateContract,
} from '@anhanga/core'

export interface FieldRendererProps {
  domain: string
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

export type FormSection =
  | { kind: 'group'; name: string; config: GroupConfig; fields: ResolvedField[] }
  | { kind: 'ungrouped'; fields: ResolvedField[] }

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
  component: ComponentContract
  form?: FormContract
  table?: TableContract
}

type HandlerFn = (context: HandlerContext) => void | Promise<void>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BootstrapHookFn = (ctx: any) => void | Promise<void>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FetchHookFn = (ctx: any) => Promise<any>

export interface UseSchemaFormOptions {
  schema: SchemaProvide
  scope: ScopeValue
  events?: Record<string, Record<string, EventFn>>
  handlers?: Record<string, HandlerFn>
  hooks?: {
    bootstrap?: Partial<Record<ScopeValue, BootstrapHookFn>>
    fetch?: Partial<Record<ScopeValue, FetchHookFn>>
  }
  context?: Record<string, unknown>
  component: ComponentContract
  initialValues?: Record<string, unknown>
  translate?: TranslateContract
}

export interface UseSchemaFormReturn {
  loading: boolean
  state: Record<string, unknown>
  fields: ResolvedField[]
  groups: FieldGroup[]
  ungrouped: ResolvedField[]
  sections: FormSection[]
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

export type FieldRenderer = Component<FieldRendererProps>

export interface ResolvedColumn {
  name: string
  config: FieldConfig
  table: TableConfig
}

export interface UseSchemaTableOptions {
  schema: SchemaProvide
  scope: ScopeValue
  handlers?: Record<string, HandlerFn>
  hooks?: {
    bootstrap?: Partial<Record<ScopeValue, BootstrapHookFn>>
    fetch?: Partial<Record<ScopeValue, FetchHookFn>>
  }
  context?: Record<string, unknown>
  component: ComponentContract
  pageSize?: number
  translate?: TranslateContract
}

export interface UseSchemaTableReturn {
  rows: Record<string, unknown>[]
  loading: boolean
  empty: boolean

  columns: ResolvedColumn[]
  availableColumns: ResolvedColumn[]
  visibleColumns: string[]
  toggleColumn (name: string): void

  page: number
  limit: number
  total: number
  totalPages: number
  setPage (page: number): void
  setLimit (limit: number): void

  sortField?: string
  sortOrder?: "asc" | "desc"
  setSort (field: string): void

  filters: Record<string, unknown>
  setFilter (field: string, value: unknown): void
  clearFilters (): void

  selected: Record<string, unknown>[]
  isSelected (record: Record<string, unknown>): boolean
  toggleSelect (record: Record<string, unknown>): void
  selectAll (): void
  clearSelection (): void

  actions: ResolvedAction[]
  getRowActions (record: Record<string, unknown>): ResolvedAction[]

  reload (): void
  formatValue (name: string, value: unknown, record: Record<string, unknown>): string
  getIdentity (record: Record<string, unknown>): string
}
