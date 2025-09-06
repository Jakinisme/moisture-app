import { useState, useEffect, useRef } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../services/HitFirebase/FirebaseConfig";
import { 
  format, 
  getDaysInMonth
} from "date-fns";
import type { 
  TimeInterval,
  DailyMoistureData,
  MoistureDataPoint,
  MoistureStatus,
  CacheEntry,
  FetchError,
  HistoryHookResult,
  FirebaseDayData
} from "../../types/moisture";

const monthlyCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000;

const getMoistureStatus = (moisture: number): MoistureStatus => {
  if (moisture < 20) return { status: 'Sangat Kering', color: '#ef4444' };
  if (moisture < 40) return { status: 'Kering', color: '#f97316' };
  if (moisture < 60) return { status: 'Baik', color: '#22c55e' };
  return { status: 'Lembab', color: '#3b82f6' };
};

const processDayData = (dayData: FirebaseDayData | null, dateStr: string): DailyMoistureData | null => {
  if (!dayData || typeof dayData !== 'object') return null;
  
  const readings: MoistureDataPoint[] = [];
  
  const hourKeys = Object.keys(dayData).filter(key => 
    /^\d{2}$/.test(key) && parseInt(key) >= 0 && parseInt(key) <= 23
  );
  
  if (hourKeys.length > 0) {
    for (const hour of hourKeys) {
      if (dayData[hour] && dayData[hour].timestamp && dayData[hour].moisture !== undefined) {
        readings.push({
          timestamp: dayData[hour].timestamp,
          moisture: dayData[hour].moisture
        });
      }
    }
  } else {
    const timeSlots: TimeInterval[] = ['00', '06', '12', '18'];
    for (const slot of timeSlots) {
      if (dayData[slot] && dayData[slot].timestamp && dayData[slot].moisture !== undefined) {
        readings.push({
          timestamp: dayData[slot].timestamp,
          moisture: dayData[slot].moisture
        });
      }
    }
  }
  
  if (readings.length === 0) return null;
  
  const moistureValues = readings.map(r => r.moisture);
  const averageMoisture = moistureValues.reduce((a, b) => a + b, 0) / moistureValues.length;
  const minMoisture = Math.min(...moistureValues);
  const maxMoisture = Math.max(...moistureValues);
  
  return {
    date: dateStr,
    averageMoisture: Math.round(averageMoisture * 100) / 100,
    minMoisture: Math.round(minMoisture * 100) / 100,
    maxMoisture: Math.round(maxMoisture * 100) / 100,
    readings,
    status: getMoistureStatus(averageMoisture)
  };
};

const fetchDayData = async (dateStr: string): Promise<DailyMoistureData | null> => {
  try {
    const dayRef = ref(db, `soil/history/${dateStr}`);
    const snapshot = await get(dayRef);
    
    if (snapshot.exists()) {
      return processDayData(snapshot.val(), dateStr);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching data for ${dateStr}:`, error);
    return null;
  }
};

export const HandleHistory = (filterPeriod: 'day' | 'week' | 'month', month?: number, year?: number): HistoryHookResult => {
  const [dailyData, setDailyData] = useState<DailyMoistureData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<FetchError[]>([]);
  const [cacheHit, setCacheHit] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      
      try {
        setLoading(true);
        setErrors([]);
        setCacheHit(false);
        
        let dateStrings: string[] = [];
        let cacheKey = '';
        
        if (filterPeriod === 'day') {
          const today = new Date();
          const currentYear = today.getFullYear();
          const currentMonth = today.getMonth() + 1;
          const currentDay = today.getDate();
          const daysInMonth = getDaysInMonth(today);
          
          dateStrings = Array.from({ length: daysInMonth - currentDay + 1 }, (_, i) => 
            format(new Date(currentYear, currentMonth - 1, currentDay + i), 'yyyy-MM-dd')
          );
          cacheKey = `day-${format(today, 'yyyy-MM')}`;
        } else if (filterPeriod === 'week' && month && year) {
          const targetDate = new Date(year, month - 1, 1);
          const daysInMonth = getDaysInMonth(targetDate);
          dateStrings = Array.from({ length: daysInMonth }, (_, i) => 
            format(new Date(year, month - 1, i + 1), 'yyyy-MM-dd')
          );
          cacheKey = `month-${year}-${month}`;
        } else if (filterPeriod === 'month' && month && year) {
          const targetDate = new Date(year, month - 1, 1);
          const daysInMonth = getDaysInMonth(targetDate);
          dateStrings = Array.from({ length: daysInMonth }, (_, i) => 
            format(new Date(year, month - 1, i + 1), 'yyyy-MM-dd')
          );
          cacheKey = `month-${year}-${month}`;
        }

        const cachedEntry = monthlyCache.get(cacheKey);
        if (cachedEntry && (Date.now() - cachedEntry.timestamp) < CACHE_DURATION) {
          setDailyData(cachedEntry.data);
          setCacheHit(true);
          setLoading(false);
          return;
        }

        const fetchPromises = dateStrings.map(async (dateStr) => {
          if (signal.aborted) return null;
          
          try {
            return await fetchDayData(dateStr);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setErrors(prev => [...prev, { date: dateStr, error: errorMessage }]);
            return null;
          }
        });

        const results = await Promise.all(fetchPromises);
        
        if (signal.aborted) return;
        
        const validData = results.filter((data): data is DailyMoistureData => data !== null);
        
        if (cacheKey && validData.length > 0) {
          monthlyCache.set(cacheKey, {
            data: validData,
            timestamp: Date.now(),
            month: month || new Date().getMonth() + 1,
            year: year || new Date().getFullYear()
          });
        }
        
        setDailyData(validData);
      } catch (error) {
        if (!signal.aborted) {
          console.error("Error fetching data:", error);
          setErrors(prev => [...prev, { 
            date: 'general', 
            error: error instanceof Error ? error.message : 'Unknown error' 
          }]);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [filterPeriod, month, year]);

  return {
    dailyData,
    loading,
    errors,
    cacheHit,
  };
};


export default HandleHistory;