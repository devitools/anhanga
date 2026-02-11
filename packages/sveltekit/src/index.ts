import './renderers'

export { default as DataForm } from './components/DataForm.svelte'
export { default as DataTable } from './components/DataTable.svelte'
export { default as ActionBar } from './components/ActionBar.svelte'
export { default as ActionButton } from './components/ActionButton.svelte'
export { default as DataPage } from './components/DataPage.svelte'

export { createComponent } from './contracts/component'
export { configureI18n } from './i18n'

export { configureIcons, resolveActionIcon, resolveGroupIcon } from '@anhanga/svelte'
