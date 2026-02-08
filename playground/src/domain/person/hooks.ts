import { PersonSchema } from "./schema";
import { personService } from "../../applcation/person/personService";
import { createDefault } from "../../../settings/hooks";

export const personHooks = PersonSchema.hooks(createDefault(personService));
