import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User, 
  Role, 
  Post, 
  CreatePostRequest, 
  UpdatePostRequest,
  AddRoleRequest,
  BanUserRequest,
  ApiResponse
} from '~/types/api'

// Функция для получения токена из localStorage
const getAuthToken = (): string | null => {
  if (import.meta.client) {
    return localStorage.getItem('auth_token')
  }
  return null
}

// Функция для установки токена в localStorage
const setAuthToken = (token: string): void => {
  if (import.meta.client) {
    localStorage.setItem('auth_token', token)
  }
}

// Функция для удаления токена из localStorage
const removeAuthToken = (): void => {
  if (import.meta.client) {
    localStorage.removeItem('auth_token')
  }
}

export const useApi = () => {
  // Получаем базовый URL API из переменных окружения
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBase || 'http://localhost:3000/api'

  // Создаем экземпляр $fetch с базовой конфигурацией
  const apiFetch = $fetch.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Создаем экземпляр $fetch с авторизацией
  const authFetch = $fetch.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    onRequest({ options }) {
      const token = getAuthToken()
      if (token) {
        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${token}`)
        options.headers = headers
      }
    },
    onResponseError({ response }) {
      // Если токен истек или недействителен, удаляем его
      if (response.status === 401) {
        removeAuthToken()
        navigateTo('/login')
      }
    }
  })

  // Аутентификация
  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: credentials
    })
    setAuthToken(response.token)
    return response
  }

  const register = async (credentials: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiFetch<AuthResponse>('/auth/registration', {
      method: 'POST',
      body: credentials
    })
    setAuthToken(response.token)
    return response
  }

  const logout = (): void => {
    removeAuthToken()
  }

  // Пользователи (только для админов)
  const getUsers = async (): Promise<User[]> => {
    return await authFetch<User[]>('/users')
  }

  const getUser = async (id: number): Promise<User> => {
    return await authFetch<User>(`/users/${id}`)
  }

  const addRole = async (data: AddRoleRequest): Promise<ApiResponse<unknown>> => {
    return await authFetch<ApiResponse<unknown>>('/users/role', {
      method: 'POST',
      body: data
    })
  }

  const banUser = async (data: BanUserRequest): Promise<ApiResponse<unknown>> => {
    return await authFetch<ApiResponse<unknown>>('/users/ban', {
      method: 'POST',
      body: data
    })
  }

  const deleteUser = async (id: number): Promise<User> => {
    return await authFetch<User>(`/users/${id}`, {
      method: 'DELETE'
    })
  }

  // Роли (только для админов)
  const getRoles = async (): Promise<Role[]> => {
    return await authFetch<Role[]>('/roles')
  }

  const getRole = async (value: string): Promise<Role> => {
    return await authFetch<Role>(`/roles/${value}`)
  }

  const createRole = async (role: { value: string; description: string }): Promise<Role> => {
    return await authFetch<Role>('/roles', {
      method: 'POST',
      body: role
    })
  }

  // Посты
  const getPosts = async (): Promise<Post[]> => {
    return await apiFetch<Post[]>('/posts')
  }

  const getPost = async (id: number): Promise<Post> => {
    console.log('API: Getting post with ID:', id)
    console.log('API: Base URL:', API_BASE_URL)
    try {
      const response = await apiFetch<Post>(`/posts/${id}`)
      console.log('API: Post response:', response)
      return response
    } catch (error) {
      console.error('API: Error getting post:', error)
      throw error
    }
  }

  const createPost = async (post: CreatePostRequest): Promise<Post> => {
    const formData = new FormData()
    
    Object.entries(post).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append(key, value)
        } else if (typeof value !== 'object' || Array.isArray(value)) {
           formData.append(key, String(value));
        }
      }
    });

    const headers = new Headers();
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return await $fetch<Post>(`${API_BASE_URL}/posts`, {
      method: 'POST',
      body: formData,
      headers,
    });
  }

  const updatePost = async (id: number, post: UpdatePostRequest & { image?: File | null, removeImage?: boolean }): Promise<Post> => {
    const formData = new FormData()
    
    formData.append('title', post.title || '')
    formData.append('content', post.content || '')
    
    if (post.image) {
      formData.append('image', post.image)
    } else if (post.removeImage) {
      formData.append('removeImage', 'true')
    }

    const headers = new Headers();
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    // Не устанавливаем Content-Type, браузер сделает это сам для FormData
    
    return await $fetch<Post>(`${API_BASE_URL}/posts/${id}`, {
      method: 'PATCH',
      body: formData,
      headers,
    });
  }

  const deletePost = async (id: number): Promise<Post> => {
    return await authFetch<Post>(`/posts/${id}`, {
      method: 'DELETE'
    })
  }

  // Утилиты
  const isAuthenticated = (): boolean => {
    return !!getAuthToken()
  }

  const getCurrentUser = (): User | null => {
    if (import.meta.client) {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }

  const setCurrentUser = (user: User): void => {
    if (import.meta.client) {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }

  const removeCurrentUser = (): void => {
    if (import.meta.client) {
      localStorage.removeItem('user')
    }
  }

  return {
    // Аутентификация
    login,
    register,
    logout,
    isAuthenticated,
    getCurrentUser,
    setCurrentUser,
    removeCurrentUser,
    
    // Пользователи
    getUsers,
    getUser,
    addRole,
    banUser,
    deleteUser,
    
    // Роли
    getRoles,
    getRole,
    createRole,
    
    // Посты
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    
    // Утилиты
    getAuthToken,
    setAuthToken,
    removeAuthToken
  }
} 