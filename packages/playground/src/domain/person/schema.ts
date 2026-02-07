import { action, date, group, text, Text, toggle } from "@anhanga/core";
import { schema } from "../../../settings/schema";
import { personService } from "../../applcation/person/personService";
import { storageService } from "../../applcation/support/storage";

export const PersonSchema = schema.create("person", {
  groups: {
    basic: group().icon("person"),
    address: group().icon("map"),
  },

  fields: {
    name: text().width(100).default("").required().column().filterable().group("basic"),
    email: text().kind(Text.Email).width(60).required().column().group("basic"),
    phone: text().kind(Text.Phone).width(40).group("basic"),
    birthDate: date().width(30).column().group("basic"),
    active: toggle().width(20).default(true).column().group("basic"),
    street: text().kind(Text.Street).width(60).group("address"),
    city: text().kind(Text.City).width(40).group("address"),
  },

  services: {
    default: personService,
    storage: storageService,
  },

  actions: {
    custom: action().icon("plane").destructive(),
    save: action().hidden(),
    cancel: null,
  },
});
