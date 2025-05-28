import { defineStore } from 'pinia';
import { batteryService } from '@/services/batteryService';
import type { SchoolSummary } from '@/types';

export const useBatteryStore = defineStore('battery', {
  state: () => ({
    schools: [] as SchoolSummary[],
    selectedSchool: null as SchoolSummary | null,
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    totalUnhealthyDevices: (state) => {
      return state.schools.reduce((total, school) => total + school.unhealthyCount, 0);
    },
    
    schoolsRanked: (state) => {
      return [...state.schools].sort((a, b) => b.unhealthyCount - a.unhealthyCount);
    },
    
    highPrioritySchools: (state) => {
      return state.schools.filter(school => school.unhealthyCount > 0);
    }
  },
  
  actions: {
    async fetchSchools() {
      this.loading = true;
      this.error = null;
      
      try {
        this.schools = await batteryService.getSchoolSummaries();
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to load schools';
        console.error('Error fetching schools:', err);
      } finally {
        this.loading = false;
      }
    },
    
    async selectSchool(academyId: number) {
      // First check if we already have this school in our store
      const existing = this.schools.find(school => school.academyId === academyId);
      if (existing) {
        this.selectedSchool = existing;
        return;
      }
      
      // Otherwise fetch from service
      this.loading = true;
      this.error = null;
      
      try {
        const school = await batteryService.getSchoolDetail(academyId);
        if (school) {
          this.selectedSchool = school;
        } else {
          this.error = `School with ID ${academyId} not found`;
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to load school details';
        console.error('Error fetching school details:', err);
      } finally {
        this.loading = false;
      }
    },
    
    clearSelectedSchool() {
      this.selectedSchool = null;
    }
  }
});