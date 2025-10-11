import { useState, useEffect, useRef } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../services/HitFirebase/FirebaseConfig";
import { format, getDaysInMonth } from "date-fns";
import type {
  DailyMoistureData,
  MoistureDataPoint,
  MoistureStatus,
  CacheEntry,
  FetchError,
  HistoryHookResult,
} from "../../types/moisture";

const monthlyCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000;

const getMoistureStatus = (moisture: number): MoistureStatus => {
  if (moisture < 20) return { status: "Sangat Kering", color: "#ef4444" };
  if (moisture < 40) return { status: "Kering", color: "#f97316" };
  if (moisture < 60) return { status: "Baik", color: "#22c55e" };
  return { status: "Lembab", color: "#3b82f6" };
};

const processDayData = (
  dayData: number | { moisture: number; timestamp?: number },
  dateStr: string
): DailyMoistureData | null => {
  if (typeof dayData === 'number') {
    const reading: MoistureDataPoint = { 
      moisture: dayData, 
      timestamp: Date.now()
    };

    return {
      date: dateStr,
      averageMoisture: Math.round(dayData * 100) / 100,
      minMoisture: dayData,
      maxMoisture: dayData,
      readings: [reading],
      status: getMoistureStatus(dayData),
    };
  }
  
  if (dayData && dayData.moisture !== undefined) {
    const moisture = dayData.moisture;
    const timestamp = dayData.timestamp || Date.now();

    const reading: MoistureDataPoint = { moisture, timestamp };

    return {
      date: dateStr,
      averageMoisture: Math.round(moisture * 100) / 100,
      minMoisture: moisture,
      maxMoisture: moisture,
      readings: [reading],
      status: getMoistureStatus(moisture),
    };
  }

  return null;
};

const fetchDayData = async (dateStr: string): Promise<DailyMoistureData | null> => {
  try {
    const dayRef = ref(db, `/soil/history/${dateStr}`);
    const snapshot = await get(dayRef);

    //liat data lewat console, data ? console ada : console ga ada
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log(`Fetched data for ${dateStr}:`, data);
      return processDayData(data, dateStr);
    } else {
      console.log(`No data found for ${dateStr}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching data for ${dateStr}:`, error);
    return null;
  }
};

export const HandleHistory = (
  filterPeriod: "day" | "week" | "month",
  month?: number,
  year?: number
): HistoryHookResult => {
  const [dailyData, setDailyData] = useState<DailyMoistureData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<FetchError[]>([]);
  const [cacheHit, setCacheHit] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
        setLoading(true);
        setErrors([]);
        setCacheHit(false);

        let dateStrings: string[] = [];
        let cacheKey = "";

        if (filterPeriod === "day") {
          if (month && year) {
            const targetDate = new Date(year, month - 1, 1);
            const daysInMonth = getDaysInMonth(targetDate);
            dateStrings = Array.from({ length: daysInMonth }, (_, i) =>
              format(new Date(year, month - 1, i + 1), "yyyy-MM-dd")
            );
            cacheKey = `day-${year}-${month}`;
          } else {
            
            const today = new Date();
            const currentMonth = today.getMonth() + 1;
            const currentYear = today.getFullYear();
            const targetDate = new Date(currentYear, currentMonth - 1, 1);
            const daysInMonth = getDaysInMonth(targetDate);
            dateStrings = Array.from({ length: daysInMonth }, (_, i) =>
              format(new Date(currentYear, currentMonth - 1, i + 1), "yyyy-MM-dd")
            );
            cacheKey = `day-${currentYear}-${currentMonth}`;
          }
        } else if ((filterPeriod === "week" || filterPeriod === "month") && month && year) {
          const targetDate = new Date(year, month - 1, 1);
          const daysInMonth = getDaysInMonth(targetDate);
          dateStrings = Array.from({ length: daysInMonth }, (_, i) =>
            format(new Date(year, month - 1, i + 1), "yyyy-MM-dd")
          );
          cacheKey = `${filterPeriod}-${year}-${month}`;
        }

        const cachedEntry = monthlyCache.get(cacheKey);
        if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_DURATION) {
          setDailyData(cachedEntry.data);
          setCacheHit(true);
          setLoading(false);
          return;
        }

        console.log(`Fetching data for dates:`, dateStrings);
        const results = await Promise.all(
          dateStrings.map(async (dateStr) => {
            if (signal.aborted) return null;
            try {
              return await fetchDayData(dateStr);
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : "Unknown error";
              console.error(`Error fetching ${dateStr}:`, error);
              setErrors((prev) => [...prev, { date: dateStr, error: errorMessage }]);
              return null;
            }
          })
        );

        if (signal.aborted) return;

        const validData = results.filter(
          (data): data is DailyMoistureData => data !== null
        );

        console.log(`Valid data found:`, validData.length, 'out of', results.length);

        if (cacheKey && validData.length > 0) {
          monthlyCache.set(cacheKey, {
            data: validData,
            timestamp: Date.now(),
            month: month || new Date().getMonth() + 1,
            year: year || new Date().getFullYear(),
          });
        }

        setDailyData(validData);
      } catch (error) {
        if (!signal.aborted) {
          console.error("Error fetching data:", error);
          setErrors((prev) => [
            ...prev,
            {
              date: "general",
              error: error instanceof Error ? error.message : "Unknown error",
            },
          ]);
        }
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    fetchData();
    return () => abortControllerRef.current?.abort();
  }, [filterPeriod, month, year]);

  return { dailyData, loading, errors, cacheHit };
};

export default HandleHistory;