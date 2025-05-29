<script setup lang="ts">
import type { SchoolSummary } from '@/types';
import StatusIndicator from './StatusIndicator.vue';

const props = defineProps<{
  school: SchoolSummary;
}>();

const emit = defineEmits<{
  (e: 'view-details', academyId: number): void;
}>();

function viewDetails() {
  emit('view-details', props.school.academyId);
}
</script>

<template>
  <div
    class="bg-white rounded-lg p-5 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    :class="{ 'border-t-4 border-t-red-500': school.unhealthyCount > 0 }"
  >
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold m-0">School {{ school.academyId }}</h2>
      <div
        v-if="school.unhealthyCount > 0"
        class="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium"
      >
        Priority {{ school.unhealthyCount > 2 ? 'High' : 'Medium' }}
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
      <div class="text-center">
        <div class="text-2xl font-bold mb-1">{{ school.deviceCount }}</div>
        <div class="text-xs text-gray-500">Total Devices</div>
      </div>

      <div v-if="school.unhealthyCount > 0" class="text-center">
        <div class="text-2xl font-bold text-red-500 mb-1">{{ school.unhealthyCount }}</div>
        <div class="text-xs text-gray-500">Need Replacement</div>
      </div>

      <div class="text-center">
        <div class="text-2xl font-bold text-emerald-500 mb-1">{{ school.healthyCount }}</div>
        <div class="text-xs text-gray-500">Healthy</div>
      </div>

      <div v-if="school.unknownCount > 0" class="text-center">
        <div class="text-2xl font-bold text-gray-400 mb-1">{{ school.unknownCount }}</div>
        <div class="text-xs text-gray-500">Unknown</div>
      </div>
    </div>

    <div class="border-t border-gray-200 py-4 mb-4 space-y-2">
      <div class="flex justify-between items-center">
        <StatusIndicator status="unhealthy" showLabel />
        <div class="font-medium">{{ school.unhealthyCount }}</div>
      </div>
      <div class="flex justify-between items-center">
        <StatusIndicator status="healthy" showLabel />
        <div class="font-medium">{{ school.healthyCount }}</div>
      </div>
      <div class="flex justify-between items-center">
        <StatusIndicator status="unknown" showLabel />
        <div class="font-medium">{{ school.unknownCount }}</div>
      </div>
    </div>

    <button
      @click="viewDetails"
      class="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors"
    >
      View Details
    </button>
  </div>
</template>
