import { ptBR } from '@anhanga/core'
import { ptBR as local } from './locales/pt-BR'

const messages = { ...ptBR, ...local } as Record<string, unknown>

function walk (obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
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
