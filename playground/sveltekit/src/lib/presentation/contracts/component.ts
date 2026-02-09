import { goto } from '$app/navigation'
import type { ComponentContract, DialogContract, ScopeValue, ScopeRoute } from '@anhanga/core'

function resolvePath (path: string, params?: Record<string, unknown>): string {
  if (!params) return path
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(`:${key}`, String(value)),
    path,
  )
}

export function createComponent (
  scope: ScopeValue,
  scopes: Record<ScopeValue, ScopeRoute>,
  dialog: DialogContract,
): ComponentContract {
  return {
    scope,
    scopes,
    reload () {},
    navigator: {
      push (path: string, params?: Record<string, unknown>) {
        goto(resolvePath(path, params))
      },
      back () {
        history.back()
      },
      replace (path: string, params?: Record<string, unknown>) {
        goto(resolvePath(path, params), { replaceState: true })
      },
    },
    dialog,
    toast: {
      success (message: string) {
        window.alert(message)
      },
      error (message: string) {
        window.alert(message)
      },
      warning (message: string) {
        window.alert(message)
      },
      info (message: string) {
        window.alert(message)
      },
    },
    loading: {
      show () {},
      hide () {},
    },
  }
}
