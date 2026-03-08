import type { ComponentType } from "react";
import type {
  ActionButtonProps,
  ActionBarProps,
  FieldsGridProps,
  GroupWrapperProps,
  LoadingProps,
  DividerProps,
  PaginationProps,
  ColumnSelectorProps,
  EmptyStateProps,
  HeaderCellProps,
  DataCellProps,
  RowActionProps,
  CardProps,
  SearchBarProps,
  TextInputProps,
  TextareaInputProps,
  SelectInputProps,
  DialogButtonProps,
} from "../types";

export interface ComponentRegistry {
  ActionButton?: ComponentType<ActionButtonProps>;
  ActionBar?: ComponentType<ActionBarProps>;
  FieldsGrid?: ComponentType<FieldsGridProps>;
  GroupWrapper?: ComponentType<GroupWrapperProps>;
  Loading?: ComponentType<LoadingProps>;
  Divider?: ComponentType<DividerProps>;
  Pagination?: ComponentType<PaginationProps>;
  ColumnSelector?: ComponentType<ColumnSelectorProps>;
  EmptyState?: ComponentType<EmptyStateProps>;
  HeaderCell?: ComponentType<HeaderCellProps>;
  DataCell?: ComponentType<DataCellProps>;
  RowAction?: ComponentType<RowActionProps>;
  Card?: ComponentType<CardProps>;
  SearchBar?: ComponentType<SearchBarProps>;
  TextInput?: ComponentType<TextInputProps>;
  TextareaInput?: ComponentType<TextareaInputProps>;
  SelectInput?: ComponentType<SelectInputProps>;
  DialogButton?: ComponentType<DialogButtonProps>;
}

const globalComponents: ComponentRegistry = {};

export function registerComponents(components: Partial<ComponentRegistry>): void {
  Object.assign(globalComponents, components);
}

export function getComponent<K extends keyof ComponentRegistry>(key: K): ComponentRegistry[K] | undefined {
  return globalComponents[key];
}
