<script lang="ts">
  import { translate, hasTranslation } from '../i18n'

  let { domain, name, value, config, proxy, errors, onChange }: {
    domain: string
    name: string
    value: unknown
    config: { component: string; attrs: Record<string, unknown> }
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

  let accept = $derived((config.attrs.accept as string) ?? (config.component === 'image' ? 'image/*' : undefined))
  let isImage = $derived(config.component === 'image')
  let fileName = $derived(value instanceof File ? value.name : (value ? String(value) : ''))

  let fileInput: HTMLInputElement

  function handleChange(e: Event) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    onChange(file ?? null)
  }
</script>

{#if !proxy.hidden}
  <div class="form-field" class:has-error={errors.length > 0}>
    <label>{label()}</label>
    <div class="file-wrapper">
      <button
        type="button"
        class="file-choose-btn"
        disabled={proxy.disabled}
        onclick={() => fileInput.click()}
      >
        {isImage ? 'Choose image…' : 'Choose file…'}
      </button>
      <span class="file-name">{fileName || 'No file selected'}</span>
      <input
        bind:this={fileInput}
        type="file"
        {accept}
        style="display:none"
        onchange={handleChange}
        disabled={proxy.disabled}
      />
    </div>
    {#if errors.length > 0}
      <span class="field-error">{errors[0]}</span>
    {/if}
  </div>
{/if}

<style>
  .file-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .file-choose-btn {
    white-space: nowrap;
    padding: 0.4rem 0.75rem;
    border: 1px solid var(--input-border, #ccc);
    border-radius: 0.375rem;
    background: var(--secondary, #f0f0f0);
    color: var(--secondary-foreground, #333);
    cursor: pointer;
    font-size: 0.875rem;
  }
  .file-choose-btn:disabled {
    cursor: default;
    opacity: 0.6;
  }
  .file-name {
    font-size: 0.875rem;
    color: var(--muted-foreground, #888);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
