<script lang="ts">
  import { translate, hasTranslation } from '../i18n'
  import { getRenderer } from '@ybyra/svelte'
  import { useDataForm } from '@ybyra/svelte'
  import type { UseDataFormStore } from '@ybyra/svelte'
  import type { SchemaProvide, ScopeValue, ComponentContract } from '@ybyra/core'

  let { domain, name, value, config, proxy, errors, onChange, scope }: {
    domain: string
    name: string
    value: unknown
    config: { attrs: Record<string, unknown> }
    proxy: { hidden: boolean; disabled: boolean }
    errors: string[]
    onChange: (v: unknown) => void
    onBlur: () => void
    onFocus: () => void
    scope: string
  } = $props()

  let label = $derived(() => {
    const key = `${domain}.fields.${name}`
    return hasTranslation(key) ? translate(key) : name
  })

  let items = $derived(Array.isArray(value) ? (value as Record<string, unknown>[]) : [])
  let reorderable = $derived(config.attrs.reorderable === true)
  let itemSchema = $derived(() => {
    const raw = config.attrs.itemSchema
    return raw && typeof raw === 'object' && 'fields' in raw && 'domain' in raw
      ? (raw as SchemaProvide)
      : undefined
  })

  let showAdd = $state(false)
  let editIndex = $state<number | null>(null)

  // Sub-form store (Svelte Readable)
  let formStore = $state<UseDataFormStore | null>(null)
  // Reactive subscription to the store value
  let form = $derived(formStore ? $formStore : null)

  const noopComponent: ComponentContract = {
    scope: scope as ScopeValue,
    scopes: {} as Record<string, { path: string }>,
    reload: () => {},
    navigator: { push: () => {}, back: () => {}, replace: () => {} },
    dialog: { confirm: async () => true, alert: async () => {} },
    toast: { success: () => {}, error: () => {}, warning: () => {}, info: () => {} },
    loading: { show: () => {}, hide: () => {} },
  }

  function openAdd() {
    const schema = itemSchema()
    if (schema) {
      formStore = useDataForm({
        schema,
        scope: scope as ScopeValue,
        component: noopComponent,
      })
      showAdd = true
    } else {
      onChange([...items, {}])
    }
  }

  function openEdit(index: number) {
    const schema = itemSchema()
    if (!schema) return
    formStore = useDataForm({
      schema,
      scope: scope as ScopeValue,
      component: noopComponent,
      initialValues: items[index],
    })
    editIndex = index
  }

  function saveNew() {
    if (!form) return
    if (formStore!.validate()) {
      onChange([...$state.snapshot(items), { ...form.state }])
      cancelModal()
    }
  }

  function saveEdit() {
    if (!form || editIndex === null) return
    if (formStore!.validate()) {
      const next = [...$state.snapshot(items)]
      next[editIndex] = { ...form.state }
      onChange(next)
      cancelModal()
    }
  }

  function cancelModal() {
    showAdd = false
    editIndex = null
    formStore = null
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index))
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

  let modalOpen = $derived(showAdd || editIndex !== null)
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
            {#if itemSchema() && !proxy.disabled}
              <button type="button" onclick={() => openEdit(index)}>✎</button>
            {/if}
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
      <button type="button" class="add-btn" onclick={openAdd}>+</button>
    {/if}
    {#if errors.length > 0}
      <span class="field-error">{errors[0]}</span>
    {/if}
  </div>
{/if}

{#if modalOpen && form}
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div class="modal-overlay" role="dialog" tabindex="-1" onclick={cancelModal} onkeydown={(e) => e.key === 'Escape' && cancelModal()}>
    <div class="modal-card" onclick={(e) => e.stopPropagation()}>
      <div class="modal-title">
        {editIndex !== null
          ? (hasTranslation('common.list.editItem') ? translate('common.list.editItem') : 'Edit item')
          : (hasTranslation('common.list.addItem') ? translate('common.list.addItem') : 'Add item')}
      </div>
      <div class="modal-body">
        {#each form.fields as field (field.name)}
          {#if !field.proxy.hidden}
            {@const renderer = getRenderer(field.config.component)}
            {#if renderer}
              <svelte:component this={renderer} {...form.getFieldProps(field.name)} />
            {/if}
          {/if}
        {/each}
      </div>
      <div class="modal-actions">
        <button type="button" class="modal-cancel" onclick={cancelModal}>{hasTranslation('common.dialog.cancel') ? translate('common.dialog.cancel') : 'Cancel'}</button>
        <button type="button" class="modal-ok" onclick={editIndex !== null ? saveEdit : saveNew}>{hasTranslation('common.dialog.ok') ? translate('common.dialog.ok') : 'OK'}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  .modal-card {
    background: var(--card, white);
    border-radius: 0.75rem;
    padding: 1.5rem;
    min-width: 400px;
    max-width: 640px;
    max-height: 80vh;
    overflow: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .modal-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  .modal-body {
    margin-bottom: 1.5rem;
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  .modal-cancel, .modal-ok {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    min-width: 80px;
    text-align: center;
  }
  .modal-cancel {
    background: var(--secondary, #f0f0f0);
    color: var(--secondary-foreground, #333);
  }
  .modal-ok {
    background: var(--primary, #3b82f6);
    color: var(--primary-foreground, white);
  }
</style>
