import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSchemaTable } from "@anhanga/react";
import type { UseSchemaTableOptions, ResolvedAction } from "@anhanga/react";
import { theme } from "../theme";
import { ActionBar, ActionButton } from "./ActionBar";

const ds = (id: string) => ({ dataSet: { id } }) as any;

interface SchemaTableProps extends UseSchemaTableOptions {
  grid?: boolean
  debug?: boolean
}

function RowActionButton ({ action }: { action: ResolvedAction }) {
  const color = action.config.variant === "destructive"
    ? theme.colors.destructive
    : theme.colors.mutedForeground;
  return (
    <Pressable style={styles.rowActionButton} onPress={action.execute} {...ds(`row-action:${action.name}`)}>
      {action.config.icon
        ? <Feather name={action.config.icon as any} size={14} color={color} />
        : <Text style={[styles.rowActionText, { color }]}>{action.name}</Text>}
    </Pressable>
  );
}

function ColumnSelector (
  { availableColumns, visibleColumns, toggleColumn }:
  { availableColumns: { name: string }[]; visibleColumns: string[]; toggleColumn: (name: string) => void },
) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.columnSelectorContainer}>
      <Pressable style={styles.toolbarButton} onPress={() => setOpen(!open)}>
        <Feather name="columns" size={14} color={theme.colors.mutedForeground} />
        <Text style={styles.toolbarButtonText}>Columns</Text>
      </Pressable>
      {open && (
        <View style={styles.columnDropdown}>
          {availableColumns.map((col) => {
            const checked = visibleColumns.includes(col.name);
            return (
              <Pressable key={col.name} style={styles.columnOption} onPress={() => toggleColumn(col.name)}>
                <Feather name={checked ? "check-square" : "square"} size={14} color={theme.colors.foreground} />
                <Text style={styles.columnOptionText}>{col.name}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

function Pagination (
  { page, totalPages, setPage }:
  { page: number; totalPages: number; setPage: (p: number) => void },
) {
  return (
    <View style={styles.pagination}>
      <Pressable
        style={[styles.pageButton, page <= 1 && styles.pageButtonDisabled]}
        disabled={page <= 1}
        onPress={() => setPage(page - 1)}
      >
        <Text style={[styles.pageButtonText, page <= 1 && styles.pageButtonTextDisabled]}>Previous</Text>
      </Pressable>
      <Text style={styles.pageInfo}>Page {page} of {totalPages}</Text>
      <Pressable
        style={[styles.pageButton, page >= totalPages && styles.pageButtonDisabled]}
        disabled={page >= totalPages}
        onPress={() => setPage(page + 1)}
      >
        <Text style={[styles.pageButtonText, page >= totalPages && styles.pageButtonTextDisabled]}>Next</Text>
      </Pressable>
    </View>
  );
}

function SortIcon ({ field, sortField, sortOrder }: { field: string; sortField?: string; sortOrder?: string }) {
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

function TableMode ({ table }: { table: ReturnType<typeof useSchemaTable> }) {
  const { columns, rows, loading, empty, sortField, sortOrder, setSort, isSelected, toggleSelect, selectAll, clearSelection, selected, formatValue, getIdentity, getRowActions } = table;

  const allSelected = rows.length > 0 && selected.length === rows.length;

  return (
    <ScrollView horizontal {...ds("table-scroll")}>
      <View style={styles.tableInner}>
        <View style={styles.headerRow}>
          <Pressable style={styles.checkboxCell} onPress={() => allSelected ? clearSelection() : selectAll()}>
            <Feather name={allSelected ? "check-square" : "square"} size={16} color={theme.colors.foreground} />
          </Pressable>
          {columns.map((col) => (
            <Pressable
              key={col.name}
              style={[styles.headerCell, { width: typeof col.table.width === "number" ? col.table.width : 150 }]}
              onPress={() => col.table.sortable && setSort(col.name)}
              {...ds(`header:${col.name}`)}
            >
              <Text style={styles.headerText}>{col.name}</Text>
              {col.table.sortable && <SortIcon field={col.name} sortField={sortField} sortOrder={sortOrder} />}
            </Pressable>
          ))}
          <View style={styles.spacer} />
          <View style={styles.actionsHeaderCell}>
            <Text style={styles.headerText}>Actions</Text>
          </View>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        )}

        {empty && (
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={32} color={theme.colors.mutedForeground} />
            <Text style={styles.emptyText}>No records found</Text>
          </View>
        )}

        {!loading && rows.map((row) => {
          const id = getIdentity(row);
          const rowActions = getRowActions(row);
          return (
            <View key={id} style={[styles.dataRow, isSelected(row) && styles.dataRowSelected]}>
              <Pressable style={styles.checkboxCell} onPress={() => toggleSelect(row)}>
                <Feather name={isSelected(row) ? "check-square" : "square"} size={16} color={theme.colors.foreground} />
              </Pressable>
              {columns.map((col) => (
                <View key={col.name} style={[styles.dataCell, { width: typeof col.table.width === "number" ? col.table.width : 150 }]}>
                  <Text style={styles.cellText} numberOfLines={1}>{formatValue(col.name, row[col.name], row)}</Text>
                </View>
              ))}
              <View style={styles.spacer} />
              <View style={styles.rowActionsCell}>
                {rowActions.map((a) => <RowActionButton key={a.name} action={a} />)}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function GridMode ({ table }: { table: ReturnType<typeof useSchemaTable> }) {
  const { columns, rows, loading, empty, isSelected, toggleSelect, formatValue, getIdentity, getRowActions } = table;

  return (
    <View>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      )}

      {empty && (
        <View style={styles.emptyContainer}>
          <Feather name="inbox" size={32} color={theme.colors.mutedForeground} />
          <Text style={styles.emptyText}>No records found</Text>
        </View>
      )}

      <View style={styles.gridContainer}>
        {!loading && rows.map((row) => {
          const id = getIdentity(row);
          const rowActions = getRowActions(row);
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
                    <Text style={styles.cardLabel}>{col.name}</Text>
                    <Text style={styles.cardValue} numberOfLines={1}>{formatValue(col.name, row[col.name], row)}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.cardActions}>
                {rowActions.map((a) => <RowActionButton key={a.name} action={a} />)}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function SchemaTable ({ grid = false, debug = __DEV__, ...props }: SchemaTableProps) {
  const table = useSchemaTable(props);

  return (
    <View {...ds("SchemaTable")}>
      <View style={styles.toolbar}>
        <View style={styles.toolbarStart}>
          {table.actions
            .filter((a) => a.config.positions.includes("top"))
            .map((a) => <ActionButton key={a.name} action={a} />)}
        </View>
        <ColumnSelector
          availableColumns={table.availableColumns}
          visibleColumns={table.visibleColumns}
          toggleColumn={table.toggleColumn}
        />
        <View style={styles.toolbarEnd}>
          {table.selected.length > 0 && (
            <Text style={styles.selectionInfo}>{table.selected.length} selected</Text>
          )}
        </View>
      </View>

      {grid ? <GridMode table={table} /> : <TableMode table={table} />}

      <Pagination page={table.page} totalPages={table.totalPages} setPage={table.setPage} />

      <ActionBar actions={table.actions} position="footer" />
      <ActionBar actions={table.actions} position="floating" />

      {debug && (
        <View style={styles.debugSection} {...ds("debug")}>
          <Text style={styles.debugTitle}>Rows ({table.rows.length})</Text>
          <Text style={styles.debugText}>
            {JSON.stringify(table.rows.map((r) => table.getIdentity(r)), null, 2)}
          </Text>
          <Text style={styles.debugTitle}>Selected ({table.selected.length})</Text>
          <Text style={styles.debugText}>
            {JSON.stringify(table.selected.map((r) => table.getIdentity(r)), null, 2)}
          </Text>
          <Text style={styles.debugTitle}>Filters</Text>
          <Text style={styles.debugText}>
            {JSON.stringify(table.filters, null, 2)}
          </Text>
          <Text style={styles.debugMeta}>
            page: {table.page}/{table.totalPages} | total: {table.total} | sort: {table.sortField ?? "none"} {table.sortOrder ?? ""}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  columnSelectorContainer: {
    position: "relative",
    zIndex: 10,
  },
  toolbarButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  toolbarButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  columnDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    marginTop: 4,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    minWidth: 160,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  columnOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  columnOptionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
  },
  selectionInfo: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  tableInner: {
    minWidth: "100%",
  } as any,
  spacer: {
    flex: 1,
  },
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
    textTransform: "capitalize",
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
  rowActionButton: {
    padding: 6,
    borderRadius: theme.borderRadius.sm,
  },
  rowActionText: {
    fontSize: theme.fontSize.xs,
  },
  loadingContainer: {
    paddingVertical: theme.spacing.xxl,
    alignItems: "center",
  },
  emptyContainer: {
    paddingVertical: theme.spacing.xxl,
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  pageButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  pageButtonDisabled: {
    opacity: 0.4,
  },
  pageButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
  },
  pageButtonTextDisabled: {
    color: theme.colors.mutedForeground,
  },
  pageInfo: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
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
    gap: theme.spacing.xs,
  },
  cardField: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  cardLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    fontWeight: theme.fontWeight.semibold,
    textTransform: "capitalize",
    width: 80,
  },
  cardValue: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.foreground,
    flex: 1,
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
  debugSection: {
    marginTop: theme.spacing.xxl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.foreground,
    borderRadius: theme.borderRadius.md,
  },
  debugTitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.mutedForeground,
    marginBottom: 2,
    marginTop: 10,
  },
  debugText: {
    fontSize: theme.fontSize.xs,
    fontFamily: "monospace",
    color: theme.colors.border,
  },
  debugMeta: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    marginTop: 10,
  },
});
