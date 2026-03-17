import { useCallback, useState } from 'react'
import type { ScopeValue } from '@ybyra/core'

export interface ListDialogState {
  open: boolean
  scope: ScopeValue
  selectedItem: Record<string, unknown> | null
  selectedIndex: number
}

const CLOSED: ListDialogState = {
  open: false,
  scope: 'add',
  selectedItem: null,
  selectedIndex: -1,
}

export function useListDialog() {
  const [state, setState] = useState<ListDialogState>(CLOSED)

  const openDialog = useCallback(
    (scope: ScopeValue, item: Record<string, unknown> | null, index: number) => {
      setState({ open: true, scope, selectedItem: item, selectedIndex: index })
    },
    [],
  )

  const closeDialog = useCallback(() => {
    setState(CLOSED)
  }, [])

  return [state, openDialog, closeDialog] as const
}
