<script lang="ts">
  import type { ResolvedAction } from '@anhanga/svelte'
  import { resolveActionIcon } from '@anhanga/svelte'
  import { translate, hasTranslation } from '$lib/settings/i18n'

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
    const resolved = resolveActionIcon(domain, action.name)
    if (!resolved) return null
    return resolved as import('svelte').ComponentType
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
