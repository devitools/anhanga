import { fakerPT_BR as faker } from '@faker-js/faker'
import type { FieldConfig } from './types'

export type FillerFn = (config: FieldConfig) => unknown

export type FillerRegistry = Record<string, FillerFn>

const textKindGenerators: Record<string, () => string> = {
  email: () => faker.internet.email(),
  phone: () => faker.phone.number(),
  cpf: () => faker.string.numeric({ length: 11, allowLeadingZeros: true }).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
  cnpj: () => faker.string.numeric({ length: 14, allowLeadingZeros: true }).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5'),
  cep: () => faker.location.zipCode(),
  url: () => faker.internet.url(),
  street: () => faker.location.streetAddress(),
  city: () => faker.location.city(),
}

export const defaultFillers: FillerRegistry = {
  text(config) {
    if (config.kind && textKindGenerators[config.kind]) {
      return textKindGenerators[config.kind]()
    }
    return faker.person.fullName()
  },
  number(config) {
    const min = config.validations.find((v) => v.rule === 'min')?.params?.value as number | undefined
    const max = config.validations.find((v) => v.rule === 'max')?.params?.value as number | undefined
    const precision = config.attrs.precision as number | undefined
    return faker.number.float({ min: min ?? 0, max: max ?? 1000, fractionDigits: precision ?? 0 })
  },
  currency() {
    return faker.number.float({ min: 10, max: 10000, fractionDigits: 2 })
  },
  date() {
    return faker.date.birthdate({ min: 1980, max: 2005, mode: 'year' }).toISOString().slice(0, 10)
  },
  datetime() {
    return faker.date.between({ from: '2020-01-01', to: '2026-12-31' }).toISOString().slice(0, 16)
  },
  toggle() {
    return faker.datatype.boolean()
  },
  checkbox() {
    return faker.datatype.boolean()
  },
}

export function createFiller(registry: FillerRegistry) {
  return function fill(
    fields: Record<string, FieldConfig>,
    identity?: string | string[],
  ): Record<string, unknown> {
    const identityKeys = identity
      ? Array.isArray(identity) ? identity : [identity]
      : []
    const result: Record<string, unknown> = {}
    for (const [name, config] of Object.entries(fields)) {
      if (identityKeys.includes(name)) continue
      const filler = registry[config.component]
      if (!filler) continue
      const value = filler(config)
      if (value !== undefined) {
        result[name] = value
      }
    }
    return result
  }
}

export const fill = createFiller(defaultFillers)
