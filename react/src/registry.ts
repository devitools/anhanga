import type { FieldRenderer } from './types'

const globalRegistry: Record<string, FieldRenderer> = {}

export function registerRenderers(renderers: Record<string, FieldRenderer>): void {
  Object.assign(globalRegistry, renderers)
}

export function getRenderer(component: string): FieldRenderer | undefined {
  return globalRegistry[component]
}

export interface RendererRegistry {
  register(renderers: Record<string, FieldRenderer>): void
  get(component: string): FieldRenderer | undefined
}

export function createRegistry(): RendererRegistry {
  const registry: Record<string, FieldRenderer> = {}
  return {
    register(renderers: Record<string, FieldRenderer>) {
      Object.assign(registry, renderers)
    },
    get(component: string) {
      return registry[component]
    },
  }
}
