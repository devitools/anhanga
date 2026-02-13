<template>
  <div v-if="!props.proxy.hidden" class="list-field">
    <label class="list-label">{{ label }}</label>
    <q-list bordered separator>
      <q-item v-for="(item, index) in items" :key="index">
        <q-item-section side>
          <span class="text-caption">#{{ index + 1 }}</span>
        </q-item-section>
        <q-item-section>
          {{ Object.values(item).filter(Boolean).join(', ') || '—' }}
        </q-item-section>
        <q-item-section side>
          <div class="row no-wrap q-gutter-xs">
            <template v-if="reorderable">
              <q-btn flat dense icon="arrow_upward" size="sm" :disable="props.proxy.disabled || index === 0" @click="moveUp(index)" />
              <q-btn flat dense icon="arrow_downward" size="sm" :disable="props.proxy.disabled || index >= items.length - 1" @click="moveDown(index)" />
            </template>
            <q-btn v-if="!props.proxy.disabled" flat dense icon="close" size="sm" color="negative" @click="remove(index)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn v-if="!props.proxy.disabled" flat dense icon="add" class="full-width q-mt-xs" @click="add" />
    <div v-if="props.errors.length > 0" class="text-negative text-caption q-mt-xs">{{ props.errors[0] }}</div>
  </div>
</template>

<script setup lang="ts">
import { QList, QItem, QItemSection, QBtn } from 'quasar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FieldRendererProps } from '@ybyra/vue'

const props = defineProps<FieldRendererProps>()
const { t, te } = useI18n()

const label = computed(() => {
  const key = `${props.domain}.fields.${props.name}`
  return te(key) ? t(key) : props.name
})

const items = computed(() => Array.isArray(props.value) ? (props.value as Record<string, unknown>[]) : [])
const reorderable = computed(() => props.config.attrs.reorderable === true)

function remove(index: number) {
  props.onChange(items.value.filter((_, i) => i !== index))
}

function add() {
  props.onChange([...items.value, {}])
}

function moveUp(index: number) {
  if (index === 0) return
  const next = [...items.value];
  [next[index - 1], next[index]] = [next[index], next[index - 1]]
  props.onChange(next)
}

function moveDown(index: number) {
  if (index >= items.value.length - 1) return
  const next = [...items.value];
  [next[index], next[index + 1]] = [next[index + 1], next[index]]
  props.onChange(next)
}
</script>
