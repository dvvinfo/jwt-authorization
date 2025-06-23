<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row justify-between sm:items-center gap-4"
    >
      <h1 class="text-3xl font-bold text-gray-900">Посты</h1>
      <BaseButton
        v-if="authStore.isAuthenticated"
        to="/posts/create"
        variant="primary"
        icon="plus"
      >
        Создать пост
      </BaseButton>
    </div>

    <!-- Loading State -->
    <div
      v-if="postsStore.isLoading && postsStore.posts.length === 0"
      class="text-center py-12"
    >
      <div class="inline-flex items-center">
        <svg
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Загрузка постов...
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

    <!-- Empty State -->
    <div v-else-if="postsStore.posts.length === 0" class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Постов пока нет</h3>
      <p class="mt-1 text-sm text-gray-500">
        Создайте первый пост, чтобы он появился здесь.
      </p>
    </div>

    <!-- Posts Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard
        v-for="post in postsStore.sortedPosts"
        :key="post.id"
        class="flex flex-col"
      >
        <NuxtLink :to="`/posts/${post.id}`">
          <img
            v-if="post.image"
            :src="getImageUrl(post.image)"
            :alt="post.title"
            class="w-full h-48 object-cover rounded-t-lg"
          />
          <div
            v-else
            class="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center"
          >
            <svg
              class="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"
              ></path>
            </svg>
          </div>
        </NuxtLink>

        <div class="p-4 flex flex-col flex-grow">
          <h2 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            <NuxtLink :to="`/posts/${post.id}`" class="hover:text-blue-600">
              {{ post.title }}
            </NuxtLink>
          </h2>

          <p class="text-gray-600 mb-4 line-clamp-3 flex-grow">
            {{ post.content }}
          </p>

          <div
            class="flex items-center gap-2 justify-between text-sm text-gray-500 border-t border-gray-200 pt-3 mt-auto"
          >
            <div class="flex items-center gap-2">
              <BaseAvatar :email="post.user?.email" size="sm" />
              <span class="truncate">{{
                post.user?.email || "Неизвестный автор"
              }}</span>
            </div>
            <span>{{ formatDate(post.createdAt) }}</span>
          </div>
        </div>

        <div
          v-if="authStore.user?.id === post.userId || authStore.isAdmin"
          class="border-t border-gray-200 p-2 flex justify-end gap-2"
        >
          <BaseButton
            :to="`/posts/${post.id}`"
            variant="ghost"
            size="sm"
            icon="eye"
          >
            Просмотр
          </BaseButton>
          <BaseButton
            :to="`/posts/${post.id}/edit`"
            variant="ghost"
            size="sm"
            icon="pencil"
          >
            Редактировать
          </BaseButton>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePostsStore } from "~/stores/posts";
import { useAuthStore } from "~/stores/auth";
import BaseButton from "~/components/UI/BaseButton.vue";
import BaseCard from "~/components/UI/BaseCard.vue";
import BaseAlert from "~/components/UI/BaseAlert.vue";
import BaseAvatar from "~/components/UI/BaseAvatar.vue";

const postsStore = usePostsStore();
const authStore = useAuthStore();
const config = useRuntimeConfig();
const API_BASE_URL = config.public.apiBase;

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  // Проверяем, является ли путь уже полным URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  // Убираем /api из базового URL, если он там есть, т.к. статика отдается с корня
  const baseUrl = API_BASE_URL.replace('/api', '');
  return `${baseUrl}/${imagePath}`;
};

// Форматирование даты
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Загружаем посты при монтировании
onMounted(() => {
  postsStore.fetchPosts();
});
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
