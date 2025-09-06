import { useEffect, useState } from "react";
import { db } from "../../services/HitFirebase"; 
import { ref, onValue } from "firebase/database";

interface MoistureDataPoint {
  timestamp: number;
  moisture: number;
}

const HandleMoisture = () => {
  const [moistureData, setMoistureData] = useState<MoistureDataPoint[]>([]);
  const [currentMoisture, setCurrentMoisture] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    const dataRef = ref(db, "/current");
  const unsubscribe = onValue(dataRef, (snapshot) => {
    const val = snapshot.val();
    if (!val) return;

    const moisture = val.moisture ?? 0;
    const ts = Date.now();

    setCurrentMoisture(moisture);
    setLastUpdate(
      new Date(ts).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );

    setMoistureData((prev) => {
      const newData = [...prev, { timestamp: ts, moisture }];
      return newData.slice(-24);
    });
  });

  return () => unsubscribe();
  }, []);

  return { currentMoisture, moistureData, lastUpdate };
};

export default HandleMoisture