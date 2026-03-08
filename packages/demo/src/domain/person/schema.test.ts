import { describe, it, expect } from 'vitest'
import { PersonSchema } from './schema'
import { Scope, Position } from '@ybyra/core'

describe('PersonSchema', () => {
  it('has domain "person"', () => {
    expect(PersonSchema.domain).toBe('person')
  })

  it('has identity "id"', () => {
    expect(PersonSchema.identity).toBe('id')
  })

  it('has display "name"', () => {
    expect(PersonSchema.display).toBe('name')
  })

  it('has all expected scopes', () => {
    expect(PersonSchema.scopes).toContain(Scope.index)
    expect(PersonSchema.scopes).toContain(Scope.add)
    expect(PersonSchema.scopes).toContain(Scope.view)
    expect(PersonSchema.scopes).toContain(Scope.edit)
  })

  describe('groups', () => {
    it('has basic, details, and address groups', () => {
      const groups = PersonSchema.getGroups()
      expect(groups).toHaveProperty('basic')
      expect(groups).toHaveProperty('details')
      expect(groups).toHaveProperty('address')
    })
  })

  describe('fields', () => {
    it('includes inherited id field', () => {
      const fields = PersonSchema.getFields()
      expect(fields).toHaveProperty('id')
    })

    it('includes person-specific fields', () => {
      const fieldNames = Object.keys(PersonSchema.getFields())
      expect(fieldNames).toContain('name')
      expect(fieldNames).toContain('email')
      expect(fieldNames).toContain('phone')
      expect(fieldNames).toContain('birthDate')
      expect(fieldNames).toContain('active')
      expect(fieldNames).toContain('bio')
      expect(fieldNames).toContain('age')
      expect(fieldNames).toContain('role')
      expect(fieldNames).toContain('street')
      expect(fieldNames).toContain('city')
    })

    it('name field has required validation', () => {
      const fields = PersonSchema.getFields()
      expect(fields.name.validations.some((v) => v.rule === 'required')).toBe(true)
    })

    it('email field has email kind', () => {
      const fields = PersonSchema.getFields()
      expect(fields.email.kind).toBe('email')
    })

    it('age field has min/max validations', () => {
      const fields = PersonSchema.getFields()
      expect(fields.age.validations.some((v) => v.rule === 'min')).toBe(true)
      expect(fields.age.validations.some((v) => v.rule === 'max')).toBe(true)
    })

    it('password field has minLength validation', () => {
      const fields = PersonSchema.getFields()
      expect(fields.password.validations.some((v) => v.rule === 'minLength')).toBe(true)
    })

    it('name field is grouped in basic', () => {
      const fields = PersonSchema.getFields()
      expect(fields.name.group).toBe('basic')
    })

    it('bio field is grouped in details', () => {
      const fields = PersonSchema.getFields()
      expect(fields.bio.group).toBe('details')
    })

    it('street field is grouped in address', () => {
      const fields = PersonSchema.getFields()
      expect(fields.street.group).toBe('address')
    })
  })

  describe('actions', () => {
    it('includes inherited CRUD actions', () => {
      const actions = PersonSchema.getActions()
      expect(actions).toHaveProperty('add')
      expect(actions).toHaveProperty('view')
      expect(actions).toHaveProperty('edit')
      expect(actions).toHaveProperty('create')
      expect(actions).toHaveProperty('update')
      expect(actions).toHaveProperty('cancel')
      expect(actions).toHaveProperty('destroy')
    })

    it('includes person-specific custom action', () => {
      const actions = PersonSchema.getActions()
      expect(actions).toHaveProperty('custom')
      expect(actions.custom.variant).toBe('warning')
    })

    it('save action is hidden', () => {
      const actions = PersonSchema.getActions()
      expect(actions.save.hidden).toBe(true)
    })

    it('activate action has row position and index scope', () => {
      const actions = PersonSchema.getActions()
      expect(actions.activate.positions).toContain(Position.row)
      expect(actions.activate.scopes).toContain(Scope.index)
    })

    it('activate action has a condition function', () => {
      const actions = PersonSchema.getActions()
      expect(actions.activate.condition).toBeTypeOf('function')
      expect(actions.activate.condition!({ active: false })).toBe(true)
      expect(actions.activate.condition!({ active: true })).toBe(false)
    })
  })

  describe('provide()', () => {
    it('returns a SchemaProvide object', () => {
      const provided = PersonSchema.provide()
      expect(provided.domain).toBe('person')
      expect(provided.identity).toBe('id')
      expect(provided.fields).toHaveProperty('name')
      expect(provided.actions).toHaveProperty('add')
      expect(provided.groups).toHaveProperty('basic')
    })
  })
})
