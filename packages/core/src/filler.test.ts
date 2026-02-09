import { describe, it, expect, vi } from 'vitest'
import { createFiller, fill, defaultFillers } from './filler'
import type { FillerRegistry } from './filler'
import type { FieldConfig } from './types'

function makeFieldConfig(overrides: Partial<FieldConfig> = {}): FieldConfig {
  return {
    component: 'text',
    dataType: 'string',
    attrs: {},
    form: { width: 100, height: 1, hidden: false, disabled: false, order: 0 },
    table: { show: false, width: 'auto', sortable: false, filterable: false, order: 0 },
    validations: [],
    scopes: null,
    states: [],
    defaultValue: undefined,
    ...overrides,
  }
}

describe('createFiller', () => {
  it('returns a function', () => {
    const fillerFn = createFiller({})
    expect(fillerFn).toBeTypeOf('function')
  })

  it('calls registry by component type', () => {
    const textFiller = vi.fn().mockReturnValue('fake name')
    const registry: FillerRegistry = { text: textFiller }
    const fillerFn = createFiller(registry)

    const fields = { name: makeFieldConfig({ component: 'text' }) }
    const result = fillerFn(fields)

    expect(textFiller).toHaveBeenCalledWith(fields.name)
    expect(result).toEqual({ name: 'fake name' })
  })

  it('skips identity fields (string)', () => {
    const registry: FillerRegistry = { text: () => 'value' }
    const fillerFn = createFiller(registry)

    const fields = {
      id: makeFieldConfig({ component: 'text' }),
      name: makeFieldConfig({ component: 'text' }),
    }
    const result = fillerFn(fields, 'id')

    expect(result).not.toHaveProperty('id')
    expect(result).toHaveProperty('name')
  })

  it('skips identity fields (array)', () => {
    const registry: FillerRegistry = { text: () => 'value' }
    const fillerFn = createFiller(registry)

    const fields = {
      id: makeFieldConfig({ component: 'text' }),
      uuid: makeFieldConfig({ component: 'text' }),
      name: makeFieldConfig({ component: 'text' }),
    }
    const result = fillerFn(fields, ['id', 'uuid'])

    expect(result).not.toHaveProperty('id')
    expect(result).not.toHaveProperty('uuid')
    expect(result).toHaveProperty('name')
  })

  it('omits fields without registry match', () => {
    const registry: FillerRegistry = { text: () => 'value' }
    const fillerFn = createFiller(registry)

    const fields = {
      name: makeFieldConfig({ component: 'text' }),
      custom: makeFieldConfig({ component: 'unknown' }),
    }
    const result = fillerFn(fields)

    expect(result).toHaveProperty('name')
    expect(result).not.toHaveProperty('custom')
  })

  it('omits when FillerFn returns undefined', () => {
    const registry: FillerRegistry = { text: () => undefined }
    const fillerFn = createFiller(registry)

    const fields = { name: makeFieldConfig({ component: 'text' }) }
    const result = fillerFn(fields)

    expect(result).not.toHaveProperty('name')
  })
})

describe('defaultFillers', () => {
  it('generates string for text', () => {
    const value = defaultFillers.text(makeFieldConfig({ component: 'text' }))
    expect(value).toBeTypeOf('string')
    expect(value).not.toBe('')
  })

  it('generates email for text with email kind', () => {
    const value = defaultFillers.text(makeFieldConfig({ component: 'text', kind: 'email' }))
    expect(value).toBeTypeOf('string')
    expect(value as string).toContain('@')
  })

  it('generates number for number', () => {
    const value = defaultFillers.number(makeFieldConfig({ component: 'number' }))
    expect(value).toBeTypeOf('number')
  })

  it('respects min/max for number', () => {
    const value = defaultFillers.number(makeFieldConfig({
      component: 'number',
      validations: [
        { rule: 'min', params: { value: 10 } },
        { rule: 'max', params: { value: 20 } },
      ],
    }))
    expect(value).toBeTypeOf('number')
    expect(value as number).toBeGreaterThanOrEqual(10)
    expect(value as number).toBeLessThanOrEqual(20)
  })

  it('generates number for currency', () => {
    const value = defaultFillers.currency(makeFieldConfig({ component: 'currency' }))
    expect(value).toBeTypeOf('number')
    expect(value as number).toBeGreaterThanOrEqual(10)
    expect(value as number).toBeLessThanOrEqual(10000)
  })

  it('generates date string for date', () => {
    const value = defaultFillers.date(makeFieldConfig({ component: 'date' }))
    expect(value).toBeTypeOf('string')
    expect(value as string).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('generates datetime string for datetime', () => {
    const value = defaultFillers.datetime(makeFieldConfig({ component: 'datetime' }))
    expect(value).toBeTypeOf('string')
    expect(value as string).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
  })

  it('generates boolean for toggle', () => {
    const value = defaultFillers.toggle(makeFieldConfig({ component: 'toggle' }))
    expect(value).toBeTypeOf('boolean')
  })

  it('generates boolean for checkbox', () => {
    const value = defaultFillers.checkbox(makeFieldConfig({ component: 'checkbox' }))
    expect(value).toBeTypeOf('boolean')
  })
})

describe('fill', () => {
  it('generates values for all supported fields', () => {
    const fields = {
      name: makeFieldConfig({ component: 'text' }),
      active: makeFieldConfig({ component: 'toggle' }),
    }
    const result = fill(fields)
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('active')
  })

  it('works without identity parameter', () => {
    const fields = { name: makeFieldConfig({ component: 'text' }) }
    const result = fill(fields)
    expect(result).toHaveProperty('name')
  })
})
