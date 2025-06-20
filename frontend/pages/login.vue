<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Войти в аккаунт
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Или
        <NuxtLink
          to="/register"
          class="font-medium text-blue-600 hover:text-blue-500"
        >
          зарегистрироваться
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <BaseCard class="px-4 py-8 sm:px-10">
        <Form
          @submit="onSubmit"
          :validation-schema="validationSchema"
          v-slot="{ isSubmitting, meta }"
          class="space-y-6"
        >
          <BaseAlert
            v-if="authStore.error"
            variant="error"
            dismissible
            @dismiss="authStore.clearError"
          >
            {{ authStore.error }}
          </BaseAlert>

          <Field
            name="email"
            v-slot="{ value, errorMessage, handleBlur, handleChange }"
          >
            <BaseInput
              label="Email"
              name="email"
              type="email"
              placeholder="Введите ваш email"
              :model-value="value"
              @update:model-value="handleChange"
              @blur="handleBlur"
              :error="errorMessage"
            />
          </Field>

          <Field
            name="password"
            v-slot="{ value, errorMessage, handleBlur, handleChange }"
          >
            <BaseInput
              label="Пароль"
              name="password"
              type="password"
              placeholder="Введите ваш пароль"
              :model-value="value"
              @update:model-value="handleChange"
              @blur="handleBlur"
              :error="errorMessage"
            />
          </Field>

          <div>
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              block
              :loading="isSubmitting"
              :disabled="!meta.valid || isSubmitting"
            >
              Войти
            </BaseButton>
          </div>
        </Form>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Form, Field } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useAuthStore } from "~/stores/auth";
import BaseInput from "~/components/UI/BaseInput.vue";
import BaseCard from "~/components/UI/BaseCard.vue";
import BaseAlert from "~/components/UI/BaseAlert.vue";
import BaseButton from "~/components/UI/BaseButton.vue";

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

const authStore = useAuthStore();

const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email не может быть пустым")
    .email("Введите корректный email"),
  password: z.string().min(1, "Пароль не может быть пустым"),
});

const validationSchema = toTypedSchema(loginSchema);

// Обработчик отправки формы
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = async (values: any) => {
  try {
    await authStore.login({
      email: values.email,
      password: values.password,
    });
  } catch (error) {
    // Ошибка уже обработана в store
    console.error("Login error:", error);
  }
};
</script>
