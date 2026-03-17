import { useMemo, useRef } from 'react'
import type { ComponentContract, SchemaProvide, ScopeRoute, ScopeValue } from '@ybyra/core'
import { Scope } from '@ybyra/core'
import { useDialog } from '../../components/Dialog'

const DEFAULT_SCOPES: Record<string, ScopeRoute> = {
  [Scope.index]: { path: '' },
  [Scope.add]: { path: 'add' },
  [Scope.view]: { path: ':id' },
  [Scope.edit]: { path: ':id/edit' },
}

function inferScope (path: string): ScopeValue | null {
  for (const [key, route] of Object.entries(DEFAULT_SCOPES)) {
    if (path === route.path) return key as ScopeValue
  }
  return null
}

export function useListComponent (
  itemSchema: SchemaProvide,
  value: Record<string, unknown>[],
  openDialog: (scope: ScopeValue, item: Record<string, unknown> | null, index: number) => void,
  closeDialog: () => void,
  triggerReload: () => void,
): ComponentContract {
  const dialog = useDialog()
  const valueRef = useRef(value)
  valueRef.current = value

  return useMemo((): ComponentContract => {
    const identity = Array.isArray(itemSchema?.identity)
      ? itemSchema.identity[0]
      : (itemSchema?.identity ?? 'id')

    function findItem (id: unknown): [Record<string, unknown> | null, number] {
      const idx = valueRef.current.findIndex((item) => item[identity] === id)
      return idx >= 0 ? [valueRef.current[idx], idx] : [null, -1]
    }

    function handleNavigation (path: string, params?: Record<string, unknown>) {
      const scope = inferScope(path)
      if (!scope || scope === Scope.index) {
        closeDialog()
        return
      }
      if (scope === Scope.add) {
        openDialog(Scope.add, null, -1)
        return
      }
      const [item, index] = findItem(params?.id)
      if (item) openDialog(scope, item, index)
    }

    return {
      scope: Scope.index,
      scopes: DEFAULT_SCOPES,
      reload () {
        triggerReload()
      },
      navigator: {
        push (path, params) {
          handleNavigation(path, params)
        },
        back () {
          closeDialog()
        },
        replace (path, params) {
          handleNavigation(path, params)
        },
        open (route, params) {
          handleNavigation(route.path, params)
        },
      },
      dialog,
      toast: {
        success (message) { console.log('[toast.success]', message) },
        error (message) { console.log('[toast.error]', message) },
        warning (message) { console.log('[toast.warning]', message) },
        info (message) { console.log('[toast.info]', message) },
      },
      loading: {
        show () {},
        hide () {},
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemSchema, openDialog, closeDialog, triggerReload, dialog])
}

export { DEFAULT_SCOPES }
