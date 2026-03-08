import { createMockContext, createMockDriver, Scope } from "@ybyra/core";
import { createPersonHooks, createPersonService, PersonSchema } from "@ybyra/demo";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { scopes } from "../../../../src/pages/person/@routes";

describe("createPersonHooks", () => {
  const driver = createMockDriver(vi.fn);
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

  it("bootstrap has view scope handler", () => {
    expect(hooks.bootstrap![Scope.view]).toBeTypeOf("function");
  });

  it("fetch has view, edit, and index scope handlers", () => {
    expect(hooks.fetch![Scope.view]).toBeTypeOf("function");
    expect(hooks.fetch![Scope.edit]).toBeTypeOf("function");
    expect(hooks.fetch![Scope.index]).toBeTypeOf("function");
  });

  it("fetch[view] calls service.read and hydrates", async () => {
    const data = { id: "1", name: "Alice" };
    vi.mocked(driver.read).mockResolvedValue(data);

    const hydrate = vi.fn();
    const { component } = createMockContext(PersonSchema, vi.fn).scopes(scopes);

    await hooks.fetch![Scope.view]!({
      type: "record",
      context: { id: "1" },
      params: { page: 1, limit: 1 },
      hydrate,
      component,
    } as any);

    expect(hydrate).toHaveBeenCalledWith(data);
  });

  it("fetch[view] does nothing when context.id is missing", async () => {
    const hydrate = vi.fn();
    const { component } = createMockContext(PersonSchema, vi.fn).scopes(scopes);

    await hooks.fetch![Scope.view]!({
      type: "record",
      context: {},
      params: { page: 1, limit: 1 },
      hydrate,
      component,
    } as any);

    expect(hydrate).not.toHaveBeenCalled();
  });

  it("bootstrap[view] disables all fields", async () => {
    const { schema, component } = createMockContext(PersonSchema, vi.fn).scopes(scopes);

    await hooks.bootstrap![Scope.view]!({ context: {}, schema, component });

    expect(schema.name.disabled).toBe(true);
    expect(schema.email.disabled).toBe(true);
  });

  it("fetch[edit] calls service.read and hydrates without disabling", async () => {
    const data = { id: "2", name: "Bob" };
    vi.mocked(driver.read).mockResolvedValue(data);

    const hydrate = vi.fn();
    const { component } = createMockContext(PersonSchema, vi.fn).scopes(scopes);

    await hooks.fetch![Scope.edit]!({
      type: "record",
      context: { id: "2" },
      params: { page: 1, limit: 1 },
      hydrate,
      component,
    } as any);

    expect(hydrate).toHaveBeenCalledWith(data);
  });

  it("fetch[index] calls service.paginate via hydrate", async () => {
    const data = { data: [{ id: "1" }], total: 1, page: 1, limit: 10 };
    vi.mocked(driver.search).mockResolvedValue(data);

    const hydrate = vi.fn();
    const { component } = createMockContext(PersonSchema, vi.fn).scopes(scopes);
    const params = { page: 1, limit: 10 };

    await hooks.fetch![Scope.index]!({ type: "collection", context: {}, params, hydrate, component } as any);

    expect(hydrate).toHaveBeenCalledWith(data);
  });
});
