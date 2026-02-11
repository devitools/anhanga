import { ptBR } from '@anhanga/core'
import { ptBR as local } from './locales/pt-BR'

const messages = { ...ptBR, ...local } as Record<string, unknown>

function walk (obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.')
  let current: unknown = obj
  for (let i = 0; i < parts.length; i++) {
    if (current == null || typeof current !== 'object') return undefined
    const record = current as Record<string, unknown>
    const remaining = parts.slice(i).join('.')
    if (remaining in record && typeof record[remaining] === 'string') {
      return record[remaining] as string
    }
    current = record[parts[i]]
  }
  return typeof current === 'string' ? current : undefined
}

function interpolate (template: string, params: Record<string, unknown>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(params[key] ?? ''))
}

export function translate (key: string, params?: Record<string, unknown>): string {
  const value = walk(messages, key)
  if (value === undefined) return key
  return params ? interpolate(value, params) : value
}

export function hasTranslation (key: string): boolean {
  return walk(messages, key) !== undefined
}
