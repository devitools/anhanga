import { describe, it, expect } from 'vitest'
import { PersonSchema, allPermissions } from '@anhanga/demo'

const provided = PersonSchema.provide()

describe('PersonSchema', () => {
  it('has domain "person"', () => {
    expect(provided.domain).toBe('person')
  })

  it('has identity "id"', () => {
    expect(provided.identity).toBe('id')
  })

  it('has expected fields', () => {
    const fieldNames = Object.keys(provided.fields)
    expect(fieldNames).toContain('id')
    expect(fieldNames).toContain('name')
    expect(fieldNames).toContain('email')
    expect(fieldNames).toContain('phone')
    expect(fieldNames).toContain('birthDate')
    expect(fieldNames).toContain('active')
    expect(fieldNames).toContain('street')
    expect(fieldNames).toContain('city')
  })

  it('configures name as required, filterable, and column', () => {
    const name = provided.fields.name
    expect(name.validations.some((v) => v.rule === 'required')).toBe(true)
    expect(name.table.filterable).toBe(true)
    expect(name.table.show).toBe(true)
  })

  it('configures email as required', () => {
    const email = provided.fields.email
    expect(email.validations.some((v) => v.rule === 'required')).toBe(true)
  })

  it('configures active with default true', () => {
    expect(provided.fields.active.defaultValue).toBe(true)
  })

  it('has groups: basic and address', () => {
    expect(Object.keys(provided.groups)).toEqual(
      expect.arrayContaining(['basic', 'address']),
    )
  })

  it('has expected actions including save (hidden but present)', () => {
    const actionNames = Object.keys(provided.actions)
    expect(actionNames).toContain('add')
    expect(actionNames).toContain('view')
    expect(actionNames).toContain('edit')
    expect(actionNames).toContain('create')
    expect(actionNames).toContain('update')
    expect(actionNames).toContain('cancel')
    expect(actionNames).toContain('destroy')
    expect(actionNames).toContain('custom')
    expect(actionNames).toContain('save')
    expect(provided.actions.save.hidden).toBe(true)
  })

  it('has expected scopes', () => {
    expect(provided.scopes).toEqual(
      expect.arrayContaining(['index', 'add', 'view', 'edit']),
    )
  })

  it('allPermissions returns domain-scoped permissions', () => {
    expect(allPermissions(provided)).toEqual(
      expect.arrayContaining([
        'person.scope.index',
        'person.scope.add',
        'person.scope.view',
        'person.scope.edit',
        'person.action.create',
        'person.action.update',
        'person.action.destroy',
      ]),
    )
  })
})
