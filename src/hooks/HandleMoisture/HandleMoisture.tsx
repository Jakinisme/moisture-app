import {useState, useEffect} from 'react'

interface MoistureDataPoint {
  timestamp: string;
  moisture: number;
}

const HandleMoisture = () => {
  const [moistureData, setMoistureData] = useState<MoistureDataPoint[]>([]);
  const [currentMoisture, setCurrentMoisture] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const newMoisture = Math.floor(Math.random() * 71);
      const now = new Date();
      const timeString = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      setCurrentMoisture(newMoisture);
      setLastUpdate(timeString);
      setMoistureData(prev => {
        const newData = [...prev, { timestamp: timeString, moisture: newMoisture }];
        return newData.slice(-24);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return { currentMoisture, moistureData, lastUpdate };
};

export default HandleMoisture
