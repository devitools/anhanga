// @ts-nocheck
import { action, date, group, text, Text, toggle, Position, Scope } from "@ybyra/core";
import { schema } from "@/settings/schema";

export const PersonSchema = schema.create("person", {
  groups: {
    basic: group(),
    address: group(),
  },

  fields: {
    name: text().width(100).default("").required().column().filterable().group("basic"),
    email: text().kind(Text.Email).width(60).required().column().group("basic"),
    phone: text().kind(Text.Phone).width(40).group("basic"),
    birthDate: date().width(30).group("basic"),
    active: toggle().width(20).default(true).column().group("basic"),
    street: text().kind(Text.Street).width(60).group("address"),
    city: text().kind(Text.City).width(40).group("address"),
  },

  actions: {
    custom: action().order(-1).warning().positions(Position.footer).scopes(Scope.add),
    save: action().hidden(),
  },
});
