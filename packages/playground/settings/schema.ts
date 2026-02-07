import { configure, action, text, Scope } from "@anhanga/core";

export const schema = configure({
  identity: "id",
  display: "name",
  scopes: [Scope.index, Scope.add, Scope.view, Scope.edit],
  fields: {
    id: text()
      .excludeScopes(Scope.add)
      .column(),
  },
  actions: {
    create: action().icon("save").primary().validate().scopes(Scope.add),
    update: action().icon("save").primary().validate().scopes(Scope.edit),
    cancel: action().icon("close").scopes(Scope.add, Scope.edit),
    destroy: action().icon("trash").destructive().excludeScopes(Scope.add),
  },
  handlers: {
    create({ state, schema, component }) {
      schema.services.default.create(state);
      component.toast.success("common.actions.create.success");
      component.navigator.push(component.scopes[Scope.index].path);
    },
    update({ state, schema, component }) {
      schema.services.default.update(state.id, state);
      component.toast.success("common.actions.update.success");
      component.navigator.push(component.scopes[Scope.index].path);
    },
    destroy({ state, schema, component }) {
      schema.services.default.destroy(state.id);
      component.toast.success("common.actions.destroy.success");
      if (component.scope !== Scope.index) {
        component.navigator.push(component.scopes[Scope.index].path);
        return;
      }
      component.reload();
    },
    cancel({ component }) {
      component.navigator.push(component.scopes[Scope.index].path);
    },
  },
});
