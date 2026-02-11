<script lang="ts">
  import { goto } from '$app/navigation'
  import { base } from '$app/paths'
  import { Scope } from '@anhanga/core'
  import { allPermissions, PersonSchema } from '@anhanga/demo'
  import { DataTable, DataPage, createComponent } from '@anhanga/sveltekit'
  import { personHandlers, personHooks } from '$lib/setup'
  import { scopes } from '$lib/routes/person'

  const person = PersonSchema.provide()
  const component = createComponent(Scope.index, scopes, goto, base)
</script>

<DataPage domain={person.domain} scope={Scope.index} permissions={allPermissions(person)}>
  <DataTable
    schema={person}
    scope={Scope.index}
    handlers={personHandlers}
    hooks={personHooks}
    {component}
    permissions={allPermissions(person)}
    pageSize={3}
  />
</DataPage>
