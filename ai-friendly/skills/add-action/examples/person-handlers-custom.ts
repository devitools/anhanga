import type { ServiceContract } from "@ybyra/core";
import { PersonSchema } from "./schema";
import { createDefault } from "../../settings/handlers";

// Example: Custom handler alongside default CRUD handlers
export function createPersonHandlers (service: ServiceContract) {
  return PersonSchema.handlers({
    ...createDefault(service),
    // Custom handler — name must match action name in schema
    custom ({ state }) {
      (service as any).custom(state.name);
    },
  });
}
