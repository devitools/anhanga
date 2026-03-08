<template>
  <q-dialog :model-value="true" persistent @update:model-value="$emit('cancel')">
    <q-card style="min-width: 400px; max-width: 640px">
      <q-card-section>
        <div class="text-h6">{{ props.initialValues ? t('common.list.editItem', 'Edit item') : t('common.list.addItem', 'Add item') }}</div>
      </q-card-section>
      <q-card-section>
        <template v-for="field in form.fields" :key="field.name">
          <component
            v-if="!field.proxy.hidden"
            :is="getFieldRenderer(field.config.component)"
            v-bind="form.getFieldProps(field.name)"
          />
        </template>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat :label="t('common.dialog.cancel', 'Cancel')" @click="$emit('cancel')" />
        <q-btn flat :label="t('common.dialog.ok', 'OK')" color="primary" @click="handleSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QDialog, QCard, QCardSection, QCardActions, QBtn } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useDataForm, getRenderer as getFieldRenderer } from '@ybyra/vue'
import type { SchemaProvide, ScopeValue, ComponentContract } from '@ybyra/core'

const props = defineProps<{
  itemSchema: SchemaProvide
  scope: string
  initialValues?: Record<string, unknown>
}>()

const emit = defineEmits<{
  save: [values: Record<string, unknown>]
  cancel: []
}>()

const { t } = useI18n()

const noopComponent: ComponentContract = {
  scope: props.scope as ScopeValue,
  scopes: {} as Record<string, { path: string }>,
  reload: () => {},
  navigator: { push: () => {}, back: () => {}, replace: () => {} },
  dialog: { confirm: async () => true, alert: async () => {} },
  toast: { success: () => {}, error: () => {}, warning: () => {}, info: () => {} },
  loading: { show: () => {}, hide: () => {} },
}

// useDataForm runs in setup context — onMounted works correctly
const form = useDataForm({
  schema: props.itemSchema,
  scope: props.scope as ScopeValue,
  component: noopComponent,
  initialValues: props.initialValues,
})

function handleSave() {
  if (form.validate()) {
    emit('save', { ...form.state })
  }
}
</script>
