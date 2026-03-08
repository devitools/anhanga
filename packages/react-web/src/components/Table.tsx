import type React from 'react'
import { useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ResolvedColumn, UseDataTableOptions } from '@ybyra/react'
import { resolveActionIcon, resolveActionLabel, useDataTable } from '@ybyra/react'
import type { ActionConfig } from '@ybyra/core'
import { Position } from '@ybyra/core'
import { useTheme } from '../theme/context'
import type { Theme } from '../theme/default'
import { ActionBar as DefaultActionBar, ActionButton as DefaultActionButton } from './ActionBar'
import { Pagination as DefaultPagination } from './defaults/Pagination'
import { ColumnSelector as DefaultColumnSelector } from './defaults/ColumnSelector'
import { EmptyState as DefaultEmptyState } from './defaults/EmptyState'
import { DebugPanel } from './defaults/DebugPanel'
import { Icon } from '../support/Icon'
import { ds } from '../support/ds'
import type {
  DataTableComponents,
  DataTableEmptyStateInput,
  EmptyStateProps,
  RowActionProps,
  SearchBarProps
} from '../types'
import { usePageActions } from './PageActionsContext'
import { getComponent } from './registry'
import { resolveFieldLabel } from '../support/i18n'
import '../renderers'

interface DataTableProps extends UseDataTableOptions {
  debug?: boolean;
  components?: DataTableComponents;
  selectable?: boolean;
  actionsPosition?: 'start' | 'end';
  showColumnSelector?: boolean;
  showTopActions?: boolean;
  searchSlot?: React.ReactNode;
  emptyState?: DataTableEmptyStateInput;
  value?: Record<string, unknown>[]
}

function DefaultRowAction ({ action, domain }: RowActionProps) {
  const { t } = useTranslation()
  const theme = useTheme()
  const color = action.config.variant === 'destructive'
    ? theme.colors.destructive
    : theme.colors.mutedForeground
  const icon = resolveActionIcon(domain, action.name) as string | undefined

  return (
    <button
      type="button"
      style={{
        padding: 6,
        borderRadius: 6,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
      }}
      onClick={action.execute}
      {...ds(`row-action:${action.name}`)}
    >
      {icon
        ? <Icon
          name={icon}
          size={14}
          color={color}
        />
        : <span style={{ fontSize: 12, color }}>{resolveActionLabel(t, domain, action.name)}</span>}
    </button>
  )
}

function SortIcon ({ field, sortField, sortOrder }: { field: string; sortField?: string; sortOrder?: string }) {
  const theme = useTheme()
  if (sortField !== field) return null
  return (
    <Icon
      name={sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'}
      size={12}
      color={theme.colors.primary}
      style={{ marginLeft: 4 }}
    />
  )
}

function columnWidth (col: ResolvedColumn, display?: string | ((r: Record<string, unknown>) => string)): React.CSSProperties {
  if (typeof col.table.width === 'number') return { width: col.table.width }
  if (col.table.width === 'auto' && col.name === display) return { minWidth: 150 }
  return { width: 150 }
}

function TableContent ({ table, domain, display, components, selectable, actionsPosition, emptyState }: {
  table: ReturnType<typeof useDataTable>;
  domain: string;
  display?: string | ((r: Record<string, unknown>) => string);
  components?: DataTableComponents;
  selectable: boolean;
  actionsPosition: 'start' | 'end';
  emptyState?: EmptyStateProps;
}) {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const styles = createStyles(theme)
  const {
    columns,
    rows,
    loading,
    empty,
    sortField,
    sortOrder,
    setSort,
    isSelected,
    toggleSelect,
    selectAll,
    clearSelection,
    selected,
    formatValue,
    getIdentity,
    getRowActions
  } = table

  const allSelected = rows.length > 0 && selected.length === rows.length
  const RowAction = components?.RowAction ?? getComponent('RowAction') ?? DefaultRowAction
  const LoadingComponent = components?.Loading ?? getComponent('Loading')
  const EmptyComponent = components?.EmptyState ?? getComponent('EmptyState') ?? DefaultEmptyState

  const actionsHeaderCell = (
    <th style={styles.actionsHeaderCell}>
      <span style={styles.headerText}>{t('common.table.actions')}</span>
    </th>
  )

  const actionsDataCell = (row: Record<string, unknown>) => {
    const rowActions = getRowActions(row)
    return (
      <td style={styles.rowActionsCell}>
        {rowActions.map((a) => <RowAction
          key={a.name}
          action={a}
          domain={domain}
        />)}
      </td>
    )
  }

  return (
    <div style={styles.tableScroll}>
      <table style={styles.table} {...ds('table')}>
        <thead>
          <tr style={styles.headerRow}>
            {selectable && (
              <th style={styles.checkboxCell}>
                <button
                  type="button"
                  style={styles.checkboxButton}
                  onClick={() => allSelected ? clearSelection() : selectAll()}
                >
                  <Icon
                    name={allSelected ? 'check-square' : 'square'}
                    size={16}
                    color={theme.colors.foreground}
                  />
                </button>
              </th>
            )}
            {actionsPosition === 'start' && actionsHeaderCell}
            {columns.map((col) => {
              if (components?.HeaderCell) {
                const HeaderCell = components.HeaderCell
                return (
                  <th
                    key={col.name}
                    style={styles.headerCell}
                  >
                    <HeaderCell
                      column={col}
                      domain={domain}
                      sortField={sortField}
                      sortOrder={sortOrder}
                      onSort={setSort}
                    />
                  </th>
                )
              }
              return (
                <th
                  key={col.name}
                  style={{
                    ...styles.headerCell, ...columnWidth(col, display),
                    cursor: col.table.sortable ? 'pointer' : 'default'
                  }}
                  onClick={() => col.table.sortable && setSort(col.name)}
                  {...ds(`header:${col.name}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={styles.headerText}>{resolveFieldLabel(i18n, t, domain, col.name)}</span>
                    {col.table.sortable && <SortIcon
                      field={col.name}
                      sortField={sortField}
                      sortOrder={sortOrder}
                    />}
                  </div>
                </th>
              )
            })}
            {actionsPosition === 'end' && actionsHeaderCell}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0) + 1}
                style={styles.loadingCell}
              >
                {LoadingComponent ? <LoadingComponent /> : 'Loading...'}
              </td>
            </tr>
          )}
          {empty && (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0) + 1}>
                <EmptyComponent {...(emptyState ?? {})} />
              </td>
            </tr>
          )}
          {!loading && rows.map((row) => {
            const id = getIdentity(row)
            return (
              <tr
                key={id}
                style={isSelected(row) ? styles.dataRowSelected : styles.dataRow}
              >
                {selectable && (
                  <td style={styles.checkboxCell}>
                    <button
                      type="button"
                      style={styles.checkboxButton}
                      onClick={() => toggleSelect(row)}
                    >
                      <Icon
                        name={isSelected(row) ? 'check-square' : 'square'}
                        size={16}
                        color={theme.colors.foreground}
                      />
                    </button>
                  </td>
                )}
                {actionsPosition === 'start' && actionsDataCell(row)}
                {columns.map((col) => {
                  if (components?.DataCell) {
                    const DataCell = components.DataCell
                    return (
                      <td
                        key={col.name}
                        style={{ ...styles.dataCell, ...columnWidth(col, display) }}
                      >
                        <DataCell
                          column={col}
                          value={row[col.name]}
                          formattedValue={formatValue(col.name, row[col.name], row)}
                          row={row}
                        />
                      </td>
                    )
                  }
                  return (
                    <td
                      key={col.name}
                      style={{ ...styles.dataCell, ...columnWidth(col, display) }}
                    >
                      <span style={styles.cellText}>{formatValue(col.name, row[col.name], row)}</span>
                    </td>
                  )
                })}
                {actionsPosition === 'end' && actionsDataCell(row)}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function DataTable (dataTableProps: DataTableProps) {
  const {
    debug,
    components,
    selectable = true,
    actionsPosition = 'start',
    showColumnSelector = true,
    showTopActions = true,
    searchSlot,
    emptyState,
    ...props
  } = dataTableProps
  const { t } = useTranslation()
  const theme = useTheme()
  const domain = props.schema.domain
  const table = useDataTable({ ...props, translate: props.translate ?? t })
  const styles = createStyles(theme)
  const pageActions = usePageActions()
  const ResolvedActionBar = components?.ActionBar ?? getComponent('ActionBar') ?? DefaultActionBar
  const ResolvedActionButton = components?.ActionButton ?? getComponent('ActionButton') ?? DefaultActionButton
  const ResolvedPagination = components?.Pagination ?? getComponent('Pagination') ?? DefaultPagination
  const ResolvedColumnSelector = components?.ColumnSelector ?? getComponent('ColumnSelector') ?? DefaultColumnSelector
  const ResolvedSearchBar = components?.SearchBar ?? getComponent('SearchBar') as React.ComponentType<SearchBarProps> | undefined
  const EmptyComponent = components?.EmptyState ?? getComponent('EmptyState') ?? DefaultEmptyState
  const [search, setSearch] = useState('')

  const resolvedEmptyState = useMemo((): EmptyStateProps | undefined => {
    if (!emptyState) return undefined
    const { action, ...rest } = emptyState
    if (!action) return { ...rest }

    if (typeof action === 'string') {
      const resolved = table.actions.find(a => a.name === action)
      if (!resolved) return { ...rest }
      return {
        ...rest,
        action: {
          label: resolveActionLabel(t, domain, resolved.name),
          icon: resolveActionIcon(domain, resolved.name) as string | undefined,
          onPress: resolved.execute,
        },
      }
    }

    // ActionConfig → resolve por match de propriedades com table.actions
    const config = action as ActionConfig
    const resolved = table.actions.find(a =>
      a.config.variant === config.variant &&
      a.config.positions.join() === config.positions.join() &&
      a.config.order === config.order
    )
    if (!resolved) return { ...rest }
    return {
      ...rest,
      action: {
        label: resolveActionLabel(t, domain, resolved.name),
        icon: resolveActionIcon(domain, resolved.name) as string | undefined,
        onPress: resolved.execute,
      },
    }
  }, [emptyState, table.actions, domain, t])

  useLayoutEffect(() => {
    if (!pageActions) return
    const headerActions = table.actions.filter((a) =>
      a.config.positions.includes(Position.header) &&
      !a.config.positions.includes(Position.row)
    )
    if (headerActions.length === 0) return
    pageActions.register(
      <div style={{ display: 'flex', gap: 8 }}>
        {headerActions.map((a) => <ResolvedActionButton
          key={a.name}
          action={a}
          domain={domain}
        />)}
      </div>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageActions, domain])

  if (table.empty && !table.loading) {
    return (
      <div {...ds('DataTable')}>
        <ResolvedActionBar
          actions={table.actions}
          position="top"
          domain={domain}
        />
        <EmptyComponent {...(resolvedEmptyState ?? {})} />
        <ResolvedActionBar
          actions={table.actions}
          position="footer"
          domain={domain}
        />
        <ResolvedActionBar
          actions={table.actions}
          position="floating"
          domain={domain}
        />
        {debug && (
          <DebugPanel
            actions={[{ icon: 'refresh-cw', color: theme.colors.info, onPress: () => table.reload() }]}
            entries={[{ title: 'State', content: 'empty' }]}
          />
        )}
      </div>
    )
  }

  const hasToolbar = showTopActions || showColumnSelector || table.selected.length > 0

  return (
    <div {...ds('DataTable')}>
      {hasToolbar && (
        <div style={styles.toolbar}>
          <div style={styles.toolbarStart}>
            {showTopActions && table.actions
              .filter((a) => a.config.positions.includes('top'))
              .map((a) => <ResolvedActionButton
                key={a.name}
                action={a}
                domain={domain}
              />)}
          </div>
          {showColumnSelector && (
            <ResolvedColumnSelector
              availableColumns={table.availableColumns}
              visibleColumns={table.visibleColumns}
              toggleColumn={table.toggleColumn}
              domain={domain}
            />
          )}
          <div style={styles.toolbarEnd}>
            {table.selected.length > 0 && (
              <span style={styles.selectionInfo}>{t('common.table.selected', { count: table.selected.length })}</span>
            )}
          </div>
        </div>
      )}

      {searchSlot
        ? <div style={styles.searchSlot}>{searchSlot}</div>
        : ResolvedSearchBar
          ? <div style={styles.searchSlot}><ResolvedSearchBar
            value={search}
            onChange={setSearch}
            domain={domain}
          /></div>
          : null
      }

      <div style={styles.tableContainer}>
        <TableContent
          table={table}
          domain={domain}
          display={props.schema.display}
          components={components}
          selectable={selectable}
          actionsPosition={actionsPosition}
          emptyState={resolvedEmptyState}
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

      <ResolvedActionBar
        actions={table.actions}
        position="footer"
        domain={domain}
      />
      <ResolvedActionBar
        actions={table.actions}
        position="floating"
        domain={domain}
      />

      {debug && (
        <DebugPanel
          actions={[
            { icon: 'refresh-cw', color: theme.colors.info, onPress: () => table.reload() },
            { icon: 'x-square', color: theme.colors.mutedForeground, onPress: () => table.clearSelection() },
            { icon: 'filter', color: theme.colors.mutedForeground, onPress: () => table.clearFilters() },
          ]}
          entries={[
            {
              title: `Rows (${table.rows.length})`,
              content: JSON.stringify(table.rows.map((r) => table.getIdentity(r)), null, 2)
            },
            {
              title: `Selected (${table.selected.length})`,
              content: JSON.stringify(table.selected.map((r) => table.getIdentity(r)), null, 2)
            },
            { title: 'Filters', content: JSON.stringify(table.filters, null, 2) },
            { title: 'Schema', content: JSON.stringify(props.schema, null, 2), collapsed: true },
          ]}
          meta={`page: ${table.page}/${table.totalPages} | total: ${table.total} | sort: ${table.sortField ?? 'none'} ${table.sortOrder ?? ''}`}
        />
      )}
    </div>
  )
}

const createStyles = (theme: Theme) => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    zIndex: 10,
    gap: theme.spacing.md,
  },
  toolbarStart: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: theme.spacing.md,
    flex: 1,
  },
  toolbarEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
    flex: 1,
  },
  selectionInfo: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  searchSlot: {
    marginBottom: theme.spacing.md,
  },
  tableContainer: {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    minHeight: 500,
  },
  tableScroll: {
    overflowX: 'auto' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    minWidth: '100%',
  },
  headerRow: {
    backgroundColor: theme.colors.muted,
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  headerCell: {
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
    textAlign: 'left' as const,
    userSelect: 'none' as const,
  },
  headerText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
  },
  actionsHeaderCell: {
    width: 120,
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
    textAlign: 'center' as const,
  },
  checkboxCell: {
    width: 44,
    textAlign: 'center' as const,
    padding: `${theme.spacing.md}px 0`,
    verticalAlign: 'middle' as const,
  },
  checkboxButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
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
    verticalAlign: 'middle' as const,
  },
  cellText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rowActionsCell: {
    width: 120,
    textAlign: 'center' as const,
    verticalAlign: 'middle' as const,
  },
  loadingCell: {
    textAlign: 'center' as const,
    padding: `${theme.spacing.xxl}px 0`,
    color: theme.colors.mutedForeground,
  },
})
