<template>
  <DataPage
    :domain="'person'"
    :scope="Scope.index"
    :permissions="allPermissions(person)"
  >
    <DataTable
      :schema="person"
      :scope="Scope.index"
      :handlers="personHandlers"
      :hooks="personHooks"
      :component="component"
      :permissions="allPermissions(person)"
      :page-size="10"
    />
  </DataPage>
</template>

<script
  setup
  lang="ts"
>
import { personHandlers, personHooks } from "@/setup";
import { Scope } from "@ybyra/core";
import { allPermissions, PersonSchema } from "@ybyra/demo";
import { DataPage, DataTable, useComponent } from "@ybyra/vue-quasar";
import { scopes } from "./person/@routes";

const person = PersonSchema.provide();
const component = useComponent(Scope.index, scopes);
</script>
