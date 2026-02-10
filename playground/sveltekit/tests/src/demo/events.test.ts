import { describe, it, expect } from 'vitest'
import { personEvents } from '@anhanga/demo'

describe('personEvents', () => {
  describe('active.change', () => {
    it('reverses state.name', () => {
      const state: Record<string, unknown> = { name: 'Alice', active: true }
      const schema: Record<string, Record<string, unknown>> = {
        name: { state: '', width: 0 },
        birthDate: { hidden: false },
        street: { disabled: false },
        city: { disabled: false },
      }
      personEvents.active!.change({ state, schema } as any)
      expect(state.name).toBe('ecilA')
    })

    it('sets schema.name.state to "new"', () => {
      const state: Record<string, unknown> = { name: 'Bob', active: true }
      const schema: Record<string, Record<string, unknown>> = {
        name: { state: '', width: 0 },
        birthDate: { hidden: false },
        street: { disabled: false },
        city: { disabled: false },
      }
      personEvents.active!.change({ state, schema } as any)
      expect(schema.name.state).toBe('new')
    })

    it('toggles birthDate.hidden based on active', () => {
      const schema: Record<string, Record<string, unknown>> = {
        name: { state: '', width: 0 },
        birthDate: { hidden: false },
        street: { disabled: false },
        city: { disabled: false },
      }

      personEvents.active!.change({
        state: { name: 'X', active: false },
        schema,
      } as any)
      expect(schema.birthDate.hidden).toBe(true)

      personEvents.active!.change({
        state: { name: 'X', active: true },
        schema,
      } as any)
      expect(schema.birthDate.hidden).toBe(false)
    })

    it('toggles street/city disabled based on active', () => {
      const schema: Record<string, Record<string, unknown>> = {
        name: { state: '', width: 0 },
        birthDate: { hidden: false },
        street: { disabled: false },
        city: { disabled: false },
      }

      personEvents.active!.change({
        state: { name: 'X', active: false },
        schema,
      } as any)
      expect(schema.street.disabled).toBe(true)
      expect(schema.city.disabled).toBe(true)

      personEvents.active!.change({
        state: { name: 'X', active: true },
        schema,
      } as any)
      expect(schema.street.disabled).toBe(false)
      expect(schema.city.disabled).toBe(false)
    })
  })

  describe('email.blur', () => {
    it('sets schema.email.state to "error" when email has no @', () => {
      const state = { email: 'invalid-email' }
      const schema: Record<string, Record<string, unknown>> = {
        email: { state: '' },
      }
      personEvents.email!.blur({ state, schema } as any)
      expect(schema.email.state).toBe('error')
    })

    it('does not set error state when email contains @', () => {
      const state = { email: 'user@example.com' }
      const schema: Record<string, Record<string, unknown>> = {
        email: { state: '' },
      }
      personEvents.email!.blur({ state, schema } as any)
      expect(schema.email.state).toBe('')
    })
  })
})
