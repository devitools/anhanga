<script lang="ts">
  import { Scope } from '@anhanga/core'
  import { PersonSchema } from '@anhanga/demo'
  import { personHandlers, personHooks } from '$lib/setup'
  import { createComponent } from '$lib/presentation/contracts/component'
  import { translate, hasTranslation } from '$lib/settings/i18n'
  import SchemaTable from '$lib/presentation/components/SchemaTable.svelte'

  const scopes = {
    [Scope.index]: { path: '/person' },
    [Scope.add]: { path: '/person/add' },
    [Scope.view]: { path: '/person/:id' },
    [Scope.edit]: { path: '/person/:id/edit' },
  }

  const dialog = {
    async confirm (message: string) { return window.confirm(message) },
    async alert (message: string) { window.alert(message) },
  }

  const component = createComponent(Scope.index, scopes, dialog)

  const translateFn = (key: string, params?: Record<string, unknown>) => {
    if (!hasTranslation(key)) return key
    return translate(key, params)
  }
</script>

<div class="card">
  <div class="card-title">{translate('person.title')}</div>
  <SchemaTable
    schema={PersonSchema.provide()}
    scope={Scope.index}
    handlers={personHandlers}
    hooks={personHooks}
    {component}
    translate={translateFn}
    pageSize={3}
  />
</div>
