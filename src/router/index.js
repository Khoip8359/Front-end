import { createRouter, createWebHistory } from 'vue-router'
import user_layout from '@/views/user_layout.vue'
import login from '@/components/login.vue'
import main_content from '@/components/main_content.vue'
import news_detail from '@/components/news_detail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: user_layout,
      children: [
        {
          path: '',
          name: 'user_layout',
          component: main_content
        },
        {
          path: 'detail/:newsId',  // Tham số động newsId
          component: news_detail,
          props: true             // Truyền params dưới dạng props
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
   
  ],
})

export default router
