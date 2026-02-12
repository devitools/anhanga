import { createMockContext } from "@ybyra/core";
import { personEvents, PersonSchema } from "@ybyra/demo";
import { describe, expect, it } from "vitest";

describe("personEvents", () => {
  describe("active.change", () => {
    it("reverses state.name", () => {
      const { state, schema } = createMockContext(PersonSchema, { name: "Alice", active: true });
      personEvents.active!.change({ state, schema });
      expect(state.name).toBe("ecilA");
    });

    it("sets schema.name.state to 'new'", () => {
      const { state, schema } = createMockContext(PersonSchema, { name: "Bob", active: true });
      personEvents.active!.change({ state, schema });
      expect(schema.name.state).toBe("new");
    });

    it("toggles 'birthDate.hidden' based on active", () => {
      const { state, schema } = createMockContext(PersonSchema, { name: "X", active: false });
      personEvents.active!.change({ state, schema });
      expect(schema.birthDate.hidden).toBe(true);

      state.active = true;
      personEvents.active!.change({ state, schema });
      expect(schema.birthDate.hidden).toBe(false);
    });

    it("toggles 'street/city' disabled based on active", () => {
      const { state, schema } = createMockContext(PersonSchema, { name: "X", active: false });
      personEvents.active!.change({ state, schema });
      expect(schema.street.disabled).toBe(true);
      expect(schema.city.disabled).toBe(true);

      state.active = true;
      personEvents.active!.change({ state, schema });
      expect(schema.street.disabled).toBe(false);
      expect(schema.city.disabled).toBe(false);
    });
  });

  describe("email.blur", () => {
    it("sets schema.email.state to 'error' when email has no @", () => {
      const { state, schema } = createMockContext(PersonSchema, { email: "invalid-email" });
      personEvents.email!.blur({ state, schema });
      expect(schema.email.state).toBe("error");
    });

    it("does not set error state when email contains @", () => {
      const { state, schema } = createMockContext(PersonSchema, { email: "user@example.com" });
      personEvents.email!.blur({ state, schema });
      expect(schema.email.state).toBe("");
    });
  });
});
