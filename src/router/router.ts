import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserAuth } from '@/stores/userAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Auth/Login.vue'),
    },
    {
      path: '/signUp',
      name: 'SignUp',
      component: () => import('../views/Auth/SignUp.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useUserAuth()
  if (to.meta.requiresAuth) {
    if (authStore.token && authStore.isUserLoggedIn) {
      next()
    } else {
      next({ name: 'Login' })
    }
  } else {
    if (to.name == 'Login' || to.name == 'SignUp') {
      if (authStore.token && authStore.isUserLoggedIn) {
        next('/')
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

export default router
