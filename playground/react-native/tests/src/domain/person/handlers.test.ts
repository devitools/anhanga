import { createMockContext, createMockDriver, Scope } from "@anhanga/core";
import { createPersonHandlers, createPersonService, PersonSchema } from "@anhanga/demo";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { scopes } from "../../../../app/person/@routes";

describe("createPersonHandlers", () => {
  const driver = createMockDriver(vi.fn);
  const service = createPersonService(driver);
  let handlers: ReturnType<typeof createPersonHandlers>;

  beforeEach(() => {
    vi.clearAllMocks();
    handlers = createPersonHandlers(service);
  });

  it("returns all expected handler keys", () => {
    const keys = Object.keys(handlers);
    expect(keys).toEqual(
      expect.arrayContaining([
        "add", "view", "edit", "create", "update", "cancel", "destroy", "custom",
      ]),
    );
  });

  it("all handlers are functions", () => {
    for (const handler of Object.values(handlers)) {
      expect(handler).toBeTypeOf("function");
    }
  });

  it("add calls navigator's push with 'add' path", () => {
    const { state, component } = createMockContext(PersonSchema, vi.fn).scopes(scopes);
    handlers.add({ state, component } as any);
    expect(component.navigator.push).toHaveBeenCalledWith("/person/add");
  });

  it("view calls navigator's push with view path and id", () => {
    const { state, component } = createMockContext(PersonSchema, vi.fn).scopes(scopes).values({ id: "1" });
    handlers.view({ state, component } as any);
    expect(component.navigator.push).toHaveBeenCalledWith("/person/view/:id", { id: "1" });
  });

  it("edit calls navigator's push with edit path and id", () => {
    const { state, component } = createMockContext(PersonSchema, vi.fn).scopes(scopes).values({ id: "2" });
    handlers.edit({ state, component } as any);
    expect(component.navigator.push).toHaveBeenCalledWith("/person/edit/:id", { id: "2" });
  });

  it("cancel calls navigator's push with 'index' path", () => {
    const { state, component } = createMockContext(PersonSchema, vi.fn).scopes(scopes);
    handlers.cancel({ state, component } as any);
    expect(component.navigator.push).toHaveBeenCalledWith("/person");
  });

  it("create validates, creates, toasts success, and navigates", () => {
    const { state, component, form } = createMockContext(PersonSchema, vi.fn).scopes(scopes).values({ name: "Alice" });
    handlers.create({ state, component, form } as any);
    expect(form.validate).toHaveBeenCalled();
    expect(component.toast.success).toHaveBeenCalledWith("common.actions.create.success");
    expect(component.navigator.push).toHaveBeenCalledWith("/person");
  });

  it("create shows error toast when validation fails", () => {
    const { state, component, form } = createMockContext(PersonSchema, vi.fn).scopes(scopes);
    vi.mocked(form.validate).mockReturnValue(false);
    handlers.create({ state, component, form } as any);
    expect(component.toast.error).toHaveBeenCalledWith("common.actions.create.invalid");
    expect(component.navigator.push).not.toHaveBeenCalled();
  });

  it("update validates, updates, toasts success, and navigates", () => {
    const { state, component, form } = createMockContext(PersonSchema, vi.fn).scopes(scopes).values({
      id: "1",
      name: "Bob"
    });
    handlers.update({ state, component, form } as any);
    expect(form.validate).toHaveBeenCalled();
    expect(component.toast.success).toHaveBeenCalledWith("common.actions.update.success");
    expect(component.navigator.push).toHaveBeenCalledWith("/person");
  });

  it("update shows an error toast when validation fails", () => {
    const { state, component, form } = createMockContext(PersonSchema, vi.fn).scopes(scopes);
    vi.mocked(form.validate).mockReturnValue(false);
    handlers.update({ state, component, form } as any);
    expect(component.toast.error).toHaveBeenCalledWith("common.actions.update.invalid");
    expect(component.navigator.push).not.toHaveBeenCalled();
  });

  it("destroy confirms dialog, destroys, and navigates when not on index", async () => {
    const {
      state,
      component
    } = createMockContext(PersonSchema, vi.fn).scopes(scopes).scope(Scope.edit).values({ id: "99" });
    await handlers.destroy({ state, component } as any);
    expect(component.dialog.confirm).toHaveBeenCalledWith("common.actions.destroy.confirm");
    expect(component.toast.success).toHaveBeenCalledWith("common.actions.destroy.success");
    expect(component.navigator.push).toHaveBeenCalledWith("/person");
  });

  it("destroy does nothing when a dialog is canceled", async () => {
    const { state, component } = createMockContext(PersonSchema, vi.fn).scopes(scopes).values({ id: "1" });
    vi.mocked(component.dialog.confirm).mockResolvedValue(false);
    await handlers.destroy({ state, component } as any);
    expect(component.toast.success).not.toHaveBeenCalled();
  });

  it("destroy calls table's reload when the scope is 'index'", async () => {
    const {
      state,
      component,
      table
    } = createMockContext(PersonSchema, vi.fn).scopes(scopes).scope(Scope.index).values({ id: "1" });
    await handlers.destroy({ state, component, table } as any);
    expect(table.reload).toHaveBeenCalled();
    expect(component.navigator.push).not.toHaveBeenCalled();
  });

  it("custom calls service's custom with 'state.name'", () => {
    const spy = vi.spyOn(service as any, "custom").mockImplementation(() => {});
    const { state, component } = createMockContext(PersonSchema, vi.fn).scopes(scopes).values({ name: "Alice" });
    handlers.custom({ state, component } as any);
    expect(spy).toHaveBeenCalledWith("Alice");
    spy.mockRestore();
  });
});
