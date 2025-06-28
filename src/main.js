import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App)

// ✅ Tạo 1 instance duy nhất
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) // ✅ Gắn plugin đúng cách
app.use(pinia) // ✅ Dùng pinia duy nhất

app.use(router)
app.mount('#app')
