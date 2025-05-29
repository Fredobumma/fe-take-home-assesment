<script setup lang="ts">
defineProps<{
  level: number;
  size?: 'small' | 'medium' | 'large';
}>();
</script>

<template>
  <div
    class="flex items-center gap-2"
    :class="{
      'scale-75': size === 'small',
      'scale-100': size === 'medium' || !size,
      'scale-125': size === 'large'
    }"
  >
    <div class="relative h-4 w-[30px] border-2 border-gray-500 rounded">
      <div
        class="absolute inset-y-0 left-0 m-[1px] rounded transition-all duration-300 ease-in-out"
        :class="{
          'bg-red-500': level < 0.2,
          'bg-amber-500': level >= 0.2 && level < 0.5,
          'bg-emerald-500': level >= 0.5
        }"
        :style="{ width: `${level * 100}%` }"
      ></div>
      <div
        class="absolute -right-1 top-1/2 -translate-y-1/2 h-2 w-[3px] bg-gray-500 rounded-r"
      ></div>
    </div>
    <span class="text-sm font-medium">{{ Math.round(level * 100) }}%</span>
  </div>
</template>
