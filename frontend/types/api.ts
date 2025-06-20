// Типы для аутентификации
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Типы для пользователей
export interface User {
  id: number
  email: string
  roles: Role[]
  banned: boolean
  banReason?: string
  createdAt: string
  updatedAt: string
}

// Типы для ролей
export interface Role {
  id: number
  value: string
  description: string
  createdAt: string
  updatedAt: string
}

// Типы для постов
export interface Post {
  id: number
  title: string
  content: string
  image?: string
  userId: number
  user?: User
  createdAt: string
  updatedAt: string
}

export interface CreatePostRequest {
  title: string
  content: string
  image?: string
  userId: number
}

export interface UpdatePostRequest {
  title?: string
  content?: string
}

// Типы для админки
export interface AddRoleRequest {
  userId: number
  value: string
}

export interface BanUserRequest {
  userId: number
  banReason: string
}

// Типы для файлов
export interface File {
  id: number
  essenceTable: string
  essenceId: number
  filename: string
  originalName: string
  mimeType: string
  size: number
  createdAt: string
  updatedAt: string
}

// API Response типы
export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
} 