<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center space-x-4">
      <BaseButton to="/posts" variant="ghost" icon="arrow-left">
        Назад
      </BaseButton>
      <h1 class="text-3xl font-bold text-gray-900">Создать пост</h1>
    </div>

    <BaseCard>
      <Form
        @submit="onSubmit"
        :validation-schema="validationSchema"
        v-slot="{ isSubmitting, meta }"
        class="space-y-6"
      >
        <Field
          name="title"
          v-slot="{ value, errorMessage, handleChange, handleBlur }"
        >
          <BaseInput
            name="title"
            label="Заголовок"
            placeholder="Введите заголовок поста"
            :model-value="value"
            @update:model-value="handleChange"
            @blur="handleBlur"
            :error="errorMessage"
          />
        </Field>

        <Field
          name="content"
          v-slot="{ value, errorMessage, handleChange, handleBlur }"
        >
          <BaseTextarea
            name="content"
            label="Содержание"
            placeholder="Введите содержание поста"
            :rows="8"
            :model-value="value"
            @update:model-value="handleChange"
            @blur="handleBlur"
            :error="errorMessage"
          />
        </Field>

        <Field name="image" v-slot="{ errorMessage, handleChange }">
          <label
            for="image-upload"
            class="block text-sm font-medium text-gray-700"
            >Изображение</label
          >
          <input
            id="image-upload"
            type="file"
            @change="event => handleChange((event.target as HTMLInputElement).files?.[0])"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p v-if="errorMessage" class="mt-1 text-sm text-red-600">
            {{ errorMessage }}
          </p>
        </Field>

        <div class="flex justify-end space-x-4">
          <BaseButton
            type="button"
            variant="ghost"
            @click="$router.push('/posts')"
          >
            Отмена
          </BaseButton>

          <BaseButton
            type="submit"
            variant="primary"
            :loading="isSubmitting"
            :disabled="!meta.valid || isSubmitting"
          >
            Создать пост
          </BaseButton>
        </div>

        <BaseAlert v-if="error" variant="error" class="mt-4" dismissible @dismiss="error = ''">
          {{ error }}
        </BaseAlert>
        <BaseAlert v-if="success" variant="success" class="mt-4" dismissible @dismiss="success = ''">
          {{ success }}
        </BaseAlert>
      </Form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { Form, Field } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { usePostsStore } from "~/stores/posts";
import { useAuthStore } from "~/stores/auth";
import BaseButton from "~/components/UI/BaseButton.vue";
import BaseCard from "~/components/UI/BaseCard.vue";
import BaseInput from "~/components/UI/BaseInput.vue";
import BaseTextarea from "~/components/UI/BaseTextarea.vue";
import BaseAlert from "~/components/UI/BaseAlert.vue";

const postsStore = usePostsStore();
const authStore = useAuthStore();

// Схема валидации
const validationSchema = toTypedSchema(
  z.object({
    title: z
      .string()
      .nonempty("Заголовок обязателен")
      .max(200, "Заголовок не должен превышать 200 символов"),
    content: z
      .string()
      .nonempty("Содержание обязательно")
      .max(5000, "Содержание не должен превышать 5000 символов"),
    image: z
      .any()
      .refine((file) => file, "Изображение обязательно.")
      .refine((file) => file?.size <= 5000000, `Максимальный размер 5MB.`)
      .refine(
        (file) =>
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file?.type
          ),
        "Поддерживаются только .jpg, .jpeg, .png и .webp форматы."
      )
      .optional(),
  })
);

const error = ref("");
const success = ref("");

// Обработчик отправки формы
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = async (values: Record<string, any>, { resetForm }: { resetForm: () => void }) => {
  error.value = "";
  success.value = "";
  try {
    if (!authStore.user?.id) {
      error.value =
        "Ошибка: не удалось определить пользователя. Пожалуйста, войдите в систему заново.";
      return;
    }
    const newPost = await postsStore.createPost({
      title: values.title,
      content: values.content,
      image: values.image || undefined,
      userId: authStore.user.id,
    });

    if (newPost) {
      success.value = "Пост успешно создан!";
      resetForm();
      // Обновляем список постов в фоне
      await postsStore.fetchPosts();
    } else {
      error.value = "Не удалось создать пост. Ответ от сервера пуст.";
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Произошла непредвиденная ошибка";
    error.value = errorMessage;
  }
};
</script>
