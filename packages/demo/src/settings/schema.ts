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
});
