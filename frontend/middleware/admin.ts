import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((_to, _from) => {
  const authStore = useAuthStore()
  
  // Проверяем, является ли пользователь администратором
  if (!authStore.isAdmin) {
    return navigateTo('/')
  }
}) 