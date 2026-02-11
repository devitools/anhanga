<script lang="ts">
  import { translate, hasTranslation } from '../i18n'

  let { domain, name, value, proxy, errors, onChange, onBlur, onFocus }: {
    domain: string
    name: string
    value: unknown
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
</script>

{#if !proxy.hidden}
  <div class="form-field" class:has-error={errors.length > 0}>
    <label for={name}>{label()}</label>
    <input
      id={name}
      type="text"
      value={String(value ?? '')}
      disabled={proxy.disabled}
      oninput={(e) => onChange(e.currentTarget.value)}
      onblur={() => onBlur()}
      onfocus={() => onFocus()}
    />
    {#if errors.length > 0}
      <span class="field-error">{errors[0]}</span>
    {/if}
  </div>
{/if}
