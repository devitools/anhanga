<template>
  <DataPage
    :domain="'person'"
    :scope="Scope.view"
    :permissions="allPermissions(person)"
  >
    <DataForm
      :schema="person"
      :scope="Scope.view"
      :events="personEvents"
      :handlers="personHandlers"
      :hooks="personHooks"
      :context="{ id }"
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
import { useRoute } from "vue-router";
import { scopes } from "./person/@routes";

const route = useRoute();
const id = route.params.id as string;
const person = PersonSchema.provide();
const component = useComponent(Scope.view, scopes);
</script>
