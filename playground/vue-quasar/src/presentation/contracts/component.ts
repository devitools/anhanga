import type { ComponentContract, DialogContract, ScopeValue, ScopeRoute } from '@anhanga/core'
import type { Router } from 'vue-router'
import { Notify, Dialog, Loading } from 'quasar'

function resolvePath (path: string, params?: Record<string, unknown>): string {
  if (!params) return path
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(`:${key}`, String(value)),
    path,
  )
}

let routerInstance: Router | null = null

export function setRouter (router: Router) {
  routerInstance = router
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
        routerInstance?.push(resolvePath(path, params))
      },
      back () {
        routerInstance?.back()
      },
      replace (path: string, params?: Record<string, unknown>) {
        routerInstance?.replace(resolvePath(path, params))
      },
    },
    dialog,
    toast: {
      success (message: string) {
        Notify.create({ type: 'positive', message })
      },
      error (message: string) {
        Notify.create({ type: 'negative', message })
      },
      warning (message: string) {
        Notify.create({ type: 'warning', message })
      },
      info (message: string) {
        Notify.create({ type: 'info', message })
      },
    },
    loading: {
      show () {
        Loading.show()
      },
      hide () {
        Loading.hide()
      },
    },
  }
}
