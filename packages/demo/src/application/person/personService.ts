import { createService } from '@anhanga/core'
import { PersonSchema } from '../../domain/person/schema'
import { localDriver } from '../support/local-driver'

export const personService = {
  ...createService(PersonSchema, localDriver),
  async custom (name: string) {
    console.log("[personService.custom]", name)
  },
}
