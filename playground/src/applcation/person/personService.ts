import { createService } from '../support/createService'

export const personService = {
  ...createService({
    table: 'person',
    identity: 'id',
    fields: {
      id: { dataType: 'string' },
      name: { dataType: 'string' },
      email: { dataType: 'string' },
      phone: { dataType: 'string' },
      birthDate: { dataType: 'date' },
      active: { dataType: 'boolean' },
      street: { dataType: 'string' },
      city: { dataType: 'string' },
    },
  }),
  async custom (name: string) {
    console.log("[personService.custom]", name)
  },
}
