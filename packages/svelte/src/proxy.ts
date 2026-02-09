import type { FieldProxy, FieldConfig } from '@anhanga/core'

export interface StateProxyResult {
  proxy: Record<string, unknown>
  getChanges(): Record<string, unknown>
}

export function createStateProxy(snapshot: Record<string, unknown>): StateProxyResult {
  const copy = { ...snapshot }
  const changes: Record<string, unknown> = {}

  const proxy = new Proxy(copy, {
    set(_target, prop, value) {
      const key = String(prop)
      copy[key] = value
      changes[key] = value
      return true
    },
    get(target, prop) {
      return target[String(prop)]
    },
  })

  return {
    proxy,
    getChanges() {
      return { ...changes }
    },
  }
}

export interface SchemaProxyResult {
  proxy: Record<string, FieldProxy>
  getOverrides(): Record<string, Partial<FieldProxy>>
}

export function createSchemaProxy(
  fields: Record<string, FieldConfig>,
  currentOverrides: Record<string, Partial<FieldProxy>>,
): SchemaProxyResult {
  const overrides: Record<string, Partial<FieldProxy>> = {}
  const fieldProxies: Record<string, FieldProxy> = {}

  for (const [name, config] of Object.entries(fields)) {
    const merged: FieldProxy = {
      width: currentOverrides[name]?.width ?? config.form.width,
      height: currentOverrides[name]?.height ?? config.form.height,
      hidden: currentOverrides[name]?.hidden ?? config.form.hidden,
      disabled: currentOverrides[name]?.disabled ?? config.form.disabled,
      state: currentOverrides[name]?.state ?? '',
    }

    fieldProxies[name] = new Proxy(merged, {
      set(_target, prop, value) {
        const key = prop as keyof FieldProxy
        merged[key] = value as never
        if (!overrides[name]) {
          overrides[name] = {}
        }
        ;(overrides[name] as Record<string, unknown>)[key] = value
        return true
      },
    })
  }

  const proxy = new Proxy(fieldProxies, {
    get(target, prop) {
      return target[String(prop)]
    },
  })

  return {
    proxy,
    getOverrides() {
      return overrides
    },
  }
}
