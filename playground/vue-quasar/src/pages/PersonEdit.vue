<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ t('person.title') }} — {{ t('common.scopes.edit') }}</div>
    </q-card-section>

    <q-card-section>
      <SchemaForm
        :schema="PersonSchema.provide()"
        :scope="Scope.edit"
        :events="personEvents"
        :handlers="personHandlers"
        :hooks="personHooks"
        :context="{ id }"
        :component="component"
        :translate="translateFn"
        :permissions="allPermissions(PersonSchema.provide())"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Scope } from '@anhanga/core'
import { allPermissions, PersonSchema, personEvents } from '@anhanga/demo'
import { personHandlers, personHooks } from '../setup'
import { createComponent, setRouter } from '../presentation/contracts/component'
import SchemaForm from '../presentation/components/SchemaForm.vue'

const { t, te } = useI18n()
const router = useRouter()
const route = useRoute()
setRouter(router)

const id = route.params.id as string

const scopes = {
  [Scope.index]: { path: '/person' },
  [Scope.add]: { path: '/person/add' },
  [Scope.view]: { path: '/person/view/:id' },
  [Scope.edit]: { path: '/person/edit/:id' },
}

const dialog = {
  async confirm (message: string) {
    return window.confirm(message)
  },
  async alert (message: string) {
    window.alert(message)
  },
}

const translateFn = (key: string, params?: Record<string, unknown>) => {
  if (!te(key)) return key
  return t(key, params ?? {})
}

const component = createComponent(Scope.edit, scopes, dialog)
</script>
