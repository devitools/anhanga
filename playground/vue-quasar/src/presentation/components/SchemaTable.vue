<template>
  <div>
    <ActionBar
        :actions="table.actions"
        position="top"
        :domain="props.schema.domain"
    />

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
          <SchemaButton
              v-for="action in table.getRowActions(cellProps.row)"
              :key="action.name"
              :action="action"
              :domain="props.schema.domain"
              flat
              dense
              size="sm"
              class="q-ml-xs"
          />
        </q-td>
      </template>

      <template #no-data>
        <div class="full-width text-center q-pa-lg text-grey">
          {{ t('common.table.empty') }}
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDataTable } from '@anhanga/vue'
import type { UseDataTableOptions } from '@anhanga/vue'
import ActionBar from './ActionBar.vue'
import SchemaButton from './SchemaButton.vue'

const props = defineProps<UseDataTableOptions>()

const { t, te } = useI18n()
const translateFn = (key: string, params?: Record<string, unknown>) => {
  if (!te(key)) return key
  return t(key, params ?? {})
}

const table = useDataTable({ ...props, translate: props.translate ?? translateFn })

const qColumns = computed(() => {
  const cols = table.columns.map((col) => {
    const fieldKey = `${props.schema.domain}.fields.${col.name}`
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

function onPagination (p: { page: number; rowsPerPage: number }) {
  if (p.page !== table.page) table.setPage(p.page)
  if (p.rowsPerPage !== table.limit) table.setLimit(p.rowsPerPage)
}
</script>
