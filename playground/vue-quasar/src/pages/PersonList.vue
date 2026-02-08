<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ t('person.title') }}</div>
    </q-card-section>

    <q-card-section>
      <SchemaTable
          :schema="PersonSchema.provide()"
          :scope="Scope.index"
          :handlers="personHandlers"
          :hooks="personHooks"
          :component="component"
          :translate="translateFn"
          :page-size="10"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Scope } from '@anhanga/core'
import { PersonSchema } from '@anhanga/demo'
import { personHandlers, personHooks } from '../setup'
import { createComponent, setRouter } from '../presentation/contracts/component'
import SchemaTable from '../presentation/components/SchemaTable.vue'

const { t, te } = useI18n()
const router = useRouter()
setRouter(router)

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

const component = createComponent(Scope.index, scopes, dialog)
</script>
