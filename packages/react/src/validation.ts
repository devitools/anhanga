import type { ValidationRule, FieldConfig } from '@anhanga/core'

type ValidatorFn = (value: unknown, params?: Record<string, unknown>) => string | null

const validators: Record<string, ValidatorFn> = {
  required(value) {
    if (value === undefined || value === null || value === '') return 'Field is required'
    return null
  },
  minLength(value, params) {
    const min = params?.value as number
    if (typeof value === 'string' && value.length < min) return `Minimum length is ${min}`
    return null
  },
  maxLength(value, params) {
    const max = params?.value as number
    if (typeof value === 'string' && value.length > max) return `Maximum length is ${max}`
    return null
  },
  min(value, params) {
    const min = params?.value as number
    if (typeof value === 'number' && value < min) return `Minimum value is ${min}`
    return null
  },
  max(value, params) {
    const max = params?.value as number
    if (typeof value === 'number' && value > max) return `Maximum value is ${max}`
    return null
  },
  minDate(value, params) {
    const min = params?.value as string
    if (typeof value === 'string' && value < min) return `Date must be after ${min}`
    return null
  },
  maxDate(value, params) {
    const max = params?.value as string
    if (typeof value === 'string' && value > max) return `Date must be before ${max}`
    return null
  },
  pattern(value, params) {
    const regex = params?.regex as RegExp
    const message = params?.message as string | undefined
    if (typeof value === 'string' && !regex.test(value)) return message ?? 'Invalid format'
    return null
  },
}

export function registerValidator(name: string, fn: ValidatorFn): void {
  validators[name] = fn
}

export function validateField(value: unknown, rules: ValidationRule[]): string[] {
  const errors: string[] = []
  for (const rule of rules) {
    const fn = validators[rule.rule]
    if (!fn) continue
    const error = fn(value, rule.params)
    if (error) {
      errors.push(rule.message ?? error)
    }
  }
  return errors
}

export function validateAllFields(
  state: Record<string, unknown>,
  fields: Record<string, FieldConfig>,
): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const [name, config] of Object.entries(fields)) {
    const errors = validateField(state[name], config.validations)
    if (errors.length > 0) {
      result[name] = errors
    }
  }
  return result
}
