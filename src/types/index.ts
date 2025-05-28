export interface BatteryRecord {
  academyId: number;
  batteryLevel: number;
  employeeId: string;
  serialNumber: string;
  timestamp: string;
}

export interface DeviceBatteryHealth {
  serialNumber: string;
  lastEmployee: string;
  lastBatteryLevel: number;
  avgDailyConsumption: number | null;
  needsReplacement: boolean;
  measurementCount: number;
  status: 'healthy' | 'unhealthy' | 'unknown';
  lastUpdated: string;
}

export interface SchoolSummary {
  academyId: number;
  deviceCount: number;
  unhealthyCount: number;
  healthyCount: number;
  unknownCount: number;
  devices: DeviceBatteryHealth[];
}