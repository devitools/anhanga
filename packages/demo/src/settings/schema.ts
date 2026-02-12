import { configure, action, text, Scope, Position } from "@ybyra/core";

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
    add: action().open().primary().positions(Position.top).scopes(Scope.index),
    view: action().open().positions(Position.row).scopes(Scope.index),
    edit: action().open().positions(Position.row).scopes(Scope.index),
    create: action().primary().order(999).positions(Position.footer).scopes(Scope.add),
    update: action().primary().order(999).positions(Position.footer).scopes(Scope.edit),
    cancel: action().open().start().order(1).positions(Position.footer).scopes(Scope.view, Scope.add, Scope.edit),
    destroy: action().start().order(2).positions(Position.footer, Position.row).destructive().excludeScopes(Scope.add, Scope.view),
  },
});
