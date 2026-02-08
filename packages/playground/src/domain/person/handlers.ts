import { PersonSchema } from "./schema";

export const personHandlers = PersonSchema.handlers({
  custom ({ state, schema }) {
    schema.services.default.custom(state.name);
  }
});
