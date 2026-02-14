import { describe, it, expect } from 'vitest'
import { personEvents } from './events'

describe('personEvents', () => {
  it('has active change event', () => {
    expect(personEvents).toHaveProperty('active')
    expect(personEvents.active).toHaveProperty('change')
  })

  it('has email blur event', () => {
    expect(personEvents).toHaveProperty('email')
    expect(personEvents.email).toHaveProperty('blur')
  })

  it('has role change event', () => {
    expect(personEvents).toHaveProperty('role')
    expect(personEvents.role).toHaveProperty('change')
  })

  describe('active.change', () => {
    it('reverses name', () => {
      const state: Record<string, unknown> = { name: 'Alice', active: true }
      const schema: Record<string, Record<string, unknown>> = {
        name: { state: '', width: 100 },
        birthDate: { hidden: false },
        street: { disabled: false },
        city: { disabled: false },
      }
      personEvents.active.change({ state, schema })
      expect(state.name).toBe('ecilA')
    })

    it('sets name state to "new"', () => {
      const state: Record<string, unknown> = { name: 'Alice', active: true }
      const schema: Record<string, Record<string, unknown>> = {
        name: { state: '', width: 100 },
        birthDate: { hidden: false },
        street: { disabled: false },
        city: { disabled: false },
      }
      personEvents.active.change({ state, schema })
      expect(schema.name.state).toBe('new')
    })

    it('hides birthDate when active is false', () => {
      const state: Record<string, unknown> = { name: 'Alice', active: false }
      const schema: Record<string, Record<string, unknown>> = {
        name: { state: '', width: 100 },
        birthDate: { hidden: false },
        street: { disabled: false },
        city: { disabled: false },
      }
      personEvents.active.change({ state, schema })
      expect(schema.birthDate.hidden).toBe(true)
    })

    it('shows birthDate when active is true', () => {
      const state: Record<string, unknown> = { name: 'Alice', active: true }
      const schema: Record<string, Record<string, unknown>> = {
        name: { state: '', width: 100 },
        birthDate: { hidden: true },
        street: { disabled: true },
        city: { disabled: true },
      }
      personEvents.active.change({ state, schema })
      expect(schema.birthDate.hidden).toBe(false)
    })

    it('disables address fields when active is false', () => {
      const state: Record<string, unknown> = { name: 'Alice', active: false }
      const schema: Record<string, Record<string, unknown>> = {
        name: { state: '', width: 100 },
        birthDate: { hidden: false },
        street: { disabled: false },
        city: { disabled: false },
      }
      personEvents.active.change({ state, schema })
      expect(schema.street.disabled).toBe(true)
      expect(schema.city.disabled).toBe(true)
    })
  })

  describe('role.change', () => {
    it('disables tags when role is viewer', () => {
      const state: Record<string, unknown> = { role: 'viewer' }
      const schema: Record<string, Record<string, unknown>> = {
        tags: { disabled: false },
      }
      personEvents.role.change({ state, schema })
      expect(schema.tags.disabled).toBe(true)
    })

    it('enables tags when role is not viewer', () => {
      const state: Record<string, unknown> = { role: 'admin' }
      const schema: Record<string, Record<string, unknown>> = {
        tags: { disabled: true },
      }
      personEvents.role.change({ state, schema })
      expect(schema.tags.disabled).toBe(false)
    })
  })
})
