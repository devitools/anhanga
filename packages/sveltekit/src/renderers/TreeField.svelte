<script lang="ts">
  import { translate, hasTranslation } from '../i18n'

  type TreeNode = Record<string, unknown>

  let { domain, name, value, config, proxy, errors, onChange }: {
    domain: string
    name: string
    value: unknown
    config: { attrs: Record<string, unknown> }
    proxy: { hidden: boolean; disabled: boolean }
    errors: string[]
    onChange: (v: unknown) => void
    onBlur: () => void
    onFocus: () => void
  } = $props()

  let label = $derived(() => {
    const key = `${domain}.fields.${name}`
    return hasTranslation(key) ? translate(key) : name
  })

  let items = $derived(Array.isArray(value) ? (value as TreeNode[]) : [])
  let childrenKey = $derived((config.attrs.childrenKey as string) ?? 'children')
  let maxDepth = $derived((config.attrs.maxDepth as number) ?? Infinity)

  function removeAt(list: TreeNode[], path: number[]): TreeNode[] {
    if (path.length === 1) return list.filter((_, i) => i !== path[0])
    return list.map((item, i) => {
      if (i !== path[0]) return item
      const children = (item[childrenKey] as TreeNode[]) ?? []
      return { ...item, [childrenKey]: removeAt(children, path.slice(1)) }
    })
  }

  function addAt(list: TreeNode[], path: number[]): TreeNode[] {
    if (path.length === 0) return [...list, {}]
    return list.map((item, i) => {
      if (i !== path[0]) return item
      const children = (item[childrenKey] as TreeNode[]) ?? []
      return { ...item, [childrenKey]: addAt(children, path.slice(1)) }
    })
  }

  function getPreview(node: TreeNode): string {
    return Object.entries(node)
      .filter(([k]) => k !== childrenKey)
      .map(([, v]) => v)
      .filter(Boolean)
      .join(', ') || '—'
  }

  function getChildren(node: TreeNode): TreeNode[] {
    return (node[childrenKey] as TreeNode[]) ?? []
  }
</script>

{#snippet treeNode(node: TreeNode, path: number[], depth: number)}
  <div class="tree-node" style="margin-left: {depth * 20}px">
    <div class="tree-row">
      <span class="row-preview">{getPreview(node)}</span>
      <div class="row-actions">
        {#if depth < maxDepth && !proxy.disabled}
          <button type="button" onclick={() => onChange(addAt(items, path))}>+</button>
        {/if}
        {#if !proxy.disabled}
          <button type="button" class="btn-destructive" onclick={() => onChange(removeAt(items, path))}>×</button>
        {/if}
      </div>
    </div>
    {#each getChildren(node) as child, ci}
      {@render treeNode(child, [...path, ci], depth + 1)}
    {/each}
  </div>
{/snippet}

{#if !proxy.hidden}
  <div class="form-field" class:has-error={errors.length > 0}>
    <label>{label()}</label>
    <div class="tree-container">
      {#each items as item, i}
        {@render treeNode(item, [i], 0)}
      {/each}
    </div>
    {#if !proxy.disabled}
      <button type="button" class="add-btn" onclick={() => onChange([...items, {}])}>+</button>
    {/if}
    {#if errors.length > 0}
      <span class="field-error">{errors[0]}</span>
    {/if}
  </div>
{/if}
