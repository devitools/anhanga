import { describe, it, expect, vi } from 'vitest'
import { createDefault } from './hooks'
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

describe('createDefault hooks', () => {
  describe('bootstrap', () => {
    describe('view scope', () => {
      it('hydrates data and disables all fields', async () => {
        const service = makeService()
        const hooks = createDefault(service)
        const hydrate = vi.fn()
        const schema: Record<string, Record<string, unknown>> = {
          name: { disabled: false },
          email: { disabled: false },
        }
        await hooks.bootstrap[Scope.view]!({
          context: { id: '1' },
          hydrate,
          schema,
          component: {} as any,
        })
        expect(service.read).toHaveBeenCalledWith('1')
        expect(hydrate).toHaveBeenCalledWith({ id: '1', name: 'Alice' })
        expect(schema.name.disabled).toBe(true)
        expect(schema.email.disabled).toBe(true)
      })

      it('does nothing when context.id is missing', async () => {
        const service = makeService()
        const hooks = createDefault(service)
        const hydrate = vi.fn()
        await hooks.bootstrap[Scope.view]!({
          context: {},
          hydrate,
          schema: {},
          component: {} as any,
        })
        expect(service.read).not.toHaveBeenCalled()
        expect(hydrate).not.toHaveBeenCalled()
      })
    })

    describe('edit scope', () => {
      it('hydrates data without disabling fields', async () => {
        const service = makeService()
        const hooks = createDefault(service)
        const hydrate = vi.fn()
        const schema: Record<string, Record<string, unknown>> = {
          name: { disabled: false },
        }
        await hooks.bootstrap[Scope.edit]!({
          context: { id: '1' },
          hydrate,
          schema,
          component: {} as any,
        })
        expect(hydrate).toHaveBeenCalledWith({ id: '1', name: 'Alice' })
        expect(schema.name.disabled).toBe(false)
      })

      it('does nothing when context.id is missing', async () => {
        const service = makeService()
        const hooks = createDefault(service)
        const hydrate = vi.fn()
        await hooks.bootstrap[Scope.edit]!({
          context: {},
          hydrate,
          schema: {},
          component: {} as any,
        })
        expect(service.read).not.toHaveBeenCalled()
      })
    })
  })

  describe('fetch', () => {
    describe('index scope', () => {
      it('calls service.paginate with params', async () => {
        const service = makeService()
        const hooks = createDefault(service)
        const params = { page: 1, limit: 10, sort: 'name', order: 'asc' as const }
        await hooks.fetch[Scope.index]!({ params, component: {} as any })
        expect(service.paginate).toHaveBeenCalledWith(params)
      })
    })
  })
})
