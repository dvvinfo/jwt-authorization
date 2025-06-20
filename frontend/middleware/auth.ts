import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, _from) => {
  const authStore = useAuthStore()
  
  // Инициализируем аутентификацию при первом заходе
  if (!authStore.isAuthenticated) {
    authStore.initAuth()
  }

  // Если пользователь не аутентифицирован и пытается зайти на защищенную страницу
  if (!authStore.isAuthenticated && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login')
  }

  // Если пользователь аутентифицирован и пытается зайти на страницы логина/регистрации
  if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
}) 