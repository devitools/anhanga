import { describe, it, expect } from 'vitest'
import {
  text, textarea, time, select, multiselect, list, tree,
  date, datetime, number, currency, file, image, toggle, checkbox,
  Text, TextFieldDefinition, TimeFieldDefinition,
  SelectFieldDefinition, MultiSelectFieldDefinition,
  ListFieldDefinition, TreeFieldDefinition,
  DateFieldDefinition, DatetimeFieldDefinition,
  NumberFieldDefinition, CurrencyFieldDefinition,
  FileFieldDefinition, ToggleFieldDefinition, CheckboxFieldDefinition,
} from './fields'
import { action, ActionDefinition } from './action'
import { group, GroupDefinition } from './group'
import { Scope, Position } from './types'

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

describe('action()', () => {
  it('defaults to variant "default"', () => {
    expect(action().toConfig().variant).toBe('default')
  })

  it('condition() adds callback to config', () => {
    const fn = (r: Record<string, unknown>) => r.status === 'pending'
    const config = action().primary().condition(fn).toConfig()
    expect(config.condition).toBe(fn)
  })

  it('config without condition has no condition property', () => {
    expect(action().primary().toConfig().condition).toBeUndefined()
  })

  it.each([
    ['destructive', 'destructive'],
    ['secondary', 'secondary'],
    ['muted', 'muted'],
    ['accent', 'accent'],
    ['success', 'success'],
    ['warning', 'warning'],
    ['info', 'info'],
  ] as const)('%s() sets variant', (method, expected) => {
    const config = (action() as any)[method]().toConfig()
    expect(config.variant).toBe(expected)
  })

  it('positions() sets positions array', () => {
    const config = action().positions(Position.top, Position.footer).toConfig()
    expect(config.positions).toEqual([Position.top, Position.footer])
  })

  it('start() sets align to "start"', () => {
    expect(action().start().toConfig().align).toBe('start')
  })

  it('end() sets align to "end"', () => {
    expect(action().end().toConfig().align).toBe('end')
  })

  it('order() sets order value', () => {
    expect(action().order(5).toConfig().order).toBe(5)
  })

  it('hidden() sets hidden to true', () => {
    expect(action().hidden().toConfig().hidden).toBe(true)
  })

  it('hidden(false) sets hidden to false', () => {
    expect(action().hidden(false).toConfig().hidden).toBe(false)
  })

  it('open() sets open to true', () => {
    expect(action().open().toConfig().open).toBe(true)
  })

  it('open(false) sets open to false', () => {
    expect(action().open(false).toConfig().open).toBe(false)
  })

  it('scopes() restricts to specified scopes', () => {
    const config = action().scopes(Scope.add, Scope.edit).toConfig()
    expect(config.scopes).toEqual([Scope.add, Scope.edit])
  })

  it('excludeScopes() computes complement', () => {
    const config = action().excludeScopes(Scope.index).toConfig()
    expect(config.scopes).toEqual([Scope.add, Scope.view, Scope.edit])
  })

  it('supports method chaining', () => {
    const config = action().primary().start().order(1).positions(Position.top).hidden().toConfig()
    expect(config.variant).toBe('primary')
    expect(config.align).toBe('start')
    expect(config.order).toBe(1)
    expect(config.hidden).toBe(true)
  })
})

describe('FieldDefinition base methods', () => {
  it('hidden() sets form.hidden to true', () => {
    expect(text().hidden().toConfig().form.hidden).toBe(true)
  })

  it('hidden(false) sets form.hidden to false', () => {
    expect(text().hidden(false).toConfig().form.hidden).toBe(false)
  })

  it('disabled() sets form.disabled to true', () => {
    expect(text().disabled().toConfig().form.disabled).toBe(true)
  })

  it('disabled(false) sets form.disabled to false', () => {
    expect(text().disabled(false).toConfig().form.disabled).toBe(false)
  })

  it('order() sets form.order', () => {
    expect(text().order(3).toConfig().form.order).toBe(3)
  })

  it('default() sets defaultValue', () => {
    expect(text().default('hello').toConfig().defaultValue).toBe('hello')
  })

  it('group() sets group key', () => {
    expect(text().group('info').toConfig().group).toBe('info')
  })

  it('scopes() restricts field to specific scopes', () => {
    const config = text().scopes(Scope.add, Scope.edit).toConfig()
    expect(config.scopes).toEqual([Scope.add, Scope.edit])
  })

  it('excludeScopes() computes complement', () => {
    const config = text().excludeScopes(Scope.index).toConfig()
    expect(config.scopes).toEqual([Scope.add, Scope.view, Scope.edit])
  })

  it('states() sets states array', () => {
    expect(text().states('draft', 'published').toConfig().states).toEqual(['draft', 'published'])
  })

  it('column() enables table.show', () => {
    expect(text().column().toConfig().table.show).toBe(true)
  })

  it('column() with config merges into table', () => {
    const config = text().column({ width: 200, align: 'center' }).toConfig()
    expect(config.table.show).toBe(true)
    expect(config.table.width).toBe(200)
    expect(config.table.align).toBe('center')
  })

  it('filterable() sets table.filterable', () => {
    expect(text().filterable().toConfig().table.filterable).toBe(true)
  })

  it('sortable(false) sets table.sortable to false', () => {
    expect(text().sortable(false).toConfig().table.sortable).toBe(false)
  })
})

describe('text().pattern()', () => {
  it('adds pattern validation rule', () => {
    const regex = /^\d+$/
    const config = text().pattern(regex, 'numbers only').toConfig()
    expect(config.validations).toEqual([
      { rule: 'pattern', params: { regex, message: 'numbers only' } },
    ])
  })
})

describe('list().itemSchema()', () => {
  it('stores schema in attrs', () => {
    const fakeSchema = { domain: 'item' } as any
    const config = list().itemSchema(fakeSchema).toConfig()
    expect(config.attrs.itemSchema).toEqual(fakeSchema)
  })
})

describe('date()', () => {
  it('creates a DateFieldDefinition', () => {
    const def = date()
    expect(def).toBeInstanceOf(DateFieldDefinition)
    const config = def.toConfig()
    expect(config.component).toBe('date')
    expect(config.dataType).toBe('date')
  })

  it('min() and max() add date validations', () => {
    const config = date().min('2024-01-01').max('2024-12-31').toConfig()
    expect(config.validations).toEqual([
      { rule: 'minDate', params: { value: '2024-01-01' } },
      { rule: 'maxDate', params: { value: '2024-12-31' } },
    ])
  })
})

describe('datetime()', () => {
  it('creates a DatetimeFieldDefinition', () => {
    const def = datetime()
    expect(def).toBeInstanceOf(DatetimeFieldDefinition)
    const config = def.toConfig()
    expect(config.component).toBe('datetime')
    expect(config.dataType).toBe('datetime')
  })

  it('min() and max() add date validations', () => {
    const config = datetime().min('2024-01-01T00:00').max('2024-12-31T23:59').toConfig()
    expect(config.validations).toEqual([
      { rule: 'minDate', params: { value: '2024-01-01T00:00' } },
      { rule: 'maxDate', params: { value: '2024-12-31T23:59' } },
    ])
  })
})

describe('number()', () => {
  it('creates a NumberFieldDefinition', () => {
    const def = number()
    expect(def).toBeInstanceOf(NumberFieldDefinition)
    const config = def.toConfig()
    expect(config.component).toBe('number')
    expect(config.dataType).toBe('number')
  })

  it('min() and max() add validations', () => {
    const config = number().min(0).max(100).toConfig()
    expect(config.validations).toEqual([
      { rule: 'min', params: { value: 0 } },
      { rule: 'max', params: { value: 100 } },
    ])
  })

  it('precision() sets attrs.precision', () => {
    expect(number().precision(2).toConfig().attrs.precision).toBe(2)
  })
})

describe('currency()', () => {
  it('creates a CurrencyFieldDefinition', () => {
    const def = currency()
    expect(def).toBeInstanceOf(CurrencyFieldDefinition)
    const config = def.toConfig()
    expect(config.component).toBe('currency')
    expect(config.dataType).toBe('number')
  })

  it('min() and max() add validations', () => {
    const config = currency().min(0).max(9999).toConfig()
    expect(config.validations).toEqual([
      { rule: 'min', params: { value: 0 } },
      { rule: 'max', params: { value: 9999 } },
    ])
  })

  it('precision() and prefix() set attrs', () => {
    const config = currency().precision(2).prefix('R$').toConfig()
    expect(config.attrs.precision).toBe(2)
    expect(config.attrs.prefix).toBe('R$')
  })
})

describe('file()', () => {
  it('creates a FileFieldDefinition with component "file"', () => {
    const def = file()
    expect(def).toBeInstanceOf(FileFieldDefinition)
    const config = def.toConfig()
    expect(config.component).toBe('file')
    expect(config.dataType).toBe('file')
  })

  it('accept() sets attrs.accept', () => {
    expect(file().accept('.pdf,.doc').toConfig().attrs.accept).toBe('.pdf,.doc')
  })

  it('maxSize() adds validation', () => {
    const config = file().maxSize(5_000_000).toConfig()
    expect(config.validations).toEqual([
      { rule: 'maxSize', params: { value: 5_000_000 } },
    ])
  })
})

describe('image()', () => {
  it('creates a FileFieldDefinition with component "image"', () => {
    const config = image().toConfig()
    expect(config.component).toBe('image')
    expect(config.dataType).toBe('file')
  })
})

describe('toggle()', () => {
  it('creates a ToggleFieldDefinition', () => {
    const def = toggle()
    expect(def).toBeInstanceOf(ToggleFieldDefinition)
    const config = def.toConfig()
    expect(config.component).toBe('toggle')
    expect(config.dataType).toBe('boolean')
  })
})

describe('checkbox()', () => {
  it('creates a CheckboxFieldDefinition', () => {
    const def = checkbox()
    expect(def).toBeInstanceOf(CheckboxFieldDefinition)
    const config = def.toConfig()
    expect(config.component).toBe('checkbox')
    expect(config.dataType).toBe('boolean')
  })
})

describe('group()', () => {
  it('returns a GroupDefinition', () => {
    expect(group()).toBeInstanceOf(GroupDefinition)
  })

  it('toConfig() returns empty object', () => {
    expect(group().toConfig()).toEqual({})
  })

  it('toConfig() returns a copy', () => {
    const g = group()
    expect(g.toConfig()).not.toBe(g.toConfig())
  })
})
