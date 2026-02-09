<script lang="ts">
  import type { ResolvedAction } from '@anhanga/svelte'
  import type { PositionValue } from '@anhanga/core'
  import SchemaButton from './SchemaButton.svelte'

  let { actions, position, domain }: {
    actions: ResolvedAction[]
    position: PositionValue
    domain: string
  } = $props()

  let filtered = $derived(() =>
    actions.filter((a) => a.config.positions?.includes(position)),
  )

  let startActions = $derived(() =>
    filtered().filter((a) => a.config.align === 'start'),
  )

  let endActions = $derived(() =>
    filtered().filter((a) => a.config.align === 'end'),
  )
</script>

{#if filtered().length > 0}
  <div class="action-bar">
    <div class="action-group">
      {#each startActions() as action (action.name)}
        <SchemaButton {action} {domain} />
      {/each}
    </div>
    <div class="action-group">
      {#each endActions() as action (action.name)}
        <SchemaButton {action} {domain} />
      {/each}
    </div>
  </div>
{/if}
