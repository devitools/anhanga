export { configure, SchemaDefinition } from './schema'
export type { SchemaOptions, SchemaFactory, BaseSchemaConfig } from './schema'

export {
  FieldDefinition,
  TextFieldDefinition, Text, text,
  NumberFieldDefinition, number,
  DateFieldDefinition, DatetimeFieldDefinition, date, datetime,
  ToggleFieldDefinition, CheckboxFieldDefinition, toggle, checkbox,
  SelectFieldDefinition, select,
  CurrencyFieldDefinition, currency,
  FileFieldDefinition, file, image,
} from './fields'
export type { TextKind } from './fields'

export { GroupDefinition, group } from './group'
export { ActionDefinition, action } from './action'
export { createFiller, fill, defaultFillers } from './filler'
export type { FillerFn, FillerRegistry } from './filler'

export { createService, extractPersistenceMeta } from './persistence'
export type { PersistenceContract, PersistenceMeta } from './persistence'

export { isScopePermitted } from './permission'

export { buildInitialState, isInScope } from './scope'

export { Position, Scope } from './types'

export { ptBR } from './locales/pt-BR'

export type {
  PositionValue,
  ScopeValue,
  FieldConfig,
  FormConfig,
  TableConfig,
  ValidationRule,
  GroupConfig,
  ActionConfig,
  FieldProxy,
  SchemaProvide,
  ServiceContract,
  PaginateParams,
  PaginatedResult,
  ScopeRoute,
  NavigatorContract,
  DialogContract,
  ToastContract,
  LoadingContract,
  ComponentContract,
  FormContract,
  TableContract,
  TranslateContract,
  HandlerContext,
  BootstrapHookContext,
  BootstrapHookFn,
  FetchHookContext,
  FetchHookFn,
  SchemaHooks,
} from './types'

import type { SchemaDefinition } from './schema'
import type { FieldDefinition } from './fields/base'

export type InferRecord<S> = S extends SchemaDefinition<infer F>
  ? { [K in keyof F]: F[K] extends FieldDefinition<infer T> ? T : unknown }
  : never
