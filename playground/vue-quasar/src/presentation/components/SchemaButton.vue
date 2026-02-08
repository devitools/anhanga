<template>
  <q-btn
      :label="label"
      :icon="resolvedIcon"
      :color="isDefault ? undefined : action.config.variant"
      :outline="isDefault && !flat"
      :unelevated="!isDefault && !flat"
      :flat="flat"
      :dense="dense"
      :size="size"
      no-caps
      class="schema-btn"
      @click="action.execute()"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ResolvedAction } from '@anhanga/vue'
import { iconMap } from '@/presentation/contracts/icons'

const props = withDefaults(defineProps<{
  action: ResolvedAction
  domain: string
  flat?: boolean
  dense?: boolean
  size?: string
}>(), {
  flat: false,
  dense: false,
  size: undefined,
})

const { t, te } = useI18n()

const label = computed(() => {
  const commonKey = `common.actions.${props.action.name}`
  if (te(commonKey)) return t(commonKey)
  const domainKey = `${props.domain}.actions.${props.action.name}`
  if (te(domainKey)) return t(domainKey)
  return props.action.name
})

const resolvedIcon = computed(() => {
  const icon = props.action.config.icon
  if (!icon) return undefined
  return iconMap[icon] ?? icon
})

const isDefault = computed(() => props.action.config.variant === 'default')
</script>
