
export interface MoistureReading {
  moisture: number;
  timestamp: number;
}

export interface TimeSlotData {
  "00": MoistureReading;
  "06": MoistureReading;
  "12": MoistureReading;
  "18": MoistureReading;
}


export interface HourlyMoistureData {
  [hour: string]: MoistureReading;
}

export interface DailyHistoryData {
  [date: string]: TimeSlotData;
}

export interface DailyHistoryData24h {
  [date: string]: HourlyMoistureData;
}

export interface SoilData {
  current: MoistureReading;
  history: DailyHistoryData;
}

export interface SoilData24h {
  current: MoistureReading;
  history: DailyHistoryData24h;
}

export interface FirebaseSoilData {
  soil: SoilData;
}

export interface FirebaseSoilData24h {
  soil: SoilData24h;
}

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
  status?: MoistureStatus;
}

export interface MoistureStatus {
  status: string;
  color: string;
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

export type TimeInterval = '00' | '06' | '12' | '18';
export type TimeIntervalHours = 0 | 6 | 12 | 18;

export type HourInterval = '00' | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | '23';

export interface CacheEntry {
  data: DailyMoistureData[];
  timestamp: number;
  month: number;
  year: number;
}

export interface FetchError {
  date: string;
  error: string;
}

export interface HistoryHookResult {
  dailyData: DailyMoistureData[];
  loading: boolean;
  errors: FetchError[];
  cacheHit: boolean;
}

export interface FirebaseDayData {
  [hour: string]: {
    timestamp: number;
    moisture: number;
  };
}