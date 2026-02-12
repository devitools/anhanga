import type { ComponentContract, ScopeValue, ScopeRoute } from '@ybyra/core'

function resolvePath (path: string, params?: Record<string, unknown>): string {
  if (!params) return path
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(`:${key}`, String(value)),
    path,
  )
}

type NavigateFn = (url: string, options?: { replaceState?: boolean }) => void

export function createComponent (
  scope: ScopeValue,
  scopes: Record<ScopeValue, ScopeRoute>,
  navigate: NavigateFn,
  base: string = '',
): ComponentContract {
  return {
    scope,
    scopes,
    reload () {},
    navigator: {
      push (path: string, params?: Record<string, unknown>) {
        navigate(base + resolvePath(path, params))
      },
      back () {
        history.back()
      },
      replace (path: string, params?: Record<string, unknown>) {
        navigate(base + resolvePath(path, params), { replaceState: true })
      },
    },
    dialog: {
      async confirm (message: string) { return window.confirm(message) },
      async alert (message: string) { window.alert(message) },
    },
    toast: {
      success (message: string) { window.alert(message) },
      error (message: string) { window.alert(message) },
      warning (message: string) { window.alert(message) },
      info (message: string) { window.alert(message) },
    },
    loading: {
      show () {},
      hide () {},
    },
  }
}
