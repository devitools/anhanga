export { default as DataForm } from './components/DataForm.vue'
export { default as DataTable } from './components/DataTable.vue'
export { default as ActionBar } from './components/ActionBar.vue'
export { default as ActionButton } from './components/ActionButton.vue'
export { default as DataPage } from './components/DataPage.vue'

export { createComponent, useComponent } from './contracts/component'
export { configureI18n } from './i18n'

export { configureIcons, resolveActionIcon, resolveGroupIcon } from '@ybyra/vue'

import './renderers'
