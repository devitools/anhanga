<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ t('person.title') }}</div>
    </q-card-section>

    <q-card-section>
      <div class="row q-gutter-sm q-mb-md">
        <q-btn
          v-for="action in table.actions"
          :key="action.name"
          :label="resolveAction(action.name)"
          :icon="resolveIcon(action.config.icon)"
          :color="action.config.variant === 'default' ? undefined : action.config.variant"
          :outline="action.config.variant === 'default'"
          :unelevated="action.config.variant !== 'default'"
          no-caps
          rounded
          @click="action.execute()"
        />
      </div>

      <q-table
        :rows="table.rows"
        :columns="qColumns"
        :loading="table.loading"
        row-key="__identity"
        flat
        bordered
        :rows-per-page-options="[10, 25, 50]"
        :pagination="pagination"
        @update:pagination="onPagination"
      >
        <template #body-cell-__actions="cellProps">
          <q-td :props="cellProps" class="text-right">
            <q-btn
              v-for="action in table.getRowActions(cellProps.row)"
              :key="action.name"
              :label="resolveAction(action.name)"
              :icon="resolveIcon(action.config.icon)"
              :color="action.config.variant === 'default' ? undefined : action.config.variant"
              flat
              dense
              no-caps
              rounded
              size="sm"
              class="q-ml-xs"
              @click="action.execute()"
            />
          </q-td>
        </template>

        <template #no-data>
          <div class="full-width text-center q-pa-lg text-grey">
            {{ t('common.table.empty') }}
          </div>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Scope } from '@anhanga/core'
import { useSchemaTable } from '@anhanga/vue'
import { PersonSchema } from '@anhanga/demo'
import { personHandlers, personHooks } from '../setup'
import { createComponent, setRouter } from '../presentation/contracts/component'
import { iconMap } from '../presentation/contracts/icons'

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

const table = useSchemaTable({
  schema: PersonSchema.provide(),
  scope: Scope.index,
  handlers: personHandlers,
  hooks: personHooks,
  component,
  translate: translateFn,
  pageSize: 10,
})

function resolveAction (name: string) {
  const commonKey = `common.actions.${name}`
  if (te(commonKey)) return t(commonKey)
  return name
}

function resolveIcon (icon?: string) {
  if (!icon) return undefined
  return iconMap[icon] ?? icon
}

const qColumns = computed(() => {
  const cols = table.columns.map((col) => {
    const fieldKey = `person.fields.${col.name}`
    return {
      name: col.name,
      label: te(fieldKey) ? t(fieldKey) : col.name,
      field: col.name,
      align: 'left' as const,
      sortable: true,
    }
  })
  cols.push({
    name: '__actions',
    label: te('common.table.actions') ? t('common.table.actions') : 'Actions',
    field: '__actions',
    align: 'right' as const,
    sortable: false,
  })
  return cols
})

const pagination = computed(() => ({
  page: table.page,
  rowsPerPage: table.limit,
  rowsNumber: table.total,
}))

function onPagination (props: { page: number; rowsPerPage: number }) {
  if (props.page !== table.page) table.setPage(props.page)
  if (props.rowsPerPage !== table.limit) table.setLimit(props.rowsPerPage)
}
</script>
