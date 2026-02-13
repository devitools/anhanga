import { describe, it, expect } from 'vitest'

const validators: Record<string, (value: unknown, params?: Record<string, unknown>) => string | null> = {
  required (value) {
    if (value === undefined || value === null || value === '') return 'required'
    if (Array.isArray(value) && value.length === 0) return 'required'
    return null
  },
  minTime (value, params) {
    const min = params?.value as string
    if (typeof value === 'string' && value < min) return `after ${min}`
    return null
  },
  maxTime (value, params) {
    const max = params?.value as string
    if (typeof value === 'string' && value > max) return `before ${max}`
    return null
  },
  minItems (value, params) {
    const min = params?.value as number
    if (Array.isArray(value) && value.length < min) return `min ${min}`
    return null
  },
  maxItems (value, params) {
    const max = params?.value as number
    if (Array.isArray(value) && value.length > max) return `max ${max}`
    return null
  },
}

describe('required validator (array support)', () => {
  it('returns error for empty array', () => {
    expect(validators.required([])).toBe('required')
  })

  it('passes for non-empty array', () => {
    expect(validators.required(['a'])).toBeNull()
  })

  it('still works for empty string', () => {
    expect(validators.required('')).toBe('required')
  })

  it('passes for non-empty string', () => {
    expect(validators.required('hello')).toBeNull()
  })
})

describe('minTime / maxTime validators', () => {
  it('rejects time before min', () => {
    expect(validators.minTime('07:30', { value: '08:00' })).toBeTruthy()
  })

  it('accepts time at or after min', () => {
    expect(validators.minTime('08:00', { value: '08:00' })).toBeNull()
    expect(validators.minTime('09:00', { value: '08:00' })).toBeNull()
  })

  it('rejects time after max', () => {
    expect(validators.maxTime('19:00', { value: '18:00' })).toBeTruthy()
  })

  it('accepts time at or before max', () => {
    expect(validators.maxTime('18:00', { value: '18:00' })).toBeNull()
    expect(validators.maxTime('17:00', { value: '18:00' })).toBeNull()
  })
})

describe('minItems / maxItems validators', () => {
  it('rejects array shorter than minItems', () => {
    expect(validators.minItems(['a'], { value: 2 })).toBeTruthy()
  })

  it('accepts array at or above minItems', () => {
    expect(validators.minItems(['a', 'b'], { value: 2 })).toBeNull()
  })

  it('rejects array longer than maxItems', () => {
    expect(validators.maxItems(['a', 'b', 'c'], { value: 2 })).toBeTruthy()
  })

  it('accepts array at or below maxItems', () => {
    expect(validators.maxItems(['a', 'b'], { value: 2 })).toBeNull()
  })
})
