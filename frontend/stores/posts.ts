import { defineStore } from 'pinia'
import type { Post, CreatePostRequest, UpdatePostRequest } from '~/types/api'

export const usePostsStore = defineStore('posts', () => {
  const api = useApi()
  
  // Состояние
  const posts = ref<Post[]>([])
  const currentPost = ref<Post | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Получение всех постов
  const fetchPosts = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.getPosts()
      posts.value = response
      return response
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string } }
      error.value = errorData.data?.message || 'Ошибка загрузки постов'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Получение поста по ID
  const fetchPost = async (id: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.getPost(id)
      currentPost.value = response
      return response
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string } }
      error.value = errorData.data?.message || 'Ошибка загрузки поста'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Создание поста
  const createPost = async (postData: CreatePostRequest) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.createPost(postData)
      posts.value.unshift(response) // Добавляем в начало списка
      return response
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string } }
      error.value = errorData.data?.message || 'Ошибка создания поста'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Обновление поста
  const updatePost = async (id: number, postData: UpdatePostRequest) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.updatePost(id, postData)
      
      // Обновляем пост в списке
      const index = posts.value.findIndex(post => post.id === id)
      if (index !== -1) {
        posts.value[index] = response
      }
      
      // Обновляем текущий пост
      if (currentPost.value?.id === id) {
        currentPost.value = response
      }
      
      return response
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string } }
      error.value = errorData.data?.message || 'Ошибка обновления поста'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Удаление поста
  const deletePost = async (id: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.deletePost(id)
      
      // Удаляем пост из списка
      posts.value = posts.value.filter(post => post.id !== id)
      
      // Очищаем текущий пост, если это был он
      if (currentPost.value?.id === id) {
        currentPost.value = null
      }
      
      return response
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string } }
      error.value = errorData.data?.message || 'Ошибка удаления поста'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Очистка ошибки
  const clearError = () => {
    error.value = null
  }

  // Очистка текущего поста
  const clearCurrentPost = () => {
    currentPost.value = null
  }

  // Сортированные посты (по дате создания, новые сначала)
  const sortedPosts = computed(() => {
    return [...posts.value].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  })

  return {
    // Состояние
    posts: readonly(posts),
    currentPost: readonly(currentPost),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Геттеры
    sortedPosts,
    
    // Действия
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    clearError,
    clearCurrentPost
  }
}) 