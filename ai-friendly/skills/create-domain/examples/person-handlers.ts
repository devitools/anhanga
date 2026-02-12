// @ts-nocheck
import type { ServiceContract } from "@ybyra/core";
import { PersonSchema } from "@/domain/person/schema";
import { createDefault } from "@/settings/handlers";

export function createPersonHandlers (service: ServiceContract) {
  return PersonSchema.handlers({
    ...createDefault(service),
    custom ({ state }) {
      (service as any).custom(state.name);
    },
  });
}
