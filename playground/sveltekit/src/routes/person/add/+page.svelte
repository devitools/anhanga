<script lang="ts">
import { goto } from "$app/navigation";
import { base } from "$app/paths";
import { scopes } from "$lib/routes/person";
import { personHandlers, personHooks } from "$lib/setup";
import { Scope } from "@anhanga/core";
import { allPermissions, personEvents, PersonSchema } from "@anhanga/demo";
import { createComponent, DataForm, DataPage } from "@anhanga/sveltekit";

const person = PersonSchema.provide();
const component = createComponent(Scope.add, scopes, goto, base);
</script>

<DataPage
  domain={person.domain}
  scope={Scope.add}
>
  <DataForm
    schema={person}
    scope={Scope.add}
    events={personEvents}
    handlers={personHandlers}
    hooks={personHooks}
    {component}
    permissions={allPermissions(person)}
  />
</DataPage>
