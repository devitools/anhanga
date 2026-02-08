<template>
  <q-input
    v-if="!props.proxy.hidden"
    :model-value="props.value != null ? String(props.value) : ''"
    :label="label"
    :disable="props.proxy.disabled"
    :error="props.errors.length > 0"
    :error-message="props.errors[0]"
    type="number"
    outlined
    dense
    @update:model-value="props.onChange($event === '' ? undefined : Number($event))"
    @blur="props.onBlur()"
    @focus="props.onFocus()"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FieldRendererProps } from '@anhanga/vue'

const props = defineProps<FieldRendererProps>()
const { t, te } = useI18n()

const label = computed(() => {
  const key = `${props.domain}.fields.${props.name}`
  return te(key) ? t(key) : props.name
})
</script>
