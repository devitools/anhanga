import type { TranslateContract } from '@ybyra/core'

export function resolveFieldLabel (t: TranslateContract, domain: string, field: string, state: string): string {
  if (state) {
    const stateKey = `${domain}.fields.${field}[${state}]`
    const stateResult = t(stateKey)
    if (stateResult !== stateKey) return stateResult
  }
  const baseKey = `${domain}.fields.${field}`
  const baseResult = t(baseKey)
  if (baseResult !== baseKey) return baseResult
  return field
}

export function resolveGroupLabel (t: TranslateContract, domain: string, group: string): string {
  const key = `${domain}.groups.${group}`
  const result = t(key)
  return result !== key ? result : group
}

export function resolveActionLabel (t: TranslateContract, domain: string, action: string): string {
  const domainKey = `${domain}.actions.${action}`
  const domainResult = t(domainKey)
  if (domainResult !== domainKey) return domainResult
  const commonKey = `common.actions.${action}`
  const commonResult = t(commonKey)
  if (commonResult !== commonKey) return commonResult
  return action
}
