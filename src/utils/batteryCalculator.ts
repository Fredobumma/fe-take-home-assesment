import type { BatteryRecord, DeviceBatteryHealth, SchoolSummary } from '@/types';
import { parseISO, differenceInHours } from 'date-fns';

// A battery is considered unhealthy if it uses more than 30% per day on average
const UNHEALTHY_THRESHOLD = 0.3;

/**
 * Calculate battery consumption rate between two measurements
 * @param start Starting measurement
 * @param end Ending measurement
 * @returns Hourly consumption rate or null if charged
 */
export function calculateHourlyConsumption(
  start: BatteryRecord,
  end: BatteryRecord
): number | null {
  // If battery level increased, the device was charged - exclude from calculation
  if (end.batteryLevel > start.batteryLevel) {
    return null;
  }

  const startTime = parseISO(start.timestamp);
  const endTime = parseISO(end.timestamp);

  // Calculate hours between measurements
  const hoursDiff = differenceInHours(endTime, startTime);

  // Avoid division by zero
  if (hoursDiff === 0) {
    return null;
  }

  // Calculate hourly consumption rate
  const levelDiff = start.batteryLevel - end.batteryLevel;
  return levelDiff / hoursDiff;
}

/**
 * Calculate average daily consumption for a device
 * @param records Array of battery records for a device, sorted by timestamp
 * @returns Average daily consumption rate
 */
export function calculateAvgDailyConsumption(records: BatteryRecord[]): number | null {
  if (records.length <= 1) {
    return null; // Cannot calculate with just one record
  }

  // Sort records by timestamp (ascending)
  const sortedRecords = [...records].sort(
    (a, b) => parseISO(a.timestamp).getTime() - parseISO(b.timestamp).getTime()
  );

  let totalConsumption = 0;
  let validIntervals = 0;

  // Calculate consumption for each interval
  for (let i = 0; i < sortedRecords.length - 1; i++) {
    const hourlyRate = calculateHourlyConsumption(sortedRecords[i], sortedRecords[i + 1]);

    if (hourlyRate !== null) {
      totalConsumption += hourlyRate;
      validIntervals++;
    }
  }

  // If no valid intervals were found, return null
  if (validIntervals === 0) {
    return null;
  }

  // Calculate average hourly consumption and convert to daily rate
  const avgHourlyConsumption = totalConsumption / validIntervals;
  return avgHourlyConsumption * 24; // Convert to daily rate
}

/**
 * Process raw battery data and calculate health metrics
 * @param data Raw battery records
 * @returns Processed school summaries with device health
 */
export function processBatteryData(data: BatteryRecord[]): SchoolSummary[] {
  // Group records by school
  const schoolMap = new Map<number, BatteryRecord[]>();
  data.forEach((record) => {
    if (!schoolMap.has(record.academyId)) {
      schoolMap.set(record.academyId, []);
    }
    schoolMap.get(record.academyId)?.push(record);
  });

  // Process each school's data
  const schoolSummaries: SchoolSummary[] = [];

  schoolMap.forEach((schoolRecords, academyId) => {
    // Group by device
    const deviceMap = new Map<string, BatteryRecord[]>();
    schoolRecords.forEach((record) => {
      if (!deviceMap.has(record.serialNumber)) {
        deviceMap.set(record.serialNumber, []);
      }
      deviceMap.get(record.serialNumber)?.push(record);
    });

    // Process each device
    const devices: DeviceBatteryHealth[] = [];
    let unhealthyCount = 0;
    let healthyCount = 0;
    let unknownCount = 0;

    deviceMap.forEach((deviceRecords, serialNumber) => {
      // Sort records by timestamp (ascending)
      const sortedRecords = [...deviceRecords].sort(
        (a, b) => parseISO(a.timestamp).getTime() - parseISO(b.timestamp).getTime()
      );

      const lastRecord = sortedRecords[sortedRecords.length - 1];
      const avgDailyConsumption = calculateAvgDailyConsumption(sortedRecords);

      // Determine device health status
      let status: 'healthy' | 'unhealthy' | 'unknown';
      let needsReplacement = false;

      if (avgDailyConsumption === null) {
        status = 'unknown';
        unknownCount++;
      } else if (avgDailyConsumption > UNHEALTHY_THRESHOLD) {
        status = 'unhealthy';
        needsReplacement = true;
        unhealthyCount++;
      } else {
        status = 'healthy';
        healthyCount++;
      }

      devices.push({
        serialNumber,
        lastEmployee: lastRecord.employeeId,
        lastBatteryLevel: lastRecord.batteryLevel,
        avgDailyConsumption,
        needsReplacement,
        measurementCount: sortedRecords.length,
        status,
        lastUpdated: lastRecord.timestamp
      });
    });

    // Sort devices by health status (unhealthy first)
    devices.sort((a, b) => {
      if (a.status === 'unhealthy' && b.status !== 'unhealthy') return -1;
      if (a.status !== 'unhealthy' && b.status === 'unhealthy') return 1;
      return 0;
    });

    schoolSummaries.push({
      academyId,
      deviceCount: devices.length,
      unhealthyCount,
      healthyCount,
      unknownCount,
      devices
    });
  });

  // Sort schools by unhealthy device count (descending)
  return schoolSummaries.sort((a, b) => b.unhealthyCount - a.unhealthyCount);
}
