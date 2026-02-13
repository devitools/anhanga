<template>
  <div v-if="!props.proxy.hidden" class="tree-field">
    <label class="tree-label">{{ label }}</label>
    <q-list bordered separator>
      <template v-for="(flat, idx) in flatNodes" :key="idx">
        <q-item :style="{ paddingLeft: `${flat.depth * 20 + 16}px` }">
          <q-item-section>
            {{ flat.preview }}
          </q-item-section>
          <q-item-section side>
            <div class="row no-wrap q-gutter-xs">
              <q-btn v-if="flat.depth < maxDepth && !props.proxy.disabled" flat dense icon="add" size="sm" @click="props.onChange(addAt(items, flat.path))" />
              <q-btn v-if="!props.proxy.disabled" flat dense icon="close" size="sm" color="negative" @click="props.onChange(removeAt(items, flat.path))" />
            </div>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
    <q-btn v-if="!props.proxy.disabled" flat dense icon="add" class="full-width q-mt-xs" @click="props.onChange([...items, {}])" />
    <div v-if="props.errors.length > 0" class="text-negative text-caption q-mt-xs">{{ props.errors[0] }}</div>
  </div>
</template>

<script setup lang="ts">
import { QList, QItem, QItemSection, QBtn } from 'quasar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FieldRendererProps } from '@ybyra/vue'

type TreeNode = Record<string, unknown>

const props = defineProps<FieldRendererProps>()
const { t, te } = useI18n()

const label = computed(() => {
  const key = `${props.domain}.fields.${props.name}`
  return te(key) ? t(key) : props.name
})

const items = computed(() => Array.isArray(props.value) ? (props.value as TreeNode[]) : [])
const childrenKey = computed(() => (props.config.attrs.childrenKey as string) ?? 'children')
const maxDepth = computed(() => (props.config.attrs.maxDepth as number) ?? Infinity)

const flatNodes = computed(() => {
  const result: { preview: string; path: number[]; depth: number }[] = []
  const walk = (nodes: TreeNode[], path: number[], depth: number) => {
    nodes.forEach((node, i) => {
      const preview = Object.entries(node)
        .filter(([k]) => k !== childrenKey.value)
        .map(([, v]) => v)
        .filter(Boolean)
        .join(', ') || '—'
      result.push({ preview, path: [...path, i], depth })
      const children = (node[childrenKey.value] as TreeNode[]) ?? []
      walk(children, [...path, i], depth + 1)
    })
  }
  walk(items.value, [], 0)
  return result
})

function removeAt(list: TreeNode[], path: number[]): TreeNode[] {
  if (path.length === 1) return list.filter((_, i) => i !== path[0])
  return list.map((item, i) => {
    if (i !== path[0]) return item
    const children = (item[childrenKey.value] as TreeNode[]) ?? []
    return { ...item, [childrenKey.value]: removeAt(children, path.slice(1)) }
  })
}

function addAt(list: TreeNode[], path: number[]): TreeNode[] {
  if (path.length === 0) return [...list, {}]
  return list.map((item, i) => {
    if (i !== path[0]) return item
    const children = (item[childrenKey.value] as TreeNode[]) ?? []
    return { ...item, [childrenKey.value]: addAt(children, path.slice(1)) }
  })
}
</script>
