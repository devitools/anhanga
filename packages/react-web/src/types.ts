import type { ReactNode, ComponentType } from "react";
import type { ResolvedAction, ResolvedField, UseDataFormReturn, ResolvedColumn } from "@anhanga/react";
import type { PositionValue } from "@anhanga/core";

export interface ActionButtonProps {
  action: { name: string; config: { icon?: string; variant: string }; execute: () => void };
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

export interface EmptyStateProps {}

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
}
