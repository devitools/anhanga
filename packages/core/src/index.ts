export { configure, SchemaDefinition } from './schema'
export type { SchemaOptions, SchemaFactory, BaseSchemaConfig, EventContext } from './schema'

export { createMockContext, createMockDriver } from './mock'

export {
  FieldDefinition,
  TextFieldDefinition, Text, text, textarea,
  NumberFieldDefinition, number,
  DateFieldDefinition, DatetimeFieldDefinition, date, datetime,
  TimeFieldDefinition, time,
  ToggleFieldDefinition, CheckboxFieldDefinition, toggle, checkbox,
  SelectFieldDefinition, select,
  MultiSelectFieldDefinition, multiselect,
  CurrencyFieldDefinition, currency,
  FileFieldDefinition, file, image,
  ListFieldDefinition, list,
  TreeFieldDefinition, tree,
} from './fields'
export type { TextKind } from './fields'

export { GroupDefinition, group } from './group'
export { ActionDefinition, action } from './action'
export { createFiller, fill, defaultFillers } from './filler'
export type { FillerFn, FillerRegistry } from './filler'

export { createService, extractPersistenceMeta } from './persistence'
export type { PersistenceContract, PersistenceMeta } from './persistence'

export { isScopePermitted, isActionPermitted } from './permission'

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
