<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center space-x-4">
      <BaseButton
        :to="`/posts/${$route.params.id}`"
        variant="ghost"
        icon="arrow-left"
      >
        Назад
      </BaseButton>
      <h1 class="text-3xl font-bold text-gray-900">Редактировать пост</h1>
    </div>

    <!-- Loading State -->
    <div v-if="postsStore.loading" class="text-center py-12">
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

    <!-- Edit Form -->
    <div v-else-if="postsStore.currentPost" class="space-y-6">
      <BaseCard>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <BaseInput
            v-model="state.title"
            label="Заголовок"
            placeholder="Введите заголовок поста"
            required
            :error="errors.title"
          />

          <BaseTextarea
            v-model="state.content"
            label="Содержание"
            placeholder="Введите содержание поста"
            :rows="8"
            required
            :error="errors.content"
          />

          <BaseInput
            v-model="state.image"
            label="URL изображения"
            type="url"
            placeholder="https://example.com/image.jpg"
            :error="errors.image"
            hint="Необязательно. Введите URL изображения для поста"
          />

          <div class="flex justify-end space-x-4">
            <BaseButton
              type="button"
              variant="ghost"
              @click="$router.push(`/posts/${$route.params.id}`)"
            >
              Отмена
            </BaseButton>
            
            <BaseButton
              type="submit"
              variant="primary"
              :loading="loading"
              :disabled="loading"
            >
              Сохранить изменения
            </BaseButton>
          </div>
        </form>

        <BaseAlert
          v-if="error"
          variant="error"
          class="mt-4"
        >
          {{ error }}
        </BaseAlert>
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
</template>

<script setup>
import { usePostsStore } from '~/stores/posts'
import { useAuthStore } from '~/stores/auth'
import { z } from 'zod'

const postsStore = usePostsStore()
const authStore = useAuthStore()
const router = useRouter()

// Состояние формы
const state = reactive({
  title: '',
  content: '',
  image: ''
})

// Схема валидации
const schema = z.object({
  title: z.string().min(1, 'Заголовок обязателен').max(200, 'Заголовок не должен превышать 200 символов'),
  content: z.string().min(1, 'Содержание обязательно').max(5000, 'Содержание не должно превышать 5000 символов'),
  image: z.string().url('Введите корректный URL').optional().or(z.literal(''))
})

// Состояние загрузки и ошибок
const loading = ref(false)
const error = ref('')
const errors = reactive({
  title: '',
  content: '',
  image: ''
})

// Обработчик отправки формы
const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  errors.title = ''
  errors.content = ''
  errors.image = ''

  try {
    // Валидация
    const validatedData = schema.parse(state)
    
    const postId = parseInt($route.params.id)
    const result = await postsStore.updatePost(postId, {
      title: validatedData.title,
      content: validatedData.content,
      image: validatedData.image || ''
    })
    
    if (result.success) {
      await router.push(`/posts/${postId}`)
    } else {
      error.value = result.error || 'Ошибка обновления поста'
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Обработка ошибок валидации
      err.errors.forEach((validationError) => {
        const field = validationError.path[0]
        if (typeof field === 'string') {
          if (field === 'title') {
            errors.title = validationError.message
          } else if (field === 'content') {
            errors.content = validationError.message
          } else if (field === 'image') {
            errors.image = validationError.message
          }
        }
      })
    } else {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка'
      error.value = errorMessage
    }
  } finally {
    loading.value = false
  }
}

// Загружаем пост и заполняем форму
onMounted(async () => {
  const postId = parseInt($route.params.id)
  if (isNaN(postId)) {
    await router.push('/posts')
    return
  }
  
  await postsStore.fetchPost(postId)
  
  // Проверяем права доступа
  if (postsStore.currentPost) {
    const canEdit = postsStore.currentPost.userId === authStore.user?.id || authStore.isAdmin
    if (!canEdit) {
      await router.push(`/posts/${postId}`)
      return
    }
    
    // Заполняем форму данными поста
    state.title = postsStore.currentPost.title
    state.content = postsStore.currentPost.content
    state.image = postsStore.currentPost.image || ''
  }
})
</script> 