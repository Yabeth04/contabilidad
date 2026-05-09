import { createApp } from 'vue'
import App from '@/App.vue'
import { formatDate } from '@core/utils/formatters'
import { registerPlugins } from '@core/utils/plugins'

// Styles
import '@core-scss/template/index.scss'
import '@layouts/styles/index.scss'

// Create vue app
const app = createApp(App)

app.config.globalProperties.$formatDate = formatDate

// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
