import { describe, it, expect } from 'vitest'
import { SchemaDefinition, configure } from './schema'
import { text } from './fields/text'
import { number } from './fields/number'
import { toggle } from './fields/toggle'
import { action } from './action'
import { group } from './group'
import { Scope } from './types'

describe('SchemaDefinition', () => {
  const fields = { name: text(), age: number() }

  it('stores domain', () => {
    const schema = new SchemaDefinition('person', { fields })
    expect(schema.domain).toBe('person')
  })

  it('identity getter returns options.identity', () => {
    const schema = new SchemaDefinition('person', { fields, identity: 'id' })
    expect(schema.identity).toBe('id')
  })

  it('identity supports array', () => {
    const schema = new SchemaDefinition('person', { fields, identity: ['id', 'code'] })
    expect(schema.identity).toEqual(['id', 'code'])
  })

  it('display getter returns options.display', () => {
    const schema = new SchemaDefinition('person', { fields, display: 'name' })
    expect(schema.display).toBe('name')
  })

  it('display supports function', () => {
    const fn = (r: Record<string, unknown>) => String(r.name)
    const schema = new SchemaDefinition('person', { fields, display: fn })
    expect(schema.display).toBe(fn)
  })

  it('scopes defaults to all Scope values', () => {
    const schema = new SchemaDefinition('person', { fields })
    expect(schema.scopes).toEqual(Object.values(Scope))
  })

  it('scopes returns provided scopes', () => {
    const schema = new SchemaDefinition('person', { fields, scopes: [Scope.add, Scope.edit] })
    expect(schema.scopes).toEqual([Scope.add, Scope.edit])
  })

  describe('getFields()', () => {
    it('returns config for each field', () => {
      const schema = new SchemaDefinition('person', { fields: { name: text() } })
      const result = schema.getFields()
      expect(result.name.component).toBe('text')
      expect(result.name.dataType).toBe('string')
    })

    it('returns empty when no fields', () => {
      const schema = new SchemaDefinition('person', { fields: {} })
      expect(schema.getFields()).toEqual({})
    })
  })

  describe('getGroups()', () => {
    it('returns empty when no groups', () => {
      const schema = new SchemaDefinition('person', { fields })
      expect(schema.getGroups()).toEqual({})
    })

    it('returns config for each group', () => {
      const schema = new SchemaDefinition('person', { fields, groups: { main: group() } })
      const result = schema.getGroups()
      expect(result).toHaveProperty('main')
    })
  })

  describe('getActions()', () => {
    it('returns empty when no actions', () => {
      const schema = new SchemaDefinition('person', { fields })
      expect(schema.getActions()).toEqual({})
    })

    it('returns config for each action', () => {
      const schema = new SchemaDefinition('person', { fields, actions: { save: action().primary() } })
      const result = schema.getActions()
      expect(result.save.variant).toBe('primary')
    })

    it('skips null entries', () => {
      const schema = new SchemaDefinition('person', { fields, actions: { save: action(), remove: null } })
      const result = schema.getActions()
      expect(result).toHaveProperty('save')
      expect(result).not.toHaveProperty('remove')
    })
  })

  describe('extend()', () => {
    it('creates a new schema merging fields', () => {
      const base = new SchemaDefinition('person', { fields: { name: text() }, identity: 'id' })
      const extended = base.extend('employee', { fields: { active: toggle() } })
      const result = extended.getFields()
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('active')
      expect(extended.domain).toBe('employee')
    })

    it('overrides identity and display when provided', () => {
      const base = new SchemaDefinition('person', { fields, identity: 'id', display: 'name' })
      const extended = base.extend('employee', { identity: 'code', display: 'fullName' })
      expect(extended.identity).toBe('code')
      expect(extended.display).toBe('fullName')
    })

    it('preserves identity and display when extra omits them', () => {
      const base = new SchemaDefinition('person', { fields, identity: 'id', display: 'name' })
      const extended = base.extend('employee', {})
      expect(extended.identity).toBe('id')
      expect(extended.display).toBe('name')
    })

    it('merges groups and actions', () => {
      const base = new SchemaDefinition('person', {
        fields,
        groups: { info: group() },
        actions: { save: action() },
      })
      const extended = base.extend('employee', {
        groups: { extra: group() },
        actions: { cancel: action() },
      })
      expect(extended.getGroups()).toHaveProperty('info')
      expect(extended.getGroups()).toHaveProperty('extra')
      expect(extended.getActions()).toHaveProperty('save')
      expect(extended.getActions()).toHaveProperty('cancel')
    })
  })

  describe('pick()', () => {
    it('returns schema with only selected fields', () => {
      const schema = new SchemaDefinition('person', { fields: { name: text(), age: number(), active: toggle() } })
      const picked = schema.pick('name', 'age')
      const result = picked.getFields()
      expect(Object.keys(result)).toEqual(['name', 'age'])
    })

    it('preserves domain', () => {
      const schema = new SchemaDefinition('person', { fields })
      const picked = schema.pick('name')
      expect(picked.domain).toBe('person')
    })
  })

  describe('omit()', () => {
    it('returns schema without excluded fields', () => {
      const schema = new SchemaDefinition('person', { fields: { name: text(), age: number(), active: toggle() } })
      const omitted = schema.omit('active')
      const result = omitted.getFields()
      expect(Object.keys(result)).toEqual(['name', 'age'])
    })
  })

  describe('events()', () => {
    it('returns bindings unchanged', () => {
      const schema = new SchemaDefinition('person', { fields })
      const bindings = { name: { change: () => {} } }
      expect(schema.events(bindings)).toBe(bindings)
    })
  })

  describe('handlers()', () => {
    it('merges baseHandlers with provided bindings', () => {
      const baseSave = () => {}
      const cancel = () => {}
      const schema = new SchemaDefinition('person', { fields }, { save: baseSave })
      const result = schema.handlers({ cancel } as any)
      expect(result).toHaveProperty('save')
      expect(result).toHaveProperty('cancel')
    })

    it('allows overriding base handlers', () => {
      const original = () => {}
      const override = () => {}
      const schema = new SchemaDefinition('person', { fields }, { save: original })
      const result = schema.handlers({ save: override } as any)
      expect(result.save).toBe(override)
    })
  })

  describe('hooks()', () => {
    it('returns bindings unchanged', () => {
      const schema = new SchemaDefinition('person', { fields })
      const bindings = { bootstrap: {} }
      expect(schema.hooks(bindings)).toBe(bindings)
    })
  })

  describe('provide()', () => {
    it('returns complete SchemaProvide', () => {
      const schema = new SchemaDefinition('person', {
        fields: { name: text() },
        identity: 'id',
        display: 'name',
        groups: { info: group() },
        actions: { save: action().primary() },
      })
      const provided = schema.provide()
      expect(provided.domain).toBe('person')
      expect(provided.identity).toBe('id')
      expect(provided.display).toBe('name')
      expect(provided.scopes).toEqual(Object.values(Scope))
      expect(provided.fields).toHaveProperty('name')
      expect(provided.groups).toHaveProperty('info')
      expect(provided.actions.save.variant).toBe('primary')
    })
  })
})

describe('configure()', () => {
  it('returns a factory with create method', () => {
    const factory = configure({})
    expect(factory).toHaveProperty('create')
    expect(typeof factory.create).toBe('function')
  })

  it('create() merges base actions with schema actions', () => {
    const factory = configure({ actions: { save: action().primary() } })
    const schema = factory.create('person', { fields: { name: text() }, actions: { cancel: action() } })
    const actions = schema.getActions()
    expect(actions).toHaveProperty('save')
    expect(actions).toHaveProperty('cancel')
  })

  it('null action entries remove base actions', () => {
    const factory = configure({ actions: { save: action(), remove: action() } })
    const schema = factory.create('person', { fields: { name: text() }, actions: { remove: null } })
    const actions = schema.getActions()
    expect(actions).toHaveProperty('save')
    expect(actions).not.toHaveProperty('remove')
  })

  it('uses schema identity over base when provided', () => {
    const factory = configure({ identity: 'baseId' })
    const schema = factory.create('person', { fields: { name: text() }, identity: 'customId' })
    expect(schema.identity).toBe('customId')
  })

  it('falls back to base identity', () => {
    const factory = configure({ identity: 'baseId' })
    const schema = factory.create('person', { fields: { name: text() } })
    expect(schema.identity).toBe('baseId')
  })

  it('merges base fields with schema fields', () => {
    const factory = configure({ fields: { active: toggle() } })
    const schema = factory.create('person', { fields: { name: text() } })
    const result = schema.getFields()
    expect(result).toHaveProperty('active')
    expect(result).toHaveProperty('name')
  })

  it('merges base groups with schema groups', () => {
    const factory = configure({ groups: { base: group() } })
    const schema = factory.create('person', { fields: { name: text() }, groups: { extra: group() } })
    const result = schema.getGroups()
    expect(result).toHaveProperty('base')
    expect(result).toHaveProperty('extra')
  })

  it('passes base handlers to SchemaDefinition', () => {
    const baseSave = () => {}
    const factory = configure({ handlers: { save: baseSave } })
    const schema = factory.create('person', { fields: { name: text() } })
    const handlers = schema.handlers({} as any)
    expect(handlers).toHaveProperty('save')
  })

  it('uses base scopes as fallback', () => {
    const factory = configure({ scopes: [Scope.add, Scope.edit] })
    const schema = factory.create('person', { fields: { name: text() } })
    expect(schema.scopes).toEqual([Scope.add, Scope.edit])
  })

  it('uses schema scopes over base', () => {
    const factory = configure({ scopes: [Scope.add, Scope.edit] })
    const schema = factory.create('person', { fields: { name: text() }, scopes: [Scope.view] })
    expect(schema.scopes).toEqual([Scope.view])
  })

  it('uses schema display over base', () => {
    const factory = configure({ display: 'baseName' })
    const schema = factory.create('person', { fields: { name: text() }, display: 'customName' })
    expect(schema.display).toBe('customName')
  })

  it('falls back to base display', () => {
    const factory = configure({ display: 'baseName' })
    const schema = factory.create('person', { fields: { name: text() } })
    expect(schema.display).toBe('baseName')
  })
})
