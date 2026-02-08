import { configure, action, text, Scope, Position } from "@anhanga/core";
import { Icon } from "./icon";

export const schema = configure({
  identity: "id",
  display: "name",
  scopes: [Scope.index, Scope.add, Scope.view, Scope.edit],
  fields: {
    id: text()
      .excludeScopes(Scope.add)
      .order(0)
      .disabled(),
  },
  actions: {
    add: action().icon(Icon.Add).primary().positions(Position.top).scopes(Scope.index),
    view: action().icon(Icon.View).positions(Position.row).scopes(Scope.index),
    edit: action().icon(Icon.Edit).positions(Position.row).scopes(Scope.index),
    create: action().icon(Icon.Save).primary().order(999).positions(Position.footer).scopes(Scope.add),
    update: action().icon(Icon.Save).primary().order(999).positions(Position.footer).scopes(Scope.edit),
    cancel: action().icon(Icon.Close).start().order(1).positions(Position.footer).scopes(Scope.view, Scope.add, Scope.edit),
    destroy: action().icon(Icon.Trash).start().order(2).positions(Position.footer, Position.row).destructive().excludeScopes(Scope.add, Scope.view),
  },
  handlers: {
    add ({ component }) {
      component.navigator.push(component.scopes[Scope.add].path);
    },
    view ({ state, component }) {
      component.navigator.push(component.scopes[Scope.view].path, { id: state.id });
    },
    edit ({ state, component }) {
      component.navigator.push(component.scopes[Scope.edit].path, { id: state.id });
    },
    create ({ state, schema, component, form }) {
      if (!form?.validate()) {
        component.toast.error("common.actions.create.invalid");
        return;
      }
      schema.services.default.create(state);
      component.toast.success("common.actions.create.success");
      component.navigator.push(component.scopes[Scope.index].path);
    },
    update ({ state, schema, component, form }) {
      if (!form?.validate()) {
        component.toast.error("common.actions.update.invalid");
        return;
      }
      schema.services.default.update(state.id, state);
      component.toast.success("common.actions.update.success");
      component.navigator.push(component.scopes[Scope.index].path);
    },
    destroy ({ state, schema, component }) {
      schema.services.default.destroy(state.id);
      component.toast.success("common.actions.destroy.success");
      if (component.scope !== Scope.index) {
        component.navigator.push(component.scopes[Scope.index].path);
        return;
      }
      component.reload();
    },
    cancel ({ component }) {
      component.navigator.push(component.scopes[Scope.index].path);
    },
  },
});
