import { defineStore } from 'pinia'
import type { User, LoginRequest, RegisterRequest } from '~/types/api'

export const useAuthStore = defineStore('auth', () => {
  const api = useApi()
  
  // Состояние
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Инициализация при загрузке
  const initAuth = () => {
    const token = api.getAuthToken()
    const savedUser = api.getCurrentUser()
    
    if (token && savedUser) {
      user.value = savedUser
      isAuthenticated.value = true
    }
  }

  // Логин
  const login = async (credentials: LoginRequest) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.login(credentials)
      user.value = response.user
      isAuthenticated.value = true
      api.setCurrentUser(response.user)
      
      // Перенаправляем на главную страницу
      await navigateTo('/')
      
      return response
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string } }
      error.value = errorData.data?.message || 'Ошибка входа'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Регистрация
  const register = async (credentials: RegisterRequest) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.register(credentials)
      user.value = response.user
      isAuthenticated.value = true
      api.setCurrentUser(response.user)
      
      // Перенаправляем на главную страницу
      await navigateTo('/')
      
      return response
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string } }
      error.value = errorData.data?.message || 'Ошибка регистрации'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Выход
  const logout = () => {
    api.logout()
    api.removeCurrentUser()
    user.value = null
    isAuthenticated.value = false
    error.value = null
    
    // Перенаправляем на страницу входа
    navigateTo('/login')
  }

  // Проверка роли администратора
  const isAdmin = computed(() => {
    return user.value?.roles?.some(role => role.value === 'ADMIN') || false
  })

  // Проверка роли модератора
  const isModerator = computed(() => {
    return user.value?.roles?.some(role => role.value === 'MODERATOR') || false
  })

  // Проверка роли пользователя
  const isUser = computed(() => {
    return user.value?.roles?.some(role => role.value === 'USER') || false
  })

  // Проверка бана
  const isBanned = computed(() => {
    return user.value?.banned || false
  })

  // Очистка ошибки
  const clearError = () => {
    error.value = null
  }

  return {
    // Состояние
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Геттеры
    isAdmin,
    isModerator,
    isUser,
    isBanned,
    
    // Действия
    initAuth,
    login,
    register,
    logout,
    clearError
  }
}) 