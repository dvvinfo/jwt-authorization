<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="px-6 py-4 border-b border-gray-200">
      <slot name="header" />
    </div>
    
    <div class="">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class=" border-t border-gray-200 bg-gray-50">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md'
})

const cardClasses = computed(() => {
  const baseClasses = 'bg-white rounded-lg border'
  
  const variantClasses = {
    default: 'border-gray-200',
    elevated: 'border-gray-200 shadow-lg'
  }
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return [
    baseClasses,
    variantClasses[props.variant],
    paddingClasses[props.padding]
  ].filter(Boolean).join(' ')
})
</script> 