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
      const errors = validateField(undefined, [rule])
      expect(errors).toHaveLength(1)
      expect(errors[0]).toBe('Field is required')
    })

    it('returns error for null', () => {
      const errors = validateField(null, [rule])
      expect(errors).toHaveLength(1)
      expect(errors[0]).toBe('Field is required')
    })

    it('returns error for empty string', () => {
      const errors = validateField('', [rule])
      expect(errors).toHaveLength(1)
      expect(errors[0]).toBe('Field is required')
    })

    it('returns null for non-empty string', () => {
      const errors = validateField('hello', [rule])
      expect(errors).toHaveLength(0)
    })

    it('returns null for number zero', () => {
      const errors = validateField(0, [rule])
      expect(errors).toHaveLength(0)
    })

    it('returns null for boolean false', () => {
      const errors = validateField(false, [rule])
      expect(errors).toHaveLength(0)
    })

    it('uses translate function when provided', () => {
      const t: TranslateContract = vi.fn((key: string) => `translated: ${key}`)
      const errors = validateField(undefined, [rule], t)
      expect(errors).toHaveLength(1)
      expect(errors[0]).toBe('translated: validation.required')
      expect(t).toHaveBeenCalledWith('validation.required')
    })
  })

  describe('minLength', () => {
    const rule: ValidationRule = { rule: 'minLength', params: { value: 3 } }

    it('returns error when string is shorter than min', () => {
      const errors = validateField('ab', [rule])
      expect(errors).toHaveLength(1)
      expect(errors[0]).toBe('Minimum length is 3')
    })

    it('returns null when string meets min length', () => {
      const errors = validateField('abc', [rule])
      expect(errors).toHaveLength(0)
    })

    it('returns null for non-string values', () => {
      const errors = validateField(42, [rule])
      expect(errors).toHaveLength(0)
    })
  })

  describe('maxLength', () => {
    const rule: ValidationRule = { rule: 'maxLength', params: { value: 5 } }

    it('returns error when string exceeds max', () => {
      const errors = validateField('abcdef', [rule])
      expect(errors).toHaveLength(1)
      expect(errors[0]).toBe('Maximum length is 5')
    })

    it('returns null when string is within max', () => {
      const errors = validateField('abc', [rule])
      expect(errors).toHaveLength(0)
    })
  })

  describe('min', () => {
    const rule: ValidationRule = { rule: 'min', params: { value: 10 } }

    it('returns error when number is below min', () => {
      const errors = validateField(5, [rule])
      expect(errors).toHaveLength(1)
      expect(errors[0]).toBe('Minimum value is 10')
    })

    it('returns null when number meets min', () => {
      const errors = validateField(10, [rule])
      expect(errors).toHaveLength(0)
    })

    it('returns null for non-number values', () => {
      const errors = validateField('hello', [rule])
      expect(errors).toHaveLength(0)
    })
  })

  describe('max', () => {
    const rule: ValidationRule = { rule: 'max', params: { value: 100 } }

    it('returns error when number exceeds max', () => {
      const errors = validateField(150, [rule])
      expect(errors).toHaveLength(1)
      expect(errors[0]).toBe('Maximum value is 100')
    })

    it('returns null when number is within max', () => {
      const errors = validateField(50, [rule])
      expect(errors).toHaveLength(0)
    })
  })

  describe('minDate', () => {
    const rule: ValidationRule = { rule: 'minDate', params: { value: '2024-01-01' } }

    it('returns error when date string is before min', () => {
      const errors = validateField('2023-12-31', [rule])
      expect(errors).toHaveLength(1)
      expect(errors[0]).toBe('Date must be after 2024-01-01')
    })

    it('returns null when date string is after min', () => {
      const errors = validateField('2024-06-15', [rule])
      expect(errors).toHaveLength(0)
    })
  })

  describe('maxDate', () => {
    const rule: ValidationRule = { rule: 'maxDate', params: { value: '2024-12-31' } }

    it('returns error when date string is after max', () => {
      const errors = validateField('2025-01-01', [rule])
      expect(errors).toHaveLength(1)
      expect(errors[0]).toBe('Date must be before 2024-12-31')
    })

    it('returns null when date string is before max', () => {
      const errors = validateField('2024-06-15', [rule])
      expect(errors).toHaveLength(0)
    })
  })

  describe('pattern', () => {
    const rule: ValidationRule = { rule: 'pattern', params: { regex: /^\d+$/ } }

    it('returns error when string does not match regex', () => {
      const errors = validateField('abc', [rule])
      expect(errors).toHaveLength(1)
      expect(errors[0]).toBe('Invalid format')
    })

    it('returns null when string matches regex', () => {
      const errors = validateField('123', [rule])
      expect(errors).toHaveLength(0)
    })

    it('uses custom message from params when provided', () => {
      const ruleWithMessage: ValidationRule = {
        rule: 'pattern',
        params: { regex: /^\d+$/, message: 'Numbers only please' },
      }
      const errors = validateField('abc', [ruleWithMessage])
      expect(errors).toHaveLength(1)
      expect(errors[0]).toBe('Numbers only please')
    })
  })
})

describe('registerValidator', () => {
  // Note: registerValidator mutates global state. Using unique names to avoid
  // polluting built-in validators or other test files.
  it('adds a custom validator to the registry', () => {
    registerValidator('customEven', (value) => {
      if (typeof value === 'number' && value % 2 !== 0) {
        return 'Value must be even'
      }
      return null
    })

    const errors = validateField(3, [{ rule: 'customEven' }])
    expect(errors).toHaveLength(1)
    expect(errors[0]).toBe('Value must be even')
  })

  it('custom validator is used by validateField', () => {
    registerValidator('customPositive', (value) => {
      if (typeof value === 'number' && value < 0) {
        return 'Value must be positive'
      }
      return null
    })

    const errors = validateField(-5, [{ rule: 'customPositive' }])
    expect(errors).toHaveLength(1)
    expect(errors[0]).toBe('Value must be positive')

    const noErrors = validateField(10, [{ rule: 'customPositive' }])
    expect(noErrors).toHaveLength(0)
  })
})

describe('validateField', () => {
  it('returns empty array when no rules', () => {
    const errors = validateField('anything', [])
    expect(errors).toEqual([])
  })

  it('returns errors for all failing rules', () => {
    const rules: ValidationRule[] = [
      { rule: 'required' },
      { rule: 'minLength', params: { value: 3 } },
    ]
    const errors = validateField('', rules)
    // '' is caught by required; minLength checks typeof === 'string' && length < 3,
    // but '' has length 0 < 3 so both fire
    expect(errors).toHaveLength(2)
  })

  it('skips unknown rule names gracefully', () => {
    const rules: ValidationRule[] = [
      { rule: 'nonExistentRule' },
      { rule: 'required' },
    ]
    const errors = validateField(undefined, rules)
    // Only 'required' fires; 'nonExistentRule' is skipped
    expect(errors).toHaveLength(1)
    expect(errors[0]).toBe('Field is required')
  })

  it('uses rule.message override when provided', () => {
    const rules: ValidationRule[] = [
      { rule: 'required', message: 'This field cannot be blank' },
    ]
    const errors = validateField(undefined, rules)
    expect(errors).toHaveLength(1)
    expect(errors[0]).toBe('This field cannot be blank')
  })
})

describe('validateAllFields', () => {
  it('validates all fields and returns only those with errors', () => {
    const fields: Record<string, FieldConfig> = {
      name: makeFieldConfig({
        validations: [{ rule: 'required' }],
      }),
      age: makeFieldConfig({
        validations: [{ rule: 'min', params: { value: 0 } }],
      }),
      email: makeFieldConfig({
        validations: [{ rule: 'required' }],
      }),
    }
    const state = { name: 'Alice', age: -1, email: undefined }
    const result = validateAllFields(state, fields)

    // name passes (has value), age fails (< 0), email fails (undefined + required)
    expect(result).not.toHaveProperty('name')
    expect(result).toHaveProperty('age')
    expect(result.age).toHaveLength(1)
    expect(result).toHaveProperty('email')
    expect(result.email).toHaveLength(1)
  })

  it('passes translate function through to validateField', () => {
    const t: TranslateContract = vi.fn((key: string) => `t:${key}`)
    const fields: Record<string, FieldConfig> = {
      name: makeFieldConfig({ validations: [{ rule: 'required' }] }),
    }
    const result = validateAllFields({ name: undefined }, fields, t)
    expect(result.name[0]).toBe('t:validation.required')
    expect(t).toHaveBeenCalledWith('validation.required')
  })

  it('returns empty object when all fields pass', () => {
    const fields: Record<string, FieldConfig> = {
      name: makeFieldConfig({
        validations: [{ rule: 'required' }],
      }),
      age: makeFieldConfig({
        validations: [{ rule: 'min', params: { value: 0 } }],
      }),
    }
    const state = { name: 'Alice', age: 25 }
    const result = validateAllFields(state, fields)
    expect(result).toEqual({})
  })
})
