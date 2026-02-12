// @ts-nocheck
import type { ServiceContract } from "@ybyra/core";
import { PersonSchema } from "@/domain/person/schema";
import { createDefault } from "@/settings/handlers";

// Example: Custom handler alongside default CRUD handlers
export function createPersonHandlers (service: ServiceContract) {
  return PersonSchema.handlers({
    ...createDefault(service),
    // Custom handler — name must match the action name in the schema
    custom ({ state }) {
      (service as any).custom(state.name);
    },
  });
}
