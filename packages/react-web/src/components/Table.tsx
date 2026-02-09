import { useTranslation } from "react-i18next";
import { useDataTable, resolveActionLabel } from "@anhanga/react";
import type { UseDataTableOptions, ResolvedAction, ResolvedColumn } from "@anhanga/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ActionBar, ActionButton } from "./ActionBar";
import { Pagination as DefaultPagination } from "./defaults/Pagination";
import { ColumnSelector as DefaultColumnSelector } from "./defaults/ColumnSelector";
import { EmptyState as DefaultEmptyState } from "./defaults/EmptyState";
import { DebugPanel } from "./defaults/DebugPanel";
import { Icon } from "../support/Icon";
import { ds } from "../support/ds";
import type { DataTableComponents, RowActionProps } from "../types";
import "../renderers";

interface DataTableProps extends UseDataTableOptions {
  debug?: boolean;
  components?: DataTableComponents;
}

function DefaultRowAction({ action, domain }: RowActionProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const color = action.config.variant === "destructive"
    ? theme.colors.destructive
    : theme.colors.mutedForeground;

  return (
    <button
      type="button"
      style={{
        padding: 6,
        borderRadius: 6,
        border: "none",
        background: "none",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
      }}
      onClick={action.execute}
      {...ds(`row-action:${action.name}`)}
    >
      {action.config.icon
        ? <Icon name={action.config.icon} size={14} color={color} />
        : <span style={{ fontSize: 12, color }}>{resolveActionLabel(t, domain, action.name)}</span>}
    </button>
  );
}

function SortIcon({ field, sortField, sortOrder }: { field: string; sortField?: string; sortOrder?: string }) {
  const theme = useTheme();
  if (sortField !== field) return null;
  return (
    <Icon
      name={sortOrder === "asc" ? "chevron-up" : "chevron-down"}
      size={12}
      color={theme.colors.primary}
      style={{ marginLeft: 4 }}
    />
  );
}

function columnWidth(col: ResolvedColumn, display?: string | ((r: Record<string, unknown>) => string)): React.CSSProperties {
  if (typeof col.table.width === "number") return { width: col.table.width };
  if (col.table.width === "auto" && col.name === display) return { minWidth: 150 };
  return { width: 150 };
}

function TableContent({ table, domain, display, components }: {
  table: ReturnType<typeof useDataTable>;
  domain: string;
  display?: string | ((r: Record<string, unknown>) => string);
  components?: DataTableComponents;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  const { columns, rows, loading, empty, sortField, sortOrder, setSort, isSelected, toggleSelect, selectAll, clearSelection, selected, formatValue, getIdentity, getRowActions } = table;

  const allSelected = rows.length > 0 && selected.length === rows.length;
  const RowAction = components?.RowAction ?? DefaultRowAction;
  const LoadingComponent = components?.Loading;
  const EmptyComponent = components?.EmptyState ?? DefaultEmptyState;

  return (
    <div style={styles.tableScroll}>
      <table style={styles.table} {...ds("table")}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.checkboxCell}>
              <button
                type="button"
                style={styles.checkboxButton}
                onClick={() => allSelected ? clearSelection() : selectAll()}
              >
                <Icon name={allSelected ? "check-square" : "square"} size={16} color={theme.colors.foreground} />
              </button>
            </th>
            <th style={styles.actionsHeaderCell}>
              <span style={styles.headerText}>{t("common.table.actions")}</span>
            </th>
            {columns.map((col) => {
              if (components?.HeaderCell) {
                const HeaderCell = components.HeaderCell;
                return (
                  <th key={col.name} style={styles.headerCell}>
                    <HeaderCell
                      column={col}
                      domain={domain}
                      sortField={sortField}
                      sortOrder={sortOrder}
                      onSort={setSort}
                    />
                  </th>
                );
              }
              return (
                <th
                  key={col.name}
                  style={{ ...styles.headerCell, ...columnWidth(col, display), cursor: col.table.sortable ? "pointer" : "default" }}
                  onClick={() => col.table.sortable && setSort(col.name)}
                  {...ds(`header:${col.name}`)}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={styles.headerText}>{t(`${domain}.fields.${col.name}`, { defaultValue: col.name })}</span>
                    {col.table.sortable && <SortIcon field={col.name} sortField={sortField} sortOrder={sortOrder} />}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length + 2} style={styles.loadingCell}>
                {LoadingComponent ? <LoadingComponent /> : "Loading..."}
              </td>
            </tr>
          )}
          {empty && (
            <tr>
              <td colSpan={columns.length + 2}>
                <EmptyComponent />
              </td>
            </tr>
          )}
          {!loading && rows.map((row) => {
            const id = getIdentity(row);
            const rowActions = getRowActions(row);
            return (
              <tr
                key={id}
                style={isSelected(row) ? styles.dataRowSelected : styles.dataRow}
              >
                <td style={styles.checkboxCell}>
                  <button
                    type="button"
                    style={styles.checkboxButton}
                    onClick={() => toggleSelect(row)}
                  >
                    <Icon name={isSelected(row) ? "check-square" : "square"} size={16} color={theme.colors.foreground} />
                  </button>
                </td>
                <td style={styles.rowActionsCell}>
                  {rowActions.map((a) => <RowAction key={a.name} action={a} domain={domain} />)}
                </td>
                {columns.map((col) => {
                  if (components?.DataCell) {
                    const DataCell = components.DataCell;
                    return (
                      <td key={col.name} style={{ ...styles.dataCell, ...columnWidth(col, display) }}>
                        <DataCell
                          column={col}
                          value={row[col.name]}
                          formattedValue={formatValue(col.name, row[col.name], row)}
                          row={row}
                        />
                      </td>
                    );
                  }
                  return (
                    <td key={col.name} style={{ ...styles.dataCell, ...columnWidth(col, display) }}>
                      <span style={styles.cellText}>{formatValue(col.name, row[col.name], row)}</span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function DataTable({ debug, components, ...props }: DataTableProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const domain = props.schema.domain;
  const table = useDataTable({ ...props, translate: props.translate ?? t });
  const styles = createStyles(theme);

  const ResolvedActionBar = components?.ActionBar ?? ActionBar;
  const ResolvedActionButton = components?.ActionButton ?? ActionButton;
  const ResolvedPagination = components?.Pagination ?? DefaultPagination;
  const ResolvedColumnSelector = components?.ColumnSelector ?? DefaultColumnSelector;

  return (
    <div {...ds("DataTable")}>
      <div style={styles.toolbar}>
        <div style={styles.toolbarStart}>
          {table.actions
            .filter((a) => a.config.positions.includes("top"))
            .map((a) => <ResolvedActionButton key={a.name} action={a} domain={domain} />)}
        </div>
        <ResolvedColumnSelector
          availableColumns={table.availableColumns}
          visibleColumns={table.visibleColumns}
          toggleColumn={table.toggleColumn}
          domain={domain}
        />
        <div style={styles.toolbarEnd}>
          {table.selected.length > 0 && (
            <span style={styles.selectionInfo}>{t("common.table.selected", { count: table.selected.length })}</span>
          )}
        </div>
      </div>

      <div style={styles.tableContainer}>
        <TableContent
          table={table}
          domain={domain}
          display={props.schema.display}
          components={components}
        />
      </div>

      <ResolvedPagination
        page={table.page}
        limit={table.limit}
        total={table.total}
        totalPages={table.totalPages}
        setPage={table.setPage}
        setLimit={table.setLimit}
      />

      <ResolvedActionBar actions={table.actions} position="footer" domain={domain} />
      <ResolvedActionBar actions={table.actions} position="floating" domain={domain} />

      {debug && (
        <DebugPanel
          actions={[
            { icon: "refresh-cw", color: theme.colors.info, onPress: () => table.reload() },
            { icon: "x-square", color: theme.colors.mutedForeground, onPress: () => table.clearSelection() },
            { icon: "filter", color: theme.colors.mutedForeground, onPress: () => table.clearFilters() },
          ]}
          entries={[
            { title: `Rows (${table.rows.length})`, content: JSON.stringify(table.rows.map((r) => table.getIdentity(r)), null, 2) },
            { title: `Selected (${table.selected.length})`, content: JSON.stringify(table.selected.map((r) => table.getIdentity(r)), null, 2) },
            { title: "Filters", content: JSON.stringify(table.filters, null, 2) },
          ]}
          meta={`page: ${table.page}/${table.totalPages} | total: ${table.total} | sort: ${table.sortField ?? "none"} ${table.sortOrder ?? ""}`}
        />
      )}
    </div>
  );
}

const createStyles = (theme: Theme) => ({
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
    zIndex: 10,
    gap: theme.spacing.md,
  },
  toolbarStart: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: theme.spacing.md,
    flex: 1,
  },
  toolbarEnd: {
    display: "flex",
    justifyContent: "flex-end",
    flex: 1,
  },
  selectionInfo: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  tableContainer: {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    minHeight: 500,
  },
  tableScroll: {
    overflowX: "auto" as const,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    minWidth: "100%",
  },
  headerRow: {
    backgroundColor: theme.colors.muted,
    borderBottom: `2px solid ${theme.colors.border}`,
  },
  headerCell: {
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
    textAlign: "left" as const,
    userSelect: "none" as const,
  },
  headerText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
  },
  actionsHeaderCell: {
    width: 120,
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
    textAlign: "center" as const,
  },
  checkboxCell: {
    width: 44,
    textAlign: "center" as const,
    padding: `${theme.spacing.md}px 0`,
    verticalAlign: "middle" as const,
  },
  checkboxButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  dataRow: {
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.card,
  },
  dataRowSelected: {
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.muted,
  },
  dataCell: {
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
    verticalAlign: "middle" as const,
  },
  cellText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  rowActionsCell: {
    width: 120,
    textAlign: "center" as const,
    verticalAlign: "middle" as const,
  },
  loadingCell: {
    textAlign: "center" as const,
    padding: `${theme.spacing.xxl}px 0`,
    color: theme.colors.mutedForeground,
  },
});
