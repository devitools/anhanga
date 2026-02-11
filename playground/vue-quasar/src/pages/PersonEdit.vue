<template>
  <DataPage
    :domain="'person'"
    :scope="Scope.edit"
  >
    <DataForm
      :schema="person"
      :scope="Scope.edit"
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
import { Scope } from "@anhanga/core";
import { allPermissions, personEvents, PersonSchema } from "@anhanga/demo";
import { DataForm, DataPage, useComponent } from "@anhanga/vue-quasar";
import { useRoute } from "vue-router";
import { scopes } from "./person/@routes";

const route = useRoute();
const id = route.params.id as string;
const person = PersonSchema.provide();
const component = useComponent(Scope.edit, scopes);
</script>
