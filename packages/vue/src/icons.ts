interface IconNamespace {
  actions?: Record<string, unknown>
  groups?: Record<string, unknown>
}

type IconMap = Record<string, IconNamespace>

let icons: IconMap = {}

export function configureIcons(map: IconMap) {
  icons = map
}

export function resolveActionIcon(domain: string, name: string): unknown {
  return icons[domain]?.actions?.[name] ?? icons.common?.actions?.[name]
}

export function resolveGroupIcon(domain: string, name: string): unknown {
  return icons[domain]?.groups?.[name] ?? icons.common?.groups?.[name]
}
