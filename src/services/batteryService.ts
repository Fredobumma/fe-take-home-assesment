import { BatteryRecord, SchoolSummary } from '../types';
import { processBatteryData } from '../utils/batteryCalculator';

class BatteryService {
  private dataUrl = '/battery-data.json';
  
  /**
   * Fetch battery data from the JSON file
   * In a real API, this would include authentication and error handling
   */
  async fetchBatteryData(): Promise<BatteryRecord[]> {
    try {
      const response = await fetch(this.dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch battery data: ${response.statusText}`);
      }
      return await response.json() as BatteryRecord[];
    } catch (error) {
      console.error('Error fetching battery data:', error);
      throw error;
    }
  }

  /**
   * Get processed school summaries with battery health information
   */
  async getSchoolSummaries(): Promise<SchoolSummary[]> {
    const data = await this.fetchBatteryData();
    return processBatteryData(data);
  }

  /**
   * Get detailed information for a specific school
   * @param academyId School ID
   */
  async getSchoolDetail(academyId: number): Promise<SchoolSummary | undefined> {
    const summaries = await this.getSchoolSummaries();
    return summaries.find(school => school.academyId === academyId);
  }
}

// Create a singleton instance
export const batteryService = new BatteryService();