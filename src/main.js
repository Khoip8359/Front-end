import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Khôi phục trạng thái đăng nhập khi ứng dụng khởi động
const authStore = useAuthStore()
authStore.restoreAuth()

app.use(router)
app.mount('#app')
