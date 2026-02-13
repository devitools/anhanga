<script lang="ts">
  import { translate, hasTranslation } from '../i18n'

  let { domain, name, value, config, proxy, errors, onChange, onBlur, onFocus }: {
    domain: string
    name: string
    value: unknown
    config: { form: { height: number } }
    proxy: { hidden: boolean; disabled: boolean; height: number }
    errors: string[]
    onChange: (v: unknown) => void
    onBlur: () => void
    onFocus: () => void
  } = $props()

  let label = $derived(() => {
    const key = `${domain}.fields.${name}`
    return hasTranslation(key) ? translate(key) : name
  })

  let rows = $derived(proxy.height || config.form.height || 3)
</script>

{#if !proxy.hidden}
  <div class="form-field" class:has-error={errors.length > 0}>
    <label for={name}>{label()}</label>
    <textarea
      id={name}
      {rows}
      value={String(value ?? '')}
      disabled={proxy.disabled}
      oninput={(e) => onChange(e.currentTarget.value)}
      onblur={() => onBlur()}
      onfocus={() => onFocus()}
    ></textarea>
    {#if errors.length > 0}
      <span class="field-error">{errors[0]}</span>
    {/if}
  </div>
{/if}
