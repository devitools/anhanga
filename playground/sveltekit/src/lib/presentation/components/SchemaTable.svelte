<script lang="ts">
  import { useDataTable } from '@anhanga/svelte'
  import type { UseDataTableOptions } from '@anhanga/svelte'
  import { translate, hasTranslation } from '$lib/i18n'
  import ActionBar from './ActionBar.svelte'
  import SchemaButton from './SchemaButton.svelte'

  let props: UseDataTableOptions = $props()

  const defaultTranslate = (key: string, params?: Record<string, unknown>) => {
    if (!hasTranslation(key)) return key
    return translate(key, params)
  }

  const tableStore = useDataTable({
    schema: props.schema,
    scope: props.scope,
    handlers: props.handlers,
    hooks: props.hooks,
    context: props.context,
    component: props.component,
    pageSize: props.pageSize,
    translate: props.translate ?? defaultTranslate,
  })

  let table = $derived($tableStore)

  function columnLabel (name: string) {
    const key = `${props.schema.domain}.fields.${name}`
    return hasTranslation(key) ? translate(key) : name
  }
</script>

<div>
  <ActionBar actions={table.actions} position="top" domain={props.schema.domain} />

  {#if table.loading}
    <div class="loading-overlay">Loading...</div>
  {:else if table.empty}
    <div class="table-empty">
      {hasTranslation('common.table.empty') ? translate('common.table.empty') : 'No records found'}
    </div>
  {:else}
    <table>
      <thead>
        <tr>
          {#each table.columns as col (col.name)}
            <th onclick={() => tableStore.setSort(col.name)}>
              {columnLabel(col.name)}
              {#if table.sortField === col.name}
                {table.sortOrder === 'asc' ? ' \u25B2' : ' \u25BC'}
              {/if}
            </th>
          {/each}
          <th style="text-align: right">
            {hasTranslation('common.table.actions') ? translate('common.table.actions') : 'Actions'}
          </th>
        </tr>
      </thead>
      <tbody>
        {#each table.rows as row (tableStore.getIdentity(row))}
          <tr>
            {#each table.columns as col (col.name)}
              <td>{tableStore.formatValue(col.name, row[col.name], row)}</td>
            {/each}
            <td class="actions-cell">
              {#each tableStore.getRowActions(row) as action (action.name)}
                <SchemaButton {action} domain={props.schema.domain} flat small />
              {/each}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <div class="table-footer">
      <span>
        {translate('common.table.page', { page: table.page, total: table.totalPages })}
      </span>
      <div class="pagination">
        <button
          class="btn btn-default btn-sm"
          disabled={table.page <= 1}
          onclick={() => tableStore.setPage(table.page - 1)}
        >
          {translate('common.table.previous')}
        </button>
        <button
          class="btn btn-default btn-sm"
          disabled={table.page >= table.totalPages}
          onclick={() => tableStore.setPage(table.page + 1)}
        >
          {translate('common.table.next')}
        </button>
      </div>
    </div>
  {/if}
</div>
