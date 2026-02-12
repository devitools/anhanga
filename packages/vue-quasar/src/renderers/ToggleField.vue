<template>
  <q-toggle
    v-if="!props.proxy.hidden"
    :model-value="Boolean(props.value)"
    :label="label"
    :disable="props.proxy.disabled"
    @update:model-value="props.onChange($event)"
  />
</template>

<script setup lang="ts">
import { QToggle } from 'quasar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FieldRendererProps } from '@ybyra/vue'

const props = defineProps<FieldRendererProps>()
const { t, te } = useI18n()

const label = computed(() => {
  const key = `${props.domain}.fields.${props.name}`
  return te(key) ? t(key) : props.name
})
</script>
