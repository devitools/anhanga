import { createMockContext, Scope } from "@anhanga/core";
import { createPersonHooks, createPersonService, PersonSchema } from "@anhanga/demo";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { scopes } from "../../../../app/person/@routes";
import { mockDriver } from "../../../support/mocks";

describe("createPersonHooks", () => {
  const driver = mockDriver();
  const service = createPersonService(driver);
  let hooks: ReturnType<typeof createPersonHooks>;

  beforeEach(() => {
    vi.clearAllMocks();
    hooks = createPersonHooks(service);
  });

  it("returns bootstrap and fetch structure", () => {
    expect(hooks).toHaveProperty("bootstrap");
    expect(hooks).toHaveProperty("fetch");
  });

  it("bootstrap has view and edit scope handlers", () => {
    expect(hooks.bootstrap![Scope.view]).toBeTypeOf("function");
    expect(hooks.bootstrap![Scope.edit]).toBeTypeOf("function");
  });

  it("fetch has index scope handler", () => {
    expect(hooks.fetch![Scope.index]).toBeTypeOf("function");
  });

  it("bootstrap[view] calls service.read, hydrates, and disables all fields", async () => {
    const data = { id: "1", name: "Alice" };
    vi.mocked(driver.read).mockResolvedValue(data);

    const hydrate = vi.fn();
    const { schema, component } = createMockContext(PersonSchema, vi.fn).scopes(scopes);

    await hooks.bootstrap![Scope.view]!({
      context: { id: "1" },
      hydrate,
      schema,
      component,
    } as any);

    expect(hydrate).toHaveBeenCalledWith(data);
    expect(schema.name.disabled).toBe(true);
    expect(schema.email.disabled).toBe(true);
  });

  it("bootstrap[view] does nothing when context.id is missing", async () => {
    const hydrate = vi.fn();
    const { schema, component } = createMockContext(PersonSchema, vi.fn).scopes(scopes);

    await hooks.bootstrap![Scope.view]!({
      context: {},
      hydrate,
      schema,
      component,
    } as any);

    expect(hydrate).not.toHaveBeenCalled();
  });

  it("bootstrap[edit] calls service.read and hydrates without disabling", async () => {
    const data = { id: "2", name: "Bob" };
    vi.mocked(driver.read).mockResolvedValue(data);

    const hydrate = vi.fn();
    const { schema, component } = createMockContext(PersonSchema, vi.fn).scopes(scopes);

    await hooks.bootstrap![Scope.edit]!({
      context: { id: "2" },
      hydrate,
      schema,
      component,
    } as any);

    expect(hydrate).toHaveBeenCalledWith(data);
    expect(schema.name.disabled).toBe(false);
  });

  it("fetch[index] calls service.paginate", async () => {
    const data = { data: [{ id: "1" }], total: 1, page: 1, limit: 10 };
    vi.mocked(driver.search).mockResolvedValue(data);

    const { component } = createMockContext(PersonSchema, vi.fn).scopes(scopes);
    const params = { page: 1, limit: 10 };
    const result = await hooks.fetch![Scope.index]!({ params, component } as any);

    expect(result).toEqual(data);
  });
});
