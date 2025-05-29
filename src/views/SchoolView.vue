<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBatteryStore } from '@/store/batteryStore';
import { batteryService } from '@/services/batteryService';
import DeviceItem from '@/components/DeviceItem.vue';
// import BatteryChart from '@/components/BatteryChart.vue';
import StatusIndicator from '@/components/StatusIndicator.vue';
import type { BatteryRecord } from '@/types'; // Make sure this import exists and points to the correct type definition

const route = useRoute();
const router = useRouter();
const batteryStore = useBatteryStore();
const isLoading = ref(true);

const batteryData = ref<BatteryRecord[]>([]);
const filterStatus = ref('all');

const schoolId = computed(() => {
  return parseInt(route.params.id as string);
});

const filteredDevices = computed(() => {
  if (!batteryStore.selectedSchool) return [];
  
  if (filterStatus.value === 'all') {
    return batteryStore.selectedSchool.devices;
  }
  
  return batteryStore.selectedSchool.devices.filter(
    device => device.status === filterStatus.value
  );
});

onMounted(async () => {
  try {
    await batteryStore.selectSchool(schoolId.value);
    const data = await batteryService.fetchBatteryData();
    console.log("hereee")
    batteryData.value = data.filter(record => record.academyId === schoolId.value);
    console.log("thereee")
    isLoading.value =false
  } catch (error) {
    console.error('Error loading school view:', error);
  }
});

function goBack() {
  router.push({ name: 'dashboard' });
}

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      isLoading.value = true;
      await batteryStore.selectSchool(parseInt(newId as string));
      isLoading.value = false;
    }
  }
);
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-blue-600 text-white p-6">
        <button @click="goBack" class="bg-white text-gray-700 rounded-2xl hover:text-white mb-10 flex items-center gap-2">
          ← <span>Back to Dashboard</span>
        </button>
        
        <div v-if="batteryStore.selectedSchool">
          <h1 class="text-3xl font-bold mb-4">School {{ batteryStore.selectedSchool.academyId }}</h1>
          <div class="flex flex-wrap gap-4">
            <div class="bg-white/10 rounded-full px-4 py-1 flex items-center gap-2">
              <span>Total Devices:</span>
              <strong>{{ batteryStore.selectedSchool.deviceCount }}</strong>
            </div>
            <div class="bg-red-500/80 rounded-full px-4 py-1 flex items-center gap-2">
              <span>Need Replacement:</span>
              <strong>{{ batteryStore.selectedSchool.unhealthyCount }}</strong>
            </div>
          </div>
        </div>
    </header>
    
    <main class="max-w-7xl mx-auto px-6 py-6">
      <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[200px]">
        <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600">Loading school details...</p>
      </div>
      
      <div v-else-if="!batteryStore.selectedSchool" class="flex flex-col items-center justify-center min-h-[200px]">
        <p class="text-gray-600 mb-4">School not found or failed to load data.</p>
        <button @click="goBack" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Return to Dashboard
        </button>
      </div>
      
      <div v-else>
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 class="text-xl font-semibold">Device Battery Health</h2>
          
          <div class="flex items-center gap-4">
            <span class="text-gray-600">Filter:</span>
            <div class="flex flex-wrap gap-2">
              <button 
                @click="filterStatus = 'all'" 
                class="px-3 py-1.5 rounded-lg text-sm"
                :class="filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:text-white hover:bg-blue-400'"
              >
                All
              </button>
              <button 
                @click="filterStatus = 'unhealthy'" 
                class="px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
                :class="filterStatus === 'unhealthy' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:text-white hover:bg-blue-400'"
              >
                <StatusIndicator status="unhealthy" />
                Needs Replacement
              </button>
              <button 
                @click="filterStatus = 'healthy'" 
                class="px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
                :class="filterStatus === 'healthy' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:text-white hover:bg-blue-400'"
              >
                <StatusIndicator status="healthy" />
                Healthy
              </button>
              <button 
                @click="filterStatus = 'unknown'" 
                class="px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
                :class="filterStatus === 'unknown' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:text-white hover:bg-blue-400'"
              >
                <StatusIndicator status="unknown" />
                Unknown
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="filteredDevices.length === 0" class="flex items-center justify-center min-h-[200px]">
          <p class="text-gray-600">No devices match the selected filter.</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DeviceItem 
            v-for="device in filteredDevices" 
            :key="device.serialNumber" 
            :device="device"
            class="cursor-pointer"
          />
        </div>
      </div>
    </main>
  </div>
</template>