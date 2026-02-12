import type { ValidationRule, FieldConfig, TranslateContract } from '@ybyra/core'

type ValidatorFn = (value: unknown, params?: Record<string, unknown>, translate?: TranslateContract) => string | null

const validators: Record<string, ValidatorFn> = {
  required (value, _params, t) {
    if (value === undefined || value === null || value === '') {
      return t ? t('validation.required') : 'Field is required'
    }
    return null
  },
  minLength (value, params, t) {
    const min = params?.value as number
    if (typeof value === 'string' && value.length < min) {
      return t ? t('validation.minLength', { value: min }) : `Minimum length is ${min}`
    }
    return null
  },
  maxLength (value, params, t) {
    const max = params?.value as number
    if (typeof value === 'string' && value.length > max) {
      return t ? t('validation.maxLength', { value: max }) : `Maximum length is ${max}`
    }
    return null
  },
  min (value, params, t) {
    const min = params?.value as number
    if (typeof value === 'number' && value < min) {
      return t ? t('validation.min', { value: min }) : `Minimum value is ${min}`
    }
    return null
  },
  max (value, params, t) {
    const max = params?.value as number
    if (typeof value === 'number' && value > max) {
      return t ? t('validation.max', { value: max }) : `Maximum value is ${max}`
    }
    return null
  },
  minDate (value, params, t) {
    const min = params?.value as string
    if (typeof value === 'string' && value < min) {
      return t ? t('validation.minDate', { value: min }) : `Date must be after ${min}`
    }
    return null
  },
  maxDate (value, params, t) {
    const max = params?.value as string
    if (typeof value === 'string' && value > max) {
      return t ? t('validation.maxDate', { value: max }) : `Date must be before ${max}`
    }
    return null
  },
  pattern (value, params, t) {
    const regex = params?.regex as RegExp
    const message = params?.message as string | undefined
    if (typeof value === 'string' && !regex.test(value)) {
      return message ?? (t ? t('validation.pattern') : 'Invalid format')
    }
    return null
  },
}

export function registerValidator (name: string, fn: ValidatorFn): void {
  validators[name] = fn
}

export function validateField (value: unknown, rules: ValidationRule[], translate?: TranslateContract): string[] {
  const errors: string[] = []
  for (const rule of rules) {
    const fn = validators[rule.rule]
    if (!fn) continue
    const error = fn(value, rule.params, translate)
    if (error) {
      errors.push(rule.message ?? error)
    }
  }
  return errors
}

export function validateAllFields (
  state: Record<string, unknown>,
  fields: Record<string, FieldConfig>,
  translate?: TranslateContract,
): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const [name, config] of Object.entries(fields)) {
    const errors = validateField(state[name], config.validations, translate)
    if (errors.length > 0) {
      result[name] = errors
    }
  }
  return result
}
