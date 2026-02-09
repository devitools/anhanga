<script lang="ts">
  import { useDataForm, getRenderer } from '@anhanga/svelte'
  import type { UseDataFormOptions } from '@anhanga/svelte'
  import { fakeAll } from '@anhanga/demo'
  import { translate, hasTranslation } from '$lib/i18n'
  import ActionBar from './ActionBar.svelte'

  let props: UseDataFormOptions & { debug?: boolean } = $props()

  const defaultTranslate = (key: string, params?: Record<string, unknown>) => {
    if (!hasTranslation(key)) return key
    return translate(key, params)
  }

  const formStore = useDataForm({
    schema: props.schema,
    scope: props.scope,
    events: props.events,
    handlers: props.handlers,
    hooks: props.hooks,
    context: props.context,
    component: props.component,
    initialValues: props.initialValues,
    translate: props.translate ?? defaultTranslate,
  })

  let form = $derived($formStore)

  let debugExpanded = $state(false)
  let debug = $derived(props.debug ?? true)

  function resolveGroup (name: string) {
    const key = `${props.schema.domain}.groups.${name}`
    return hasTranslation(key) ? translate(key) : name
  }

  function handleFill () {
    const fakeData = fakeAll(props.schema.fields, props.schema.identity)
    formStore.setValues(fakeData)
  }
</script>

{#if form.loading}
  <div class="loading-overlay">Loading...</div>
{:else}
  <ActionBar actions={form.actions} position="top" domain={props.schema.domain} />

  {#each form.sections as section, index}
    {#if section.kind === 'group'}
      <div class="group-title">{resolveGroup(section.name)}</div>
    {/if}
    <div class="form-grid">
      {#each section.fields as field (field.name)}
        {#if !field.proxy.hidden}
          {@const renderer = getRenderer(field.config.component)}
          {@const fieldProps = form.getFieldProps(field.name)}
          {#if renderer}
            <div style="width: {field.proxy.width}%; min-width: 200px;">
              <svelte:component this={renderer} {...fieldProps} />
            </div>
          {/if}
        {/if}
      {/each}
    </div>
  {/each}

  <hr class="separator" />

  <ActionBar actions={form.actions} position="footer" domain={props.schema.domain} />

  {#if debug}
    <div class="debug-panel">
      <div class="debug-actions">
        <button class="debug-btn" onclick={handleFill}>Fill</button>
        <button class="debug-btn" onclick={() => formStore.reset()}>Reset</button>
        <button class="debug-btn" onclick={() => formStore.validate()}>Validate</button>
        <button class="debug-btn" onclick={() => globalThis.location.reload()}>Reload</button>
        <button class="debug-btn" onclick={() => debugExpanded = !debugExpanded}>
          {debugExpanded ? '\u2212' : '+'}
        </button>
      </div>

      {#if debugExpanded}
        <div class="debug-label">State</div>
        <pre>{JSON.stringify(form.state, null, 2)}</pre>
        <div class="debug-label">Errors</div>
        <pre>{JSON.stringify(form.errors, null, 2)}</pre>
        <div class="debug-label">
          dirty: {form.dirty} | valid: {form.valid}
        </div>
      {/if}
    </div>
  {/if}
{/if}
