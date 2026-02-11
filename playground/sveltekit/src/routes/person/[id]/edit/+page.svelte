<script lang="ts">
import { goto } from "$app/navigation";
import { base } from "$app/paths";
import { page } from "$app/state";
import { scopes } from "$lib/routes/person";
import { personHandlers, personHooks } from "$lib/setup";
import { Scope } from "@anhanga/core";
import { allPermissions, personEvents, PersonSchema } from "@anhanga/demo";
import { createComponent, DataForm, DataPage } from "@anhanga/sveltekit";

const id = page.params.id;
const person = PersonSchema.provide();
const component = createComponent(Scope.edit, scopes, goto, base);
</script>

<DataPage
  domain={person.domain}
  scope={Scope.edit}
>
  <DataForm
    schema={person}
    scope={Scope.edit}
    events={personEvents}
    handlers={personHandlers}
    hooks={personHooks}
    context={{ id }}
    {component}
    permissions={allPermissions(person)}
  />
</DataPage>
