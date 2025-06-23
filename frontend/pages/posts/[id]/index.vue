<template>
  <div>
    <!-- Этот блок будет показан только на странице /posts/[id], а не на /posts/[id]/edit -->
    <div v-if="!isEditPage" class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <BaseButton
            to="/posts"
            variant="ghost"
            icon="arrow-left"
          >
            Назад
          </BaseButton>
          <h1 class="text-3xl font-bold text-gray-900">Просмотр поста</h1>
        </div>

        <div v-if="canEditPost" class="flex space-x-2">
          <BaseButton
            :to="`/posts/${route.params.id}/edit`"
            variant="ghost"
            icon="pencil"
          >
            Редактировать
          </BaseButton>
          
          <BaseButton
            variant="danger"
            icon="trash"
            @click="handleDeletePost"
          >
            Удалить
          </BaseButton>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="postsStore.isLoading" class="text-center py-12">
        <div class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Загрузка поста...
        </div>
      </div>

      <!-- Error State -->
      <BaseAlert
        v-else-if="postsStore.error"
        variant="error"
        dismissible
        @dismiss="postsStore.clearError"
      >
        {{ postsStore.error }}
      </BaseAlert>

      <!-- Post Content -->
      <div v-else-if="postsStore.currentPost" class="space-y-6">
        <BaseCard>
          <!-- Post Header -->
          <div class="mb-6">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              {{ postsStore.currentPost.title }}
            </h2>
            
            <div class="flex items-center justify-between text-sm text-gray-500">
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                  </svg>
                  <span>{{ postsStore.currentPost.user?.email }}</span>
                </div>
                
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                  </svg>
                  <span>{{ formatDate(postsStore.currentPost.createdAt) }}</span>
                </div>
              </div>
              
              <div v-if="postsStore.currentPost.updatedAt !== postsStore.currentPost.createdAt" class="text-xs text-gray-400">
                Обновлено: {{ formatDate(postsStore.currentPost.updatedAt) }}
              </div>
            </div>
          </div>

          <!-- Post Image -->
          <div v-if="postsStore.currentPost.image" class="mb-6">
            <img
              :src="getImageUrl(postsStore.currentPost.image)"
              :alt="postsStore.currentPost.title"
              class="w-full max-h-96 object-cover rounded-lg"
            />
          </div>

          <!-- Post Content -->
          <div class="prose max-w-none">
            <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {{ postsStore.currentPost.content }}
            </p>
          </div>
        </BaseCard>
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Пост не найден</h3>
        <p class="mt-1 text-sm text-gray-500">
          Запрашиваемый пост не существует или был удален.
        </p>
        <div class="mt-6">
          <BaseButton
            to="/posts"
            variant="primary"
          >
            Вернуться к постам
          </BaseButton>
        </div>
      </div>
    </div>
    
    <!-- Здесь будет рендериться дочерний маршрут, например, страница редактирования -->
    <NuxtPage v-else />
  </div>
</template>

<script setup lang="ts">
import { usePostsStore } from '~/stores/posts'
import { useAuthStore } from '~/stores/auth'
import BaseButton from "~/components/UI/BaseButton.vue";
import BaseAlert from "~/components/UI/BaseAlert.vue";
import BaseCard from "~/components/UI/BaseCard.vue";

const postsStore = usePostsStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig();
const API_BASE_URL = config.public.apiBase;

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  const baseUrl = API_BASE_URL.replace('/api', '');
  return `${baseUrl}/${imagePath}`;
};

const isEditPage = computed(() => route.path.endsWith('/edit'))

// Проверка возможности редактирования поста
const canEditPost = computed(() => {
  if (!postsStore.currentPost || !authStore.isAuthenticated) return false
  return postsStore.currentPost.userId === authStore.user?.id || authStore.isAdmin
})

// Форматирование даты
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Удаление поста
const handleDeletePost = async () => {
  if (confirm('Вы уверены, что хотите удалить этот пост?')) {
    if(!postsStore.currentPost) return;
    try {
      await postsStore.deletePost(postsStore.currentPost.id)
      await router.push('/posts')
    }
    catch {
      alert('Ошибка удаления поста')
    }
  }
}

// Загружаем пост при монтировании
onMounted(async () => {
  const postId = parseInt(route.params.id as string)
  if (isNaN(postId)) {
    await router.push('/posts')
    return
  }
  
  await postsStore.fetchPost(postId)
})
</script> 