import { describe, it, expect, vi } from 'vitest'
import { createPersonHandlers } from './handlers'
import { Scope } from '@ybyra/core'
import type { ServiceContract, ComponentContract, HandlerContext } from '@ybyra/core'

function makeService() {
  return {
    paginate: vi.fn(),
    read: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
    custom: vi.fn(),
  }
}

function makeComponent(): ComponentContract {
  return {
    scope: Scope.add,
    scopes: {
      index: { path: '/person' },
      add: { path: '/person/add' },
      view: { path: '/person/:id' },
      edit: { path: '/person/:id/edit' },
    },
    reload: vi.fn(),
    navigator: { push: vi.fn(), back: vi.fn(), replace: vi.fn() },
    dialog: { confirm: vi.fn().mockResolvedValue(true), alert: vi.fn() },
    toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
    loading: { show: vi.fn(), hide: vi.fn() },
  }
}

describe('createPersonHandlers', () => {
  it('includes default CRUD handlers', () => {
    const service = makeService()
    const handlers = createPersonHandlers(service as unknown as ServiceContract)
    expect(handlers).toHaveProperty('add')
    expect(handlers).toHaveProperty('view')
    expect(handlers).toHaveProperty('edit')
    expect(handlers).toHaveProperty('create')
    expect(handlers).toHaveProperty('update')
    expect(handlers).toHaveProperty('destroy')
    expect(handlers).toHaveProperty('cancel')
  })

  it('includes custom handler', () => {
    const service = makeService()
    const handlers = createPersonHandlers(service as unknown as ServiceContract)
    expect(handlers).toHaveProperty('custom')
  })

  it('custom handler calls service.custom with state.name', () => {
    const service = makeService()
    const handlers = createPersonHandlers(service as unknown as ServiceContract)
    const component = makeComponent()
    handlers.custom({ state: { name: 'Alice' }, component } as unknown as HandlerContext)
    expect(service.custom).toHaveBeenCalledWith('Alice')
  })
})
