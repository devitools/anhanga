import { useMemo, useReducer, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { FieldRendererProps } from '@ybyra/react'
import type { SchemaProvide } from '@ybyra/core'
import { Scope } from '@ybyra/core'
import { DataTable } from '../components/Table'
import { DataForm } from '../components/Form'
import { PageActionsContext, usePageActionsState } from '../components/PageActionsContext'
import { useListDialog } from './list/useListDialog'
import { useListComponent } from './list/useListComponent'
import type { Theme } from '../theme/default'
import { useTheme } from '../theme/context'
import { ds } from '../support/ds'
import { useTranslation } from 'react-i18next'

export function ListField (props: FieldRendererProps) {
  const { name, value, config, errors, proxy, onChange, domain } = props

  const { t } = useTranslation()
  const theme = useTheme()
  const styles = createStyles(theme)

  const schema = config.attrs?.itemSchema as SchemaProvide | undefined
  const domainHooks = config.attrs?.hooks as Record<string, unknown> | undefined
  const domainHandlers = config.attrs?.handlers as Record<string, (ctx: unknown) => unknown> | undefined
  const domainEvents = config.attrs?.events as any

  const rawValue = Array.isArray(value) ? value : []
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const reactiveValue = useMemo(() => {
    const arr = [...rawValue] as Record<string, unknown>[]
    arr.push = (...items: Record<string, unknown>[]) => {
      const next = [...rawValue, ...items]
      onChangeRef.current(next)
      return next.length
    }
    arr.splice = (start: number, deleteCount?: number, ...items: Record<string, unknown>[]) => {
      const next = [...rawValue]
      const removed = next.splice(start, deleteCount ?? next.length, ...items)
      onChangeRef.current(next)
      return removed
    }
    return arr
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawValue])
  const fieldLabel = t(`${domain}.fields.${name}`)
  const hasError = errors.length > 0

  const [dialogState, openDialog, closeDialog] = useListDialog()
  const [reloadKey, triggerReload] = useReducer((n: number) => n + 1, 0)
  const { node: headerActions, register } = usePageActionsState()

  const tableComponent = useListComponent(
    schema!,
    rawValue,
    openDialog,
    closeDialog,
    triggerReload,
  )

  const formComponent = useMemo(
    () => ({ ...tableComponent, scope: dialogState.scope }),
    [tableComponent, dialogState.scope],
  )

  const rawValueRef = useRef(rawValue)
  rawValueRef.current = rawValue
  const dialogStateRef = useRef(dialogState)
  dialogStateRef.current = dialogState

  if (!schema || proxy.hidden) return null

  return (
    <div style={styles.container} {...ds(`ListField:${name}`)}>
      <label style={{ ...styles.label, ...(hasError ? styles.labelError : {}) }}>{fieldLabel}</label>
      {headerActions && <div style={styles.headerActions}>{headerActions}</div>}
      <PageActionsContext.Provider value={{ register }}>
        <DataTable
          key={reloadKey}
          schema={schema}
          scope={Scope.index}
          component={tableComponent}
          hooks={domainHooks as any}
          handlers={domainHandlers as any}
          selectable={false}
          actionsPosition="end"
          showColumnSelector={false}
          value={rawValue}
        />
      </PageActionsContext.Provider>

      {dialogState.open && createPortal(
        <div
          style={styles.overlay}
          onClick={closeDialog}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <DataForm
              schema={schema}
              scope={dialogState.scope}
              component={formComponent}
              hooks={domainHooks as any}
              handlers={domainHandlers as any}
              events={domainEvents}
              initialValues={dialogState.selectedItem ?? undefined}
              context={dialogState.selectedItem ?? {}}
              value={reactiveValue}
            />
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}

const createStyles = (theme: Theme) => ({
  container: {
    padding: `0 ${theme.spacing.xs}px`,
  },
  label: {
    display: 'block',
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
    color: theme.colors.foreground,
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing.xs,
  },
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xxl,
    minWidth: 480,
    maxWidth: 640,
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
  },
  labelError: {
    color: theme.colors.destructive,
  },
  errorSlot: {
    minHeight: 20,
    marginTop: 2,
  },
  error: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.destructive,
    margin: 0,
  },
})
