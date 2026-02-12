// @ts-nocheck
import type { ServiceContract } from "@ybyra/core";
import { PersonSchema } from "@/domain/person/schema";
import { createDefault } from "@/settings/hooks";

export function createPersonHooks (service: ServiceContract) {
  return PersonSchema.hooks(createDefault(service));
}
