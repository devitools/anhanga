<script lang="ts">
  import type { ScopeValue } from '@anhanga/core'
  import { translate, hasTranslation } from '../i18n'
  import type { Snippet } from 'svelte'

  let { domain, scope, children }: {
    domain: string
    scope: ScopeValue
    children: Snippet
  } = $props()

  let title = $derived(() => {
    const domainKey = `${domain}.title`
    const base = hasTranslation(domainKey) ? translate(domainKey) : domain
    const scopeKey = `common.scopes.${scope}`
    if (scope === 'index' || !hasTranslation(scopeKey)) return base
    return `${base} \u2014 ${translate(scopeKey)}`
  })
</script>

<div class="card">
  <div class="card-title">{title()}</div>
  {@render children()}
</div>
