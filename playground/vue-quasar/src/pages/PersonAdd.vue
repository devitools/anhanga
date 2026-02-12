<template>
  <DataPage
    :domain="'person'"
    :scope="Scope.add"
    :permissions="allPermissions(person)"
  >
    <DataForm
      :schema="person"
      :scope="Scope.add"
      :events="personEvents"
      :handlers="personHandlers"
      :hooks="personHooks"
      :component="component"
      :permissions="allPermissions(person)"
    />
  </DataPage>
</template>

<script
  setup
  lang="ts"
>
import { personHandlers, personHooks } from "@/setup";
import { Scope } from "@ybyra/core";
import { allPermissions, personEvents, PersonSchema } from "@ybyra/demo";
import { DataForm, DataPage, useComponent } from "@ybyra/vue-quasar";
import { scopes } from "./person/@routes";

const person = PersonSchema.provide();
const component = useComponent(Scope.add, scopes);
</script>
