<script lang="ts">
  import { translate, hasTranslation } from '../i18n'

  let { domain, name, value, config, proxy, errors, onChange, onBlur, onFocus }: {
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

  let options = $derived((config.attrs.options ?? []) as (string | number)[])

  function optionLabel(opt: string | number): string {
    const key = `${domain}.fields.${name}.${opt}`
    return hasTranslation(key) ? translate(key) : String(opt)
  }
</script>

{#if !proxy.hidden}
  <div class="form-field" class:has-error={errors.length > 0}>
    <label for={name}>{label()}</label>
    <select
      id={name}
      value={String(value ?? '')}
      disabled={proxy.disabled}
      onchange={(e) => onChange(e.currentTarget.value)}
      onblur={() => onBlur()}
      onfocus={() => onFocus()}
    >
      <option value=""></option>
      {#each options as opt}
        <option value={String(opt)}>{optionLabel(opt)}</option>
      {/each}
    </select>
    {#if errors.length > 0}
      <span class="field-error">{errors[0]}</span>
    {/if}
  </div>
{/if}
