// Real data structure from Firebase
export interface MoistureDataPoint {
  timestamp: number;
  moisture: number;
}

export interface DailyMoistureData {
  date: string;
  averageMoisture: number;
  minMoisture: number;
  maxMoisture: number;
  readings: MoistureDataPoint[];
}

export interface WeeklyMoistureData extends DailyMoistureData {
  weekNumber: number;
}

export type FilterPeriod = 'day' | 'week' | 'month';

export interface FilterOptions {
  period: FilterPeriod;
  startDate?: Date;
  endDate?: Date;
  month?: number;
  year?: number;
}
