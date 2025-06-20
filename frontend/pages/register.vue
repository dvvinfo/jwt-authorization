<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Создать аккаунт
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Или
        <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
          войти в существующий аккаунт
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <BaseCard class="px-4 py-8 sm:px-10">
        <form @submit="onSubmit" class="space-y-6">
          <BaseAlert
            v-if="authStore.error"
            variant="error"
            dismissible
            @dismiss="authStore.clearError"
          >
            {{ authStore.error }}
          </BaseAlert>

          <BaseInput
            label="Email"
            name="email"
            type="email"
            placeholder="Введите ваш email"
            v-model="email"
            :error="emailError"
            @blur="emailBlur"
          />

          <BaseInput
            label="Пароль"
            name="password"
            type="password"
            placeholder="Введите пароль (минимум 6 символов)"
            v-model="password"
            :error="passwordError"
            @blur="passwordBlur"
          />

          <BaseInput
            label="Подтвердите пароль"
            name="confirmPassword"
            type="password"
            placeholder="Повторите пароль"
            v-model="confirmPassword"
            :error="confirmPasswordError"
            @blur="confirmPasswordBlur"
          />

          <div>
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              block
              :loading="isSubmitting"
              :disabled="!meta.valid || isSubmitting"
            >
              Зарегистрироваться
            </BaseButton>
          </div>
        </form>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import type { RegisterRequest } from '~/types/api'
import BaseInput from '~/components/UI/BaseInput.vue'
import BaseCard from '~/components/UI/BaseCard.vue'
import BaseAlert from '~/components/UI/BaseAlert.vue'
import BaseButton from '~/components/UI/BaseButton.vue'

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const authStore = useAuthStore()

// Схема валидации
const validationSchema = toTypedSchema(
  z.object({
    email: z.string().nonempty('Email не может быть пустым').email('Введите корректный email'),
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })
)

// Настройка формы
const { handleSubmit, isSubmitting, meta } = useForm({
  validationSchema,
  initialValues: {
    email: '',
    password: '',
    confirmPassword: ''
  }
})

const { value: email, errorMessage: emailError, handleBlur: emailBlur } = useField<string>('email');
const { value: password, errorMessage: passwordError, handleBlur: passwordBlur } = useField<string>('password');
const { value: confirmPassword, errorMessage: confirmPasswordError, handleBlur: confirmPasswordBlur } = useField<string>('confirmPassword');


// Обработчик отправки формы
const onSubmit = handleSubmit(async (values) => {
  try {
    const credentials: RegisterRequest = {
      email: values.email,
      password: values.password
    }
    await authStore.register(credentials)
  } catch (error) {
    // Ошибка уже обработана в store
    console.error('Registration error:', error)
  }
})
</script> 