export const Position = {
  top: "top",
  footer: "footer",
  floating: "floating",
  row: "row",
  header: "header",
} as const;

export type PositionValue = typeof Position[keyof typeof Position]

export const Scope = {
  index: "index",
  add: "add",
  view: "view",
  edit: "edit",
} as const;

export type ScopeValue = typeof Scope[keyof typeof Scope] | string;

export interface FormConfig {
  width: number;
  height: number;
  hidden: boolean;
  disabled: boolean;
  order: number;
}

export interface TableConfig {
  show: boolean;
  width: string | number;
  sortable: boolean;
  filterable: boolean;
  order: number;
  format?: (value: unknown, record: Record<string, unknown>) => string;
  align?: "left" | "center" | "right";
}

export interface ValidationRule {
  rule: string;
  params?: Record<string, unknown>;
  message?: string;
}

export interface FieldConfig {
  component: string;
  dataType: string;
  kind?: string;
  attrs: Record<string, unknown>;
  form: FormConfig;
  table: TableConfig;
  validations: ValidationRule[];
  scopes: ScopeValue[] | null;
  group?: string;
  states: string[];
  defaultValue: unknown;
}

export interface GroupConfig {
}

export interface ActionConfig {
  variant: "default" | "primary" | "destructive" | "secondary" | "muted" | "accent" | "success" | "warning" | "info";
  positions: PositionValue[];
  align: "start" | "end";
  hidden: boolean;
  open: boolean;
  scopes: ScopeValue[] | null;
  order: number;
  condition?: (record: Record<string, unknown>) => boolean;
}

export interface FieldProxy {
  width: number;
  height: number;
  hidden: boolean;
  disabled: boolean;
  state: string;
}

export interface SchemaProvide {
  domain: string;
  identity: string | string[];
  display?: string | ((record: Record<string, unknown>) => string);
  scopes: ScopeValue[];
  groups: Record<string, GroupConfig>;
  fields: Record<string, FieldConfig>;
  actions: Record<string, ActionConfig>;
}

export interface ScopeRoute {
  path: string;
}

export interface NavigatorContract {
  push (path: string, params?: Record<string, unknown>): void;

  back (): void;

  replace (path: string, params?: Record<string, unknown>): void;

  open (route: ScopeRoute, params?: Record<string, unknown>): void;
}

export interface DialogContract {
  confirm (message: string, options?: { destructive?: boolean }): Promise<boolean>;

  alert (message: string): Promise<void>;
}

export interface ToastContract {
  success (message: string): void;

  error (message: string): void;

  warning (message: string): void;

  info (message: string): void;
}

export interface LoadingContract {
  show (): void;

  hide (): void;
}

export interface FormContract {
  errors: Record<string, string[]>;
  dirty: boolean;
  valid: boolean;

  validate (): boolean;

  reset (values?: Record<string, unknown>): void;

  setErrors (errors: Record<string, string[]>): void;
}

export interface ComponentContract {
  scope: ScopeValue;
  scopes: Record<ScopeValue, ScopeRoute>;

  reload (): void;

  navigator: NavigatorContract;
  dialog: DialogContract;
  toast: ToastContract;
  loading: LoadingContract;
}

export interface TableContract {
  page: number;
  limit: number;
  total: number;
  sort?: string;
  order?: "asc" | "desc";
  filters: Record<string, unknown>;
  selected: Record<string, unknown>[];

  reload (): void;

  setPage (page: number): void;

  setFilters (filters: Record<string, unknown>): void;

  clearSelection (): void;
}

export interface PaginateParams {
  page: number;
  limit: number;
  sort?: string;
  order?: "asc" | "desc";
  filters?: Record<string, unknown>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface TranslateContract {
  (key: string, params?: Record<string, unknown>): string
}

export interface HandlerContext {
  state: Record<string, unknown>
  component: ComponentContract
  form?: FormContract
  table?: TableContract
  value?: unknown
}

export interface BootstrapHookContext<_T = Record<string, unknown>> {
  context: Record<string, unknown>
  schema: Record<string, FieldProxy>
  component: ComponentContract
}

export type BootstrapHookFn<_T = Record<string, unknown>> = (ctx: BootstrapHookContext) => void | Promise<void>

export const FetchType = {
  record: 'record',
  collection: 'collection',
} as const

export type FetchTypeValue = typeof FetchType[keyof typeof FetchType]

export type FetchHookContext<T = Record<string, unknown>> =
  | {
      type: 'record'
      context: Record<string, unknown>
      params: PaginateParams
      hydrate(data: T): void
      component: ComponentContract
    }
  | {
      type: 'collection'
      context: Record<string, unknown>
      params: PaginateParams
      hydrate(result: PaginatedResult<T>): void
      component: ComponentContract
    }

export type FetchHookFn<T = Record<string, unknown>> = (ctx: FetchHookContext<T>) => void | Promise<void>

export interface SchemaHooks {
  bootstrap?: Partial<Record<ScopeValue, BootstrapHookFn>>
  fetch?: Partial<Record<ScopeValue, FetchHookFn>>
}

export interface ServiceContract<T = Record<string, unknown>> {
  paginate (params: PaginateParams): Promise<PaginatedResult<T>>;

  read (id: string | number | Record<string, unknown>): Promise<T>;

  create (data: Partial<T>): Promise<T>;

  update (id: string | number | Record<string, unknown>, data: Partial<T>): Promise<T>;

  destroy (id: string | number | Record<string, unknown>): Promise<void>;
}
