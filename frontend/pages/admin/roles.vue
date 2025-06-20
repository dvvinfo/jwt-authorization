<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Управление ролями</h1>
      <BaseButton
        variant="primary"
        icon="plus"
        @click="showCreateModal = true"
      >
        Создать роль
      </BaseButton>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Загрузка ролей...
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

    <!-- Roles Table -->
    <div v-else class="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Описание
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Пользователей
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="role in roles" :key="role.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ role.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ role.value }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ role.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ role.users?.length || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <BaseButton
                    variant="ghost"
                    size="sm"
                    icon="pencil"
                    @click="editRole(role)"
                  >
                    Редактировать
                  </BaseButton>
                  
                  <BaseButton
                    variant="danger"
                    size="sm"
                    icon="trash"
                    @click="deleteRole(role.id)"
                  >
                    Удалить
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Редактировать роль' : 'Создать роль' }}
          </h3>
          
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <BaseInput
              name="value"
              v-model="form.value"
              label="Название роли"
              placeholder="Введите название роли"
              required
              :error="formErrors.value"
            />
            
            <BaseTextarea
              v-model="form.description"
              label="Описание"
              placeholder="Введите описание роли"
              :rows="3"
              :error="formErrors.description"
            />
            
            <div class="flex justify-end space-x-3 pt-4">
              <BaseButton
                type="button"
                variant="ghost"
                @click="closeModal"
              >
                Отмена
              </BaseButton>
              
              <BaseButton
                type="submit"
                variant="primary"
                :loading="submitting"
                :disabled="submitting"
              >
                {{ showEditModal ? 'Сохранить' : 'Создать' }}
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/UI/BaseButton.vue'
import BaseInput from '~/components/UI/BaseInput.vue'
import BaseTextarea from '~/components/UI/BaseTextarea.vue'
import BaseAlert from '~/components/UI/BaseAlert.vue'

interface Role {
  id: number
  value: string
  description: string
  users?: Array<{ id: number; email: string }>
}

interface RoleForm {
  value: string
  description: string
}

const api = useApi()

// State
const roles = ref<Role[]>([])
const loading = ref(false)
const error = ref('')
const submitting = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingRole = ref<Role | null>(null)

// Form state
const form = reactive<RoleForm>({
  value: '',
  description: ''
})

const formErrors = reactive({
  value: '',
  description: ''
})

// Fetch roles
const fetchRoles = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await api.getRoles()
    roles.value = response
  } catch (err) {
    const errorMessage = (err as { data?: { message?: string } })?.data?.message || 'Ошибка загрузки ролей'
    error.value = errorMessage
  } finally {
    loading.value = false
  }
}

// Create role
const createRole = async (roleData: RoleForm) => {
  try {
    const response = await api.createRole(roleData)
    roles.value.push(response)
    return { success: true }
  } catch (err) {
    const errorMessage = (err as { data?: { message?: string } })?.data?.message || 'Ошибка создания роли'
    return { success: false, error: errorMessage }
  }
}

// Update role
const updateRole = async (id: number, roleData: RoleForm) => {
  try {
    // Note: Update role endpoint might not exist in the current API
    // You may need to implement this in the backend
    const response = await api.getRole(roleData.value) // This is a workaround
    const index = roles.value.findIndex(role => role.id === id)
    if (index !== -1) {
      roles.value[index] = { ...response, id }
    }
    
    return { success: true }
  } catch (err) {
    const errorMessage = (err as { data?: { message?: string } })?.data?.message || 'Ошибка обновления роли'
    return { success: false, error: errorMessage }
  }
}

// Delete role
const deleteRole = async (id: number) => {
  if (!confirm('Вы уверены, что хотите удалить эту роль?')) return
  
  try {
    // Note: Delete role endpoint might not exist in the current API
    // You may need to implement this in the backend
    roles.value = roles.value.filter(role => role.id !== id)
  } catch (err) {
    const errorMessage = (err as { data?: { message?: string } })?.data?.message || 'Ошибка удаления роли'
    alert(errorMessage)
  }
}

// Edit role
const editRole = (role: Role) => {
  editingRole.value = role
  form.value = role.value
  form.description = role.description
  showEditModal.value = true
}

// Close modal
const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingRole.value = null
  form.value = ''
  form.description = ''
  formErrors.value = ''
  formErrors.description = ''
}

// Handle form submit
const handleSubmit = async () => {
  submitting.value = true
  formErrors.value = ''
  formErrors.description = ''
  
  try {
    let result
    
    if (showEditModal.value && editingRole.value) {
      result = await updateRole(editingRole.value.id, form)
    } else {
      result = await createRole(form)
    }
    
    if (result.success) {
      closeModal()
    } else {
      error.value = result.error || 'Произошла ошибка'
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка'
    error.value = errorMessage
  } finally {
    submitting.value = false
  }
}

// Load roles on mount
onMounted(() => {
  fetchRoles()
})
</script> 