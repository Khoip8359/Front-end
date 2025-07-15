import { createRouter, createWebHistory } from 'vue-router'
import user_layout from '@/views/user_layout.vue'
import main_content from '@/components/main_content.vue'
import news_detail from '@/components/news_detail.vue'
import Category from '@/components/category.vue'
import Profile from '@/components/profile.vue'
import ChangePassword from '@/components/changePassword.vue'
import AuthForm from '@/components/AuthForm.vue'
import Time from '@/views/time.vue'
import Payment from '@/components/payment.vue'
import Reporter from '@/views/reporter.vue'
import Censor from '@/views/censor.vue'
import reporterDashboard from '@/components/reporterDashboard.vue'
import Write from '@/components/write.vue'
import censorDashboard from '@/components/censorDashboard.vue'
  
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: user_layout,
      children: [
        {
          path: '/',
          component: main_content
        },
        {
          path: 'detail/:newsId',
          component: news_detail,
          props: true
        },
        {
          path: 'category/:categoryId',
          component: Category,
          props: true
        },
        {
          path: 'profile/:username',
          name: 'profile',
          component: Profile,
          meta: { requiresAuth: true }
        },
        {
          path: '/changePassword',
          name: 'changePassword',
          component: ChangePassword
        },
        {
          path: '/payment',
          name: 'payment',
          component: Payment
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: AuthForm
    },
    {
      path: '/time',
      component: Time,
    },
    {
      path: '/reporter',
      component: Reporter,
      children: [
        {
          path: 'dashboard',
          component: reporterDashboard
        },
        {
          path: 'write',
          component: Write
        }
      ]
    },
    {
      path: '/censor',
      component: Censor,
      children:[
        {
          path:"dashboard",
          component: censorDashboard
        }
      ]
    }
  ],
})

export default router
