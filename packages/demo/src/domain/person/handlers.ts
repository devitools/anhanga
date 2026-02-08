import type { ServiceContract } from "@anhanga/core";
import { PersonSchema } from "./schema";
import { createDefault } from "../../settings/handlers";

export function createPersonHandlers (service: ServiceContract) {
  return PersonSchema.handlers({
    ...createDefault(service),
    custom ({ state }) {
      (service as any).custom(state.name);
    },
  });
}
