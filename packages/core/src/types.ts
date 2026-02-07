export const Scope = {
  index: "index",
  add: "add",
  view: "view",
  edit: "edit",
} as const;

export type ScopeValue = typeof Scope[keyof typeof Scope]

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
  icon?: string;
}

export interface ActionConfig {
  icon?: string;
  variant: "default" | "primary" | "destructive" | "secondary" | "muted" | "accent" | "success" | "warning" | "info";
  hidden: boolean;
  validate: boolean;
  scopes: ScopeValue[] | null;
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
  push (path: string): void;

  back (): void;

  replace (path: string): void;
}

export interface DialogContract {
  confirm (message: string): Promise<boolean>;

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

export interface ComponentContract {
  scope: ScopeValue;
  scopes: Record<ScopeValue, ScopeRoute>;

  reload (): void;

  navigator: NavigatorContract;
  dialog: DialogContract;
  toast: ToastContract;
  loading: LoadingContract;
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

export interface ServiceContract<T = Record<string, unknown>> {
  paginate (params: PaginateParams): Promise<PaginatedResult<T>>;

  read (id: string | number | Record<string, unknown>): Promise<T>;

  create (data: Partial<T>): Promise<T>;

  update (id: string | number | Record<string, unknown>, data: Partial<T>): Promise<T>;

  destroy (id: string | number | Record<string, unknown>): Promise<void>;
}
