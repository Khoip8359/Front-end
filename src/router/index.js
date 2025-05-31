import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Hello from '@/views/Hello.vue'
import me from '@/views/me.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/me',
      name: 'me',
      component: me,
    },
    {
      path: '/hello',
      name: 'hello',
      component: Hello,
    },
  ],
})

export default router
