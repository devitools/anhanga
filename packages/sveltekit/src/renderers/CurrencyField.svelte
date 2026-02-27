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

  let prefix = $derived((config.attrs.prefix as string) ?? '')
  let precision = $derived((config.attrs.precision as number) ?? 2)
  let step = $derived(precision > 0 ? (1 / Math.pow(10, precision)).toString() : '1')
</script>

{#if !proxy.hidden}
  <div class="form-field" class:has-error={errors.length > 0}>
    <label for={name}>{label()}</label>
    <div class="currency-wrapper">
      {#if prefix}
        <span class="currency-prefix">{prefix}</span>
      {/if}
      <input
        id={name}
        type="number"
        {step}
        class:has-prefix={!!prefix}
        value={value != null ? String(value) : ''}
        disabled={proxy.disabled}
        oninput={(e) => {
          const v = e.currentTarget.value
          onChange(v === '' ? undefined : Number(v))
        }}
        onblur={() => onBlur()}
        onfocus={() => onFocus()}
      />
    </div>
    {#if errors.length > 0}
      <span class="field-error">{errors[0]}</span>
    {/if}
  </div>
{/if}

<style>
  .currency-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  .currency-prefix {
    position: absolute;
    left: 0.75rem;
    color: var(--muted-foreground, #888);
    pointer-events: none;
  }
  .has-prefix {
    padding-left: 2.25rem;
  }
</style>
