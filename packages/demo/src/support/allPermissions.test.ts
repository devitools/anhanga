import { describe, it, expect } from 'vitest'
import { allPermissions } from './allPermissions'
import type { SchemaProvide } from '@ybyra/core'

function makeSchema(overrides: Partial<SchemaProvide> = {}): SchemaProvide {
  return {
    domain: 'person',
    identity: 'id',
    scopes: [],
    groups: {},
    fields: {},
    actions: {},
    ...overrides,
  }
}

describe('allPermissions', () => {
  it('generates scope permissions from schema scopes', () => {
    const schema = makeSchema({
      scopes: ['index', 'add', 'view', 'edit'],
    })
    const result = allPermissions(schema)
    expect(result).toContain('person.scope.index')
    expect(result).toContain('person.scope.add')
    expect(result).toContain('person.scope.view')
    expect(result).toContain('person.scope.edit')
  })

  it('generates action permissions for non-open actions', () => {
    const schema = makeSchema({
      actions: {
        create: { variant: 'primary', positions: [], align: 'end', hidden: false, open: false, scopes: null, order: 0 },
        update: { variant: 'primary', positions: [], align: 'end', hidden: false, open: false, scopes: null, order: 0 },
      },
    })
    const result = allPermissions(schema)
    expect(result).toContain('person.action.create')
    expect(result).toContain('person.action.update')
  })

  it('excludes open actions from permissions', () => {
    const schema = makeSchema({
      actions: {
        add: { variant: 'primary', positions: [], align: 'end', hidden: false, open: true, scopes: null, order: 0 },
        create: { variant: 'primary', positions: [], align: 'end', hidden: false, open: false, scopes: null, order: 0 },
      },
    })
    const result = allPermissions(schema)
    expect(result).not.toContain('person.action.add')
    expect(result).toContain('person.action.create')
  })

  it('returns combined scope and action permissions', () => {
    const schema = makeSchema({
      scopes: ['index', 'add'],
      actions: {
        create: { variant: 'primary', positions: [], align: 'end', hidden: false, open: false, scopes: null, order: 0 },
      },
    })
    const result = allPermissions(schema)
    expect(result).toEqual([
      'person.scope.index',
      'person.scope.add',
      'person.action.create',
    ])
  })

  it('returns empty array when no scopes and no actions', () => {
    const schema = makeSchema()
    expect(allPermissions(schema)).toEqual([])
  })

  it('uses the schema domain for permission keys', () => {
    const schema = makeSchema({
      domain: 'order',
      scopes: ['index'],
      actions: {
        submit: { variant: 'primary', positions: [], align: 'end', hidden: false, open: false, scopes: null, order: 0 },
      },
    })
    const result = allPermissions(schema)
    expect(result).toContain('order.scope.index')
    expect(result).toContain('order.action.submit')
  })
})
