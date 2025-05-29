import { describe, it, expect } from 'vitest';
import { calculateHourlyConsumption, calculateAvgDailyConsumption } from '../../utils/batteryCalculator';
import { BatteryRecord } from '../../types';

describe('batteryCalculator', () => {
  describe('calculateHourlyConsumption', () => {
    it('should calculate hourly consumption correctly', () => {
      const start: BatteryRecord = {
        academyId: 1,
        batteryLevel: 1.0,
        employeeId: 'T1',
        serialNumber: 'S1',
        timestamp: '2024-02-20T10:00:00Z'
      };
      
      const end: BatteryRecord = {
        academyId: 1,
        batteryLevel: 0.8,
        employeeId: 'T1',
        serialNumber: 'S1',
        timestamp: '2024-02-20T12:00:00Z'
      };
      
      const result = calculateHourlyConsumption(start, end);
      expect(result).toBeCloseTo(0.1, 5); // Using toBeCloseTo to handle floating-point precision
    });

    it('should return null when battery level increases (charging)', () => {
      const start: BatteryRecord = {
        academyId: 1,
        batteryLevel: 0.5,
        employeeId: 'T1',
        serialNumber: 'S1',
        timestamp: '2024-02-20T10:00:00Z'
      };
      
      const end: BatteryRecord = {
        academyId: 1,
        batteryLevel: 0.8,
        employeeId: 'T1',
        serialNumber: 'S1',
        timestamp: '2024-02-20T12:00:00Z'
      };
      
      const result = calculateHourlyConsumption(start, end);
      expect(result).toBeNull();
    });
  });

  describe('calculateAvgDailyConsumption', () => {
    it('should calculate average daily consumption', () => {
      const records: BatteryRecord[] = [
        {
          academyId: 1,
          batteryLevel: 1.0,
          employeeId: 'T1',
          serialNumber: 'S1',
          timestamp: '2024-02-20T00:00:00Z'
        },
        {
          academyId: 1,
          batteryLevel: 0.5,
          employeeId: 'T1',
          serialNumber: 'S1',
          timestamp: '2024-02-20T12:00:00Z'
        }
      ];
      
      const result = calculateAvgDailyConsumption(records);
      expect(result).toBe(1); // 50% drop over 12 hours = 100% per day
    });

    it('should return null for single record', () => {
      const records: BatteryRecord[] = [
        {
          academyId: 1,
          batteryLevel: 1.0,
          employeeId: 'T1',
          serialNumber: 'S1',
          timestamp: '2024-02-20T00:00:00Z'
        }
      ];
      
      const result = calculateAvgDailyConsumption(records);
      expect(result).toBeNull();
    });
  });
});