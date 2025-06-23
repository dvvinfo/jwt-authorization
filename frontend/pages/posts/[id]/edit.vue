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
      <h1 v-if="postsStore.currentPost" class="text-3xl font-bold text-gray-900">
        Редактировать пост:
        <span class="text-gray-600 truncate">{{ postsStore.currentPost.title }}</span>
      </h1>
      <h1 v-else class="text-3xl font-bold text-gray-900">Редактировать пост</h1>
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

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Изображение
            </label>
            <div class="mt-1 flex items-center space-x-4">
              <img v-if="previewImage" :src="previewImage" alt="Preview" class="h-16 w-16 rounded object-cover" />
              <div v-else class="h-16 w-16 rounded bg-gray-100 flex items-center justify-center">
                <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path></svg>
              </div>
              <input type="file" @change="handleFileChange" class="hidden" ref="fileInput" accept="image/*">
              <BaseButton type="button" @click="triggerFileInput">
                Выбрать файл
              </BaseButton>
              <BaseButton v-if="state.image || state.newImage" type="button" variant="ghost" @click="removeImage">
                Удалить изображение
              </BaseButton>
            </div>
            <p v-if="errors.image" class="mt-2 text-sm text-red-600">{{ errors.image }}</p>
          </div>

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

<script setup lang="ts">
import { usePostsStore } from '~/stores/posts'
import { useAuthStore } from '~/stores/auth'
import { z } from 'zod'
import { reactive, onMounted, ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '~/components/UI/BaseButton.vue'
import BaseCard from '~/components/UI/BaseCard.vue'
import BaseInput from '~/components/UI/BaseInput.vue'
import BaseTextarea from '~/components/UI/BaseTextarea.vue'
import BaseAlert from '~/components/UI/BaseAlert.vue'

const postsStore = usePostsStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const fileInput = ref<HTMLInputElement | null>(null);

// Состояние формы
const state = reactive<{
  title: string;
  content: string;
  image: string | null;
  newImage: File | null;
}>({
  title: '',
  content: '',
  image: null,
  newImage: null
});

// Схема валидации
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const schema = z.object({
  title: z.string().min(1, 'Заголовок обязателен').max(200, 'Заголовок не должен превышать 200 символов'),
  content: z.string().min(1, 'Содержание обязательно').max(5000, 'Содержание не должно превышать 5000 символов'),
  newImage: z
    .instanceof(File)
    .optional()
    .nullable()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Максимальный размер файла 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Поддерживаются только .jpg, .jpeg, .png и .webp форматы."
    ),
});

// Состояние загрузки и ошибок
const loading = ref(false)
const error = ref('')
const errors = reactive({
  title: '',
  content: '',
  image: ''
})

// Preview for image
const previewImage = computed(() => {
  if (state.newImage) {
    return URL.createObjectURL(state.newImage);
  }
  if (state.image) {
    // Assuming getImageUrl is available and works correctly
    const config = useRuntimeConfig();
    const API_BASE_URL = config.public.apiBase.replace('/api', '');
    return `${API_BASE_URL}/${state.image}`;
  }
  return null;
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    state.newImage = target.files[0];
    state.image = null; // Clear old image path
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const removeImage = () => {
  state.image = null;
  state.newImage = null;
  if(fileInput.value) {
    fileInput.value.value = '';
  }
};

// Обработчик отправки формы
const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  errors.title = ''
  errors.content = ''
  errors.image = ''

  try {
    // Валидация
    const validatedData = schema.parse({
      title: state.title,
      content: state.content,
      newImage: state.newImage
    })
    
    const postId = parseInt(route.params.id as string)
    const result = await postsStore.updatePost(postId, {
      title: validatedData.title,
      content: validatedData.content,
      image: state.newImage,
      removeImage: !state.newImage && !state.image
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
        if (field === 'newImage') {
          errors.image = validationError.message;
        } else if (typeof field === 'string') {
          errors[field as keyof typeof errors] = validationError.message
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

// Заполняем форму, когда пост загружен
watch(() => postsStore.currentPost, (newPost) => {
  if (newPost) {
    // Проверяем права доступа
    const canEdit = newPost.userId === authStore.user?.id || authStore.isAdmin
    if (!canEdit) {
      router.push(`/posts/${newPost.id}`)
      return
    }

    state.title = newPost.title
    state.content = newPost.content
    state.image = newPost.image || null
    state.newImage = null
  }
}, { immediate: true })

onMounted(() => {
  const postId = parseInt(route.params.id as string)
  if (!postsStore.currentPost || postsStore.currentPost.id !== postId) {
    postsStore.fetchPost(postId)
  }
})
</script> 