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
  let selected = $derived(Array.isArray(value) ? (value as string[]) : [])

  function optionLabel(opt: string | number): string {
    const key = `${domain}.fields.${name}.${opt}`
    return hasTranslation(key) ? translate(key) : String(opt)
  }

  function toggle(optValue: string) {
    const next = selected.includes(optValue)
      ? selected.filter((v) => v !== optValue)
      : [...selected, optValue]
    onChange(next)
  }
</script>

{#if !proxy.hidden}
  <div class="form-field" class:has-error={errors.length > 0}>
    <label>{label()}</label>
    {#if selected.length > 0}
      <div class="chips">
        {#each selected as v}
          <span class="chip">
            {optionLabel(v)}
            {#if !proxy.disabled}
              <button type="button" class="chip-remove" onclick={() => toggle(v)}>×</button>
            {/if}
          </span>
        {/each}
      </div>
    {/if}
    <div class="option-list">
      {#each options as opt}
        <label class="option">
          <input
            type="checkbox"
            checked={selected.includes(String(opt))}
            onchange={() => toggle(String(opt))}
            disabled={proxy.disabled}
          />
          {optionLabel(opt)}
        </label>
      {/each}
    </div>
    {#if errors.length > 0}
      <span class="field-error">{errors[0]}</span>
    {/if}
  </div>
{/if}
