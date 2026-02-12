// @ts-nocheck
import { PersonSchema } from "@/domain/person/schema";

export const personEvents = PersonSchema.events({
  active: {
    change ({ state, schema }) {
      state.name = String(state.name).split("").reverse().join("");
      schema.name.state = "new";
      schema.name.width = 100;
      schema.birthDate.hidden = !state.active;
      schema.street.disabled = !state.active;
      schema.city.disabled = !state.active;
    },
  },
  email: {
    blur ({ state, schema }) {
      if (!state.email.includes("@")) {
        schema.email.state = "error";
      }
    },
  },
});
