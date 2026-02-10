import { vi } from 'vitest'
import type { PersistenceContract } from '@anhanga/core'
import type { ComponentContract, FormContract, Scope } from '@anhanga/core'

export function mockDriver (overrides: Partial<PersistenceContract> = {}): PersistenceContract {
  return {
    initialize: vi.fn().mockResolvedValue(undefined),
    create: vi.fn().mockResolvedValue({}),
    read: vi.fn().mockResolvedValue(null),
    update: vi.fn().mockResolvedValue({}),
    destroy: vi.fn().mockResolvedValue(undefined),
    search: vi.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 }),
    ...overrides,
  }
}

export function mockComponent (overrides: Partial<ComponentContract> = {}): ComponentContract {
  return {
    scope: 'index' as typeof Scope.index,
    scopes: {
      index: { path: '/person' },
      add: { path: '/person/add' },
      view: { path: '/person/view' },
      edit: { path: '/person/edit' },
    },
    reload: vi.fn(),
    navigator: {
      push: vi.fn(),
      back: vi.fn(),
      replace: vi.fn(),
    },
    dialog: {
      confirm: vi.fn().mockResolvedValue(true),
      alert: vi.fn().mockResolvedValue(undefined),
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

export function mockForm (overrides: Partial<FormContract> = {}): FormContract {
  return {
    errors: {},
    dirty: false,
    valid: true,
    validate: vi.fn().mockReturnValue(true),
    reset: vi.fn(),
    ...overrides,
  }
}
