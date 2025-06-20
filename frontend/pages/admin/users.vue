<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Управление пользователями</h1>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Загрузка пользователей...
      </div>
    </div>

    <!-- Error State -->
    <BaseAlert
      v-else-if="error"
      variant="error"
      dismissible
      @dismiss="error = ''"
    >
      {{ error }}
    </BaseAlert>

    <!-- Users Table -->
    <div v-else class="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Роли
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата регистрации
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="role in user.roles"
                    :key="role.id"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ role.value }}
                  </span>
                  <span v-if="!user.roles?.length" class="text-gray-400">
                    Нет ролей
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="user.banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ user.banned ? 'Заблокирован' : 'Активен' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <BaseButton
                    variant="ghost"
                    size="sm"
                    icon="user-plus"
                    @click="openRoleModal(user)"
                  >
                    Роли
                  </BaseButton>
                  
                  <BaseButton
                    v-if="!user.banned"
                    variant="warning"
                    size="sm"
                    icon="exclamation-triangle"
                    @click="banUser(user.id)"
                  >
                    Заблокировать
                  </BaseButton>
                  
                  <BaseButton
                    v-else
                    variant="success"
                    size="sm"
                    icon="shield-check"
                    @click="unbanUser(user.id)"
                  >
                    Разблокировать
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Role Assignment Modal -->
    <div v-if="showRoleModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Управление ролями пользователя
          </h3>
          <p class="text-sm text-gray-600 mb-4">
            {{ selectedUser?.email }}
          </p>
          
          <div class="space-y-3">
            <div v-for="role in availableRoles" :key="role.id" class="flex items-center">
              <input
                :id="`role-${role.id}`"
                type="checkbox"
                :checked="selectedUser?.roles?.some(r => r.id === role.id)"
                @change="toggleRole(role.id)"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label :for="`role-${role.id}`" class="ml-2 text-sm text-gray-700">
                {{ role.value }}
              </label>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <BaseButton
              type="button"
              variant="ghost"
              @click="closeRoleModal"
            >
              Отмена
            </BaseButton>
            
            <BaseButton
              type="button"
              variant="primary"
              :loading="updatingRoles"
              :disabled="updatingRoles"
              @click="saveRoles"
            >
              Сохранить
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Ban Reason Modal -->
    <div v-if="showBanModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Блокировка пользователя
          </h3>
          
          <BaseTextarea
            v-model="banReason"
            label="Причина блокировки"
            placeholder="Введите причину блокировки"
            :rows="3"
            required
          />
          
          <div class="flex justify-end space-x-3 pt-4">
            <BaseButton
              type="button"
              variant="ghost"
              @click="closeBanModal"
            >
              Отмена
            </BaseButton>
            
            <BaseButton
              type="button"
              variant="danger"
              :loading="banning"
              :disabled="banning"
              @click="confirmBan"
            >
              Заблокировать
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/UI/BaseButton.vue'
import BaseTextarea from '~/components/UI/BaseTextarea.vue'
import BaseAlert from '~/components/UI/BaseAlert.vue'

interface User {
  id: number
  email: string
  banned: boolean
  banReason?: string
  roles: Array<{ id: number; value: string }>
  createdAt: string
}

interface Role {
  id: number
  value: string
  description: string
}

const api = useApi()

// State
const users = ref<User[]>([])
const availableRoles = ref<Role[]>([])
const loading = ref(false)
const error = ref('')
const updatingRoles = ref(false)
const banning = ref(false)

// Modal states
const showRoleModal = ref(false)
const showBanModal = ref(false)
const selectedUser = ref<User | null>(null)
const selectedUserIdForBan = ref<number | null>(null)
const banReason = ref('')

// Fetch users
const fetchUsers = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await api.getUsers()
    users.value = response
  } catch (err) {
    const errorMessage = (err as { data?: { message?: string } })?.data?.message || 'Ошибка загрузки пользователей'
    error.value = errorMessage
  } finally {
    loading.value = false
  }
}

// Fetch roles
const fetchRoles = async () => {
  try {
    const response = await api.getRoles()
    availableRoles.value = response
  } catch (err) {
    console.error('Ошибка загрузки ролей:', err)
  }
}

// Show role modal
const openRoleModal = (user: User) => {
  selectedUser.value = user
  showRoleModal.value = true
}

// Close role modal
const closeRoleModal = () => {
  showRoleModal.value = false
  selectedUser.value = null
}

// Toggle role
const toggleRole = (roleId: number) => {
  if (!selectedUser.value) return
  
  const hasRole = selectedUser.value.roles.some(r => r.id === roleId)
  
  if (hasRole) {
    selectedUser.value.roles = selectedUser.value.roles.filter(r => r.id !== roleId)
  } else {
    const role = availableRoles.value.find(r => r.id === roleId)
    if (role) {
      selectedUser.value.roles.push({ id: role.id, value: role.value })
    }
  }
}

// Save roles
const saveRoles = async () => {
  if (!selectedUser.value) return
  
  updatingRoles.value = true
  
  try {
    // Add each role individually (API expects single role addition)
    for (const role of selectedUser.value.roles) {
      await api.addRole({
        userId: selectedUser.value.id,
        value: role.value
      })
    }
    
    // Update user in the list
    const index = users.value.findIndex(u => u.id === selectedUser.value!.id)
    if (index !== -1) {
      users.value[index] = { ...selectedUser.value }
    }
    
    closeRoleModal()
  } catch (err) {
    const errorMessage = (err as { data?: { message?: string } })?.data?.message || 'Ошибка обновления ролей'
    error.value = errorMessage
  } finally {
    updatingRoles.value = false
  }
}

// Ban user
const banUser = (userId: number) => {
  selectedUserIdForBan.value = userId
  showBanModal.value = true
}

// Close ban modal
const closeBanModal = () => {
  showBanModal.value = false
  selectedUserIdForBan.value = null
  banReason.value = ''
}

// Confirm ban
const confirmBan = async () => {
  if (!selectedUserIdForBan.value || !banReason.value.trim()) return
  
  banning.value = true
  
  try {
    await api.banUser({
      userId: selectedUserIdForBan.value,
      banReason: banReason.value
    })
    
    // Update user in the list
    const user = users.value.find(u => u.id === selectedUserIdForBan.value)
    if (user) {
      user.banned = true
      user.banReason = banReason.value
    }
    
    closeBanModal()
  } catch (err) {
    const errorMessage = (err as { data?: { message?: string } })?.data?.message || 'Ошибка блокировки пользователя'
    error.value = errorMessage
  } finally {
    banning.value = false
  }
}

// Unban user
const unbanUser = async (userId: number) => {
  if (!confirm('Вы уверены, что хотите разблокировать этого пользователя?')) return
  
  try {
    // Note: Unban endpoint might not exist in the current API
    // You may need to implement this in the backend
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.banned = false
      user.banReason = undefined
    }
  } catch (err) {
    const errorMessage = (err as { data?: { message?: string } })?.data?.message || 'Ошибка разблокировки пользователя'
    error.value = errorMessage
  }
}

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Load data on mount
onMounted(async () => {
  await Promise.all([fetchUsers(), fetchRoles()])
})
</script> 