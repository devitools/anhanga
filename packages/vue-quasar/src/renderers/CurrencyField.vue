<template>
  <q-input
    v-if="!props.proxy.hidden"
    :model-value="props.value != null ? String(props.value) : ''"
    :label="label"
    :prefix="prefix"
    :disable="props.proxy.disabled"
    :error="props.errors.length > 0"
    :error-message="props.errors[0]"
    :step="step"
    type="number"
    outlined
    dense
    @update:model-value="props.onChange($event === '' ? undefined : Number($event))"
    @blur="props.onBlur()"
    @focus="props.onFocus()"
  />
</template>

<script setup lang="ts">
import { QInput } from 'quasar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FieldRendererProps } from '@ybyra/vue'

const props = defineProps<FieldRendererProps>()
const { t, te } = useI18n()

const label = computed(() => {
  const key = `${props.domain}.fields.${props.name}`
  return te(key) ? t(key) : props.name
})

const prefix = computed(() => (props.config.attrs.prefix as string) ?? '')
const precision = computed(() => (props.config.attrs.precision as number) ?? 2)
const step = computed(() => precision.value > 0 ? (1 / Math.pow(10, precision.value)).toString() : '1')
</script>
