import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPersonHandlers } from '@anhanga/demo'
import { mockComponent, mockDriver, mockForm } from '../../support/mocks'
import { createPersonService } from '@anhanga/demo'
import { Scope } from '@anhanga/core'

describe('createPersonHandlers', () => {
  const driver = mockDriver()
  const service = createPersonService(driver)
  let handlers: ReturnType<typeof createPersonHandlers>

  beforeEach(() => {
    vi.clearAllMocks()
    handlers = createPersonHandlers(service)
  })

  it('returns all expected handler keys', () => {
    const keys = Object.keys(handlers)
    expect(keys).toEqual(
      expect.arrayContaining([
        'add', 'view', 'edit', 'create', 'update', 'cancel', 'destroy', 'custom',
      ]),
    )
  })

  it('all handlers are functions', () => {
    for (const handler of Object.values(handlers)) {
      expect(handler).toBeTypeOf('function')
    }
  })

  it('add calls navigator.push with add path', () => {
    const component = mockComponent()
    handlers.add({ state: {}, component } as any)
    expect(component.navigator.push).toHaveBeenCalledWith('/person/add')
  })

  it('view calls navigator.push with view path and id', () => {
    const component = mockComponent()
    handlers.view({ state: { id: '1' }, component } as any)
    expect(component.navigator.push).toHaveBeenCalledWith('/person/view', { id: '1' })
  })

  it('edit calls navigator.push with edit path and id', () => {
    const component = mockComponent()
    handlers.edit({ state: { id: '2' }, component } as any)
    expect(component.navigator.push).toHaveBeenCalledWith('/person/edit', { id: '2' })
  })

  it('cancel calls navigator.push with index path', () => {
    const component = mockComponent()
    handlers.cancel({ state: {}, component } as any)
    expect(component.navigator.push).toHaveBeenCalledWith('/person')
  })

  it('create validates, creates, toasts success, and navigates', () => {
    const component = mockComponent()
    const form = mockForm()
    const state = { name: 'Alice' }
    handlers.create({ state, component, form } as any)
    expect(form.validate).toHaveBeenCalled()
    expect(component.toast.success).toHaveBeenCalledWith('common.actions.create.success')
    expect(component.navigator.push).toHaveBeenCalledWith('/person')
  })

  it('create shows error toast when validation fails', () => {
    const component = mockComponent()
    const form = mockForm({ validate: vi.fn().mockReturnValue(false) })
    handlers.create({ state: {}, component, form } as any)
    expect(component.toast.error).toHaveBeenCalledWith('common.actions.create.invalid')
    expect(component.navigator.push).not.toHaveBeenCalled()
  })

  it('update validates, updates, toasts success, and navigates', () => {
    const component = mockComponent()
    const form = mockForm()
    const state = { id: '1', name: 'Bob' }
    handlers.update({ state, component, form } as any)
    expect(form.validate).toHaveBeenCalled()
    expect(component.toast.success).toHaveBeenCalledWith('common.actions.update.success')
    expect(component.navigator.push).toHaveBeenCalledWith('/person')
  })

  it('update shows error toast when validation fails', () => {
    const component = mockComponent()
    const form = mockForm({ validate: vi.fn().mockReturnValue(false) })
    handlers.update({ state: {}, component, form } as any)
    expect(component.toast.error).toHaveBeenCalledWith('common.actions.update.invalid')
    expect(component.navigator.push).not.toHaveBeenCalled()
  })

  it('destroy confirms dialog, destroys, and navigates when not on index', async () => {
    const component = mockComponent({ scope: Scope.edit })
    const state = { id: '99' }
    await handlers.destroy({ state, component } as any)
    expect(component.dialog.confirm).toHaveBeenCalledWith('common.actions.destroy.confirm')
    expect(component.toast.success).toHaveBeenCalledWith('common.actions.destroy.success')
    expect(component.navigator.push).toHaveBeenCalledWith('/person')
  })

  it('destroy does nothing when dialog is cancelled', async () => {
    const component = mockComponent()
    vi.mocked(component.dialog.confirm).mockResolvedValue(false)
    await handlers.destroy({ state: { id: '1' }, component } as any)
    expect(component.toast.success).not.toHaveBeenCalled()
  })

  it('destroy calls table.reload when scope is index', async () => {
    const component = mockComponent({ scope: Scope.index })
    const table = { reload: vi.fn() }
    await handlers.destroy({ state: { id: '1' }, component, table } as any)
    expect(table.reload).toHaveBeenCalled()
    expect(component.navigator.push).not.toHaveBeenCalled()
  })

  it('custom calls service.custom with state.name', () => {
    const spy = vi.spyOn(service as any, 'custom').mockImplementation(() => {})
    const component = mockComponent()
    handlers.custom({ state: { name: 'Alice' }, component } as any)
    expect(spy).toHaveBeenCalledWith('Alice')
    spy.mockRestore()
  })
})
