<template>
  <DataPage
    :domain="'person'"
    :scope="Scope.add"
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
import { Scope } from "@anhanga/core";
import { allPermissions, personEvents, PersonSchema } from "@anhanga/demo";
import { DataForm, DataPage, useComponent } from "@anhanga/vue-quasar";
import { scopes } from "./person/@routes";

const person = PersonSchema.provide();
const component = useComponent(Scope.add, scopes);
</script>
