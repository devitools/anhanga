import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { useSchemaTable, resolveActionLabel } from "@anhanga/react";
import type { UseSchemaTableOptions, ResolvedAction, ResolvedColumn } from "@anhanga/react";
import { theme } from "../theme";
import { ActionBar, ActionButton } from "./ActionBar";

const ds = (id: string) => ({ dataSet: { id } }) as any;

interface SchemaTableProps extends UseSchemaTableOptions {
  grid?: boolean
  debug?: boolean
}

function RowActionButton ({ action, domain }: { action: ResolvedAction; domain: string }) {
  const { t } = useTranslation();
  const color = action.config.variant === "destructive"
    ? theme.colors.destructive
    : theme.colors.mutedForeground;
  return (
    <Pressable style={styles.rowActionButton} onPress={action.execute} {...ds(`row-action:${action.name}`)}>
      {action.config.icon
        ? <Feather name={action.config.icon as any} size={14} color={color} />
        : <Text style={[styles.rowActionText, { color }]}>{resolveActionLabel(t, domain, action.name)}</Text>}
    </Pressable>
  );
}

function ColumnSelector (
  { availableColumns, visibleColumns, toggleColumn, domain }:
  { availableColumns: { name: string }[]; visibleColumns: string[]; toggleColumn: (name: string) => void; domain: string },
) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.columnSelectorContainer}>
      <Pressable style={styles.toolbarButton} onPress={() => setOpen(!open)}>
        <Feather name="columns" size={14} color={theme.colors.mutedForeground} />
        <Text style={styles.toolbarButtonText}>{t("common.table.columns")}</Text>
      </Pressable>
      {open && (
        <View style={styles.columnDropdown}>
          {availableColumns.map((col) => {
            const checked = visibleColumns.includes(col.name);
            return (
              <Pressable key={col.name} style={styles.columnOption} onPress={() => toggleColumn(col.name)}>
                <Feather name={checked ? "check-square" : "square"} size={14} color={theme.colors.foreground} />
                <Text style={styles.columnOptionText}>{t(`${domain}.fields.${col.name}`, { defaultValue: col.name })}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const PAGE_SIZE_OPTIONS = [3, 5, 10, 25, 50];

function Pagination (
  { page, limit, total, totalPages, setPage, setLimit }:
  { page: number; limit: number; total: number; totalPages: number; setPage: (p: number) => void; setLimit: (l: number) => void },
) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <View style={styles.pagination}>
      <View style={styles.paginationStart}>
        <Text style={styles.pageInfo}>{t("common.table.recordsPerPage")}</Text>
        <View style={styles.pageSizeSelector}>
          <Pressable style={styles.pageSizeButton} onPress={() => setOpen(!open)}>
            <Text style={styles.pageSizeButtonText}>{limit}</Text>
            <Feather name="chevron-down" size={12} color={theme.colors.mutedForeground} />
          </Pressable>
          {open && (
            <View style={styles.pageSizeDropdown}>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <Pressable
                  key={size}
                  style={[styles.pageSizeOption, size === limit && styles.pageSizeOptionActive]}
                  onPress={() => { setLimit(size); setOpen(false); }}
                >
                  <Text style={[styles.pageSizeOptionText, size === limit && styles.pageSizeOptionTextActive]}>{size}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.paginationEnd}>
        <Text style={styles.pageInfo}>{start}-{end} of {total}</Text>
        <Pressable
          style={[styles.pageArrow, page <= 1 && styles.pageArrowDisabled]}
          disabled={page <= 1}
          onPress={() => setPage(page - 1)}
        >
          <Feather name="chevron-left" size={16} color={page <= 1 ? theme.colors.mutedForeground : theme.colors.foreground} />
        </Pressable>
        <Pressable
          style={[styles.pageArrow, page >= totalPages && styles.pageArrowDisabled]}
          disabled={page >= totalPages}
          onPress={() => setPage(page + 1)}
        >
          <Feather name="chevron-right" size={16} color={page >= totalPages ? theme.colors.mutedForeground : theme.colors.foreground} />
        </Pressable>
      </View>
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

function columnStyle (col: ResolvedColumn, display?: string | ((r: Record<string, unknown>) => string)) {
  if (typeof col.table.width === "number") return { width: col.table.width };
  if (col.table.width === "auto" && col.name === display) return { flex: 1, minWidth: 150 };
  return { width: 150 };
}

function TableMode ({ table, domain, display }: { table: ReturnType<typeof useSchemaTable>; domain: string; display?: string | ((r: Record<string, unknown>) => string) }) {
  const { t } = useTranslation();
  const { columns, rows, loading, empty, sortField, sortOrder, setSort, isSelected, toggleSelect, selectAll, clearSelection, selected, formatValue, getIdentity, getRowActions } = table;

  const allSelected = rows.length > 0 && selected.length === rows.length;

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
          {columns.map((col) => (
            <Pressable
              key={col.name}
              style={[styles.headerCell, columnStyle(col, display)]}
              onPress={() => col.table.sortable && setSort(col.name)}
              {...ds(`header:${col.name}`)}
            >
              <Text style={styles.headerText}>{t(`${domain}.fields.${col.name}`, { defaultValue: col.name })}</Text>
              {col.table.sortable && <SortIcon field={col.name} sortField={sortField} sortOrder={sortOrder} />}
            </Pressable>
          ))}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        )}

        {empty && (
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={32} color={theme.colors.mutedForeground} />
            <Text style={styles.emptyText}>{t("common.table.empty")}</Text>
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
              <View style={styles.rowActionsCell}>
                {rowActions.map((a) => <RowActionButton key={a.name} action={a} domain={domain} />)}
              </View>
              {columns.map((col) => (
                <View key={col.name} style={[styles.dataCell, columnStyle(col, display)]}>
                  <Text style={styles.cellText} numberOfLines={1}>{formatValue(col.name, row[col.name], row)}</Text>
                </View>
              ))}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function GridMode ({ table, domain }: { table: ReturnType<typeof useSchemaTable>; domain: string }) {
  const { t } = useTranslation();
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
          <Text style={styles.emptyText}>{t("common.table.empty")}</Text>
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
                    <Text style={styles.cardLabel}>{t(`${domain}.fields.${col.name}`, { defaultValue: col.name })}</Text>
                    <Text style={styles.cardValue} numberOfLines={1}>{formatValue(col.name, row[col.name], row)}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.cardActions}>
                {rowActions.map((a) => <RowActionButton key={a.name} action={a} domain={domain} />)}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function SchemaTable ({ grid = false, debug = __DEV__, ...props }: SchemaTableProps) {
  const { t } = useTranslation();
  const domain = props.schema.domain;
  const table = useSchemaTable({ ...props, translate: props.translate ?? t });
  const [debugExpanded, setDebugExpanded] = useState(false);

  return (
    <View {...ds("SchemaTable")}>
      <View style={styles.toolbar}>
        <View style={styles.toolbarStart}>
          {table.actions
            .filter((a) => a.config.positions.includes("top"))
            .map((a) => <ActionButton key={a.name} action={a} domain={domain} />)}
        </View>
        <ColumnSelector
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
        {grid ? <GridMode table={table} domain={domain} /> : <TableMode table={table} domain={domain} display={props.schema.display} />}
      </View>

      <Pagination page={table.page} limit={table.limit} total={table.total} totalPages={table.totalPages} setPage={table.setPage} setLimit={table.setLimit} />

      <ActionBar actions={table.actions} position="footer" domain={domain} />
      <ActionBar actions={table.actions} position="floating" domain={domain} />

      {debug && (
        <View style={styles.debugSection} {...ds("debug")}>
          <View style={styles.debugToolbar}>
            <View style={styles.debugActions}>
              <Pressable style={styles.debugButton} onPress={() => table.reload()}>
                <Feather name="refresh-cw" size={12} color={theme.colors.info} />
              </Pressable>
              <Pressable style={styles.debugButton} onPress={() => table.clearSelection()}>
                <Feather name="x-square" size={12} color={theme.colors.mutedForeground} />
              </Pressable>
              <Pressable style={styles.debugButton} onPress={() => table.clearFilters()}>
                <Feather name="filter" size={12} color={theme.colors.mutedForeground} />
              </Pressable>
              <Pressable style={styles.debugButton} onPress={() => setDebugExpanded((v) => !v)}>
                <Feather name={debugExpanded ? "minus" : "plus"} size={12} color={theme.colors.warning} />
              </Pressable>
            </View>
          </View>

          {debugExpanded && (
            <>
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
            </>
          )}
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
    justifyContent: "flex-end",
    gap: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  paginationStart: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  paginationEnd: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  pageSizeSelector: {
    position: "relative",
    zIndex: 10,
  },
  pageSizeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  pageSizeButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
  },
  pageSizeDropdown: {
    position: "absolute",
    bottom: "100%",
    right: 0,
    marginBottom: 4,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 4,
    minWidth: 60,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  pageSizeOption: {
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  pageSizeOptionActive: {
    backgroundColor: theme.colors.muted,
  },
  pageSizeOptionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    textAlign: "center",
  },
  pageSizeOptionTextActive: {
    fontWeight: theme.fontWeight.semibold,
  },
  pageArrow: {
    padding: 6,
    borderRadius: theme.borderRadius.sm,
  },
  pageArrowDisabled: {
    opacity: 0.4,
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
  debugSection: {
    marginTop: theme.spacing.xxl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.foreground,
    borderRadius: theme.borderRadius.md,
  },
  debugToolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  debugActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  debugButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: "#374151",
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
