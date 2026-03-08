import type { ReactNode, ComponentType } from "react";
import type { ResolvedAction, ResolvedField, UseDataFormReturn, ResolvedColumn } from "@ybyra/react";
import type { FieldProxy, PositionValue, ScopeValue, ActionConfig } from "@ybyra/core";

export interface SlotRendererProps {
  domain: string;
  name: string;
  value: unknown;
  proxy: FieldProxy;
  scope: ScopeValue;
}

export interface ActionButtonProps {
  action: { name: string; config: { variant: string }; execute: () => void };
  domain: string;
}

export interface ActionBarProps {
  actions: { name: string; config: any; execute: () => void }[];
  position: PositionValue;
  domain: string;
}

export interface FieldsGridProps {
  fields: ResolvedField[];
  getFieldProps: UseDataFormReturn["getFieldProps"];
  slots?: Record<string, ComponentType<SlotRendererProps>>;
}

export interface GroupWrapperProps {
  name: string;
  domain: string;
  children: ReactNode;
}

export interface LoadingProps {}

export interface DividerProps {}

export interface DataFormComponents {
  ActionBar?: ComponentType<ActionBarProps>;
  ActionButton?: ComponentType<ActionButtonProps>;
  FieldsGrid?: ComponentType<FieldsGridProps>;
  GroupWrapper?: ComponentType<GroupWrapperProps>;
  Loading?: ComponentType<LoadingProps>;
  Divider?: ComponentType<DividerProps>;
  Slot?: ComponentType<SlotRendererProps>;
}

export interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  setPage: (p: number) => void;
  setLimit: (l: number) => void;
}

export interface ColumnSelectorProps {
  availableColumns: { name: string }[];
  visibleColumns: string[];
  toggleColumn: (name: string) => void;
  domain: string;
}

export interface EmptyStateAction {
  label: string;
  icon?: string;
  onPress: () => void;
}

export interface EmptyStateProps {
  icon?: string | ComponentType<{ className?: string }>;
  title?: string;
  subtitle?: string;
  action?: EmptyStateAction;
}

/** Props passadas pelo consumidor no DataTable — `action` aceita nome ou ActionConfig do schema */
export interface DataTableEmptyStateInput extends Omit<EmptyStateProps, 'action'> {
  action?: string | ActionConfig;
}

export interface HeaderCellProps {
  column: ResolvedColumn;
  domain: string;
  sortField?: string;
  sortOrder?: string;
  onSort: (field: string) => void;
}

export interface DataCellProps {
  column: ResolvedColumn;
  value: unknown;
  formattedValue: string;
  row: Record<string, unknown>;
}

export interface RowActionProps {
  action: ResolvedAction;
  domain: string;
}

export interface CardProps {
  row: Record<string, unknown>;
  columns: ResolvedColumn[];
  rowActions: ResolvedAction[];
  isSelected: boolean;
  toggleSelect: () => void;
  formatValue: (name: string, value: unknown, row: Record<string, unknown>) => string;
  domain: string;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  domain: string;
  placeholder?: string;
}

export interface TextInputProps {
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  placeholder?: string;
  hasError?: boolean;
}

export interface TextareaInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
  hasError?: boolean;
}

export interface SelectInputProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  placeholder?: string;
  hasError?: boolean;
}

export interface DialogButtonProps {
  label: string;
  variant: 'default' | 'destructive' | 'cancel';
  onClick: () => void;
}

export interface DataTableComponents {
  ActionBar?: ComponentType<ActionBarProps>;
  ActionButton?: ComponentType<ActionButtonProps>;
  RowAction?: ComponentType<RowActionProps>;
  Pagination?: ComponentType<PaginationProps>;
  ColumnSelector?: ComponentType<ColumnSelectorProps>;
  EmptyState?: ComponentType<EmptyStateProps>;
  Loading?: ComponentType<LoadingProps>;
  HeaderCell?: ComponentType<HeaderCellProps>;
  DataCell?: ComponentType<DataCellProps>;
  Card?: ComponentType<CardProps>;
  SearchBar?: ComponentType<SearchBarProps>;
}
