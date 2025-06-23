<template>
  <div>
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="mt-1">
      <input
        :id="inputId"
        :name="name || inputId"
        :type="type"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        :class="inputClasses"
        v-bind="$attrs"
      />
    </div>
    <p v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number | undefined
  label?: string
  name?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'url'
  error?: string
  hint?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false
})

const emit = defineEmits(['update:modelValue'])

// Генерируем уникальный ID если не передан name
const inputId = computed(() => {
  return props.name || `input-${Math.random().toString(36).substr(2, 9)}`
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const inputClasses = computed(() => {
  const base = 'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm'
  
  if (props.error) {
    return `${base} border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500`
  }
  
  return `${base} border-gray-300 focus:ring-blue-500 focus:border-blue-500`
})
</script> 