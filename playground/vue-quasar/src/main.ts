import { createApp } from 'vue'
import { Quasar, Notify, Dialog, Loading } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import './quasar-variants.css'
import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'
import './presentation/components/renderers'

const app = createApp(App)

app.use(Quasar, {
  plugins: { Notify, Dialog, Loading },
})
app.use(router)
app.use(i18n)

app.mount('#app')
