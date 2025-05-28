<script setup lang="ts">
defineProps<{
  status: 'healthy' | 'unhealthy' | 'unknown';
  showLabel?: boolean;
}>();
</script>

<template>
  <div class="flex items-center gap-2">
    <span 
      class="inline-block w-3 h-3 rounded-full"
      :class="{
        'bg-emerald-500': status === 'healthy',
        'bg-red-500': status === 'unhealthy',
        'bg-gray-400': status === 'unknown'
      }"
    ></span>
    <span v-if="showLabel" class="text-sm capitalize">{{ status }}</span>
  </div>
</template>