<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Добро пожаловать в JWT Authorization App
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Безопасная система аутентификации и авторизации с использованием JWT токенов
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <BaseButton
            to="/posts"
            variant="primary"
            size="lg"
            icon="document-text"
          >
            Посмотреть посты
          </BaseButton>
          
          <BaseButton
            v-if="!authStore.isAuthenticated"
            to="/login"
            variant="secondary"
            size="lg"
            icon="user"
          >
            Войти в систему
          </BaseButton>
          
          <BaseButton
            v-if="authStore.isAuthenticated"
            to="/posts/create"
            variant="success"
            size="lg"
            icon="plus"
          >
            Создать пост
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="grid md:grid-cols-3 gap-6">
      <BaseCard variant="elevated">
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <svg class="w-12 h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Безопасная аутентификация</h3>
          <p class="text-gray-600">
            Используйте JWT токены для безопасного входа в систему
          </p>
        </div>
      </BaseCard>

      <BaseCard variant="elevated">
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <svg class="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" clip-rule="evenodd"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Управление ролями</h3>
          <p class="text-gray-600">
            Гибкая система ролей для контроля доступа к функциям
          </p>
        </div>
      </BaseCard>

      <BaseCard variant="elevated">
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <svg class="w-12 h-12 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Управление контентом</h3>
          <p class="text-gray-600">
            Создавайте и управляйте постами с полным контролем доступа
          </p>
        </div>
      </BaseCard>
    </div>

    <!-- Stats Section -->
    <div v-if="authStore.isAuthenticated" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Статистика</h2>
      
      <div class="grid md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-600 mb-2">
            {{ postsStore.posts.length }}
          </div>
          <div class="text-gray-600">Всего постов</div>
        </div>
        
        <div class="text-center">
          <div class="text-3xl font-bold text-green-600 mb-2">
            {{ userPostsCount }}
          </div>
          <div class="text-gray-600">Ваших постов</div>
        </div>
        
        <div class="text-center">
          <div class="text-3xl font-bold text-purple-600 mb-2">
            {{ authStore.user?.roles?.length || 0 }}
          </div>
          <div class="text-gray-600">Ваших ролей</div>
        </div>
      </div>
    </div>

    <!-- Recent Posts -->
    <div v-if="authStore.isAuthenticated && postsStore.posts.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Последние посты</h2>
        <BaseButton
          to="/posts"
          variant="ghost"
          size="sm"
        >
          Посмотреть все
        </BaseButton>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="post in recentPosts"
          :key="post.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">
            {{ post.title }}
          </h3>
          <p class="text-gray-600 text-sm mb-3 line-clamp-3">
            {{ post.content }}
          </p>
          <div class="flex justify-between items-center text-xs text-gray-500">
            <div class="flex items-center gap-2">
              <BaseAvatar :email="post.user?.email" size="sm" />
              <span>{{ post.user?.email || 'Неизвестный автор' }}</span>
            </div>
            <span>{{ formatDate(post.createdAt) }}</span>
          </div>
          <div class="mt-3">
            <BaseButton
              :to="`/posts/${post.id}`"
              variant="ghost"
              size="sm"
            >
              Читать
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { usePostsStore } from '~/stores/posts'
import BaseButton from '~/components/UI/BaseButton.vue'
import BaseCard from '~/components/UI/BaseCard.vue'
import BaseAvatar from '~/components/UI/BaseAvatar.vue'

const authStore = useAuthStore()
const postsStore = usePostsStore()

// Количество постов пользователя
const userPostsCount = computed(() => {
  if (!authStore.user?.id) return 0
  return postsStore.posts.filter(post => post.userId === authStore.user!.id).length
})

// Последние посты
const recentPosts = computed(() => {
  return postsStore.sortedPosts.slice(0, 6)
})

// Форматирование даты
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Загружаем посты при монтировании
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await postsStore.fetchPosts()
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>