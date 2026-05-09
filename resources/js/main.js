import App from '@/App.vue'
import { formatDate } from '@core/utils/formatters'
import { registerPlugins } from '@core/utils/plugins'
import { createApp } from 'vue'
import Toast, { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Styles
import '@core-scss/template/index.scss'
import '@layouts/styles/index.scss'

// Create vue app
const app = createApp(App)

app.config.globalProperties.$formatDate = formatDate
app.use(Toast)
app.config.globalProperties.$toast = useToast()

// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
