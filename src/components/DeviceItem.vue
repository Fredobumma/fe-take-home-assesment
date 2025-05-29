<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import type { DeviceBatteryHealth } from '@/types';
import StatusIndicator from './StatusIndicator.vue';
import BatteryLevel from './BatteryLevel.vue';

const props = defineProps<{
  device: DeviceBatteryHealth;
}>();

const formattedDate = computed(() => {
  return format(new Date(props.device.lastUpdated), 'MMM d, yyyy HH:mm');
});

const consumptionDisplay = computed(() => {
  if (props.device.avgDailyConsumption === null) {
    return 'Unknown';
  }
  return `${(props.device.avgDailyConsumption * 100).toFixed(1)}% per day`;
});
</script>

<template>
  <div 
    class="bg-white rounded-lg p-4 shadow-sm mb-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    :class="{ 'border-l-4 border-l-red-500': device.needsReplacement }"
  >
    <div class="flex justify-between items-center gap-4 mb-4">
      <div class="flex items-center gap-2">
        <StatusIndicator :status="device.status" />
        <h3 class="text-base font-semibold m-0">{{ device.serialNumber }}</h3>
      </div>
      <BatteryLevel :level="device.lastBatteryLevel" />
    </div>
    
    <div class="grid grid-cols-2 gap-2 sm:gap-4">
      <div class="flex flex-col">
        <span class="text-xs text-gray-500 mb-0.5">Last used by:</span>
        <span>{{ device.lastEmployee }}</span>
      </div>
      <div class="flex flex-col">
        <span class="text-xs text-gray-500 mb-0.5">Battery consumption:</span>
        <span :class="{ 'text-red-500 font-medium': device.needsReplacement }">
          {{ consumptionDisplay }}
        </span>
      </div>
      <div class="flex flex-col">
        <span class="text-xs text-gray-500 mb-0.5">Measurements:</span>
        <span>{{ device.measurementCount }}</span>
      </div>
      <div class="flex flex-col">
        <span class="text-xs text-gray-500 mb-0.5">Last updated:</span>
        <span>{{ formattedDate }}</span>
      </div>
    </div>
    
    <div v-if="device.needsReplacement" class="mt-4 p-2 bg-red-50 rounded flex items-center gap-2">
      <span class="text-xl">⚠️</span>
      <span class="text-red-500 font-medium">Battery replacement needed</span>
    </div>
  </div>
</template>