<script lang="ts">
  import { translate, hasTranslation } from '../i18n'

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

  let items = $derived(Array.isArray(value) ? (value as Record<string, unknown>[]) : [])
  let reorderable = $derived(config.attrs.reorderable === true)

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function add() {
    onChange([...items, {}])
  }

  function moveUp(index: number) {
    if (index === 0) return
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]]
    onChange(next)
  }

  function moveDown(index: number) {
    if (index >= items.length - 1) return
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]]
    onChange(next)
  }
</script>

{#if !proxy.hidden}
  <div class="form-field" class:has-error={errors.length > 0}>
    <label>{label()}</label>
    <div class="list-container">
      {#each items as item, index}
        <div class="list-row">
          <span class="row-index">#{index + 1}</span>
          <span class="row-preview">
            {Object.values(item).filter(Boolean).join(', ') || '—'}
          </span>
          <div class="row-actions">
            {#if reorderable}
              <button type="button" onclick={() => moveUp(index)} disabled={proxy.disabled || index === 0}>↑</button>
              <button type="button" onclick={() => moveDown(index)} disabled={proxy.disabled || index >= items.length - 1}>↓</button>
            {/if}
            {#if !proxy.disabled}
              <button type="button" class="btn-destructive" onclick={() => remove(index)}>×</button>
            {/if}
          </div>
        </div>
      {/each}
    </div>
    {#if !proxy.disabled}
      <button type="button" class="add-btn" onclick={add}>+</button>
    {/if}
    {#if errors.length > 0}
      <span class="field-error">{errors[0]}</span>
    {/if}
  </div>
{/if}
