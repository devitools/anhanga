<template>
  <div
      v-if="filtered.length > 0"
      class="row justify-between items-center q-mb-md"
  >
    <div class="row q-gutter-sm">
      <ActionButton
          v-for="action in startActions"
          :key="action.name"
          :action="action"
          :domain="props.domain"
      />
    </div>
    <div class="row q-gutter-sm">
      <ActionButton
          v-for="action in endActions"
          :key="action.name"
          :action="action"
          :domain="props.domain"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ResolvedAction } from '@ybyra/vue'
import type { PositionValue } from '@ybyra/core'
import ActionButton from './ActionButton.vue'

const props = defineProps<{
  actions: ResolvedAction[]
  position: PositionValue
  domain: string
}>()

const filtered = computed(() =>
    props.actions.filter((a) => a.config.positions?.includes(props.position)),
)

const startActions = computed(() =>
    filtered.value.filter((a) => a.config.align === 'start'),
)

const endActions = computed(() =>
    filtered.value.filter((a) => a.config.align === 'end'),
)
</script>
