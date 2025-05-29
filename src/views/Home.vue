<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBatteryStore } from '@/store/batteryStore';
import SchoolCard from '@/components/SchoolCard.vue';

const batteryStore = useBatteryStore();
const router = useRouter();
const isLoading = ref(true);
const searchQuery = ref('');

onMounted(async () => {
  await batteryStore.fetchSchools();
  isLoading.value = false;
});

function viewSchoolDetails(academyId: number) {
  router.push({ name: 'school', params: { id: academyId.toString() } });
}

const filteredSchools = computed(() => {
  if (!searchQuery.value) {
    return batteryStore.schoolsRanked;
  }

  const query = searchQuery.value.toLowerCase();
  return batteryStore.schoolsRanked.filter((school) => school.academyId.toString().includes(query));
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-blue-600 text-white py-8">
      <div class="max-w-7xl mx-auto px-6">
        <h1 class="text-3xl font-bold mb-2">Battery Health Dashboard</h1>
        <p class="text-blue-100 mb-6">
          Monitor school tablet batteries and prioritize replacements
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 md:max-w-xl gap-6">
          <div class="bg-white/10 rounded-lg p-4">
            <div class="text-3xl font-bold mb-1">{{ batteryStore.schools.length }}</div>
            <div class="text-sm text-blue-100">Schools</div>
          </div>

          <div class="bg-amber-500 rounded-lg p-4">
            <div class="text-3xl font-bold mb-1">{{ batteryStore.totalUnhealthyDevices }}</div>
            <div class="text-sm text-amber-100">Need Attention</div>
          </div>

          <div class="bg-blue-700 rounded-lg p-4">
            <div class="text-3xl font-bold mb-1">{{ batteryStore.highPrioritySchools.length }}</div>
            <div class="text-sm text-blue-100">Priority Schools</div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 class="text-2xl font-semibold">Schools by Priority</h2>

        <div class="w-full sm:w-80">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search school number..."
            class="w-full px-4 py-2 bg-transparent rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[200px]">
        <div
          class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"
        ></div>
        <p class="text-gray-600">Loading school data...</p>
      </div>

      <div
        v-else-if="batteryStore.error"
        class="flex flex-col items-center justify-center min-h-[200px] text-center"
      >
        <p class="text-gray-600 mb-4">{{ batteryStore.error }}</p>
        <button
          @click="batteryStore.fetchSchools"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>

      <div
        v-else-if="filteredSchools.length === 0"
        class="flex items-center justify-center min-h-[200px]"
      >
        <p class="text-gray-600">No schools match your search criteria.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SchoolCard
          v-for="school in filteredSchools"
          :key="school.academyId"
          :school="school"
          @view-details="viewSchoolDetails"
        />
      </div>
    </main>
  </div>
</template>
