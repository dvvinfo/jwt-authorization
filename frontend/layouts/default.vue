<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-2">
            <svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
            </svg>
            <span class="text-xl font-bold text-gray-900">JWT Auth</span>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex space-x-8">
            <NuxtLink
              v-for="link in headerLinks"
              :key="link.to"
              :to="link.to"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-blue-600': $route.path === link.to }"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>

          <!-- User Menu -->
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <img
                  :src="userAvatar"
                  :alt="authStore.user?.email"
                  class="h-8 w-8 rounded-full"
                />
                <span class="text-gray-700">{{ authStore.user?.email }}</span>
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
              >
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button
              @click="showMobileMenu = !showMobileMenu"
              class="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div v-if="showMobileMenu" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            <NuxtLink
              v-for="link in headerLinks"
              :key="link.to"
              :to="link.to"
              class="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              :class="{ 'text-blue-600': $route.path === link.to }"
              @click="showMobileMenu = false"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto px-4 pt-5 pb-5 flex-grow w-full max-w-7xl">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto pt-4 pb-4">
      <div class=" mx-auto px-4 py-6">
        <div class="text-center text-gray-600">
          <p>&copy; 2024 JWT Authorization App. Все права защищены.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

// Состояние меню
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

// Аватар пользователя
const userAvatar = computed(() => {
  if (!authStore.user?.email) return ''
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user.email)}&background=6366f1&color=fff`
})

// Ссылки навигации
const headerLinks = computed(() => {
  const links = [
    { label: 'Главная', to: '/' },
    { label: 'Посты', to: '/posts' }
  ]

  // Добавляем админские ссылки если пользователь админ
  if (authStore.isAdmin) {
    links.push(
      { label: 'Пользователи', to: '/admin/users' },
      { label: 'Роли', to: '/admin/roles' }
    )
  }

  return links
})

// Обработчик выхода
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  showUserMenu.value = false
}

// Закрываем меню при клике вне его
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
      showUserMenu.value = false
    }
  })
})
</script>

<style>

</style>