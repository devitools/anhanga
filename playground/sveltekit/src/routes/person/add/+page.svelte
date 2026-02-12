<script lang="ts">
import { goto } from "$app/navigation";
import { base } from "$app/paths";
import { scopes } from "$lib/routes/person";
import { personHandlers, personHooks } from "$lib/setup";
import { Scope } from "@ybyra/core";
import { allPermissions, personEvents, PersonSchema } from "@ybyra/demo";
import { createComponent, DataForm, DataPage } from "@ybyra/sveltekit";

const person = PersonSchema.provide();
const component = createComponent(Scope.add, scopes, goto, base);
</script>

<DataPage
  domain={person.domain}
  scope={Scope.add}
  permissions={allPermissions(person)}
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
