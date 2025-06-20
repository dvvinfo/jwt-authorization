<template>
  <div
    class="relative inline-flex items-center justify-center rounded-full"
    :class="sizeClasses"
    :style="{ backgroundColor: color }"
  >
    <span class="font-medium text-white" :class="fontClasses">
      {{ initials }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  email?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const initials = computed(() => {
  if (props.name) {
    return props.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
  if (props.email) {
    return props.email.charAt(0).toUpperCase();
  }
  return '?';
});

// A simple hash function to get a color based on a string
const color = computed(() => {
  const colors = [
    '#f56565', '#ed8936', '#ecc94b', '#48bb78', '#38b2ac', '#4299e1', '#667eea', '#9f7aea', '#ed64a6'
  ];
  const str = props.name || props.email || '';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-8 h-8';
    case 'lg':
      return 'w-12 h-12';
    default:
      return 'w-10 h-10';
  }
});

const fontClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-xs';
    case 'lg':
      return 'text-xl';
    default:
      return 'text-base';
  }
});
</script> 