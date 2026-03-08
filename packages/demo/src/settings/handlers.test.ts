import { describe, it, expect, vi } from 'vitest'
import { createDefault } from './handlers'
import { Scope } from '@ybyra/core'
import type { ServiceContract, HandlerContext, ComponentContract, FormContract, TableContract } from '@ybyra/core'

function makeService(): ServiceContract & { create: ReturnType<typeof vi.fn>, update: ReturnType<typeof vi.fn>, destroy: ReturnType<typeof vi.fn> } {
  return {
    paginate: vi.fn(),
    read: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
  }
}

function makeComponent(overrides: Partial<ComponentContract> = {}): ComponentContract {
  return {
    scope: Scope.index,
    scopes: {
      index: { path: '/person' },
      add: { path: '/person/add' },
      view: { path: '/person/:id' },
      edit: { path: '/person/:id/edit' },
    },
    reload: vi.fn(),
    navigator: {
      push: vi.fn(),
      back: vi.fn(),
      replace: vi.fn(),
    },
    dialog: {
      confirm: vi.fn().mockResolvedValue(true),
      alert: vi.fn(),
    },
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    },
    loading: {
      show: vi.fn(),
      hide: vi.fn(),
    },
    ...overrides,
  }
}

describe('createDefault handlers', () => {
  describe('add', () => {
    it('navigates to add path', () => {
      const service = makeService()
      const handlers = createDefault(service)
      const component = makeComponent()
      handlers.add({ state: {}, component } as HandlerContext)
      expect(component.navigator.push).toHaveBeenCalledWith('/person/add')
    })
  })

  describe('view', () => {
    it('navigates to view path with id', () => {
      const service = makeService()
      const handlers = createDefault(service)
      const component = makeComponent()
      handlers.view({ state: { id: '123' }, component } as HandlerContext)
      expect(component.navigator.push).toHaveBeenCalledWith('/person/:id', { id: '123' })
    })
  })

  describe('edit', () => {
    it('navigates to edit path with id', () => {
      const service = makeService()
      const handlers = createDefault(service)
      const component = makeComponent()
      handlers.edit({ state: { id: '456' }, component } as HandlerContext)
      expect(component.navigator.push).toHaveBeenCalledWith('/person/:id/edit', { id: '456' })
    })
  })

  describe('cancel', () => {
    it('navigates to index path', () => {
      const service = makeService()
      const handlers = createDefault(service)
      const component = makeComponent()
      handlers.cancel({ state: {}, component } as HandlerContext)
      expect(component.navigator.push).toHaveBeenCalledWith('/person')
    })
  })

  describe('create', () => {
    it('validates form and creates record on success', () => {
      const service = makeService()
      const handlers = createDefault(service)
      const component = makeComponent()
      const form: FormContract = { errors: {}, dirty: true, valid: true, validate: vi.fn().mockReturnValue(true), reset: vi.fn() }
      handlers.create({ state: { name: 'Alice' }, component, form } as HandlerContext)
      expect(form.validate).toHaveBeenCalled()
      expect(service.create).toHaveBeenCalledWith({ name: 'Alice' })
      expect(component.toast.success).toHaveBeenCalled()
      expect(component.navigator.push).toHaveBeenCalledWith('/person')
    })

    it('shows error toast when validation fails', () => {
      const service = makeService()
      const handlers = createDefault(service)
      const component = makeComponent()
      const form: FormContract = { errors: {}, dirty: true, valid: false, validate: vi.fn().mockReturnValue(false), reset: vi.fn() }
      handlers.create({ state: {}, component, form } as HandlerContext)
      expect(component.toast.error).toHaveBeenCalled()
      expect(service.create).not.toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('validates form and updates record on success', () => {
      const service = makeService()
      const handlers = createDefault(service)
      const component = makeComponent()
      const form: FormContract = { errors: {}, dirty: true, valid: true, validate: vi.fn().mockReturnValue(true), reset: vi.fn() }
      handlers.update({ state: { id: '1', name: 'Bob' }, component, form } as HandlerContext)
      expect(form.validate).toHaveBeenCalled()
      expect(service.update).toHaveBeenCalledWith('1', { id: '1', name: 'Bob' })
      expect(component.toast.success).toHaveBeenCalled()
    })

    it('shows error toast when validation fails', () => {
      const service = makeService()
      const handlers = createDefault(service)
      const component = makeComponent()
      const form: FormContract = { errors: {}, dirty: true, valid: false, validate: vi.fn().mockReturnValue(false), reset: vi.fn() }
      handlers.update({ state: {}, component, form } as HandlerContext)
      expect(component.toast.error).toHaveBeenCalled()
      expect(service.update).not.toHaveBeenCalled()
    })
  })

  describe('destroy', () => {
    it('confirms and destroys record', async () => {
      const service = makeService()
      service.destroy.mockResolvedValue(undefined)
      const handlers = createDefault(service)
      const component = makeComponent()
      const table: TableContract = {
        page: 1, limit: 10, total: 1, filters: {}, selected: [],
        reload: vi.fn(), setPage: vi.fn(), setFilters: vi.fn(), clearSelection: vi.fn(),
      }
      await handlers.destroy({ state: { id: '1' }, component, table } as HandlerContext)
      expect(component.dialog.confirm).toHaveBeenCalled()
      expect(service.destroy).toHaveBeenCalledWith('1')
      expect(component.toast.success).toHaveBeenCalled()
    })

    it('does not destroy when dialog is cancelled', async () => {
      const service = makeService()
      const handlers = createDefault(service)
      const component = makeComponent()
      ;(component.dialog.confirm as ReturnType<typeof vi.fn>).mockResolvedValue(false)
      await handlers.destroy({ state: { id: '1' }, component } as HandlerContext)
      expect(service.destroy).not.toHaveBeenCalled()
    })

    it('reloads table when on index scope', async () => {
      const service = makeService()
      service.destroy.mockResolvedValue(undefined)
      const handlers = createDefault(service)
      const component = makeComponent({ scope: Scope.index })
      const table: TableContract = {
        page: 1, limit: 10, total: 1, filters: {}, selected: [],
        reload: vi.fn(), setPage: vi.fn(), setFilters: vi.fn(), clearSelection: vi.fn(),
      }
      await handlers.destroy({ state: { id: '1' }, component, table } as HandlerContext)
      expect(table.reload).toHaveBeenCalled()
    })

    it('navigates to index when not on index scope', async () => {
      const service = makeService()
      service.destroy.mockResolvedValue(undefined)
      const handlers = createDefault(service)
      const component = makeComponent({ scope: Scope.edit })
      await handlers.destroy({ state: { id: '1' }, component } as HandlerContext)
      expect(component.navigator.push).toHaveBeenCalledWith('/person')
    })
  })
})
