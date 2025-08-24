import { useEffect, useState } from "react";

interface MoistureDataPoint {
  timestamp: number;
  moisture: number;
}

export const HandleMoisture = () => {
  const [moistureData, setMoistureData] = useState<MoistureDataPoint[]>([]);
  const [currentMoisture, setCurrentMoisture] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const newMoisture = Math.floor(Math.random() * 71);
      const now = Date.now();

      setCurrentMoisture(newMoisture);
      setLastUpdate(
        new Date(now).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );

      setMoistureData(prev => {
        const newData = [...prev, { timestamp: now, moisture: newMoisture }];
        return newData.slice(-24);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return { currentMoisture, moistureData, lastUpdate };
};
