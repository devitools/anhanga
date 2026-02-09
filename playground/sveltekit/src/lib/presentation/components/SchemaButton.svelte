<script lang="ts">
  import type { ResolvedAction } from '@anhanga/svelte'
  import { translate, hasTranslation } from '$lib/settings/i18n'
  import { iconMap } from '$lib/settings/icons'

  let { action, domain, flat = false, small = false }: {
    action: ResolvedAction
    domain: string
    flat?: boolean
    small?: boolean
  } = $props()

  let label = $derived(() => {
    const commonKey = `common.actions.${action.name}`
    if (hasTranslation(commonKey)) return translate(commonKey)
    const domainKey = `${domain}.actions.${action.name}`
    if (hasTranslation(domainKey)) return translate(domainKey)
    return action.name
  })

  let iconComponent = $derived(() => {
    const i = action.config.icon
    if (!i) return null
    return iconMap[i] ?? null
  })

  let variant = $derived(() => action.config.variant ?? 'default')
</script>

<button
  class="btn btn-{variant()}"
  class:btn-flat={flat}
  class:btn-sm={small}
  onclick={() => action.execute()}
>
  {#if iconComponent()}
    <svelte:component this={iconComponent()} size={small ? 14 : 16} />
  {/if}
  {label()}
</button>
