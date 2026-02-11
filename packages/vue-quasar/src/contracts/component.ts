import type { ComponentContract, DialogContract, ScopeValue, ScopeRoute } from '@anhanga/core'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Notify, Dialog, Loading } from 'quasar'

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
  router?: { push: (path: string) => void; back: () => void; replace: (path: string) => void },
): ComponentContract {
  return {
    scope,
    scopes,
    reload () {},
    navigator: {
      push (path: string, params?: Record<string, unknown>) {
        router?.push(resolvePath(path, params))
      },
      back () {
        router?.back()
      },
      replace (path: string, params?: Record<string, unknown>) {
        router?.replace(resolvePath(path, params))
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

export function useComponent (
  scope: ScopeValue,
  scopes: Record<ScopeValue, ScopeRoute>,
): ComponentContract {
  const router = useRouter()
  const { t, te } = useI18n()

  const dialog: DialogContract = {
    confirm (message: string): Promise<boolean> {
      const resolved = te(message) ? t(message) : message
      return new Promise((resolve) => {
        Dialog.create({
          title: te('common.dialog.confirm') ? t('common.dialog.confirm') : 'Confirm',
          message: resolved,
          cancel: true,
          persistent: true,
        })
          .onOk(() => resolve(true))
          .onCancel(() => resolve(false))
          .onDismiss(() => resolve(false))
      })
    },
    alert (message: string): Promise<void> {
      const resolved = te(message) ? t(message) : message
      return new Promise((resolve) => {
        Dialog.create({
          title: te('common.dialog.alert') ? t('common.dialog.alert') : 'Alert',
          message: resolved,
        })
          .onOk(() => resolve())
          .onDismiss(() => resolve())
      })
    },
  }

  return createComponent(scope, scopes, dialog, router)
}
