import { View, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { useDataTable, resolveActionLabel, resolveActionIcon } from "@ybyra/react";
import type { UseDataTableOptions, ResolvedAction, ResolvedColumn } from "@ybyra/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ActionBar, ActionButton } from "./ActionBar";
import { Pagination as DefaultPagination } from "./defaults/Pagination";
import { ColumnSelector as DefaultColumnSelector } from "./defaults/ColumnSelector";
import { EmptyState as DefaultEmptyState } from "./defaults/EmptyState";
import { DebugPanel } from "./defaults/DebugPanel";
import { ds } from "../support/ds";
import type { DataTableComponents, RowActionProps } from "../types";
import "../renderers";

interface DataTableProps extends UseDataTableOptions {
  grid?: boolean;
  debug?: boolean;
  components?: DataTableComponents;
}

function DefaultRowAction({ action, domain }: RowActionProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const color = action.config.variant === "destructive"
    ? theme.colors.destructive
    : theme.colors.mutedForeground;
  const icon = resolveActionIcon(domain, action.name) as string | undefined;
  return (
    <Pressable style={rowActionStyles.button} onPress={action.execute} {...ds(`row-action:${action.name}`)}>
      {icon
        ? <Feather name={icon as any} size={14} color={color} />
        : <Text style={[rowActionStyles.text, { color }]}>{resolveActionLabel(t, domain, action.name)}</Text>}
    </Pressable>
  );
}

const rowActionStyles = StyleSheet.create({
  button: { padding: 6, borderRadius: 6 },
  text: { fontSize: 12 },
});

function SortIcon({ field, sortField, sortOrder }: { field: string; sortField?: string; sortOrder?: string }) {
  const theme = useTheme();
  if (sortField !== field) return null;
  return (
    <Feather
      name={sortOrder === "asc" ? "chevron-up" : "chevron-down"}
      size={12}
      color={theme.colors.primary}
      style={{ marginLeft: 4 }}
    />
  );
}

function columnStyle(col: ResolvedColumn, display?: string | ((r: Record<string, unknown>) => string)) {
  if (typeof col.table.width === "number") return { width: col.table.width };
  if (col.table.width === "auto" && col.name === display) return { flex: 1, minWidth: 150 };
  return { width: 150 };
}

function TableMode({ table, domain, display, components }: {
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
    <ScrollView horizontal contentContainerStyle={styles.tableScrollContent} {...ds("table-scroll")}>
      <View style={styles.tableInner}>
        <View style={styles.headerRow}>
          <Pressable style={styles.checkboxCell} onPress={() => allSelected ? clearSelection() : selectAll()}>
            <Feather name={allSelected ? "check-square" : "square"} size={16} color={theme.colors.foreground} />
          </Pressable>
          <View style={styles.actionsHeaderCell}>
            <Text style={styles.headerText}>{t("common.table.actions")}</Text>
          </View>
          {columns.map((col) => {
            if (components?.HeaderCell) {
              const HeaderCell = components.HeaderCell;
              return (
                <HeaderCell
                  key={col.name}
                  column={col}
                  domain={domain}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={setSort}
                />
              );
            }
            return (
              <Pressable
                key={col.name}
                style={[styles.headerCell, columnStyle(col, display)]}
                onPress={() => col.table.sortable && setSort(col.name)}
                {...ds(`header:${col.name}`)}
              >
                <Text style={styles.headerText}>{t(`${domain}.fields.${col.name}`, { defaultValue: col.name })}</Text>
                {col.table.sortable && <SortIcon field={col.name} sortField={sortField} sortOrder={sortOrder} />}
              </Pressable>
            );
          })}
        </View>

        {loading && (
          LoadingComponent
            ? <LoadingComponent />
            : <View style={styles.loadingContainer}><ActivityIndicator size="small" color={theme.colors.primary} /></View>
        )}

        {empty && <EmptyComponent />}

        {!loading && rows.map((row) => {
          const id = getIdentity(row);
          const rowActions = getRowActions(row);
          return (
            <View key={id} style={[styles.dataRow, isSelected(row) && styles.dataRowSelected]}>
              <Pressable style={styles.checkboxCell} onPress={() => toggleSelect(row)}>
                <Feather name={isSelected(row) ? "check-square" : "square"} size={16} color={theme.colors.foreground} />
              </Pressable>
              <View style={styles.rowActionsCell}>
                {rowActions.map((a) => <RowAction key={a.name} action={a} domain={domain} />)}
              </View>
              {columns.map((col) => {
                if (components?.DataCell) {
                  const DataCell = components.DataCell;
                  return (
                    <DataCell
                      key={col.name}
                      column={col}
                      value={row[col.name]}
                      formattedValue={formatValue(col.name, row[col.name], row)}
                      row={row}
                    />
                  );
                }
                return (
                  <View key={col.name} style={[styles.dataCell, columnStyle(col, display)]}>
                    <Text style={styles.cellText} numberOfLines={1}>{formatValue(col.name, row[col.name], row)}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function GridMode({ table, domain, components }: {
  table: ReturnType<typeof useDataTable>;
  domain: string;
  components?: DataTableComponents;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  const { columns, rows, loading, empty, isSelected, toggleSelect, formatValue, getIdentity, getRowActions } = table;

  const RowAction = components?.RowAction ?? DefaultRowAction;
  const LoadingComponent = components?.Loading;
  const EmptyComponent = components?.EmptyState ?? DefaultEmptyState;

  return (
    <View>
      {loading && (
        LoadingComponent
          ? <LoadingComponent />
          : <View style={styles.loadingContainer}><ActivityIndicator size="small" color={theme.colors.primary} /></View>
      )}

      {empty && <EmptyComponent />}

      <View style={styles.gridContainer}>
        {!loading && rows.map((row) => {
          const id = getIdentity(row);
          const rowActions = getRowActions(row);

          if (components?.Card) {
            const Card = components.Card;
            return (
              <Card
                key={id}
                row={row}
                columns={columns}
                rowActions={rowActions}
                isSelected={isSelected(row)}
                toggleSelect={() => toggleSelect(row)}
                formatValue={formatValue}
                domain={domain}
              />
            );
          }

          return (
            <View key={id} style={[styles.card, isSelected(row) && styles.cardSelected]}>
              <View style={styles.cardHeader}>
                <Pressable onPress={() => toggleSelect(row)}>
                  <Feather name={isSelected(row) ? "check-square" : "square"} size={16} color={theme.colors.foreground} />
                </Pressable>
              </View>
              <View style={styles.cardBody}>
                {columns.map((col) => (
                  <View key={col.name} style={styles.cardField}>
                    <Text style={styles.cardLabel}>{t(`${domain}.fields.${col.name}`, { defaultValue: col.name })}</Text>
                    <Text style={styles.cardValue} numberOfLines={1}>{formatValue(col.name, row[col.name], row)}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.cardActions}>
                {rowActions.map((a) => <RowAction key={a.name} action={a} domain={domain} />)}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function DataTable({ grid = false, debug, components, ...props }: DataTableProps) {
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
    <View {...ds("DataTable")}>
      <View style={styles.toolbar}>
        <View style={styles.toolbarStart}>
          {table.actions
            .filter((a) => a.config.positions.includes("top"))
            .map((a) => <ResolvedActionButton key={a.name} action={a} domain={domain} />)}
        </View>
        <ResolvedColumnSelector
          availableColumns={table.availableColumns}
          visibleColumns={table.visibleColumns}
          toggleColumn={table.toggleColumn}
          domain={domain}
        />
        <View style={styles.toolbarEnd}>
          {table.selected.length > 0 && (
            <Text style={styles.selectionInfo}>{t("common.table.selected", { count: table.selected.length })}</Text>
          )}
        </View>
      </View>

      <View style={styles.tableContainer}>
        {grid
          ? <GridMode table={table} domain={domain} components={components} />
          : <TableMode table={table} domain={domain} display={props.schema.display} components={components} />}
      </View>

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
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
    zIndex: 10,
    gap: theme.spacing.md,
  },
  toolbarStart: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    flex: 1,
  },
  toolbarEnd: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flex: 1,
  },
  selectionInfo: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    minHeight: 500,
  },
  tableScrollContent: {
    flexGrow: 1,
  },
  tableInner: {
    flex: 1,
    minWidth: "100%",
    borderRadius: theme.borderRadius.md,
  } as any,
  headerRow: {
    flexDirection: "row",
    backgroundColor: theme.colors.muted,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
  },
  headerCell: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  headerText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
  },
  actionsHeaderCell: {
    width: 120,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  checkboxCell: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
  },
  dataRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  dataRowSelected: {
    backgroundColor: theme.colors.muted,
  },
  dataCell: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    justifyContent: "center",
  },
  cellText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
  },
  rowActionsCell: {
    width: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  loadingContainer: {
    paddingVertical: theme.spacing.xxl,
    alignItems: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  card: {
    width: 280,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  cardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.muted,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: theme.spacing.sm,
  },
  cardBody: {
    gap: theme.spacing.md,
  },
  cardField: {
    flexDirection: "column",
    gap: 2,
  },
  cardLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    fontWeight: theme.fontWeight.semibold,
  },
  cardValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
  },
});
