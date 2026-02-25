<template>
  <div v-if="!props.proxy.hidden" class="file-field">
    <label class="file-label">{{ label }}</label>
    <div class="row items-center q-gutter-sm">
      <q-btn
        outline
        dense
        :disable="props.proxy.disabled"
        :label="isImage ? 'Choose image…' : 'Choose file…'"
        @click="fileInput?.click()"
      />
      <span class="text-caption text-grey">{{ fileName || 'No file selected' }}</span>
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        style="display: none"
        @change="handleChange"
      />
    </div>
    <div v-if="props.errors.length > 0" class="text-negative text-caption q-mt-xs">{{ props.errors[0] }}</div>
  </div>
</template>

<script setup lang="ts">
import { QBtn } from 'quasar'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FieldRendererProps } from '@ybyra/vue'

const props = defineProps<FieldRendererProps>()
const { t, te } = useI18n()

const fileInput = ref<HTMLInputElement>()

const label = computed(() => {
  const key = `${props.domain}.fields.${props.name}`
  return te(key) ? t(key) : props.name
})

const accept = computed(() => (props.config.attrs.accept as string) ?? (props.config.component === 'image' ? 'image/*' : undefined))
const isImage = computed(() => props.config.component === 'image')
const fileName = computed(() => {
  const v = props.value
  if (v instanceof File) return v.name
  return v ? String(v) : ''
})

function handleChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  props.onChange(file ?? null)
}
</script>
