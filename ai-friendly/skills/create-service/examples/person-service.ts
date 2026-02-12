// @ts-nocheck
import { createService } from "@ybyra/core";
import type { PersistenceContract } from "@ybyra/core";
import { PersonSchema } from "../../domain/person";

export function createPersonService (driver: PersistenceContract) {
  return {
    ...createService(PersonSchema, driver),
    async custom (name: string) {
      console.log("[personService.custom]", name);
    },
  };
}
