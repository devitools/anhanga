import { configure, action, text, Scope, Position } from "@anhanga/core";
import { Icon } from "./icon";

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
    create: action().icon(Icon.Save).primary().order(999).positions(Position.footer).scopes(Scope.add),
    update: action().icon(Icon.Save).primary().order(999).positions(Position.footer).scopes(Scope.edit),
    cancel: action().icon(Icon.Close).start().order(1).positions(Position.footer).scopes(Scope.add, Scope.edit),
    destroy: action().icon(Icon.Trash).start().order(2).positions(Position.footer).destructive().excludeScopes(Scope.add),
  },
  handlers: {
    create({ state, schema, component, form }) {
      if (!form.validate()) {
        component.toast.error("common.actions.create.invalid");
        return;
      }
      schema.services.default.create(state);
      component.toast.success("common.actions.create.success");
      component.navigator.push(component.scopes[Scope.index].path);
    },
    update({ state, schema, component, form }) {
      if (!form.validate()) {
        component.toast.error("common.actions.update.invalid");
        return;
      }
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
