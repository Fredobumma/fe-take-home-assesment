<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import type { BatteryRecord } from '@/types';
import { parseISO, format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const props = defineProps<{
  records: BatteryRecord[];
  serialNumber: string;
}>();

const deviceRecords = computed(() => {
  return [...props.records]
    .filter(record => record.serialNumber === props.serialNumber)
    .sort((a, b) => parseISO(a.timestamp).getTime() - parseISO(b.timestamp).getTime());
});

const chartData = computed(() => {
  const labels = deviceRecords.value.map(record => 
    format(parseISO(record.timestamp), 'MMM d, HH:mm')
  );
  
  const batteryLevels = deviceRecords.value.map(record => 
    Math.round(record.batteryLevel * 100)
  );
  
  return {
    labels,
    datasets: [
      {
        label: 'Battery Level (%)',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: '#2563EB',
        borderWidth: 2,
        pointBackgroundColor: '#2563EB',
        tension: 0.2,
        data: batteryLevels
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: 'Battery Level (%)'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Time'
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        title: function(tooltipItems: any) {
          const idx = tooltipItems[0].dataIndex;
          const record = deviceRecords.value[idx];
          return format(parseISO(record.timestamp), 'MMMM d, yyyy HH:mm');
        }
      }
    }
  }
};
</script>

<template>
  <div class="bg-white rounded-lg p-4 shadow-sm mb-6">
    <h3 class="text-base font-semibold mb-4">Battery Level History</h3>
    <div class="h-60">
      <Line 
        v-if="deviceRecords.length > 1"
        :data="chartData" 
        :options="chartOptions"
      />
      <div v-else class="h-full flex items-center justify-center text-gray-500 italic">
        Not enough data points to display chart
      </div>
    </div>
  </div>
</template>