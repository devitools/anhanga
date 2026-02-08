import { PersonSchema } from "./schema";
import { personService } from "../../applcation/person/personService";
import { createDefault } from "../../../settings/handlers";

export const personHandlers = PersonSchema.handlers({
  ...createDefault(personService),
  custom ({ state }) {
    personService.custom(state.name);
  },
});
