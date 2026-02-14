import { describe, it, expect, vi } from 'vitest'
import { registerValidator, validateField, validateAllFields } from './validation'
import type { FieldConfig, TranslateContract, ValidationRule } from '@ybyra/core'

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

describe('built-in validators', () => {
  describe('required', () => {
    const rule: ValidationRule = { rule: 'required' }

    it('returns error for undefined', () => {
      expect(validateField(undefined, [rule])).toHaveLength(1)
    })

    it('returns error for null', () => {
      expect(validateField(null, [rule])).toHaveLength(1)
    })

    it('returns error for empty string', () => {
      expect(validateField('', [rule])).toHaveLength(1)
    })

    it('returns null for non-empty string', () => {
      expect(validateField('hello', [rule])).toHaveLength(0)
    })

    it('returns null for number zero', () => {
      expect(validateField(0, [rule])).toHaveLength(0)
    })

    it('returns null for boolean false', () => {
      expect(validateField(false, [rule])).toHaveLength(0)
    })

    it('returns error for empty array', () => {
      expect(validateField([], [rule])).toHaveLength(1)
    })

    it('uses translate function when provided', () => {
      const t: TranslateContract = vi.fn((key: string) => `translated: ${key}`)
      const errors = validateField(undefined, [rule], t)
      expect(errors[0]).toBe('translated: validation.required')
      expect(t).toHaveBeenCalledWith('validation.required')
    })
  })

  describe('minLength', () => {
    const rule: ValidationRule = { rule: 'minLength', params: { value: 3 } }

    it('returns error when string is shorter than min', () => {
      expect(validateField('ab', [rule])).toHaveLength(1)
    })

    it('returns null when string meets min length', () => {
      expect(validateField('abc', [rule])).toHaveLength(0)
    })

    it('returns null for non-string values', () => {
      expect(validateField(42, [rule])).toHaveLength(0)
    })
  })

  describe('maxLength', () => {
    const rule: ValidationRule = { rule: 'maxLength', params: { value: 5 } }

    it('returns error when string exceeds max', () => {
      expect(validateField('abcdef', [rule])).toHaveLength(1)
    })

    it('returns null when string is within max', () => {
      expect(validateField('abc', [rule])).toHaveLength(0)
    })
  })

  describe('min', () => {
    const rule: ValidationRule = { rule: 'min', params: { value: 10 } }

    it('returns error when number is below min', () => {
      expect(validateField(5, [rule])).toHaveLength(1)
    })

    it('returns null when number meets min', () => {
      expect(validateField(10, [rule])).toHaveLength(0)
    })

    it('returns null for non-number values', () => {
      expect(validateField('hello', [rule])).toHaveLength(0)
    })
  })

  describe('max', () => {
    const rule: ValidationRule = { rule: 'max', params: { value: 100 } }

    it('returns error when number exceeds max', () => {
      expect(validateField(150, [rule])).toHaveLength(1)
    })

    it('returns null when number is within max', () => {
      expect(validateField(50, [rule])).toHaveLength(0)
    })
  })

  describe('minDate', () => {
    const rule: ValidationRule = { rule: 'minDate', params: { value: '2024-01-01' } }

    it('returns error when date is before min', () => {
      expect(validateField('2023-12-31', [rule])).toHaveLength(1)
    })

    it('returns null when date is after min', () => {
      expect(validateField('2024-06-15', [rule])).toHaveLength(0)
    })
  })

  describe('maxDate', () => {
    const rule: ValidationRule = { rule: 'maxDate', params: { value: '2024-12-31' } }

    it('returns error when date is after max', () => {
      expect(validateField('2025-01-01', [rule])).toHaveLength(1)
    })

    it('returns null when date is before max', () => {
      expect(validateField('2024-06-15', [rule])).toHaveLength(0)
    })
  })

  describe('minTime', () => {
    const rule: ValidationRule = { rule: 'minTime', params: { value: '09:00' } }

    it('returns error when time is before min', () => {
      expect(validateField('08:00', [rule])).toHaveLength(1)
    })

    it('returns null when time is after min', () => {
      expect(validateField('10:00', [rule])).toHaveLength(0)
    })
  })

  describe('maxTime', () => {
    const rule: ValidationRule = { rule: 'maxTime', params: { value: '17:00' } }

    it('returns error when time is after max', () => {
      expect(validateField('18:00', [rule])).toHaveLength(1)
    })

    it('returns null when time is before max', () => {
      expect(validateField('12:00', [rule])).toHaveLength(0)
    })
  })

  describe('minItems', () => {
    const rule: ValidationRule = { rule: 'minItems', params: { value: 3 } }

    it('returns error when array has fewer items', () => {
      expect(validateField([1], [rule])).toHaveLength(1)
    })

    it('returns null when array meets min', () => {
      expect(validateField([1, 2, 3], [rule])).toHaveLength(0)
    })
  })

  describe('maxItems', () => {
    const rule: ValidationRule = { rule: 'maxItems', params: { value: 2 } }

    it('returns error when array exceeds max', () => {
      expect(validateField([1, 2, 3], [rule])).toHaveLength(1)
    })

    it('returns null when array is within max', () => {
      expect(validateField([1], [rule])).toHaveLength(0)
    })
  })

  describe('pattern', () => {
    const rule: ValidationRule = { rule: 'pattern', params: { regex: /^\d+$/ } }

    it('returns error when string does not match', () => {
      expect(validateField('abc', [rule])).toHaveLength(1)
    })

    it('returns null when string matches', () => {
      expect(validateField('123', [rule])).toHaveLength(0)
    })

    it('uses custom message from params', () => {
      const ruleWithMsg: ValidationRule = {
        rule: 'pattern',
        params: { regex: /^\d+$/, message: 'Numbers only' },
      }
      const errors = validateField('abc', [ruleWithMsg])
      expect(errors[0]).toBe('Numbers only')
    })
  })
})

describe('registerValidator', () => {
  it('adds a custom validator', () => {
    registerValidator('vueCustomEven', (value) => {
      if (typeof value === 'number' && value % 2 !== 0) return 'Must be even'
      return null
    })
    expect(validateField(3, [{ rule: 'vueCustomEven' }])).toHaveLength(1)
    expect(validateField(4, [{ rule: 'vueCustomEven' }])).toHaveLength(0)
  })
})

describe('validateField', () => {
  it('returns empty array when no rules', () => {
    expect(validateField('anything', [])).toEqual([])
  })

  it('skips unknown rules gracefully', () => {
    const errors = validateField(undefined, [{ rule: 'nonExistent' }, { rule: 'required' }])
    expect(errors).toHaveLength(1)
  })

  it('uses rule.message override', () => {
    const errors = validateField(undefined, [{ rule: 'required', message: 'Custom msg' }])
    expect(errors[0]).toBe('Custom msg')
  })
})

describe('validateAllFields', () => {
  it('returns only fields with errors', () => {
    const fields: Record<string, FieldConfig> = {
      name: makeFieldConfig({ validations: [{ rule: 'required' }] }),
      age: makeFieldConfig({ validations: [{ rule: 'min', params: { value: 0 } }] }),
    }
    const result = validateAllFields({ name: 'Alice', age: -1 }, fields)
    expect(result).not.toHaveProperty('name')
    expect(result).toHaveProperty('age')
  })

  it('returns empty object when all pass', () => {
    const fields: Record<string, FieldConfig> = {
      name: makeFieldConfig({ validations: [{ rule: 'required' }] }),
    }
    expect(validateAllFields({ name: 'Alice' }, fields)).toEqual({})
  })

  it('passes translate function through', () => {
    const t: TranslateContract = vi.fn((key: string) => `t:${key}`)
    const fields: Record<string, FieldConfig> = {
      name: makeFieldConfig({ validations: [{ rule: 'required' }] }),
    }
    const result = validateAllFields({ name: undefined }, fields, t)
    expect(result.name[0]).toBe('t:validation.required')
  })
})
