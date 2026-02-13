import { describe, it, expect } from 'vitest'
import {
  text, textarea, time, select, multiselect, list, tree,
  Text, TextFieldDefinition, TimeFieldDefinition,
  SelectFieldDefinition, MultiSelectFieldDefinition,
  ListFieldDefinition, TreeFieldDefinition,
} from './fields'
import { action, ActionDefinition } from './action'

describe('text()', () => {
  it('creates a TextFieldDefinition with component "text"', () => {
    const config = text().toConfig()
    expect(config.component).toBe('text')
    expect(config.dataType).toBe('string')
  })

  it('supports Text.Password kind', () => {
    const config = text().kind(Text.Password).toConfig()
    expect(config.kind).toBe('password')
  })

  it('supports minLength and maxLength', () => {
    const config = text().minLength(3).maxLength(100).toConfig()
    expect(config.validations).toEqual([
      { rule: 'minLength', params: { value: 3 } },
      { rule: 'maxLength', params: { value: 100 } },
    ])
  })
})

describe('Text kinds', () => {
  it('includes Password in the Text object', () => {
    expect(Text.Password).toBe('password')
    expect(Text.Email).toBe('email')
  })
})

describe('textarea()', () => {
  it('creates a TextFieldDefinition with component "textarea"', () => {
    const def = textarea()
    expect(def).toBeInstanceOf(TextFieldDefinition)
    const config = def.toConfig()
    expect(config.component).toBe('textarea')
    expect(config.dataType).toBe('string')
  })

  it('supports height and maxLength', () => {
    const config = textarea().height(4).maxLength(2000).toConfig()
    expect(config.form.height).toBe(4)
    expect(config.validations).toEqual([
      { rule: 'maxLength', params: { value: 2000 } },
    ])
  })
})

describe('time()', () => {
  it('creates a TimeFieldDefinition', () => {
    const def = time()
    expect(def).toBeInstanceOf(TimeFieldDefinition)
    const config = def.toConfig()
    expect(config.component).toBe('time')
    expect(config.dataType).toBe('time')
  })

  it('supports min and max time validation', () => {
    const config = time().min('08:00').max('18:00').toConfig()
    expect(config.validations).toEqual([
      { rule: 'minTime', params: { value: '08:00' } },
      { rule: 'maxTime', params: { value: '18:00' } },
    ])
  })
})

describe('select()', () => {
  it('creates a SelectFieldDefinition', () => {
    const def = select()
    expect(def).toBeInstanceOf(SelectFieldDefinition)
    const config = def.toConfig()
    expect(config.component).toBe('select')
    expect(config.dataType).toBe('string')
  })

  it('stores options as attrs when passed as array', () => {
    const config = select(['admin', 'editor', 'viewer']).toConfig()
    expect(config.attrs.options).toEqual(['admin', 'editor', 'viewer'])
  })

  it('accepts numeric options', () => {
    const config = select([1, 2, 3]).toConfig()
    expect(config.attrs.options).toEqual([1, 2, 3])
  })

  it('has no options attr when called without arguments', () => {
    const config = select().toConfig()
    expect(config.attrs.options).toBeUndefined()
  })

  it('supports required validation', () => {
    const config = select(['a', 'b']).required().toConfig()
    expect(config.validations).toEqual([{ rule: 'required' }])
  })
})

describe('multiselect()', () => {
  it('creates a MultiSelectFieldDefinition', () => {
    const def = multiselect()
    expect(def).toBeInstanceOf(MultiSelectFieldDefinition)
    const config = def.toConfig()
    expect(config.component).toBe('multiselect')
    expect(config.dataType).toBe('array')
  })

  it('stores options as attrs when passed as array', () => {
    const config = multiselect(['frontend', 'backend', 'devops']).toConfig()
    expect(config.attrs.options).toEqual(['frontend', 'backend', 'devops'])
  })

  it('accepts numeric options', () => {
    const config = multiselect([10, 20, 30]).toConfig()
    expect(config.attrs.options).toEqual([10, 20, 30])
  })

  it('has no options attr when called without arguments', () => {
    const config = multiselect().toConfig()
    expect(config.attrs.options).toBeUndefined()
  })

  it('supports required validation', () => {
    const config = multiselect().required().toConfig()
    expect(config.validations).toEqual([{ rule: 'required' }])
  })
})

describe('list()', () => {
  it('creates a ListFieldDefinition', () => {
    const def = list()
    expect(def).toBeInstanceOf(ListFieldDefinition)
    const config = def.toConfig()
    expect(config.component).toBe('list')
    expect(config.dataType).toBe('array')
  })

  it('supports reorderable', () => {
    const config = list().reorderable().toConfig()
    expect(config.attrs.reorderable).toBe(true)
  })

  it('supports minItems and maxItems', () => {
    const config = list().minItems(1).maxItems(10).toConfig()
    expect(config.validations).toEqual([
      { rule: 'minItems', params: { value: 1 } },
      { rule: 'maxItems', params: { value: 10 } },
    ])
  })
})

describe('tree()', () => {
  it('creates a TreeFieldDefinition extending ListFieldDefinition', () => {
    const def = tree()
    expect(def).toBeInstanceOf(TreeFieldDefinition)
    expect(def).toBeInstanceOf(ListFieldDefinition)
    const config = def.toConfig()
    expect(config.component).toBe('tree')
    expect(config.dataType).toBe('array')
  })

  it('supports childrenKey and maxDepth', () => {
    const config = tree().childrenKey('items').maxDepth(3).toConfig()
    expect(config.attrs.childrenKey).toBe('items')
    expect(config.attrs.maxDepth).toBe(3)
  })

  it('inherits reorderable from ListFieldDefinition', () => {
    const config = tree().reorderable().toConfig()
    expect(config.attrs.reorderable).toBe(true)
  })
})

describe('action().condition()', () => {
  it('adds condition callback to config', () => {
    const fn = (r: Record<string, unknown>) => r.status === 'pending'
    const config = action().primary().condition(fn).toConfig()
    expect(config.condition).toBe(fn)
  })

  it('config without condition has no condition property', () => {
    const config = action().primary().toConfig()
    expect(config.condition).toBeUndefined()
  })
})
