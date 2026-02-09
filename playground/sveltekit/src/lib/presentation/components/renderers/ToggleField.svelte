<script lang="ts">
  import { translate, hasTranslation } from '$lib/settings/i18n'

  let { domain, name, value, proxy, onChange }: {
    domain: string
    name: string
    value: unknown
    proxy: { hidden: boolean; disabled: boolean }
    onChange: (v: unknown) => void
  } = $props()

  let label = $derived(() => {
    const key = `${domain}.fields.${name}`
    return hasTranslation(key) ? translate(key) : name
  })
</script>

{#if !proxy.hidden}
  <div class="toggle-field">
    <input
      id={name}
      type="checkbox"
      checked={Boolean(value)}
      disabled={proxy.disabled}
      onchange={(e) => onChange(e.currentTarget.checked)}
    />
    <label for={name}>{label()}</label>
  </div>
{/if}
