import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../../services/HitFirebase/FirebaseConfig';

interface MoistureDataPoint {
  timestamp: number;
  moisture: number;
}

interface DailyMoistureData {
  date: string;
  averageMoisture: number;
  minMoisture: number;
  maxMoisture: number;
  readings: MoistureDataPoint[];
}

export const HandleHistory = () => {
  const [historicalData, setHistoricalData] = useState<MoistureDataPoint[]>([]);
  const [dailyData, setDailyData] = useState<DailyMoistureData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const dataRef = ref(db, "/");
    
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      if (!val) {
        const sampleData = generateSampleData();
        setHistoricalData(sampleData);
        setLoading(false);
        return;
      }

      const moisture = val.soil?.moisture ?? 0;
      const timestamp = Date.now();

      setHistoricalData((prev) => {
        const newData = [...prev, { timestamp, moisture }];
        return newData.slice(-720);
      });

      setLoading(false);
    });

    return () => {
      off(dataRef, 'value', unsubscribe);
    };
  }, []);

  useEffect(() => {
    if (historicalData.length === 0) return;

    const processedData = processDataIntoDays(historicalData);
    setDailyData(processedData);
  }, [historicalData]);

  return { 
    historicalData, 
    dailyData, 
    loading,
    processDataIntoDays 
  };
};

const processDataIntoDays = (data: MoistureDataPoint[]): DailyMoistureData[] => {
  const dailyMap = new Map<string, MoistureDataPoint[]>();

  data.forEach((point) => {
    const date = new Date(point.timestamp);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, []);
    }
    dailyMap.get(dateKey)!.push(point);
  });

  const dailyData: DailyMoistureData[] = Array.from(dailyMap.entries())
    .map(([date, readings]) => {
      const moistureValues = readings.map(r => r.moisture);
      const averageMoisture = moistureValues.reduce((sum, val) => sum + val, 0) / moistureValues.length;
      const minMoisture = Math.min(...moistureValues);
      const maxMoisture = Math.max(...moistureValues);

      return {
        date,
        averageMoisture: Math.round(averageMoisture * 100) / 100,
        minMoisture: Math.round(minMoisture * 100) / 100,
        maxMoisture: Math.round(maxMoisture * 100) / 100,
        readings: readings.sort((a, b) => a.timestamp - b.timestamp)
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return dailyData;
};

//buat sample data jika firebase kosong
const generateSampleData = (): MoistureDataPoint[] => {
  const sampleData: MoistureDataPoint[] = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    for (let hour = 0; hour < 24; hour += 6) {
      const readingTime = new Date(date);
      readingTime.setHours(hour, 0, 0, 0);
      
      const baseMoisture = 45 + Math.sin(i * 0.2) * 10;
      const hourVariation = Math.sin(hour * 0.3) * 5;
      const randomVariation = (Math.random() - 0.5) * 10;
      
      const moisture = Math.max(30, Math.min(70, baseMoisture + hourVariation + randomVariation));
      
      sampleData.push({
        timestamp: readingTime.getTime(),
        moisture: Math.round(moisture * 100) / 100
      });
    }
  }
  
  return sampleData;
};

export default HandleHistory;
