import {
  action,
  checkbox,
  date,
  datetime,
  group,
  list,
  multiselect,
  number,
  Position,
  Scope,
  select,
  text,
  Text,
  textarea,
  time,
  toggle,
  tree,
} from "@ybyra/core";
import { schema } from "../../settings/schema";

export const PersonSchema = schema.create("person", {
  groups: {
    basic: group(),
    details: group(),
    address: group(),
  },

  fields: {
    name: text().width(100).default("").required().column().filterable().group("basic"),
    email: text().kind(Text.Email).width(60).required().column().group("basic"),
    phone: text().kind(Text.Phone).width(40).group("basic"),
    birthDate: date().width(30).group("basic"),
    active: toggle().width(20).default(true).column().group("basic"),
    password: text().kind(Text.Password).width(50).minLength(6).group("basic"),

    bio: textarea().width(100).height(4).maxLength(500).group("details"),
    age: number().width(20).min(0).max(150).group("details"),
    availableFrom: time().width(30).min("08:00").max("18:00").group("details"),
    lastLogin: datetime().width(50).group("details"),
    newsletter: checkbox().width(20).default(false).group("details"),
    role: select(["admin", "editor", "viewer"]).width(30).required().group("details"),
    tags: multiselect(["frontend", "backend", "devops", "design"]).width(40).group("details"),
    contacts: list().width(50).reorderable().maxItems(5).group("details"),
    permissions: tree().width(50).childrenKey("children").maxDepth(3).group("details"),

    street: text().kind(Text.Street).width(60).group("address"),
    city: text().kind(Text.City).width(40).group("address"),
  },

  actions: {
    custom: action().order(-1).warning().positions(Position.footer).scopes(Scope.add),
    save: action().hidden(),
    activate: action().positions(Position.row).scopes(Scope.index).condition((r) => r.active === false),
  },
});
