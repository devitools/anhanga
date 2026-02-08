import type { ServiceContract } from "@anhanga/core";
import { PersonSchema } from "./schema";
import { createDefault } from "../../settings/hooks";

export function createPersonHooks (service: ServiceContract) {
  return PersonSchema.hooks(createDefault(service));
}
