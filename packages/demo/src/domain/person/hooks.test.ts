import { describe, it, expect, vi } from 'vitest'
import { createPersonHooks } from './hooks'
import { Scope } from '@ybyra/core'
import type { ServiceContract } from '@ybyra/core'

function makeService(): ServiceContract {
  return {
    paginate: vi.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 }),
    read: vi.fn().mockResolvedValue({ id: '1', name: 'Alice' }),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
  }
}

describe('createPersonHooks', () => {
  it('returns hooks with bootstrap and fetch', () => {
    const service = makeService()
    const hooks = createPersonHooks(service)
    expect(hooks).toHaveProperty('bootstrap')
    expect(hooks).toHaveProperty('fetch')
  })

  it('bootstrap has view and edit scopes', () => {
    const service = makeService()
    const hooks = createPersonHooks(service)
    expect(hooks.bootstrap).toHaveProperty(Scope.view)
    expect(hooks.bootstrap).toHaveProperty(Scope.edit)
  })

  it('fetch has index scope', () => {
    const service = makeService()
    const hooks = createPersonHooks(service)
    expect(hooks.fetch).toHaveProperty(Scope.index)
  })

  it('view bootstrap hydrates and disables fields', async () => {
    const service = makeService()
    const hooks = createPersonHooks(service)
    const hydrate = vi.fn()
    const schema: Record<string, Record<string, unknown>> = {
      name: { disabled: false },
    }
    await hooks.bootstrap![Scope.view]!({
      context: { id: '1' },
      hydrate,
      schema,
      component: {} as any,
    })
    expect(hydrate).toHaveBeenCalledWith({ id: '1', name: 'Alice' })
    expect(schema.name.disabled).toBe(true)
  })

  it('edit bootstrap hydrates without disabling', async () => {
    const service = makeService()
    const hooks = createPersonHooks(service)
    const hydrate = vi.fn()
    const schema: Record<string, Record<string, unknown>> = {
      name: { disabled: false },
    }
    await hooks.bootstrap![Scope.edit]!({
      context: { id: '1' },
      hydrate,
      schema,
      component: {} as any,
    })
    expect(hydrate).toHaveBeenCalledWith({ id: '1', name: 'Alice' })
    expect(schema.name.disabled).toBe(false)
  })

  it('fetch index calls service.paginate', async () => {
    const service = makeService()
    const hooks = createPersonHooks(service)
    const params = { page: 1, limit: 10, sort: 'name', order: 'asc' as const }
    await hooks.fetch![Scope.index]!({ params, component: {} as any })
    expect(service.paginate).toHaveBeenCalledWith(params)
  })
})
