import { createService } from '@anhanga/core'
import type { PersistenceContract } from '@anhanga/core'
import { PersonSchema } from '../../domain/person/schema'

export function createPersonService (driver: PersistenceContract) {
  return {
    ...createService(PersonSchema, driver),
    async custom (name: string) {
      console.log("[personService.custom]", name)
    },
  }
}
