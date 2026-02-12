<script lang="ts">
  import type { ScopeValue } from '@ybyra/core'
  import { isScopePermitted } from '@ybyra/core'
  import { translate, hasTranslation } from '../i18n'
  import type { Snippet } from 'svelte'

  let { domain, scope, permissions, forbidden, children }: {
    domain: string
    scope: ScopeValue
    permissions?: string[]
    forbidden?: Snippet
    children: Snippet
  } = $props()

  let permitted = $derived(!permissions || isScopePermitted(domain, scope, permissions))

  let title = $derived(() => {
    const domainKey = `${domain}.title`
    const base = hasTranslation(domainKey) ? translate(domainKey) : domain
    const scopeKey = `common.scopes.${scope}`
    if (scope === 'index' || !hasTranslation(scopeKey)) return base
    return `${base} — ${translate(scopeKey)}`
  })
</script>

{#if permitted}
  <div class="card">
    <div class="card-title">{title()}</div>
    {@render children()}
  </div>
{:else if forbidden}
  {@render forbidden()}
{:else}
  <div class="forbidden">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19.69 14a6.9 6.9 0 00.31-2V5l-8-3-3.16 1.18" />
      <path d="M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 005.62-4.38" />
      <path d="M1 1l22 22" />
    </svg>
    <span>{translate('common.forbidden')}</span>
  </div>
{/if}

<style>
  .forbidden {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    gap: 8px;
    color: var(--color-muted-foreground, #6b7280);
  }
</style>
