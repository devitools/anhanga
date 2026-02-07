import { PersonSchema } from "./schema";

export const personHandlers = PersonSchema.handlers({
  async create({ state, schema }) {
    const data = await schema.services.default.create(state);
    schema.services.storage.save(data);
  },
  custom ({ state, schema }) {
    schema.services.default.custom(state.name);
  }
});
