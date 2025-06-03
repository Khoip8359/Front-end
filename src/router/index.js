import { createRouter, createWebHistory } from 'vue-router'
import user_layout from '@/views/user_layout.vue'
import login from '@/components/login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'user_layout',
      component: user_layout,
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
  ],
})

export default router
